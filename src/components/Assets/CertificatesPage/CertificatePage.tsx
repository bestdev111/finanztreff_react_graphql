import {useQuery} from '@apollo/client';
import {GET_ASSET_PAGE} from "../../../graphql/query";
import {Link, useLocation, useParams} from 'react-router-dom';
import {PageBannerComponent} from "../../common";
import {Col, Container, Row, Spinner} from "react-bootstrap";
import React, {useEffect, useRef, useState} from "react";
import {AssetGroup, CalculationPeriod, Query} from "../../../generated/graphql";
import InvestmentIdea from "../Derivatives/components/InvestmentIdea";
import TradeInformation from "../Derivatives/components/TradeInformation";
import EmissionsInformation from "../Derivatives/components/EmissionsInformation";
import AlternativesTo from "../Derivatives/components/AlternativesTo";
import MatchingProducts from "../Derivatives/components/MatchingProducts";
import PerformanceComparison from "../Derivatives/components/PerformanceComparison";
import UnderlyingVSWarrant from "../Derivatives/components/UnderlyingVsWarrant";
import {getSecurity,} from "../Derivatives/components/WarrantCharacteristics";
import {Underlying} from "../Derivatives/components/Underlying";
import AlternativesFromUBS from "../Derivatives/components/AlternativesFromUBS";
import {loader} from "graphql.macro";
import moment from "moment";
import {CertificateTypeName, computeDueToCss, extractQuotes, formatDate, getInstrumentIdByExchnageCode, numberFormatDecimals} from "../../../utils";
import WarrantCharacteristicsContainer, {
    getDerivativeKeyFiguresValueWithPerc
} from "./WarrantCharacteristicsContainer";
import {
    PortfolioOverviewInPortraitComponent
} from 'components/common/PortfolioOverviewInPortraitComponent/PortfolioOverviewInPortraitComponent';
import {MostTradedAssets} from 'components/Home/HotSection/UserStatistics/HostSectionAdvertisement';
import {Helmet} from "react-helmet";
import { guessInfonlineSection, trigInfonline } from 'components/common/InfonlineService';
import { Page404 } from 'components/common/page404/Page404';
import { AdditionalInformationSection, AdditionalInformationSectionModals } from 'components/common/asset/AdditionalInformationSection/AdditionalInformationSection';
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from 'components/common/TargetingService';
import keycloak from 'keycloak';
import { HorizontalNaviationBar } from 'components/common/horizontal-navigation-bar/HorizontalNaviationBar';
import { getAssetForUrl } from 'components/profile/utils';

const assetGroup = AssetGroup.Cert;

interface Child {
    changeInstrument: (id: number) => void;
}
export const CertificatePage = () => {
    const {seoTag} = useParams<{ seoTag: string }>();
    const [header, setHeader] = useState<string>('')
    const [snapQuote, setSnapQuote] = useState<number | null>()
    const [koStatus, setKoStatus]=useState<string>("")
    const [assetClassValue, setAssetClassValue] = useState<string>("")
    const [assetTypeValue, setAssetTypeValue] = useState<string>("")
    const [factorDefaultString , setFactorDefaultString]  = useState<string>('');
    const [defaultString, setDefaultString] = useState<string>('');
    const [v2, setV2] = useState('');
    const [v3, setV3] = useState('');
    const [v4, setV4] = useState('');

    const asset = useQuery(GET_ASSET_PAGE, {
        variables: {seoTag: seoTag},
    });

    const pathParam = useParams<{ seoTag: string }>();

    const location = useLocation();
    let childRef = useRef<Child>();
    let childRefPred = useRef<Child>();

    const instrumentChange = (instrumentId: number) => {
        if (childRef && childRef.current) {
            childRef.current.changeInstrument(instrumentId);
        }
        if (childRefPred && childRefPred.current) {
            childRefPred.current.changeInstrument(instrumentId);
        }
    };

    useEffect(() => {
        trigInfonline('zertificate_portrait', 'portrait')
    }, [])

    const data = useQuery<Query>(loader('./getCertificatePage.graphql'), {
        skip: asset.loading || (!asset.loading && asset.data.assetPage.assetGroup !== assetGroup),
        variables: {groupId: asset.data?.assetPage?.groupId},
    });
    const keyFiguresData = useQuery<Query>(loader('../Derivatives/getWarrantKeyfigures.graphql'), {
        skip: asset.loading || data.loading || !data.data?.group?.id,
        variables: {
            groupId: data.data?.group?.id
        }
    });
    const warrantStaticData = useQuery<Query>(loader('../Derivatives/getWarrantStaticData.graphql'), {
        skip: asset.loading || data.loading || !data.data?.group?.id,
        variables: {
            groupId: data.data?.group?.id
        }
    })

    const underlyingProductsData = useQuery<Query>(loader('../Derivatives/getDerivativeUnderlyingProducts.graphql'), {
        skip: asset.loading || data.loading || !data.data?.group?.id,
        variables: {
            groupId: data.data?.group?.id
        }
    })

    const derivativePerformanceCompareData = useQuery<Query>(loader('../Derivatives/getDerivativePerformanceCompare.graphql'), {
        skip: asset.loading || data.loading || !data.data?.group?.id,
        variables: {
            groupId: data.data?.group?.id
        }
    })

    const refundScenario = useQuery<Query>(loader('../Derivatives/getRefundRelativeScenario.graphql'), {
        skip: asset.loading || data.loading || !data.data?.group?.id,
        variables: {
            groupId: data.data?.group?.id
        }
    })

    let displayCode = keyFiguresData?.data?.group?.main?.currency?.displayCode;
    let maturityDate = keyFiguresData?.data?.group?.derivative?.maturityDate;
    let {trade} = extractQuotes(keyFiguresData?.data?.group?.underlyings?.[0] && keyFiguresData?.data?.group?.underlyings[0]?.instrument?.snapQuote)
    let dueTo: number | null = null;
    let warrantGroupId
    let underlying

    if(warrantStaticData.data){
        warrantGroupId = warrantStaticData.data.group
    }
    if(underlyingProductsData.data){
        underlying = underlyingProductsData.data.group
    }

    useEffect(() => {
        let maturityDate = moment(keyFiguresData?.data?.group?.derivative?.maturityDate);
        dueTo = maturityDate.diff(moment(), 'd') + 1;
        if (!keyFiguresData?.data?.group?.derivative?.maturityDate || isNaN(dueTo)) {
            setDefaultString("Dieses Zertifikat hat sein Fälligkeitsdatum überschritten und ist nicht mehr aktiv!");
        } else {
            if (dueTo < 0 && assetClassname === CertificateTypeName.Faktor) {
                setFactorDefaultString('Dieser Faktor hat sein Fälligkeitsdatum überschritten und ist nicht mehr aktiv!');

            } else if (dueTo < 0) {
                setDefaultString('Dieses Zertifikat hat sein Fälligkeitsdatum überschritten und ist nicht mehr aktiv!');
            } else {
                setDefaultString(`Dieses Zertifikat verfällt in ${dueTo} Tagen. `);
            }
        }
    }, [keyFiguresData?.data?.group?.derivative?.maturityDate, dueTo])

    useEffect(() => {
        if (keyFiguresData?.data?.group?.underlyings) setSnapQuote(data.data?.group?.main?.snapQuote?.lastPrice)
    }, [data.data?.group?.main?.snapQuote?.lastPrice, keyFiguresData?.data, snapQuote])

    const id = data.data?.group?.assetType?.id;
    const typename = data.data?.group?.assetType?.name;
    const typeId = data.data?.group?.assetType?.id;
    const assetClassname = data.data?.group?.assetClass?.name;

    useEffect(()=> {
        if (!keyFiguresData?.data?.group?.derivative?.maturityDate) {
            setKoStatus("Dieses Zertifikat ist ein Open End Zertifikat.");
        }  else {
            setKoStatus("Dieser Knock-out verfällt in " + dueTo + " Tagen.")
        }
    }, [keyFiguresData?.data?.group?.derivative?.maturityDate, koStatus, dueTo]);

    useEffect(() => {
        const contents = data.data?.group?.content;
        const main = data.data?.group?.main;
        const derivative = data.data?.group?.derivative;
        let oneYearPerformancePerc = '?';
        let maxRendite = '?';
        let _maturityDate = 'Open End';

        if(contents) {
           for(let i = 0; i < contents.length; i++) {
               const content = contents[i];
               if(content.main) {
                   content.performance?.forEach(
                       p => {
                           if(p.period === CalculationPeriod.Week52) {
                               oneYearPerformancePerc = numberFormatDecimals(p.performance, 2, 2, '%');
                           }
                       }
                   )
               }
           }
        }

        if(derivative?.maturityDate) {
            _maturityDate = formatDate(derivative.maturityDate);
        }

        maxRendite = getDerivativeKeyFiguresValueWithPerc(data.data?.group?.main?.derivativeKeyFigures, 'maxAnnualReturn');
        const barriereAbs = getSecurity(data.data?.group?.underlyings);
        const bRenditePerc = getDerivativeKeyFiguresValueWithPerc(data.data?.group?.main?.derivativeKeyFigures, 'bonusReturn');

        switch (assetClassname) {
            case CertificateTypeName.Faktor:
                setHeader(` ${factorDefaultString} Bei einem aktuellen Kaufkurs ${snapQuote} ${displayCode} können Sie bis zur Fälligkeit dieses Zertifikates am ${formatDate(maturityDate)} eine maximale Rendite p.a von ${trade?.percentChange}% erzielen.`)
                setAssetClassValue("Faktor")
                setAssetTypeValue("Zertifikate")
                break;
            case CertificateTypeName.Index:
                if (!maturityDate) {
                    setHeader(koStatus)
                    setAssetTypeValue("Index")
                    setAssetClassValue("Zertifikat")
                } else {
                    setHeader(`${defaultString} Dieses Zertifikat verfällt in ${dueTo} Tagen. Mit diesem Zertifikat hätten Sie eine Performance von ${oneYearPerformancePerc} erzielt, 
                    wenn Sie es vor einem Jahr gekauft hätten.`)
                    setAssetTypeValue("Index")
                    setAssetClassValue("Zertifikat")
                }
                break;
            case CertificateTypeName.Aktienanleihe:
                setHeader(`${defaultString} Bei einem aktuellen Kaufkurs von ${snapQuote}% können Sie unter Berücksichtigung der Stückzinsen bis 
                zur Fälligkeit dieses Zertifikates am ${formatDate(maturityDate)} eine maximale Rendite p.a. von ${maxRendite} erzielen.`)
                setAssetTypeValue("Aktienanleihe")
                setAssetClassValue("Zertifikat")
                break;



                /// FIXED start
            case CertificateTypeName.Bonus:
                setHeader(`${defaultString} Bei einem aktuellen Kaufkurs von ${snapQuote} ${displayCode} können Sie bis zur Fälligkeit des Zertifikates am 
                ${formatDate(maturityDate)} eine Bonusrendite p.a. von ${ bRenditePerc } erzielen, wenn die Barriere von ${barriereAbs} ${displayCode} während der Laufzeit nicht berührt oder unterschritten wird.`)
                setAssetClassValue("Zertifikat")
                setAssetTypeValue("Bonus")
                break;
            case CertificateTypeName.Express:
            case CertificateTypeName.Kapitalschutz:
                setHeader(`${defaultString} Mit diesem Zertifikat hätten Sie eine Performance von ${oneYearPerformancePerc} erzielt, wenn Sie es vor einem Jahr gekauft hätten.`)
                setAssetTypeValue("Express")
                setAssetClassValue("Zertifikat")
                break;

            case CertificateTypeName.Discount:
                setHeader(`${defaultString} Bei einem aktuellen Kaufkurs von ${snapQuote} ${displayCode} können Sie bis zur 
                Fälligkeit des Zertifikates am ${formatDate(maturityDate)} eine maximale Rendite p.a. von 
                ${maxRendite} erzielen.`);
                setAssetClassValue("Zertifikat")
                setAssetTypeValue("Discount")
                break;

            case CertificateTypeName.OutperfSprint:
                if (typeId === "CERT_SPRINT_OUTPERFORMANCE_OUTPERFORMANCE_CLASSIC"){
                    setHeader(`${defaultString} . Mit diesem Zertifikat hätten Sie eine Performance von ${oneYearPerformancePerc} erzielt, wenn Sie es vor einem Jahr gekauft hätten.`)
                    setAssetTypeValue("Outperf./Sprint")
                    setAssetClassValue("Zertifikat")
                }

                else if (typeId === "CERT_SPRINT_OUTPERFORMANCE_SPRINT_CLASSIC"){
                    setHeader(`${defaultString}. 
                    Bei einem aktuellen Kaufkurs von ${snapQuote} können Sie bis zur Fälligkeit des Zertifikates am ${_maturityDate} eine maximale Rendite p.a. von ${maxRendite} erzielen.`)
                    setAssetTypeValue("Outperf./Sprint")
                    setAssetClassValue("Zertifikat")
                }
                else {
                    setHeader('')
                    setAssetTypeValue("Outperf./Sprint")
                    setAssetClassValue("Zertifikat")
                }
                break;




                /// FIXED end



            case CertificateTypeName.Kapitalschutz:
                setHeader(`${defaultString} Dieses Zertifikat verfällt in ${dueTo} Tagen. Mit diesem Zertifikat hätten Sie eine Performance von [performance in % 1 year] erzielt, wenn Sie es vor einem Jahr gekauft hätten.`)
                setAssetTypeValue("Kapitalschutz")
                setAssetClassValue("Zertifikat")
            break;
            default: {
                setHeader(`${defaultString} Mit diesem Zertifikat hätten Sie eine Performance von ${oneYearPerformancePerc} erzielt, wenn Sie es vor einem Jahr gekauft hätten.`);
                setAssetTypeValue("Zertifikate")
                setAssetClassValue("Zertifikat")
            }
        }
    }, [id, assetClassValue, assetClassname, dueTo, maturityDate, displayCode, keyFiguresData?.data?.group?.underlyings, koStatus, snapQuote, trade?.percentChange, typename])

    useEffect(
        () => {
            if(data.data) {
                setV2(data.data?.group?.assetType?.name || '');
                setV3(data.data?.group?.name || '');
                setV4(keyFiguresData.data?.group?.underlyings && keyFiguresData.data?.group?.underlyings.length > 0 ?
                    keyFiguresData.data?.group?.underlyings[0].name || '' : '');
            }
        }, [data.data, keyFiguresData.data]
    )

    if (asset.loading || data.loading) {
        return (
            <div className={"mt-4 d-flex justify-content-center"} style={{ height: "70px" }}><Spinner animation="border" /></div>
        );
    }
    if (asset.data.assetPage.assetGroup !== assetGroup || !data.data?.group || !data.data.group.id) {
        return (<Page404/>)
    }

    return (
        <>
            {data && data.data?.group &&
                <>
                    {asset.data.assetPage.robots.index && asset.data.assetPage.robots.follow ?
                        <Helmet>
                            <title>{`${data.data.group?.name} - ${data.data.group?.wkn ? data.data.group?.wkn + ' - ' : ''} ${data.data.group?.isin} - Kurs - Chart - Performance`}</title>
                            <meta name="description"
                                content={`Überblick des Zertifikates ${data?.data.group.name} - WKN ${data.data.group?.wkn}, ISIN ${data.data.group?.isin} ➨ bei finanztreff.de topaktuell und kostenlos!`} />
                            <meta name="keywords"
                                content={`Ausführliches Zertifikateportrait ${data?.data.group.name}, WKN ${data.data.group?.wkn}, ISIN ${data.data.group?.isin} - Aktienanleihe, Bonus, Discout, Express, Index, Kapitalschutz, Sprint, Outperformance, Realtime, Echtzeit`} />
                        </Helmet>
                        :
                        <Helmet><meta name="Robots" content="NOINDEX,NOFOLLOW" /></Helmet>
                    }
                </>
            }
            <>
                <Helmet>
                    <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated), data.data.group.wkn, data.data.group.isin, data.data.group.assetType!.name, localStorage.getItem('pVariable'), localStorage.getItem('mfVariable'))) + `;`}</script>
                    <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
                </Helmet>
            </>

            <PageBannerComponent group={data.data.group} className={"banner-index"}
                                 change={(id) => {trigInfonline("zertificate_portrait", 'slider');instrumentChange(id)}}
                                 assetClass={assetClassValue}
                                 assetGroup={assetGroup}
                                 assetType={assetClassname}
                                 // assetType={assetTypeValue}
                                 typeId={assetClassname}
                                 assetClassName="zertifikat ml-2 ml-md-0"
                                 keyFigures={keyFiguresData.data?.group?.main?.keyFigures}
                                 underlyings={data.data?.group?.underlyings}>
                                    x

            <HorizontalNaviationBar links={[
                <Link className="text-white" onClick={() => trigInfonline(guessInfonlineSection(), 'weitere_borsenplatze')}
                    to={{
                        key: '',
                        pathname: "/" + getAssetForUrl(data.data.group.assetGroup).toLowerCase() + "/kurse/" + pathParam.seoTag + "/",
                        hash: '#boersen',
                        state: getInstrumentIdByExchnageCode(data.data.group, location)
                    }}>
                    Börsenplätze
                </Link>,
                <Link className="text-white" onClick={() => trigInfonline(guessInfonlineSection(), 'times_sales')}
                    to={{
                        key: 'times',
                        pathname: "/" + getAssetForUrl(data.data.group.assetGroup).toLowerCase() + "/kurse/" + pathParam.seoTag + "/",
                        hash: '#times',
                        state: getInstrumentIdByExchnageCode(data.data.group, location)
                    }}>
                    Times &amp; Sales
                </Link>,
                <Link className="text-white" onClick={() => trigInfonline(guessInfonlineSection(), 'historische_kurse')}
                    to={{
                        key: 'historie',
                        pathname: "/" + getAssetForUrl(data.data.group.assetGroup).toLowerCase() + "/kurse/" + pathParam.seoTag + "/",
                        hash: '#historie',
                        state: getInstrumentIdByExchnageCode(data.data.group, location)
                    }}>
                    Historische Kurse
                </Link>
            ]} />
            <div className={`bg-${computeDueToCss(dueTo)}`}>
                    <p className="mb-0 pb-2 pl-3 pt-2 text-white font-size-14px"> {header}</p>
                    {/*<p className="bg-white p-10px ml-10px">Dieses Zertifikat ist ein <b>Open End Zertifikat.</b>*/}
                    {/*</p>*/}
                </div>
            </PageBannerComponent>
            <section className="main-section pt-0">
                <Container>
                    <Row>
                        <Col xl={9} sm={12}>
                            {
                                keyFiguresData.loading || data.loading ? <Spinner animation={"border"}/> :
                                    <WarrantCharacteristicsContainer group={data.data.group} />

                                // <WarrantCharacteristics
                                //     groupId={keyFiguresData.data?.group}
                                //     assetType={assetTypeName}
                                //     assetTypeObject={data.data?.group?.assetType}
                                //     title="Zertifikate Merkmale"
                                //     assetGroup={assetGroup}
                                //     typeName={typename}
                                //     instrument={data.data.group}
                                // />
                            }
                            {/* <AdditionalInformationSection instrumentGroup={data.data.group} className="pb-25px d-xl-none" hidePriceComparison={true} instrumentId={getInstrumentIdByExchnageCode(data.data.group, location)}/> */}
                            <AdditionalInformationSectionModals instrumentId={getInstrumentIdByExchnageCode(data.data.group, location)} instrumentGroup={data.data.group} hidePriceComparison={true}/>
                            <Underlying
                                groupId={underlyingProductsData?.data?.group}
                                id={data.data.group.id}
                                assetGroup={assetGroup}
                                className="d-xl-none"
                            />
                            <MatchingProducts/>
                            <Row>
                                <div className="col-lg-6 col-md-12 col-sm-12 pr-1">
                                    <PerformanceComparison groupId={derivativePerformanceCompareData?.data?.group}
                                                           assetGroup= {assetGroup}
                                                           header='Performance-Vergleich Basiswert vs Zertifikat'
                                                           v1='Zertifikat'
                                                           v2={v2}
                                                           v3={v3}
                                                           v4={v4}
                                    />
                                </div>
                                <div className="col-lg-6 col-md-12 col-sm-12">
                                    <UnderlyingVSWarrant
                                        label='Zertifikat'
                                        instrumentGroup={refundScenario?.data?.group}
                                        underLyingTitle="Basiswert vs Zertifikat bei Fälligkeit"
                                        assetGroup={assetGroup}/>
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 pr-1">
                                    <TradeInformation loading={warrantStaticData.loading} groupId={warrantStaticData.data?.group} assetGroup={assetGroup}/>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                    <EmissionsInformation loading={warrantStaticData.loading} groupId={warrantStaticData.data?.group} assetGroup={assetGroup}/>
                                </div>
                            </Row>
                            <InvestmentIdea instrumentGroup={data.data.group}/>
                            <Row className="d-xl-none">
                                <div className="col-lg-6 col-sm-12 p-xl-0 pr-lg-2">
                                    {
                                        <AlternativesFromUBS
                                        groupId = {data.data.group}
                                        assetClass={data.data.group.assetClass}
                                        assetType = {data.data.group.assetType}
                                        issuerId = {data.data.group?.issuer?.id}
                                        warrantGroupId = {warrantGroupId}
                                        underlying = {underlying}
                                        />
                                    }
                                </div>
                                <div className="pb-25px col-lg-6 col-sm-12 p-xl-0 pl-lg-2">
                                    {
                                        <AlternativesTo
                                        groupId = {data.data.group}
                                        assetType = {data.data.group.assetType}
                                        assetClass={data.data.group.assetClass}
                                        underlying = {underlying}
                                        />
                                    }
                                </div>
                            </Row>
                        </Col>
                        <Col xl={3} sm={12} className="pl-xl-0">
                            {/* <AdditionalInformationSection instrumentGroup={data.data.group} className="pb-25px d-none d-xl-block" hidePriceComparison={true}/> */}
                            <Underlying
                                groupId={underlyingProductsData?.data?.group}
                                assetGroup={assetGroup}
                                id={data.data.group.id}
                                className="d-none d-xl-block"
                            />
                            {
                                (data?.data?.group?.issuer && warrantStaticData?.data && data?.data?.group?.assetType) &&
                            <AlternativesFromUBS className="d-none d-xl-block"
                            groupId = {data?.data.group} issuerId = {data.data?.group?.issuer.id} warrantGroupId = {warrantStaticData?.data.group} underlying = {underlyingProductsData.data?.group} assetClass={data?.data?.group?.assetClass} assetType = {data.data.group.assetType}
                            />
                            }
                            {
                                (data && data?.data && data.data?.group && data.data.group?.assetType && data.data?.group?.assetClass) &&
                            <AlternativesTo className="d-none d-xl-block"
                            groupId = {data.data?.group} assetType = {data?.data?.group?.assetType} underlying = {underlyingProductsData.data?.group} assetClass={data?.data?.group?.assetClass}
                            />
                            }
                        </Col>
                        <Col sm={12} className="mb-4">
                            <Row>
                                <Col xl={9} sm={12}>
                                    <PortfolioOverviewInPortraitComponent instrumentGroup={data.data.group} />
                                </Col>
                                <Col xl={3} sm={12} className="pl-xl-0 pr-xl-3 mt-3">
                                    <MostTradedAssets titleClassName="line-height-1 mb-n1 fs-16px pt-2" buttonClassName="fs-16px pb-2" assetNameLenght={20}/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
}

import {useQuery} from '@apollo/client';
import {GET_ASSET_PAGE} from "../../../graphql/query";
import {Link, useLocation, useParams} from 'react-router-dom';
import {PageBannerComponent} from "../../common";
import {Col, Container, Row, Spinner} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {AssetGroup, Query} from "../../../generated/graphql";
import InvestmentIdea from "../Derivatives/components/InvestmentIdea";
import TradeInformation from "../Derivatives/components/TradeInformation";
import EmissionsInformation from "../Derivatives/components/EmissionsInformation";
import AlternativesTo from "../Derivatives/components/AlternativesTo";
import MatchingProducts from "../Derivatives/components/MatchingProducts";
import PerformanceComparison from "../Derivatives/components/PerformanceComparison";
import UnderlyingVSWarrant from "../Derivatives/components/UnderlyingVsWarrant";
import {WarrantCharacteristics} from "../Derivatives/components/WarrantCharacteristics";
import {Underlying} from "../Derivatives/components/Underlying";
import AlternativesFromUBS from "../Derivatives/components/AlternativesFromUBS";
import {loader} from "graphql.macro";
import moment from "moment";
import {getAssetForUrl, getAssetGroup} from "../../profile/utils";
import { PortfolioOverviewInPortraitComponent } from 'components/common/PortfolioOverviewInPortraitComponent/PortfolioOverviewInPortraitComponent';
import { MostTradedAssets } from 'components/Home/HotSection/UserStatistics/HostSectionAdvertisement';
import {Helmet} from "react-helmet";
import { guessInfonlineSection, trigInfonline } from 'components/common/InfonlineService';
import { AdditionalInformationSection, AdditionalInformationSectionModals } from 'components/common/asset/AdditionalInformationSection/AdditionalInformationSection';
import { Page404 } from 'components/common/page404/Page404';
import { getInstrumentIdByExchnageCode } from 'utils';
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from 'components/common/TargetingService';
import keycloak from 'keycloak';
import { HorizontalNaviationBar } from 'components/common/horizontal-navigation-bar/HorizontalNaviationBar';

const assetGroup = AssetGroup.Knock;

export const KnockPage = () => {
    const location = useLocation();
    let dueTo: number | null = null;
    const [v3, setV3] = useState('');
    const [v4, setV4] = useState('');
    
    const pathParam = useParams<{ seoTag: string }>();

    const {seoTag} = useParams<{ seoTag: string }>();
    const asset = useQuery(GET_ASSET_PAGE, {
        variables: {seoTag: seoTag},
    });

    const data = useQuery<Query>(loader('./getKnockPage.graphql'), {
        skip: asset.loading || (!asset.loading && asset.data.assetPage.assetGroup !== assetGroup),
        variables: {groupId: asset.data?.assetPage?.groupId},
    });

    const keyFiguresData = useQuery<Query>(loader('../Derivatives/getWarrantKeyfigures.graphql'), {
        skip: asset.loading || data.loading || !data.data?.group?.id,
        variables: {
            groupId: data.data?.group?.id
        }
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const warrantStaticData = useQuery<Query>(loader('../Derivatives/getWarrantStaticData.graphql'), {
        skip: asset.loading || data.loading || !data.data?.group?.id,
        variables: {
            groupId: data.data?.group?.id
        }
    })

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const underlyingProductsData = useQuery<Query>(loader('../Derivatives/getDerivativeUnderlyingProducts.graphql'), {
        skip: asset.loading || data.loading || !data.data?.group?.id,
        variables: {
            groupId: data.data?.group?.id
        }
    })

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const derivativePerformanceCompareData = useQuery<Query>(loader('../Derivatives/getDerivativePerformanceCompare.graphql'), {
        skip: asset.loading || data.loading || !data.data?.group?.id,
        variables: {
            groupId: data.data?.group?.id
        }
    })

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const refundScenario = useQuery<Query>(loader('../Derivatives/getRefundRelativeScenario.graphql'), {
        skip: asset.loading || data.loading || !data.data?.group?.id,
        variables: {
            groupId: data.data?.group?.id
        }
    })

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [koStatus, setKoStatus]=useState<string | null | undefined>("")
    let warrantGroupId
    if(warrantStaticData && warrantStaticData.data){
        warrantGroupId = warrantStaticData.data?.group
    }


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        trigInfonline('knockout_portrait', 'portrait')
    }, [])


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(
        () => {
            if(data.data) {
                setV3(data.data?.group?.name || '');
                setV4(keyFiguresData.data?.group?.underlyings && keyFiguresData.data?.group?.underlyings.length > 0 ?
                    keyFiguresData.data?.group?.underlyings[0].name || '' : '');
            }
        }, [data.data, keyFiguresData.data]
    )


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        let maturityDate = moment(keyFiguresData?.data?.group?.derivative?.maturityDate);
        dueTo = maturityDate.diff(moment(), 'd') + 1;

        if(keyFiguresData.data?.group?.underlyings && keyFiguresData.data?.group?.underlyings.length > 0 &&
            keyFiguresData.data.group.underlyings[0].knockOutTriggeredAt
        ) {
            const trigAtDate = moment(keyFiguresData.data.group.underlyings[0].knockOutTriggeredAt).format('DD.MM.YY');
            const trigAtTime = moment(keyFiguresData.data.group.underlyings[0].knockOutTriggeredAt).format('hh:mm');
            setKoStatus(`Das Produkt wurde am ${trigAtDate} um ${trigAtTime} ausgestoppt.`);
        } else {
            if (!keyFiguresData?.data?.group?.derivative?.maturityDate || isNaN(dueTo)) {
                setKoStatus("Dieses Produkt ist ein Open End Knock-Out.");
            } else {
                if (dueTo < 0) {
                    setKoStatus('Dieses Produkt ist ein Open End Knock-Out')
                } else {
                    setKoStatus("Dieser Knock-out verfällt in " + dueTo + " Tagen.")
                }
            }
        }
    }, [keyFiguresData?.data?.group?.derivative?.maturityDate, koStatus]);

    if (asset.loading || data.loading) {
        return (
            <div className={"mt-4 d-flex justify-content-center"} style={{ height: "70px" }}><Spinner animation="border" /></div>
        );
    }
    if (asset.data.assetPage.assetGroup !== assetGroup || !data.data?.group || !data.data.group.id) {
        return (<Page404/>)
    }

    const id = data.data?.group?.assetType?.id;
    const typename = data.data?.group?.assetType?.name

    function computeDueToCss(dueTo: number | null): string | null {
        if (dueTo == null || Number.isNaN(dueTo) || dueTo < 0) {
            return "dark";
        }
        if (dueTo > 90) {
            return "green";
        }
        if (dueTo > 30) {
            return "orange";
        }
        return "pink";
    }
    function optionTypeMap(optionType: string | null | undefined) {
        if (keyFiguresData?.data?.group?.derivative?.optionType === "CALL") {
            return "LONG";
        } else if(keyFiguresData?.data?.group?.derivative?.optionType === "PUT") {
            return "SHORT";
        }
        else return keyFiguresData?.data?.group?.derivative?.optionType || ''
    }
    const getKurs = () => underlyingProductsData.data?.group?.underlyings ? underlyingProductsData.data?.group?.underlyings[0]?.instrument?.snapQuote?.quote?.value : null;
    return (
        <>
            {asset.data && data && data.data.group &&
                <>
                    {asset.data.assetPage.robots.index && asset.data.assetPage.robots.follow ?
                        <Helmet>
                            <title>{data.data.group.name} - {data.data.group.isin} - {data.data.group.isin} - Kurs - Chart - Performance</title>
                            <meta name="description"
                                content={`Überblick des Knock-Outs ${data.data.group.name} - WKN ${data.data.group.isin}, ISIN ${data.data.group.isin} ➨ bei finanztreff.de topaktuell und kostenlos!`} />
                            <meta name="keywords"
                                content={`Ausführliches Knockoutportrait ${data.data.group.name}, WKN, ${data.data.group.isin}, ISIN ${data.data.group.isin} - finanztreff: Knock-Out, Turbo, Smart, Long, Short, Hebel, Strike, Stop Loss, Realtime, Echtzeit`} />
                        </Helmet> :
                        <Helmet><meta name="Robots" content="NOINDEX,NOFOLLOW" /></Helmet>
                    }
                </>
            }
                <Helmet>
                    <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated), data.data.group.wkn, data.data.group.isin, data.data.group.assetType!.name, localStorage.getItem('pVariable'), localStorage.getItem('mfVariable'))) + `;`}</script>
                    <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
                </Helmet>
            
            <PageBannerComponent group={data.data.group} className={"banner-index"} assetGroup={assetGroup} assetClass={getAssetGroup(data?.data?.group?.assetGroup)}
                                assetType= {`${optionTypeMap(keyFiguresData?.data?.group?.derivative?.optionType)}`} assetClassName= "knock-out"
                                keyFigures={keyFiguresData.data?.group?.main?.keyFigures}
                                underlyings={data.data?.group?.underlyings}
            >
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
                    </Link>,
                ]} />
                <div className={`bg-${computeDueToCss(dueTo)}`}>
                    <p className={"mb-10px pb-2 pl-3 pt-2 text-white " + (koStatus?.startsWith("Das Produkt wurde am") ? "bg-danger" : "bg-danger")}>{koStatus}</p>
                    <p className="bg-white p-10px ml-10px d-none">Beschreibung</p>
                </div>
            </PageBannerComponent>
            <section className="main-section pt-0 mb-3">
                <Container>
                    <Row>
                        <AdditionalInformationSectionModals instrumentId={getInstrumentIdByExchnageCode(data.data.group, location)} instrumentGroup={data.data.group} hidePriceComparison={true}/>
                        <Col xl={9} sm={12}>
                            {keyFiguresData.loading ? <Spinner animation={"border"}/> :
                                <WarrantCharacteristics
                                    groupId={keyFiguresData.data?.group}
                                    instrument={data.data.group}
                                    assetType={id}
                                    kurs={getKurs()}
                                    title="Knock Out Merkmale"
                                    assetGroup={assetGroup}
                                    typeName={typename}
                                />
                            }
                            {/* <AdditionalInformationSection instrumentId={getInstrumentIdByExchnageCode(data.data.group, location)} instrumentGroup={data.data.group} className="pb-xl-3 pb-1 d-xl-none" hidePriceComparison={true}/> */}
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
                                                        header='Performance-Vergleich Basiswert vs Knock Out'
                                                           v1='Knock Out'
                                                           v2='Knock Out'
                                                           v3={v3}
                                                           v4={v4}
                                    />
                                </div>
                                <div className="col-lg-6 col-md-12 col-sm-12">
                                    <UnderlyingVSWarrant
                                       label='Knock-Out'
                                        instrumentGroup={refundScenario?.data?.group}
                                        underLyingTitle="Basiswert vs Knock-Out bei Fälligkeit"
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
                                    (underlyingProductsData.data && underlyingProductsData) &&
                                        <AlternativesFromUBS
                                        groupId = {data.data.group}
                                        issuerId = {data.data?.group?.issuer?.id}
                                        warrantGroupId = {warrantGroupId}
                                        underlying = {underlyingProductsData.data.group}
                                        assetClass={data.data.group.assetClass}
                                        assetType = {data.data.group.assetType}
                                        />
                                    }
                                </div>
                                <div className="pb-25px col-lg-6 col-sm-12 p-xl-0 pl-lg-2">
                                {
                                    (underlyingProductsData && underlyingProductsData.data) &&
                                        <AlternativesTo
                                        groupId = {data.data.group}
                                        assetType = {data.data.group.assetType}
                                        underlying = {underlyingProductsData.data?.group}
                                        assetClass={data.data.group.assetClass}
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
                                className="d-none d-xl-block"/>
                            {
                                (data && data?.data && data?.data?.group && data.data?.group?.assetClass) &&
                                <AlternativesFromUBS className="d-none d-xl-block" groupId = {data?.data?.group} issuerId = {data.data?.group?.issuer?.id} warrantGroupId = {warrantStaticData.data?.group} underlying = {underlyingProductsData.data?.group}  assetClass={data.data.group.assetClass} assetType = {data.data.group.assetType}/>
                            }
                            {
                            (data && data?.data && data?.data?.group && data?.data?.group?.assetType) &&
                            <AlternativesTo className="d-none d-xl-block" groupId = {data?.data?.group} assetType = {data?.data?.group?.assetType} underlying = {underlyingProductsData.data?.group} assetClass={data.data.group.assetClass}/>
                            }
                        </Col>
                        <Col sm={12}>
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

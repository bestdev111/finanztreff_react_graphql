import {useQuery} from '@apollo/client';
import {GET_ASSET_PAGE} from "../../../graphql/query";
import {Link, useLocation, useParams} from 'react-router-dom';
import {PageBannerComponent} from "../../common";
import {Col, Container, Row, Spinner} from "react-bootstrap";
import React, {useEffect ,useRef,useState} from "react";
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
import {getAssetForUrl, getAssetGroup} from "../../profile/utils";
import moment from "moment";
import { PortfolioOverviewInPortraitComponent } from 'components/common/PortfolioOverviewInPortraitComponent/PortfolioOverviewInPortraitComponent';
import { MostTradedAssets } from 'components/Home/HotSection/UserStatistics/HostSectionAdvertisement';
import {Helmet} from "react-helmet";
import { Page404 } from 'components/common/page404/Page404';
import { AdditionalInformationSection, AdditionalInformationSectionModals } from 'components/common/asset/AdditionalInformationSection/AdditionalInformationSection';
import { getInstrumentIdByExchnageCode } from 'utils';
import { generateLoginVariable, generateRoSvariable, generateTargetingObject, guessTargetingZone } from 'components/common/TargetingService';
import keycloak from 'keycloak';
import { HorizontalNaviationBar } from 'components/common/horizontal-navigation-bar/HorizontalNaviationBar';
import { trigInfonline, guessInfonlineSection } from 'components/common/InfonlineService';

const assetGroup = AssetGroup.Warr;

interface Child {
    changeInstrument: (id: number) => void;
}

export const OptionPage = () => {
    const pathParam = useParams<{ seoTag: string }>();
    const {seoTag} = useParams<{ seoTag: string, additionalSection?: string }>();
    const [v3, setV3] = useState('');
    const [v4, setV4] = useState('');
    useEffect(() => {
        trigInfonline('optionsschein_portrait', 'portrait')
    }, [])

    const asset = useQuery(GET_ASSET_PAGE, {
        variables: {seoTag: seoTag},
    });

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

    const [status , setStatus]  = useState("")

    const data = useQuery<Query>(loader('./getOptionPage.graphql'), {
        skip: asset.loading || (!asset.loading && asset?.data?.assetPage?.assetGroup !== assetGroup),
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


    useEffect(
        () => {
            if(data.data) {
                setV3(data.data?.group?.name || '');
                setV4(keyFiguresData.data?.group?.underlyings && keyFiguresData.data?.group?.underlyings.length > 0 ?
                    keyFiguresData.data?.group?.underlyings[0].name || '' : '');
            }
        }, [data.data, keyFiguresData.data]
    )


    useEffect(() => {
        if (keyFiguresData?.data?.group?.derivative?.maturityDate) {
            let maturityDate = moment(keyFiguresData?.data?.group?.derivative?.maturityDate);
            dueTo = maturityDate.diff(moment(), 'd') + 1;
            if (!keyFiguresData?.data?.group?.derivative?.maturityDate || isNaN(dueTo)) {
                setStatus("Dieser Optionsschein hat sein Fälligkeitsdatum überschritten und ist nicht mehr aktiv!")
            } else {

                if (dueTo < 0) {
                    setStatus("Dieser Optionsschein hat sein Fälligkeitsdatum überschritten und ist nicht mehr aktiv!")
                } else {
                    setStatus(`Dieser Optionsschein verfällt in ${dueTo} Tagen.`)
                }
            }
        }
    }, [keyFiguresData?.data?.group?.derivative?.maturityDate , status]);

    let dueTo: number | null = null;

    if (asset.loading || data.loading || underlyingProductsData.loading) {
        return (
            <div className={"mt-4 d-flex justify-content-center"} style={{ height: "70px" }}><Spinner animation="border" /></div>
        );
    }
    if (asset?.data?.assetPage?.assetGroup !== assetGroup || !data.data?.group || !data.data.group.id) {
        return (<Page404/>)
    }

    if (keyFiguresData?.data?.group?.derivative?.maturityDate) {
        let maturityDate = moment(keyFiguresData?.data?.group?.derivative?.maturityDate);
        dueTo = maturityDate.diff(moment(), 'd') + 1;
    }

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
    const name = data.data.group.name;
    const isin = data.data.group.isin;
    const wkn = data.data.group.wkn;
    const getKurs = () => underlyingProductsData.data?.group?.underlyings ? underlyingProductsData.data?.group?.underlyings[0]?.instrument?.snapQuote?.quote?.value : null;
    const kurs = getKurs();
    return (
        <> 
            <>
                {asset.data && asset.data.assetPage.robots.index && asset.data.assetPage.robots.follow ?
                    <Helmet>
                        <title>{name} - {wkn} - {isin} - Kurs - Chart - Performance</title>
                        <meta name="description"
                            content={`Überblick des Optionsscheins ${name} - WKN ${wkn}, ISIN ${isin} ➨ bei finanztreff.de topaktuell und kostenlos!`} />
                        <meta name="keywords"
                            content={`Ausführliches Optionsscheinportrait ${name}, WKN ${wkn}, ISIN ${isin} - finanztreff: Optionsscheine, Classic OS, Discount OS, Hit OS, Inline OS, Inliner, Call, Put, Fälligkeit, am Geld, im Geld, aus dem Geld, Realtime, Echtzeit`} />
                        
                    </Helmet> :
                    <Helmet><meta name="Robots" content="NOINDEX,NOFOLLOW" /></Helmet>
                }
            </>
            <>
                <Helmet>
                    <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated), data.data.group.wkn, data.data.group.isin, data.data.group.assetType?.name, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                    <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
                </Helmet>
            </>
            <PageBannerComponent 
                change={(id) => instrumentChange(id)}
                group={data.data.group} className={"banner-index"} assetGroup={assetGroup} assetClass={getAssetGroup(data?.data?.group?.assetGroup)}
                assetType={`${data?.data?.group?.assetType?.name} ${keyFiguresData?.data?.group?.derivative?.optionType}`} assetClassName="optionsschein"
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
                    <p className="mb-10px pb-2 pl-3 pt-2 text-white ">{status}</p>
                    <p className="bg-white p-10px ml-10px d-none">Beschreibung</p>
                </div>
            </PageBannerComponent>
            <section className="main-section pt-0">
                <Container>
                    <Row>
                        <AdditionalInformationSectionModals instrumentGroup={data.data.group} hidePriceComparison={true} instrumentId={getInstrumentIdByExchnageCode(data.data.group, location)}/>
                        <Col>
                            <WarrantCharacteristics groupId={keyFiguresData.data?.group}
                                                    title="Optionsscheine Merkmale"
                                                    assetGroup={assetGroup}
                                                    kurs={kurs}
                                                    instrument={data.data.group}
                            />
                            {/* <AdditionalInformationSection instrumentGroup={data.data.group} className="pb-xl-3 pb-1 d-xl-none" hidePriceComparison={true}/> */}
                            <Underlying
                                groupId={underlyingProductsData?.data?.group}
                                id={data.data.group.id}
                                assetGroup={assetGroup}
                                className="d-xl-none"
                            />
                            <MatchingProducts />
                            <Row>
                                <Col md={6} sm={12} className="pr-md-2">
                                    <PerformanceComparison groupId={derivativePerformanceCompareData?.data?.group}
                                        assetGroup={assetGroup}
                                        header='Performance-Vergleich Basiswert vs Optionsschein'
                                                           v1='Optionsschein'
                                                           v2='Optionsschein'
                                                           v3={v3}
                                                           v4={v4}
                                    />
                                </Col>
                                <Col md={6} sm={12} className="pl-md-2">
                                <UnderlyingVSWarrant
                                    label='Optionsschein'
                                    instrumentGroup={refundScenario?.data?.group}
                                    underLyingTitle="Basiswert vs Optionsschein bei Fälligkeit"
                                    assetGroup={assetGroup} />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6} sm={12} className="pr-md-2">
                                    <TradeInformation loading={warrantStaticData.loading} groupId={warrantStaticData?.data?.group} assetGroup={assetGroup} />
                                </Col>
                                <Col md={6} sm={12} className="pl-md-2">
                                    <EmissionsInformation loading={warrantStaticData.loading} groupId={warrantStaticData?.data?.group} assetGroup={assetGroup} />
                                </Col>
                            </Row>
                            <InvestmentIdea instrumentGroup={data.data.group}/>
                            <Row className="d-xl-none">
                                <div className="col-lg-6 col-sm-12 p-xl-0 pr-lg-2">
                                    {
                                        (data?.data && data.data.group && data.data.group?.assetType && data.data.group?.assetClass && data.data.group?.issuer && data?.data.group.issuer.id && underlyingProductsData && underlyingProductsData.data && warrantStaticData && warrantStaticData.data && warrantStaticData.data.group) &&
                                        <AlternativesFromUBS
                                            groupId={data?.data.group}
                                            assetType={data?.data.group?.assetType}
                                            assetClass={data.data.group.assetClass}
                                            underlying={underlyingProductsData?.data.group}
                                            issuerId={data.data.group.issuer.id}
                                            warrantGroupId={warrantStaticData.data?.group}
                                        />
                                    }
                                </div>
                                <div className="pb-25px col-lg-6 col-sm-12 p-xl-0 pl-lg-2">
                                    {
                                        (data?.data && data?.data?.group && data.data.group?.assetType && data.data.group.assetClass && underlyingProductsData && underlyingProductsData?.data && underlyingProductsData?.data?.group) &&
                                        <AlternativesTo
                                            groupId={data?.data?.group}
                                            assetType={data.data?.group?.assetType}
                                            assetClass={data?.data?.group?.assetClass}
                                            underlying={underlyingProductsData?.data?.group}
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
                                (warrantStaticData?.data && warrantStaticData.data?.group && underlyingProductsData?.data && underlyingProductsData.data?.group && data.data.group.assetType) &&
                                <AlternativesFromUBS className="d-none d-xl-block"
                                    groupId={data?.data?.group} issuerId={data.data?.group?.issuer?.id} warrantGroupId={warrantStaticData?.data?.group} underlying={underlyingProductsData?.data?.group} assetClass={data?.data?.group?.assetClass} assetType={data?.data?.group?.assetType}
                                />
                            }
                            {
                                (data?.data && data?.data?.group && data?.data.group?.assetClass && data?.data?.group?.assetType && underlyingProductsData && underlyingProductsData.data?.group) &&
                                <AlternativesTo className="d-none d-xl-block"
                                    groupId={data?.data?.group} assetType={data?.data?.group?.assetType} underlying={underlyingProductsData?.data.group} assetClass={data?.data?.group?.assetClass}
                                />
                            }
                        </Col>
                        <Col sm={12} className="mb-4">
                            <Row>
                                <Col xl={9} sm={12}>
                                    <PortfolioOverviewInPortraitComponent instrumentGroup={data.data?.group} />
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

import { useEffect, useRef } from "react";
import { PageBannerComponent } from '../../common';
import { BondTechnicalFiguresComponent } from './BondTechnicalFiguresComponent';
import { BondTextDescriptionComponent } from "./BondTextDescriptionComponent";
import { Col, Row, Spinner } from "react-bootstrap";
import { BondKeyFigures } from "./BondKeyFigures";
import { Link, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { GET_ASSET_PAGE } from "graphql/query";
import { AssetGroup, Query } from "generated/graphql";
import { BondIssueInformationComponent } from "./BondIssueInformationComponent";
import { AssetCategoryComponent } from "components/common/AssetCategoryComponent";
import { PortfolioOverviewInPortraitComponent } from "components/common/PortfolioOverviewInPortraitComponent/PortfolioOverviewInPortraitComponent";
import { guessInfonlineSection, trigInfonline } from "../../common/InfonlineService";
import { Helmet } from "react-helmet";
import { Page404 } from "components/common/page404/Page404";
import { AdditionalInformationSection, AdditionalInformationSectionModals } from "components/common/asset/AdditionalInformationSection/AdditionalInformationSection";
import { getInstrumentIdByExchnageCode, SECTIONS } from "utils";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from "components/common/TargetingService";
import keycloak from "keycloak";
import { HorizontalNaviationBar } from "components/common/horizontal-navigation-bar/HorizontalNaviationBar";
import { getAssetForUrl } from "components/profile/utils";

export const BondPortraitPage = () => {
    let location = useLocation();
    const pathParam = useParams<{ seoTag: string, section: string }>();
    const seoTag = pathParam.seoTag;

    useEffect(() => {
        trigInfonline(guessInfonlineSection(), "portrait_page")
    }, [])

    let childRef = useRef<InstrumentAware>();
    const instrumentChange = (instrumentId: number) => {
        if (childRef.current?.changeInstrument) {
            childRef.current?.changeInstrument(instrumentId);
        }
    };

    const { loading: assetLoading, data: assetData } = useQuery(GET_ASSET_PAGE, {
        variables: { seoTag: seoTag },
        skip: !seoTag
    });

    const { data, loading } = useQuery<Query>(loader('./getBondPage.graphql'), {
        skip: assetLoading || (!assetLoading && assetData.assetPage.assetGroup !== AssetGroup.Bond),
        variables: { groupId: assetData?.assetPage?.groupId },
    });

    if (assetLoading || loading) {
        return (<div className={"p-1"} style={{ height: "70px" }}><Spinner animation="border" /></div>);
    }

    if (assetData.assetPage.assetGroup !== AssetGroup.Bond) {
        return (<Page404 />)
    }

    let instrumentGroup = data?.group || null;
    if (!data || !instrumentGroup || !instrumentGroup.content.length || instrumentGroup.content.length < 1) {
        return (<Page404 />)
    }

    const CATEGORY_PAIRS = [{
        name: "Anleiheart", value: instrumentGroup.bond?.type?.name || undefined
    }, {
        name: "Land", value: "--"
    }, {
        name: "Währung", value: instrumentGroup.bond?.nominalCurrency?.displayCode || undefined
    }];

    if (!SECTIONS.includes(pathParam.section)) {
        return (<Page404 />)
    }

    return (
        <>
            {data && data.group &&
                <>
                    {assetData && assetData.data && assetData.data.assetPage.robots.index && assetData.data.assetPage.robots.follow ?
                        <Helmet>
                            <title>{`${data.group?.name} - ${data.group?.wkn ? data.group?.wkn + ' - ' : ''} ${data.group?.isin} - Kurs - Chart - Zinsen`}</title>
                            <meta name="description"
                                content={`Überblick der Anleihe ${data.group?.name} - WKN ${data.group?.wkn}, ISIN ${data.group?.isin} - Kurse, Chart, Zinstermine, Kupon ➨ bei finanztreff.de topaktuell und kostenlos!`} />
                            <meta name="keywords"
                                content={`Ausführliches Anleihenportrait  ${data.group?.name}, WKN ${data.group?.wkn}, ISIN ${data.group?.isin} - finanztreff: Bonds, Pfandbriefe, Obligationen, Schuldverschreibungen, Unternehmensanleihe, Staatsanleihe, Bundesanleihe, Rendite, Bundesanleihen Zinsen aktuell, Stückzins, Realtime, Echtzeit`} />
                        </Helmet>
                        :
                        <Helmet><meta name="Robots" content="NOINDEX,NOFOLLOW" /></Helmet>
                    }
                </>
            }
            <>
                <Helmet>
                    <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated), data?.group?.wkn, data?.group?.isin, data?.group?.assetType?.name, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                    <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
                </Helmet>
            </>
            <PageBannerComponent group={instrumentGroup} assetClass={instrumentGroup.bond?.type?.name || "Anleihen"} className={"banner-share"}
                assetClassName={"bg-BOND"}
                change={id => { instrumentChange(id) }} />

            <HorizontalNaviationBar links={[
                <Link className="text-white" onClick={() => trigInfonline(guessInfonlineSection(), 'weitere_borsenplatze')}
                    to={{
                        key: '',
                        pathname: "/" + getAssetForUrl(instrumentGroup.assetGroup).toLowerCase() + "/kurse/" + pathParam.seoTag + "/",
                        hash: '#boersen',
                        state: getInstrumentIdByExchnageCode(instrumentGroup, location)
                    }}>
                    Börsenplätze
                </Link>,
                <Link className="text-white" onClick={() => trigInfonline(guessInfonlineSection(), 'times_sales')}
                    to={{
                        key: 'times',
                        pathname: "/" + getAssetForUrl(instrumentGroup.assetGroup).toLowerCase() + "/kurse/" + pathParam.seoTag + "/",
                        hash: '#times',
                        state: getInstrumentIdByExchnageCode(instrumentGroup, location)
                    }}>
                    Times &amp; Sales
                </Link>,
                <Link className="text-white" onClick={() => trigInfonline(guessInfonlineSection(), 'historische_kurse')}
                    to={{
                        key: 'historie',
                        pathname: "/" + getAssetForUrl(instrumentGroup.assetGroup).toLowerCase() + "/kurse/" + pathParam.seoTag + "/",
                        hash: '#historie',
                        state: getInstrumentIdByExchnageCode(instrumentGroup, location)
                    }}>
                    Historische Kurse
                </Link>,
                <>
                    {data.group?.bond?.issueSize && data.group?.bond?.maturityDate &&
                        <a className="text-white" href='#anlageidee'>
                            Anlageidee
                        </a>
                    }
                </>,
            ]} />
            <section className="main-section" id="anleihen-details-page">
                <div className="container">
                    <div className="content-row mb-2">
                        <Row>
                            <AdditionalInformationSectionModals instrumentId={getInstrumentIdByExchnageCode(instrumentGroup, location)} instrumentGroup={instrumentGroup} hidePriceComparison={true} />
                            <Col xl={9} sm={12}>
                                {CATEGORY_PAIRS.length > 0 &&
                                    <AssetCategoryComponent pairs={CATEGORY_PAIRS} />
                                }
                                {instrumentGroup.content[0] &&
                                    <BondTechnicalFiguresComponent instrumentGroup={instrumentGroup} />}
                                {/* <BondChartComponent/> */}
                                <BondTextDescriptionComponent instrumentGroup={instrumentGroup} />
                                <PortfolioOverviewInPortraitComponent instrumentGroup={instrumentGroup} />
                            </Col>
                            <Col xl={3} sm={12} className="pl-xl-0">
                                {/* <AdditionalInformationSection instrumentGroup={instrumentGroup} hidePriceComparison={true} instrumentId={getInstrumentIdByExchnageCode(instrumentGroup, location)} /> */}
                                <Row>
                                    <Col md={6} sm={12} xl={12}>
                                        {
                                            instrumentGroup.content.length > 0
                                            && <BondKeyFigures ref={childRef}
                                                instrumentId={getInstrumentIdByExchnageCode(instrumentGroup, location)}
                                                instruments={instrumentGroup.content || []}
                                                instrumentGroup={instrumentGroup} />
                                        }
                                    </Col>
                                    <Col md={6} sm={12} xl={12}>
                                        <BondIssueInformationComponent instrumentGroup={instrumentGroup} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </div>
            </section>
        </>
    );
}



export interface InstrumentAware {
    changeInstrument: (id: number) => void;
}


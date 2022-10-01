import { useQuery } from "@apollo/client";
import { NewsAssetPageSection, PageBannerComponent } from "components/common";
import { TradePredictionSection } from "components/common/asset/TradePredictionSection/TradePredictionSection";
import { AssetGroup, Query } from "generated/graphql";
import { loader } from "graphql.macro";
import { GET_ASSET_PAGE } from "graphql/query";
import {useEffect, useRef} from "react";
import { Spinner } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import { PortfolioStatisticsPortraitComponent } from "../SharePage/components/PortfolioStatisticsPortrait/PortfolioStatisticsPortraitComponent";
import { ShareToolsComponent } from "../SharePage/components/ShareToolsComponent";
import { CommodityQuoteAndExchangeSection } from "./CommodityQuoteAndExchangeSection";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";
import {Helmet} from "react-helmet";
import {getInstrumentIdByExchnageCode, SECTIONS} from "utils";
import { Page404 } from "components/common/page404/Page404";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from "components/common/TargetingService";
import keycloak from "keycloak";
import { HorizontalNaviationBar } from "components/common/horizontal-navigation-bar/HorizontalNaviationBar";
import { getAssetForUrl } from "components/profile/utils";


interface Child {
    changeInstrument: (id: number) => void;
}

export const CommodityPage = () => {
    let location = useLocation();
    const pathParam = useParams<{ section: string, seoTag: string }>();
    const seoTag = pathParam.seoTag;

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

    const asset = useQuery(GET_ASSET_PAGE, {
        variables: { seoTag: seoTag },
    });


    const data = useQuery<Query>(loader('./getCommodityPage.graphql'), {
        skip: asset.loading || (!asset.loading && asset.data.assetPage.assetGroup !== AssetGroup.Comm),
        variables: { groupId: asset.data?.assetPage?.groupId },
    });

    useEffect(() => {
        trigInfonline(guessInfonlineSection(), "portrait_page");
    }, [])

    if (asset.loading || data.loading)
        return (
            <div className={"mt-4 d-flex justify-content-center"} style={{ height: "70px" }}><Spinner animation="border" /></div>
        );

    if (asset.data.assetPage.assetGroup !== AssetGroup.Comm
        && data?.data?.group?.content?.length && data?.data?.group?.content.length > 0) {
        return (<Page404/>)
    }

    if (!SECTIONS.includes(pathParam.section)) {
        return (<></>)
    }

    return (
        <>
            {data && data.data?.group &&
                <>
                    {asset.data.assetPage.robots.index && asset.data.assetPage.robots.follow ?
                        <Helmet>
                            <title>{`${data.data.group?.name} - ${data.data.group?.wkn ? data.data.group?.wkn + ' - ' : ''} ${data.data.group?.isin} - Kurs - Chart - News`}</title>
                            <meta name="description"
                                content={`Überblick ${data?.data.group.name} - WKN ${data.data.group?.wkn}, ISIN ${data.data.group?.isin} - Kurse, Kursvergleich, Kennzahlen, Chart, News ➨ bei finanztreff.de topaktuell und kostenlos!`} />
                            <meta name="keywords"
                                content={`Ausführliches Rohstoffportrait ${data?.data.group.name}, WKN ${data.data.group?.wkn}, ISIN ${data.data.group?.isin} - finanztreff: Rohstoffmarkt, Rohstoffkurse, Rohstoffbörse, Gold realtime, Goldpreis realtime, Ölpreis, Silber, Edelmetall, Realtime, Echtzeit`} />
                        </Helmet>
                        :
                        <Helmet><meta name="Robots" content="NOINDEX,NOFOLLOW" /></Helmet>
                    }
                </>
            }
            <Helmet>
                    <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated), data.data?.group?.wkn, data.data?.group?.isin, data.data?.group?.assetType?.name, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                    <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
            </Helmet>
            {(asset.loading || data.loading) && <div className={"p-1"} style={{ height: "70px" }}><Spinner animation="border" /></div>}
            {!data.loading && data?.data?.group != null && data?.data?.group.id != null &&
                <>
                    <PageBannerComponent group={data?.data?.group} assetClass="Rohstoff" className={"banner-share"} assetClassName={"rohstoff"}
                    change={(id) => {
					}}>
                    </PageBannerComponent>
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
                        <Link className="text-white"
                            to={"/" + getAssetForUrl(data.data.group.assetGroup || "") + "/technische-kennzahlen/" + pathParam.seoTag + "/"}
                            onClick={() => trigInfonline(guessInfonlineSection(), 'technischeKennzahlen')}>
                            Techn. Kennzahlen
                        </Link>,
                        <Link className="text-white" onClick={() => trigInfonline(guessInfonlineSection(), 'kursvergleich')}
                            to={{
                                key: 'chart',
                                pathname: "/" + getAssetForUrl(data.data.group.assetGroup).toLowerCase() + "/kurse/" + pathParam.seoTag + "/",
                                hash: '#chart',
                                state: getInstrumentIdByExchnageCode(data.data.group, location)
                            }}>
                            Kursvergleich letzte Handelstage
                        </Link>,
					    <>
                        {data.data.group.underlying &&
                            <a className="text-white" href='#zugehorige-produkte'>
                                Zugehörige
                            </a>
                        }
                        </>
                    ]} />
                    <CommodityQuoteAndExchangeSection instrumentId={getInstrumentIdByExchnageCode(data.data.group, location)} instrumentGroup={data.data.group} ref={childRef}/>
                    <TradePredictionSection instrumentGroup={data.data.group} />
                    {
                        data.data.group.underlying &&
                        <ShareToolsComponent group={data.data.group} />
                    }
                    {data.data.group &&
                        <PortfolioStatisticsPortraitComponent group={data.data.group} />
                    }
                    {
                        data.data.group.name && data.data.group.isin &&
                        <NewsAssetPageSection groupName={data.data.group.name} isin={data.data.group.isin} title="Rohshtoff Nachrichten" />
                    }
                </>
            }
        </>
    );
}

interface CommodityPageState {
    currentInstrumentId: number;
}

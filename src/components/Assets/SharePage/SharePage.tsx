import { useQuery } from '@apollo/client';
import { GET_ASSET_PAGE } from "../../../graphql/query";
import { Link, useParams } from 'react-router-dom';
import { NewsAssetPageSection, PageBannerComponent } from "../../common";
import { Spinner } from "react-bootstrap";
import { useEffect, useRef } from "react";
import { AssetGroup, Query } from "../../../generated/graphql";
import { loader } from "graphql.macro";
import { ShareCompanyComponent } from "./components/ShareCompanyComponent/ShareCompanyComponent";
import { ShareToolsComponent } from "./components/ShareToolsComponent";
import { ShareQuoteAndExchangeSection } from './ShareQuoteAndExchangeSection';
import { TradePredictionSection } from "../../common/asset/TradePredictionSection/TradePredictionSection";
import { ShareAnalysesReportComponent } from "./components/ShareAnalysesReportComponent/ShareAnalysesReportComponent";
import { useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { Page404 } from 'components/common/page404/Page404';
import { guessInfonlineSection, trigInfonline } from 'components/common/InfonlineService';
import { getInstrumentIdByExchnageCode, SECTIONS } from 'utils';
import "./SharePage.scss";
import keycloak from 'keycloak';
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from 'components/common/TargetingService';
import { HorizontalNaviationBar } from "../../common/horizontal-navigation-bar/HorizontalNaviationBar";
import { getAssetForUrl } from 'components/profile/utils';

interface Child {
    changeInstrument: (id: number) => void;
}

export const SharePage = () => {
    let location = useLocation();
    const pathParam = useParams<{ section: string, seoTag: string, additionalSection: string }>();
    const seoTag = pathParam.seoTag;
    // const [state, setState] = useState<SharePageState>({currentInstrumentId: 0});

    let childRef = useRef<Child>();
    let childRefPred = useRef<Child>();

    useEffect(() => {
        trigInfonline("shareportrait", "portrait_page")
    }, [])

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
        skip: !seoTag
    });

    const data = useQuery<Query>(loader('./getSharePage.graphql'), {
        skip: asset.loading || (!asset.loading && asset.data.assetPage.assetGroup !== AssetGroup.Share) || !asset.data?.assetPage?.groupId,
        variables: { groupId: asset.data?.assetPage?.groupId },
    });

    if (asset.loading || data.loading)
        return (
            <div className={"mt-4 d-flex justify-content-center"} style={{ height: "70px" }}><Spinner animation="border" /></div>
        );

    if (asset.data.assetPage.assetGroup !== AssetGroup.Share
        && data?.data?.group?.content?.length && data?.data?.group?.content.length > 0) {
        return <Page404 />
    }

    if (!SECTIONS.includes(pathParam.section)) {
        return (<Page404 />)
    }

    { (asset.loading || data.loading) && <div className={"p-1"} style={{ height: "70px" }}><Spinner animation="border" /></div> }

    return (
        <>
            {data && data.data && data.data.group &&
                <>
                    {asset.data.assetPage.robots.index && asset.data.assetPage.robots.follow ?
                        <Helmet>
                            <title>{`${data.data.group?.name} - ${data.data.group?.wkn ? data.data.group?.wkn + ' - ' : ''} ${data.data.group?.isin} - Kurs - Chart - News - Analysen`}</title>
                            <meta name="description"
                                content={`Portrait der ${data.data.group?.name} - WKN ${data.data.group?.wkn}, ISIN ${data.data.group?.isin} - Kurse, Chart, Kennzahlen, Dividenden ✔, News, Analysen ➨ bei finanztreff.de topaktuell und kostenlos!`} />
                            <meta name="keywords"
                                content={`Ausführliches Aktienportrait ${data.data.group?.name}, WKN ${data.data.group?.wkn}, ISIN ${data.data.group?.isin} - finanztreff: Aktienkurse, Realtime Börsenkurse, Performance, Chart und Chartanalyse, Aktienmarkt, Aktienanalyse, Aktienempfehlungen, Kennzahlen, Dividenden, Nachrichten, Times, Historie, Kursvergleich, Monte Carlo`} />
                        </Helmet>
                        :
                        <Helmet>
                            <meta name="Robots" content="NOINDEX,NOFOLLOW" />
                        </Helmet>
                    }
                    <>
                        <Helmet>
                            <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated), data.data.group.wkn, data.data.group.isin, data.data.group.assetType?.name, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                            <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
                        </Helmet>
                    </>
                    <PageBannerComponent group={data?.data?.group} assetClass="Aktie" className={"banner-share"} assetClassName={"aktie"}
                        change={id => { instrumentChange(id); trigInfonline("shareportrait", 'borsenplatze'); }}>
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
                            <Link className="text-white"
                                to={"/" + getAssetForUrl(data.data.group.assetGroup).toLowerCase() + "/fundamantale-kennzahlen/" + pathParam.seoTag + "/"}
                                onClick={() => trigInfonline(guessInfonlineSection(), 'fundamentaleKennzahlen')}>
                                Fund. Kennzahlen
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
                            <> {data.data.group.company &&
                                <Link className="text-white" to={"/" + getAssetForUrl(data.data.group.assetGroup).toLowerCase() + "/guv/" + pathParam.seoTag + "/"} onClick={() => { trigInfonline(guessInfonlineSection(), 'guvCashflow') }}>
                                    GuV &amp; Cashflow
                                </Link>
                            }</>,
                            <Link className="text-white" to={"/" + getAssetForUrl(data.data.group.assetGroup).toLowerCase() + "/rating/" + pathParam.seoTag + "/"} onClick={() => trigInfonline(guessInfonlineSection(), 'theScreenerRating')}>
                                theScreener Rating
                            </Link>,
                            <Link className="text-white"
                                to={"/" + getAssetForUrl(data.data.group.assetGroup || "") + "/analysen/" + pathParam.seoTag + "/"}
                                onClick={() => trigInfonline(guessInfonlineSection(), 'analysenKursziele')}>
                                Analysen & Kursziele
                            </Link>,
                            <> {data.data.group.company &&
                                <Link className="text-white" to={"/" + getAssetForUrl(data.data.group.assetGroup).toLowerCase() + "/bilanz/" + pathParam.seoTag + "/"} onClick={() => { trigInfonline(guessInfonlineSection(), 'bilanz') }}>
                                    Bilanz
                                </Link>
                            }</>,
                            <> {data.data.group.company &&
                                <Link className="text-white" to={"/" + getAssetForUrl(data.data.group.assetGroup).toLowerCase() + "/unternehmensprofil/" + pathParam.seoTag + "/"} onClick={() => trigInfonline(guessInfonlineSection(), 'unternehmensprofil')}>
                                    Unternehmensprofil
                                </Link>
                            }</>,
                            ,
                            <>
                            {data.data.group.underlying &&
                                <a className="text-white" href='#zugehorige-produkte'>
                                    Zugehörige
                                </a>
                            }
                            </>
                        ]} />
                    </PageBannerComponent>
                    <ShareQuoteAndExchangeSection instrumentId={getInstrumentIdByExchnageCode(data.data.group, location)} instrumentGroup={data.data.group} ref={childRef} />
                    <TradePredictionSection instrumentId={getInstrumentIdByExchnageCode(data.data.group, location)} instrumentGroup={data.data.group} ref={childRefPred} />
                    {
                        data.data.group.name && data.data.group.isin &&
                        <NewsAssetPageSection groupName={data.data.group.name} isin={data.data.group.isin} />
                    }
                    <ShareAnalysesReportComponent instrumentGroup={data.data.group}/>
                    {data.data.group.underlying === true && <ShareToolsComponent group={data.data.group} />}
                    <ShareCompanyComponent group={data.data.group} instrumentId={getInstrumentIdByExchnageCode(data.data.group, location)} />
                </>
            }
        </>
    );
}

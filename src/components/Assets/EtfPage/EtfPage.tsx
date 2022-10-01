import { useQuery } from "@apollo/client";
import { NewsAssetPageSection, PageBannerComponent } from "components/common";
import { AssetGroup, Query } from "generated/graphql";
import { loader } from "graphql.macro";
import { GET_ASSET_PAGE } from "graphql/query";
import { useEffect, useRef } from "react";
import { Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { EtfQuoteAndExchangeSection } from "./EtfQuoteAndExchangeSection";
import { useLocation } from 'react-router-dom';
import { guessInfonlineSection, trigInfonline } from "../../common/InfonlineService";
import { Helmet } from "react-helmet";
import { Page404 } from "components/common/page404/Page404";
import { getInstrumentIdByExchnageCode, SECTIONS } from "utils";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from "components/common/TargetingService";
import keycloak from "keycloak";
import { HorizontalNaviationBar } from "components/common/horizontal-navigation-bar/HorizontalNaviationBar";
import { getAssetForUrl } from "components/profile/utils";

interface Child {
    changeInstrument: (id: number) => void;
}

export const EtfPage = () => {
    let location = useLocation();
    const pathParam = useParams<{ seoTag: string, section: string }>();
    const seoTag = pathParam.seoTag;

    useEffect(() => {
        trigInfonline(guessInfonlineSection(), "portrait_page")
    }, [])

    let childRef = useRef<Child>();
    const instrumentChange = (instrumentId: number) => {
        if (childRef && childRef.current) {
            childRef.current.changeInstrument(instrumentId);
        }
    };

    const asset = useQuery(GET_ASSET_PAGE, {
        variables: { seoTag: seoTag },
        skip: !seoTag
    });


    const data = useQuery<Query>(loader('./getEtfPage.graphql'), {
        skip: asset.loading || (!asset.loading && asset.data.assetPage.assetGroup !== AssetGroup.Etf),
        variables: { groupId: asset.data?.assetPage?.groupId },
    });

    if (asset.loading || data.loading)
        return (
            <div className={"mt-4 d-flex justify-content-center"} style={{ height: "70px" }}><Spinner animation="border" /></div>
        );

    if (asset.data.assetPage.assetGroup !== AssetGroup.Etf
        && data?.data?.group?.content?.length && data?.data?.group?.content.length > 0) {
        return (<Page404 />)
    }

    if (!SECTIONS.includes(pathParam.section)) {
        return (<Page404 />)
    }

    return (
        <>
            {
                data && data.data?.group &&
                <>
                    {asset.data.assetPage.robots.index && asset.data.assetPage.robots.follow ?
                        <Helmet><title>{`${data.data.group?.name} - ${data.data.group?.wkn ? data.data.group?.wkn + ' - ' : ''} ${data.data.group?.isin} - Kurs - Chart - Performance`}</title>
                            <meta name="description"
                                content={`Überblick des ETF ${data.data.group?.name} - WKN ${data.data.group?.wkn}, ISIN ${data.data.group?.isin}, Kursvergleich, Performance, Risiko, Anlageidee ➨ bei finanztreff.de topaktuell und kostenlos!`} />
                            <meta name="keywords"
                                content={`Ausführliches ETF-Portrait des ${data.data.group?.name}', WKN ${data.data.group?.wkn}, ISIN ${data.data.group?.isin} - finanztreff: Exchange Traded Funds, ETFs, ETF Kurse, Bester ETF, ETF Aktienfonds, ETF Fonds`} />
                        </Helmet> :
                        <Helmet><meta name="Robots" content="NOINDEX,NOFOLLOW" /></Helmet>
                    }
                </>
            }
            <>
                <Helmet>
                    <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated), data.data?.group?.wkn, data.data?.group?.isin, data.data?.group?.assetType?.name, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                    <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
                </Helmet>
            </>
            {(asset.loading || data.loading) && <div className={"p-1"} style={{ height: "70px" }}><Spinner animation="border" /></div>}
            {!data.loading && data?.data?.group != null && data?.data?.group.id != null &&
                <>
                    <PageBannerComponent group={data?.data?.group} assetClass={asset.data.assetPage.assetGroup}
                        assetClassName={asset.data.assetPage.assetGroup.toLowerCase()}
                        assetTypeGroupName={data.data.group.assetType?.name + " "} change={id => {
                            // trigInfonline("etfPortrait", 'borsenplatze')
                            instrumentChange(id)
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
                        {data.data.group.etf?.investmentConcept &&
                            <a className="text-white" href='#anlageidee'>
                                Anlageidee
                            </a>
                        }
                        </>,
                    ]} />
                    <EtfQuoteAndExchangeSection instrumentId={getInstrumentIdByExchnageCode(data.data.group, location)} instrumentGroup={data.data.group} />
                    {
                        data.data.group.name && data.data.group.isin &&
                        <NewsAssetPageSection groupName={data.data.group.name} isin={data.data.group.isin} title="Etf Nachrichten" />
                    }
                </>
            }
        </>
    );
}

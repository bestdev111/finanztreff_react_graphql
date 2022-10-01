import { useQuery } from "@apollo/client";
import { NewsAssetPageSection, PageBannerComponent } from "components/common";
import { AssetGroup, Query } from "generated/graphql";
import { loader } from "graphql.macro";
import { GET_ASSET_PAGE } from "graphql/query";
import { useEffect, useRef } from "react";
import { Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { FundInfoRow } from "./FundInfoRow";
import { FundsQuoteAndExchangeSection } from "./FundsQuoteAndExchangeSection";
import { useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { guessInfonlineSection, trigInfonline } from "components/common/InfonlineService";
import { Page404 } from "components/common/page404/Page404";
import { getInstrumentIdByExchnageCode } from "utils";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from "components/common/TargetingService";
import keycloak from "keycloak";
import { HorizontalNaviationBar } from "components/common/horizontal-navigation-bar/HorizontalNaviationBar";
import { getAssetForUrl } from "components/profile/utils";

interface Child {
    changeInstrument: (id: number) => void;
}

export const FundsPage = () => {
    let location = useLocation();
    const pathParam = useParams<{ seoTag: string }>();
    const seoTag = pathParam.seoTag;

    let childRef = useRef<Child>();
    const instrumentChange = (instrumentId: number) => {
        if (childRef && childRef.current) {
            childRef.current.changeInstrument(instrumentId);
        }
    };

    useEffect(() => {
        trigInfonline(guessInfonlineSection(), "portrait_page")
    }, [])

    const asset = useQuery(GET_ASSET_PAGE, {
        variables: { seoTag: seoTag },
        skip: !seoTag
    });

    const data = useQuery<Query>(loader('./getFundsPage.graphql'), {
        skip: asset.loading || (!asset.loading && asset.data.assetPage.assetGroup !== AssetGroup.Fund),
        variables: { groupId: asset.data?.assetPage?.groupId },
    });

    if (asset.loading || data.loading)
        return (
            <div className={"mt-4 d-flex justify-content-center"} style={{ height: "70px" }}><Spinner animation="border" /></div>
        );

    if (asset.data.assetPage.assetGroup !== AssetGroup.Fund
        && data?.data?.group?.content?.length && data?.data?.group?.content.length > 0) {
        return (<Page404 />)
    }

    return (
        <>
            {
                data && data.data?.group && <>
                    {asset.data.assetPage.robots.index && asset.data.assetPage.robots.follow ?
                        <Helmet>
                            <title>{`${data.data.group?.name} - ${data.data.group?.wkn ? data.data.group?.wkn + ' - ' : ''} ${data.data.group?.isin} - Kurs - Chart - Performance`}</title>
                            <meta name="description"
                                content={`Überblick des Fonds ${data.data.group?.name} - WKN ${data.data.group?.wkn}, ISIN ${data.data.group?.isin}, Kursvergleich, Gebühren, TER ✔, Anlageidee ➨ bei finanztreff.de topaktuell und kostenlos!`} />
                            <meta name="keywords"
                                content={`Ausführliches Fondsportrait ${data.data.group?.name}, WKN ${data.data.group?.wkn}, ISIN ${data.data.group?.isin} - finanztreff: Fonds, Aktienfonds, Investmentfonds, Immobilienfonds, Geldmarktfonds, wertgesicherte Fonds, Mischfonds, Rentenfonds, Realtime Börsenkurse, Chart, Chartanalyse, Kennzahlen, Times, Historie, Kursvergleich`} />
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
                    <PageBannerComponent group={data?.data?.group} assetClass={asset.data.assetPage.assetGroup} className={"banner-share"} fundType={data.data.group.fund?.type?.name || "FUND"}
                        assetClassName={asset.data.assetPage.assetGroup.toLowerCase()} change={id => instrumentChange(id)}>
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
                        {data.data.group.fund?.portfolios &&
                            <a className="text-white" href='#assetallocation'>
                                Asset Allocation
                            </a>
                        }
                        </>,
					    <>
                        {data.data.group.fund?.investmentConcept &&
                            <a className="text-white" href='#anlageidee'>
                                Anlageidee
                            </a>
                        }
                        </>,
					    <>
                        {data && data.data && data.data.group && data.data.group.alternativeFundTranches && data.data.group.alternativeFundTranches.length > 0 &&
                            <a className="text-white" href='#anteilsklassen'>
                                Anteilsklassen
                            </a>
                        }
                        </>
                    ]} />
                    {
                        data.data && data.data.group && data.data.group.alternativeFundTranches &&
                        <FundInfoRow alternativeFundTranches={data.data?.group?.alternativeFundTranches} />
                    }
                    {data.data && data.data.group && data.data.group.fund &&
                        <FundsQuoteAndExchangeSection instrumentId={getInstrumentIdByExchnageCode(data.data.group, location)} instrumentGroup={data.data.group} />
                    }
                    {
                        data.data.group.name && data.data.group.isin &&
                        <NewsAssetPageSection groupName={data.data.group.name} isin={data.data.group.isin} title="Fonds Nachrichten" />
                    }
                </>
            }
        </>
    );
}

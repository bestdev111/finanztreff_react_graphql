import { useQuery } from '@apollo/client';
import { GET_ASSET_PAGE } from "../../../graphql/query";
import { Link, useParams } from 'react-router-dom';
import { NewsAssetPageSection, PageBannerComponent } from "../../common";
import { Spinner } from "react-bootstrap";
import React, { useRef } from "react";
import { AssetGroup, Query } from "../../../generated/graphql";
import { loader } from "graphql.macro";
import { TradePredictionSection } from "../../common/asset/TradePredictionSection/TradePredictionSection";
import { useLocation } from 'react-router-dom';
import { FutureQuoteAndExchangeSection } from './FutureQuoteAndExchangeSection';
import { Page404 } from 'components/common/page404/Page404';
import {getInstrumentIdByExchnageCode, SECTIONS} from 'utils';
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from 'components/common/TargetingService';
import keycloak from 'keycloak';
import { Helmet } from 'react-helmet';
import { HorizontalNaviationBar } from 'components/common/horizontal-navigation-bar/HorizontalNaviationBar';
import { trigInfonline, guessInfonlineSection } from 'components/common/InfonlineService';
import { getAssetForUrl } from 'components/profile/utils';

interface Child {
    changeInstrument: (id: number) => void;
}

export const FuturePage = () => {
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
        skip: !seoTag
    });

    const data = useQuery<Query>(loader('./getFuturePage.graphql'), {
        skip: asset.loading || (!asset.loading && asset.data.assetPage.assetGroup !== AssetGroup.Fut) || !asset.data?.assetPage?.groupId,
        variables: { groupId: asset.data?.assetPage?.groupId },
    });

    if (asset.loading || data.loading)
        return (
            <div className={"mt-4 d-flex justify-content-center"} style={{ height: "70px" }}><Spinner animation="border" /></div>
        );

    if (asset.data.assetPage.assetGroup !== AssetGroup.Fut
        && data?.data?.group?.content?.length && data?.data?.group?.content.length > 0) {
        return (<Page404/>)
    }
    if (!SECTIONS.includes(pathParam.section)) {
        return (<Page404/>)
    }
    return (
        <>
            <>
                <Helmet>
                    <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated), data.data?.group?.wkn, data.data?.group?.isin, data.data?.group?.assetType?.name,localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                    <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
                </Helmet>
            </>
            {(asset.loading || data.loading) && <div className={"p-1"} style={{ height: "70px" }}><Spinner animation="border" /></div>}
            {!data.loading && data?.data?.group != null && data?.data?.group.id != null &&
                <>
                    <PageBannerComponent group={data?.data?.group} assetClass="Future" className={"banner-share"} assetClassName={"future"}
                        change={id => instrumentChange(id)}
                    /*change={(id => setState({currentInstrumentId: id}))}*/>
                        {/* <PageBannerSubNavigationComponent /> */}
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
                    ]} />
                    <FutureQuoteAndExchangeSection instrumentId={getInstrumentIdByExchnageCode(data.data.group, location)} instrumentGroup={data.data.group} ref={childRef} />
                    <TradePredictionSection instrumentId={getInstrumentIdByExchnageCode(data.data.group, location)} instrumentGroup={data.data.group} ref={childRefPred} />
                    {
                        data.data.group.name && data.data.group.isin &&
                        <NewsAssetPageSection groupName={data.data.group.name} isin={data.data.group.isin} />
                    }
                </>
            }
        </>
    );
}

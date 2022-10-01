import { useQuery } from "@apollo/client";
import { NewsAssetPageSection, PageBannerComponent } from "components/common";
import { Page404 } from "components/common/page404/Page404";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from "components/common/TargetingService";
import { AssetGroup, Query } from "generated/graphql";
import { loader } from "graphql.macro";
import { GET_ASSET_PAGE } from "graphql/query";
import keycloak from "keycloak";
import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { EtcAdnEtnQuoteAndExchangeSection } from "./EtcAdnEtnQuoteAndExchangeSection";
import {SECTIONS} from "../../../utils";

export const EtcAdnEtnPage = () => {
    const pathParam = useParams<{ seoTag: string, section: string }>();
    const seoTag = pathParam.seoTag;
    const [state, setState] = useState<EtcAdnEtnPageState>({currentInstrumentId: 0});
    const asset = useQuery(GET_ASSET_PAGE, {
        variables: { seoTag: seoTag },
    });

    const data = useQuery<Query>(loader('./getEtcAdnEtnPage.graphql'), {
        skip: asset.loading || (!asset.loading && (asset.data.assetPage.assetGroup !== AssetGroup.Etc && asset.data.assetPage.assetGroup !== AssetGroup.Etn)
            ),
        variables: { groupId: asset.data?.assetPage?.groupId },
    });

    if(asset.loading || data.loading)
        return (
            <div className={"mt-4 d-flex justify-content-center"} style={{ height: "70px" }}><Spinner animation="border" /></div>
        );

    if ((asset.data.assetPage.assetGroup !== AssetGroup.Etc && asset.data.assetPage.assetGroup !== AssetGroup.Etn)
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
                    <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated), data.data?.group?.wkn, data.data?.group?.isin, data.data?.group?.assetType?.name, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                    <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
                </Helmet>
            </>
            { (asset.loading || data.loading) && <div className={"p-1"} style={{height: "70px"}}><Spinner animation="border"/></div>}
            { !data.loading && data?.data?.group != null && data?.data?.group.id != null &&
            <>
                <PageBannerComponent group={data?.data?.group} 
                    assetClass={asset.data.assetPage.assetGroup} 
                    className={"banner-share"} 
                    assetClassName={asset.data.assetPage.assetGroup.toLowerCase()}
                    /*change={(id => setState({currentInstrumentId: id}))}*/>
                </PageBannerComponent>
                <EtcAdnEtnQuoteAndExchangeSection instrument={data.data.group.content[state.currentInstrumentId]} instrumentGroup={data.data.group} />
                {
                    data.data.group.name && data.data.group.isin &&
                        <NewsAssetPageSection groupName={data.data.group.name} isin={data.data.group.isin} title={ asset.data.assetPage.assetGroup + " Nachrichten"}/>
                }
            </>
            }
        </>
    );
}

interface EtcAdnEtnPageState {
    currentInstrumentId: number;
}

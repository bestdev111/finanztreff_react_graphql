import React, { useState } from "react";
import { ALL_SELECTED, SHARE_SEARCH_CARDS, ShareSearchCarousel, ShareSearchState } from "../search/ShareSearch";
import { Period, Query } from "../../../generated/graphql";
import ShareSearchContext, { ShareSearchContextProps } from "../search/ShareSearchContext";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { Container, Spinner } from "react-bootstrap";
import SvgImage from "../../common/image/SvgImage";

export const ShareOverviewPerformance = () => {
    let { loading } = useQuery<Query>(loader('../search/getShareSearchMetaData.graphql'));
    let { data: regionsData } = useQuery<Query>(loader('../search/getShareRegions.graphql'))
    const [state, setState] = useState<ShareSearchState>({
        searchProps: {
            regionId: null,
            period: Period.Last_1Year,
            trends: [],
            ranges: [],
            marketCapitalization: null
        },
        cards: SHARE_SEARCH_CARDS,
        category: ALL_SELECTED
    })

    let regionsArr: any = [{ id: null, name: 'Alle' }];
    regionsArr = regionsArr.concat(regionsData?.regions);
    const value: ShareSearchContextProps = {
        shareRegions: (regionsData && regionsArr) || []
    }

    if (loading) {
        return (
            <div className="text-center py-2">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <ShareSearchContext.Provider value={value}>
            <div className={"mt-n4 mt-md-0"}>
                <div className={"ml-md-3 mt-4"}>
                    <div className={"my-1 ml-2 ml-md-0 d-flex share-trading-ideas-heading"}>
                        <SvgImage icon="icon_bulb_trading_ideen.svg" spanClass="" imgClass="trading-ideas-icon-home-page"
                            width="28" />
                        <h2 className="trading-ideas-heading font-family-roboto-slab">Trading-Ideen</h2>
                    </div>
                </div>
                <Container className="px-3">
                    <ShareSearchCarousel setState={setState} cards={state.cards} props={state.searchProps} />
                </Container>
            </div>
        </ShareSearchContext.Provider>
    )
}

export default ShareOverviewPerformance

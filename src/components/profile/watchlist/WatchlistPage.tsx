import { WatchlistBannerComponent, RankingAllPortfoliosComponent } from '../index';
import { Spinner } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Query } from "../../../graphql/types";
import { WatchlistContentComponent } from './WatchlistContentComponent';
import { GET_USER_PROFILE } from '../query';
import {useEffect} from "react";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable, generatePVariable, generateDataArray } from 'components/common/TargetingService';
import keycloak from 'keycloak';
import { Helmet } from 'react-helmet';
import { calculatePortfoliosTotal } from '../utils';
import { numberFormat } from 'utils';

export function WatchlistPage() {
    const pathParam = useParams<{ id: string; }>();
    const id = parseInt(pathParam.id);
    let { loading, data, refetch } = useQuery<Query>(GET_USER_PROFILE,{ fetchPolicy: 'network-only' });

    useEffect(() => {
        trigInfonline(guessInfonlineSection(), "watchlist_page");
    }, [])

    if (loading) {
        return <div className={"p-1 text-center mt-5"} style={{height: "70px"}}><Spinner animation="border"/></div>;
    }

    const profile = data?.user?.profile;
    if (!profile) {
        window.location.href = '/mein-finanztreff/';
        return <></>;
    }
    let watchlist = data?.user?.profile?.watchlists?.filter(watchlist => (watchlist != null) && (watchlist.id === id))[0];
    if (!watchlist) {
        window.location.href = '/mein-finanztreff/';
        return <></>;
    }

    let price = profile?.portfolios?.filter(portfolio => portfolio.inMasterPortfolio)
    let watchlistArray = profile?.watchlists
    if(price){
        localStorage.setItem('pVariable',JSON.stringify(generatePVariable(numberFormat(calculatePortfoliosTotal(price)[2]), price.length)));
        localStorage.setItem('mfVariable', JSON.stringify(generateDataArray(price,watchlistArray)));
    }
    return (
        <>
            <Helmet>
                    {price &&
                        <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated), null, null, null, generatePVariable(numberFormat(calculatePortfoliosTotal(price)[2]), price.length), generateDataArray(price,watchlistArray))) + `;`}</script>
                    }
                    <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
            </Helmet>
            <WatchlistBannerComponent
                watchlist={watchlist}
                watchlists={data?.user?.profile?.watchlists || []}
                refreshTrigger={() => refetch()}
            />
            <RankingAllPortfoliosComponent />
            <WatchlistContentComponent watchlist={watchlist} refreshTrigger={() => refetch()} profile={profile} />
        </>

    );
}

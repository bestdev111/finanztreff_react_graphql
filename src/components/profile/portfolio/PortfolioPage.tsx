import { Spinner } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { PortfolioPageContent } from '../common';
import { Query } from '../../../graphql/types';
import { GET_PORTFOLIO_PERFORMANCE, GET_USER_PROFILE } from '../query';
import { PortfolioBanner } from './PortfolioBanner/PortfolioBanner';
import {useEffect} from "react";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable, generatePVariable, generateDataArray } from "components/common/TargetingService";
import keycloak from "keycloak";
import { Helmet } from "react-helmet";
import { calculatePortfoliosTotal } from "../utils";
import { numberFormat } from "utils";
import { PortfolioFooter } from "./PortfolioBanner/PortfolioFooter";

export function PortfolioPage({realportfolio} : {realportfolio?: boolean}) {
    const pathParam = useParams<{ id: string; }>();
    const id = parseInt(pathParam.id);

    let { loading, data, refetch } = useQuery<Query>(GET_USER_PROFILE,{ fetchPolicy: 'network-only' });

    let { loading: loadingPerf, data: dataPerf } = useQuery<Query>(
        GET_PORTFOLIO_PERFORMANCE,
        {
            variables: {
                id: id
            }
        }
    );

    useEffect(() => {
        trigInfonline("mf_portfolios", "portfolio_page");
    }, [])

    if (loading || loadingPerf) {
        return <div className={"p-1 text-center mt-5"} style={{ height: "70px" }}><Spinner animation="border" /></div>;
    }

    // const performanceEntries = portfolio.performanceEntries;
    const performanceEntries = dataPerf ? dataPerf.portfolioPerformance : [];

    const profile = data?.user?.profile;
    if (!profile) {
        window.location.href = '/mein-finanztreff/';
        return <></>;
    }
    let portfolio = profile.portfolios?.filter(portfolio => (portfolio != null) && (portfolio.id === id))[0];
    if (!portfolio) {
        window.location.href = '/mein-finanztreff/';
        return <></>;
    }

    let price = profile?.portfolios?.filter(portfolio => portfolio.inMasterPortfolio)
    let watchlist = profile?.watchlists
    if(price){
        localStorage.setItem('pVariable',JSON.stringify(generatePVariable(numberFormat(calculatePortfoliosTotal(price)[2]), price.length)));
        localStorage.setItem('mfVariable', JSON.stringify(generateDataArray(price,watchlist)));
    }
    return (
        <>
            <Helmet>
                    {price &&
                        <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated), null, null, null, generatePVariable(numberFormat(calculatePortfoliosTotal(price)[2]), price.length), generateDataArray(price,watchlist))) + `;`}</script>
                    }
                    <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
            </Helmet>
            <PortfolioBanner
                portfolio={portfolio}
                performanceEntries = {performanceEntries}
                portfolios={data?.user?.profile?.portfolios!}
                refreshTrigger={async () => await refetch()}
                realportfolio={realportfolio}
            />
            {/* <RankingAllPortfoliosComponent /> */}
            <PortfolioPageContent portfolio={portfolio} performanceEntries={performanceEntries} refreshTrigger={async () => await refetch()} profile={profile} realportfolio={realportfolio}/>
            <PortfolioFooter
                portfolio={portfolio}
                performanceEntries = {performanceEntries}
                portfolios={data?.user?.profile?.portfolios!}
                refreshTrigger={async () => await refetch()}
                realportfolio={realportfolio}
            />
        </>
    );
}

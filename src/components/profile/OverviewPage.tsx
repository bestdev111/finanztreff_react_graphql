import { OverviewBannerComponent, WatchlistsOverview, OverviewEmptyBannerComponent } from '.';
import { Spinner } from "react-bootstrap";
import { useQuery } from '@apollo/client';
import { GET_USER_PROFILE } from './query';
import { Query } from 'graphql/types';
import { useKeycloak } from '@react-keycloak/web';
import { UnauthenticatedBanner } from './unauthenticated-banner/UnauthenticatedBanner';
import { ImportAfterBanner } from './overview/overviewBanner/ImportAfterBanner';
import { PortfoliosOverview } from './overview/PortfoliosOverview/PortfoliosOverview';
import { LimitsOverview } from './overview/LimitsOverview/LimitsOverview';
import { useEffect } from "react";
import { guessInfonlineSection, trigInfonline } from "../common/InfonlineService";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable, generatePVariable, generateDataArray } from 'components/common/TargetingService';
import { Helmet } from 'react-helmet';
import { calculatePortfoliosTotal } from './utils';
import { numberFormat } from 'utils';

export function OverviewPage(props: { realportfolio?: boolean, page?: string }) {
    let { initialized, keycloak } = useKeycloak();
    let { loading, data, refetch } = useQuery<Query>(GET_USER_PROFILE,{ fetchPolicy: 'network-only' });

    useEffect(() => {
        trigInfonline(guessInfonlineSection(), "mf_page")
    }, [])

    if (!keycloak.authenticated) {
        return (
            <UnauthenticatedBanner />
        );
    }

    if (loading) {
        return (
            <div className="text-center py-2"><Spinner animation="border" /></div>
        )
    }


    const profile = data?.user?.profile;

    if (profile && ((profile.limits && profile.limits.length === 0) && (profile.watchlists && profile.watchlists.length === 0) && (profile.portfolios && profile.portfolios.length === 0))) {
        return (
            <OverviewEmptyBannerComponent refreshTrigger={() => refetch()} />
        )
    }

    let price = profile?.portfolios?.filter(portfolio => portfolio.inMasterPortfolio)
    let watchlist = profile?.watchlists

    if(price){
        localStorage.setItem('pVariable',JSON.stringify(generatePVariable(numberFormat(calculatePortfoliosTotal(price)[2]), price.length)));
        localStorage.setItem('mfVariable', JSON.stringify(generateDataArray(price,watchlist)));
    }

    if (props.page === "portfolios" && profile && profile.portfolios) {
        return (<>{
            profile && profile.portfolios.length > 0 ?
                <main>
                    <div className="fader"></div>
                    {data && (data.user?.username != null) &&
                        <>
                            <OverviewBannerComponent
                                page={"portfolios"}
                                userName={data.user?.username || ""}
                                portfolios={data.user?.profile?.portfolios || Array()}
                                refetch={() => refetch()}
                            />
                            <ImportAfterBanner />
                            <PortfoliosOverview portfolios={data.user?.profile?.portfolios || Array()}
                                refreshTrigger={() => refetch()} realportfolio={props.realportfolio} />
                            <Helmet>
                                {price &&
                                    <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated), null, null, null, generatePVariable(numberFormat(calculatePortfoliosTotal(price)[2]), price.length), generateDataArray(price,watchlist))) + `;`}</script>
                                }
                                <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
                            </Helmet>
                        </>
                    }
                </main>
                :
                <OverviewEmptyBannerComponent refreshTrigger={() => refetch()} />

        }</>);
    }


    if (props.page === "watchlists" && profile && profile.watchlists) {
        return (<>{
            profile && profile.watchlists.length > 0 ?
                <main>
                    <div className="fader"></div>
                    {data && (data.user?.username != null) &&
                        <>
                            <OverviewBannerComponent
                                page={"watchlists"}
                                userName={data.user?.username || ""}
                                watchlists={data.user?.profile?.watchlists || Array()}
                                refetch={() => refetch()}
                            />
                            <ImportAfterBanner />
                            <WatchlistsOverview
                                watchlists={data.user?.profile?.watchlists || Array()}
                                refreshTrigger={() => refetch()}
                            />
                            <Helmet>
                                {price &&
                                    <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated), null, null, null, generatePVariable(numberFormat(calculatePortfoliosTotal(price)[2]), price.length), generateDataArray(price,watchlist))) + `;`}</script>
                                }
                                <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
                            </Helmet>
                        </>
                    }
                </main>
                :
                <OverviewEmptyBannerComponent refreshTrigger={() => refetch()} />

        }</>);
    }


    return (
        <main>
            <div className="fader"></div>
            {data && data.user && (data.user.username != null) && (data.user.profile) &&
                <>
                    <OverviewBannerComponent
                        userName={data.user?.username || ""}
                        portfolios={data.user?.profile?.portfolios || Array()}
                        watchlists={data.user?.profile?.watchlists || Array()}
                        limits={data.user?.profile?.limits || []}
                        refetch={() => refetch()}
                    />
                    <ImportAfterBanner />
                    <PortfoliosOverview portfolios={data.user?.profile?.portfolios || Array()}
                        refreshTrigger={() => refetch()} realportfolio={props.realportfolio} />
                    <WatchlistsOverview
                        watchlists={data.user?.profile?.watchlists || Array()}
                        refreshTrigger={() => refetch()}
                    />
                    <LimitsOverview
                        refreshTrigger={() => refetch()}
                        profile={data.user.profile}
                        limits={data.user.profile?.limits || []} />
                    <Helmet>
                            {price &&
                                <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated), null, null, null, generatePVariable(numberFormat(calculatePortfoliosTotal(price)[2]), price.length), generateDataArray(price,watchlist))) + `;`}</script>
                            }
                            <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
                    </Helmet>
                </>
            }
        </main>
    );
}

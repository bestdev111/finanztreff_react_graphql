import {SharePage, IndexPage, OptionPage, CertificatePage} from './components';
import './App.css';
import {LayoutComponent} from './components';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {ReactKeycloakProvider} from '@react-keycloak/web';
// import ReactGA from 'react-ga';
import {creatApolloClient} from './graphql/client';
import keycloak from "./keycloak";
import { OverviewPage, PortfolioPage, WatchlistPage } from './components/profile';
import DerivativePage from "./components/derivative/DerivativePage";
import NewsPage from "./components/news/NewsPage";
import 'moment/locale/de';
import DerivativeBasiswert from "./components/derivative/DerivativeBasiswert";
import { AnalysesPage } from 'components/analyses/AnalysesPage';
import { IndexOverviewPage } from 'components/index/IndexOverviewPage';
import { CommodityOverviewPage } from 'components/commodity/CommodityOverviewPage';
import { CommodityPage } from 'components/Assets/CommodityPage/CommodityPage';
import { CurrencyOverviewPage } from 'components/devisen/CurrencyOverviewPage';
import { CurrencyPage } from 'components/Assets/CurrencyPage/CurrencyPage';
import ShareOverview from "./components/shares/overview/ShareOverview";
import { FundsPage } from 'components/Assets/FundsPage/FundsPage';
import { EtfPage } from 'components/Assets/EtfPage/EtfPage';
import { EtcAdnEtnPage } from 'components/Assets/EtcAdnEtnPage/EtcAdnEtnPage';
import { LimitsPage } from 'components/profile/LimitsPage/LimitsPage';
import { KnockPage } from 'components/Assets/KnockPage/KnockPage';
import { DerivativeSearch } from 'components/derivative/DerivativeSearch';
import { FundsSearch } from 'components/funds/FundSearchPage/FundsSearch';
import { EtfSearch } from "./components/etf/search/EtfSearch";
import { BondPortraitPage } from 'components/bond/BondPortrait/BondPortraitPage';
import { BondSearch } from 'components/bond/BondSearchPage/BondSearch';
import {ShareSearch} from 'components/shares/search/ShareSearch'
import { ApolloProvider } from '@apollo/client';
import { FuturePage } from 'components/Assets/FeaturePage/FuturePage';
import { Page404 } from 'components/common/page404/Page404';
import { MultiMarketPortraitPage } from 'components/Assets/MultiMarketPortraitPage/MultiMarketPortraitPage';
import { HomePage } from 'components/Home/HomePage';
import { SearchPage } from 'components/common/search/SearchPage';
import { NewsModal } from 'components/common/news/NewsModal/NewsModal';
import {ApplicationContextContext} from "./ApplicationContext";
import {useState} from "react";

function App() {
    // ReactGA.initialize('G-6PN9B2KGKM');
    // ReactGA.pageview(window.location.pathname + window.location.search2);
    let [pushActive, setPushActive] = useState<boolean>(true);

    return (
        <ReactKeycloakProvider authClient={keycloak}
                            LoadingComponent={<></>}
                            initOptions={{
                                flow: 'implicit', onLoad: 'check-sso', checkLoginIframe: true,
                                redirectUri: window.location.origin + '/mein-finanztreff/',
                                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
                            }}>
            <ApolloProvider client={creatApolloClient(keycloak)}>
                <ApplicationContextContext.Provider value={{pushActive, setPushActive}}>
                    <Router>
                        <LayoutComponent>
                            <Switch>
                                <Route exact path="/">
                                    <HomePage/>
                                </Route>
                                <Route exact path="/suche/">
                                    <SearchPage/>
                                </Route>
                                <Route strict path="/aktien/:section/:seoTag/">
                                    <main>
                                        <SharePage/>
                                    </main>
                                </Route>
                                <Route strict path="/future/:section/:seoTag/">
                                    <main><FuturePage/></main>
                                </Route>
                                <Route strict path="/fonds/:section/:seoTag/">
                                    <main><FundsPage/></main>
                                </Route>
                                <Route exact path="/fonds/suche/">
                                    <main><FundsSearch/></main>
                                </Route>
                                <Route strict path="/etf/:section/:seoTag/">
                                    <main><EtfPage/></main>
                                </Route>
                                <Route strict path="/etc/:section/:seoTag/">
                                    <main><EtcAdnEtnPage/></main>
                                </Route>
                                <Route exact path="/anleihen/suche/">
                                    <main><BondSearch /></main>
                                </Route>
                                <Route strict path="/anleihen/:section/:seoTag/">
                                    <main><BondPortraitPage /></main>
                                </Route>
                                <Route strict path="/geldmarktsatz/:section/:seoTag">
                                    <main><MultiMarketPortraitPage /></main>
                                </Route>
                                <Route strict path="/zertifikate/kurse/:seoTag/">
                                    <main><CertificatePage /></main>
                                </Route>
                                <Route exact path="/hebelprodukte/suche/" component={(props: any) => <DerivativeSearch {...props} />}/>
                                <Route exact path="/hebelprodukte/basiswert/">
                                    <DerivativeBasiswert/>
                                </Route>
                                <Route strict path="/hebelprodukte/kurse/:seoTag/">
                                    <main><KnockPage /></main>
                                </Route>
                                <Route path="/hebelprodukte/">
                                    <DerivativePage/>
                                </Route>
                                <Route strict path="/indizes/:section/:seoTag/">
                                    <main><IndexPage /></main>
                                </Route>
                                <Route strict path="/optionsschein/kurse/:seoTag/">
                                    <main><OptionPage /></main>
                                </Route>
                                <Route exact path="/indizes/">
                                    <main><IndexOverviewPage /></main>
                                </Route>
                                <Route exact path={"/etf/suche/"}>
                                    <main style={{overflowY: 'hidden'}}><EtfSearch/></main>
                                </Route>
                                <Route strict path="/aktien/suche/">
                                    <main style={{overflowY: 'hidden'}}><ShareSearch/></main>
                                </Route>
                                <Route exact path="/aktien/">
                                    <ShareOverview/>
                                </Route>
                                <Route strict path="/devisen/:section/:seoTag/">
                                    <main><CurrencyPage/></main>
                                </Route>
                                <Route exact path="/devisen/">
                                    <main><CurrencyOverviewPage/></main>
                                </Route>
                                <Route strict path="/rohstoffe/:section/:seoTag/">
                                    <main><CommodityPage/></main>
                                </Route>
                                <Route exact path="/rohstoffe/">
                                    <main><CommodityOverviewPage/></main>
                                </Route>
                                <Route path="/nachrichten/:id?">
                                    <main className = "overflow-remove"><NewsPage /></main>
                                </Route>
                                <Route exact path="/analysen/">
                                    <main className = "overflow-remove"><AnalysesPage /></main>
                                </Route>

                                <Route path="/mein-finanztreff/portfolio/:id">
                                    <main><PortfolioPage /></main>
                                </Route>
                                <Route path="/mein-finanztreff-realportfolios/portfolio/:id"> //test realportoflio
                                    <main><PortfolioPage realportfolio={true}/></main>
                                </Route>
                                <Route path="/mein-finanztreff/watchlist/:id">
                                    <main><WatchlistPage /></main>
                                </Route>
                                <Route exact path="/mein-finanztreff/portfolios/">
                                    <main><OverviewPage page={"portfolios"}  /></main>
                                </Route>
                                <Route exact path="/mein-finanztreff/watchlisten/">
                                    <main><OverviewPage page={"watchlists"}  /></main>
                                </Route>
                                <Route exact path="/mein-finanztreff/limits/">
                                    <main><LimitsPage /></main>
                                </Route>
                                <Route exact strict path="/mein-finanztreff/">
                                    <main><OverviewPage /></main>
                                </Route>
                                <Route exact path="/mein-finanztreff-realportfolios"> //test realportoflio
                                    <main><OverviewPage realportfolio={true}/></main>
                                </Route>
                                <Route>
                                    <Page404/>
                                </Route>
                            </Switch>
                        </LayoutComponent>
                    </Router>
                </ApplicationContextContext.Provider>
            </ApolloProvider>

        </ReactKeycloakProvider>
    );
}

export default App;

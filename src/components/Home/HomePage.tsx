import {
    Events,
    HotSection,
    Market,
    MarketSection,
    NewsOverview,
    TopFlopSection
} from '../index';
import {HostSectionAdvertisement} from "./HotSection/UserStatistics/HostSectionAdvertisement";
import {LatestAnalysisHomeSection} from './LatestAnalysesSection/LatestAnalysesHome';
import {useEffect} from "react";
import {Helmet} from "react-helmet";
import {trigInfonline} from "../common/InfonlineService";
import { TradingIdeasComponent } from './TradingIdeasComponent/TradingIdeasComponent';
import { LinkToOldSite } from './LinkToOldSite';
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from 'components/common/TargetingService';
import keycloak from 'keycloak';
import { IndexListSection } from './IndexListSection/IndexListSection';

// import {TradingIdeasComponent} from "./TradingIdeasComponent/TradingIdeasComponent";

export function HomePage() {

    useEffect(() => {
            trigInfonline('homepage', 'homepage')
        }, []
    )

    return (
        <main className={"home-page-wrapper"}>
            <Helmet>
                <title>finanztreff.de - Informieren & Investieren: Realtime Börsenkurse I Märkte I Trading-Ideen I
                    Analysen I Kostenlose Portfolios</title>
                <meta name="description"
                      content="Seit 1998 die Börse im Blick: Aktueller DAX, Aktien Tops & Flops, Zertifikate, Optionsscheine, Fonds, Devisen, Rohstoffe, aktuelle Termine, Analysen, Finanznachrichten. Kostenlose Portfolioverwaltung ✔ und Watchlist ➨ auf finanztreff.de topaktuell!"/>
                <meta name="keywords"
                      content="Aktie, Aktien, Analyse, Anleger, Anleihe, Anleihen, Börse, Börsenkurse, Future, Bundesanleihen, Chartanalyse, Derivate, Devisen, Dividenden, Empfehlungen, Finanzen, Fonds, Hebelprodukte, Indizes, IPO, ISIN, KAG, KGV, Kurs, Kurse, Lexikon, Markt, Nachrichten, Neuemissionen, Optionsschein, Optionsscheine, Realtime, Rendite, Rentenfonds, Termine, Währung, WKN, Xetra, Zertifikat, Zertifikate"/>
                <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated),null,null,null, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
            </Helmet>
            <div className="fader"></div>
            <section className="home-market-overview" style={{backgroundColor: '#383838'}}>
                <MarketSection title="Märkte"
                               inSharePage={false}
                               markets={markets}
                               showAdvertisement={true}
                               isChartColored={true}
                               className="px-2 px-lg-3 pt-2 pt-lg-4"
                               showExchangeLabelSlider={true}
                               showComodityTab={true} showCurrencyTab={true}
                />
                <IndexListSection/>
            </section>
            <LinkToOldSite/>
            <HotSection isSharePage={true} carouselIconColor={"white"} isHomePage={true} />
            <TradingIdeasComponent/>
            <HostSectionAdvertisement/>
            <NewsOverview isHomePage={true}/>
            <TopFlopSection showOtherTopsAndFlops={true} isHomePage={true}/>
            <Events/>
            <LatestAnalysisHomeSection/>
        </main>
    );
}

export let markets: Market[] = [
    {name: "Realtime", listId: "realtime_instruments"},
    {name: "Deutschland", listId: "germany_instruments"},
    {name: "Europa", listId: "europe_instruments"},
    {name: "Amerika", listId: "america_instruments"},
    {name: "Asien", listId: "asia_instruments"},
    {name: "Rohstoffe", listId: "commodity_instruments"},
    {name: "Devisen", listId: "currency_instruments"},
    {name: "Zinsen & Futures", listId: "zinsen_future_products"},
    //{name: "Krypto", listId: "crypto_instruments"},
    {name: "Aktionär Anlageprodukte", listId: "aktioner_instruments"}
];

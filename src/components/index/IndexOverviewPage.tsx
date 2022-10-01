import { BottomFeed, Market, MarketSection, TopFlopSection } from "components";
import { Breadcrumb, Container } from "react-bootstrap";
import './IndexOverviewPage.scss';
import { FindIndexSection } from './FindIndexSection/FindIndexSection';
import { AssetGroup } from "generated/graphql";
import { PerformancesComparisonSection } from "./PerformanceComparisonSection/PerformancesComparisonSection";
import AlternativeInvestmentsSection from "./AlternativeInvestmentsSection/AlternativeInvestmentsSection";
import AssetClassText from "../common/assetClassText/AssetClassText";
import { useEffect } from "react";
import { guessInfonlineSection, trigInfonline } from "../common/InfonlineService";
import { Helmet } from "react-helmet";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from "components/common/TargetingService";
import keycloak from "keycloak";
import { TopAndFlopSectionIndexOverview } from "./TopAndFlopInstrumentsSection/TopAndFlopSectionIndexOverview";

export function IndexOverviewPage() {

    useEffect(() => {
        trigInfonline(guessInfonlineSection(), "overview_page")
    }, []);

    return (
        <main className="page-container index-overview-page">
            <Helmet>
                <title>finanztreff.de - Index |Überblick |Wichtigste Aktienindizes | Aktueller DAX | Kurse | Historische Entwicklung</title>
                <meta name="description"
                    content="Indizes im Überblick: Neueste Kurse ✔, Tops Flops ✔, beste Aktien, Performancevergleich, Tools, aktuelle News und Marktberichte ➨ auf finanztreff.de topaktuell und kostenlos!" />
                <meta name="keywords"
                    content="Aktienindex, Länderindex, Branchenindex, Kryptoindex, Rohstoffindex, Rentenindex, Indexsuche, Tops, Flops, Indexperformance, Marktberichte, Einzelwerte" />
                <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated),null,null,null, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
            </Helmet>
            <div className="page-header home-market-overview pb-lg-5 pb-md-3" style={{ backgroundColor: '#383838' }} >
                <Container className="pt-3">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Index</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">Überblick</Breadcrumb.Item>
                    </Breadcrumb>
                </Container>
                <MarketSection
                    title="Index Überblick"
                    showAdvertisement={false}
                    isChartColored={false}
                    showExchangeLabelSlider={false}
                    markets={markets} />
            </div>
            <FindIndexSection />
            <TopAndFlopSectionIndexOverview />
            <PerformancesComparisonSection title="Index - Performances im Vergleich" listId="index_comparison_list" />
            <AlternativeInvestmentsSection title="ETN - Alternative investments" subtitle="Alternativ zum Investment in Indizes kann auch eine Anlage in ETN sinnvoll sein." />
            <section className="main-section news-overview">
                <Container className="px-0 px-md-2">
                    <h2 className="section-heading font-weight-bold ml-0 ml-md-2">
                        Marktberichte
                    </h2>
                    <BottomFeed />
                </Container>
            </section>
            <AssetClassText isDerivativePage={false} assetGroup={AssetGroup.Index} />
        </main>
    );
}

const markets: Market[] = [
    { name: "Realtime", listId: "realtime_instruments" },
    { name: "Deutschland", listId: "germany_instruments" },
    { name: "Europa", listId: "europe_instruments" },
    { name: "Amerika", listId: "america_instruments" },
    { name: "Asien", listId: "asia_instruments" },
    { name: "Krypto", listId: "crypto_instruments" },
    { name: "Aktionär Anlageprodukte", listId: "aktioner_instruments" }
];
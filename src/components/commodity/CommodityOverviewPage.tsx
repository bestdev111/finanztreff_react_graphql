import { BottomFeed, Market, MarketSection } from "components";
import {PerformancesComparisonSection} from "components/index/PerformanceComparisonSection/PerformancesComparisonSection";
import { Breadcrumb, Container } from "react-bootstrap";
import CommodityChartsSection from "./CommodityChartsSection/CommodityChartsSection";
import { CommodityIndicesSection } from "./CommodityIndicesSection/CommodityIndicesSection";
import { FindCommoditySection } from "./FindCommoditySection/FindCommoditySection";
import AssetClassText from "../common/assetClassText/AssetClassText";
import {AssetGroup} from "../../generated/graphql";
import './CommodityOverviewPage.scss'
import {useEffect} from "react";
import {guessInfonlineSection, trigInfonline} from "../common/InfonlineService";
import {Helmet} from "react-helmet";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from "components/common/TargetingService";
import keycloak from "keycloak";

export function CommodityOverviewPage() {

    useEffect(() => {
        trigInfonline(guessInfonlineSection(), "commodity_overview_page")
    }, [])

    return (
        <main className="page-container commodity-overview-page">
            <Helmet>
                <title>finanztreff.de - Rohstoffe | Überblick | Wichtigste Rohstoffe | Aktuelle Kurse | Gold | Silber | Öl</title>
                <meta name="description"
                      content= "Rohstoffe im Überblick: Alle Informationen zu Edelmetallen, aktuelle Kurse ✔, Rohstoff-Indizes, Performance im Vergleich, umfassende Rohstoff Nachrichten ➨ auf finanztreff.de topaktuell und kostenlos!"/>
                <meta name="keywords"
                      content="Rohstoffe, ETC, Rohstoffpreise, Rohstoffkurse, Edelmetalle, Industriemetalle, Agrarrohstoffe, Energie, Goldpreis, Silberpreis, Ölpreis"/>
                <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated),null,null,null, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
            </Helmet>
            <div className="page-header home-market-overview pb-lg-5 pb-md-3" style={{backgroundColor: '#383838'}} >
                <Container className="pt-3">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Rohstoffe</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">Überblick</Breadcrumb.Item>
                    </Breadcrumb>
                </Container>
                <MarketSection
                    markets={markets}
                    title="Rohstoffe Überblick"
                    showAdvertisement={false}
                    isChartColored={false}/>
            </div>
            <FindCommoditySection/>
            <CommodityIndicesSection insideTitle={false} className="mx-lg-3"/>
            <PerformancesComparisonSection title="Rohstoffe - Performances im Vergleich" listId={"commodity_comparison_list"}/>
            <CommodityChartsSection title="ETC nach Rohstoff"/>
            <section className="main-section news-overview">
                <Container className="px-0 px-md-2">
                    <h2 className="section-heading font-weight-bold ml-0 ml-md-2">
                        Rohstoff - Nachrichten  
                    </h2>
                    <BottomFeed/>
                </Container>
            </section>
            <AssetClassText isDerivativePage={false} assetGroup={AssetGroup.Comm}/>
        </main>
    );
}



let markets: Market[] = [
	{name: "Überblick", listId: "realtime_commodities"},
	{name: "Agrarprodukte", listId: "agro_products"},
	{name: "Industriemetalle", listId: "industrial_metals"},
	{name: "Edelmetalle", listId: "precious_metals"},
	{name: "Energie", listId: "energy"},
];

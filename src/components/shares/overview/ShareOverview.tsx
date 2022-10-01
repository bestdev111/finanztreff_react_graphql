import { Breadcrumb, Button, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { BottomFeed, HotSection, Market, MarketSection } from "../../Home";
import { AssetGroup } from "../../../generated/graphql";
import './ShareOverview.scss'
import ShareOverviewPerformance from "./ShareOverviewPerformance";
import SvgImage from "../../common/image/SvgImage";
import { useBootstrapBreakpoint } from "../../../hooks/useBootstrapBreakpoint";
import AssetClassText from "../../common/assetClassText/AssetClassText";
import { useEffect } from "react";
import { trigInfonline } from "../../common/InfonlineService";
import { Helmet } from "react-helmet";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from "components/common/TargetingService";
import keycloak from "keycloak";
import { TopAndFlopSection } from "./TopFlopInstrumentsSection/TopAndFlopSection";

export function ShareOverview() {
    useBootstrapBreakpoint({
        default: 3,
        md: 8,
        xl: 12
    });
    useEffect(() => {
        trigInfonline('aktienuberblick', 'aktienpage');
    }, []
    )

    return (
        <main className="page-container share-overview-page share-overview-wrapper">
            <Helmet>
                <title>finanztreff.de - Aktien | Überblick | Kurse| Performance | Unternehmen | Kennzahlen | Charts | News</title>
                <meta name="description"
                    content="Aktien im Überblick: Finden Sie die neuesten Aktienkurse ✔, Hot Aktien, Top Flop ✔, Vergleiche, Monitor, Handelssignale, IPO, Wissen ➨ auf finanztreff.de topaktuell!" />
                <meta name="keywords"
                    content="Aktien, Aktienkurse, Aktiensuche, Rating, Beste Aktien, Schlechteste Aktien, Tops, Flops, Kurse, Nachrichten, Marktberichte, Analysen, Empfehlungen und Kennzahlen für Aktien, Hot-Aktien, Meistgesuchte, Meistgehandelte, Trading-Ideen, Risiko, Upgrades, Downgrades" />
                <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated),null,null,null, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
            </Helmet>
            <div className="page-header home-market-overview pb-lg-5 pb-sm-3" style={{ backgroundColor: '#383838' }}>
                <Container className="pt-3 d-md-flex justify-content-between d-none">
                    <Breadcrumb className="">
                        <Breadcrumb.Item href="#">Aktien</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">Überblick</Breadcrumb.Item>
                    </Breadcrumb>
                    <div>
                        <SvgImage icon={"icon_share_white.svg"} convert={false} spanClass={"share-butt-icon"} />
                    </div>
                </Container>
                <MarketSection
                    title="Aktien Überblick"
                    showAdvertisement={false}
                    isChartColored={false}
                    showExchangeLabelSlider={false}
                    markets={markets}
                    inSharePage={true} />
            </div>
            <div>
                <HotSection isSharePage={true} carouselIconColor={"white"} />
            </div>

            <div className="mb-xl-5 mb-lg-5">
                <ShareOverviewPerformance />
            </div>
            <div className="d-flex justify-content-end mt-xl-n4 mt-md-n5">
                <h3 className={"roboto-heading font-weight-bold pr-3 mt-1"} style={{ fontSize: '18px' }}>Weitersuchen?</h3>
                <NavLink to="/aktien/suche/" onClick={() => trigInfonline('aktienuberblick', '003_01_02_L_TI_SuEr')}>
                    <Button className={" mx-n2 mx-md-3"}>Zur Aktiensuche</Button>
                </NavLink>
            </div>
            <TopAndFlopSection />
            <div className={"mt-xl-4 mx-md-2 mx-n1"}>
                <h2 className={"section-heading font-weight-bold roboto-heading my-1 pl-3 mt-xl-5 mt-sm-4 d-none d-md-block"}
                    style={{ fontSize: "24px" }}>Aktuelle Finanznachrichten</h2>
                <h2 className={" font-weight-bold roboto-heading my-1 pl-4 mt-xl-5 mt-sm-4 d-md-none d-block"}
                    style={{ fontSize: "20px" }}>Aktuelle Finanznachrichten</h2>
                <BottomFeed />
            </div>
            <AssetClassText isDerivativePage={false} assetGroup={AssetGroup.Share} />
        </main>
    );
}

export default ShareOverview;


const markets: Market[] = [
    { name: "Meistgesuchte", listId: "most_searched_by_share" },
    { name: "Meistgehandelte", listId: "hot_instruments_by_trades" },
];

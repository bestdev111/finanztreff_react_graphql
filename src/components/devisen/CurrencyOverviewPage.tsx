import './CurrencyOverviewPage.scss';
import { Instrument, AssetGroup } from '../../graphql/types';
import { PerformanceChartSection } from './PerformanceChartSection/PerformanceChartSection';
import { TableSection } from './TableSection/TableSection';
import { BottomFeedNewsSection } from './BottomFeedNewsSection/BottomFeedNewsSection';
import { useMediaQuery } from 'react-responsive';
import { Market, MarketSection } from 'components';
import AssetClassText from "../common/assetClassText/AssetClassText";
import { Breadcrumb, Container } from 'react-bootstrap';
import { CurrencyFindSection } from './CurrencyFindSection/CurrencyFindSection';
import {useEffect} from "react";
import {guessInfonlineSection, trigInfonline} from "../common/InfonlineService";
import {Helmet} from "react-helmet";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from 'components/common/TargetingService';
import keycloak from 'keycloak';

interface CurrencyPageProps {
  instrument?: Instrument;
}

export function CurrencyOverviewPage(props: CurrencyPageProps) {
      const isMobile = useMediaQuery({
        query: '(max-width: 767px)'
      })

    useEffect(() => {
        trigInfonline(guessInfonlineSection(), "currency_overview_page")
    }, [])

      let markets: Market[] = [
        {name: "Euro zu...", listId: "currency_instruments_eur"},
        {name: "US Dollar zu...", listId: "currency_instruments_usd"},
        {name: "Japanischer Yen zu...", listId: "currency_instruments_jpy"},
        {name: "Britische Pfund zu...", listId: "currency_instruments_gbp"},
        {name: "Schweizer Franken zu...", listId: "currency_instruments_chf"},
    ];
        return(
            <main className="page-container devisen-overview-page">
                <Helmet>
                    <title>finanztreff.de - Devisen | Überblick | Wichtigste Währungen | Aktuelle Kurse | Euro US-Dollar</title>
                    <meta name="description"
                          content= "Währungen und Devisen im Überblick: Alle Informationen, Realtime Kurse ✔, Crossrates, Performance im Vergleich, aktuelle Nachrichten ➨ auf finanztreff.de topaktuell und kostenlos!"/>
                    <meta name="keywords"
                          content="Devisen, Währungen, Wechselkurse, Crossrates, Spot-Kurse"/>
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
              title="Devisen Überblick"
              showAdvertisement={false}
              isChartColored={false} 
              />
            </div>
              {isMobile === false ? <PerformanceChartSection title={"Performances im Vergleich zum"}/> : <PerformanceChartSection title={"Vergleich zum"}/>}
              <TableSection />
              <CurrencyFindSection />
              <BottomFeedNewsSection />
                <AssetClassText isDerivativePage={false} assetGroup={AssetGroup.Cross}/>
            </main>
        );
    }

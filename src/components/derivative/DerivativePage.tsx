import MostTradedDerivativesSection from "./most-traded/MostTradedDerivativesSection";
import "./DerivativeOverview.scss"
import {UnderlyingSection} from "./underlying/UnderlyingSection";
import AssetClassText from "../common/assetClassText/AssetClassText";
import {AssetGroup} from "../../generated/graphql";
import {Helmet} from "react-helmet";
import { trigInfonline } from "components/common/InfonlineService";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from "components/common/TargetingService";
import keycloak from "keycloak";
export default function DerivativePage() {
    trigInfonline('derivatives', 'uberblick');
    return (
        <>
            <Helmet>
                <title>finanztreff.de - Derivate | Überblick | Zertfikate | Optionscheine | Knockouts | Faktor</title>
                <meta name="description"
                      content= "Derivate im Überblick: Alle Informationen zu Derivaten, beste und meistgehandelte Basiswerte ✔, umfangreiche Suche, Anlageprodukte ➨ auf finanztreff.de topaktuell!"/>
                <meta name="keywords"
                      content="Zertifkate, Optionsscheine, Knock-Outs, Aktienanleihe, Bonus, Discount, Express, Index, Kapitalschutz, Basiswert, Call, Put, Long, Short, Hebel"/>
                <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated),null,null,null, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
            </Helmet>

            <div style={{width: '100%', overflow: "hidden"}}>
            <MostTradedDerivativesSection/>
            <UnderlyingSection/>
            <AssetClassText isDerivativePage={false} assetGroup={AssetGroup.Cert}/>
            <AssetClassText isDerivativePage={true} assetGroup={AssetGroup.Warr}/>
            <AssetClassText isDerivativePage={true} assetGroup={AssetGroup.Knock}/>
            </div>
            {/*<QuickLinksSection/>*/}
        </>
    );
}

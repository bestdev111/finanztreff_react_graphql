import { useKeycloak } from "@react-keycloak/web";
import { Col } from "react-bootstrap";
import {Helmet} from "react-helmet";
import {useEffect} from "react";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

export function UnauthenticatedBanner() {
    let { initialized, keycloak } = useKeycloak();

    useEffect(() => {
        trigInfonline(guessInfonlineSection(), "unauthenticated")
    }, [])

    return (
        <>
            <Helmet>
                <title>Mein finanztreff.de - Jetzt kostenlos registrieren</title>
                <meta name="description"
                      content= "Registrieren Sie sich für kostenlose ✔ Portfolios, Watchlists, Limits und Analysen auf finanztreff.de!"/>
                <meta name="keywords"
                      content="Registrierung, Login, Anmeldung, Anmelden, Mein Finanztreff, finanztreff Login, Portfolio, Watchlist, Limitliste"/>
            </Helmet>
            <section className="unauthenticated-banner">
                <img src="/static/img/MF_header_desktop.png" alt="UBS" className="img-fluid d-none d-xl-block" />
                <img src="/static/img/MF_header_tablet.png" alt="UBS" className="img-fluid d-xl-none d-sm-none d-md-block" />
                <img src="/static/img/MF_header_mobile.png" alt="UBS" className="img-fluid d-xl-none d-md-none" />
                <div className="position-absolute col-info-banner">
                    <Col xl={7} lg={8} >
                        <h1 className="text-left text-white">
                            Als registriertes Mitglied haben Sie schnellen Zugriff auf:
                        </h1>
                        <div className="ml-n3 mt-lg-4 mt-xl-4 pt-2 mt-sm-0 ml-sm-n4">
                            <ul className="text-white fs-18px">
                                <li className="mb-xl-1 mb-lg-1 mb-sm-0">Kostenlose Portfolios, Watchlisten und Limits</li>
                                <li className="mb-xl-1 mb-lg-1 mb-sm-0">Gesamtüberblicke, Entwicklungen und Analysen aller Depots</li>
                                <li className="mb-xl-1 mb-lg-1 mb-sm-0">Analysen aller Wertpapierbestände</li>
                                <li className="mb-xl-1 mb-lg-1 mb-sm-0">Zugehörige Nachrichten</li>
                                <li className="mb-xl-1 mb-lg-1 mb-sm-0">Verschiedene Ansichten</li>
                            </ul>
                        </div>
                    </Col>
                    <div className="text-white d-block ml-3 pt-xl-4 pt-lg-4 mt-lg-5 button-row-banner">
                        <button className="btn btn-primary white-space-no-wrap fs-24px registering-button" onClick={() => keycloak.register()}>Jetzt kostenlos registrieren</button>
                        <span className="ml-4 white-space-no-wrap">
                            <span className="mr-1 question-banner">Bereits registriert?</span>
                            <button className="btn btn-primary bg-white border-white text-blue ml-2 white-space-no-wrap login-button-banner" onClick={() => keycloak.login()}>Zum Login...</button>
                        </span>
                    </div>
                </div>
            </section>
        </>
    );
}

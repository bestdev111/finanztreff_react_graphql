import { useKeycloak } from "@react-keycloak/web";
import { Button, Container, Navbar } from "react-bootstrap";
import { useLocation } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';
import { useMediaQuery } from 'react-responsive';
import { MainSearch } from "components/search";
import { PortfolioInfo } from 'components/profile/modals/login-registration-process/PortfolioInfo';
import SvgImage from 'components/common/image/SvgImage';
import { LoginOrRegistrationLayer } from 'components/profile/modals/login-registration-process/LoginOrRegistrationLayer';
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import { StickyInstruments } from '../StickyInstruments/StickyInstruments';
import {HeaderContextContent as HeaderContext} from "./HeaderContext";
import NavigationComponent from "./NavigationComponent";
import './HeaderComponent.scss'
import '../Scroll.scss'
import {ApplicationContextContext, ApplicationContextProps} from "../../../ApplicationContext";

export function HeaderComponent() {
    const {initialized, keycloak} = useKeycloak();
    const [expanded, setExpanded] = useState(false);
    const {pushActive, setPushActive}: ApplicationContextProps = useContext(ApplicationContextContext)!

    useEffect(() => {
        document.body.classList.toggle('mobile-menu-open', expanded);
    }, [expanded])

    const isDesktop = useMediaQuery({
        query: '(min-width: 1280px)'
    });
    const customLogoWidth = useBootstrapBreakpoint({
        xl: "215px",
        md: "190px",
        sm: "167px"
    })

    const [activeId, setActiveId] = useState<number>(-1);
    var pathname: string = "/";
    const usePathname = () => {
        const location = useLocation();
        if (location.pathname.split('/')[1].length > 0) {
            pathname = location.pathname.split('/')[1];
        } else {
            pathname = "/"
        }

    }

    usePathname();

    useEffect(() => {
        switch (pathname) {
            case '/': setActiveId(-1); break;
            case 'aktien': setActiveId(0); break;
            case 'fonds': setActiveId(11); break;
            case 'anleihen': setActiveId(23); break;
            case 'derivatives': setActiveId(26); break;
            case 'indizes': setActiveId(29); break;
            case 'devisen': setActiveId(32); break;
            case 'rohstoffe': setActiveId(35); break;
            case 'news': setActiveId(37); break;
            case 'analysen': setActiveId(40); break;
            case 'mein-finanztreff': setActiveId(43); break;
        }
    }, [pathname])

    const bilboardContainer = useRef<HTMLDivElement | null>(null);
    const leaderBoardContainer = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (bilboardContainer.current !== null) {
            let elementScriptBilboard = document.createElement('script');
            elementScriptBilboard.type = 'text/javascript';
            elementScriptBilboard.text = `Ads_BA_AD('BS');`;
            if (bilboardContainer.current !== null && bilboardContainer.current.hasChildNodes()) {
                bilboardContainer.current.innerHTML = '';
            }
            if (bilboardContainer.current !== null && !bilboardContainer.current.hasChildNodes() && (pathname !== 'mein-finanztreff' || keycloak.authenticated)) {
                bilboardContainer.current.appendChild(elementScriptBilboard)
            }
        }
        if (leaderBoardContainer.current !== null) {
            let elementScriptLeaderboard = document.createElement('script');
            elementScriptLeaderboard.type = 'text/javascript';
            elementScriptLeaderboard.text = `Ads_BA_AD('TO');`;
            if (leaderBoardContainer.current !== null && leaderBoardContainer.current.hasChildNodes()) {
                leaderBoardContainer.current.innerHTML = '';
            }
            if (leaderBoardContainer.current !== null && !leaderBoardContainer.current.hasChildNodes() && (pathname !== 'mein-finanztreff' || keycloak.authenticated)) {
                leaderBoardContainer.current.appendChild(elementScriptLeaderboard)
            }
        }
    }, [bilboardContainer, leaderBoardContainer, activeId])

    useEffect(() => {
        let defineVariables = document.createElement('script');
        switch (activeId) {
            case -1: defineVariables.text = 'var Ads_BA_ADIDsection = "startseite";'; break;
            case 0: defineVariables.text = 'var Ads_BA_ADIDsection = "rotation";'; break;
            case 11: defineVariables.text = 'var Ads_BA_ADIDsection = "rotation";'; break;
            case 23: defineVariables.text = 'var Ads_BA_ADIDsection = "rotation";'; break;
            case 26: defineVariables.text = 'var Ads_BA_ADIDsection = "rotation";'; break;
            case 29: defineVariables.text = 'var Ads_BA_ADIDsection = "rotation";'; break;
            case 32: defineVariables.text = 'var Ads_BA_ADIDsection = "rotation";'; break;
            case 35: defineVariables.text = 'var Ads_BA_ADIDsection = "rotation";'; break;
            case 37: defineVariables.text = 'var Ads_BA_ADIDsection = "rotation";'; break;
            case 40: defineVariables.text = 'var Ads_BA_ADIDsection = "rotation";'; break;
            case 43: defineVariables.text = 'var Ads_BA_ADIDsection = "rotation";'; break;
            default: defineVariables.text = 'var Ads_BA_ADIDsection = "startseite";';

        }
        defineVariables.type = 'text/javascript';

        document.head.appendChild(defineVariables);

        return () => {
            document.head.removeChild(defineVariables);
        }
    }, [activeId])

    return (
        <HeaderContext.Provider value={{expanded, setExpanded, activeId, setActiveId, keycloakInitialized: initialized, keycloak}}>
        <header>
            <div className="top-section">
                <Container>
                    {
                        (leaderBoardContainer && pathname !== "mein-finanztreff") &&
                        <div className="ads-responsive-class-to" style={{ textAlign: 'center' }}>
                            <div id='Ads_BA_TO' style={{ position: 'relative' }} ref={leaderBoardContainer}></div>
                        </div>
                    }
                    <section className="d-flex justify-content-between">
                            <StickyInstruments />
                        { isDesktop &&
                        <Button variant="none" size="sm"
                            className="d-flex align-items-center py-0 pr-0"
                            title={pushActive ? "Pushkurse sind aktiv" : "Pushkurse sind inaktiv"}
                            onClick={() => setPushActive(currentPushActive => !currentPushActive)}>
                            { pushActive ?
                                <SvgImage icon="icon_push_on.svg" width="14px" imgClass="push-switch-button" convert={false} spanClass="mr-1 line-height-1" /> :
                                <SvgImage icon="icon_push_off.svg" width="14px" imgClass="push-switch-button" convert={false} spanClass="mr-1 line-height-1" />
                            }
                            <span className="text-uppercase font-weight-bold fs-11px line-height-15px text-main-text">Push</span>
                        </Button>
                        }
                    </section>
                    <div className="top-bar d-flex">
                        <div className="main-logo">
                            <a className="navbar-brand" href="/" onClick={() => setExpanded(false)}>
                                <img src={process.env.PUBLIC_URL + "/static/img/svg/logo_finanztreff.svg"} alt="finanztreff.de" className="img-fluid pl-xl-1" style={{ width: customLogoWidth }} />
                            </a>
                        </div>
                        <div className="account-search">
                            {initialized && keycloak?.authenticated &&
                                <>
                                    <span className="greetings d-none d-xl-block">
                                        Schön Sie zu sehen, <span
                                            className="acc-name">{(keycloak?.idTokenParsed as any).name || (keycloak?.idTokenParsed as any).preferred_username}</span>
                                    </span>
                                    <PortfolioInfo username={(keycloak?.idTokenParsed as any).name || (keycloak?.idTokenParsed as any).preferred_username} />
                                </>
                            }
                            {initialized && !keycloak?.authenticated &&
                                <>
                                    <div className="d-none d-xl-block">
                                        <span onClick={() => keycloak.login()} className="font-weight-bold text-blue cursor-pointer"> Login </span>
                                        <span className="text-blue"> oder </span>
                                        <span onClick={() => keycloak.register()} className="font-weight-bold text-blue cursor-pointer"> kostenlos registrieren</span>
                                        <span className="svg-icon top-move">
                                            <SvgImage icon="icon_user_blue.svg" spanClass="top-move" imgClass="svg-blue" width="25" />
                                        </span>
                                    </div>
                                    <div className="d-xl-none d-lg-block d-md-block d-sm-block">
                                        <LoginOrRegistrationLayer />
                                    </div>
                                </>
                            }
                            <MainSearch />
                            {!isDesktop && <Navbar.Toggle onClick={() => setExpanded((prevExpanded) => (prevExpanded = !prevExpanded))} className="btn-menu custom-toggler d-xl-none" data-toggle="collapse" aria-controls="navbarNavAltMarkup"><i className="btn-menu__bars"></i></Navbar.Toggle>}
                        </div>
                    </div>
                </Container>
            </div>
            <NavigationComponent />
            {/* <Container className="pr-dn">
                <Row className="text-white bg-pink pb-2 pt-xl-2 pt-sm-3">
                    <Col className="px-xl-3 px-sm-2">
                    Bitte haben Sie Verständnis dass das Beantworten Ihrer E-Mail aufgrund des hohen Aufkommens aktuell länger dauern kann.
                    </Col>
                </Row>
            </Container> */}
            <div className="ads-responsive-class" style={{ textAlign: 'center' }}>
                <div id='Ads_BA_BS' ref={bilboardContainer}></div>
            </div>
        </header>
        </HeaderContext.Provider>
    );
}

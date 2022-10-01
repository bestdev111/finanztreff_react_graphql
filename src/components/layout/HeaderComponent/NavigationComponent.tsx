import {useQuery} from "@apollo/client";
import {Query} from "generated/graphql";
import {GET_USER_PROFILE_COUNT} from "components/profile/query";
import {Button, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link} from 'react-router-dom';
import {Component, useContext} from 'react';
import {useMediaQuery} from 'react-responsive';
import SvgImage from 'components/common/image/SvgImage';
import {trigInfonline} from 'components/common/InfonlineService';
import UserSettingsModal from "components/profile/modals/UserSettingsModal/UserSettingsModal";
import {HeaderContextContentProps, HeaderContextContent as HeaderContext} from './HeaderContext'
import './HeaderComponent.scss'
import '../Scroll.scss'
import {ApplicationContextContext, ApplicationContextProps} from "../../../ApplicationContext";


enum IconType {
    NONE,
    SVG,
    PNG
}
class NavDropDownRouterLink extends Component<any, any> {
    render() {
        return (<Link to={this.props.href} {...this.props} />)
    }
}

type NavDropdownTypes = {
    title: string,
    dropdownItems: {id: number, text: string, href: string}[]
}


export default function NavigationComponent() {
    const isDesktop = useMediaQuery({
        query: '(min-width: 1280px)'
    });

    const context: HeaderContextContentProps = useContext(HeaderContext)!
    const {pushActive, setPushActive}: ApplicationContextProps = useContext(ApplicationContextContext)!
    const {expanded, setExpanded, activeId, setActiveId, keycloakInitialized, keycloak} = context

    const {data: userProfileCount, loading: userProfileCountLoading} = useQuery<Query>(GET_USER_PROFILE_COUNT, {skip: !keycloakInitialized || !keycloak?.authenticated, fetchPolicy: 'network-only' });

    const makeDropdownTitle = (title: string) => {
        return (<div className="d-flex justify-content-between">
                 {title}<span><SvgImage spanClass="up-caret" icon="icon_direction_up_white.svg" convert={false} width="26" /><SvgImage spanClass="down-caret" icon="icon_direction_down_white.svg" convert={false} width="26" /></span>
               </div>)
    }
    const aktienItems = [
        {id: 0, text: "Überblick", href: "/aktien/" },
        {id: 1, text: "Suche", href: "/aktien/suche/" },
        // {id: 2, text: "Aktien Monitor", href: ""},
        // {id: 3, text: "Aktien Vergleich", href: ""},
        // {id: 4, text: "Chartsignal suche/", href: ""},
        // {id: 5, text: "Unternehmensprofil suche/", href: ""},
        // {id: 6, text: "Tops & Flops", href: ""},
        // {id: 7, text: "IPO", href: ""},
        // {id: 8, text: "Hot!", href: ""},
        // {id: 9, text: "Aktien Wissen", href: ""},
        // {id: 10, text: "Quick Charts", href: ""},
    ];
    const fondItems = [
        {id: 11, text: "Suche", href: "/fonds/suche/" },
    ];
    const etfItems = [
        // {id: 14, text: "Action", href: "" },
        // {id: 15, text: "Another Action", href: "" },
        {id: 16, text: "Suche", href: "/etf/suche/" },
    ];
    // const etcEtnItems = [
    //     {id: 17, text: "Überblick", href: ""},
    //     {id: 18, text: "ETC suche/", href: ""},
    //     {id: 19, text: "ETN suche/", href: ""},
    //     {id: 20, text: "Tops & Flops", href: ""},
    //     {id: 21, text: "News", href: ""},
    //     {id: 22, text: "Basiswissen", href: ""},
    // ];
    const anleihenItems = [
        // {id: 23, text: "Überblick", href: "/anleihen" },
        {id: 24, text: "Suche", href: "/anleihen/suche/" },
        // {id: 25, text: "Something Else", href: ""},
    ];
    const derivateItems = [
        {id: 26, text: "Überblick", href: "/hebelprodukte/" },
        {id: 27, text: "Suche", href: "/hebelprodukte/suche/" },
    ];
    const indizesItems = [
        {id: 29, text: "Überblick", href: "/indizes/" },
    ];
    const devisenItems = [
        {id: 32, text: "Überblick", href: "/devisen/" },
    ];
    const rohstoffeItems = [
        {id: 35, text: "Überblick", href: "/rohstoffe/" },
    ];
    const newsItems = [
        {id: 37, text: "Suchen", href: "/nachrichten/" },
    ];
    const analysenItems = [
        {id: 40, text: "Überblick", href: "/analysen/" },
    ];
    const myFinanztreffItems = [
        {id: 43, iconType: IconType.NONE, icon: "", text: "Überblick", href: "/mein-finanztreff/" },
        {id: 44, iconType: IconType.SVG, icon: "icon_portfolio_dark", text: `Portfolios (${userProfileCount?.user?.profile?.portfolios?.length})`, href: "/mein-finanztreff/portfolios/" },
        {id: 45, iconType: IconType.SVG, icon: "icon_watchlist_dark", text: `Watchlisten (${userProfileCount?.user?.profile?.watchlists?.length})`, href: "/mein-finanztreff/watchlisten/" },
        {id: 46, iconType: IconType.SVG, icon: "icon_bell_dark", text: `Limits (${userProfileCount?.user?.profile?.limits?.length})`, href: "/mein-finanztreff/limits/" },
    ];
    const CustomNavDropdown = ({title, dropdownItems}: NavDropdownTypes) => (
        <NavDropdown title={isDesktop ? title : makeDropdownTitle(title)} id=""
            className={"nav-link nav-item basic-nav-dropdown" + (dropdownItems.filter(current => current.id === activeId).length > 0 ? " active" : "")}>
            {dropdownItems.map((val) => (
                <NavDropdown.Item as={NavDropDownRouterLink}
                    href={val.href} key={val.id}
                    className="dropdown-item-main-navigation"
                    onClick={() => {setActiveId(val.id); setExpanded(false); }}
                >{val.text}
                </NavDropdown.Item>
            ))}
        </NavDropdown>
    )

    const myFinanztreffNavElements = myFinanztreffItems.map((val) => (
        <NavDropdown.Item as={NavDropDownRouterLink}
            href={val.href} key={val.id}
            className="dropdown-item-main-navigation"
            onClick={() => {
                if(val.id === 43){
                    trigInfonline("mein_finanztreff", "mf_page");
                }
                if (val.id === 44) {
                    trigInfonline("mein_finanztreff", "portfolio_nav")
                }
                if (val.id === 45) {
                    trigInfonline("mein_finanztreff", "watchlist_page")
                }
                setActiveId(val.id); setExpanded(false); }
            }
        >{
            val.iconType !== IconType.NONE ?
                <div>
                    {val.iconType === IconType.SVG ?
                        <SvgImage icon={`${val.icon}.svg`} imgClass="mb-5px" width="24px" spanClass="px-0 ml-0 mr-2 cursor-default d-inline" /> : 
                        <span className="px-0 ml-0 mr-2">
                            <img src={`/static/img/${val.icon}.png`} className="mb-5px" alt="" width="24px" />
                        </span>
                    }
                    {val.text}
                </div>
                :
                    val.text
            }
        </NavDropdown.Item>
    ))

    const commonNavItems = [
        <CustomNavDropdown title="Aktien" dropdownItems={aktienItems} />,
        <CustomNavDropdown title="Fonds" dropdownItems={fondItems} />,
        <CustomNavDropdown title="ETF" dropdownItems={etfItems} />,
        // <CustomNavDropdown title="ETC/ETN" dropdownItems={etcEtnItems} />,
        <CustomNavDropdown title="Anleihen" dropdownItems={anleihenItems} />,
        <CustomNavDropdown title="Derivate" dropdownItems={derivateItems} />
    ]

    // const profileSettingsNavItem = <NavDropdown.Item as={Button} className="dropdown-item-main-navigation">Einstellungen</NavDropdown.Item>
    const profileSettingsNavItem = <NavDropdown.ItemText className="dropdown-item-main-navigation" style={{"color": "#a1a1a1", "fontWeight": "normal"}}>Einstellungen</NavDropdown.ItemText>
    myFinanztreffNavElements.push(
        // <UserSettingsModal control={profileSettingsNavItem} />,
        profileSettingsNavItem,
        <NavDropdown.Item onClick={() => keycloak.logout()} className="dropdown-item-main-navigation">Abmelden</NavDropdown.Item>
    )

    const pushIconElement = pushActive ? <SvgImage icon="icon_push_on.svg" width="14px" imgClass="push-switch-button" convert={false} spanClass="mr-1 line-height-1" /> :
                                <SvgImage icon="icon_push_off.svg" width="14px" imgClass="push-switch-button" convert={false} spanClass="mr-1 line-height-1" />

    return (
        <Navbar expanded={expanded} collapseOnSelect expand="xl" className="main-nav" variant="dark" bg="dark">
            <Link className={"svg-icon svg-icon-home-white d-none d-xl-block navbar-brand " + (activeId === -1 ? "active-home-icon" : "")} onClick={() => {setActiveId(-1); setExpanded(false); }} to={""}>
                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_home_white.svg"} alt="" className="" width={28} />
            </Link>
            <Navbar.Collapse aria-label={"navbarNavAltMarkup"} aria-required="true">
                <div className="navbar-expander" />
                <Nav className="d-flex navbar-container" >
                    {isDesktop ?
                        <>
                            {commonNavItems}
                        </>
                        :
                        <>
                            <NavDropdown.Item as={Button}
                                className="nav-link nav-item basic-nav-dropdown bg-white"
                                onClick={() => setPushActive(currentPushActive => !currentPushActive)}
                                title={pushActive ? "Pushkurse sind aktiv" : "Pushkurse sind inaktiv"}
                            >
                                {pushIconElement}
                                <span className="text-uppercase font-weight-bold fs-11px line-height-15px text-main-text">{pushActive ? "PUSHKURSE SIND AKTIV" : "PUSHKURSE SIND INAKTIV"}</span>
                            </NavDropdown.Item>
                            <NavDropdown title={makeDropdownTitle("Mein Finanztreff")} id=""
                                className={"nav-link nav-item basic-nav-dropdown mr-0 ml-auto bg-blue border-bottom-3 border-white" + (myFinanztreffItems.filter(current => current.id === activeId).length > 0 ? " active" : "")}>
                                {keycloak?.authenticated ?
                                    myFinanztreffNavElements
                                    :
                                        <>
                                            <NavDropdown.Item onClick={() => keycloak.login()} className="dropdown-item-main-navigation">
                                                Login
                                            </NavDropdown.Item>
                                            <NavDropdown.Item onClick={() => keycloak.register()} className="dropdown-item-main-navigation">
                                                Kostenlos registrieren
                                            </NavDropdown.Item>
                                        </>
                                }
                            </NavDropdown>
                            {commonNavItems}
                        </>
                    }

                    <Link to={`/indizes/`} onClick={() => {setActiveId(29); setExpanded(false); }} className={"nav-link nav-item basic-nav-dropdown single-item " + (indizesItems.filter(current => current.id === activeId).length > 0 ? "active" : "")}>
                        Indizes
                    </Link>

                    <Link to={`/devisen/`} onClick={() => {setActiveId(32); setExpanded(false); }} className={"nav-link nav-item basic-nav-dropdown single-item " + (devisenItems.filter(current => current.id === activeId).length > 0 ? "active" : "")}>
                        Devisen
                    </Link>

                    <Link to={`/rohstoffe/`} onClick={() => {setActiveId(35); setExpanded(false); }} className={"nav-link nav-item basic-nav-dropdown single-item " + (rohstoffeItems.filter(current => current.id === activeId).length > 0 ? "active" : "")}>
                        Rohstoffe
                    </Link>

                    <Link to={`/nachrichten/`} onClick={() => {setActiveId(37); setExpanded(false); }} className={"nav-link nav-item basic-nav-dropdown single-item " + (newsItems.filter(current => current.id === activeId).length > 0 ? "active" : "")}>
                        News
                    </Link>

                    <Link to={`/analysen/`} onClick={() => {setActiveId(40); setExpanded(false); }} className={"nav-link nav-item basic-nav-dropdown single-item " + (analysenItems.filter(current => current.id === activeId).length > 0 ? "active" : "")}>
                        Analysen
                    </Link>
                    {isDesktop &&
                    <NavDropdown title="Mein Finanztreff" id=""
                        className={"nav-link nav-item basic-nav-dropdown mr-0 ml-auto mein-ftreff-button-fix" + (myFinanztreffItems.filter(current => current.id === activeId).length > 0 ? " active" : "")}>
                        {keycloak?.authenticated ?
                            myFinanztreffNavElements
                            :
                                <>
                                    <NavDropdown.Item onClick={() => keycloak.login()} className="dropdown-item-main-navigation">
                                        Login
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => keycloak.register()} className="dropdown-item-main-navigation">
                                        Kostenlos registrieren
                                    </NavDropdown.Item>
                                </>
                        }
                    </NavDropdown>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

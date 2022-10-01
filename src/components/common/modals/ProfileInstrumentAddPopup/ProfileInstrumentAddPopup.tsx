import { ReactNode } from "react";
import { Dropdown } from "react-bootstrap";
import { useKeycloak } from "@react-keycloak/web";
import './ProfileInsturmentAddPopup.scss';
import { ProfileInstrumentAddPopupHeader } from "./ProfileInstrumentAddPopupHeader";
import { ProfileInstrumentAddPopupNotAuthenticated } from "./ProfileInstrumentAddPopupNotAuthenticated";
import { ProfileInstrumentAddPortfolio } from "./ProfileInstrumentAddPortfolio";
import { ProfileInstrumentAddWatchlist } from "./ProfileInstrumentAddWatchlist";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { Query } from "graphql/types";
import { trigInfonline, guessInfonlineSection } from "components/common/InfonlineService";

interface ProfileInstrumentAddPopupProps {
    className?: string;
    instrumentId: number;
    instrumentGroupId: number;
    name: string;
    watchlist?: boolean;
    portfolio?: boolean;
    children?: ReactNode;
    onActivate?: () => void;
    emptyPortfolioText?: string;
    emptyWatchlistText?: string;
    direction?: any;
    productIsin?: any;
    nameWkn?: any;
}

export const ProfileInstrumentAddPopup = (props: ProfileInstrumentAddPopupProps) => {
    let { initialized, keycloak } = useKeycloak();
    if (!initialized || !keycloak) {
        return <></>;
    }
    return (
        <>
            <Dropdown drop={props.direction ? props.direction : "down"} className="dropdown-select no-after-pointer main-dropdown with-min-width-340 dropdown-keep-ope show profile-instrument-dropdown">
                <Dropdown.Toggle variant="link" className={props.className} >
                    {props.children}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ minWidth: '340px' }}>
                    <ProfileInstrumentAddPopupHeader title={props.watchlist ? props.portfolio ? "..." : "Watchlisten" : "Portfolios"} />
                    <div className="content">
                        {keycloak.authenticated ?
                            <>
                                <div className="content-row">
                                    <span className="font-weight-bold">{props.name}</span>
                                </div>
                                <>
                                    {props.portfolio && <ProfileInstrumentAddPortfolio
                                        onActivate={() => props.onActivate && props.onActivate()}
                                        emptyText={props.emptyPortfolioText}
                                        instrumentId={props.instrumentId}
                                        instrumentGroupId={props.instrumentGroupId}
                                        productIsin={props.productIsin}
                                        nameWkn={props.nameWkn} 
                                        hasGtag={true}/>}
                                    {props.watchlist && <ProfileInstrumentAddWatchlist
                                        onActivate={() => props.onActivate && props.onActivate()}
                                        instrumentId={props.instrumentId}
                                        emptyText={props.emptyWatchlistText}
                                        instrumentGroupId={props.instrumentGroupId}
                                        productIsin={props.productIsin}
                                        nameWkn={props.nameWkn}
                                        hasGtag={true} />}
                                </>
                            </> :
                            <ProfileInstrumentAddPopupNotAuthenticated onLogin={() => keycloak.login()}
                                onRegister={() => keycloak.register()}
                                text={props.watchlist ? props.portfolio ? "Watchlist, Portfolio und Limit-Funktionen" : "Watchlist" : "Portfolio"} />
                        }
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}

export const ProfileInstrumentAddPopupForBanner = (props: ProfileInstrumentAddPopupProps) => {
    let { initialized, keycloak } = useKeycloak();
    const { data, loading } = useQuery<Query>(
        loader('./getProfileInstrumentAddPortfolio.graphql'),
        {   variables: { id: props.instrumentId }, 
            skip: !initialized || !keycloak,
            onCompleted: data => {console.log('queryModal', data)},
            onError: error => {console.log('queryModal error', error)}
        }
    )
    if (!initialized || !keycloak) {
        return <></>;
    }
    return (
        <>
            <Dropdown drop={props.direction ? props.direction : "down"} className="dropdown-select no-after-pointer main-dropdown with-min-width-340 dropdown-keep-ope show profile-instrument-dropdown">
                <Dropdown.Toggle variant="link" className={props.className} >
                    {
                        props.portfolio ?
                            data && data.instrumentIncluded && data.instrumentIncluded?.portfolios.length > 0 ?
                                <img onClick={() => {
                                    trigInfonline(guessInfonlineSection(), 'portfolios')
                                }}
                                    src={process.env.PUBLIC_URL + "/static/img/svg/icon_portfolio_filled_white.svg"} width={28}
                                    alt="" className="portfolio-butt-icon mr-2 mb-n1"/>
                                :
                                <img onClick={() => {
                                    trigInfonline(guessInfonlineSection(), 'portfolios')
                                }}
                                    src={process.env.PUBLIC_URL + "/static/img/svg/icon_portfolio_plus_white.svg"}
                                    alt="" className="portfolio-butt-icon"
                                    style={{ marginRight: '8px', marginLeft: '8px' }} />
                            :
                            props.watchlist &&
                                data && data.instrumentIncluded && data.instrumentIncluded?.watchlists.length > 0 ?
                                <img onClick={() => {
                                    trigInfonline(guessInfonlineSection(), 'watchlist')
                                }}
                                    src={process.env.PUBLIC_URL + "/static/img/svg/icon_watchlist_filled_white.svg"} width={28}
                                    alt="" className="portfolio-butt-icon mb-n1" />
                                :
                                <img onClick={() => {
                                    trigInfonline(guessInfonlineSection(), 'watchlist')
                                }}
                                    src={process.env.PUBLIC_URL + "/static/img/svg/icon_watchlist_plus_white.svg"}
                                    alt="" className="portfolio-butt-icon" />
                    }
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ minWidth: '340px' }}>
                    <ProfileInstrumentAddPopupHeader title={props.watchlist ? props.portfolio ? "..." : "Watchlisten" : "Portfolios"} />
                    <div className="content">
                        {keycloak.authenticated ?
                            <>
                                <div className="content-row">
                                    <span className="font-weight-bold">{props.name}</span>
                                </div>
                                <>
                                    {props.portfolio && <ProfileInstrumentAddPortfolio
                                        onActivate={() => props.onActivate && props.onActivate()}
                                        emptyText={props.emptyPortfolioText}
                                        instrumentId={props.instrumentId}
                                        instrumentGroupId={props.instrumentGroupId}
                                        productIsin={props.productIsin}
                                        nameWkn={props.nameWkn}
                                        hasGtag={false}/>}
                                    {props.watchlist && <ProfileInstrumentAddWatchlist
                                        onActivate={() => props.onActivate && props.onActivate()}
                                        instrumentId={props.instrumentId}
                                        emptyText={props.emptyWatchlistText}
                                        instrumentGroupId={props.instrumentGroupId}
                                        productIsin={props.productIsin}
                                        nameWkn={props.nameWkn}
                                        hasGtag={false} />}
                                </>
                            </> :
                            <ProfileInstrumentAddPopupNotAuthenticated onLogin={() => keycloak.login()}
                                onRegister={() => keycloak.register()}
                                text={props.watchlist ? props.portfolio ? "Watchlist, Portfolio und Limit-Funktionen" : "Watchlist" : "Portfolio"} />
                        }
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}

import { useQuery } from "@apollo/client";
import { useKeycloak } from "@react-keycloak/web";
import { GET_USER_PROFILE_COUNT } from "components/profile/query";
import { Query } from "generated/graphql";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Spinner } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { Link } from "react-router-dom";
import UserSettingsModal from "../UserSettingsModal/UserSettingsModal";

export function PortfolioInfo(props: PortfolioInfoProps) {

    const [open, setState] = useState(false);

    const columnWidth = useBootstrapBreakpoint({
        xl: '-312px',
        lg: '-312px',
        sm: '-234px'
    });

    let { initialized, keycloak } = useKeycloak();
    let { loading, data } = useQuery<Query>(GET_USER_PROFILE_COUNT, { skip: open === false, fetchPolicy: 'network-only' });

    const CustomToggle = React.forwardRef<any, any>(({ children, onClick }: any, ref: any) => (
        <Button variant="link"
            style={{ padding: "0" }}
            ref={ref}
            onClick={e => { onClick(e); setState(!open) }}
        >
            {children}
        </Button>
    ));

    const CustomMenu = React.forwardRef<any, any>(
        ({ children, className, 'aria-labelledby': labeledBy }: any, ref) => {
            return (
                <div
                    ref={ref}
                    style={{ minWidth: '354px', "padding": "10px", left: columnWidth }}
                    className={className}
                    aria-labelledby={labeledBy}>
                    {children}
                </div>
            );
        },
    );

    return (
        <>
            <Dropdown className="">

                <Dropdown.Header style={{ padding: "0" }}>
                    <DropdownToggle as={CustomToggle}>
                        <span className="acc-butt svg-icon top-move svg-icon-user-blue">
                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_user_blue_filled.svg"} alt="" width="27" className="acc-butt-icon" />
                        </span>
                    </DropdownToggle>
                </Dropdown.Header>

                <DropdownMenu as={CustomMenu}>
                    {
                        loading ?
                            <>
                                <div className="text-center py-4">
                                    <Spinner animation="border" />
                                </div>
                            </>
                            :
                            <>
                                <div className="py-1" style={{ lineHeight: "1.5" }}>
                                    Hallo! Sie sind angemeldet als <b>{props.username}</b>
                                </div>
                                <div className="py-1" style={{ lineHeight: "1.5" }}>
                                    Aktuell haben Sie<br />
                                    <Link to={'/mein-finanztreff/portfolios/'} className="px-1 font-weight-bold text-nowrap">
                                        {data?.user?.profile?.portfolios?.length} Portfolios,
                                    </Link>
                                    <Link to={'/mein-finanztreff/watchlisten/'} className="pr-1 font-weight-bold text-nowrap">
                                        {data?.user?.profile?.watchlists?.length} Watchlisten
                                    </Link>
                                    <span>und</span>
                                    <Link to={'/mein-finanztreff/limits/'} className="pl-1 font-weight-bold text-nowrap">
                                        {data?.user?.profile?.limits?.length} Limits
                                    </Link>
                                </div>
                            </>

                    }
                    <div className="d-flex justify-content-between pt-4 text-blue" style={{ lineHeight: "1.5" }}>
                        {/*<UserSettingsModal />*/}
                        <Button variant="link" onClick={() => keycloak.logout()} className="font-weight-bold cursor-pointer">Abmelden</Button>
                    </div>

                </DropdownMenu>
            </Dropdown>
        </>
    );
}

interface PortfolioInfoProps {
    username: string;
}

import keycloak from "keycloak";
import React from "react";
import { Button, Dropdown } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";

export function LoginOrRegistrationLayer() {

    const CustomToggle = React.forwardRef<any, any>(({ children, onClick }: any, ref: any) => (
        <Button variant="link"
            style={{ padding: "0" }}
            ref={ref}
            onClick={e => onClick(e)}
        >
            {children}
        </Button>
    ));

    const CustomMenu = React.forwardRef<any, any>(
        ({ children, className, 'aria-labelledby': labeledBy }: any, ref) => {
            return (
                <div
                    ref={ref}
                    style={{ minWidth: '200px',height: "90px", padding: "10px", left: "-160px" }}
                    className={className}
                    aria-labelledby={labeledBy}>
                    {children}
                </div>
            );
        },
    );
    return (
        <>
            <Dropdown className="d-none d-lg-block d-md-block d-sm-block">

                <Dropdown.Header style={{ padding: "0" }}>
                    <DropdownToggle as={CustomToggle}>
                        <span className="acc-butt svg-icon top-move svg-icon-user-blue">
                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_user_blue.svg"} alt="" width="27" className="acc-butt-icon" />
                        </span>
                    </DropdownToggle>
                </Dropdown.Header>
                <DropdownMenu as={CustomMenu}>
                    <div className="">
                        <span onClick={() => keycloak.login()} className="font-weight-bold text-blue cursor-pointer"> Login </span>
                        <span className="text-blue"> oder </span>
                        <span onClick={() => keycloak.register()} className="font-weight-bold text-blue cursor-pointer"> kostenlos registrieren</span>
                    </div>
                </DropdownMenu>
            </Dropdown>
        </>
    );
}

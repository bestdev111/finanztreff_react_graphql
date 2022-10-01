import classNames from "classnames";
import { PortfolioInstrumentAdd } from "components/common";
import SvgImage from "components/common/image/SvgImage";
import { AccountDeposit, AccountWithdrawal } from "components/profile/modals";
import { PortfolioSettings } from "components/profile/modals/PortfolioWatchlistSettings/PortfolioSettings";
import { TransactionImportModal } from "components/profile/modals/TransactionImportModal/TransactionImportModal";
import { Portfolio } from "graphql/types";
import { useState } from "react";
import { Col, Button, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { numberFormat } from "utils";

export function EmptyPortfolioCard({ index, refreshTrigger, portfolio, showMemo, realportfolio }: EmptyPortfolioCardProps) {
    const amount: number = getSumme(portfolio);
    const [memo, setShowMemo] = useState<boolean>(showMemo)
    return (
        <>
            <Container key={index} className="" style={{ boxShadow: "0px 3px 6px #00000029" }}>
                <Row>
                    <Col className="bg-white">
                        <Container className="p-2 portfolio-card-height">
                            <Row className="fs-12px mb-1">
                                <Link className="fs-18px font-weight-bold" onClick={()=>window.scrollTo({ top: 0, behavior: 'smooth' })}
                                to={{pathname: realportfolio ? `/mein-finanztreff-realportfolios/portfolio/${portfolio.id}` : `/mein-finanztreff/portfolio/${portfolio.id}`,state: "scrollToTop"}}>{portfolio.name}</Link>                            </Row>
                            <Row className="mt-5">
                                <Col>
                                    <Row>Sie haben noch keine Werte in Ihrem Portfolio.</Row>
                                    <Row>
                                        {portfolio.real && realportfolio ?
                                            <TransactionImportModal portfolio={portfolio} onComplete={refreshTrigger} />
                                            :
                                            <PortfolioInstrumentAdd
                                                portfolioId={portfolio.id}
                                                className="p-1"
                                                onComplete={refreshTrigger}
                                            >
                                                <span className="svg-icon mr-1">
                                                    <img src="/static/img/svg/icon_plus_white.svg" height="20" alt="" />
                                                </span>
                                                <span>Wertpapier hinzufügen</span>
                                            </PortfolioInstrumentAdd>
                                        }
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="mt-xl-5 mt-2 pt-xl-2 pt-2">
                                <Col>
                                    <Row>Aktueller Kontostand: {numberFormat(amount)} EUR</Row>
                                    <Row>
                                        <AccountDeposit portfolio={portfolio} onComplete={refreshTrigger}>
                                            <span className="text-white fs-14px">
                                                <span className="font-weight-bold ml-n2 pr-2 fs-16px">+</span>
                                                Kontostand erhöhen
                                            </span>
                                        </AccountDeposit>
                                        <span className="ml-1">
                                            <AccountWithdrawal portfolio={portfolio} onComplete={refreshTrigger} />
                                        </span>
                                    </Row>
                                </Col>
                            </Row>
                            {memo && portfolio.memo && portfolio.memo !== "" &&
                                <Row className="pt-2 pb-1">
                                    <Col>
                                        <span className="svg-icon">
                                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_note.svg"} width="24" alt="" className="ml-n2" />
                                        </span>
                                        <span className="pl-2" ><i>{portfolio.memo}</i></span>
                                    </Col>
                                </Row>
                            }
                        </Container>
                    </Col>
                    <Col className="bg-gray-light px-0 text-center" style={{ flex: "0 0 41px" }}>
                        <Row className="justify-content-between">
                            <Col className="px-0 pl-2 text-center">
                                <PortfolioSettings portfolio={portfolio} onComplete={refreshTrigger} className="top d-flex justify-content-center d-none">
                                    <span className="mt-2">
                                        <SvgImage icon={"icon_menu_vertical_blue.svg"} spanClass="cursor-pointer" convert={false} width="27" />
                                    </span>
                                </PortfolioSettings>
                            </Col>
                            <Col className="px-0 mt-5 pt-5">
                                <Button variant="link" className="px-2 mb-n2" disabled={portfolio.memo === "" || !portfolio.memo} onClick={() => setShowMemo(!memo)}>
                                    <SvgImage icon={"icon_note.svg"} convert={false} width="28" />
                                </Button>
                                <Button variant="inline" disabled={true} className="">
                                    <img src="/static/img/svg/icon_portfolioalert_off_dark.svg" width="27" className="svg-convert" alt="" />
                                </Button>
                                <Button variant="inline" disabled={true} className="mb-1">
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_news.svg"} className="svg-convert" alt="" width={27} />
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container></>
    )
}

function getSumme(portfolio: Portfolio): number {
    return portfolio.accountEntries ? portfolio.accountEntries.map(entry => entry.amount).reduce((x, y) => x + y, 0) : 0;
}

interface EmptyPortfolioCardProps {
    index: number,
    portfolio: Portfolio,
    showMemo: boolean;
    refreshTrigger: () => void;
    realportfolio?: boolean
}
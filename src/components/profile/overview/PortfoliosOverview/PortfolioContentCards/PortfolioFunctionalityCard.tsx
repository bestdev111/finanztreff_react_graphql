import { CreatePortfolioOrWatchlist } from "components/profile/modals";
import { CreateRealPortfolio } from "components/profile/modals/CreateRealPortfolio/CreateRealPortfolio";
import { ProfileImportProcess } from "components/profile/modals/profile-import/ProfileImportProcess";
import { Col, Container, Row } from "react-bootstrap";

// export function PortfolioFunctionalityCard(props: PortfolioFunctionalityCardProps) {
//     return (
//         <Col key={-1} className="px-xl-2 px-lg-2 px-0 mb-2">
//             <div className="content-wrapper d-flex flex-column justify-content-center text-center portfolio-card-height">
//                 <div>
//                     <CreatePortfolioOrWatchlist name={"Portfolio"} onComplete={props.refreshTrigger} />
//                 </div>
//                 <div className="mt-2">
//                     <ProfileImportProcess>
//                         <span className="svg-icon live-portfolio-icon">
//                             <img src="/static/img/svg/icon_liveportfolio_white_dark.svg" className="mr-2" alt="" />
//                         </span>
//                         <span>Portfolios importieren</span>
//                     </ProfileImportProcess>
//                 </div>
//             </div>
//         </Col>
//     )
// }

interface PortfolioFunctionalityCardProps {
    refreshTrigger: () => void;
    realportfolio?: boolean;
}

export function PortfolioFunctionalityCard(props: PortfolioFunctionalityCardProps) {
    return (
        <>
            <Col lg={6} xs={12} className="p-2">
                <Container className="content-wrapper pt-2 portfolio-card-height mt-0" key={-1}>
                    <Row className="fs-17px font-weight-bold my-2">
                        <Col className="text-center">Muster-Portfolios</Col>
                    </Row>
                    <Row className="my-2 line-height-1 fs-15px">
                        <Col className="text-center">Zum Testen von Anlagestrategien und<br /> zum wilden "herumspielen"</Col>
                    </Row>
                    <Row className="mt-2 border-bottom-2 border-gray-light pb-3">
                        <Col className="text-center"><CreatePortfolioOrWatchlist name={"Portfolio"} title="Neues Muster-Portfolio anlegen" onComplete={props.refreshTrigger} /></Col>
                    </Row>
                    <Row className="line-height-1 mt-3 fs-15px">
                        <Col className="text-center">Hier können Sie Ihre bestehenden Portfolios<br /> aus dem "alten" finanztreff importieren:</Col>
                    </Row>
                    <Row className="mt-3">
                        <Col className="text-center">
                            <ProfileImportProcess>
                                <span className="svg-icon live-portfolio-icon">
                                    <img src="/static/img/svg/icon_liveportfolio_white_dark.svg" className="mr-2" alt="" />
                                </span>
                                <span>Portfolios importieren</span>
                            </ProfileImportProcess>
                        </Col>
                    </Row>
                </Container>
            </Col>
            {
                props.realportfolio && 
                <Col lg={6} xs={12} className="p-2">
                    <Container key={-2} className="text-center content-wrapper portfolio-card-height mt-0">
                        <Row className="justify-content-center fs-17px font-weight-bold mt-2 mb-3 align-items-center">
                            <Col>
                                <span className="bg-pink px-2 text-white fs-13px mr-3" style={{ paddingTop: "2px", paddingBottom: "2px" }}>NEU</span>
                                <span>Real-Portfolios</span>
                            </Col>
                        </Row>
                        <div className="my-2 line-height-1 fs-15px">
                            Bilden Sie Ihre echten Portfolios nach und<br />profitieren Sie von unseren exklusiven<br /> Auswertungsmöglichkeiten. Einfach Order-<br />PDFs-Hochladen und loslegen!
                        </div>
                        <div className="mt-4">
                            <CreateRealPortfolio onComplete={props.refreshTrigger} />
                        </div>
                    </Container>
                </Col>
            }
        </>
    )
}
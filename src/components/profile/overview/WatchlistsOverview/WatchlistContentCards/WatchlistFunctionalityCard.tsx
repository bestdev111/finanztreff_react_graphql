import { CreatePortfolioOrWatchlist } from "components/profile/modals";
import { ProfileImportProcess } from "components/profile/modals/profile-import/ProfileImportProcess";
import { Col, Row, Container } from "react-bootstrap";

export function WatchlistFunctionalityCard(props: WatchlistFunctionalityCardProps) {
    return (

        <Col key={-1} lg={6} xs={12} className="p-2 pt-3">
            <Container className="content-wrapper pt-2 watchlist-card-height mt-0" key={-1}>
                <Row className="mt-2 border-bottom-2 border-gray-light py-5">
                    <Col className="text-center"><CreatePortfolioOrWatchlist name={"Watchlist"} onComplete={props.refreshTrigger} /></Col>
                </Row>
                <Row className="line-height-1 mt-3 fs-15px">
                    <Col className="text-center">Hier können Sie Ihre bestehenden Watchlists<br /> aus dem "alten" finanztreff importieren:</Col>
                </Row>
                <Row className="mt-3">
                    <Col className="text-center">
                        <ProfileImportProcess>
                            <span className="svg-icon live-portfolio-icon">
                                <img src="/static/img/svg/icon_liveportfolio_white_dark.svg" className="mr-2" alt="" />
                            </span>
                            <span>Watchlists importieren</span>
                        </ProfileImportProcess>
                    </Col>
                </Row>
            </Container>
        </Col>
    )
}

interface WatchlistFunctionalityCardProps {
    refreshTrigger: () => void;
}
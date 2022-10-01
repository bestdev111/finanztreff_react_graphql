import { CreatePortfolioOrWatchlist } from "components/profile/modals";
import { ProfileImportProcess } from "components/profile/modals/profile-import/ProfileImportProcess";
import { Col, Container, Row } from "react-bootstrap";
import "./OverviewEmptyPage.scss";

export function OverviewEmptyBannerComponent(props: OverviewEmptyBannerComponentProps) {
	return (
		<Container className="overview-new-banner bg-gray-dark text-white">
			<Row className="d-xl-flex d-lg-flex d-md-flex d-sm-none text-opacity-white fs-13px ">
				Mein finanztreff
			</Row>
			<Row className="justify-content-center text-center font-weight-bold fs-30px mt-xl-5 pt-xl-4 mt-lg-5 mt-sm-3 line-height-1">
				Sie haben noch nichts angelegt
			</Row>
			<Row className="justify-content-center fs-14px mt-xl-3 mt-lg-4 mt-sm-3">
				<Col xl={9} lg={11} md={12} sm={12} className="text-center px-0">
					Hier in "Mein finanztreff" stehen Ihnen die richtigen Werkzeuge zur Verfügung, um Ihre Anlagen im Blick zu behalten und die richtigen
					Entscheidungen zur richtigen Zeit zu treffen. <b>Kostenlose Portfolios, Watchlisten sowie Limits</b> stehen Ihnen bereits jetzt zur
					Verfügung, viele Analyse-, und Beobachtungsfunktionen sind in Arbeit oder in Planung. <b>Also, worauf warten Sie noch?</b>
				</Col>
			</Row>
			<Row className="justify-content-center mt-xl-2 mt-lg-3 mt-sm-3">
				<Row>
					<Col>
						<CreatePortfolioOrWatchlist name="Portfolio" title="Portfolio anlegen" onComplete={props.refreshTrigger} />
					</Col>
					<Col>
						<CreatePortfolioOrWatchlist name="Watchlist" title="Watchlist anlegen" onComplete={props.refreshTrigger} />
					</Col>
				</Row>
			</Row>
			<Row className="justify-content-center mt-xl-5 fs-14px mt-lg-4 mt-sm-5 text-center">
				Sie haben schon Portfolios, Watchlisten oder Limits im "alten" finanztreff.de?
			</Row>
			<Row className="justify-content-center mt-xl-3 mt-lg-3 mt-sm-2">

				<ProfileImportProcess>
					<span className="svg-icon live-portfolio-icon">
						<img src="/static/img/svg/icon_liveportfolio_white_dark.svg" className="mr-1" alt="" />
					</span>
					<span>finanztreff.de Daten importieren</span>
				</ProfileImportProcess>
			</Row>
		</Container>
	);
}

interface OverviewEmptyBannerComponentProps {
	refreshTrigger: () => void
}

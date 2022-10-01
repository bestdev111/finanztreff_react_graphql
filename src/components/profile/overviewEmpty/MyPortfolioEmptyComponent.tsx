import { CreatePortfolioOrWatchlist } from '../modals';
import { ProfileImportProcess } from '../modals/profile-import/ProfileImportProcess';

export function MyPortfolioEmptyComponent(props: MyPortfolioEmptyComponentProps) {
    return (
        <>
            <section className="main-section section-meine-portfolios">
				<div className="container">
					<div className="font-weight-bold d-flex font-family-roboto-slab">
                        <span className="png-icon top-move mx-1">
                            <img src="/static/img/suitcase-icon-empty.png" className="mb-n2 portfolios-section-icon" alt="" />
                        </span>
                        <h2 id="portfolios-section">Meine Portfolios</h2>
                    </div>

					<div className="content-row meine-finanztreff-cards">

						<div className="row row-cols-xl-3 row-cols-lg-2 row-cols-sm-1 gutter-16">

							<div className="col">
								<div className="content-wrapper card-wrapper action-card">
									<div className="content">
										<div className="empty-card-text">
											<h5>Sie sind bereits Mein finanztreff-Nutzer?</h5>
											<p>Hier können Sie Ihre bestehenden Portfolios aus dem "alten" finanztreff importieren:</p>
										</div>
										<div className="border-bottom-1 border-border-gray mb-3 pb-3 mx-3">
											<ProfileImportProcess>
												<span className="svg-icon live-portfolio-icon">
													<img src="/static/img/svg/icon_liveportfolio_white_dark.svg" className="" alt="" />
												</span>
												<span>Portfolios importieren</span>
											</ProfileImportProcess>
										</div>
										<div>
											<CreatePortfolioOrWatchlist name="Portfolio" onComplete={props.refreshTrigger}/>
										</div>
									</div>
								</div>
							</div>

						</div>

					</div>
				</div>
			</section>
        </>
    );
}

interface MyPortfolioEmptyComponentProps {
	refreshTrigger: () => void
}

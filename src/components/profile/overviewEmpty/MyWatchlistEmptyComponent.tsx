import { Component } from 'react';
import { CreatePortfolioOrWatchlist } from '../modals';

interface MyWatchlistEmptyComponentProps {
	refreshTrigger: () => void
}

export class MyWatchlistEmptyComponent extends Component<MyWatchlistEmptyComponentProps>{
    render() {
        return (
        <>
            <section className="main-section section-meine-watchlisten">
				<div className="container">
					<div className="font-weight-bold d-flex font-family-roboto-slab">
						<span className="svg-icon top-move mx-1">
							<img src="/static/img/svg/icon_watchlist_dark.svg" className="mb-n2 watchlists-section-icon" alt="" />
						</span>
						<h2 id="watchlists-section">Meine Watchlisten</h2>
					</div>
					<div className="content-row meine-finanztreff-cards">

						<div className="row row-cols-xl-3 row-cols-lg-2 row-cols-sm-1 gutter-16">

							<div className="col">
								<div className="content-wrapper card-wrapper action-card">
									<div className="content">
										<div>
											<CreatePortfolioOrWatchlist name="Watchlist" onComplete={this.props.refreshTrigger}/>
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
}
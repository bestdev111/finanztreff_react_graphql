import { Component } from 'react';
import { OverviewEmptyBannerComponent, MyPortfolioEmptyComponent, MyWatchlistEmptyComponent } from './index';

interface OverviewEmptyPageProps {
    refreshTrigger: () => void
}

export class OverviewEmptyPage extends Component<OverviewEmptyPageProps>{
    render() {
        return (
            <main>
                <div className="fader"></div>
                <OverviewEmptyBannerComponent refreshTrigger={this.props.refreshTrigger}/>
                <MyPortfolioEmptyComponent refreshTrigger={this.props.refreshTrigger}/>
                <MyWatchlistEmptyComponent refreshTrigger={this.props.refreshTrigger}/>
            </main>
        );
    }
}
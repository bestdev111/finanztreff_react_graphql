import { PortfolioEntry, WatchlistEntry } from "graphql/types";
import { InstrumentInfoRowCardView } from "./InstrumentInfoRowCardView";
import { AnalysesTitle } from "./NewsAndAnalysesComponent/AnalysesTitle";
import { NewsTitle } from "./NewsAndAnalysesComponent/NewsTitle";

export function NewsFeedViewCard({ entry }: NewsFeedViewCardProps) {
    return (
        <div className="mx-2">
            <InstrumentInfoRowCardView entry={entry} withTradeQuote={true} />
            <div className="d-flex justify-content-center text-center news-item-carousel">
                {
                    entry.instrument && entry.instrument.isin &&
                    <NewsTitle isins={[entry.instrument.isin]} />
                }
                {
                    entry.instrument && entry.instrument.isin &&
                    <AnalysesTitle isins={[entry.instrument.isin]} />
                }
            </div>
        </div>
    );
}

interface NewsFeedViewCardProps {
    entry: PortfolioEntry | WatchlistEntry
}
import { createChunk } from "components/common/utils";
import { Watchlist } from "graphql/types";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import { Row } from "react-bootstrap";
import { EmptyWatchlistCard } from "./WatchlistContentCards/EmptyWatchlistCard";
import { WatchlistCard } from "./WatchlistContentCards/WatchlistCard";
import { WatchlistFunctionalityCard } from "./WatchlistContentCards/WatchlistFunctionalityCard";

export function WatchlistsOverviewItems(props: WatchlistsOverviewItemsProps) {
    const columns = useBootstrapBreakpoint({
        xl: 3,
        lg: 2,
        sm: 1
    });

    return (
        <>
            {
                createChunk(props.watchlists.concat(props.emptyWatchlists), columns).map((watchlists: Watchlist[], i: number) => {
                    return (
                        <Row xl="3" lg="2" sm="1" className="mx-xl-n2 mx-lg-n2 mx-sm-0">
                            {
                                watchlists.map((watchlist: Watchlist, j: number) =>
                                    <>
                                        {
                                            watchlist.entries && watchlist.entries.length > 0 ?
                                                <WatchlistCard showMemo={props.showMemo} watchlist={watchlist} index={j + (i * columns)} refreshTrigger={props.refreshTrigger} key={watchlist.id} />
                                                :
                                                <EmptyWatchlistCard showMemo={props.showMemo} index={j + (i * columns)} watchlist={watchlist} refreshTrigger={props.refreshTrigger} />
                                        }

                                        {j + (i * columns) === props.watchlists.concat(props.emptyWatchlists).length - 1 &&
                                            <WatchlistFunctionalityCard refreshTrigger={props.refreshTrigger} />
                                        }
                                    </>
                                )
                            }
                        </Row>
                    );
                })
            }
            <Row xl="3" lg="2" sm="1" className="mx-xl-n2 mx-lg-n2 mx-sm-0">
                {
                    props.watchlists.concat(props.emptyWatchlists).length === 0 &&
                    <WatchlistFunctionalityCard refreshTrigger={props.refreshTrigger} />
                }
            </Row>
        </>
    );
}

interface WatchlistsOverviewItemsProps {
    watchlists: Watchlist[];
    emptyWatchlists: Watchlist[];
    refreshTrigger: () => void;
    showMemo: boolean;
    sort: SortOption
}


interface SortOption {
    sortType: string;
    direction: boolean;
}




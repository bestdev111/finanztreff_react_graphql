import { createChunk } from "components/common/utils";
import { LimitEntry, UserProfile, Watchlist, WatchlistEntry } from "graphql/types";
import { Row } from "react-bootstrap";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import { WatchlistEntryCard } from "./WatchlistContentCards/WatchlistEntryCard";
import { ExpiredEntryCard } from "./WatchlistContentCards/ExpiredEntryCard";
import { WatchlistFunctionalityCard } from "./WatchlistContentCards/WatchlistFunctionalityCard";

export function WatchlistGridViewComponent(props: WatchlistGridViewComponentProps) {

    const watchlist = props.watchlist;
    const view = props.view;

    const columns = useBootstrapBreakpoint({
        xl: 3,
        lg: 2,
        sm: 1
    });

    return (
        <>
            {
                createChunk(props.watchlistEntries.concat(props.expiredEntries), columns).map((entries: WatchlistEntry[], i: number) => {
                    return (
                        <Row xl="3" lg="2" sm="1" className="mx-xl-n2 mx-lg-n2 mx-sm-0">
                            {
                                entries.map((entry: WatchlistEntry, j: number) =>
                                    <>
                                        {entry.instrument ?
                                            <WatchlistEntryCard
                                                profile={props.profile} 
                                                memo={props.showMemo} 
                                                view={view} 
                                                entry={entry} 
                                                watchlistEntries={props.watchlistEntries} watchlist={watchlist} 
                                                index={j + (i * columns)} limits={props.limits} 
                                                refreshTrigger={props.refreshTrigger} />
                                            :
                                            <ExpiredEntryCard index={j + (i * columns)} entry={entry} refreshTrigger={props.refreshTrigger} watchlist={props.watchlist} />
                                        }
                                        {j + (i * columns) === props.watchlistEntries.concat(props.expiredEntries).length - 1 &&
                                            <WatchlistFunctionalityCard refreshTrigger={props.refreshTrigger} watchlist={props.watchlist} />
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
                    props.watchlistEntries.concat(props.expiredEntries).length === 0 &&
                    <WatchlistFunctionalityCard refreshTrigger={props.refreshTrigger} watchlist={props.watchlist} />
                }
            </Row>
        </>
    );
}

interface WatchlistGridViewComponentProps {
    profile: UserProfile;
    watchlist: Watchlist;
    watchlistEntries: WatchlistEntry[]
    expiredEntries: WatchlistEntry[];
    limits: LimitEntry[];
    refreshTrigger: () => void;
    view: string;
    showMemo: boolean;
}

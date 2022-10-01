import { LimitEntry, UserProfile, Watchlist, WatchlistEntry } from 'graphql/types';
import { orderWatchlistEntriesInListView } from '../utils';
import { ExpandedInformationViewTable } from './WatchlistExposePage/TableViews/ExpandedInformationViewTable';
import { PerformanceViewTable } from './WatchlistExposePage/TableViews/PerformanceViewTable';
import { SimpleViewTable } from './WatchlistExposePage/TableViews/SimpleViewTable';
import { WatchlistGridViewComponent } from './WatchlistExposePage/WatchlistGridViewComponent';
import "./WatchlistPageContent.scss"

interface WatchlistViewsComponentProps {
    profile: UserProfile;
    watchlist: Watchlist;
    view: string;
    sort: SortOption;
    refreshTrigger: () => void;
    limits: LimitEntry[];
    showMemo: boolean;
}

export function WatchlistViewsComponent(props: WatchlistViewsComponentProps & { handleSort: (value: string) => void, sort: SortOption }) {
    let view = props.view;
    let entriesWithoutInstrument = props.watchlist?.entries?.filter(current => current != null && current.instrument == null);

    const refetch = props.refreshTrigger;
    const limits = props.limits;

    let entries: WatchlistEntry[] = orderWatchlistEntriesInListView(props.watchlist.entries && props.watchlist.entries.filter(current => current.instrument) || [], props.sort.sortType, props.sort.direction);

    if ((view === "Chart" || view === "Kennzahlen" || view === "PerformanceKacheln" || view === "News/Analysen") && props.sort.sortType.startsWith("Table")) {
        props.handleSort("Name");
    }

    if (!(view === "Chart" || view === "Kennzahlen" || view === "PerformanceKacheln" || view === "News/Analysen") && !props.sort.sortType.startsWith("Table")) {
        props.handleSort("TableBezeichnung");
    }

    return (
        <>
            {(view === "Chart" || view === "Kennzahlen" || view === "PerformanceKacheln" || view === "News/Analysen") &&
                <WatchlistGridViewComponent 
                    profile={props.profile}
                    watchlist={props.watchlist}
                    watchlistEntries={entries || []}
                    expiredEntries={entriesWithoutInstrument || []}
                    refreshTrigger={() => props.refreshTrigger && props.refreshTrigger()}
                    limits={props.limits || []}
                    view={view}
                    showMemo={props.showMemo} />

            }
            {view === "PerformanceListe" &&
                <PerformanceViewTable
                    profile={props.profile}
                    sort={props.sort}
                    handleSort={props.handleSort}
                    watchlist={props.watchlist}
                    entries={entries || []}
                    entriesWithoutInstrument={entriesWithoutInstrument || []}
                    refreshTrigger={() => props.refreshTrigger && props.refreshTrigger()}
                    limits={limits}
                    refetch={refetch}
                    showMemo={props.showMemo}
                />
            }
            {view === "Einfach" &&
                <SimpleViewTable
                    profile={props.profile}
                    sort={props.sort}
                    handleSort={props.handleSort}
                    watchlist={props.watchlist}
                    entries={entries || []}
                    entriesWithoutInstrument={entriesWithoutInstrument || []}
                    refreshTrigger={() => props.refreshTrigger && props.refreshTrigger()}
                    limits={limits}
                    refetch={refetch}
                    showMemo={props.showMemo}
                />
            }
            {view === "Erweitert" &&
                <ExpandedInformationViewTable
                    profile={props.profile}
                    sort={props.sort}
                    handleSort={props.handleSort}
                    watchlist={props.watchlist}
                    entries={entries || []}
                    entriesWithoutInstrument={entriesWithoutInstrument || []}
                    refreshTrigger={() => props.refreshTrigger && props.refreshTrigger()}
                    limits={limits}
                    refetch={refetch}
                    showMemo={props.showMemo} />
            }
        </>
    )
}


export interface WatchlistEntriesViewProps {
    profile: UserProfile;
    handleSort: (value: string) => void;
    watchlist: Watchlist;
    entries: WatchlistEntry[];
    entriesWithoutInstrument: WatchlistEntry[];
    refreshTrigger: () => void;
    refetch: () => void;
    limits: LimitEntry[];
    showMemo: boolean;
    sort: SortOption;
}


interface SortOption {
    sortType: string;
    direction: boolean;
}
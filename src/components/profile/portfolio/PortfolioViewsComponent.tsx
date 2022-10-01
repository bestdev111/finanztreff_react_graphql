import { SimpleViewTable } from "./PortfolioExposeNewPage/TableViews/SimpleViewTable";
import { getOrderInTablePortfolio } from '../utils';
import { LimitEntry, Portfolio, PortfolioEntry, PortfolioPerformanceEntry, UserProfile } from '../../../graphql/types';
import { PerformanceViewTable } from "./PortfolioExposeNewPage/TableViews/PerformanceViewTable";
import { ExpandedInformationViewTable } from "./PortfolioExposeNewPage/TableViews/ExpandedInformationViewTable";
import "./PortfolioPageContent.scss";
import { PortfolioGridViewComponent } from "./PortfolioExposeNewPage/PortfolioGridViewComponent";

interface PortfolioViewsComponentProps {
    profile: UserProfile;
    portfolio: Portfolio;
    performanceEntries: PortfolioPerformanceEntry[];
    view: string;
    sort: SortOption;
    refreshTrigger: () => void;
    limits: LimitEntry[];
    showMemo: boolean;
    realportfolio?: boolean
}

export function PortfolioViewsComponent(props: PortfolioViewsComponentProps & {handleSort: (value: SortOption) => void}) {
    let view = props.view;
    let entriesWithoutInstrument = props.portfolio?.entries?.filter(current => current != null && current.instrument == null);
    const limits = props.limits;

    let entries: PortfolioEntry[] = getOrderInTablePortfolio(props.sort.sortType, props.sort.direction, props.portfolio);

    if((view === "Portfolio" || view === "Chart" || view === "Kennzahlen" || view === "PerformanceKacheln" || view === "News/Analysen") && props.sort.sortType.startsWith("Table")){
        props.handleSort({sortType: "Name", direction: true});
    }
    
    if(!(view === "Portfolio" || view === "Chart" || view === "Kennzahlen" || view === "PerformanceKacheln" || view === "News/Analysen") && !props.sort.sortType.startsWith("Table")){
        props.handleSort({sortType: "TableBezeichnung", direction: true});
    }

    return (
        <>
            {(view === "Portfolio" || view === "Chart" || view === "Kennzahlen" || view === "PerformanceKacheln" || view === "News/Analysen") &&
                <PortfolioGridViewComponent profile={props.profile} portfolio={props.portfolio} performanceEntries={props.performanceEntries}
                    portfolioEntries={entries || []}
                    expiredEntries={entriesWithoutInstrument || []}
                    refreshTrigger={props.refreshTrigger}
                    limits={props.limits || []}
                    view={view}
                    showMemo={props.showMemo} realportfolio={props.realportfolio}/>

            }
            {view === "Einfach" &&
                <SimpleViewTable profile={props.profile} portfolio={props.portfolio} performanceEntries={props.performanceEntries}
                    sort={props.sort}
                    entries={entries || []}
                    entriesWithoutInstrument={entriesWithoutInstrument || []}
                    limits={limits}
                    refreshTrigger={props.refreshTrigger}
                    showMemo={props.showMemo} realportfolio={props.realportfolio}
                />
            }
            {view === "PerformanceListe" &&
                <PerformanceViewTable profile={props.profile} portfolio={props.portfolio} performanceEntries={props.performanceEntries}
                    sort={props.sort}
                    entries={entries || []}
                    entriesWithoutInstrument={entriesWithoutInstrument || []}
                    refreshTrigger={props.refreshTrigger}
                    limits={limits}
                    showMemo={props.showMemo} realportfolio={props.realportfolio}
                />
            }
            {view === "Erweitert" &&
                <ExpandedInformationViewTable profile={props.profile} portfolio={props.portfolio} performanceEntries={props.performanceEntries}
                    sort={props.sort}
                    entries={entries || []}
                    entriesWithoutInstrument={entriesWithoutInstrument || []}
                    refreshTrigger={props.refreshTrigger}
                    limits={limits}
                    showMemo={props.showMemo} realportfolio={props.realportfolio}
                />
            }
        </>
    );
}

export interface PortfolioEntriesViewProps {
    profile: UserProfile;
    portfolio: Portfolio;
    performanceEntries: PortfolioPerformanceEntry[];
    entriesWithoutInstrument: PortfolioEntry[];
    entries: PortfolioEntry[];
    refreshTrigger: () => void;
    limits: LimitEntry[];
    showMemo?: boolean;
    realportfolio?: boolean
    sort: SortOption
}

interface SortOption {
    sortType: string;
    direction: boolean;
}
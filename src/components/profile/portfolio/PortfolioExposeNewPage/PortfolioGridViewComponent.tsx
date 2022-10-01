import { createChunk } from "components/common/utils";
import { LimitEntry, Portfolio, PortfolioEntry, PortfolioPerformanceEntry, UserProfile } from "graphql/types";
import { Row } from "react-bootstrap";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import { PortfolioFunctionalityCard } from "./PortfolioContentCards/PortfolioFunctionalityCard";
import { ExpiredEntryCard } from "./PortfolioContentCards/ExpiredEntryCard";
import { PortfolioEntryCard } from "./PortfolioContentCards/PortfolioEntryCard";

export function PortfolioGridViewComponent(props: PortfolioGridViewComponentProps) {

    const portfolio = props.portfolio;
    const view = props.view;

    const columns = useBootstrapBreakpoint({
        xl: 3,
        lg: 2,
        sm: 1
    });
    return (
        <>
            {
                createChunk(props.portfolioEntries.concat(props.expiredEntries), columns).map((entries: PortfolioEntry[], i: number) => {
                    return (
                        <Row xl="3" lg="2" sm="1" className="mx-xl-n2 mx-lg-n2 mx-sm-0">
                            {
                                entries.map((entry: PortfolioEntry, j: number) =>
                                    <>
                                        {entry.instrument ?
                                            <PortfolioEntryCard
                                                profile={props.profile} 
                                                realportfolio={props.realportfolio} 
                                                memo={props.showMemo} 
                                                view={view} 
                                                entry={entry} 
                                                portfolioEntries={props.portfolioEntries} 
                                                portfolio={portfolio} 
                                                index={j + (i * columns)} 
                                                limits={props.limits} 
                                                refreshTrigger={props.refreshTrigger} />
                                            :
                                            <ExpiredEntryCard index={j + (i * columns)*(-1)} entry={entry} refreshTrigger={props.refreshTrigger} portfolio={props.portfolio} />
                                        }
                                        {j + (i * columns) === props.portfolioEntries.concat(props.expiredEntries).length - 1 &&
                                            <PortfolioFunctionalityCard key={j} refreshTrigger={props.refreshTrigger} portfolio={props.portfolio} performanceEntries={props.performanceEntries} realportfolio={props.realportfolio} />
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
                    props.portfolioEntries.concat(props.expiredEntries).length === 0 &&
                    <PortfolioFunctionalityCard refreshTrigger={props.refreshTrigger} portfolio={props.portfolio} performanceEntries={props.performanceEntries} realportfolio={props.realportfolio} />
                }
            </Row>
        </>
    );
}



interface PortfolioGridViewComponentProps {
    profile: UserProfile;
    portfolio: Portfolio;
    performanceEntries: PortfolioPerformanceEntry[];
    portfolioEntries: PortfolioEntry[]
    expiredEntries: PortfolioEntry[];
    limits: LimitEntry[];
    refreshTrigger: () => void;
    view: string;
    showMemo: boolean;
    realportfolio?: boolean

}

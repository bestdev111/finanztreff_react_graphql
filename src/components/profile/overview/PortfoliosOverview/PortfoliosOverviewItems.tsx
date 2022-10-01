import { createChunk } from "components/common/utils";
import { Portfolio } from "graphql/types";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import { Row, Col } from "react-bootstrap";
import { EmptyPortfolioCard } from "./PortfolioContentCards/EmptyPortfolioCard";
import { PortfolioCard } from "./PortfolioContentCards/PortfolioCard";
import { PortfolioFunctionalityCard } from "./PortfolioContentCards/PortfolioFunctionalityCard";

export function PortfoliosOverviewItems(props: PortfoliosOverviewItemsProps) {
    const columns = useBootstrapBreakpoint({
        xl: 3,
        lg: 2,
        sm: 1
    });

    return (
        <>
            {
                createChunk(props.portfolios.concat(props.emptyPortfolios), columns).map((portfolios: Portfolio[], i: number) => {
                    return (
                        <Row xl="3" lg="2" sm="1" className="px-xl-2 px-lg-2 px-md-2 px-sm-0">
                            {
                                portfolios.map((portfolio: Portfolio, j: number) =>
                                <>
                                    <Col lg={6} xs={12} key={i} className="p-2">
                                        {
                                            portfolio.entries && portfolio.entries.length > 0 ?
                                                <PortfolioCard realportfolio={props.realportfolio} memo={props.showMemo} portfolio={portfolio} index={j + (i * columns)} refreshTrigger={props.refreshTrigger} key={portfolio.id} />
                                                :
                                                <EmptyPortfolioCard realportfolio={props.realportfolio} showMemo={props.showMemo} index={j + (i * columns)} portfolio={portfolio} refreshTrigger={props.refreshTrigger} />
                                        }
                                    </Col>
                                        {j + (i * columns) === props.portfolios.concat(props.emptyPortfolios).length - 1 &&
                                            <PortfolioFunctionalityCard refreshTrigger={props.refreshTrigger} realportfolio={props.realportfolio}/>
                                        }
                                        </>
                                )
                            }
                        </Row>
                    );
                })
            }
            <Row xl="3" lg="2" sm="1" className="px-xl-2 px-lg-2 px-md-2 px-sm-0">
                {
                    props.portfolios.concat(props.emptyPortfolios).length === 0 &&
                    <PortfolioFunctionalityCard refreshTrigger={props.refreshTrigger} realportfolio={props.realportfolio} />
                }
            </Row>
        </>
    );
}

interface PortfoliosOverviewItemsProps {
    portfolios: Portfolio[];
    emptyPortfolios: Portfolio[];
    refreshTrigger: () => void;
    showMemo: boolean;
    sort: SortOption;
    realportfolio?: boolean
}


interface SortOption {
    sortType: string;
    direction: boolean;
}




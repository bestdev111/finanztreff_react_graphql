import { PortfolioInstrumentAdd } from "components/common";
import { AccountOverviewModal, AccountDeposit, AccountWithdrawal, TransactionHistory } from "components/profile/modals";
import { TransactionImportModal } from "components/profile/modals/TransactionImportModal/TransactionImportModal";
import { Portfolio, PortfolioPerformanceEntry } from "graphql/types";
import { Col } from "react-bootstrap";
import { CSVExportButton } from "./CSVExportButton";

export function PortfolioFunctionalityCard(props: PortfolioFunctionalityCardProps) {

    return (
        <Col key={-1} className="px-xl-2 px-lg-2 px-0 mb-2">
            <div className="content-wrapper d-flex flex-column justify-content-center text-center" style={{ height: "252px" }}>
                <div>
                    {props.portfolio.real && props.realportfolio ?
                        <TransactionImportModal portfolio={props.portfolio} onComplete={props.refreshTrigger} />
                        :
                        <PortfolioInstrumentAdd
                            className="p-1"
                            portfolioId={props.portfolio.id}
                            onComplete={props.refreshTrigger}>
                            <span className="svg-icon mr-1">
                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_plus_white.svg"} height="20" alt="" />
                            </span>
                            <span>Wertpapier hinzufügen</span>
                        </PortfolioInstrumentAdd>
                    }
                </div>
                <div className="my-2">
                    <AccountOverviewModal portfolio={props.portfolio} inBanner={false} refreshTrigger={props.refreshTrigger} />
                    <span className="ml-2">
                        <AccountDeposit portfolio={props.portfolio} onComplete={props.refreshTrigger} />
                    </span>
                    <span className="ml-1">
                        <AccountWithdrawal portfolio={props.portfolio} onComplete={props.refreshTrigger} />
                    </span>
                </div>
                <div>
                    <TransactionHistory portfolio={props.portfolio} performanceEntries={props.performanceEntries} inBanner={false} />
                </div>
                <div className="mt-2">
                    <CSVExportButton portfolio={props.portfolio} />
                </div>
            </div>
        </Col>
    )
}

interface PortfolioFunctionalityCardProps {
    refreshTrigger: () => void;
    realportfolio?: boolean
    portfolio: Portfolio;
    performanceEntries: PortfolioPerformanceEntry[];
}

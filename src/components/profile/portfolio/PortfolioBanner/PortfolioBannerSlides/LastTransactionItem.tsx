import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { makeTransactionEntries, transactionHistoryChartOptions } from 'components/profile/utils';
import { Col, Row } from 'react-bootstrap';
import { TransactionHistory } from 'components/profile/modals';
import { Portfolio, PortfolioPerformanceEntry } from 'graphql/types';

export function LastTransactionItem(props: LastTransactionItemProps) {
    let performanceEntriesWithMarkers = makeTransactionEntries(props.portfolio, props.performanceEntries);

    return (
        <Row className="mt-2 mb-5">
            <Col xl={12} lg={12} md={12} sm={12} className="px-0 mt-lg-0 mt-lg-5">
                <Row className="text-white justify-content-center fs-15-21-23 mb-4">Letzte Transaktionen</Row>
                <Col xl={12} lg={12} md={12} sm={12} className="w-100 px-2">
                    <HighchartsReact highcharts={Highcharts} options={transactionHistoryChartOptions(performanceEntriesWithMarkers, "230px", "rgba(255, 255, 255, 0.1)", "#383838")} />
                </Col>
                <Col xl={12} className="text-white text-right">
                    <TransactionHistory portfolio={props.portfolio} performanceEntries={props.performanceEntries} inBanner={true} />
                </Col>
            </Col>
        </Row>
    );
}

interface LastTransactionItemProps {
    portfolio: Portfolio;
    performanceEntries: PortfolioPerformanceEntry[]
}

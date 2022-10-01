import classNames from "classnames";
import { getPerformance } from "components/profile/utils";
import { PortfolioEntry, QuoteType, WatchlistEntry } from "generated/graphql";
import moment from "moment";
import { numberFormatWithSign } from "utils";


export function ViewTablePerformanceRow(props: ViewTablePerformanceRowProps) {
    let intraday = props.intradayChange || 0;
    
    const quote = props.entry && props.entry.snapQuote && props.entry.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
    const oldAssetNoTradding = moment().subtract(10, "d").isAfter(moment(quote && quote.when)) || !quote;
    return (
        <>
        {oldAssetNoTradding ? 
            <td className="text-right">- %</td>
            :
            <td className={classNames("text-right",intraday > 0 ? "text-green" : intraday < 0 ? "text-red" : "text-grey")}>{numberFormatWithSign(props.intradayChange, "%")}</td>
        }
            <td className={formatCellColor(props.entry, 'WEEK1')}>{formatCell(props.entry, 'WEEK1')}</td>
            <td className={formatCellColor(props.entry, 'MONTH1')}>{formatCell(props.entry, 'MONTH1')}</td>
            <td className={formatCellColor(props.entry, 'MONTH6')}>{formatCell(props.entry, 'MONTH6')}</td>
            <td className={formatCellColor(props.entry, 'WEEK52')}>{formatCell(props.entry, 'WEEK52')}</td>
            <td className={formatCellColor(props.entry, 'YEAR3')}>{formatCell(props.entry, 'YEAR3')}</td>
        </>
    )
}

function formatCell(entry?: PortfolioEntry | WatchlistEntry, type?: string) {
    return entry && type && numberFormatWithSign(getPerformance(entry, type), '%');
}

function formatCellColor(entry?: PortfolioEntry | WatchlistEntry, type?: string) {
    return entry && type && formatColor(getPerformance(entry, type) || 0);
}

function formatColor(perf: number) {
    return (perf > 0 ? "text-green" : perf < 0 ? "text-pink" : "") + " text-right";
}

interface ViewTablePerformanceRowProps {
    entry?: PortfolioEntry | WatchlistEntry;
    intradayChange?: number;
}

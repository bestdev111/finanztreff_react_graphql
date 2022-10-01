import moment from "moment";
import {QuoteHistory} from "../../../../generated/graphql";

export interface QuoteInformation {
    lowPrice: number | null;
    highPrice: number | null;
    firstPrice: number | null;
    lastPrice: number | null;
    volume: number | null;
    closed: boolean;
    when: moment.Moment;
}

export function mapQuoteHistory(quote?: QuoteHistory | null): QuoteInformation {
    return {
        lowPrice: quote?.lowPrice ? quote.lowPrice : 0,
        highPrice: quote?.highPrice ? quote.highPrice : 9999,
        firstPrice: quote?.firstPrice ? quote.firstPrice : 0,
        volume: quote?.volume,
        lastPrice: quote?.lastPrice ? quote.lastPrice : 0,
        when: quote?.date ? moment(quote.date).endOf('day') : moment(),
        closed: !(quote?.date === moment().format("YYYY-MM-DD"))
    }
}

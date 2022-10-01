import {getAssetGroup, getCurrentDate} from "components/profile/utils";
import { WatchlistEntry, QuoteType } from "graphql/types";
import Button from "react-bootstrap/esm/Button";
import {
    quoteFormat,
    numberFormatWithSign,
    fullDateTimeFormat,
    numberFormat,
    formatPrice,
    formatPriceWithSign
} from "utils";
import { CSVLink } from 'react-csv';

export function CSVExportButton(props: { watchlist: WatchlistEntry[], watchlistName: string, entriesWithoutInstrument: WatchlistEntry[]}) {

    const entries: WatchlistEntry[] = props.watchlist && props.watchlist.length > 0 && props.watchlist.filter(current => current.instrument) || [];
    const entriesWithoutInstrument = props.watchlist && props.watchlist && props.watchlist.filter(current => !current.instrument);

    const watchlistItems: string[][] = entries!.map((entry: WatchlistEntry, index: number) => {
        const quote = (entry.snapQuote &&
            (entry.snapQuote.quotes.find(current => current?.type === QuoteType.Trade)
                || entry.snapQuote.quotes.find(current => current?.type === QuoteType.NetAssetValue))) || undefined;
        const assetType: string = getAssetGroup(entry?.instrument?.group.assetGroup);
        const ASK = (entry.snapQuote &&
            (entry.snapQuote.quotes.find(current => current?.type === QuoteType.Ask))) || undefined;

        const BID = (entry.snapQuote &&
            (entry.snapQuote.quotes.find(current => current?.type === QuoteType.Bid))) || undefined;

            const performance = entry.instrument?.performance;

            const vola = (performance || []).find(current => current.period === 'MONTH1')?.vola;

            const currencyCode: string = entry.instrument?.currency.displayCode || "-";
        return ([
            index.toString() || "-",
            entry.name ? entry.name : "-" || "-",
            assetType ? assetType : "-" || "-",
            entry.instrument && entry.instrument.wkn ? entry.instrument.wkn : "-" || "-",
            (entry.instrument && entry.instrument.exchange ? entry.instrument.exchange.name : "-") || "-",
            entry.price ? (formatPrice(entry.price, entry?.instrument?.group?.assetGroup,quote?.value, currencyCode)) : "-" || "-",
            quoteFormat(entry.entryTime) || "-",
            (quote && quote.value ? (numberFormat(quote.value)) : "-" || "-"),
            currencyCode,
            (quote ? formatPriceWithSign(quote.change, entry?.instrument?.group?.assetGroup,quote?.value, currencyCode) : "-" || "-"),
            (quote ? numberFormatWithSign(quote.percentChange, "%") : "-" || "-"),
            fullDateTimeFormat(quote?.when),
            entry.snapQuote ? numberFormat(entry.snapQuote.cumulativeTrades) : "-",
            entry.snapQuote && entry.snapQuote.cumulativeVolume ? numberFormat(entry.snapQuote?.cumulativeVolume) : "-",
            vola ? numberFormat(vola, "%"): "-",

            (BID && BID.value ? (formatPrice(BID.value, entry?.instrument?.group?.assetGroup,quote?.value, currencyCode)) : "-" || "-"),
            (BID ? numberFormat(BID.size) : "-" || "-"),
            fullDateTimeFormat(BID?.when),

            (ASK && ASK.value ? formatPrice(ASK.value, entry?.instrument?.group?.assetGroup,quote?.value, currencyCode) : "-" || "-"),
            (ASK ? numberFormat(ASK.size) : "-" || "-"),
            fullDateTimeFormat(ASK?.when),

            entry.snapQuote && entry.snapQuote.yesterdayPrice ? numberFormat(entry.snapQuote.yesterdayPrice) : "-",
            currencyCode,
            entry.snapQuote && entry.snapQuote.firstPrice ? numberFormat(entry.snapQuote.firstPrice) : "-",
            currencyCode,
            entry.snapQuote && entry.snapQuote.highPrice ? numberFormat(entry.snapQuote.highPrice) : "-",
            currencyCode,
            entry.snapQuote && entry.snapQuote.lowPrice ? numberFormat(entry.snapQuote.lowPrice) : "-",
            currencyCode
        ]);
    });

    const watchlistEntriesWithoutInstruments: string[][] = (props.entriesWithoutInstrument        || []).map((entry, index) => {
        return (
            [index.toString() || "-",
            (entry && entry.name ? entry.name : "-") || "-",
                "-", "-", "-", "-", "-", "-", "-", "-", "-","-", "-", "-", "-", "-","-","-", "-","-", "-", "-", "-", "-", "-", "-","-", "-", "-", "-", "-", "-", "-"
            ]
        )
    });

    const csvData = [
        ["#", 'Bezeichnung', 'Gattung', 'WKN', 'Boerse',"Aufnahme Kurs","","Aufnahme Datum", 'Kurs aktuell',"","+/-","", "%", "Datum",
            'Trades', "Umsatz", "Vola",

            'BID',"","Stueck", "Datum",
            'ASK',"","Stueck", "Datum",
            "Vortag","", "Eröffnung","","Hoch","", "Tief",""

        ], ...watchlistItems, [], ...watchlistEntriesWithoutInstruments]

    return (
        <Button variant="primary" disabled={props.watchlist && props.watchlist.length > 0 ? false : true}>
            {props.watchlist && props.watchlist.length > 0 ?
                <CSVLink separator=";" filename={"export_" + "watchlist_" + props.watchlistName?.split(' ').join('_') + "_" + getCurrentDate()} className="text-white" data={csvData} >csv export</CSVLink>
                : "csv export"
            }
        </Button>
    );
}

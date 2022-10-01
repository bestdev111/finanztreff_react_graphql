import {
    calculatePortfoliotEntryDelay,
    getAssetGroup,
    calculateEntryTotalInPositionCurrency,
    getCurrencyCode,
    getRateCurrency,
    calculatePortfolioEntry,
    calculatePortfolioEntryErtrage,
    calculateChange,
    totalPortfolioList,
    calculatePortfolio,
    calculatePortfolioKonto,
    calculatePortfolioErtrage,
    getCurrentDate, getOrderInTablePortfolio
} from "components/profile/utils";
import { Portfolio, PortfolioEntry, QuoteType } from "generated/graphql";
import { Button } from "react-bootstrap";
import {formatPrice, fullDateTimeFormat, numberFormat, numberFormatWithSign, quoteFormat, REALDATE_FORMAT} from "utils";
import { CSVLink } from 'react-csv';


export function CSVExportButton(props: { portfolio: Portfolio }) {
    const order : string | null | undefined  = props.portfolio.viewOrder;
    const direction: boolean = !!props.portfolio.viewOrderAsc ;
    const filteredEntries: PortfolioEntry[] =  order && getOrderInTablePortfolio(order,direction, props.portfolio) || [];
    const entriesWithoutInstrument = props.portfolio && props.portfolio.entries && props.portfolio.entries.filter(current => !current.instrument);
    const portfolioItems: string[][] = filteredEntries!.map((entry: PortfolioEntry, index: number) => {
        const quote = (entry.snapQuote &&
            (entry.snapQuote.quotes.find(current => current?.type === QuoteType.Trade)
                || entry.snapQuote.quotes.find(current => current?.type === QuoteType.NetAssetValue))) || undefined;
        const assetType: string = getAssetGroup(entry?.instrument?.group.assetGroup);

        const initialInPositionCurrency = calculateEntryTotalInPositionCurrency(entry);
        const currencyCode = getCurrencyCode(entry);
        const rateCurrency = getRateCurrency(entry) || "";

        const [initial, yesterday, last] = calculatePortfolioEntry(entry);
        const ertrage: number = calculatePortfolioEntryErtrage(props.portfolio, entry);
        const ertragePct: number = initial > 0 ? (ertrage / initial) * 100 : 0;
        const [diff, diffPct] = calculateChange(initial, last);
        const totalDiff: number = diff + ertrage;
        const totalPct: number = (diffPct + ertragePct);
        let [purchasePrice, income, priceGain, totalInPortoflio] = totalPortfolioList(props.portfolio);
        const percentOfPortfolio: number = last / totalInPortoflio * 100;
        return ([
            index.toString() || "-",
            numberFormat(entry.quantity), entry.name ? entry.name : "-" || "-",
            assetType ? assetType : "-" || "-",
            numberFormat(percentOfPortfolio, "%") || "-",
            entry.instrument && entry.instrument.wkn ? entry.instrument.wkn : "-" || "-",
            (entry.instrument && entry.instrument.exchange ? entry.instrument.exchange.name : "-") || "-",
            formatPrice(quote?.value),
            rateCurrency,
            numberFormatWithSign(quote?.change),
            rateCurrency,
            (quote ? numberFormatWithSign(quote.percentChange, "%") : "-" || "-"),
            (quote ? fullDateTimeFormat(quote.when) : "-" || "-"),
            REALDATE_FORMAT(entry.entryTime) || "-",
            numberFormat(entry.price),
            currencyCode,
            (entry && entry.buyCurrencyPrice ? entry.buyCurrencyPrice.toString() : "-") || "-",
            numberFormat(initialInPositionCurrency),
            "EUR",
            numberFormat(entry.buyCharges),
            "EUR",
            numberFormatWithSign(ertrage),
            "EUR",
            numberFormatWithSign(ertragePct, "%"),
            numberFormatWithSign(diff),
            "EUR",
            numberFormatWithSign(diffPct, "%"),
            numberFormatWithSign(totalDiff),
            "EUR",
            numberFormatWithSign(totalPct, "%"),
            numberFormat(last),
            "EUR"
        ]);
    });

    const portfolioEntriesWithoutInstruments: string[][] = (entriesWithoutInstrument || []).map((entry, index) => {
        return (
            [index.toString() || "-",
            (entry && entry.quantity ? numberFormat(entry.quantity) : "-") || "-",
            (entry && entry.name ? entry.name : "-") || "-",
                "-", "-", "-", "-", "-", "-","-", "-","","", "", "", "", "", "", "", "", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-",
            ]
        )
    });


    const [initial, yesterday, last] = calculatePortfolio(props.portfolio);
    const [diff, diffPct] = calculateChange(initial, last);

    const konto: number = calculatePortfolioKonto(props.portfolio);
    const ertrage: number = calculatePortfolioErtrage(props.portfolio);
    const ertragePct: number = initial > 0 ? (ertrage / initial) * 100 : 0;

    const totalDiff: number = diff + ertrage;
    const totalPct: number = initial > 0 ? (totalDiff / initial) * 100 : 0;
    const total = last + ertrage;

    const portftolioSumary: string[][] = [
        [ "", "", "", "", "","","", "", "", "", "", "", "", "", "", "", "", "Kaufsumme*", "","","", "Erträge*", "", "", "Kursgewinne*", "", "", "", "", "", "Summe*", "", ""], 
        [ "","", "", "", "", "", "","","", "", "", "", "", "", "Gesamt Portfolio*","", "", numberFormat(initial, " EUR"), "", "", "", numberFormatWithSign(ertrage, " EUR"),"",  numberFormatWithSign(ertragePct, "%"), numberFormatWithSign(diff, " EUR"),
        "",numberFormatWithSign(diffPct, "%"), "","", numberFormatWithSign(totalPct, "%"),numberFormat(total, " EUR"),
    ],[], ["","", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Konto", numberFormatWithSign(konto, " EUR")],[], ["","", "","","", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "*Zur Berechnung", " der Portfolio-Gesamtsummen", " wurden ausländische", " Währungen zum aktuellen", " Währungskurs in ", " EUR umgerechnet."]
    ];
    const csvData = [
        ["#", 'Stueck', 'Bezeichnung', 'Gattung', 'Gewichtung', 'WKN', "Boerse", 'Kurs aktuell',"", "+/-","", "%", "Zeit",
            'Kaufdatum', "Kaufkurs","", "Wechselkurs", "Kaufsumme","", "Spesen","",
            "+/- Erträge","", "% Erträge",
            "+/- Kursgewinn","", "% Kursgewinn",
            "+/-Gesamt","", "% Gesamt", "Gesamtsumme",""], ...portfolioItems, [], ...portfolioEntriesWithoutInstruments, [], ...portftolioSumary]

    return (
        <Button className="pr-dn" variant="primary" disabled={props.portfolio.entries && props.portfolio.entries.length > 0 ? false : true}>
            {props.portfolio.entries && props.portfolio.entries.length > 0 ?
                <CSVLink separator=";" filename={"export_" + "portfolio_" + props.portfolio.name?.split('.').join('_').split(' ').join('_') + "_" + getCurrentDate()} className="text-white" data={csvData} >csv export</CSVLink>
                : "csv export"
            }
        </Button>
    );
}

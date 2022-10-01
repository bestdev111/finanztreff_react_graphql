import { Portfolio, AssetGroup, PortfolioEntry, PortfolioPerformanceEntry, WatchlistEntry, AccountEntry, ChartPoint, ChartSeries, SnapQuote, Quote, QuoteType, LimitEntry } from '../../graphql/types';
import { REALDATE_FORMAT } from '../../utils/index'
import { SeriesOptionsType } from 'highcharts';
import { Maybe } from 'graphql/jsutils/Maybe';
import moment from 'moment';
import { getPercentOfChange } from './LimitsPage/LimitChartComponent';

function getMin(min: number, num: number) {
    return num < min ? num : min;
}

export function getMinDate(portfolio: Portfolio) {
    return portfolio.entries?.map(entry => Date.parse(entry.entryTime)).reduce(getMin, Date.now());
}

function getSumEx(total: number[], num: number[]) {
    return [total[0] + num[0], total[1] + num[1], total[2] + num[2]];
}

export function calculateChange(from: number, to: number) {
    const diff: number = to - from;
    const diffPct: number = from === 0 ? 0 : diff / from * 100;
    return [diff, diffPct];
}

export function calculatePct(part: number, total: number) {
    return total === 0 ? 0 : part / total * 100;
}

export function getTradeQuote(snapQuote: Maybe<SnapQuote>) {
    return snapQuote && snapQuote.quotes && 
        snapQuote.quotes.find(current => current && ((current.type === QuoteType.Trade) || (current.type === QuoteType.NetAssetValue)));
}

export function getSnapQuote(entry: PortfolioEntry) {
    return entry && getTradeQuote(entry.snapQuote);
}

function getLastPrice(entry: PortfolioEntry) {
    const quote = getSnapQuote(entry);
    if (quote && quote.value) {
        return quote.value;
    }

    if (entry.snapQuote && entry.snapQuote.lastPrice) {
        return entry.snapQuote.lastPrice;
    }

    return entry.price;
}

function getYesterdayPrice(entry: PortfolioEntry) {
    if (entry.snapQuote) {
        if (entry.snapQuote.yesterdayPrice) {
            return entry.snapQuote.yesterdayPrice;
        }

        const quote = getSnapQuote(entry);
        if (quote && quote.value && quote.change) {
            return quote.value - quote.change;
        }
    }

    return getLastPrice(entry);
}

function calculateEntryTotal(
    price: number, 
    quantity: number, 
    charges: number, 
    nominalValue?: Maybe<number>, 
    currency?: Maybe<string>,
    rate?: Maybe<number>, 
) {
    rate = rate ? rate : 1;
    currency = currency ? currency : "";
    if (currency === "XXZ") {
        nominalValue = nominalValue ? nominalValue : 1000;
        return rate * ((price / 100) * quantity) + charges;
    } else {
        return rate * (price * quantity) + charges;
    }
}

function entryTotalInPositionCurrency(
    price: number, 
    quantity: number, 
    charges: number, 
    nominalValue?: Maybe<number>, 
    currency?: Maybe<string>,
    rate?: Maybe<number>, 
) {
    rate = rate ? rate : 1;
    currency = currency ? currency : "";
    if (currency === "XXZ") {
        nominalValue = nominalValue ? nominalValue : 1000;
        return (price / 100) * quantity + charges / rate;
    } else {
        return (price * quantity) + charges / rate;
    }
}

export function calculatePortfolioEntryTotal(price: number, entry: PortfolioEntry) {
    return calculateEntryTotal(
        price, entry.quantity, entry.buyCharges, entry.nominalValue, entry.instrument?.currency.displayCode, entry.buyCurrencyPrice
    );
}

export function calculatePortfolioEntryValue(price: number, entry: PortfolioEntry, rate: Maybe<number> | undefined) {
    const currencyPrice = rate ? rate : entry.buyCurrencyPrice;
    return calculateEntryTotal(
        price, entry.quantity, 0, entry.nominalValue, entry.instrument?.currency.displayCode, currencyPrice
    );
}

export function calculateEntryTotalInPositionCurrency(entry: PortfolioEntry): number {
    return calculateEntryTotal(
        entry.price, entry.quantity, entry.buyCharges, entry.nominalValue, entry.instrument?.currency.displayCode, 1
    );
}

export function calculateEntrySubTotalInPositionCurrency(entry: PortfolioEntry): number {
    return entryTotalInPositionCurrency(
        entry.price, entry.quantity, 0, entry.nominalValue, entry.instrument?.currency.displayCode, 1
    );
}

export function calculateEntryValueInPositionCurrency(price: number, entry: PortfolioEntry): number {
    return calculateEntryTotal(
        price, entry.quantity, entry.buyCharges, entry.nominalValue, entry.instrument?.currency.displayCode, 1
    );
}

export function ertrageFilter(entry: AccountEntry) {
    return (entry.accountTypeDescriptionEn === "Zinsen")
        || (entry.accountTypeDescriptionEn === "Dividenden");
    // || (entry.accountTypeDescriptionEn === "Sonst. Gutschrift"); 20.05.2022 - removed from ertrage calculation by Mark's request
}

export function isNegativeAmountById(id? : number) {
    const typeIds = [
        2,	// Portokosten
        3,	// Auszahlung
        4,	// Wertpapierkauf
        7,	// Gebühr
        8,	// Kaufspesen
        9,	// Verkaufspesen
        11,	// Sonst. Belastung
        13,	// Abgeltungssteuer
        14,	// Solidaritätszuschlag
        15,	// Kirchensteuer
        16,	// Limit-Gebühr
        21	// Immobilienkauf
    ];

    return id && typeIds.includes(id);
}

export function isNegativeAmount(entry?: AccountEntry) {
    const types = [
        "Portokosten",
        "Auszahlung",
        "Wertpapierkauf",
        "Gebühr",
        "Kaufspesen",
        "Verkaufspesen",
        "Sonst. Belastung",
        "Abgeltungssteuer",
        "Solidaritätszuschlag",
        "Kirchensteuer",
        "Limit-Gebühr",
        "Immobilienkauf"
    ];

    return entry && entry.accountTypeDescriptionEn && types.includes(entry.accountTypeDescriptionEn);
}

export function calculatePortfolioErtrage(portfolio: Portfolio) {
    return portfolio.accountEntries ? portfolio.accountEntries
        .filter(entry => ertrageFilter(entry))
        .map(entry => entry.amount)
        .reduce(function (x: number, y: number) { return x + y }, 0) : 0;
}

export function calculatePortfolioErtrageToDate(portfolio: Portfolio, date: any) {
    const toDate: Date = moment(date).toDate();
    return portfolio.accountEntries ? portfolio.accountEntries
        .filter(entry => ertrageFilter(entry))
        .filter(entry => moment(entry.entryTime).toDate() <= toDate)
        .map(entry => entry.amount)
        .reduce(function (x: number, y: number) { return x + y }, 0) : 0;
}

export function calculatePortfolioEntryErtrage(portfolio: Portfolio, entry: PortfolioEntry) {
    return portfolio.accountEntries ? portfolio.accountEntries
        .filter(e => e.portfolioEntryId === entry.id)
        .filter(e => ertrageFilter(e))
        .map(e => e.amount)
        .reduce(function (x: number, y: number) { return x + y }, 0) : 0;
}

export function calculatePortfolioKonto(portfolio: Portfolio) {
    return portfolio.accountEntries ? portfolio.accountEntries
        .map(entry => entry.amount)
        .reduce(function (x: number, y: number) { return x + y }, 0) : 0
}

export function getCurrencyCode(entry: PortfolioEntry): string {
    if (entry.currencyCode !== "XXZ") {
        return entry.currencyCode ? entry.currencyCode : "";
    }

    return entry.nominalCurrency ? entry.nominalCurrency : "XXZ";
}

export function getRateCurrency(entry: PortfolioEntry) {
    if (entry.currencyCode === "XXZ") {
        return "%";
    }

    return entry.currencyCode;
}

export function calculatePortfolioEntry(entry: PortfolioEntry): [number, number, number] {
    const initial: number = calculatePortfolioEntryTotal(entry.price, entry);
    const yesterday: number = calculatePortfolioEntryValue(getYesterdayPrice(entry), entry, entry.previousCurrencyPrice);
    const last: number = calculatePortfolioEntryValue(getLastPrice(entry), entry, entry.currentCurrencyPrice);

    return [initial, yesterday, last];
}

export function totalPortfolioList(portfolio: Portfolio) {
    let purchasePrice: number = 0;
    let income: number = 0;
    let priceGain: number = 0;
    let total: number = 0;
    if (portfolio && portfolio.entries) {
        portfolio.entries
            .filter(current => current && current.instrument)
            .map(entry => {
                const [initial, yesterday, last] = calculatePortfolioEntry(entry);
                const [diff, diffPct] = calculateChange(initial, last);
                purchasePrice += initial;
                priceGain += diff;
                total += last;
                return;
            });
    }
    return [purchasePrice, income, priceGain, total];
}

export function calculatePortfolio(portfolio: Portfolio) {
    if (portfolio.entries) {
        return portfolio.entries
            .filter(current => current && current.instrument)
            .map(entry => calculatePortfolioEntry(entry)).reduce(getSumEx, [0, 0, 0]);
    }
    return [0, 0, 0];
}

export function calculatePortfoliosTotal(portfolios: Array<Portfolio>) {
    const [initial, yesterday, last] = portfolios.map(portfolio => calculatePortfolio(portfolio)).reduce(getSumEx, [0, 0, 0]);

    return [initial, yesterday, last];
}

export function calculateWatchlistEntry(entry: WatchlistEntry) {
    const trade = entry.snapQuote?.quotes.filter(quote => (quote != null) && (quote.type === "TRADE"))[0];
    const bid = entry.snapQuote?.quotes.filter(quote => (quote != null) && (quote.type === "BID"))[0];
    const ask = entry.snapQuote?.quotes.filter(quote => (quote != null) && (quote.type === "ASK"))[0];

    return [trade, bid, ask];
}

export function calculateWatchlistEntryDelay(entry: WatchlistEntry) {
    return calculateEntryDelay(entry.snapQuote?.delay);
}

export function calculatePortfoliotEntryDelay(entry: PortfolioEntry) {
    return calculateEntryDelay(entry.snapQuote?.delay);
}

export function calculateEntryDelay(delay: Maybe<number>) {
    if (delay) {
        if (delay <= 1) {
            return "RT";
        } else {
            return "+" + Math.floor(delay / 60);
        }
    } else {
        return "+15";
    }
}

export function calculateDays(entry: WatchlistEntry) {
    const day: number = 1000 * 60 * 60 * 24;
    const days: number = Math.floor((Date.now() - Date.parse(entry.entryTime)) / day);
    return days >= 0 ? days : 0;
}

export function getQuoteTrade(snapQuote: SnapQuote | null | undefined): Quote {
    const result = snapQuote?.quotes?.filter(current => current?.type === "TRADE");
    if (result) {
        if (result.length > 0) {
            if (result[0]) {
                return result[0];
            }
        }
    }

    return {};
}

export const AssetTypes = ["SHARE", "ETC", "ETF", "ETN", "FUND", "FUT", "MMR", "REAL_ESTATE", "INDEX", "KNOCK", "VWL", "MULTI", "OPT", "WARR", "OTHER", "CROSS", "CERT", "BOND"];

export const PieChartColors = ["#0D5A94", "#117F8F", "#159C8C", "#18B589", "#63BD5C", "#CAC11F", "#FFC300", "#FF8D38", "#E65456", "#E03C68", "#B6325F", "#802353", "#521849", "#3D3D6B", "#558BB4", "#57A5B0", "#5AB9AE", "#5CCBAC", "#91D08C", "#DAD361", "#DAD361", "#FFAF73",
    "#ED8788", "#E97695", "#CB6F8E", "#A66486", "#855C7F", "#767696"];

export function getNameAllocationAset(name: string) {
    switch (getAssetGroup(name)) {
        case "Aktien": return "Aktien";
        case "Etf": return "ETF";
        case "Etn": return "ETN";
        case "Zertifikat": return "Zertifikate";
        case "Index": return "Indizes";
        case "Rohstoff": return "Rohstoffe";
        case "Fonds": return "Fonds";
        case "Etc": return "ETC";
        case "Zinspapier": return "Anleihen";
        case "Knock-Out": return "KO";
        case "Währung": return "Devisen";
        case "Optionsschein": return "OS";
        default: return "Other";
    }
}


export function getAssetForUrl(name: string | undefined | null) {
    switch (name) {
        case "SHARE": return "aktien";
        case "FUND": return "fonds";
        case "ETF": return "etf";
        case "CERT": return "zertifikate"
        case "BOND": return "anleihen";
        case "WARR": return "optionsschein";
        case "INDEX": return "indizes";
        case "CROSS": return "devisen";
        case "COMM": return "rohstoffe";
        case "FUT": return "future";
        case 'MMR': return "geldmarktsatz";
        case 'VWL': return "konjunkturdaten";
        case "KNOCK": return "hebelprodukte";
        default: return "";
    }
}

export function getAssetGroup(name: string | undefined | null): string {
    switch (name) {
        case 'SHARE': return "Aktien";
        case 'ETC': return "Etc";
        case 'ETF': return "Etf";
        case 'ETN': return "Etn";
        case 'FUND': return "Fonds";
        case 'FUT': return "Future";
        case 'MMR': return "Geldmarktsatz";
        case 'REAL_ESTATE': return "Immobilie";
        case 'INDEX': return "Index";
        case 'KNOCK': return "KO";
        case 'VWL': return "Konjunkturdaten";
        case 'MULTI': return "MultiAsset";
        case 'OPT': return "Option";
        case 'WARR': return "OS";
        case 'OTHER': return "Sonstige";
        case 'CROSS': return "Währung";
        case 'CERT': return "Zertifikat";
        case 'BOND': return "Zinspapier";
        case 'COMM': return "Rohstoff"
        default: return "";
    }
}

export function getColorOfAssetGroup(name: string): string {
    switch (name) {
        case 'SHARE': return "#0d5a94";
        case 'INDEX': return "#ffc300";
        case 'ETF': return "#63bd5c";
        case 'FUND': return "#63bd5c";
        case 'CERT': return "#ff8d38";
        case 'KNOCK': return "#e03c68";
        case 'WARR': return "#e03c68";
        case 'COMM': return "#159c8c";
        case 'ETC': return "#159c8c";
        case 'ETN': return "#ffc300";
        case 'OTHER': return "#57А5Б0";
        case 'CROSS': return "#858585";
        //case 'FUT': return "#";
        //case 'MMR': return "#";
        //case 'REAL_ESTATE': return "#";
        //case 'VWL': return "#";
        //case 'MULTI': return "#";
        //case 'OPT': return "#";
        //case 'BOND': return "#";
        default: return "grey";
    }
}

export function formatColorOfAssetGroup(assetGroup: AssetGroup | null | undefined): string {
    switch (assetGroup) {
        case AssetGroup.Share: return "#0d5a94";
        case AssetGroup.Index: return "#ffc300";
        case AssetGroup.Etf: return "#63bd5c";
        case AssetGroup.Fund: return "#63bd5c";
        case AssetGroup.Cert: return "#ff8d38";
        case AssetGroup.Knock: return "#e03c68";
        case AssetGroup.Warr: return "#e03c68";
        case AssetGroup.Comm: return "#159c8c";
        case AssetGroup.Etc: return "#159c8c";
        case AssetGroup.Etn: return "#ffc300";
        case AssetGroup.Other: return "#57А5Б0";
        case AssetGroup.Cross: return "#858585";
        //case 'FUT': return "#";
        //case 'MMR': return "#";
        //case 'REAL_ESTATE': return "#";
        //case 'VWL': return "#";
        //case 'MULTI': return "#";
        //case 'OPT': return "#";
        //case 'BOND': return "#";
        default: return "grey";
    }
}

// SORTING IN LIMITS

function getInstrumentName(limit: LimitEntry) {
    return limit && limit.instrument && limit.instrument.name ? limit.instrument.name.toLowerCase() : "";
}

export function filterLimits(limits: LimitEntry[], isActive: boolean | undefined, isUpper: boolean | undefined, description?: string, direction?: boolean,) {
    let filteredLimits = limits;
    switch (description) {
        case "Name": filteredLimits = limits.slice().sort(function (a, b) {
            if (getInstrumentName(a) > getInstrumentName(b)) return 1;
            else if (getInstrumentName(a) < getInstrumentName(b)) return -1;
            return 0;
        }); break;
        case "Gattung": filteredLimits = limits.slice().sort(function (a, b) {
            if (a.instrument?.group.assetGroup && b.instrument?.group.assetGroup && (a.instrument?.group.assetGroup < b.instrument?.group.assetGroup)) { return -1; }
            if (a.instrument?.group.assetGroup && b.instrument?.group.assetGroup && (a.instrument?.group.assetGroup > b.instrument?.group.assetGroup)) { return 1; }
            return 0;
        }); break;
        case "Abstand zum Limit": filteredLimits = limits.slice().sort(function (a, b) {
            if ((a.limitValue || 0) < (b.limitValue || 0)) { return -1; }
            if ((a.limitValue || 0) > (b.limitValue || 0)) { return 1; }
            return 0;
        }); break;
        case "TableBezeichnung": filteredLimits = limits.slice().sort(function (a, b) {
            if (getInstrumentName(a) > getInstrumentName(b)) return 1;
            else if (getInstrumentName(a) < getInstrumentName(b)) return -1;
            return 0;
        }); break;

        case "TableGattung": filteredLimits = limits.slice().sort(function (a, b) {
            if (getAssetGroup(a.instrument?.group.assetGroup).toLowerCase() > getAssetGroup(b.instrument?.group.assetGroup).toLowerCase()) return 1;
            else if (getAssetGroup(a.instrument?.group.assetGroup).toLowerCase() < getAssetGroup(b.instrument?.group.assetGroup).toLowerCase()) return -1;
            return 0;
        }); break;
        case "TableKurs aktuell": filteredLimits = limits.slice().sort(function (a, b) {
            const rateCurrencyA = a && a.instrument && getTradeQuote(a.instrument.snapQuote)?.value;
            const rateCurrencyB =  b && b.instrument && getTradeQuote(b.instrument.snapQuote)?.value;
            if(rateCurrencyA && rateCurrencyB){
                if (rateCurrencyA < rateCurrencyB) return -1;
                else if (rateCurrencyA > rateCurrencyB) return 1;
                return 0;
            }
            return 0;
        }); break;

        case "TableZeit": filteredLimits = limits.slice().sort(function (a, b) {
            const quoteA = a && a.instrument && a.instrument.snapQuote && a.instrument.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
            const quoteB = b && b.instrument && b.instrument.snapQuote && b.instrument.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
            if (quoteA && quoteB) {
                if (quoteA.when < quoteB.when) return -1;
                else if (quoteA.when > quoteB.when) return 1;
            }
            return 0;
        }); break;

        case "TableBörse": filteredLimits = limits.slice().sort(function (a, b) {
            if (a.instrument && a.instrument.exchange && a.instrument.exchange.code && b.instrument && b.instrument.exchange && b.instrument.exchange.code) {
                if (a.instrument?.exchange?.code < b.instrument?.exchange?.code) return -1;
                else if (a.instrument?.exchange?.code > b.instrument?.exchange?.code) return 1;
            }
            return 0;
        }); break;

        case "TableLimit absolut": filteredLimits = limits.slice().sort(function (a, b) {
            const showInPercentA = a.percent || a.percent;
            const valueA = (showInPercentA ? a.effectiveLimitValue : a.limitValue) || 0;
            const showInPercentB = b.percent || b.percent;
            const valueB = (showInPercentB ? b.effectiveLimitValue : b.limitValue) || 0;

            if (valueA < valueB) return -1;
            else if (valueA > valueB) return 1;
            return 0;
        }); break;

        case "TableLimit %": filteredLimits = limits.slice().sort(function (a, b) {
            const valueA = a.effectiveLimitValue ? getPercentOfChange(a.effectiveLimitValue, a.initialValue || 1) :
            a.effectiveLimitValue === 0 ? -100 : 0;
            
            const valueB = b.effectiveLimitValue ? getPercentOfChange(b.effectiveLimitValue, b.initialValue || 1) :
            b.effectiveLimitValue === 0 ? -100 : 0;

            if (valueA < valueB) return -1;
            else if (valueA > valueB) return 1;
            return 0;
        }); break;

        case "TableAbstand zum Limit": filteredLimits = limits.slice().sort(function (a, b) {

            const quoteA = a && a.instrument && a.instrument.snapQuote && a.instrument.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
            const quoteB = b && b.instrument && b.instrument.snapQuote && b.instrument.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
            const percentToTargerA = a.hitStatus ? 0 : a.effectiveLimitValue && a.effectiveLimitValue > 0 && quoteA && quoteA.value ? (Math.abs(Math.abs(a.effectiveLimitValue - quoteA.value) / quoteA.value) * 100) : 0;
            const percentToTargerB = b.hitStatus ? 0 : b.effectiveLimitValue && b.effectiveLimitValue > 0 && quoteB && quoteB.value ? (Math.abs(Math.abs(b.effectiveLimitValue - quoteB.value) / quoteB.value) * 100) : 0;

            if (percentToTargerA < percentToTargerB) return -1;
            else if (percentToTargerA > percentToTargerB) return 1;
            return 0;
        }); break;

        case "TableStatus": filteredLimits =filteredLimits.filter(current => current.hitStatus).concat(filteredLimits.filter(current => !current.hitStatus));
        break;

        case "TableArt": filteredLimits = limits.slice().sort(function (a, b) {
            let valueA = !a.percent ? 1 : a.trailing ? -1 : 0;
            let valueB = !b.percent ? 1 : b.trailing ? -1 : 0;

            if (valueA < valueB) return -1;
            else if (valueA > valueB) return 1;
            return 0;
        }); break;
    }

    if (isUpper === true) {
        filteredLimits = filteredLimits.filter(limit => limit.upper === true);
    }
    else if (isUpper === false) {
        filteredLimits = filteredLimits.filter(limit => limit.upper === false);
    }

    if (isActive === true) {
        filteredLimits = filteredLimits.filter(limit => limit.hitStatus === false);
    }
    else if (isActive === false) {
        filteredLimits = filteredLimits.filter(limit => limit.hitStatus === true);
    }

    filteredLimits = direction == false ? filteredLimits.reverse() : filteredLimits;

    return filteredLimits;
}


// SORTING IN PORTOFOLIO AND WATCHLIST

export function compareByName(a: string, b: string) {
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    else if (a.toLowerCase() > b.toLowerCase()) return 1;
    return 0;
}

export function getOrderInTablePortfolio(order: string, direction: boolean, portfolio: Portfolio) {
    let entries = portfolio.entries && portfolio.entries.slice().filter(current => current.instrument)
    let orderedEntries: PortfolioEntry[] = [];
    let [purchasePrice, income, priceGain, totalInPortoflio] = totalPortfolioList(portfolio!);

    switch (order) {

        case "Name": orderedEntries = entries!.slice().sort(function (a, b) {
            if (a.instrument && a.instrument.name && b.instrument && b.instrument.name) {
                if (a.instrument.name.toLowerCase() > b.instrument.name.toLowerCase()) return 1;
                else if (a.instrument.name.toLowerCase() < b.instrument.name.toLowerCase()) return -1;
            }
            return 0;
        }); break;

        case "Kaufdatum": orderedEntries = entries!.slice().sort(function (a, b) {
            if (moment(a.entryTime) < moment(b.entryTime)) return -1;
            else if (moment(a.entryTime) > moment(b.entryTime)) return 1;
            return 0;
        }); break;

        case "Erträge": orderedEntries = entries!.slice().sort((a, b) => {
            const ertrageA = calculatePortfolioEntryErtrage(portfolio, a);
            const ertrageB = calculatePortfolioEntryErtrage(portfolio, b);
            if (ertrageA < ertrageB) return -1;
            else if (ertrageA > ertrageB) return 1;
            return 0;
        }); break;

        case "Performance gesamt": orderedEntries = entries!.slice().sort(function (a, b) {
            const [initialA, yesterdayA, lastA] = calculatePortfolioEntry(a);
            const [initialB, yesterdayB, lastB] = calculatePortfolioEntry(b);

            const ertrageA = calculatePortfolioEntryErtrage(portfolio, a);
            const ertragePctA: number = initialA > 0 ? (ertrageA / initialA) * 100 : 0;
            const [diffA, diffPctA] = calculateChange(initialA, lastA);
            const totalPctA: number = (diffPctA + ertragePctA);

            const ertrageB = calculatePortfolioEntryErtrage(portfolio, b);
            const ertragePctB: number = initialB > 0 ? (ertrageB / initialB) * 100 : 0;
            const [diffB, diffPctB] = calculateChange(initialB, lastB);
            const totalPctB: number = (diffPctB + ertragePctB);


            if (totalPctA < totalPctB) return -1;
            else if (totalPctA > totalPctB) return 1;
            return 0;
        }); break;

        case "Performance heute": orderedEntries = entries!.slice().sort(function (a, b) {
            const quoteA = a && a.snapQuote && a.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
            const quoteB = b && b.snapQuote && b.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
            if (quoteA && quoteB && quoteA.percentChange && quoteB.percentChange) {
                if (quoteA.percentChange < quoteB.percentChange) return -1;
                else if (quoteA.percentChange > quoteB.percentChange) return 1;
            }
            return 0;
        }); break;

        case "Gattung": orderedEntries = entries!.slice().sort(function (a, b) {
            if (getAssetGroup(a.instrument?.group.assetGroup).toLowerCase() > getAssetGroup(b.instrument?.group.assetGroup).toLowerCase()) return 1;
            else if (getAssetGroup(a.instrument?.group.assetGroup).toLowerCase() < getAssetGroup(b.instrument?.group.assetGroup).toLowerCase()) return -1;
            return 0;
        }); break;

        case "TableStück": orderedEntries = entries!.slice().sort(function (a, b) {
            if (a.quantity < b.quantity) return -1;
            else if (a.quantity > b.quantity) return 1;
            return 0;
        }); break;

        case "TableBezeichnung": orderedEntries = entries!.slice().sort(function (a, b) {
            if (a.instrument && a.instrument.name && b.instrument && b.instrument.name) {
                if (a.instrument.name.toLowerCase() > b.instrument.name.toLowerCase()) return 1;
                else if (a.instrument.name.toLowerCase() < b.instrument.name.toLowerCase()) return -1;
            }
            return 0;
        }); break;

        case "TableGattung": orderedEntries = entries!.slice().sort(function (a, b) {
            if (getAssetGroup(a.instrument?.group.assetGroup).toLowerCase() > getAssetGroup(b.instrument?.group.assetGroup).toLowerCase()) return 1;
            else if (getAssetGroup(a.instrument?.group.assetGroup).toLowerCase() < getAssetGroup(b.instrument?.group.assetGroup).toLowerCase()) return -1;
            return 0;
        }); break;

        case "TableGewichtung": orderedEntries = entries!.slice().sort(function (a, b) {
            const [initialA, yesterdayA, lastA] = calculatePortfolioEntry(a);
            const [initialB, yesterdayB, lastB] = calculatePortfolioEntry(b);
            const percentOfPortfolioA: number = lastA / totalInPortoflio * 100;
            const percentOfPortfolioB: number = lastB / totalInPortoflio * 100;

            if (percentOfPortfolioA < percentOfPortfolioB) return -1;
            else if (percentOfPortfolioA > percentOfPortfolioB) return 1;
            return 0;
        }); break;

        case "TableZeit": orderedEntries = entries!.slice().sort(function (a, b) {
            const quoteA = a && a.snapQuote && a.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
            const quoteB = b && b.snapQuote && b.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
            if (quoteA && quoteB) {
                if (quoteA.when < quoteB.when) return -1;
                else if (quoteA.when > quoteB.when) return 1;
            }
            return 0;
        }); break;

        case "TableBörse": orderedEntries = entries!.slice().sort(function (a, b) {
            if (a.instrument && a.instrument.exchange && a.instrument.exchange.code && b.instrument && b.instrument.exchange && b.instrument.exchange.code) {
                if (a.instrument?.exchange?.code < b.instrument?.exchange?.code) return -1;
                else if (a.instrument?.exchange?.code > b.instrument?.exchange?.code) return 1;
            }
            return 0;
        }); break;

        case "TableKaufsumme": orderedEntries = entries!.slice().sort(function (a, b) {
            const [initialA, yesterdayA, lastA] = calculatePortfolioEntry(a);
            const [initialB, yesterdayB, lastB] = calculatePortfolioEntry(b);
            if (initialA < initialB) return -1;
            else if (initialA > initialB) return 1;
            return 0;
        }); break;

        case "TableKurs aktuell": orderedEntries = entries!.slice().sort(function (a, b) {
            const rateCurrencyA = a.snapQuote?.quotes.filter(quote => (quote != null) && ((quote.type === QuoteType.Trade || quote.type === QuoteType.NetAssetValue)))[0]?.value || 0;
            const rateCurrencyB = b.snapQuote?.quotes.filter(quote => (quote != null) && ((quote.type === QuoteType.Trade || quote.type === QuoteType.NetAssetValue)))[0]?.value || 0;
            if (rateCurrencyA < rateCurrencyB) return -1;
            else if (rateCurrencyA > rateCurrencyB) return 1;
            return 0;
        }); break;

        case "TableErträge": orderedEntries = entries!.slice().sort((a, b) => {
            const ertrageA = calculatePortfolioEntryErtrage(portfolio, a);
            const ertrageB = calculatePortfolioEntryErtrage(portfolio, b);
            if (ertrageA < ertrageB) return -1;
            else if (ertrageA > ertrageB) return 1;
            return 0;
        }); break;

        case "Table+/- Erträge": orderedEntries = entries!.slice().sort((a, b) => {
            const ertrageA = calculatePortfolioEntryErtrage(portfolio, a);
            const ertrageB = calculatePortfolioEntryErtrage(portfolio, b);
            if (ertrageA < ertrageB) return -1;
            else if (ertrageA > ertrageB) return 1;
            return 0;
        }); break;

        case "Table% Erträge": orderedEntries = entries!.slice().sort((a, b) => {
            const [initialA, yesterdayA, lastA] = calculatePortfolioEntry(a);
            const ertrageA = calculatePortfolioEntryErtrage(portfolio, a);
            const ertrageB = calculatePortfolioEntryErtrage(portfolio, b);
            const ertragePctA: number = initialA > 0 ? (ertrageA / initialA) * 100 : 0;

            const [initialB, yesterdayB, lastB] = calculatePortfolioEntry(b);
            const ertragePctB: number = initialB > 0 ? (ertrageB / initialB) * 100 : 0;

            if (ertragePctA < ertragePctB) return -1;
            else if (ertragePctA > ertragePctB) return 1;
            return 0;
        }); break;

        case "Table+/- Kursgewinn": orderedEntries = entries!.slice().sort((a, b) => {
            const [initialA, yesterdayA, lastA] = calculatePortfolioEntry(a);
            const [initialB, yesterdayB, lastB] = calculatePortfolioEntry(b);
            let [diffA, diffPctA] = calculateChange(initialA, lastA);
            let [diffB, diffPctB] = calculateChange(initialB, lastB);
            if (diffA < diffB) return -1;
            else if (diffA > diffB) return 1;
            return 0;
        }); break;

        case "Table% Kursgewinn": orderedEntries = entries!.slice().sort((a, b) => {
            const [initialA, yesterdayA, lastA] = calculatePortfolioEntry(a);
            const [initialB, yesterdayB, lastB] = calculatePortfolioEntry(b);
            let [diffA, diffPctA] = calculateChange(initialA, lastA);
            let [diffB, diffPctB] = calculateChange(initialB, lastB);
            if (diffPctA < diffPctB) return -1;
            else if (diffPctA > diffPctB) return 1;
            return 0;
        }); break;

        case "Table+/- Gesamt": orderedEntries = entries!.slice().sort((a, b) => {
            const [initialA, yesterdayA, lastA] = calculatePortfolioEntry(a);
            const [initialB, yesterdayB, lastB] = calculatePortfolioEntry(b);

            const ertrageA = calculatePortfolioEntryErtrage(portfolio, a);
            const [diffA, diffPctA] = calculateChange(initialA, lastA);
            const totalDiffA: number = diffA + ertrageA;

            const ertrageB = calculatePortfolioEntryErtrage(portfolio, b);
            const [diffB, diffPctB] = calculateChange(initialB, lastB);
            const totalDiffB: number = diffB + ertrageB;

            if (totalDiffA < totalDiffB) return -1;
            else if (totalDiffA > totalDiffB) return 1;
            return 0;
        }); break;


        case "TableGesamt EUR": orderedEntries = entries!.slice().sort((a, b) => {
            const [initialA, yesterdayA, lastA] = calculatePortfolioEntry(a);
            const [initialB, yesterdayB, lastB] = calculatePortfolioEntry(b);

            const ertrageA = calculatePortfolioEntryErtrage(portfolio, a);
            const [diffA, diffPctA] = calculateChange(initialA, lastA);
            const totalDiffA: number = diffA + ertrageA;

            const ertrageB = calculatePortfolioEntryErtrage(portfolio, b);
            const [diffB, diffPctB] = calculateChange(initialB, lastB);
            const totalDiffB: number = diffB + ertrageB;

            if (totalDiffA < totalDiffB) return -1;
            else if (totalDiffA > totalDiffB) return 1;
            return 0;
        }); break;

        case "Table% Gesamt": orderedEntries = entries!.slice().sort((a, b) => {
            const [initialA, yesterdayA, lastA] = calculatePortfolioEntry(a);
            const [initialB, yesterdayB, lastB] = calculatePortfolioEntry(b);

            const ertrageA = calculatePortfolioEntryErtrage(portfolio, a);
            const ertragePctA: number = initialA > 0 ? (ertrageA / initialA) * 100 : 0;
            const [diffA, diffPctA] = calculateChange(initialA, lastA);
            const totalPctA: number = (diffPctA + ertragePctA);

            const ertrageB = calculatePortfolioEntryErtrage(portfolio, b);
            const ertragePctB: number = initialB > 0 ? (ertrageB / initialB) * 100 : 0;
            const [diffB, diffPctB] = calculateChange(initialB, lastB);
            const totalPctB: number = (diffPctB + ertragePctB);


            if (totalPctA < totalPctB) return -1;
            else if (totalPctA > totalPctB) return 1;
            return 0;
        }); break;

        case "TableKursgewinn": orderedEntries = entries!.slice().sort(function (a, b) {

            const [initialA, yesterdayA, lastA] = calculatePortfolioEntry(a);
            const [initialB, yesterdayB, lastB] = calculatePortfolioEntry(b);

            const [diffA, diffPctA] = calculateChange(initialA, lastA);
            const [diffB, diffPctB] = calculateChange(initialB, lastB);

            if (diffPctA < diffPctB) return -1;
            else if (diffPctA > diffPctB) return 1;
            return 0;
        }); break;

        case "TableKaufkurs": orderedEntries = entries!.slice().sort(function (a, b) {
            if (a.price < b.price) return -1;
            else if (a.price > b.price) return 1;
            return 0;
        }); break;

        case "TableKaufdatum": orderedEntries = entries!.slice().sort(function (a, b) {
            if (moment(a.entryTime) < moment(b.entryTime)) return -1;
            else if (moment(a.entryTime) > moment(b.entryTime)) return 1;
            return 0;
        }); break;

        case "TableGesamtsumme": orderedEntries = entries!.slice().sort((a, b) => {

            const [initialA, yesterdayA, lastA] = calculatePortfolioEntry(a);
            const [initialB, yesterdayB, lastB] = calculatePortfolioEntry(b);

            const ertrageA = calculatePortfolioEntryErtrage(portfolio, a);
            const ertrageB = calculatePortfolioEntryErtrage(portfolio, b);

            if ((lastA + ertrageA) < (lastB + ertrageB)) return -1;
            else if ((lastA + ertrageA) > (lastB + ertrageB)) return 1;
            return 0;
        }); break;
        case "TableSumme": orderedEntries = entries!.slice().sort((a, b) => {

            const [initialA, yesterdayA, lastA] = calculatePortfolioEntry(a);
            const [initialB, yesterdayB, lastB] = calculatePortfolioEntry(b);

            const ertrageA = calculatePortfolioEntryErtrage(portfolio, a);
            const ertrageB = calculatePortfolioEntryErtrage(portfolio, b);

            if ((lastA + ertrageA) < (lastB + ertrageB)) return -1;
            else if ((lastA + ertrageA) > (lastB + ertrageB)) return 1;
            return 0;
        }); break;

        case "TableWährung": orderedEntries = entries!.slice().sort(function (a, b) {
            if ((a.instrument?.currency?.displayCode?.toLowerCase() || "Z") < (b.instrument?.currency?.displayCode?.toLowerCase() || "Z")) return -1;
            else if ((a.instrument?.currency?.displayCode?.toLowerCase() || "Z") > (b.instrument?.currency?.displayCode?.toLowerCase() || "Z")) return 1;
            return 0;
        }); break;

        case "TableHeute": orderedEntries = entries!.slice().sort(function (a, b) {
            const percentA = getSnapQuote(a)?.percentChange || 0;
            const percentB = getSnapQuote(b)?.percentChange || 0;
            if (percentA < percentB) return -1;
            else if (percentA > percentB) return 1;
            return 0;
        }); break;

        case "Table+/- Heute": orderedEntries = entries!.slice().sort(function (a, b) {
            const [initialA, yesterdayA, lastA] = calculatePortfolioEntry(a);
            const [initialB, yesterdayB, lastB] = calculatePortfolioEntry(b);
            const [diffDailyA, diffDailyPctA] = calculateChange(yesterdayA, lastA);
            const [diffDailyB, diffDailyPctB] = calculateChange(yesterdayB, lastB);
            if (diffDailyA < diffDailyB) return -1;
            else if (diffDailyA > diffDailyB) return 1;
            return 0;
        }); break;

        case "Table% Heute": orderedEntries = entries!.slice().sort(function (a, b) {
            const [initialA, yesterdayA, lastA] = calculatePortfolioEntry(a);
            const [initialB, yesterdayB, lastB] = calculatePortfolioEntry(b);
            const [diffDailyA, diffDailyPctA] = calculateChange(yesterdayA, lastA);
            const [diffDailyB, diffDailyPctB] = calculateChange(yesterdayB, lastB);
            if (diffDailyPctA < diffDailyPctB) return -1;
            else if (diffDailyPctA > diffDailyPctB) return 1;
            return 0;
        }); break;

        case "Table1 Woche": orderedEntries = entries!.slice().sort(function (a, b) {
            if ((getPerformance(a, "WEEK1") || 0) < (getPerformance(b, "WEEK1") || 0)) return -1;
            else if ((getPerformance(a, "WEEK1") || 0) > (getPerformance(b, "WEEK1") || 0)) return 1;
            return 0;
        }); break;

        case "Table1 Monat": orderedEntries = entries!.slice().sort(function (a, b) {
            if ((getPerformance(a, "MONTH1") || 0) < (getPerformance(b, "MONTH1") || 0)) return -1;
            else if ((getPerformance(a, "MONTH1") || 0) > (getPerformance(b, "MONTH1") || 0)) return 1;
            return 0;
        }); break;

        case "Table6 Monate": orderedEntries = entries!.slice().sort(function (a, b) {
            if ((getPerformance(a, "MONTH6") || 0) < (getPerformance(b, "MONTH6") || 0)) return -1;
            else if ((getPerformance(a, "MONTH6") || 0) > (getPerformance(b, "MONTH6") || 0)) return 1;
            return 0;
        }); break;

        case "Table1 Jahr": orderedEntries = entries!.slice().sort(function (a, b) {
            if ((getPerformance(a, "WEEK52") || 0) < (getPerformance(b, "WEEK52") || 0)) return -1;
            else if ((getPerformance(a, "WEEK52") || 0) > (getPerformance(b, "WEEK52") || 0)) return 1;
            return 0;
        }); break;

        case "Table3 Jahre": orderedEntries = entries!.slice().sort(function (a, b) {
            if ((getPerformance(a, "YEAR3") || 0) < (getPerformance(b, "YEAR3") || 0)) return -1;
            else if ((getPerformance(a, "YEAR3") || 0) > (getPerformance(b, "YEAR3") || 0)) return 1;
            return 0;
        }); break;
    }

    return direction ? orderedEntries : orderedEntries.reverse();
}

// END OF SORTING

export function getPerformance(entry: PortfolioEntry | WatchlistEntry, type: string) {
    return entry.instrument?.performance.find(e => e.period === type)?.performance;
}

function createSerie(data: any[], dataThreshold?: number | null): SeriesOptionsType {
    return {
        name: 'Kurs', type: 'area', data: data.map(current => { return { y: current.value } }),
        threshold: dataThreshold, color: 'white', fillColor: 'rgba(255, 255, 255, 0.3)',
        negativeColor: 'white', negativeFillColor: 'rgba(255, 255, 255, 0.3)', lineWidth: 1.5,
        trackByArea: true, tooltip: { valueDecimals: 2 }
    };
}

export function percentChange(watchlistEntry: WatchlistEntry) {
    if (watchlistEntry.snapQuote?.quotes != null) {
        let [trade] = calculateWatchlistEntry(watchlistEntry);
        const tradeChange: number = trade?.percentChange || 0;
        return tradeChange;
    }
    return 0;
}

export function createSmallChartOptions(intradayPrices: ChartSeries[] | null | undefined, snapQuote: SnapQuote | null | undefined): Highcharts.Options {
    if (intradayPrices && intradayPrices.length > 0) {
        let data: Array<ChartPoint> = intradayPrices[0].data || [];
        let threshold: number | null = snapQuote && snapQuote.yesterdayPrice ? snapQuote.yesterdayPrice : null;

        const minValue: number = Math.min(...data.map((current: ChartPoint) => current.value));
        const maxValue: number = Math.max(...data.map((current: ChartPoint) => current.value));

        return {
            legend: { enabled: false },
            // rangeSelector: {enabled: false},
            // scrollbar: {enabled: false},
            // navigator: {enabled: false},
            chart: {
                type: 'spline',
                showAxes: false,
                height: null
            },
            title: {
                text: undefined
            },
            xAxis: { lineWidth: 2, lineColor: 'white', visible: false, plotLines: undefined, plotBands: undefined },
            yAxis: {
                type: 'linear',
                startOnTick: false,
                lineColor: 'rgba(255, 255, 255, 0.3)',
                gridLineColor: 'rgba(255, 255, 255, 0.3)',
                gridLineWidth: 0,
                floor: minValue * 0.9,
                ceiling: maxValue * 1.25,
                labels: { enabled: false },
                title: {
                    text: undefined
                },
                plotLines: threshold ? [{ value: threshold, width: 1, color: 'rgba(0, 0, 0, 0.7)' }] : []
            },
            series: [
                {
                    name: undefined,
                    type: 'line',
                    // data: [1, 2, 1, 4, 3, 6]
                    data: data.map(e => e.value)
                }
            ]
        };
    } else {
        return {};
    }
}

export function orderWatchlistEntriesInListView(watchlist: WatchlistEntry[], order: string, direction: boolean) {
    switch (order) {
        case "Name": watchlist = watchlist?.sort(function (a, b) {
            if ((a.instrument?.name || "") < (b.instrument?.name || "")) {
                return -1;
            }
            else if ((a.instrument?.name || "") > (b.instrument?.name || "")) {
                return 1;
            }
            return 0;
        }); break;
        case "Performance":
            watchlist = watchlist?.sort(function (a, b) {
                const [tradeA, bidA, askA] = calculateWatchlistEntry(a);
                const [tradeB, bidB, askB] = calculateWatchlistEntry(b);

                if (tradeA?.percentChange! < tradeB?.percentChange!) {
                    return -1;
                }
                else if (tradeA?.percentChange! > tradeB?.percentChange!) {
                    return 1;
                }
                return 0;
            }); break;
        case "Gattung": watchlist = watchlist?.sort(function (a, b) {
            return a.instrument && b.instrument &&
                a.instrument.group.assetGroup &&
                b.instrument.group.assetGroup &&
                compareByName(getAssetGroup(a.instrument.group.assetGroup), getAssetGroup(b.instrument.group.assetGroup)) || -1;
        }); break;
        case "Beobachtungsdauer":
            watchlist = watchlist?.sort(function (a, b) {
                if (calculateDays(a) < calculateDays(b)) {
                    return -1;
                }
                else if (calculateDays(a) > calculateDays(b)) {
                    return 1;
                }
                return 0;
            }); break;
        case "TableBezeichnung": watchlist = watchlist.sort(function (a, b) {
            if ((a.instrument?.name || "").toLowerCase() > (b.instrument?.name || "").toLowerCase()) return 1;
            else if ((a.instrument?.name || "").toLowerCase() < (b.instrument?.name || "").toLowerCase()) return -1;
            return 0;
        }); break;

        case "TableBranche": watchlist = watchlist.sort(function (a, b) {
            if ((a.instrument?.group.sector?.name?.toLowerCase() || "Z") < (b.instrument?.group.sector?.name?.toLowerCase() || "Z")) return -1;
            else if ((a.instrument?.group.sector?.name?.toLowerCase() || "Z") > (b.instrument?.group.sector?.name?.toLowerCase() || "Z")) return 1;
            return 0;
        }); break;

        case "TableKurs": watchlist = watchlist.sort(function (a, b) {
            const [tradeA, bidA, askA] = calculateWatchlistEntry(a);
            const [tradeB, bidB, askB] = calculateWatchlistEntry(b);
            if ((tradeA?.value || 0) < (tradeB?.value || 0)) return -1;
            else if ((tradeA?.value || 0) > (tradeB?.value || 0)) return 1;
            return 0;
        }); break;

        case "TableVola %": watchlist = watchlist.sort(function (a, b) {
            const performanceA = a.instrument?.performance;
            const volaA = (performanceA || []).find(current => current.period === 'MONTH1')?.vola;
            const performanceB = b.instrument?.performance;
            const volaB = (performanceB || []).find(current => current.period === 'MONTH1')?.vola;
            if ((volaA || 0) < (volaB || 0)) return -1;
            else if ((volaA || 0) > (volaB || 0)) return 1;
            return 0;

        }); break;

        case "TableZeit": watchlist = watchlist.sort(function (a, b) {
            const [tradeA, bidA, askA] = calculateWatchlistEntry(a);
            const [tradeB, bidB, askB] = calculateWatchlistEntry(b);
            const whenA = Date.parse(tradeA?.when);
            const whenB = Date.parse(tradeB?.when);
            if (whenA < whenB) return -1;
            else if (whenA > whenB) return 1;
            return 0;
        }); break;

        case "TableAufnahme Datum": watchlist = watchlist.sort(function (a, b) {
            const whenA = Date.parse(a.entryTime);
            const whenB = Date.parse(b.entryTime);
            if (whenA < whenB) return -1;
            else if (whenA > whenB) return 1;
            return 0;
        }); break;

        case "Table%": watchlist = watchlist.sort((a, b) => {
            const [tradeA, bidA, askA] = calculateWatchlistEntry(a);
            const [tradeB, bidB, askB] = calculateWatchlistEntry(b);
            if ((tradeA?.percentChange || 0) < (tradeB?.percentChange || 0)) return -1;
            else if ((tradeA?.percentChange || 0) > (tradeB?.percentChange || 0)) return 1;
            return 0;
        }); break;

        case "Table+/-": watchlist = watchlist.sort(function (a, b) {
            const [tradeA, bidA, askA] = calculateWatchlistEntry(a);
            const [tradeB, bidB, askB] = calculateWatchlistEntry(b);
            if ((tradeA?.change || 0) < (tradeB?.change || 0)) return -1;
            else if ((tradeA?.change || 0) > (tradeB?.change || 0)) return 1;
            return 0;
        }); break;

        case "TableBID": watchlist = watchlist.sort(function (a, b) {
            const [tradeA, bidA, askA] = calculateWatchlistEntry(a);
            const [tradeB, bidB, askB] = calculateWatchlistEntry(b);
            if ((bidA?.value || 0) < (bidB?.value || 0)) return -1;
            else if ((bidA?.value || 0) > (bidB?.value || 0)) return 1;
            return 0;
        }); break;

        case "TableASK": watchlist = watchlist.sort(function (a, b) {
            const [tradeA, bidA, askA] = calculateWatchlistEntry(a);
            const [tradeB, bidB, askB] = calculateWatchlistEntry(b);
            if ((askA?.value || 0) < (askB?.value || 0)) return -1;
            else if ((askA?.value || 0) > (askB?.value || 0)) return 1;
            return 0;
        }); break;

        case "TableStückAsk": watchlist = watchlist.sort(function (a, b) {
            const [tradeA, bidA, askA] = calculateWatchlistEntry(a);
            const [tradeB, bidB, askB] = calculateWatchlistEntry(b);
            if ((askA?.size || 0) < (askB?.size || 0)) return -1;
            else if ((askA?.size || 0) > (askB?.size || 0)) return 1;
            return 0;
        }); break;

        case "TableStückBid": watchlist = watchlist.sort(function (a, b) {
            const [tradeA, bidA, askA] = calculateWatchlistEntry(a);
            const [tradeB, bidB, askB] = calculateWatchlistEntry(b);
            if ((bidA?.size || 0) < (bidB?.size || 0)) return -1;
            else if ((bidA?.size || 0) > (bidB?.size || 0)) return 1;
            return 0;
        }); break;

        case "TableUmsatz": watchlist = watchlist.sort((a, b) => {
            if ((a.snapQuote?.cumulativeVolume || 0) < (b.snapQuote?.cumulativeVolume || 0)) return -1;
            else if ((a.snapQuote?.cumulativeVolume || 0) > (b.snapQuote?.cumulativeVolume || 0)) return 1;
            return 0;
        }); break;

        case "TableGUmsatz": watchlist = watchlist.sort((a, b) => {
            if ((a.snapQuote?.cumulativeTurnover || 0) < (b.snapQuote?.cumulativeTurnover || 0)) return -1;
            else if ((a.snapQuote?.cumulativeTurnover || 0) > (b.snapQuote?.cumulativeTurnover || 0)) return 1;
            return 0;
        }); break;

        case "TableGattung": watchlist = watchlist.slice().sort(function (a, b) {
            if (getAssetGroup(a.instrument?.group.assetGroup).toLowerCase() > getAssetGroup(b.instrument?.group.assetGroup).toLowerCase()) return 1;
            else if (getAssetGroup(a.instrument?.group.assetGroup).toLowerCase() < getAssetGroup(b.instrument?.group.assetGroup).toLowerCase()) return -1;
            return 0;
        }); break;

        case "TableVolumen": watchlist = watchlist.sort((a, b) => {
            if ((a.snapQuote?.cumulativeVolume || 0) < (b.snapQuote?.cumulativeVolume || 0)) return -1;
            else if ((a.snapQuote?.cumulativeVolume || 0) > (b.snapQuote?.cumulativeVolume || 0)) return 1;
            return 0;
        }); break;

        case "TableTrades": watchlist = watchlist.sort((a, b) => {
            if ((a.snapQuote?.cumulativeTrades || 0) < (b.snapQuote?.cumulativeTrades || 0)) return -1;
            else if ((a.snapQuote?.cumulativeTrades || 0) > (b.snapQuote?.cumulativeTrades || 0)) return 1;
            return 0;
        }); break;

        case "TableHeute": watchlist = watchlist!.slice().sort(function (a, b) {
            const percentChangeA = a.snapQuote?.quotes.filter(quote => (quote != null) && (quote.type === "TRADE"))[0]?.percentChange || 0;
            const percentChangeyB = b.snapQuote?.quotes.filter(quote => (quote != null) && (quote.type === "TRADE"))[0]?.percentChange || 0;
            if (percentChangeA < percentChangeyB) return -1;
            else if (percentChangeA > percentChangeyB) return 1;
            return 0;
        }); break;

        case "Table1 Woche": watchlist = watchlist!.slice().sort(function (a, b) {
            if ((getPerformance(a, "WEEK1") || 0) < (getPerformance(b, "WEEK1") || 0)) return -1;
            else if ((getPerformance(a, "WEEK1") || 0) > (getPerformance(b, "WEEK1") || 0)) return 1;
            return 0;
        }); break;

        case "Table1 Monat": watchlist = watchlist!.slice().sort(function (a, b) {
            if ((getPerformance(a, "MONTH1") || 0) < (getPerformance(b, "MONTH1") || 0)) return -1;
            else if ((getPerformance(a, "MONTH1") || 0) > (getPerformance(b, "MONTH1") || 0)) return 1;
            return 0;
        }); break;

        case "Table6 Monate": watchlist = watchlist!.slice().sort(function (a, b) {
            if ((getPerformance(a, "MONTH6") || 0) < (getPerformance(b, "MONTH6") || 0)) return -1;
            else if ((getPerformance(a, "MONTH6") || 0) > (getPerformance(b, "MONTH6") || 0)) return 1;
            return 0;
        }); break;

        case "Table1 Jahr": watchlist = watchlist!.slice().sort(function (a, b) {
            if ((getPerformance(a, "WEEK52") || 0) < (getPerformance(b, "WEEK52") || 0)) return -1;
            else if ((getPerformance(a, "WEEK52") || 0) > (getPerformance(b, "WEEK52") || 0)) return 1;
            return 0;
        }); break;

        case "Table3 Jahre": watchlist = watchlist!.slice().sort(function (a, b) {
            if ((getPerformance(a, "YEAR3") || 0) < (getPerformance(b, "YEAR3") || 0)) return -1;
            else if ((getPerformance(a, "YEAR3") || 0) > (getPerformance(b, "YEAR3") || 0)) return 1;
            return 0;
        }); break;

        case "TableVortag": watchlist = watchlist.sort((a, b) => {
            if ((a.snapQuote?.yesterdayPrice || 0) < (b.snapQuote?.yesterdayPrice || 0)) return -1;
            else if ((a.snapQuote?.yesterdayPrice || 0) > (b.snapQuote?.yesterdayPrice || 0)) return 1;
            return 0;
        }); break;


        case "TableEröffnung": watchlist = watchlist.sort((a, b) => {
            if ((a.snapQuote?.firstPrice || 0) < (b.snapQuote?.firstPrice || 0)) return -1;
            else if ((a.snapQuote?.firstPrice || 0) > (b.snapQuote?.firstPrice || 0)) return 1;
            return 0;
        }); break;


        case "Hoch": watchlist = watchlist.sort((a, b) => {
            if ((a.snapQuote?.highPrice || 0) < (b.snapQuote?.highPrice || 0)) return -1;
            else if ((a.snapQuote?.highPrice || 0) > (b.snapQuote?.highPrice || 0)) return 1;
            return 0;
        }); break;


        case "Tief": watchlist = watchlist.sort((a, b) => {
            if ((a.snapQuote?.lowPrice || 0) < (b.snapQuote?.lowPrice || 0)) return -1;
            else if ((a.snapQuote?.lowPrice || 0) > (b.snapQuote?.lowPrice || 0)) return 1;
            return 0;
        }); break;


        case "TableBörse": watchlist = watchlist!.slice().sort(function (a, b) {
            if (a.instrument && a.instrument.exchange && a.instrument.exchange.code && b.instrument && b.instrument.exchange && b.instrument.exchange.code) {
                if (a.instrument?.exchange?.code < b.instrument?.exchange?.code) return -1;
                else if (a.instrument?.exchange?.code > b.instrument?.exchange?.code) return 1;
            }
            return 0;
        }); break;

    }
    return direction ? watchlist : watchlist.reverse();
}


// get categories for Asset Allocation Banner Item in Watchlist and Portfolio

function getWeightOfOrderedItems(portfolio: Portfolio, items: PortfolioEntry[]) {
    let weight = 0;
    if (items.length > 0)
        items.map(entry => {
            let [purchasePrice, income, priceGain, totalInPortoflio] = totalPortfolioList(portfolio);
            const [initial, yesterday, last] = calculatePortfolioEntry(entry);
            weight += last / totalInPortoflio * 100;
        });
    return Number.parseFloat(weight.toFixed(3));
}

export function getDataForAssetAllocationPieCharts(name: string, items: any, portfolio?: Portfolio) {

    const currencies = items.filter((current: any) => current.instrument != null)
        .map((item: any) => { return item.instrument?.currency.alphaCode ? item.instrument?.currency.alphaCode : item.instrument?.currency.displayCode }).filter((v: any, i: any, a: any) => a.indexOf(v) === i).filter((item: string) => item != null && item != "");
    const sectors = items.filter((item: any) => item.instrument !== null && item.instrument.group.sector !== null)
        .map((item: any) => {
            return item.instrument.group.sector.name
        }).filter((v: any, i: any, a: any) => a.indexOf(v) === i).filter((item: string) => item != null && item != "");
    const regions = items.filter((current: any) => current.instrument != null)
        .map((item: any) => { return item.instrument.group && item.instrument.group.refCountry && item.instrument?.group.refCountry.name }).filter((v: any, i: any, a: any) => a.indexOf(v) === i).filter((item: string) => item != null && item != "");

    let branchlessItems = items?.filter((current: any) => !current.instrument || !current.instrument?.group.sector);
    let noregionItems = items?.filter((current: any) => !current.instrument || !current.instrument?.group.refCountry);
    let nocurrencyItems = items?.filter((current: any) => !current.instrument || !current.instrument?.currency);

    switch (name) {
        case "Gattung": return AssetTypes.map(type => {
            let filteredItems = items?.filter((current: any) => current.instrument && current.instrument.group.assetGroup && current.instrument.group.assetGroup === type)
            return ({ name: getAssetGroup(type), y: portfolio ? getWeightOfOrderedItems(portfolio, filteredItems) : filteredItems.length, color: getColorOfAssetGroup(type), len: filteredItems.length });
        }).filter((each: any) => each.y > 0)
        case "Währung": return currencies.map((code: string) => {
            let filteredItems = items?.filter((current: any) => current.instrument && ((current.instrument?.currency?.alphaCode != null && current.instrument?.currency?.alphaCode === code) ||
                (current.instrument?.currency?.displayCode != null && current.instrument?.currency?.displayCode === code)))
            return ({ name: code, y: portfolio ? getWeightOfOrderedItems(portfolio, filteredItems) : filteredItems.length });
        }).concat({ name: "Sonstige", y: portfolio ? getWeightOfOrderedItems(portfolio, branchlessItems) : nocurrencyItems.length }).filter((each: any) => each.y > 0)
        case "Branchen": return sectors.map((sector: string) => {
            let filteredItems = items?.filter((current: any) =>
                current.instrument?.group.sector !== null &&
                current.instrument?.group.sector !== null &&
                current.instrument?.group.sector?.name == sector)
            return ({ name: sector, y: portfolio ? getWeightOfOrderedItems(portfolio, filteredItems) : filteredItems.length });
        }).concat({ name: "Sonstige", y: portfolio ? getWeightOfOrderedItems(portfolio, branchlessItems) : branchlessItems.length }).filter((each: any) => each.y > 0)
        case "Region": return regions.map((country: string) => {
            let filteredItems = items?.filter((current: any) => current.instrument && (current.instrument.group && current.instrument.group.refCountry && current.instrument?.group.refCountry.name === country));
            return ({ name: country, y: portfolio ? getWeightOfOrderedItems(portfolio, filteredItems) : filteredItems.length });
        }).concat({ name: "Sonstige", y: portfolio ? getWeightOfOrderedItems(portfolio, noregionItems) : noregionItems.length }).filter((each: any) => each.y > 0)
    }
}

export function getDividendsIncome(portfolio: Portfolio, entry: PortfolioEntry) {
    let dividendIncomesEntries: AccountEntry[] = [];
    if (portfolio.accountEntries) {
        dividendIncomesEntries = portfolio.accountEntries.filter(current => (current.accountTypeDescriptionEn === "Dividenden" ||
            current.accountTypeDescriptionEn === "Sonst. Gutschrift" || current.accountTypeDescriptionEn === "Zinsen")
            && current.instrumentId && entry.instrumentId && current.instrumentId == entry.instrumentId)
    }
    return dividendIncomesEntries;
}

export function calculatePurchase(value?: number, size?: number, expenses?: number, currency?: string) {
    let sum = value && size ?
        (value / (currency === "XXZ" ? 100 : 1) * size + (expenses ? expenses : 0))
        : 0;

    return Number.parseFloat(sum.toFixed(2));
}

export function preformatFloat(float: string) {
    if (!float) {
        return '';
    };

    //Index of first comma
    const posC = float.indexOf(',');

    if (posC === -1) {
        //No commas found, treat as float
        return float;
    };

    //Index of first full stop
    const posFS = float.indexOf('.');

    if (posFS === -1) {
        //Uses commas and not full stops - swap them (e.g. 1,23 --> 1.23)
        return float.replace(/\,/g, '.');
    };

    //Uses both commas and full stops - ensure correct order and remove 1000s separators
    return ((posC < posFS) ? (float.replace(/\,/g, '')) : (float.replace(/\./g, '').replace(',', '.')));
};

export function processNumeric(s: string): [string, number | null] {
    const v: string = filterNumber(s);
    const result: [string, number | null] = validNumber(v) ? [formatNumber(v), parseNumber(v)] : [v, null];
    return result;
}

export function formatNumberDE(n: number): string {
    const format = new Intl.NumberFormat("de-DE");
    return format.format(n);
}

export function formatNumber(n: string): string {
    const [i, sep, fract] = splitNumber(n);
    return formatNumberDE(Number.parseInt(i)) + sep + fract;
}

function splitNumber(s: string): [string, string, string] {
    const r = s.replace(/[^0-9\,]/gi, '');

    const posC = r.indexOf(',');

    if (posC === -1) {
        return [r, "", ""];
    }

    if (posC === r.length - 1) {
        return [r, ",", ""];
    }

    const i = r.substring(0, posC);
    const fract = r.substring(posC + 1).replace(/[^0-9]/gi, '');

    return [i, ",", fract];
}

function filterNumber(s: string): string {
    const [i, sep, fract] = splitNumber(s);
    return i + sep + fract;
}

function validNumber(s: string): boolean {
    const r = new RegExp("([0-9]+[\.\,][0-9])|([0-9][\.\,][0-9]+)|([0-9]+)", "g");
    const n = preformatFloat(s);
    return r.test(n);
}

function parseNumber(s: string): number {   
    const n = preformatFloat(s);
    return Number.parseFloat(n);
}

export function parseNumberLocale(s: string): number {
    const format = new Intl.NumberFormat(navigator.language);
    const parts = format.formatToParts(12345.6);
    const numerals = Array.from({ length: 10 }).map((_, i) => format.format(i));
    
    const index = new Map(numerals.map((d, i) => [d, "" + i]));
    const group = new RegExp(`[${parts.find(d => d.type === "group")!.value}]`, "g");
    const decimal = new RegExp(`[${parts.find(d => d.type === "decimal")!.value}]`);
    const numeral = new RegExp(`[${numerals.join("")}]`, "g");

    const result = s.trim()
        .replace(group, "")
        .replace(decimal, ".")
        .replace(numeral, function(x) {
            const r = index.get(x);
            return r ? r : "";
        });
    
    return result ? + result : NaN;
}

function getAmount(accountEntries: AccountEntry[], date: any, description: string) {
    return accountEntries?.filter(current => (current.entryTime).slice(0, 10) === (date).slice(0, 10) && current.accountTypeDescriptionEn === description).length;
}

function getInstrumentNamesForTransactionHistory(accountEntries: AccountEntry[], date: any) {
    return accountEntries?.filter(item => (item.entryTime).slice(0, 10) === (date).slice(0, 10) && (item.accountTypeDescriptionEn === "Wertpapierverkauf" || item.accountTypeDescriptionEn === "Wertpapierkauf")).map(each => each.securityDescription);
}

export function makeTransactionEntries(portfolio: Portfolio, performanceEntries: PortfolioPerformanceEntry[]) {
    const accountEntries = portfolio.accountEntries;
    // const performanceEntries = portfolio.performanceEntries;
    return performanceEntries?.map((each: PortfolioPerformanceEntry) => {
        return ({
            value: each.value, date: each.date,
            boughtAmount: getAmount(accountEntries || [], each.date, "Wertpapierkauf"),
            soldAmount: getAmount(accountEntries || [], each.date, "Wertpapierverkauf"),
            instrumentNames: getInstrumentNamesForTransactionHistory(accountEntries || [], each.date)
        } || {});
    });
}

export function transactionHistoryChartOptions(performanceEntriesWithMarkers: any, height?: string, gridLineColor?: string, backgroundColor?: string) {
    const maxValue = Math.max.apply(Math, performanceEntriesWithMarkers.map(function (current: any) { return current.value; })) + 1;
    const minValue = Math.min.apply(Math, performanceEntriesWithMarkers.map(function (current: any) { return current.value; })) - 1;
    const timezone = new Date().getTimezoneOffset();
    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        chart: {
            type: 'area',
            backgroundColor: backgroundColor,
            height: height
        },
        title: {
            text: ''
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            borderWidth: 1,
            backgroundColor: '#FFFFFF'
        },
        time: {
            timezoneOffset: timezone
        },
        xAxis: {
            type: 'datetime',
            labels: {
                rotation: 0,
                overflow: "overlay",
            },
        },
        yAxis: {
            opposite: true,
            title: {
                text: null
            },
            max: maxValue,
            min: minValue,
            gridLineColor: gridLineColor,
            labels: {
                align: 'right',
                x: 0,
            },
        },
        plotOptions: {
            area: {
                fillOpacity: 0.5,
            },
        },
        tooltip: {
            enabled: true,
            headerFormat: "",
            useHTML: true,
            pointFormat: '<p><span style="color:{point.color}">\u25CF</span> <span style="color:"black""><b>{point.name}</b> {point.date} {point.text} </span><b> {point.position}</b></p>',
        },
        credits: {
            enabled: false
        },
        series: [{
            color: 'rgba(120, 120, 120, 1)',
            fillColor: 'rgba(120, 120, 120, 0.3)',
            data: performanceEntriesWithMarkers.map((current: PerformanceEntriesWithMarkers) => ({
                name: current.soldAmount > 0 && current.boughtAmount <= 0 ? 'Wertpapierverkauf' : current.boughtAmount > 0 && current.soldAmount <= 0 ? 'Wertpapierkauf' : null,
                color: current.soldAmount > 0 && current.boughtAmount > 0 ? 'rgb(120, 120, 120)' : current.boughtAmount > 0 ? '#18C48F' : current.soldAmount > 0 ? "#ff4d7d" : 'rgb(120, 120, 120)',
                text: (current.soldAmount + current.boughtAmount) > 0 ? " - " + (current.soldAmount + current.boughtAmount) + " Positionen" : null,
                amount: current.soldAmount + current.boughtAmount,
                position: current.instrumentNames.map(current => "<br/><b>" + current + "</b>"),
                date: REALDATE_FORMAT(current.date),
                x: moment(current.date).toDate(),
                y: current.value,
                marker: {
                    enabled: current.boughtAmount + current.soldAmount > 0 ? true : false,
                    symbol: current.soldAmount > 0 && current.boughtAmount <= 0 ? 'url(/static/img/svg/icon_transactions_minus.svg)' :
                        current.boughtAmount > 0 && current.soldAmount <= 0 ? 'url(/static/img/svg/icon_transactions_plus.svg)' :
                            current.boughtAmount > 0 && current.soldAmount > 0 ? 'url(/static/img/svg/icon_transactions_minus_with_padding.svg)' : null,
                    width: current.boughtAmount > 0 && current.soldAmount > 0 ? 16 : 27,
                    height: current.boughtAmount > 0 && current.soldAmount > 0 ? 26 : 27,
                    style: {
                        marginTop: "50px"
                    },
                }
            })),
        }],
    }
}
interface PerformanceEntriesWithMarkers {
    value: number
    date: any
    boughtAmount: number
    soldAmount: number
    instrumentNames: string[]
}

export function getNumberColor(value?: number | undefined | null) {
    if (!value) {
        return "";
    }
    return value > 0 ? "text-green" : value < 0 ? "text-pink" : "";
}

export function getCurrentDate() {
    return moment(new Date()).format("DD-MM-YYYY")
}

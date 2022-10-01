import moment from 'moment';
import {
    AssetGroup,
    ChartScope,
    Exchange,
    Instrument,
    InstrumentGroup,
    NewsTopic,
    Quote,
    QuoteType,
    SnapQuote,
    Trend,
    TrendType, UpdateStickyInstrumentSubscription
} from "../generated/graphql";
import {ReactNode} from "react";

export * from './news';

export function numberFormat(value: number | null | undefined,
    suffix: string = '') {
    if (value == null || Number.isNaN(value)) {
        return '-';
    }
    return new Intl.NumberFormat(navigator.language,
        {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }).format(value) + suffix;
}

export function numberFormatShort(value: number | null): string {
    if (value == null || Number.isNaN(value)) {
        return '-';
    }
    return new Intl.NumberFormat(navigator.language,
        {
            maximumFractionDigits: 2,
            minimumFractionDigits: 0
        }).format(value);
}

export function numberFormatShortGraph(value: number | null): any {
    if (value == null || Number.isNaN(value)) {
        return value;
    }
    return new Intl.NumberFormat(navigator.language,
        {
            maximumFractionDigits: 2,
            minimumFractionDigits: 0
        }).format(value);
}

export function numberFormatDecimals(value: number | null | undefined,
    minDecimals: number = 2,
    maxDecimals: number = 5,
    suffix: string = '') {
    if (value == null || Number.isNaN(value)) {
        return '--';
    }
    return new Intl.NumberFormat(navigator.language,
        {
            maximumFractionDigits: maxDecimals,
            minimumFractionDigits: minDecimals
        })
        .format(value) + suffix;
}

export function formatKeyFigureValue(value: number | null | undefined, minDecimals: number = 2, maxDecimals: number = 4, suffix: string = '') {
    if (value === null || value === undefined || Number.isNaN(value)) {
        return '-';
    } else {
        if (value < 1 && value > -1) {
            return new Intl.NumberFormat(navigator.language,
                {
                    maximumFractionDigits: maxDecimals, minimumFractionDigits: maxDecimals
                }).format(value) + suffix
        } else if (value >= 1 || value <= -1) {
            return new Intl.NumberFormat(navigator.language, {
                maximumFractionDigits: minDecimals, minimumFractionDigits: minDecimals
            }).format(value) + suffix
        }
    }
}

export function formatPrice(value?: number | null, assetType?: AssetGroup | null,  normizlingValue?: number | null, suffix?: string | null): string {
    if (!value && value!==0) {
        return '-';
    }
    if (!!assetType) {
        if (assetType === AssetGroup.Cross) {
            return new Intl.NumberFormat(navigator.language,
                {
                    maximumFractionDigits: 4,
                    minimumFractionDigits: 4
                }).format(value) + (suffix ? " " + suffix : '');
        }
        if (assetType === AssetGroup.Knock || assetType === AssetGroup.Opt || assetType === AssetGroup.Cert) {
            return new Intl.NumberFormat(navigator.language,
                {
                    maximumFractionDigits: 3,
                    minimumFractionDigits: 3
                }).format(value) + (suffix ? suffix : '');
        }
    }
    if(normizlingValue && Math.abs(normizlingValue) < 1 && Math.abs(normizlingValue) > 0){
        return new Intl.NumberFormat(navigator.language,
            {
                maximumFractionDigits: 3,
                minimumFractionDigits: 3
            }).format(value) + (suffix ? suffix : '');
    }
    return new Intl.NumberFormat(navigator.language,
        {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }).format(value) +  (suffix ? " " + suffix : '');
}

export function formatPriceWithSign(value?: number | null, assetGroup?: AssetGroup | null | undefined, normizlingValue?: number | null,
                                     suffix: string | null = ''): string {
    if (value == null || Number.isNaN(value)) {
        return '-';
    }
    return (value > 0 ? '+' : '') + formatPrice(value, assetGroup, normizlingValue,
        suffix);
}
export function formatAssetGroup(assetType: AssetGroup | null | undefined) {
    let group = assetType || AssetGroup.Other;
    switch (group) {
        case AssetGroup.Share:
            return "Aktie";
        case AssetGroup.Etc:
            return "ETC";
        case AssetGroup.Etf:
            return "ETF";
        case AssetGroup.Bond:
            return "Zinspapier";
        case AssetGroup.Cert:
            return "Zertifikat";
        case AssetGroup.Comm:
            return "Rohstoff";
        case AssetGroup.Cross:
            return "Währung";
        case AssetGroup.Etn:
            return "ETN";
        case AssetGroup.Fund:
            return "Fonds";
        case AssetGroup.Fut:
            return "Future";
        case AssetGroup.Index:
            return "Index";
        case AssetGroup.Knock:
            return "Knock-Out";
        case AssetGroup.Mmr:
            return "Geldmarktsatz";
        case AssetGroup.Multi:
            return "MultiAsset";
        case AssetGroup.Opt:
            return "Option";
        case AssetGroup.RealEstate:
            return "Immobilie";
        case AssetGroup.Vwl:
            return "Konjunkturdaten";
        case AssetGroup.Warr:
            return "Optionsschein";
        case AssetGroup.Other:
            return "Other";
    }
}

export enum Period {
    WEEK1 = 'WEEK1',
    MONTH1 = 'MONTH1',
    MONTH6 = 'MONTH6',
    CURRENT_YEAR = 'CURRENT_YEAR',
    WEEK52 = 'WEEK52',
    YEAR3 = 'YEAR3'
}

export function periodMap(period: any) {
    switch (period) {
        case Period.WEEK1:
            return '1 Woche';
        case Period.MONTH1:
            return '1 Monat';
        case Period.MONTH6:
            return '6 Monate';
        case Period.CURRENT_YEAR:
            return 'Lfd. Jahr';
        case Period.WEEK52:
            return '1 Jahr';
        case Period.YEAR3:
            return '3 Jahre';
        case undefined:
            return '-'
    }
}

export function shortNumberFormat(number: number | null | undefined,
    decimals: number = 2): string {
    if (number == null || Number.isNaN(number)) {
        return '-';
    }
    let absNumber = Math.abs(number);

    if (absNumber > 1_000_000_000_000) {
        return shortNumberFormat(number / 1_000_000_000_000) + ' Brd.';
    }
    if (absNumber > 1_000_000_000) {
        return shortNumberFormat(number / 1_000_000_000) + ' Mrd.';
    }
    if (absNumber > 1_000_000) {
        return shortNumberFormat(number / 1_000_000) + ' Mio.';
    }
    if (absNumber > 1_000) {
        return shortNumberFormat(number / 1_000) + ' Tsd.';
    }
    return numberFormatDecimals(number,
        0,
        decimals);
}

export function numberFormatWithSign(value?: number | null,
    suffix: string = ''): string {
    if (value == null || Number.isNaN(value)) {
        return '-';
    }
    return (value > 0 ? '+' : '') + numberFormat(value,
        suffix);
}

export function REALDATE_FORMAT(value: any) {
    return moment(value).format("D.M.Y")
}

export function formatTime(value: any,
    suffix?: string) {
    if (value == null) {
        return '-';
    }
    return moment(value).format("HH:mm:ss") + (suffix ? suffix : '');
}

export function formatDate(value: any) {
    if (value == null) {
        return '-';
    }
    return moment(value).format("DD.MM.Y");
}

export function formatDateMonthAndYear(value: any) {
    if (value == null) {
        return '-';
    }
    return moment(value).format("MMMM YYYY");
}

export function quoteFormat(value: any,
    suffix?: string): string {
    if (value == null) {
        return '-';
    }
    let today = moment().startOf('day');
    let current = moment(value);
    if (today.isBefore(current)) {
        return current.format("HH:mm:ss") + (suffix ? suffix : '');
    }
    return current.format("DD.MM.Y");
}

export function quoteFormatWithShortYear(value: any,
    suffix?: string): string {
    if (value == null) {
        return '-';
    }
    let today = moment().startOf('day');
    let current = moment(value);
    if (today.isBefore(current)) {
        return current.format("HH:mm:ss") + (suffix ? suffix : '');
    }
    return current.format("DD.MM.YY");
}

export function fullDateTimeFormat(value: any) {
    if (value == null) {
        return '-';
    }
    return moment(value).format("D.M.Y HH:mm:ss");
}

export function getAssetLink(group?: InstrumentGroup | null,
    exchange?: Exchange | null) {
    if (!group || !group.assetGroup || !group.seoTag) {
        return null;
    }
    return getFinanztreffAssetLink(group.assetGroup,
        group.seoTag,
        exchange?.code || undefined);
}

export function getFinanztreffAssetLink(assetGroup: string, seoTag: string, exchangeCode?: string) {
    let suffix = exchangeCode ? '#boerse-' + escape(exchangeCode) : '';
    switch (assetGroup) {
        case "SHARE":
            return "/aktien/kurse/" + seoTag + "/" + suffix;
        case "FUND":
            return "/fonds/kurse/" + seoTag + "/" + suffix;
        case "ETF":
            return "/etf/kurse/" + seoTag + "/" + suffix;
        case "ETC":
            return "/etc/kurse/" + seoTag + "/" + suffix;
        case "BOND":
            return "/anleihen/kurse/" + seoTag + "/" + suffix;
        case "CERT":
            return "/zertifikate/kurse/" + seoTag + "/" + suffix;
        case "KNOCK":
            return "/hebelprodukte/kurse/" + seoTag + "/" + suffix;
        case "INDEX":
            return "/indizes/kurse/" + seoTag + "/" + suffix;
        case "CROSS":
            return "/devisen/kurse/" + seoTag + "/" + suffix;
        case "COMM":
            return "/rohstoffe/kurse/" + seoTag + "/" + suffix;
        case "FUT":
            return "/future/kurse/" + seoTag + "/" + suffix;
        case "WARR":
            return "/optionsschein/kurse/" + seoTag + "/" + suffix;
        case "MMR":
            return "/geldmarktsatz/kurse/" + seoTag + suffix;
        case "VWL":
            return "/geldmarktsatz/kurse/" + seoTag + suffix;
        default:
            return "/";
    }

}

export function getInstrumentIdByExchnageCode(instrumentGroup: InstrumentGroup | undefined, location: any): number {
    if (instrumentGroup && instrumentGroup.content.length>0) {
        const hash = location.hash;
        const code = hash.replace(/(\#boerse)-(.*?)/i, '$2');
        const selectedInstrument = instrumentGroup.content.find((value: any) => value.exchange.code === code);
        if(!!selectedInstrument){
            return selectedInstrument.id
        }
        if(!!instrumentGroup.content.find(current=> current.main)){
            return instrumentGroup.content.find(current=> current.main)?.id || 0;
        }
        return instrumentGroup.content[0].id;
    }
    return 0;
}

export const GRID_BACKGROUND_COLORS = [
    {
        class: 'bg-stock-grey--0',
        from: 0,
        to: 0
    },
    {
        class: 'bg-stock-green--0',
        from: 0,
        to: 5
    },
    {
        class: 'bg-stock-green--3',
        from: 15,
        to: 9999999
    },
    {
        class: 'bg-stock-green--2',
        from: 10,
        to: 15
    },
    {
        class: 'bg-stock-green--1',
        from: 5,
        to: 10
    },
    {
        class: 'bg-stock-red--1',
        from: -5,
        to: 0
    },
    {
        class: 'bg-stock-red--2',
        from: -15,
        to: -5
    },
    {
        class: 'bg-stock-red--3',
        from: -20,
        to: -15
    },
    {
        class: 'bg-stock-red--4',
        from: -9999999,
        to: -20
    }
];

export function getGridPerformanceClass(value?: number | null) {
    if (!value) {
        return GRID_BACKGROUND_COLORS[0].class;
    }
    let level = GRID_BACKGROUND_COLORS.find(current => current.from <= value && value < current.to);
    if (!level) {
        return GRID_BACKGROUND_COLORS[0].class;
    }

    return level.class;
}

export function separateNumber(value?: number,
    decimal?: number) {
    if (value == null) {
        return {
            whole: null,
            decimal: null
        };
    }
    if (decimal == null) {
        decimal = 2;
    }
    let multiplier = Math.pow(10,
        decimal)
    let v = value * multiplier;
    let quotient = Math.floor(v / multiplier);
    let remainder = Math.floor(v % multiplier);
    return {
        integer: quotient,
        fraction: Math.abs(remainder)
    };
}

var lastValue = 0;

export function numberIsIncreasing(num: number,
    string: string): any {
    if (lastValue < num) {
        string = "isUp";
    } else if (lastValue > num) {
        string = "isDown";
    } else {
        return null;
    }
    lastValue = num;
    return string;
}

export function removeImagesAndFigures(node: HTMLElement): React.ReactNode {
    if (node.tagName === 'IMG') {
        return null;
    }
    if (node.tagName === 'FIGURE') {
        return null;
    }
}

export function compareTwoValues(v1: any,
    v2: any,
    dir: any) {

    if (typeof v1 === "string") {
        return v1.localeCompare(v2) * (dir === 0 ? 1 : -1);
    } else {
        if (!v1) {
           return (dir === 0 ? -1 : 1);
        }
        if (!v2) {
            return (dir === 0 ? 1 : -1);
        }
        if (v1 > v2) return (dir === 0 ? 1 : -1);
        if (v2 > v1) return (dir === 0 ? -1 : 1);
        return 0;
    }
}

export function getEnumKeys(enumType: any) {
    return Object.keys(enumType);
}

export function getEnumValues(enumType: any) {
    return getEnumKeys(enumType).map(function (key) {
        return enumType[key];
    });
}

export function getEnumValue(enumType: any,
    key: any) {
    return enumType[getEnumKeys(enumType).filter(function (k) {
        return key === k;
    }).pop() || ''];
}

export function getTextColorByValue(value: number | null | undefined) {
    if (value == null || Number.isNaN(value)) {
        return '';
    }
    return value < 0 ? " text-red" : value > 0 ? " text-green" : "";
}


export interface Quotes {
    ask?: Quote;
    bid?: Quote;
    trade?: Quote;
    nav?: Quote;
    redemptionPrice?: Quote;
    issuePrice?: Quote;
}

export function extractQuotes(snapQuote: SnapQuote | null | undefined): Quotes {
    let result: Quotes = {};
    if (snapQuote) {
        snapQuote?.quotes?.filter(item => item?.type === QuoteType.Trade)
            .forEach(current => {
                if (current) {
                    result.trade = current;
                }
            })
        snapQuote?.quotes?.filter(item => item?.type === QuoteType.Bid)
            .forEach(current => {
                if (current) {
                    result.bid = current;
                }
            })
        snapQuote?.quotes?.filter(item => item?.type === QuoteType.Ask)
            .forEach(current => {
                if (current) {
                    result.ask = current;
                }
            })
        snapQuote?.quotes?.filter(item => item?.type === QuoteType.NetAssetValue)
            .forEach(current => {
                if (current) {
                    result.nav = current;
                }
            })
        snapQuote?.quotes?.filter(item => item?.type === QuoteType.RedemptionPrice)
            .forEach(current => {
                if (current) {
                    result.redemptionPrice = current;
                }
            })
        snapQuote?.quotes?.filter(item => item?.type === QuoteType.IssuePrice)
            .forEach(current => {
                if (current) {
                    result.issuePrice = current;
                }
            })
    }
    return result;
}

export function extractQuotesFromFond(snapQuote: SnapQuote | null | undefined): Quotes {
    let result: Quotes = {};
    if (snapQuote) {
        snapQuote?.quotes?.filter(item => item?.type === QuoteType.NetAssetValue)
            .forEach(current => {
                if (current) {
                    result.nav = current;
                }
            })
        snapQuote?.quotes?.filter(item => item?.type === QuoteType.RedemptionPrice)
            .forEach(current => {
                if (current) {
                    result.redemptionPrice = current;
                }
            })
        snapQuote?.quotes?.filter(item => item?.type === QuoteType.IssuePrice)
            .forEach(current => {
                if (current) {
                    result.issuePrice = current;
                }
            })
    }
    return result;
}

export function calculateDaysWithTimeFrame(date: moment.Moment | string, timeFrame?: number) {
    if (!timeFrame) {
        return null;
    }
    const day: number = 1000 * 60 * 60 * 24;
    const days: number = Math.floor((Date.parse((moment(date).add(timeFrame, 'M').toString())) - Date.now()) / day);
    return days >= 0 ? days : 0;
}

export const PERIOD_ORDER: string[] = [
    'INTRADAY',
    'CURRENT_YEAR',
    'WEEK1',
    'DAY200',
    'DAY250',
    'MONTH1',
    'MONTH2',
    'MONTH3',
    'MONTH6',
    'WEEK52',
    'YEAR3',
    'YEAR5',
    'YEAR10',
    'ALL_TIME',
    'YESTERDAY'
];

export interface KeyValuePair {
    key: any,
    value: any
}

export const Currencies: string[] = [
    "Afghanischer Afghani",
    "Ägyptisches Pfund",
    "Albanischer Lek",
    "Algerischer Dinar",
    "Angolanischer Kwanza",
    "Antillischer Gulden",
    "Argentinischer Peso",
    "Armenischer Dram",
    "Arubanischer Florin",
    "Aserbaidschanische Manat",
    "Äthiopischer Birr",
    "Australischer Dollar",
    "Bahama Dollar",
    "Bahrainischer Dinar",
    "Bangladeschischer Taka",
    "Barbados Dollar",
    "Belizischer Dollar",
    "Bermuda Dollar",
    "Bhutanischer Ngultrum",
    "Bitcoin",
    "Bolivianischer Boliviano",
    "Bosnisch-Herzegowinische konvertible Mark",
    "Botsuanischer Pula",
    "Brasilianischer Real",
    "Britische Pence",
    "Britische Pence",
    "Britisches Pfund",
    "Brunei-Dollar",
    "Bulgarischer Lew",
    "Burundi Franc",
    "CFA Franc BCEAO",
    "CFA-Franc BEAC",
    "CFP Franc",
    "Chilenischer Peso",
    "Chinesischer Renminbi Offshore",
    "Chinesischer Renminbi Yuan",
    "Costaricanischer Colón",
    "Dänische Krone",
    "Dominikanischer Peso",
    "Dschibutischer Franc",
    "El-Salvador-Colón",
    "Eritreischer Nakfa",
    "Euro",
    "Falkland-Pfund",
    "Fiji Dollar",
    "Gambischer Dalasi",
    "Georgischer Lari",
    "Ghanaischer Cedi",
    "Gibraltar Pound",
    "Guatemaltekischer Quetzal",
    "Guineischer Franc",
    "Guyana Dollar",
    "Haitianische Gourde",
    "Honduranischer Lempira",
    "HongKong-Dollar",
    "Indische Rupie",
    "Indonesische Rupiah",
    "Irakischer Dinar",
    "Iranischer Rial",
    "Isländische Krone",
    "Israelischer Schekel",
    "Jamaikanischer Dollar",
    "Japanischer Yen",
    "Jemenitischer Rial",
    "Jordanischer Dinar",
    "Kaiman Dollar",
    "Kambodschanischer Riel",
    "Kanadischer Dollar",
    "Kapverdischer Escudo",
    "Kasachischer Tenge",
    "Katarischer Riyal",
    "Kenianischer Schilling",
    "Kirgisischer Som",
    "Kolumbianischer Peso",
    "Komorischer Franc",
    "Kongolesischer Franc",
    "Kroatische Kuna",
    "Kubanischer Peso",
    "Kuwaitischer Dinar",
    "Laotischer Kip",
    "Lesothischer Loti",
    "Libanesisches Pfund",
    "Liberianischer Dollar",
    "Libyscher Dinar",
    "Macao Pataca",
    "Madagassischer Ariary",
    "Malawische Kwacha",
    "Malaysischer Ringgit",
    "Maledivische Rupie",
    "Marokkanischer Dirham",
    "Mauretanischer Ouguiya",
    "Mauritische Rupie",
    "Mazedonischer Denar",
    "Mexikanischer Peso",
    "Moldauischer Leu",
    "Mongolischer Tögrög",
    "Mosambikanischer Metical",
    "Myanmarischer Kyat",
    "Namibischer Dollar",
    "Nepalesische Rupie",
    "Neuseeländischer Dollar",
    "Nicaraguanischer Córdoba",
    "Nigerianische Naira",
    "Nordkoreanischer Won",
    "Norwegische Krone",
    "Omanischer Rial",
    "Ostkaribischer Dollar",
    "Pakistanische Rupie",
    "Panamaischer Balboa",
    "Papua-Neuguineischer Kina",
    "Paraguayischer Guarani",
    "Peruanischer Sol",
    "Peso cubano convertible",
    "Philippinischer Piso",
    "Polnischer Zloty",
    "Ruandischer Franc",
    "Rumänischer Leu",
    "Russischer Rubel",
    "Salomonischer Dollar",
    "Sambischer Kwacha",
    "Samoanischer Tala",
    "Saudischer Rial",
    "Schwedische Krone",
    "Schweizer Franken",
    "Serbischer Dinar",
    "Seychellische Rupie",
    "Sierra-leonischer Leone",
    "Simbabwischer Dollar",
    "Singapur-Dollar",
    "Somalischer Schilling",
    "Srilankische Rupie",
    "St.-Helena-Pfund",
    "Südafrikanischer Rand",
    "Sudanesisches Pfund",
    "Südkoreanischer Won",
    "Surinamischer Dollar",
    "Swasischer Lilangeni",
    "Syrische Lira",
    "Tadschikischer Somoni ",
    "Taiwanesischer Dollar",
    "Tansanischer Schilling",
    "Thailändischer Baht",
    "Tongaischer Pa'anga",
    "Trinidad-und-Tobago-Dollar",
    "Tschechische Krone",
    "Tunesischer Dinar",
    "Türkische Lira",
    "Turkmenischer Manat",
    "Ugandischer Schilling",
    "Ukrainische Hrywnja",
    "Ungarischer Forint",
    "Uruguayischer Peso",
    "Usbekischer So'm",
    "US-Dollar",
    "VAE Dirham",
    "Vanuatuischer Vatu",
    "Venezolanischer Bolívar Soberano",
    "Vietnamesischer Dong",
    "Weißrussischer Rubel"]

export const removeTags = (str: string) => {
    if ((str === null) || (str === '') || (str === undefined)) {
        return '';
    }
    return str.replace(/(<([^>]+)>)/ig, '');
}

export function computeDueToCss(dueTo: number | null): string | null {
    if (dueTo == null || Number.isNaN(dueTo) || dueTo < 0) {
        return "dark";
    }
    if (dueTo > 90) {
        return "green";
    }
    if (dueTo > 30) {
        return "orange";
    }
    return "pink";
}

export type keyFigureType = {
    id: number
    name: string
    value: string | ReactNode | number
}

export enum CertificateTypeName {
    Faktor = 'Faktor',
    Bonus = 'Bonus',
    Discount = 'Discount',
    Express = 'Express',
    Index = 'Index',
    Aktienanleihe = 'Aktienanleihe',
    OutperfSprint = 'Outperf./Sprint',
    Kapitalschutz = 'Kapitalschutz'
}

export type NumberRange = {
    from: number
    to: number
}

export enum SharePerformanceCardType {
    GEWINN = 'GEWINN',
    MARKET_CAP = 'MARKET_CAP',
    DIVIDEND_YEILD = 'DIVIDEND_YEILD',
    PAYOUT_RATIO = 'PAYOUT_RATIO',
    DIVIDEND = 'DIVIDEND',
    CASHFLOW = 'CASHFLOW',
    PERIOD = 'PERIOD',
    UMSATZ = 'UMSATZ'
}
export enum SharePerformanceDuration {
    MONTH12 = 'MONTH12',
    YEAR3 = 'YEAR3',
    YEAR5 = 'YEAR5',
    YEAR10 = 'YEAR10'
}

export function sortByExchanges(instruments: Instrument[]) {

    return instruments.filter(current => current.countryId === 48 && current.snapQuote && current.snapQuote.cumulativeVolume).sort(function (a, b) {
        if (a.snapQuote?.cumulativeVolume < b.snapQuote?.cumulativeVolume) return 1;
        else if (a.snapQuote?.cumulativeVolume > b.snapQuote?.cumulativeVolume) return -1;
        return 0;
    })
    .concat(instruments.filter(current => current.countryId === 48 && (!current.snapQuote || !current.snapQuote.cumulativeVolume)))
    .concat(
        instruments.filter(current => current.countryId !== 48 && current.snapQuote && current.snapQuote.cumulativeVolume).sort(function (a, b) {
            if (a.snapQuote!.cumulativeVolume < b.snapQuote!.cumulativeVolume) return 1;
            else if (a.snapQuote?.cumulativeVolume > b.snapQuote?.cumulativeVolume) return -1;
            return 0;
        }
    ))
    .concat(instruments.filter(current => current.countryId !== 48 && (!current.snapQuote || !current.snapQuote.cumulativeVolume)));
}

export function hideIfEmpty(content: any) {
    if (!content || content.length === 0 || Object.keys(content).length === 0) {
        return "d-none"
    }
}

export function calculateTrends(queryParams: any, keyFigureValue: string) {
    return Object.assign(queryParams?.trends, { [1]: { keyFigure: keyFigureValue, value: Trend.Positive, type: TrendType.Period } })
}

export function calculateRanges(queryParams: any, keyFigureValue: string) {
    return [{ keyFigure: keyFigureValue, from: queryParams?.range["from"] }];
}

export const Instrument_Names: string[] = [
    'Aktien',
    'Fonds',
    'ETF',
    'ETC',
    'ETN',
    'Anleihen',
    'Zertifikate',
    'Hebelprodukte',
    'Indizes',
    'Devisen',
    'Rohstoffe',
];

export const topicLabels: NewsTopic[] = [
    {
        name: "Wirtschaft/Politik",
        id: "WIRTSCHAFT_POLITIK"
    },
    {
        name: "Unternehmen",
        id: "UNTERNEHMEN"
    },
    {
        name: "Topthemen",
        id: "TOPTHEMEN"
    },
    {
        name: "Roundups",
        id: "ROUNDUPS"
    },
    {
        name: "Marktberichte",
        id: "MARKTBERICHTE"
    },
]

export function newsReadingTime(text: string | null | undefined): number | undefined {
    const wordsPerMinute: number = 200;
    let words: string | undefined = text?.trim().replace(/\n/, '');
    words = words?.trim().replace(/(<([^>]+)>)/ig, "");
    let textLength: number | undefined = words?.trim().split(/\s+/).length;
    return textLength && Math.ceil(textLength / wordsPerMinute);
}

export function gcd(x: number, y: number) {
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
        let t = y;
        y = x % y;
        x = t;
    }
    return x;
}

export function textForSEO(assetGroup: AssetGroup): { text: string, header: string } {
    switch (assetGroup) {
        case AssetGroup.Share:
            return {
                text: "Aktien sind Wertpapiere, welche Anteile in Form von Nennwert- oder Stückaktien an Aktiengesellschaften verbriefen. Für Aktiengesellschaften ist die Aktie ein Finanzierungsinstrument, mit dessen Ausgabe sich im Rahmen eines Börsengangs oder einer Kapitalerhöhung am Finanzmarkt frisches Eigenkapital beschafft werden kann. Aktien werden überwiegend an der Börse gekauft und verkauft – es kann aber auch zu privaten Geschäften kommen. Verschiedene Aktienanlagen bilden üblicherweise die Grundlage der Depots vieler Privatanleger, wo Aktien dank Veräußerungsgewinnen und Dividendenzahlungen historisch gesehen eine höhere Rendite abwerfen als die meisten anderen Anlageklassen. Es gibt zwei Hauptarten von Aktien: Stammaktien und Vorzugsaktien. Stammaktionäre haben in der Regel ein Stimmrecht bei Aktionärsversammlungen und erhalten Dividenden, sofern sie von der jeweiligen Aktiengesellschaft ausgeschüttet werden. Vorzugsaktionäre sind in der Regel nicht stimmberechtigt, erhalten dafür jedoch höhere Dividenden. Zudem werden Aktien je nach Größe des ausgebenden Unternehmens in unterschiedliche Klassen unterteilt: Aktionäre sprechen dann von Large Caps (Aktien großer Firmen), Mid Caps (Aktien mittelgroßer Firmen) und Small Caps (Aktien kleiner Firmen).",
                header: 'Aktien'
            }
        case AssetGroup.Index:
            return {
                text: "Ein Index ist ein statistisches Instrument, um die Entwicklung der Preise von Wertpapieren abzubilden. Zu den bekanntesten Aktienindizes zählen der DAX aus Deutschland und der Dow Jones aus den USA. Die Berechnung des Indexwerts erfolgt anhand der Preise der zugrundeliegenden Aktien sowie deren Gewichtung und wird in Punkten ausgegeben. Bei der Gewichtung der einzelnen Wertpapiere im Index können unterschiedliche Faktoren wie die Marktkapitalisierung, der Umsatz oder der Streubesitz entscheidend sein. Geläufig ist aber auch, dass alle Indexmitglieder gleich gewichtig werden und nach einem gewissen Zeitablauf eine Indexanpassung erfolgt. Zudem gibt es zwei grundsätzlich zu unterscheidende Indexarten: Preisindizes, bei denen der Indexstand alleine aufgrund von Kursveränderungen bemessen wird, und Performanceindizes, wo zusätzlich die Annahme erfolgt, dass Dividenden oder Bezugsrechte in die Wertpapiere des Index reinvestiert werden. Investoren können darüber hinaus nicht direkt in Indizes investieren, sondern nur indirekt durch ETFs, Zertifikate oder Optionsscheine.",
                header: 'Indizes'
            }
        case AssetGroup.Cert:
            return {
                text: "Zertifikate sind Schuldverschreibungen mit denen es Anlegern ermöglicht wird, an der Entwicklung eines Basiswertes wie einer Aktie, einer Anleihe oder eines anderen Vermögenswertes zu partizipieren. Zertifikate werden von Banken emittiert und zählen zu den strukturierten Finanzprodukten. Zertifikate können vom jeweiligen Emittenten bezüglich ihrer Eigenschaften frei ausgestaltet werden. Sie haben in der Regel einen Fälligkeitstermin, es existieren allerdings auch Zertifikate mit unbeschränkter Laufzeit. Durch den Kauf von Zertifikaten wird es dem Privatanleger ermöglicht komplexe Strategien nachzubilden oder aber in schwer zugängliche Basiswerte, wie z.B. Rohstoffe zu investieren. Zu den bekanntesten Zertifikate-Arten gehören Hebelzertifikate, Indexzertifikate, Discount-Zertifikate, Bonuszertifikate, Garantiezertifikate sowie Sprint-, Basket- und Outperformance-Zertifikate. Zertifikate werden vornehmlich außerbörslich gehandelt und vorwiegend an Privatkunden verkauft. Sie können jederzeit aber auch an der Börse verkauft werden, sofern sich Käufer finden – in Deutschland findet der Zertifikatehandel an der EUWAX, in Frankfurt, Berlin und Düsseldorf statt.",
                header: 'Zertifikate'
            }
        case AssetGroup.Knock:
            return {
                text: "Knockouts sind Hebelzertifikate. Sie bieten die Möglichkeit mit einem Hebel auf Kursveränderungen des Basiswerts zu setzen. Mit Long Knockouts spekuliert man auf steigende, mit Short Knockouts auf fallende Kurse (Short-/Long-Zertifikate). Im Laufe der Zeit sind zahlreiche Varianten zu den Knock-Outs hinzugekommen, deren Namen von Emissionshaus zu Emissionshaus variieren: Turbo-Zertifikat, Turbos, Waves, Turbo-Optionsschein, Shorts, Mini-Future. Bei Knockouts hat die Volatilität im Gegensatz zu Optionsscheinen keinen Einfluss auf die Preisbildung. Sie bilden die Wertentwicklung des Basiswertes nahezu 1:1 ab und sind damit einfacher nachvollziehbar – steigt oder fällt der Basiswert einen Euro, steigt auch der Kurs des Hebelzertifikats unter Berücksichtigung des Bezugsverhältnisses um circa einen Euro. Das Bezugsverhältnis gibt dabei an, wie viele Knock-Outs der Anleger benötigt, um die Kursbewegung des Basiswertes abzubilden. Bei Erreichen der namensgebenden Knockout-Schwelle verfallen die Papiere entweder wertlos oder es wird ein Restwert ausgezahlt. Knockouts gibt es mit und ohne Laufzeitbegrenzung.",
                header: 'Knockouts'
            }
        case AssetGroup.Warr:
            return {
                header: "Optionsscheine",
                text: "Optionsscheine, auch Warrants genannt, sind an der Börse handelbare Wertpapiere. Diese Wertpapiere besitzen eine Fälligkeit und sind auf einen bestimmten Basiswert, z. B. eine Aktie, eine Währung, einen Index oder einen Rohstoff bezogen. Gehandelt wird das Recht, den Basiswert zu einem vorher festgelegten Kurs, dem sogenannten Ausübungspreis, zu kaufen (Call-Optionen) oder zu verkaufen (Put-Optionen). Anleger gehen also mit Optionsscheinen eine Wette auf die künftige Kursentwicklung des Basiswerts ein. Eine Verpflichtung zum Kauf oder Verkauf des Basiswerts besteht jedoch nicht, was der entscheidende Unterschied zwischen einem Optionsschein und einem Terminkontrakt ist. Scheitert die Spekulation, ist das zum Kauf des Optionsscheins eingesetzte Kapital verloren. Bei den meisten hierzulande verwendeten Optionsscheinen handelt es sich um sogenannte nackte Optionsscheine. Die nackten Optionsscheine werden nicht in Verbindung mit einer Optionsanleihe ausgegeben, werden von Banken und Handelshäusern emittiert und weisen in der Regel eine Laufzeit von zwei Jahren aus. Häufig wird anstelle der Lieferung des Basiswertes bei den nackten Optionsscheinen ein Barausgleich vereinbart, der sich aus der Differenz zwischen Ausübungspreis und aktuellem Börsenkurs des Basiswertes ergibt."
            }
        case AssetGroup.Fund:
            return {
                text: "Fonds bieten Investmentgesellschaften die Möglichkeit, Geld von Anlegern einzusammeln, um dieses gestreut in Wertpapiere oder andere Anlageklassen wie Rohstoffe oder Immobilien zu investieren. Das Kapital wird dann von einem Fondsmanager, über eine im Fondsprospekt kommunizierte Strategie, an den Finanzmärkten für die Anleger investiert. Fondserträge werden durch Kursgewinne, Zinsen oder Dividenden erzielt und an die Anteilseigner ausgeschüttet oder reinvestiert. Der Vorteil eines Fonds besteht in der Risikostreuung. Die Risikodiversifizierung ist bei sogenannten Mischfonds am höchsten, weil hier in sämtliche Assetklassen investiert werden kann, bei einem reinen Aktienfonds ist die Risikostreuung dagegen nur auf Aktien beschränkt. Unterschieden wird bei Investmentfonds jedoch nicht nur bezüglich der Assetklassen, sondern auch zwischen offenen und geschlossenen Fonds. Bei offenen Fonds können jederzeit Anteile gekauft oder zurückgegeben werden. Bei geschlossenen Fonds ist eine Anteilsrückgabe nicht möglich und auch ein Anteilserwerb nach Einbringung des geplanten Volumens ist ausgeschlossen. ",
                header: "Fonds (Investmentfonds)"
            }
        case AssetGroup.Etf:
            return {
                text: "ETFs (Exchange Traded Funds) sind Fonds in Form von Sondervermögen, die sowohl aktiv als auch passiv gemanagt und über die Börse gehandelt werden. Dabei ist das Ziel von passiv gemanagten ETFs, den Vergleichsindex möglichst genau abzubilden – Ziel aktiv gemanagter ETF-Produkte ist es, den Index zu schlagen. Insbesondere passiv gemanagte börsengehandelte Fonds, welche die Wertentwicklung eines Basisindex abbilden, erfreuen sich heutzutage großer Beliebtheit. Durch die passive Struktur werden weitere Kostenvorteile erzielt, da nur eine geringe Verwaltungsgebühr an den Anleger weitergegeben wird. Darüber hinaus werden bei allen ETF-Arten kein Ausgabeaufschlag verlangt, sondern es fallen lediglich die üblichen Handelsgebühren an. Besonders liquide Index-ETFs werden zudem fortlaufend gehandelt, was im Gegensatz zu klassischen Investmentfonds eine häufigere Preisfeststellung sowie einen jederzeitigen Ein- und Ausstieg ermöglicht. Für Privatanleger sind auch sogenannte kostenlose ETF-Sparpläne attraktiv, die eine ETF-Anlage ohne Ordergebühren in regelmäßigen Abständen anbieten.",
                header: "ETF (Exchange Traded Funds)"
            }
        case AssetGroup.Etc:
            return {
                header: "ETC (Exchange Traded Commodities)",
                text: "ETCs sind besicherte Schuldverschreibungen, die auf Verlangen (von Market Makers) ausgegeben und zurückgenommen werden können. Sie werden an der Frankfurter Wertpapierbörse wie Aktien gehandelt; die Mechanismen bei Preisbildung und Nachbildung sowie die günstige Kostenstruktur ähneln denen eines ETFs (Exchange Traded Fund). ETCs verfolgen aber nur an Warenbörsen gehandelte Waren, sogenannten Commodities – nicht jedoch Commodity-Unternehmen. ETCs erlauben den Anlegern damit den Handel mit Rohstoffen, ohne dass ein Handel mit Futures oder die physische Abnahme einer Lieferung erforderlich ist. ETCs, deren Kurse sich nach den Futures richten, korrelieren zu beinahe 100 Prozent mit dem Preis der ihnen zugrundeliegenden Ware, jedoch ist der Spotpreis-Ertrag kein investierbarer Ertrag. ETCs, die durch physisches Metall gedeckt sind, richten sich direkt nach deren Spotkursen abzüglich der Gebühren. Bekanntes Beispiel eines physisch besicherten ETCs: Xetra-Gold."
            }
        case AssetGroup.Cross:
            return {
                header: "Devisen",
                text: "Devisen sind auf Fremdwährung lautende ausländische Zahlungsmittel. Der Wechselkurs, auch Devisenkurs oder Währungskurs genannt, ist der Preis einer Währung ausgedrückt in einer anderen Währung. Die Preisbildung findet im Rahmen des Devisenhandels auf dem Devisenmarkt statt (flexibler Wechselkurs) oder wird durch den Devisenkauf und -verkauf der Zentralbanken bestimmt (fester Wechselkurs). Im Mittelpunkt des Devisenhandels stehen Banken, die auf eigene Rechnung (z.B. Devisenarbitrage) oder auf Rechnung ihrer Kunden (z.B. Überweisung an ausländische Bank) tätig werden. Privatanleger machen nur einen vernachlässigbaren Teil des Devisenhandels aus, indem sie beispielsweise auf einem Fremdwährungskonto, auch Devisenkonto genannt, auf Wechselkursgewinne spekulieren oder Geldanlagen in fremden Währungen gegen Devisenschwankungen absichern."
            }
        case AssetGroup.Comm:
            return {
                header: "Rohstoffe",
                text: "Die Welt der Rohstoffe ist vielseitig. Sie werden physisch am sogenannten Kassamarkt oder als Derivate (bspw. Futures, Zertifikate, Optionsscheine) an den Finanzmärkten gehandelt. Die Rohstoffe werden dabei häufig in zwei große Kategorien unterteilt: harte und weiche Rohstoffe. Zu den harten Rohstoffen gehören Metalle oder Energieträger, die abgebaut oder gewonnen werden müssen, wie Gold, Uran oder Öl, während weiche Rohstoffe landwirtschaftliche Erzeugnisse oder Vieh sind, wie Weizen, Zucker oder Schweinefleisch. Um an Märkten gehandelt zu werden, muss ein Rohstoff in seiner Beschaffenheit austauschbar mit einem anderen Kontingent desselben Rohstoffes sein. Privatanleger wird der direkte Zugang zu Rohstoffmärkten oft mit zusätzlichen Hürden erschwert. Über Rohstoffaktien von Unternehmen, die sich mit der kompletten Wertschöpfungskette vom reinen Rohstoff bis zum verarbeiteten Produkt beschäftigen, oder Rohstoff-ETFs lässt sich auch indirekt in die alternative Anlageklasse investieren,"
            }
        case AssetGroup.Bond:
            return {
                text: "Anleihen sind von einem Schuldner ausgegebene verzinsliche Wertpapiere, die dem Gläubiger das Recht auf Rückzahlung sowie auf Zahlung der vereinbarten Zinsen einräumen. Anleihen werden auch Bonds oder Obligationen genannt. Je nach Emittent der Anleihe wird folgendermaßen unterschieden: Unternehmensanleihen sind Schuldverschreibungen des jeweiligen Unternehmens, bei Staatsanleihen fungiert der Staat als Schuldner und Pfandbriefe sind von Pfandbriefbanken ausgegebene Anleihen, die zusätzlich durch Grundpfandrechte gesichert sin. Allgemeinen gelten Anleihen als konservativere Anlagen im Vergleich zu Aktien, da sie geringeren Kursschwankungen unterliegen, typischerweise regelmäßige Anleihezinsen ausschütten, am Ende ihrer Laufzeit der vollständige Anlagebetrag zurückgezahlt wird und falls es doch zur Insolvenz des Emittenten kommt, der Anleihegläubiger vorrangig vor Aktionären behandelt wird. Anleihen werden an der Börse gehandelt, aber nicht in einer Währung, sondern in Prozent. Der Anleihemarkt ist sehr liquide, aktiv und etwa doppelt so groß wie der Aktienmarkt. Die größten Anleiherisiken sind das Ausfallrisiko, das von der Bonität des Schuldners abhängt, und das Zinsänderungsrisiko, da der Marktzins Einfluss auf den Kurs der Anleihe hat. Die Bonität einzelner Unternehmen und Anleihen bemessen Ratingagenturen wie Moody’s, Standard & Poor’s sowie Fitch.",
                header: "Anleihen"
            }
        default:
            return {
                text: '',
                header: ''
            }
    }
}

export type technicalIndicatorType = {
    id: number
    name: string
    value: string
}

export const indicators: technicalIndicatorType[] = [
    {
        id: 0, value: "", name: 'Bitte auswählen'
    },
    {
        id: 1, name: "Acceleration Bands", value: "abands"
    },
    {
        id: 2, name: "Bollinger Bands", value: "bb"
    },
    {
        id: 3, name: "DEMA (Double Exponential Moving Average)", value: "dema"
    },
    {
        id: 4, name: "EMA (Exponential Moving Average)", value: "ema"
    },
    // {
    //     id: 5, name: "Ichimoku Kinko Hyo", value: "ikh"
    // },
    // {
    //     id: 6, name: "Keltner Channels", value: "keltnerchannels"
    // },
    {
        id: 7, name: "Linear Regression", value: "linearRegression"
    },
    {
        id: 8, name: "Pivot Points", value: "pivotpoints"
    },
    {
        id: 9, name: "Price Channel", value: "pc"
    },
    {
        id: 10, name: "Price Envelopes", value: "priceenvelopes"
    },
    // {
    //     id: 11, name: "PSAR (Parabolic SAR)", value: "psar"
    // },
    {
        id: 12, name: "SMA (Simple Moving Average)", value: "sma"
    },
    {
        id: 13, name: "Super Trend", value: "supertrend"
    },
    {
        id: 14, name: "TEMA (Triple Exponential Moving Average)", value: "tema"
    },
    {
        id: 17, name: "VWAP (Volume Weighted Average Price)", value: "wma"
    },
    {
        id: 18, name: "Zig Zag", value: "zigzag"
    },
]

export const oscillators: technicalIndicatorType[] = [
    {
      id: 0, value: "", name: 'Bitte auswählen'
    },
    {
        id: 1, name: "Absolute price indicator", value: "apo"
    },
    {
        id: 2, name: "A/D (Accumulation/Distribution)", value: "ad"
    },
    {
        id: 3, name: "Aroon", value: "aroon"
    },
    {
        id: 4, name: "Aroon oscillator", value: "aroonoscillator"
    },
    {
        id: 5, name: "ATR (Average True Range)", value: "atr"
    },
    {
        id: 6, name: "Awesome oscillator", value: "ao"
    },
    {
        id: 7, name: "CCI (Commodity Channel Index)", value: "cci"
    },
    {
        id: 8, name: "Chaikin", value: "chaikin"
    },
    {
        id: 9, name: "CMF (Chaikin Money Flow)", value: "cmf"
    },
    {
        id: 13, name: "Detrended price", value: "dpo"
    },
    {
        id: 14, name: "Linear Regression Angle", value: "linearRegressionAngle"
    },
    {
        id: 15, name: "Linear Regression Intercept", value: "linearRegressionIntercept"
    },
    {
        id: 16, name: "Linear Regression Slope", value: "linearRegressionSlope"
    },
    {
        id: 18, name: "MACD (Moving Average Convergence Divergence)", value: "macd"
    },
    {
        id: 19, name: "MFI (Money Flow Index)", value: "mfi"
    },
    {
        id: 20, name: "Momentum", value: "momentum"
    },
    // {
    //     id: 21, name: "NATR (Normalized Average True Range)", value: "natr"
    // },
    {
        id: 23, name: "Percentage Price oscillator", value: "ppo"
    },
    {
        id: 24, name: "RoC (Rate of Change)", value: "roc"
    },
    {
        id: 25, name: "RSI (Relative Strength Index)", value: "rsi"
    },
    {
        id: 26, name: "Slow Stochastic", value: "slowstochastic"
    },
    {
        id: 27, name: "Stochastic", value: "stochastic"
    },
    {
        id: 28, name: "TRIX", value: "trix"
    },
    {
        id: 29, name: "Williams %R", value: "williamsr"
    },
]

export function switchTopsFlopsIVW(seoTag: string | null | undefined) {
    switch (seoTag) {
        case "TecDAX-Performance-Index":
            return "tp_tecDax"
        case "DAX-Deutscher-Aktienindex":
            return "tp_dax"
        case "SDAX-Performance-Index":
            return "tp_sdax"
        case "MDAX-Performance-Index":
            return "tp_mdax"
        case "ATX-Austrian-Traded-EUR-Preis-Index":
            return "tp_atx"
        case "EURO-STOXX-50-EUR-Price-Index":
            return "tp_euro_stoxx"
        case "Dow-Jones-30-Index":
            return "tp_dow_jones"
        case "NASDAQ-100-Index":
            return "tp_nasdaq"
        case "NIKKEI-225-Index":
            return "tp_nikkie"
        case "Hang-Seng-Index":
            return "tp_hang_sang"
        case "DE000A2BLGY6":
            return "tp_scale_all"
        default:
            return ""
    }
}

export const SECTIONS = ["kurse","chart-analyse", "technische-kennzahlen", "fundamantale-kennzahlen", "rating", "unternehmensprofil", "guv", "bilanz", "analysen"];

export type rangeSelectorBtn = {
    id: number
    text: string
    scope: ChartScope
}

export const CHART_TOOLS_RANGESELECTOR_BUTTONS: rangeSelectorBtn[] = [
    {
        id: 1,
        text: '1T',
        scope: ChartScope.Intraday
    },
    {
        id: 2,
        text: '1W',
        scope: ChartScope.Week
    },
    {
        id: 3,
        text: '1M',
        scope: ChartScope.Month
    },
    {
        id: 4,
        text: '3M',
        scope: ChartScope.ThreeMonth
    },
    {
        id: 5,
        text: '6M',
        scope: ChartScope.SixMonth
    },
    {
        id: 6,
        text: '1J',
        scope: ChartScope.Year
    },
    {
        id: 7,
        text: '3J',
        scope: ChartScope.ThreeYear
    },
    {
        id: 8,
        text: '5J',
        scope: ChartScope.FiveYear
    },
    {
        id: 9,
        text: '10J',
        scope: ChartScope.TenYear
    },
]

export enum STOCKCHANGE_TYPE {
    POSITIVE = 'POSITIVE',
    NEGATIVE = 'NEGATIVE'
}

export interface UpdateStateProps {
   rate : number  | null | undefined ,
   when : string | null
}
export interface StickInstrumentsState {
    previousValue: number | null | undefined
    currentValue: number | null | undefined
    toggle: boolean
    change: STOCKCHANGE_TYPE | null
    updatedAt : string |  null |  undefined
    data : UpdateStickyInstrumentSubscription | null | undefined
}

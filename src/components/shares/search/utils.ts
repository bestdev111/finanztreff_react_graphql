import {Instrument, Period} from "../../../generated/graphql";
import {numberFormatDecimals, shortNumberFormat} from "../../../utils";
import {tableHeaderType} from "./tables/shareTableHeaders";
import {OptionItem} from "../../common/SearchCard/FilterDropdownItem";

export const DEFAULT_SHARE_OPTION_ID: string = 'NULL';
export const DEFAULT_SHARE_OPTION: ShareRegionOption = {
    id: DEFAULT_SHARE_OPTION_ID, name: 'Alle',
    value: null
} as ShareRegionOption

export interface ShareRegionOption extends OptionItem {
    value: string | null;
}

export enum CardResults {
    marketCap = "marketCap",
    updatingShares = "updatingShares",
    updatingSales = "updatingSales",
    compRisingDividend = "compRisingDividend",
    stocksRisingDividend = "stocksRisingDividend",
    compChangingDividend = "compChangingDividend",
    compIncrDividend = "compIncrDividend",
    sharesRisingDividend = "sharesRisingDividend",
    risingDivAndCashflow = "risingDivAndCashflow",
    sharesUpdatingAnnually = "sharesUpdatingAnnually",
    sharesUpdatingAnnually3Years = "sharesUpdatingAnnually3Years",
    stocksTurnover = "stocksTurnover",
    dividendPayoutRatio = "dividendPayoutRatio"
}

function calculateDividendPayoutPercent(payout: number | null | undefined) {
    if (payout) return numberFormatDecimals(payout * 100, 2, 2);
    else return '-';
}

export function mapShareSearchRow(instrument: Instrument, queryRegionId: any, regions: any) {
    let marketCap = shortNumberFormat(instrument.group?.refMarketCapitalization?.value);
    let dividendYield = instrument?.group?.company?.performance?.items[0]?.dividendYieldAverage;
    let dividendChange = numberFormatDecimals(instrument?.group?.company?.performance?.keyFigures?.dividendPerShare) + ' ' + instrument?.group?.company?.currency?.displayCode
    let divYield = numberFormatDecimals(instrument?.group?.company?.performance?.keyFigures?.dividendYield,2,2);
    let dividendPayoutRatio = calculateDividendPayoutPercent(instrument?.group?.company?.performance?.keyFigures?.dividendPayoutRatio);
    let salesPerEmployee = numberFormatDecimals(instrument?.group?.company?.performance?.keyFigures?.salesPerEmployee, 2,2);
    let dividendPerShare = numberFormatDecimals(instrument?.group?.company?.performance?.keyFigures?.dividendPerShare, 2,2);
    let dividendYieldAverage = numberFormatDecimals(instrument?.group?.company?.performance?.items[0]?.dividendYieldAverage, 2,2)
    let salesValue = numberFormatDecimals(instrument?.group?.company?.performance?.keyFigures?.sales)
    let salesPerEmployeeChangePercent = instrument?.group?.company?.performance?.items[0]?.salesPerEmployeeChangePercent;
    let dividendChangePercent = instrument?.group?.company?.performance?.items[0]?.dividendChangePercent;
    let year5CashflowChangePercent = instrument?.group?.company?.performance?.items[4]?.cashFlowChangePercent;
    let year5SalesChangePercent = instrument?.group?.company?.performance?.items[4]?.salesChangePercent;
    let year5NetIncomeChangePercent = instrument?.group?.company?.performance?.items[4]?.netIncomeChangePercent;
    let year3CashflowChangePercent = instrument?.group?.company?.performance?.items[2]?.cashFlowChangePercent;
    let year3SalesChangePercent = instrument?.group?.company?.performance?.items[2]?.salesChangePercent;
    let year3NetIncomeChangePercent = instrument?.group?.company?.performance?.items[2]?.netIncomeChangePercent;

    return {
        bezeichnung: instrument.name,
        exchangeCode: instrument.exchange?.code,
        kurs: numberFormatDecimals(instrument.snapQuote?.lastPrice,2,2),
        seoTag: instrument.group.seoTag,
        securityCategoryId: instrument.group.assetGroup,
        marketCapitalization: marketCap,
        marketCapCurrencyCode: instrument?.group?.refMarketCapitalization?.currency?.displayCode,
        region: !queryRegionId ? instrument.group?.refCountry?.name : regions.filter((region: { id: number; }) => region.id === queryRegionId).map((region: { name: string; }) => region.name),
        percentChange: instrument.snapQuote?.quote?.percentChange,
        name: instrument?.name,
        groupId: instrument?.group?.id,
        id: instrument?.id,
        displayCode: instrument?.currency?.displayCode,
        salesCurrencyCode: instrument?.group?.company?.currency?.displayCode,
        salesYear1: numberFormatDecimals(instrument?.group?.company?.performance?.keyFigures?.sales,2,2),
        netIncomeYear1: numberFormatDecimals(instrument?.group?.company?.performance?.keyFigures?.netIncome,2,2),
        cashFlowYear1: numberFormatDecimals(instrument?.group?.company?.performance?.keyFigures?.operatingCashFlow,2,2),
        cashflowPercentageChange: instrument?.group?.company?.performance?.items[0]?.cashFlowChangePercent,
        salesPercentChange: instrument?.group?.company?.performance?.items[0]?.salesChangePercent,
        netIncomePercentChange: instrument?.group?.company?.performance?.items[0]?.netIncomeChangePercent,
        companyCurrencyDisplayCode: instrument?.group?.company?.currency?.displayCode,
        sector: instrument.group.sector?.name,
        dividendYield: numberFormatDecimals(dividendYield, 2, 2),
        dividendChange,
        divYield,
        dividendPayoutRatio,
        salesPerEmployee,
        dividendPerShare,
        dividendYieldAverage,
        salesValue,
        salesPerEmployeeChangePercent,
        dividendChangePercent,
        year3CashflowChangePercent,
        year3NetIncomeChangePercent,
        year5CashflowChangePercent,
        year5NetIncomeChangePercent,
        year5SalesChangePercent,
        year3SalesChangePercent
    } as ResultRowProps;
}


export interface ResultRowProps {
    bezeichnung: string;
    kurs: string;
    region: string;
    percentChange: any;
    securityCategoryId: string
    marketCapitalization: string
    seoTag: string
    exchangeCode: string
    name: string
    id: number
    groupId: number,
    displayCode: string
    salesYear1: string
    netIncomeYear1: string
    cashFlowYear1: string
    sales: number | null
    salesCurrencyCode: string
    marketCapCurrencyCode: string,
    cashflowPercentageChange?: any
    salesPercentChange?: any
    netIncomePercentChange?: any
    companyCurrencyDisplayCode?: string
    dividendYield?: string
    dividendChange?: string
    sector?: string,
    divYield: string
    salesPerEmployee?: string
    dividendPayoutRatio?: string
    dividendPerShare?: string
    dividendYieldAverage?: string
    salesValue?: string
    salesPerEmployeeChangePercent?: string
    dividendChangePercent?: string
    cardResult: any
    tableHeaders?: tableHeaderType[]
    criteria?: any
    newPeriod?: any
    year5CashflowChangePercent?: any
    year5SalesChangePercent?: any
    year5NetIncomeChangePercent?: any
    year3CashflowChangePercent?: any
    year3SalesChangePercent?: any
    year3NetIncomeChangePercent?: any
}

export const filterHeaders = (tableHeaders: tableHeaderType[] | undefined, criteria: any, cardResult: string = "") => {
    if(tableHeaders) {
        if (cardResult === CardResults.risingDivAndCashflow){
            return tableHeaders;
        }
        if (criteria?.trends?.length === 1){
            let newHeaders: tableHeaderType[] = [];
            for (let i = 0; i<5; i++){
                newHeaders.push(tableHeaders[i]);
            }
            let filtered: tableHeaderType[] =  tableHeaders.filter((header: tableHeaderType) => header?.criteria === criteria?.trends[0].keyFigure);
            return newHeaders.concat(filtered);
        }
        if (criteria?.trends?.length > 1){
            let newHeaders: tableHeaderType[] = [];
            for (let i = 0; i<5; i++){
                newHeaders.push(tableHeaders[i]);
            }
            let filtered: tableHeaderType[] =  tableHeaders.filter((header: tableHeaderType) => header?.criteria === criteria?.trends[1].keyFigure);
            return newHeaders.concat(filtered);
        }
        return tableHeaders;
    }
}

export const isColumnVisible = (dataIndex: string | undefined, tableHeaders: tableHeaderType[] | undefined): boolean => {
    if (tableHeaders) {
        return tableHeaders.filter((item: tableHeaderType) => dataIndex === item.dataIndex).length > 0;
    }
    return false;
};

export function calculatePeriod(period: Period | null | undefined): string {
    if (period === Period.Last_1Year) return '12 Monate'
    if (period === Period.Last_3Years) return '3 Jahre'
    if (period === Period.Last_5Years) return '5 Jahre'
    return '10 Jahre'
}

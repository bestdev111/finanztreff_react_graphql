import {ShareSearchKeyFigure, ShareSortField} from "../../../../generated/graphql";

export type tableHeaderType = {
    id: number,
    name: any,
    className: string,
    width?: any,
    dataIndex?: string
    canSort: boolean
    criteria?: ShareSearchKeyFigure
    sortOption?: ShareSortField
}

export const commonHeaderElements: tableHeaderType[] = [
    {
        id: 0, // mobile
        name: 'Bezeichnung \n Kurs',
        className: 'text-left d-none d-xl-none d-lg-table-cell d-md-table-cell d-sm-table-cell',
        width: '50px',
        canSort: false

    },
    {
        id: 1,
        name: 'Bezeichnung', // desktop
        className: 'text-left d-none d-xl-table-cell',
        width: '250px',
        canSort: false
    },
    {
        id: 3,
        name: 'Kurs', // desktop
        className: 'text-center d-none d-xl-table-cell',
        width: '145px',
        canSort: false
    },
    {
        id: 4,
        name: 'Region',
        className: 'text-left d-none d-lg-table-cell d-xl-table-cell',
        width: '100px',
        canSort: false
    },
    {
        id: 5,
        name: 'Branchen',
        className: 'text-left d-none d-lg-table-cell d-xl-table-cell d-md-table-cell d-sm-none',
        width: '80px',
        canSort: false
    },
]

export const marketCapCardTableHeader: tableHeaderType[] = [
    ...commonHeaderElements,
    {
        id: 6,
        name: 'Marktkapitalisierung', // desktop
        className: 'text-right d-xl-block  d-sm-none',
        dataIndex: 'marketCap',
        canSort: true,
        sortOption: ShareSortField.MarketCapitalization
    },
    {
        id: 7,
        name: 'Marktkap', // tab
        className: 'text-center d-xl-none d-md-block d-sm-none mx-md-auto ',
        dataIndex: 'marketCap',
        canSort: true,
        sortOption: ShareSortField.MarketCapitalization
    },
    {
        id: 8,
        name: 'Marktkap', // mobile
        className: 'text-left mt-sm-4 d-xl-none d-sm-block d-md-none ',
        dataIndex: 'marketCap',
        canSort: true,
        sortOption: ShareSortField.MarketCapitalization
    }
]

export const cashflowProfitSalesCardTableHeader: tableHeaderType[] = [
    ...commonHeaderElements,
    {
        id: 6,
        name: 'Cashflow in Mio',
        className: 'text-center',
        width: '250px',
        dataIndex: 'cashflow',
        canSort: true,
        criteria: ShareSearchKeyFigure.CashFlowChangePercent,
        sortOption: ShareSortField.CashFlowChangePercent
    },
    {
        id: 7,
        name: 'Gewinn in Mio',
        className: 'text-center',
        width: '250px',
        dataIndex: 'netIncome',
        canSort: true,
        criteria: ShareSearchKeyFigure.NetIncomeChangePercent,
        sortOption: ShareSortField.NetIncomeChangePercent
    },
    {
        id: 8,
        name: 'Umsatz in Mio',
        className: 'text-center text-truncate',
        width: '250px',
        dataIndex: 'sales',
        canSort: true,
        criteria: ShareSearchKeyFigure.SalesChangePercent,
        sortOption: ShareSortField.SalesChangePercent
    },
]

export const regionSalesPeriodTableHeader: tableHeaderType[] = [
    ...commonHeaderElements,
    {
        id: 6,
        name: 'Ums. in Mio',
        className: 'text-center text-truncate',
        width: '250px',
        dataIndex: "sales",
        criteria: ShareSearchKeyFigure.SalesChangePercent,
        canSort: true,
        sortOption: ShareSortField.SalesChangePercent
    },
    {
        id: 7,
        name: 'Periode',
        className: 'text-left d-xl-table-cell d-none',
        width: '250px',
        canSort: false,
        criteria: ShareSearchKeyFigure.SalesChangePercent,
    }

]

export const regionYieldPeriodTableHeader: tableHeaderType[] = [
    ...commonHeaderElements,
    {
        id: 6,
        name: 'Div. Rend.',
        className: 'text-left pl-0 pl-md-2',
        width: '250px',
        canSort: true,
        criteria: ShareSearchKeyFigure.DividendYield,
        sortOption: ShareSortField.DividendYield
    },
    {
        id: 7,
        name: 'Periode',
        className: 'text-left d-md-table-cell d-none',
        width: '250px',
        dataIndex: 'period',
        canSort: false,
        criteria: ShareSearchKeyFigure.DividendYield
    }
]

export const regionDividendPeriodTableHeader: tableHeaderType[] = [
    ...commonHeaderElements,
    {
        id: 6,
        name: 'Akt. Div.',
        className: 'text-center text-truncate',
        width: '120px',
        canSort: true,
        criteria: ShareSearchKeyFigure.DividendChangePercent,
        sortOption: ShareSortField.DividendChangePercent
    },
    {
        id: 7,
        name: 'Periode',
        className: 'text-left d-xl-table-cell d-none',
        width: '250px',
        canSort: false,
        criteria: ShareSearchKeyFigure.DividendChangePercent
    }
]

export const regionDividendCashflowTableHeader: tableHeaderType[] = [
    ...commonHeaderElements,
    {
        id: 6,
        name: 'Dividende',
        className: 'text-left',
        width: '250px',
        canSort: false,
        criteria: ShareSearchKeyFigure.DividendChangePercent
    },
    {
        id: 7,
        name: 'Cashflow',
        className: 'text-center d-xl-table-cell d-none',
        width: '250px',
        dataIndex: 'cashflow',
        canSort: true,
        criteria: ShareSearchKeyFigure.CashFlowChangePercent,
        sortOption: ShareSortField.CashFlowChangePercent
    },
]

export const regionCashflowTableHeader: tableHeaderType[] = [
    ...commonHeaderElements,
    {
        id: 6,
        name: 'Cashflow',
        className: 'text-left',
        width: '250px',
        canSort: true,
        sortOption: ShareSortField.CashFlowChangePercent
    },
    {
        id: 7,
        name: 'Umsatz',
        className: 'text-left',
        width: '250px',
        canSort: true,
        sortOption: ShareSortField.SalesChangePercent
    },
    {
        id: 8,
        name: 'Gewinn',
        className: 'text-left',
        width: '250px',
        canSort: true,
        sortOption: ShareSortField.NetIncomeChangePercent
    },
]

export const regionProSalesTableHeader: tableHeaderType[] = [
    ...commonHeaderElements,
    {
        id: 6,
        name: 'Umsatz pro MA',
        className: 'text-center px-0 px-xl-2',
        width: '250px',
        canSort: true,
        criteria: ShareSearchKeyFigure.SalesPerEmployeeChangePercent,
        sortOption: ShareSortField.SalesPerEmployeeChangePercent
    },
    {
        id: 7,
        name: 'Periode',
        className: 'text-left d-xl-table-cell d-none',
        width: '250px',
        canSort: false,
        criteria: ShareSearchKeyFigure.SalesPerEmployeeChangePercent
    }
]

export const regionPayoutTableHeader: tableHeaderType[] = [
    ...commonHeaderElements,
    {
        id: 6,
        name: 'Ausschüttungsquote',
        className: 'text-left',
        width: '250px',
        canSort: true,
        sortOption: ShareSortField.DividendPayoutRatio
    },
    {
        id: 7,
        name: 'Div. Rend.',
        className: 'text-left d-md-table-cell d-none',
        width: '250px',
        canSort: true,
        sortOption: ShareSortField.DividendYield
    }
]

export const regionShortenedDividendPeriod: tableHeaderType[] = [
    ...commonHeaderElements,
    {
        id: 6,
        name: 'Akt. Div.',
        className: 'text-center',
        width: '250px',
        canSort: true,
        criteria: ShareSearchKeyFigure.DividendChangePercent,
        sortOption: ShareSortField.DividendChangePercent
    },
    {
        id: 7,
        name: 'Periode',
        className: 'text-left d-xl-table-cell d-none',
        width: '250px',
        canSort: false,
        criteria: ShareSearchKeyFigure.DividendChangePercent,
    }
]

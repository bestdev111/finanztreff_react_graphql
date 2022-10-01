export type derivativeTable = {
    id: number,
    name: string,
    classNameValue?: string,
}

export type DerivativeTableSortColumns = {
    columName: string;
    fieldName: string;
}

export const DERIVATIVE_TABLE_SORT_COLUMNS: DerivativeTableSortColumns[] = [
    {columName: 'Hebel', fieldName: 'GEARING'},
    {columName: 'Basispreis', fieldName: 'STRIKE'},
    {columName: 'OS Wert', fieldName: 'MONEYNESS'},
    {columName: 'Strike', fieldName: 'STRIKE'},
    {columName: 'Fälligkeit', fieldName: 'MATURITY_DATE'},
    {columName: 'Cap', fieldName: 'CAP'},
    {columName: 'SL', fieldName: 'KNOCK_OUT'},
    {columName: 'Barriere unten', fieldName: 'KNOCK_OUT_LOWER_BARRIER'},
    {columName: 'Barriere oben', fieldName: 'KNOCK_OUT_UPPER_BARRIER'},
    {columName: 'Max Rend p.a.', fieldName: 'MAX_RETURN_ANNUAL'},
    {columName: 'SW Rend p.a.', fieldName: 'SIDEWAYS_RETURN_ANNUAL'},
    {columName: 'Performance', fieldName: 'PERFORMANCE_MONTH1'},
    {columName: 'B.Level', fieldName: 'BONUS_LEVEL'},
    {columName: 'Barriere', fieldName: 'BONUS_BARRIER'},
    {columName: 'B.Puffer', fieldName: 'BONUS_BUFFER_ABSOLUTE'},
    {columName: 'B.Rend %', fieldName: 'BONUS_RETURN_ANNUAL'},
    {columName: 'Aufgeld p.a.', fieldName: 'PREMIUM_ANNUAL'},
    {columName: 'Discount', fieldName: 'DISCOUNT_ABSOLUTE'},
    {columName: 'Performance (1M)', fieldName: 'PERFORMANCE_MONTH1'},
]

// OS
export const derivativeClassicWarrantResultTable: Array<derivativeTable> = [
    {
        id: 0,
        name: '',
        classNameValue: '',
    },
    {
        id: 1,
        name: 'WKN',
        classNameValue: '',
    },
    // {
    //     id: 20,
    //     name: 'Typ',
    //     classNameValue: 'd-xl-none d-md-table-cell d-none'
    // },
    {
        id: 2,
        name: 'Hebel',
        classNameValue: 'text-right px-0 d-none d-md-table-cell',
    },
    {
        id: 3,
        name: 'Basispreis',
        classNameValue: 'text-right pr-xl-1 d-md-table-cell d-none',
    },
    {
        id: 20,
        name: 'Hebel',
        classNameValue: 'text-right px-0 d-table-cell d-md-none',
    },
    {
        id: 4,
        name: 'OS Wert',
        classNameValue: 'd-xl-table-cell d-lg-table-cell d-sm-none text-right',
    },
    {
        id: 5,
        name: 'Fälligkeit',
        classNameValue: 'text-right d-xl-table-cell d-none pr-xl-3'
    },
    {
        id: 6,
        name: 'Emittent',
        classNameValue: 'd-xl-table-cell d-none'
    },
    {
        id: 8,
        name: 'Bid',
        classNameValue: 'text-right'
    },
    {
        id: 9,
        name: 'Ask',
        classNameValue: 'text-right text-lg-center text-xl-right'
    },
    {
        id: 11,
        name: 'Zeit',
        classNameValue: 'text-center px-0 d-none d-xl-table-cell'
    }
];

export const derivativeDiscountWarrantTable: Array<derivativeTable> = [
    {
        id: 100,
        name: '',
        classNameValue: '',
    },
    {
        id: 0,
        name: 'WKN',
        classNameValue: ''
    },
    {
        id: 1,
        name: 'Höchstbetrag',
        classNameValue: 'd-md-table-cell d-none text-right'
    },
    {
        id: 2,
        name: "Betrag",
        classNameValue: "d-md-none d-table-cell"
    },
    {
        id: 3,
        name: 'Basispreis',
        classNameValue: 'd-md-table-cell d-none text-right'
    },
    {
        id: 4,
        name: 'Cap',
        classNameValue: 'd-md-table-cell d-none text-right'
    },
    {
        id: 5,
        name: 'Diff. Cap',
        classNameValue: 'd-xl-table-cell d-none text-right'
    },
    {
        id: 6,
        name: 'Fälligkeit',
        classNameValue: 'd-xl-table-cell d-none'
    },
    {
        id: 7,
        name: 'Emittent',
        classNameValue: 'd-xl-table-cell d-none'
    },
    {
        id: 8,
        name: 'Bid',
        classNameValue: 'text-right'
    },
    {
        id: 9,
        name: 'Ask',
        classNameValue: 'text-right'
    },
    {
        id: 10,
        name: 'Zeit',
        classNameValue: 'd-xl-table-cell d-none text-right'
    },
]


export const derivativeDownOutputWarrantTable: Array<derivativeTable> = [
    {
        id: 100,
        name: '',
        classNameValue: '',
    },
    {
        id: 0,
        name: 'WKN',
        classNameValue: ''
    },
    {
        id: 1,
        name: "Typ",
        classNameValue: "d-table-cell"
    },
    {
        id: 2,
        name: "Barriere",
        classNameValue: "d-table-cell"
    },
    {
        id: 3,
        name: "Max.Rückzahlung",
        classNameValue: "d-table-cell"
    },
    {
        id: 4,
        name: 'Höchstbetrag',
        classNameValue: 'd-md-table-cell text-right'
    },
    {
        id: 4,
        name: 'Fälligkeit',
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 5,
        name: 'Emittent',
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 7,
        name: 'Bid',
        classNameValue: "text-right"
    },
    {
        id: 8,
        name: 'Ask',
        classNameValue: "text-right"
    },
    {
        id: 9,
        name: 'Zeit',
        classNameValue: "d-xl-table-cell d-none"
    },
]

export const derivativeStayWarrantTable: Array<derivativeTable> = [
    {
        id: 100,
        name: '',
        classNameValue: '',
    },
    {
        id: 0,
        name: 'WKN',
        classNameValue: ""
    },
    {
        id: 4,
        name: 'Fälligkeit',
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 5,
        name: 'Emittent',
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 7,
        name: 'Bid',
        classNameValue: "text-right"
    },
    {
        id: 8,
        name: 'Ask',
        classNameValue: "text-right"
    },
    {
        id: 9,
        name: 'Zeit',
        classNameValue: "d-xl-table-cell d-none"
    },
]

export const derivativeInlineWarrantTable: Array<derivativeTable> = [
    {
        id: 0,
        name: '',
        classNameValue: '',
    },
    {
        id: 1,
        name: 'WKN',
        classNameValue: ""
    },
    {
        id: 1,
        name: 'Barriere unten',
        classNameValue: "d-md-table-cell d-none text-right"
    },
    {
        id: 1,
        name: 'Barriere oben',
        classNameValue: "d-md-table-cell d-none text-right"
    },
    {
        id: 1,
        name: 'Seitwärtsertrag %',
        classNameValue: "d-md-table-cell d-none text-right"
    },
    {
        id: 1,
        name: 'Fälligkeit',
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 1,
        name: 'Emittent',
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 1,
        name: 'H.Betrag',
        classNameValue: "d-md-none d-table-cell px-0"
    },
    {
        id: 1,
        name: 'Bid',
        classNameValue: "text-right"
    },
    {
        id: 1,
        name: 'Ask',
        classNameValue: "text-right"
    },
    {
        id: 1,
        name: 'Zeit',
        classNameValue: "d-xl-table-cell d-none"
    },
]

// KO
export const derivativeKOResultTable: Array<derivativeTable> = [
    {
        id: 0,
        name: '',
        classNameValue: '',
    },
    {
        id: 1,
        name: 'WKN',
        classNameValue: '',
    },
    {
        id: 2,
        name: 'Typ',
        classNameValue: 'text-center d-md-table-cell d-none px-0 px-md-1'
    },
    {
        id: 2,
        name: 'Hebel',
        classNameValue: 'text-right px-0 px-md-1 d-none d-md-table-cell'
    },
    {
        id: 3,
        name: 'Strike',
        classNameValue: 'text-right pr-xl-1 d-none d-md-table-cell'
    },
    {
        id: 20,
        name: 'Hebel',
        classNameValue: 'text-right px-0 px-md-1 d-table-cell d-md-none'
    },
    {
        id: 5,
        name: 'SL',
        classNameValue: 'd-xl-table-cell d-lg-table-cell d-sm-none text-right'
    },
    {
        id: 6,
        name: 'Diff. SL',
        classNameValue: 'text-right d-xl-table-cell d-none pr-xl-2'
    },
    {
        id: 13,
        name: 'Fälligkeit',
        classNameValue: 'd-xl-table-cell d-none'
    },
    {
        id: 8,
        name: 'Emittent',
        classNameValue: 'd-xl-table-cell px-0 px-md-3 pr-xl-2 d-none text-right'
    },
    {
        id: 9,
        name: 'Bid',
        classNameValue: 'text-right'
    },
    {
        id: 10,
        name: 'Ask',
        classNameValue: 'text-right pl-xl-4'
    },
    {
        id: 12,
        name: 'Zeit',
        classNameValue: 'text-right d-none d-xl-table-cell'
    }
];

// CERT - Discount
export const discountResultTable: Array<derivativeTable> = [
    {
        id: 0,
        name: "WKN",
        classNameValue: ""
    },
    {
        id: 1,
        name: "Typ",
        classNameValue: "d-md-table-cell d-none"
    },
    {
        id: 2,
        name: "Cap",
        classNameValue: "d-md-table-cell"
    },
    {
        id: 3,
        name: "Discount",
        classNameValue: "d-md-table-cell d-none"
    },
    {
        id: 4,
        name: "Max Rend p.a.",
        classNameValue: "d-md-table-cell d-none"
    },
    {
        id: 5,
        name: "SW Rend p.a.",
        classNameValue: "d-xl-table-cell d-md-none d-none"
    },
    {
        id: 6,
        name: "Fälligkeit",
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 7,
        name: "Emittent",
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 8,
        name: "Bid",
        classNameValue: "text-right"
    },
    {
        id: 9,
        name: "Ask",
        classNameValue: "text-right"
    },
    {
        id: 10,
        name: "Zeit",
        classNameValue: "d-xl-table-cell d-none"
    },
]

export const discountSonstigeResultTable: Array<derivativeTable> = [
    {
        id: 1,
        name: 'WKN',
        classNameValue: '',
    },
    {
        id: 2,
        name: 'Typ',
        classNameValue: '',
    },
    {
        id: 3,
        name: 'Performance (1M)',
        classNameValue: 'd-md-table-cell text-right d-none',
    },
    {
        id: 4,
        name: 'Fälligkeit',
        classNameValue: 'd-md-table-cell d-none',
    },
    {
        id: 5,
        name: 'Emittent',
        classNameValue: 'd-md-table-cell d-none',
    },
    {
        id: 6,
        name: 'Bid',
        classNameValue: '',
    },
    {
        id: 7,
        name: 'Ask',
        classNameValue: '',
    },
    {
        id: 8,
        name: 'Zeit',
        classNameValue: 'd-xl-table-cell d-none',
    },
]

// CERT (FAKTOR)
export const factorResultTable: Array<derivativeTable> = [
    {
        id: 0,
        name: '',
        classNameValue: ''
    },
    {
        id: 1,
        name: 'WKN',
        classNameValue: 'd-md-table-cell d-none'
    },
    {
        id: 2,
        name: 'Hebel',
        classNameValue: 'px-0 text-right'
    },
    {
        id: 3,
        name: 'Akt. Basispreis',
        classNameValue: 'd-md-table-cell d-none text-right'
    },
    {
        id: 4,
        name: 'Akt. Barriere',
        classNameValue: 'd-md-table-cell d-none'
    },
    {
        id: 5,
        name: 'Fälligkeit',
        classNameValue: 'd-md-table-cell d-none'
    },
    {
        id: 6,
        name: 'Emittent',
        classNameValue: 'd-xl-table-cell d-none'
    },
    {
        id: 7,
        name: 'Bid',
        classNameValue: 'text-right'
    },
    {
        id: 8,
        name: 'Ask',
        classNameValue: 'text-right'
    },
    {
        id: 9,
        name: 'Zeit',
        classNameValue: 'text-right d-xl-table-cell d-none'
    },
]

// CERT - Bonus - Classic  3
export const bonusClassicResultTable: Array<derivativeTable> = [
    {
        id: 0,
        name: 'WKN',
        classNameValue: ''
    },
    {
        id: 1,
        name: 'Typ',
        classNameValue: 'd-md-table-cell d-none'
    },
    {
        id: 2,
        name: 'B.Level',
        classNameValue: 'text-right pr-xl-1 d-md-table-cell d-none',
    },
    {
        id: 3,
        name: 'Barriere',
        classNameValue: 'd-md-table-cell d-none'
    },
    {
        id: 4,
        name: 'B.Puffer',
        classNameValue: 'd-xl-table-cell d-none'
    },
    {
        id: 5,
        name: 'B.Rend',
        classNameValue: 'px-0'
    },
    {
        id: 6,
        name: 'Aufgeld p.a.',
        classNameValue: 'd-xl-table-cell d-none text-right'
    },
    {
        id: 7,
        name: '!',
        classNameValue: 'd-xl-table-cell d-none'
    },
    {
        id: 8,
        name: 'Fälligkeit',
        classNameValue: 'd-xl-table-cell d-none'
    },
    {
        id: 9,
        name: 'Emittent',
        classNameValue: 'd-xl-table-cell d-none'
    },
    {
        id: 10,
        name: 'Bid',
        classNameValue: 'text-right'
    },
    {
        id: 11,
        name: 'Ask',
        classNameValue: 'text-right'
    },
    {
        id: 12,
        name: 'Zeit',
        classNameValue: 'd-xl-table-cell d-none'
    },
]

// CERT - Bonus - Reverse and reverse Cap
export const bonusReverseCapResultTable: Array<derivativeTable> = [
    {
        id: 0,
        name: 'WKN',
        classNameValue: ''
    },
    {
        id: 1,
        name: 'Typ',
        classNameValue: 'd-md-table-cell d-none'
    },
    {
        id: 2,
        name: 'B.Level',
        classNameValue: 'text-right pr-xl-1 d-md-table-cell d-none',
    },
    {
        id: 3,
        name: 'Barriere',
        classNameValue: 'd-md-table-cell d-none'
    },
    {
        id: 4,
        name: 'B.Puffer ',
        classNameValue: 'd-xl-table-cell d-none'
    },
    {
        id: 5,
        name: 'B.Rend',
        classNameValue: 'px-0'
    },
    {
        id: 6,
        name: 'Aufgeld p.a.',
        classNameValue: 'd-xl-table-cell d-none'
    },
    {
        id: 7,
        name: '!',
        classNameValue: 'd-xl-table-cell d-none'
    },
    {
        id: 8,
        name: 'Fälligkeit',
        classNameValue: 'd-xl-table-cell d-none'
    },
    {
        id: 9,
        name: 'Emittent',
        classNameValue: 'd-xl-table-cell d-none'
    },
    {
        id: 10,
        name: 'Bid',
        classNameValue: 'text-right'
    },
    {
        id: 11,
        name: 'Ask',
        classNameValue: 'text-right'
    },
    {
        id: 12,
        name: 'Zeit',
        classNameValue: 'd-xl-table-cell d-none'
    },
]

// CERT - Express
export const expressResultTable: Array<derivativeTable> = [
    {
        id: 0,
        name: "WKN",
        classNameValue: ""
    },
    {
        id: 1,
        name: "Typ",
        classNameValue: "d-md-table-cell d-none"
    },
    {
        id: 2,
        name: "Auszahlungslevel",
        classNameValue: "d-xl-table-cell d-none text-right"
    },
    {
        id: 3,
        name: "Performance (1M)",
        classNameValue: "d-md-table-cell d-none text-right"
    },
    {
        id: 4,
        name: "Zins",
        classNameValue: "d-xl-table-cell d-none text-right"
    },
    {
        id: 6,
        name: "Fälligkeit",
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 7,
        name: "Emittent",
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 8,
        name: "Bid",
        classNameValue: "text-right"
    },
    {
        id: 9,
        name: "Ask",
        classNameValue: "text-right px-0 px-md-2"
    },
    {
        id: 10,
        name: "Zeit",
        classNameValue: "d-xl-table-cell d-none"
    },
]

// CERT - Reverse Convertible Bonds
export const reverseConvertibleBondsResultTable: Array<derivativeTable> = [
    {
        id: 0,
        name: "WKN",
        classNameValue: ""
    },
    {
        id: 1,
        name: "Typ",
        classNameValue: "d-md-table-cell d-none"
    },
    {
        id: 2,
        name: "Basispreis",
        classNameValue: "d-md-table-cell d-none text-right"
    },
    {
        id: 3,
        name: "Zins p.a.",
        classNameValue: "d-md-table-cell d-none text-right"
    },
    {
        id: 4,
        name: "Max Rend p.a.",
        classNameValue: "px-0 text-right"
    },
    {
        id: 5,
        name: "SW Rend p.a.",
        classNameValue: "d-xl-table-cell d-none text-right"
    },
    {
        id: 6,
        name: "Fälligkeit",
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 7,
        name: "Emittent",
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 8,
        name: "Bid",
        classNameValue: "text-right"
    },
    {
        id: 9,
        name: "Ask",
        classNameValue: "text-right"
    },
    {
        id: 10,
        name: "Zeit",
        classNameValue: "text-right d-xl-table-cell d-none"
    },
]

export const revOtherConvertibleBondsResultTable: Array<derivativeTable> = [
    {
        id: 0,
        name: "WKN",
        classNameValue: ""
    },
    {
        id: 1,
        name: "Typ",
        classNameValue: ""
    },
    {
        id: 2,
        name: "Performance (1M)",
        classNameValue: "d-md-table-cell text-right d-none"
    },
    {
        id: 3,
        name: "Fälligkeit",
        classNameValue: "d-md-table-cell d-none"
    },
    {
        id: 4,
        name: "Emittent",
        classNameValue: "d-md-table-cell d-none"
    },
    {
        id: 5,
        name: "Bid",
        classNameValue: "text-right"
    },
    {
        id: 6,
        name: "Ask",
        classNameValue: "text-right"
    },
    {
        id: 7,
        name: "Zeit",
        classNameValue: "d-xl-table-cell d-none"
    },
]

// CERT - Sonstige
export const otherResultTable: Array<derivativeTable> = [
    {
        id: 0,
        name: "WKN",
        classNameValue: ""
    },
    {
        id: 1,
        name: "Typ",
        classNameValue: ""
    },
    {
        id: 2,
        name: "Performance (1M)",
        classNameValue: "d-md-table-cell text-right d-none"
    },
    {
        id: 3,
        name: "BV",
        classNameValue: "d-md-table-cell d-none"
    },
    {
        id: 4,
        name: "Fälligkeit",
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 5,
        name: "Emittent",
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 6,
        name: "Bid",
        classNameValue: "text-right"
    },
    {
        id: 7,
        name: "Ask",
        classNameValue: "text-right"
    },
    {
        id: 8,
        name: "Zeit",
        classNameValue: "d-xl-table-cell d-none"
    },
]

// CERT - Capital
export const capitalResultTable: Array<derivativeTable> = [
    {
        id: 0,
        name: "WKN",
        classNameValue: ""
    },
    {
        id: 1,
        name: "Typ",
        classNameValue: ""
    },
    {
        id: 2,
        name: "Performance (1M)",
        classNameValue: "d-none text-right d-md-table-cell"
    },
    {
        id: 3,
        name: "Man. Gebühr",
        classNameValue: "d-none d-md-table-cell text-right"
    },
    {
        id: 4,
        name: "Fälligkeit",
        classNameValue: "d-xl-table-cell d-none text-right"
    },
    {
        id: 5,
        name: "Emittent",
        classNameValue: "d-md-table-cell d-none"
    },
    {
        id: 6,
        name: "Bid",
        classNameValue: "text-right"
    },
    {
        id: 7,
        name: "Ask",
        classNameValue: "text-right"
    },
    {
        id: 8,
        name: "Zeit",
        classNameValue: "d-xl-table-cell d-none text-center"
    },
]

// CERT - Outperf./Sprint
export const outperformanceResultTable: Array<derivativeTable> = [
    {
        id: 0,
        name: "WKN",
        classNameValue: ""
    },
    {
        id: 1,
        name: "Typ",
        classNameValue: ""
    },
    {
        id: 2,
        name: "Performance (1M)",
        classNameValue: "d-none text-right d-md-table-cell"
    },
    {
        id: 3,
        name: "Aufgeld p.a.",
        classNameValue: "d-none d-md-table-cell text-right"
    },
    {
        id: 4,
        name: "Akt. Erstattung",
        classNameValue: "d-none d-md-table-cell text-right"
    },
    {
        id: 5,
        name: "Fälligkeit",
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 6,
        name: "Emittent",
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 7,
        name: "Bid",
        classNameValue: "text-right"
    },
    {
        id: 8,
        name: "Ask",
        classNameValue: "text-right"
    },
    {
        id: 9,
        name: "Zeit",
        classNameValue: "d-xl-table-cell d-none text-center"
    },
]

export const sprintResultTable: Array<derivativeTable> = [
    {
        id: 0,
        name: "WKN",
        classNameValue: ""
    },
    {
        id: 1,
        name: "Typ",
        classNameValue: "px-0"
    },
    {
        id: 2,
        name: "Performance (1M)",
        classNameValue: "d-none text-right d-md-table-cell"
    },
    {
        id: 3,
        name: "Aufgeld p.a.",
        classNameValue: "d-none d-md-table-cell text-right"
    },
    {
        id: 4,
        name: "Akt. Erstattung",
        classNameValue: "d-none d-md-table-cell"
    },
    {
        id: 5,
        name: "Fälligkeit",
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 6,
        name: "Emittent",
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 7,
        name: "Bid",
        classNameValue: "text-right"
    },
    {
        id: 8,
        name: "Ask",
        classNameValue: "text-right"
    },
    {
        id: 9,
        name: "Zeit",
        classNameValue: "d-xl-table-cell d-none text-center"
    },
]

// CERT-INDEX
export const indexResultTable: Array<derivativeTable> = [
    {
        id: 0,
        name: "WKN",
        classNameValue: ""
    },
    {
        id: 1,
        name: "Typ",
        classNameValue: ""
    },
    {
        id: 2,
        name: "Performance (1M)",
        classNameValue: "d-none d-md-table-cell text-right"
    },
    {
        id: 3,
        name: "Man. Gebühr",
        classNameValue: "d-none d-md-table-cell text-nowrap text-right"
    },
    {
        id: 4,
        name: "Fälligkeit",
        classNameValue: "d-xl-table-cell d-none"
    },
    {
        id: 5,
        name: "Emittent",
        classNameValue: "d-md-table-cell d-none"
    },
    {
        id: 6,
        name: "Bid",
        classNameValue: "text-right pr-0"
    },
    {
        id: 7,
        name: "Ask",
        classNameValue: "text-right pr-0"
    },
    {
        id: 8,
        name: "Zeit",
        classNameValue: "d-xl-table-cell d-none text-center"
    },
]

export const indexSonstigeTable: Array<derivativeTable> = [
    {
        id: 0,
        name: "WKN",
        classNameValue: ""
    },
    {
        id: 1,
        name: "Typ",
        classNameValue: ""
    },
    {
        id: 2,
        name: "Performance (1M)",
        classNameValue: "d-none d-md-table-cell text-right"
    },
    {
        id: 3,
        name: "Fälligkeit",
        classNameValue: "d-md-table-cell d-none"
    },
    {
        id: 4,
        name: "Emittent",
        classNameValue: "d-md-table-cell d-none"
    },
    {
        id: 5,
        name: "Bid",
        classNameValue: "text-right pr-0"
    },
    {
        id: 6,
        name: "Ask",
        classNameValue: "text-right pr-0"
    },
    {
        id: 7,
        name: "Zeit",
        classNameValue: "d-md-table-cell d-none text-center"
    },
]


export const indexBasketResultTable: Array<derivativeTable> = [
    {
        id: 1,
        name: 'WKN',
        classNameValue: '',
    },
    {
        id: 2,
        name: 'Typ',
        classNameValue: '',
    },
    {
        id: 3,
        name: 'Performance (1M)',
        classNameValue: 'd-md-table-cell d-none text-right',
    },
    {
        id: 4,
        name: 'Fälligkeit',
        classNameValue: 'd-md-table-cell d-none',
    },
    {
        id: 5,
        name: 'Emittent',
        classNameValue: 'd-md-table-cell d-none',
    },
    {
        id: 6,
        name: 'Bid',
        classNameValue: '',
    },
    {
        id: 7,
        name: 'Ask',
        classNameValue: '',
    },
    {
        id: 8,
        name: 'Zeit',
        classNameValue: 'd-xl-table-cell d-none',
    },
]

export const indexBonusResultTable: Array<derivativeTable> = [
    {
        id: 1,
        name: 'WKN',
        classNameValue: '',
    },
    {
        id: 2,
        name: 'Typ',
        classNameValue: 'd-table-cell d-none',
    },
    {
        id: 3,
        name: 'B.Level',
        classNameValue: 'text-right pr-xl-1 d-md-table-cell d-none',
    },
    {
        id: 4,
        name: 'Barriere',
        classNameValue: 'd-md-table-cell d-none text-right',
    },
    {
        id: 5,
        name: 'B.Puffer',
        classNameValue: 'd-xl-table-cell d-none',
    },
    {
        id: 6,
        name: 'B.Rend%',
        classNameValue: 'd-md-table-cell d-none text-right',
    },
    {
        id: 7,
        name: 'Aufgeld p.a.',
        classNameValue: 'd-xl-table-cell d-none text-right',
    },
    {
        id: 8,
        name: '!',
        classNameValue: 'd-xl-table-cell d-none',
    },
    {
        id: 9,
        name: 'Fälligkeit',
        classNameValue: 'd-xl-table-cell d-none',
    },
    {
        id: 10,
        name: 'Emittent',
        classNameValue: 'd-xl-table-cell d-none',
    },
    {
        id: 11,
        name: 'Bid',
        classNameValue: '',
    },
    {
        id: 12,
        name: 'Ask',
        classNameValue: '',
    },
    {
        id: 13,
        name: 'Zeit',
        classNameValue: 'd-xl-table-cell d-none',
    },
]

export const sonstigeBonusResultTable: Array<derivativeTable> = [
    {
        id: 1,
        name: 'WKN',
        classNameValue: '',
    },
    {
        id: 2,
        name: 'Typ',
        classNameValue: '',
    },
    {
        id: 3,
        name: 'Performance (1M)',
        classNameValue: 'd-md-table-cell d-none text-right',
    },
    // {
    //     id: 4,
    //     name: 'Quanto',
    //     classNameValue: 'd-md-table-cell d-none',
    // },
    {
        id: 5,
        name: 'Fälligkeit',
        classNameValue: 'd-md-table-cell d-none',
    },
    {
        id: 6,
        name: 'Emittent',
        classNameValue: 'd-md-table-cell d-none',
    },
    {
        id: 7,
        name: 'Bid',
        classNameValue: '',
    },
    {
        id: 8,
        name: 'Ask',
        classNameValue: '',
    },
    {
        id: 9,
        name: 'Zeit',
        classNameValue: 'd-xl-table-cell d-none',
    },
]


export const sonstigeTable: Array<derivativeTable> = [
    {
        id: 0,
        name: "WKN",
        classNameValue: ""
    },
    {
        id: 1,
        name: "Typ",
        classNameValue: ""
    },
    {
        id: 2,
        name: "Performance (1M)",
        classNameValue: "d-none d-md-table-cell text-right"
    },
    {
        id: 3,
        name: "BV",
        classNameValue: "d-none d-md-table-cell"
    },
    {
        id: 4,
        name: "Fälligkeit",
        classNameValue: "d-xl-table-cell d-none text-center"
    },
    {
        id: 5,
        name: "Emittent",
        classNameValue: "d-md-table-cell d-none"
    },
    {
        id: 6,
        name: "Bid",
        classNameValue: "text-right pr-0"
    },
    {
        id: 7,
        name: "Ask",
        classNameValue: "text-right pr-0"
    },
    {
        id: 8,
        name: "Zeit",
        classNameValue: "d-xl-table-cell d-none text-center"
    },
]

import {
    AssetClass,
    AssetGroup,
    AssetType, AssetTypeGroup,
    DerivativeOptionType,
    Instrument,
    Issuer
} from "../../../../generated/graphql";



export interface FilterPeriod {
    from: any;
    to: any;
}

export interface FilterNumberPeriod extends FilterPeriod {
    from: number | null;
    to: number | null;
}

export interface FilterVonBisBasePeriod {
    period: FilterNumberPeriod;
    basis: "relativ" | "absolut";
}

export interface DerivativeFilter {
    callPut: 'CALL' | 'PUT' | undefined;
    leverage: FilterNumberPeriod;
    diffSL: FilterNumberPeriod;
    hitSchwelle: FilterVonBisBasePeriod;
    oben: FilterVonBisBasePeriod;
    unten: FilterVonBisBasePeriod;
    bonusLevel: FilterVonBisBasePeriod;
    barriere: FilterVonBisBasePeriod;
    stopLoss: FilterVonBisBasePeriod;
    basisprise: FilterVonBisBasePeriod;
    osWert: FilterNumberPeriod;
    cap: FilterVonBisBasePeriod;
    runningTime: FilterPeriod;
    issuers: any[];
    maturityDate: FilterPeriod;
    typ: string;
    zyns: string;
    maxRendite: string;
    bonusRendite: string;
    bonusBarrierGebrochen: string;
    bonusQuanto: string;
    bonusAufgeld: string;
    bonusPuffer: string;
    outprefAufgeld: string;
    discount: string;
    swRendite: string;
    performance: FilterNumberPeriod;
    partizipation: string;
    banusLevelBariere: FilterVonBisBasePeriod;
    assetTypeId: string|null;
    sort: {field: string, descending: boolean} | null;
}


export function emptyDerivativeFilter(
    optionType: DerivativeOptionType | null | undefined = null,
    leverageFrom: number | null | undefined = null,
    leverageTo: number | null | undefined = null,
    issuerId: number | null | undefined = null,
    issuerName: string | null | undefined = null,
):
    DerivativeFilter {
    const df = {
        callPut: optionType,
        leverage: {
            from: leverageFrom, to: leverageTo
        },
        diffSL: {
            from: null, to: null
        },
        hitSchwelle: {
            period: {from: null, to: null},
            basis: 'absolut'
        },
        oben: {
            period: {from: null, to: null},
            basis: 'absolut'
        },
        unten: {
            period: {from: null, to: null},
            basis: 'absolut'
        },
        bonusLevel: {
            period: {from: null, to: null},
            basis: 'absolut'
        },
        barriere: {
            period: {from: null, to: null},
            basis: 'absolut'
        },
        stopLoss: {
            period: {from: null, to: null},
            basis: 'absolut'
        },
        basisprise: {
            period: {from: null, to: null},
            basis: "absolut"
        },
        osWert: {from: null, to: null},
        cap: {
            period: {from: null, to: null},
            basis: "absolut"
        },
        runningTime: {
            from: null, to: null
        },
        issuers: issuerId ? [{id: issuerId, name: issuerName} as Issuer] : [],
        maturityDate: {
            from: null, to: null
        },
        performance: {
            from: null, to: null
        },
        sort: null
    } as DerivativeFilter;

    return  df;
}

export interface DerivativeSearchConfig {
    underlying: Instrument | null | undefined;
    selectedInstrument: Instrument | null | undefined;
    assetClass: AssetClass | null | undefined;
    assetGroup: AssetGroup | null | undefined;
    assetTypeGroup: AssetTypeGroup | null | undefined;
}
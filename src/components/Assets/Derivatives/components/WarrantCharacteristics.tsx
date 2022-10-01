import {Button, Col, Collapse, Row} from "react-bootstrap";
import React, {useEffect, useRef, useState} from "react";
import SvgImage from "../../../common/image/SvgImage";
import {
    extractQuotes,
    formatDate,
    formatKeyFigureValue, formatPrice,
    keyFigureType, numberFormat,
    numberFormatDecimals,
} from "../../../../utils";
import {
    AssetGroup,
    AssetType,
    CalculationPeriod, DerivativeInstrumentKeyFigures, DerivativeOptionType,
    InstrumentGroup,
    InstrumentGroupUnderlying,
    Quote,
    QuoteType, SnapQuote
} from "../../../../generated/graphql";
import {
    bonusTypMapping, capitalTypMapping,
    discountTypMapping,
    expressTypMapping, factorTypeMapping, indexTypMapping, KOTypMapping, revConvertibleTypMapping
} from "../../../derivative/search/table-body/common/DerivativeTypeMapping";
import {formatMoneyness} from "../../../derivative/search/DerivativeSearchResult";
import moment from "moment";
import {
    getBasisprice, getDerivativeKeyFiguresValueWithCurr,
    getDerivativeKeyFiguresValueWithPerc, getKurs, getUnderlyingValueValueWithCurr
} from "../../CertificatesPage/WarrantCharacteristicsContainer";
import WarrantCharacteristicsItem from "../../CertificatesPage/WarrantCharacteristicsItem";

interface WarrantCharacteristicsProps {
    title: string;
    assetGroup: AssetGroup;
    groupId?: any;
    keyFigure?: any;
    assetType?: string | null | undefined;
    assetTypeObject?: AssetType | null | undefined;
    typeName?: string | undefined | null;
    instrument?: InstrumentGroup;
    kurs?: number | null | undefined;
}



export const getUnderlyingsCurrency = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (underlyings && underlyings.length > 0) ?
        underlyings[0].instrument?.currency?.displayCode || underlyings[0].currency?.displayCode : '';
}

export const getUnderlyingsBasisprise = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (underlyings && underlyings.length > 0) ?
        numberFormat(underlyings[0].strike, ' ' + getUnderlyingsCurrency(underlyings)) : '--';
}

export const getZins = (groupId: any) => {
    return formatKeyFigureValue(groupId?.interestRateInformation?.interestRate, 2, 2, '%')
}

export const getMaxAnnualReturn = (derivativeKeyFigures: DerivativeInstrumentKeyFigures|null|undefined,
                                   underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (derivativeKeyFigures?.maxAnnualReturn) ? numberFormat(derivativeKeyFigures.maxAnnualReturn, '%') : '--';
}

export const getSidewaysAnnualReturn = (derivativeKeyFigures: DerivativeInstrumentKeyFigures|null|undefined) => {
    return (derivativeKeyFigures?.sidewaysAnnualReturn) ? numberFormat(derivativeKeyFigures.sidewaysAnnualReturn, ' %') : '--';
}

export const getBonusBufferPerc = (derivativeKeyFigures: DerivativeInstrumentKeyFigures|null|undefined) => {
    return (derivativeKeyFigures?.bonusBuffer) ? numberFormat(derivativeKeyFigures.bonusBuffer, ' %') : '--';
}

export const getBonusBufferAbs = (derivativeKeyFigures: DerivativeInstrumentKeyFigures|null|undefined) => {
    return (derivativeKeyFigures?.bonusBufferAbsolute) ? numberFormat(derivativeKeyFigures.bonusBufferAbsolute, ' ') : '--';
}

export const getBonusLevel = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return underlyings?.length === 1 ?
        formatKeyFigureValue(underlyings[0].bonusBarrier, 2, 2,
            ' ' + getUnderlyingsCurrency(underlyings)) : "-"
}

export const getSecurity = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return underlyings?.length === 1 ?
        formatKeyFigureValue(underlyings[0].security, 2, 2,
            ' ' + getUnderlyingsCurrency(underlyings)) : "-"
}

export const getPremiumAbsolute = (derivativeKeyFigures: DerivativeInstrumentKeyFigures|null|undefined,
                                   underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (derivativeKeyFigures?.premiumAbsolute) ?
        numberFormat(derivativeKeyFigures.premiumAbsolute, ' ' + getUnderlyingsCurrency(underlyings)) : '--';
}

export const getPremiumAnnual = (derivativeKeyFigures: DerivativeInstrumentKeyFigures|null|undefined,
                                   underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (derivativeKeyFigures?.premiumAnnual) ?
        numberFormat(derivativeKeyFigures.premiumAnnual, ' ' + getUnderlyingsCurrency(underlyings)) : '--';
}

export const getDiscount = (derivativeKeyFigures: DerivativeInstrumentKeyFigures|null|undefined) => {
    return (derivativeKeyFigures?.discountAbsolute) ? numberFormat(derivativeKeyFigures.discountAbsolute, '%') : '--';
}

export const getCap = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (underlyings && underlyings.length > 0) ?
        numberFormat(underlyings[0].cap, ' ' + getUnderlyingsCurrency(underlyings)) : '--';
}

export const getMaxReturnAbsolute = (derivativeKeyFigures: DerivativeInstrumentKeyFigures|null|undefined,
                                     underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (derivativeKeyFigures?.maxReturnAbsolute) ?
        numberFormat(derivativeKeyFigures.maxReturnAbsolute, ' ' + getUnderlyingsCurrency(underlyings)): '--';
}

export const calcAbstandBarriereAbs = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined, kurs: number | null | undefined) => {
    if(underlyings && underlyings.length > 0) {
        const value = underlyings[0].knockIn;
        if(value && kurs && kurs > 0) {
            return numberFormat(value - kurs, ' ' + getUnderlyingsCurrency(underlyings));
        }
    }
    return  '--'
}

export const calcAbstandBarriereRel = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined, kurs: number | null | undefined) => {
    if(underlyings && underlyings.length > 0) {
        const value = underlyings[0].knockIn;
        if(value && kurs && kurs > 0) {
            return numberFormat((value - kurs) / kurs, '%');
        }
    }
    return  '--'
}

export const calcAbstandOutBarriereAbs = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined, kurs: number | null | undefined) => {
    if(underlyings && underlyings.length > 0) {
        const value = underlyings[0].knockOut;
        if(value && kurs && kurs > 0) {
            return numberFormat(value - kurs, ' ' + getUnderlyingsCurrency(underlyings));
        }
    }
    return  '--'
}

export const calcAbstandOutBarriereRel = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined, kurs: number | null | undefined) => {
    if(underlyings && underlyings.length > 0) {
        const value = underlyings[0].knockOut;
        if(value && kurs && kurs > 0) {
            return numberFormat((value - kurs) / kurs, '%');
        }
    }
    return  '--'
}

export const calcAbstandCapAbs = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined, kurs: number | null | undefined) => {
    if(underlyings && underlyings.length > 0) {
        const cap = underlyings[0].cap;
        if(cap && kurs && kurs > 0) {
            return numberFormat(cap - kurs, ' ' + getUnderlyingsCurrency(underlyings));
        }
    }
    return  '--'
}

export const calcAbstandCapRel = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined, kurs: number | null | undefined) => {
    if(underlyings && underlyings.length > 0) {
        const cap = underlyings[0].cap;
        if(cap && kurs && kurs > 0) {
            return numberFormat((cap - kurs) / kurs * 100, '%');
        }
    }
    return  '--'
}

export const calcAbstandBasispreisAbs = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined, kurs: number | null | undefined) => {
    if(underlyings && underlyings.length > 0) {
        const strike = underlyings[0].strike;
        if(strike && kurs && kurs > 0) {
            return numberFormat(strike - kurs, ' ' + getUnderlyingsCurrency(underlyings));
        }
    }
    return  '--'
}

export const calcAbstandBasispreisRel = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined, kurs: number | null | undefined) => {
    if(underlyings && underlyings.length > 0) {
        const strike = underlyings[0].strike;
        if(strike && kurs && kurs > 0) {
            return numberFormat((strike - kurs) / kurs * 100, '%');
        }
    }
    return  '--'
}

export function calcSpreadAbs(snapQuote: SnapQuote|null|undefined, underlyings: Array<InstrumentGroupUnderlying>|null|undefined, assetGroup?: AssetGroup | null) {
    if(snapQuote && snapQuote.quotes.length > 0) {
        const q = extractQuotes(snapQuote);
        if(q.ask?.value && q.bid?.value) {
            return formatPrice((q.ask.value - q.bid.value), assetGroup, snapQuote?.quote?.value, getUnderlyingsCurrency(underlyings))
        }
    }
    return '--';
}

export function calcSpreadRel(snapQuote: SnapQuote|null|undefined, underlyings: Array<InstrumentGroupUnderlying>|null|undefined) {
    if(snapQuote && snapQuote.quotes.length > 0) {
        const q = extractQuotes(snapQuote);
        if(q.ask?.value && q.bid?.value) {
            return formatPrice((q.ask.value - q.bid.value) / q.bid.value * 100,null, snapQuote?.quote?.value, '%');
        }
    }
    return '--';
}

export function calcAbstUntergrenzeAbs(underlyings: Array<InstrumentGroupUnderlying>|null|undefined, kurs: number | null | undefined) {
    if(underlyings && underlyings.length > 0) {
        const value = underlyings[0].knockOutLower;
        if(value && kurs && kurs > 0) {
            return numberFormat(value - kurs, ' ' + getUnderlyingsCurrency(underlyings));
        }
    }
    return  '--'
}

export function calcAbstUntergrenzeRel(underlyings: Array<InstrumentGroupUnderlying>|null|undefined, kurs: number | null | undefined) {
    if (underlyings && underlyings.length > 0) {
        const value = underlyings[0].knockOutLower;
        if (value && kurs && kurs > 0) {
            return numberFormat((value - kurs) / kurs * 100, '%');
        }
    }
    return '--'
}

export function calcAbstObergrenzeAbs(underlyings: Array<InstrumentGroupUnderlying>|null|undefined, kurs: number | null | undefined) {
    if(underlyings && underlyings.length > 0) {
        const value = underlyings[0].knockOutUpper;
        if(value && kurs && kurs > 0) {
            return numberFormat(value - kurs, ' ' + getUnderlyingsCurrency(underlyings));
        }
    }
    return  '--'
}

export function calcAbstObergrenzeRel(underlyings: Array<InstrumentGroupUnderlying>|null|undefined, kurs: number | null | undefined) {
    if(underlyings && underlyings.length > 0) {
        const value = underlyings[0].knockOutUpper;
        if(value && kurs && kurs > 0) {
            return numberFormat((value - kurs) / kurs * 100, '%');
        }
    }
    return  '--'
}
export function calcDiffStopLossBarriereAbs(underlyings: Array<InstrumentGroupUnderlying>|null|undefined, kurs: number | null | undefined) {
    if(underlyings && underlyings.length > 0) {
        const value = underlyings[0].knockOut;
        if(value && kurs && kurs > 0) {
            return numberFormat(value - kurs, ' ' + getUnderlyingsCurrency(underlyings));
        }
    }
    return  '--'
}

export function calcDiffStopLossBarriereRel(underlyings: Array<InstrumentGroupUnderlying>|null|undefined, kurs: number | null | undefined) {
    if(underlyings && underlyings.length > 0) {
        const value = underlyings[0].knockOut;
        if(value && kurs && kurs > 0) {
            return numberFormat((value - kurs) / kurs * 100, '%');
        }
    }
    return  '--'
}

export function calcBonusPufferRel(bonusPufferAbs: number | null | undefined, kurs: number | null | undefined) {
    return bonusPufferAbs && kurs ? numberFormat(bonusPufferAbs / kurs * 100, '%') : '--'
}

export function getFalligkeit(group: InstrumentGroup) {
    return group?.main?.lastTradingDay ? formatDate(group.main.lastTradingDay) : (
            group?.derivative?.maturityDate ? formatDate(group?.derivative?.maturityDate) : 'Open end'
    )
}

export function WarrantCharacteristics(props: WarrantCharacteristicsProps) {
    const [optionTypeColor, setOptionTypeColor] = useState<string | undefined>()
    const [knockOptionType, setKnockOptionType] = useState<string | undefined | null>()
    const group = props.groupId;
    const instrument = props.instrument;

    const [showMore, setShowMore] = useState<boolean>(false);

    useEffect(() => {
        if (props.groupId?.derivative?.optionType === DerivativeOptionType.Call) {
            setOptionTypeColor('text-green')
        } else if (props.groupId?.derivative?.optionType === DerivativeOptionType.Put) {
            setOptionTypeColor('text-pink')
        } else {
            setOptionTypeColor('text-dark')
        }
    }, [props.groupId?.derivative?.optionType])

    useEffect(() => {
        if (props.groupId?.derivative?.optionType === DerivativeOptionType.Call) {
            setKnockOptionType('Long')
        } else if (props.groupId?.derivative?.optionType === DerivativeOptionType.Put) {
            setKnockOptionType("Short")
        } else if (!props.groupId?.derivative?.optionType) {
            setKnockOptionType('-')
        }
    }, [props.groupId?.derivative?.optionType])


    const getStrike = () => {
        return getUnderlyingsBasisprise(group?.underlyings);
    }
    const getCurrency = () => {
        return getUnderlyingsCurrency(group?.underlyings);
    }
    const _getMaxReturnAbsolute = () => {
        return getMaxReturnAbsolute(group?.main?.derivativeKeyFigures,
            group?.underlyings);
    }
    const getMaxReturn = () => {
        return getDerivativeKeyFiguresValueWithPerc(group?.main?.derivativeKeyFigures, 'maxReturn');
    }
    const getMaxRedemptionPrice = () => {
        return getDerivativeKeyFiguresValueWithCurr(group?.main?.derivativeKeyFigures, group?.underlyings,  'maxRedemptionPrice');
    }
    const getSecuredInstrument = () => {
        return (props.instrument && props.instrument.derivative?.securedInstrument) ? 'ja' : 'nein';
    }

    const getStrikeValue = function() {
        return (props.instrument?.underlyings && (props.instrument.underlyings.length > 0)) ?
            (props.instrument?.underlyings[0].strike || 0) : 0
    }

    const getCurrentPriceValue = function () {
        let value = 0;
        props.groupId?.snapQuote?.quotes?.forEach(
            (q: Quote) => {
                if(q.type === QuoteType.Trade) {
                    value = q.value || 0;
                }
            }
        )
        return value;
    }

    const getAbstandStrike = function() {
        return getCurrentPriceValue() - getStrikeValue();
    }
    const getAbstandStrikeAbs = function() {
        const as = getAbstandStrike();
        return as !== 0 ? as / getStrikeValue() : 0;
    }

    const getPerformance = function (period: CalculationPeriod) {
        return formatKeyFigureValue(props.instrument?.content?.find(
            i => i.main
        )?.performance?.find(
            p => p.period === period
        )?.performance)
    }


    function _getMaxAnnualReturn() {
        return getMaxAnnualReturn(props.instrument?.main?.derivativeKeyFigures, props.groupId?.underlying);
    }

    const knockCharacteristicsCollapse: Array<keyFigureType> = [
        {
            id: 1,
            name: 'Knock-Out-Art',
            value: KOTypMapping(props.typeName)
        },
        {
            id: 2,
            name: 'Knock-Out-Typ',
            value: knockOptionType
        },
        {
            id: 3,
            name: 'Hebel',
            value: formatKeyFigureValue(props.groupId?.main?.keyFigures?.gearing)
        },
        {
            id: 4,
            name: 'Strike',
            value: getBasisprice(props.groupId?.underlyings)
        },
        {
            id: 5,
            name: 'Stop Loss-Barriere',
            value: `${formatKeyFigureValue(props.groupId?.underlyings[0]?.knockOut)} ${props.groupId?.underlyings[0]?.currency?.displayCode}`
        },
        {
            id: 7,
            name: 'Aufgeld',
            value: `${formatKeyFigureValue(props.groupId?.main?.keyFigures?.premium)}%`,
        },
    ]

    const knockCollapseContent: Array<keyFigureType> = [
        {
            id: 61,
            name: 'Diff. zur Stop Loss-Barriere Abs',
            value: calcDiffStopLossBarriereAbs(group?.underlyings, props.kurs)
        },
        {
            id: 6,
            name: 'Diff. zur Stop Loss-Barriere Rel',
            value: calcDiffStopLossBarriereRel(group?.underlyings, props.kurs)
        },
        {
            id: 9,
            name: 'Innerer Wert',
            value: formatKeyFigureValue(props.groupId?.main?.keyFigures?.intrinsicValue),
        },
        {
            id: 10,
            name: 'Spread absolut',
            value: calcSpreadAbs(group?.main?.snapQuote, group?.underlyings, props.assetGroup)
        },
        {
            id: 11,
            name: 'Spread relativ',
            value: calcSpreadRel(group?.main?.snapQuote, group?.underlyings)
        },
        {
            id: 12,
            name: 'Bezugsverhältnis',
            value: formatKeyFigureValue(props.groupId?.underlyings[0]?.multiplier)
        },
        {
            id: 13,
            name: 'Quanto',
            value: getSecuredInstrument()
        },
    ]

    const warrCharacteristicsInlineCollapse: Array<keyFigureType> = [
        {
            id: 1,
            name: 'Optionsschein-Typ',
            value: <span className={optionTypeColor}>{props.groupId?.derivative?.optionType}</span>

        },
        {
            id: 2,
            name: 'Untergrenze',
            value: getUnderlyingValueValueWithCurr(group?.underlyings, 'knockOutLower')
        },
        {
            id: 3,
            name: 'Obergrenze',
            value: getUnderlyingValueValueWithCurr(group?.underlyings, 'knockOutUpper')
        },
        {
            id: 21,
            name: 'Bezugsverhältnis',
            value: formatKeyFigureValue(props.groupId?.underlyings[0]?.multiplier)
        },
        {
            id: 22,
            name: 'Quanto',
            value: getSecuredInstrument(),
        },
        {
            id: 6,
            name: 'Fälligkeit',
            value: getFalligkeit(group)

        }
    ]
    const warrCollapseInlineContent: Array<keyFigureType> = [
        // {
        //     id: 0,
        //     name: 'Max Rückzahlung abs',
        //     value: getMaxRedemptionPrice()
        // },
        // {
        //     id: 7,
        //     name: ' Höchstbetrag abs',
        //     value: _getMaxReturnAbsolute()
        // },
        {
            id: 8,
            name: ' Höchstbetrag rel',
            value: getMaxReturn()
        },
        {
            id: 9,
            name: 'Max.Rendite p.a.',
            value: getDerivativeKeyFiguresValueWithPerc(group?.main?.derivativeKeyFigures, 'maxAnnualReturn')
        },
        {
            id: 10,
            name: 'Seitwärtsertrag %',
            value: getDerivativeKeyFiguresValueWithPerc(group?.main?.derivativeKeyFigures, 'sidewaysReturn'),
        },
        {
            id: 101,
            name: 'Seitwärtsertrag p.a.',
            value: getDerivativeKeyFiguresValueWithPerc(group?.main?.derivativeKeyFigures, 'sidewaysAnnualReturn'),
        },
        {
            id: 11,
            name: 'Abst.Untergrenze abs',
            value: calcAbstUntergrenzeAbs(group?.underlyings, props.kurs)
        },
        {
            id: 12,
            name: 'Abst.Untergrenze rel',
            value: calcAbstUntergrenzeRel(group?.underlyings, props.kurs)
        },
        {
            id: 11,
            name: 'Abst.Obergrenze abs',
            value: calcAbstObergrenzeAbs(group?.underlyings, props.kurs)
        },
        {
            id: 12,
            name: 'Abst.Obergrenze rel',
            value: calcAbstObergrenzeRel(group?.underlyings, props.kurs)
        },
        {
            id: 18,
            name: 'Spread absolut',
            value: calcSpreadAbs(group?.main?.snapQuote, group?.underlyings, props.assetGroup)
        },
        {
            id: 20,
            name: 'Spread relativ',
            value: calcSpreadRel(group?.main?.snapQuote, group?.underlyings),
        }
    ]

    const warrCharacteristicsDiscountCollapse: Array<keyFigureType> = [
        {
            id: 1,
            name: 'Optionsschein-Typ',
            value: <span className={optionTypeColor}>{props.groupId?.derivative?.optionType}</span>

        },
        {
            id: 2,
            name: 'Strike',
            value: getStrike()
        },
        {
            id: 3,
            name: 'Cap',
            value: getCap(group?.underlyings)
        },
        {
            id: 4,
            name: 'Break Even',
            value: formatKeyFigureValue(props.groupId?.main?.keyFigures?.breakEven) + ' ' + getCurrency()
        },
        {
            id: 21,
            name: 'Bezugsverhältnis',
            value: formatKeyFigureValue(props.groupId?.underlyings[0]?.multiplier)
        },
        {
            id: 22,
            name: 'Quanto',
            value: getSecuredInstrument(),
        }
    ]
    const warrCollapseDiscountContent: Array<keyFigureType> = [
        // {
        //     id: 1,
        //     name: ' Höchstbetrag',
        //     value: _getMaxReturnAbsolute()
        // },
        // {
        //     id: 2,
        //     name: 'Max.Ertrag abs',
        //     value: getDerivativeKeyFiguresValueWithCurr(group?.main?.derivativeKeyFigures, group?.underlyings, 'maxReturnAbsolute')
        // },
        {
            id: 3,
            name: 'Max.Ertrag rel',
            value: getDerivativeKeyFiguresValueWithPerc(group?.main?.derivativeKeyFigures, 'maxReturn')
        },
        {
            id: 4,
            name: 'Max.Rendite p.a.',
            value: getDerivativeKeyFiguresValueWithPerc(group?.main?.derivativeKeyFigures, 'maxAnnualReturn')
        },
        {
            id: 5,
            name: 'Seitwärtsertrag abs',
            value: getDerivativeKeyFiguresValueWithCurr(group?.main?.derivativeKeyFigures, group?.underlyings, 'sidewaysReturn'),
        },
        {
            id: 6,
            name: 'Seitwärtsertrag p.a.',
            value: getDerivativeKeyFiguresValueWithPerc(group?.main?.derivativeKeyFigures, 'sidewaysAnnualReturn'),
        },
        {
            id: 7,
            name: 'Abst.Basispreis abs',
            value: calcAbstandBasispreisAbs(group?.underlyings, props.kurs)
        },
        {
            id: 8,
            name: 'Abst.Basispreis rel',
            value: calcAbstandBasispreisRel(group?.underlyings, props.kurs)
        },
        {
            id: 9,
            name: "Abstand Cap abs",
            value: calcAbstandCapAbs(group?.underlyings, props.kurs)
        },
        {
            id: 10,
            name: "Abstand Cap rel",
            value: calcAbstandCapRel(group?.underlyings, props.kurs)
        },
        {
            id: 11,
            name: 'Spread absolut',
            value: calcSpreadAbs(group?.main?.snapQuote, group?.underlyings, props.assetGroup)
        },
        {
            id: 12,
            name: 'Spread relativ',
            value: calcSpreadRel(group?.main?.snapQuote, group?.underlyings),
        },
        {
            id: 13,
            name: 'Fälligkeit',
            value: getFalligkeit(group)

        }
    ]

    const warrCharacteristicsCollapse: Array<keyFigureType> = [
        {
            id: 1,
            name: 'Optionsscheintyp',
            value: <span className={optionTypeColor}>{props.groupId?.derivative?.optionType}</span>

        },
        {
            id: 2,
            name: 'Basispreis',
            value: getStrike()
        },
        {
            id: 3,
            name: 'Hebel',
            value: formatKeyFigureValue(props.groupId?.main?.keyFigures?.gearing)
        },
        {
            id: 4,
            name: 'Impl. Volatilität',
            value: `${formatKeyFigureValue(props.groupId?.main?.keyFigures?.implicitVolatility)}%`
        },
        {
            id: 5,
            name: 'Break Even',
            value: formatKeyFigureValue(props.groupId?.main?.keyFigures?.breakEven) + ' ' + getCurrency()
        },
        {
            id: 6,
            name: 'Fälligkeit',
            value: getFalligkeit(group)

        }
    ]
    const warrCollapseContent: Array<keyFigureType> = [
        {
            id: 0,
            name: 'OS Wert',
            value: formatMoneyness(props.groupId?.main?.keyFigures?.moneyness)
        },
        {
            id: 7,
            name: 'Moneyness',
            value: formatKeyFigureValue(props.groupId?.main?.keyFigures?.moneyness),
        },
        {
            id: 8,
            name: 'Innerer Wert',
            value: formatKeyFigureValue(props.groupId?.main?.keyFigures?.intrinsicValue),
        },
        {
            id: 9,
            name: 'Zeitwert',
            value: formatKeyFigureValue(props.groupId?.main?.keyFigures?.timeValuePremium),
        },
        {
            id: 10,
            name: 'Omega',
            value: formatKeyFigureValue(props.groupId?.main?.keyFigures?.omega),
        },
        {
            id: 11,
            name: 'Delta',
            value: formatKeyFigureValue(props.groupId?.main?.keyFigures?.delta),
        },
        {
            id: 12,
            name: 'Gamma',
            value: formatKeyFigureValue(props.groupId?.main?.keyFigures?.gamma),
        },
        {
            id: 13,
            name: 'Theta',
            value: formatKeyFigureValue(props.groupId?.main?.keyFigures?.theta),
        },
        {
            id: 14,
            name: 'Rho',
            value: formatKeyFigureValue(props.groupId?.main?.keyFigures?.rho),
        },
        {
            id: 15,
            name: 'Vega',
            value: formatKeyFigureValue(props.groupId?.main?.keyFigures?.vega),
        },
        {
            id: 16,
            name: 'Aufgeld',
            value: formatKeyFigureValue(props.groupId?.main?.keyFigures?.premium, 2, 4, '%')
        },
        {
            id: 17,
            name: 'Aufgeld p.a',
            value: getPremiumAnnual(props.instrument?.main?.derivativeKeyFigures, props.groupId?.underlyings)
        },
        {
            id: 18,
            name: 'Spread absolut',
            value: calcSpreadAbs(group?.main?.snapQuote, group?.underlyings, props.assetGroup)
        },
        {
            id: 20,
            name: 'Spread relativ',
            value: calcSpreadRel(group?.main?.snapQuote, group?.underlyings),
        },
        {
            id: 21,
            name: 'Bezugsverhältnis',
            value: formatKeyFigureValue(props.groupId?.underlyings[0]?.multiplier)
        },
        {
            id: 22,
            name: 'Quanto',
            value: getSecuredInstrument(),
        },
        // {
        //     id: 21,
        //     name: 'Auszahlungsart',
        //     value: formatKeyFigureValue(props.groupId?.main?.derivative?.settlementType),
        // },
        // {
        //     id: 22,
        //     name: 'Restlaufziet',
        //     value: formatKeyFigureValue(props.groupId?.main?.derivative?.maturityDate),
        // },
    ]



    const displayCollapseMenu = () => {
        if (props.assetGroup === AssetGroup.Cert) {
        } else if (props.assetGroup === AssetGroup.Knock) {
            return knockCharacteristicsCollapse
        } else if (props.assetGroup === AssetGroup.Warr) {
            if((instrument?.assetType?.id || '').indexOf('INLINE') > 0) return warrCharacteristicsInlineCollapse
            if((instrument?.assetType?.id || '').indexOf('DISCOUNT') > 0) return warrCharacteristicsDiscountCollapse
            return warrCharacteristicsCollapse
        } else {
            return []
        }
    }

    const displayCollapseContent = () => {
        if (props.assetGroup === AssetGroup.Cert) {
        } else if (props.assetGroup === AssetGroup.Knock) {
            return knockCollapseContent
        } else if (props.assetGroup === AssetGroup.Warr) {
            if((instrument?.assetType?.id || '').indexOf('INLINE') > 0) return warrCollapseInlineContent
            if((instrument?.assetType?.id || '').indexOf('DISCOUNT') > 0) return warrCollapseDiscountContent
            return warrCollapseContent
        } else {
            return []
        }
    }
    
    // @ts-ignore
    return !group || !group?.main ? null :  <>
        <div className="content-wrapper wb-m col">
            <div className="d-flex justify-content-between">
                <h2 className="content-wrapper-heading font-weight-bold">{props.title}</h2>
                <div className="d-xl-flex d-md-flex d-none fnt-size-13 text-kurs-grau">
                    <span className="padding-right-5">Zeitpunkt der Berechnung:</span>
                    <span
                        className="padding-right-5"><span>{formatDate(props?.groupId?.main?.keyFigures?.update?.when)}</span>,</span>
                    <span className="padding-right-5">{props?.groupId?.main?.keyFigures?.update?.type}:</span>
                    <span>{numberFormatDecimals(props?.groupId?.main?.keyFigures?.update?.value)} {props.groupId?.main?.currency?.displayCode}</span>
                </div>
            </div>
            <div className="d-xl-none d-md-none d-block fnt-size-13 text-kurs-grau mt-n2 pb-1">
                <span className="padding-right-5">Zeitpunkt der Berechnung:</span>
                <span
                    className="padding-right-5"><span>{formatDate(props?.groupId?.main?.keyFigures?.update?.when)}</span>,</span>
                <span className="padding-right-5">{props?.groupId?.main?.keyFigures?.update?.type}:</span>
                <span>{numberFormatDecimals(props?.groupId?.main?.keyFigures?.update?.value)} {props.groupId?.main?.currency?.displayCode}</span>
            </div>

            <div className="content">
                <Row className="row-cols-xl-6 row-cols-lg-4 row-cols-sm-2 gutter-10 gutter-tablet-8">
                    {
                        // @ts-ignore
                        displayCollapseMenu()?.map((item: any) => (
                            <RowItem
                                key={item.id}
                                name={item.name}
                                value={item.value}
                            />
                        ))}
                </Row>

                {/*<div className = {!checkLength ? "d-none" : ""}>*/}
                <div>
                    <Button variant="link" className="text-decoration-none w-100 text-center"
                            onClick={() => setShowMore(!showMore)}>
                        {showMore ? 'Details Ausblenden' : 'Weitere Merkmale'}
                        <SvgImage spanClass="top-move" convert={false} width={"27"}
                                  icon="icon_direction_down_blue_light.svg"
                                  imgClass="svg-primary" className={showMore ? 'flip' : ''}/>
                    </Button>
                </div>
                <Collapse in={showMore}>
                    <div>
                        <Row
                            className="row-cols-xl-6 row-cols-lg-4 row-cols-sm-2 gutter-10 gutter-tablet-8 mb-0 mb-xl-4">
                            {displayCollapseContent()?.map((item: any) => (
                                <WarrantCharacteristicsItem
                                    key={item.id}
                                    name={item.name}
                                    value={item.value}
                                />
                            ))}
                        </Row>
                    </div>
                </Collapse>
            </div>
        </div>
    </>;
}

interface RowItemProps {
    name: React.ReactNode;
    value: React.ReactNode;
}

function RowItem(props: RowItemProps) {
    const itemNameRef = useRef(null);

    useEffect(() => {
        if(itemNameRef && itemNameRef.current) {
            // @ts-ignore
            itemNameRef.current.title = props.name;
        }
    }, [])

    if (!props.value || props.value === '-') {
        return (
            <Col>
                <div className="border border-border-gray fnt-size-14 px-1 py-1 mb-3">
                    <div className="text-truncate" ref={itemNameRef}>{props.name}</div>
                    <div className="font-weight-bold">--</div>
                </div>
            </Col>
        )
    }

    return (
        <div style={{height: "47px"}} className={"mb-sm-2 mb-md-0"}>
            <Col>
                <div className="border border-border-gray fnt-size-14 px-1 py-1 mb-3 ">
                    <div className="text-truncate" ref={itemNameRef}>{props.name}</div>
                    <div className="font-weight-bold mt-sm-n1 mt-md-0">{props.value}</div>
                </div>
            </Col>
        </div>
    );
}

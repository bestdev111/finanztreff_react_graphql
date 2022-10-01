import {
    CalculationPeriod,
    DerivativeInstrumentKeyFigures, InstrumentGroup,
    InstrumentGroupDerivative, InstrumentGroupInterestRateInformation,
    InstrumentGroupUnderlying, InstrumentPerformance, QuoteType
} from "../../../generated/graphql";
import AktienanleiheCharacteristics from "./AktienanleiheCharacteristics";
import {formatDate, formatKeyFigureValue, numberFormat, numberFormatDecimals} from "../../../utils";
import React from "react";
import moment from "moment";
import BonusCharacteristics from "./BonusCharacteristics";
import DiscountCharacteristics from "./DiscountCharacteristics";
import ExpressCharacteristics from "./ExpressCharacteristics";
import IndexCharacteristics from "./IndexCharacteristics";
import KapitalCharacteristics from "./KapitalCharacteristics";
import OutperfSprintCharacteristics from "./OutperfSprintCharacteristics";
import {getQuote, getQuoteValue} from "../../derivative/underlying/AssetMainInfo";
import FactorCharacteristics from "./FactorCharacteristics";

export interface WarrantCharacteristicsContainerProps {
    group: InstrumentGroup;
}

export default function WarrantCharacteristicsContainer({group}: WarrantCharacteristicsContainerProps ) {
    const assetClassId = group.assetClass?.id;

    // @ts-ignore
    return <>
        <div className="content-wrapper wb-m col">
            <div className="d-flex justify-content-between">
                <h2 className="content-wrapper-heading font-weight-bold">Zertifikate Merkmale</h2>
                <div className="d-xl-flex d-md-flex d-none fnt-size-13 text-kurs-grau">
                    <span className="padding-right-5">Zeitpunkt der Berechnung:</span>
                    <span
                        className="padding-right-5"><span>{formatDate(group.main?.derivativeKeyFigures?.update?.when)}</span>,</span>
                    <span className="padding-right-5">{group.main?.derivativeKeyFigures?.update?.type}:</span>
                    <span>{numberFormatDecimals(group.main?.derivativeKeyFigures?.update?.value)} {group.main?.currency?.displayCode}</span>
                </div>
            </div>
            <div className="d-xl-none d-md-none d-block fnt-size-13 text-kurs-grau mt-n2 pb-1">
                <span className="padding-right-5">Zeitpunkt der Berechnung:</span>
                <span
                    className="padding-right-5"><span>{formatDate(group.main?.derivativeKeyFigures?.update?.when)}</span>,</span>
                <span className="padding-right-5">{group.main?.derivativeKeyFigures?.update?.type}:</span>
                <span>{numberFormatDecimals(group.main?.derivativeKeyFigures?.update?.value)} {group.main?.currency?.displayCode}</span>
            </div>

        { assetClassId === 27 && <AktienanleiheCharacteristics group={group} /> }
        { assetClassId === 28 && <BonusCharacteristics group={group} /> }
        { assetClassId === 29 && <DiscountCharacteristics group={group} /> }
        { assetClassId === 30 && <ExpressCharacteristics group={group} /> }
        { assetClassId === 31 && <FactorCharacteristics group={group} /> }
        { assetClassId === 32 && <IndexCharacteristics group={group} /> }
        { assetClassId === 33 && <KapitalCharacteristics group={group} /> }
        { assetClassId === 34 && <OutperfSprintCharacteristics group={group} /> }
        </div>
    </>
}



export const getDerivativeKeyFiguresValue = (derivativeKeyFigures: DerivativeInstrumentKeyFigures|null|undefined,
                                             valueName: any) => {
    let res = NaN;
    if(derivativeKeyFigures) {
        Object.keys(derivativeKeyFigures).forEach(
            (k, idx) => {
                if (k == valueName) {
                    res = parseFloat(Object.values(derivativeKeyFigures)[idx]?.toString() || '');
                }
            }
        )
    }
    return res;
}

export const getDerivativeKeyFiguresValueWithCurr = (derivativeKeyFigures: DerivativeInstrumentKeyFigures|null|undefined,
                                   underlyings: Array<InstrumentGroupUnderlying>|null|undefined, valueName: any) => {
    let res = '--';
    const v = getDerivativeKeyFiguresValue(derivativeKeyFigures, valueName);
    if (!isNaN(v)) res = numberFormat(v, ' ' + getUnderlyingsCurrency(underlyings))
    return res;
}

export const getDerivativeKeyFiguresValueWithPerc = (derivativeKeyFigures: DerivativeInstrumentKeyFigures|null|undefined,
                                                     valueName: any) => {
    let res = '--';
    const v = getDerivativeKeyFiguresValue(derivativeKeyFigures, valueName);
    if(!isNaN(v)) res = numberFormat(v, '%')
    return res;
}

export const getUnderlyingValue = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined, valueName: any) => {
    let res = NaN;
    if(underlyings && underlyings.length > 0) {
        Object.keys(underlyings[0]).forEach(
            (k, idx) => {
                if (k === valueName) {
                    res = parseFloat(Object.values(underlyings[0])[idx]?.toString() || '');
                }
            }
        )
    }
    return res;
}

export const getUnderlyingValueValueWithCurr = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined, valueName: any) => {
    let res = getUnderlyingValue(underlyings, valueName);
    return isNaN(res) ? '--' : numberFormat(res, ' ' + getUnderlyingsCurrency(underlyings))
}

export const getUnderlyingValueValueWithPerc = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined, valueName: any) => {
    let res = getUnderlyingValue(underlyings, valueName);
    return isNaN(res) ? '--' : numberFormat(res, '%')
}



export const getUnderlyingsCurrency = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (underlyings && underlyings.length > 0) ?
        underlyings[0].instrument?.currency?.displayCode || underlyings[0].currency?.displayCode : '';
}

export const getMultiplier = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (underlyings && underlyings.length > 0) ?
        numberFormat(underlyings[0].multiplier, '') : '--';
}

export const getPartizipationsFaktor = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (underlyings && underlyings.length > 0) ?
        numberFormat(underlyings[0].participation, '') : '--';
}

export const getBasisprice = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (underlyings && underlyings.length > 0) ?
        numberFormat(underlyings[0].strike, ' ' + getUnderlyingsCurrency(underlyings)) : '--';
}

export const getCap = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (underlyings && underlyings.length > 0) ?
        numberFormat(underlyings[0].cap, ' ' + getUnderlyingsCurrency(underlyings)) : '--';
}

export const getNominalWert = (derivative: InstrumentGroupDerivative|null|undefined,
                                        underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (derivative?.nominalAmount) ? numberFormat(derivative.nominalAmount, ' ' +
        getUnderlyingsCurrency(underlyings)) : '--';
}

export const getManagementGebuhren = (derivative: InstrumentGroupDerivative|null|undefined,
                                        underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (derivative?.managementFee) ? numberFormat(derivative.managementFee, ' ' +
        getUnderlyingsCurrency(underlyings)) : '--';
}

export const getZins = (interest: InstrumentGroupInterestRateInformation|null|undefined) => {
    return (interest && interest.interestRate) ? numberFormat(interest.interestRate, '%') : '--';
}

export const getZinsTermin = (interest: InstrumentGroupInterestRateInformation|null|undefined) => {
    return (interest && interest.nextPaymentDate) ? moment(interest.nextPaymentDate).format("DD.MM.yyyy") : '--';
}

export const getZinsStage = (interest: InstrumentGroupInterestRateInformation|null|undefined) => {
    return (interest && interest.nextPaymentDate) ? moment(interest.nextPaymentDate).diff(moment(), 'days') : '--';
}

export const getQuanto = (derivative: InstrumentGroupDerivative|null|undefined) => {
    return (derivative && derivative.securedInstrument) ? 'ja' : 'nein';
}

export const getManagmentGebuhren = (derivative: InstrumentGroupDerivative|null|undefined,
                                     underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (derivative?.managementFee) ? numberFormat(derivative.managementFee, ' ' +
        getUnderlyingsCurrency(underlyings)) : '--';
}

export const getBarriereStart = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (underlyings && underlyings.length > 0) ?
        moment(underlyings[0].securityBarrierObservationStartAt).format("DD.MM.yyyy") : '--';
}

export const getBarriereAktiv = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (underlyings && underlyings.length > 0 &&
        underlyings[0].securityBarrierObservationStartAt && !underlyings[0].securityBarrierTriggeredAt
        && moment() > moment(underlyings[0].securityBarrierObservationStartAt)
    ) ? 'Aktiv(!) ' + formatDate(underlyings[0].securityBarrierObservationStartAt) :
        (underlyings && underlyings.length > 0 && underlyings[0].securityBarrierTriggeredAt ?
            'Getroffen ' + formatDate(underlyings[0].securityBarrierTriggeredAt) : '--');
}

export const getBarriereAktivSimple = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (underlyings && underlyings.length > 0 &&
        underlyings[0].securityBarrierObservationStartAt && !underlyings[0].securityBarrierTriggeredAt
        && moment() > moment(underlyings[0].securityBarrierObservationStartAt)
    ) ? 'ja' : (underlyings && underlyings.length > 0 && underlyings[0].securityBarrierTriggeredAt ? 'nein' : '--');
}

export const getBonusLevel = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (underlyings && underlyings.length > 0) ?
        numberFormat(underlyings[0].bonusBarrier, ' ' + getUnderlyingsCurrency(underlyings)) : '--';
}

export const getBarriere = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (underlyings && underlyings.length > 0) ?
        numberFormat(underlyings[0].security, ' ' + getUnderlyingsCurrency(underlyings)) : '--';
}

export const getKnockIn = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (underlyings && underlyings.length > 0) ?
        numberFormat(underlyings[0].knockIn, ' ' + getUnderlyingsCurrency(underlyings)) : '--';
}

export const getSecurityBarrierObservation = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    return (underlyings && underlyings.length > 0) ?
        (underlyings[0].securityBarrierObservationStartAt ? 'nein' : 'ja') : '--';
}

export const getPerformance = (performance: undefined | Array<InstrumentPerformance>, period: CalculationPeriod) => {
    return formatKeyFigureValue(performance?.find(p => p.period === period)?.performance, 2, 2, '%')
}

export const getKurs = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    if(underlyings && underlyings.length > 0 && underlyings[0].instrument?.snapQuote?.quotes) {
        // @ts-ignore
        const v = parseFloat(getQuoteValue(underlyings[0].instrument.snapQuote, QuoteType.Trade));
        return (isNaN(v) ? null : v);
    } else return null;
}

export const getBid = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    if(underlyings && underlyings.length > 0 && underlyings[0].instrument?.snapQuote?.quotes) {
        // @ts-ignore
        return getQuoteValue(underlyings[0].instrument.snapQuote, QuoteType.Bid);
    } else return null;
}

export const getAsk = (underlyings: Array<InstrumentGroupUnderlying>|null|undefined) => {
    if(underlyings && underlyings.length > 0 && underlyings[0].instrument?.snapQuote?.quotes) {
        // @ts-ignore
        return getQuoteValue(underlyings[0].instrument.snapQuote, QuoteType.Ask);
    } else return null;
}

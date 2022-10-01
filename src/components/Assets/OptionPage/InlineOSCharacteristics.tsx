import {InstrumentGroup} from "../../../generated/graphql";
import {keyFigureType} from "../../../utils";
import {Button, Collapse, Row} from "react-bootstrap";
import SvgImage from "../../common/image/SvgImage";
import React, {useState} from "react";
import WarrantCharacteristicsItem from "../CertificatesPage/WarrantCharacteristicsItem";
import {
    getBarriereAktiv,
    getBarriereStart,
    getBasisprice,
    getDerivativeKeyFiguresValueWithCurr,
    getDerivativeKeyFiguresValueWithPerc,
    getNominalWert,
    getQuanto,
    getZins,
    getZinsStage,
    getZinsTermin
} from "../CertificatesPage/WarrantCharacteristicsContainer";
import {calcSpreadAbs, calcSpreadRel} from "../Derivatives/components/WarrantCharacteristics";

export interface WarrantCharacteristicsContainerProps {
    group: InstrumentGroup;
}

export default function InlineOSCharacteristics({group}: WarrantCharacteristicsContainerProps) {
    const ShortItems: Array<keyFigureType> = [
        {
            id: 1,
            name: 'Typ',
            value: group.assetType?.name || '--'
        },
        {
            id: 2,
            name: 'Max. Rend p.a.',
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'maxAnnualReturn')
        },
        {
            id: 3,
            name: 'SW Rend p.a.',
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'sidewaysAnnualReturn')
        },
        {
            id: 4,
            name: 'Basispreis',
            value: getBasisprice(group.underlyings)
        },
        {
            id: 5,
            name: 'Abstand Basispreis abs',
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'deltaStrikeAbsolute')
        },
        {
            id: 6,
            name: 'Abstand Basispreis %',
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'deltaStrike')
        },
    ]

    const FullItems: Array<keyFigureType> = [
        {
            id: 1,
            name: 'Nominalwert',
            value: getNominalWert(group.derivative, group.underlyings)
        },
        {
            id: 2,
            name: 'Zins p.a.',
            value: getZins(group.interestRateInformation)
        },
        {
            id: 3,
            name: 'Zinstermin',
            value: getZinsTermin(group.interestRateInformation)
        },
        {
            id: 4,
            name: 'Zinszahlung',
            value: '???'
        },
        {
            id: 5,
            name: 'Zinstage',
            value: getZinsStage(group.interestRateInformation)
        },
        {
            id: 6,
            name: 'Stückzinsen',
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'accruedInterest')
        },
        {
            id: 7,
            name: 'Kaufpreis inkl Stückzinsen',
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'dirtyPrice')
        },
        {
            id: 8,
            name: 'Bezugsmenge',
            value: '???'
        },
        {
            id: 9,
            name: 'SW Ertrag abs',
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'sidewaysReturnAbsolute')
        },
        {
            id: 10,
            name: 'SW Ertrag %',
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'sidewaysReturn')
        },
        {
            id: 11,
            name: 'Kurstyp',
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'parity')
        },
        {
            id: 12,
            name: 'Quanto',
            value: getQuanto(group.derivative)
        },
        {
            id: 13,
            name: 'Barriere aktiv',
            value: getBarriereAktiv(group.underlyings)
        },
        {
            id: 14,
            name: 'Barriere Start',
            value: getBarriereStart(group.underlyings)
        },
        {
            id: 15,
            name: 'Spread abs',
            value: calcSpreadAbs(group?.main?.snapQuote, group.underlyings, group?.assetGroup)
        },
        {
            id: 16,
            name: 'Spread %',
            value: calcSpreadRel(group?.main?.snapQuote, group.underlyings)
        },
    ]

    const [showMore, setShowMore] = useState(false);

    return (
        <div className="content">
            <Row className="row-cols-xl-6 row-cols-lg-4 row-cols-sm-2 gutter-10 gutter-tablet-8">
                {
                    ShortItems.map((item: any) => (
                        <WarrantCharacteristicsItem
                            key={item.id}
                            name={item.name}
                            value={item.value}
                        />
                    ))}
            </Row>


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
                        {FullItems.map((item: any) => (
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
    )
}

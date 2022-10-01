import {InstrumentGroup} from "../../../generated/graphql";
import {formatDate, keyFigureType} from "../../../utils";
import {Button, Collapse, Row} from "react-bootstrap";
import SvgImage from "../../common/image/SvgImage";
import React, {useState} from "react";
import WarrantCharacteristicsItem from "./WarrantCharacteristicsItem";
import {
    getBarriere,
    getBonusLevel, getCap,
    getDerivativeKeyFiguresValueWithCurr,
    getDerivativeKeyFiguresValueWithPerc, getKurs, getMultiplier,
    getQuanto, getSecurityBarrierObservation
} from "./WarrantCharacteristicsContainer";
import {
    calcAbstandCapAbs, calcAbstandCapRel,
    calcSpreadAbs,
    calcSpreadRel, getFalligkeit,
    getSecurity,
    getSidewaysAnnualReturn
} from "../Derivatives/components/WarrantCharacteristics";

export interface WarrantCharacteristicsContainerProps {
    group: InstrumentGroup;
}

export default function BonusCharacteristics ({group}: WarrantCharacteristicsContainerProps ) {
    const ShortItems: Array<keyFigureType> = [
        {
            id: 0,
            name: 'Typ',
            value: group.assetType?.name || '--'
        },
        {
            id: 2,
            name: "Cap",
            value: getCap(group.underlyings)
        },
        {
            id: 3,
            name: "Abstand Cap abs",
            value: calcAbstandCapAbs(group?.underlyings, getKurs(group?.underlyings))
        },
        {
            id: 4,
            name: "Abstand Cap %",
            value: calcAbstandCapRel(group?.underlyings, getKurs(group?.underlyings))
        },
        {
            id: 5,
            name: "Discount abs.",
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'discountAbsolute')
        },
        {
            id: 6,
            name: "Discount %",
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'discountPercent')
        },
    ]

    const FullItems: Array<keyFigureType> = [
        {
            id: 7,
            name: "Max. Rückzahlung",
            value: getCap(group.underlyings)
        },
        {
            id: 8,
            name: "Max. Rend p.a.",
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'maxAnnualReturn')
        },
        {
            id: 9,
            name: "SW Ertrag abs.",
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'sidewaysReturnAbsolute')
        },
        {
            id: 10,
            name: "SW Ertarg %",
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'sidewaysReturn')
        },
        {
            id: 11,
            name: "SW Rend p.a.",
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'sidewaysAnnualReturn')
        },
        {
            id: 12,
            name: "Outperf.Punkt",
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'outperformanceLevel')
        },
        {
            id: 13,
            name: 'BV',
            value: getMultiplier(group.underlyings)
        },
        {
            id: 14,
            name: 'Quanto',
            value: getQuanto(group.derivative)
        },
        {
            id: 15,
            name: ' Spread abs',
            value: calcSpreadAbs(group?.main?.snapQuote, group.underlyings, group.assetGroup)
        },
        {
            id: 16,
            name: 'Spread %',
            value: calcSpreadRel(group?.main?.snapQuote, group.underlyings)
        },
        {
            id: 17,
            name: 'Fälligkeit',
            value: getFalligkeit(group)
        }
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

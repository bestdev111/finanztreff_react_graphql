import {InstrumentGroup} from "../../../generated/graphql";
import {formatDate, formatKeyFigureValue, keyFigureType} from "../../../utils";
import {Button, Collapse, Row} from "react-bootstrap";
import SvgImage from "../../common/image/SvgImage";
import React, {useState} from "react";
import WarrantCharacteristicsItem from "./WarrantCharacteristicsItem";
import {
    getBasisprice,
    getCap,
    getDerivativeKeyFiguresValueWithCurr,
    getDerivativeKeyFiguresValueWithPerc, getMultiplier,
    getPartizipationsFaktor,
    getQuanto, getUnderlyingValueValueWithPerc
} from "./WarrantCharacteristicsContainer";
import {
    calcSpreadAbs,
    calcSpreadRel,
    getFalligkeit,
    getSidewaysAnnualReturn
} from "../Derivatives/components/WarrantCharacteristics";

export interface WarrantCharacteristicsContainerProps {
    group: InstrumentGroup;
}

export default function SprintCharacteristics ({group}: WarrantCharacteristicsContainerProps ) {
    const ShortItems: Array<keyFigureType> = [
        {
            id: 1,
            name: 'Typ',
            value: group?.assetType?.name
        },
        {
            id: 2,
            name: 'Basispreis',
            value: getBasisprice(group.underlyings)
        },
        {
            id: 3,
            name: 'Cap',
            value: getCap(group.underlyings)
        },
        {
            id: 4,
            name: 'Partizipationsfaktor',
            value: '--'//getPartizipationsFaktor(group.underlyings)
        },
        {
            id: 5,
            name: 'BV',
            value: getMultiplier(group.underlyings)
        },
        {
            id: 6,
            name: 'Quanto',
            value: getQuanto(group.derivative)
        },

    ]

    const FullItems: Array<keyFigureType> = [
        {
            id: 7,
            name: 'Max Rückzahlung',
            value: getDerivativeKeyFiguresValueWithCurr(group?.main?.derivativeKeyFigures, group?.underlyings,  'maxRedemptionPrice')
        },
        {
            id: 9,
            name: 'Max. Rend p.a.',
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'maxAnnualReturn')
        },
        {
            id: 10,
            name: ' Höchstbetrag abs',
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group?.underlyings, 'maxReturnAbsolute')
        },
        {
            id: 11,
            name: ' Höchstbetrag %',
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'maxReturn')
        },
        {
            id: 12,
            name: 'SW Rend p.a.',
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'sidewaysAnnualReturn')
        },
        {
            id: 13,
            name: 'SW Ertrag abs',
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'sidewaysReturnAbsolute')
        },
        {
            id: 14,
            name: 'SW Ertrag %',
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'sidewaysReturn')
        },
        {
            id: 15,
            name: 'OutperfPunkt',
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'outperformanceLevel')
        },
        {
            id: 16,
            name: 'Aufgeld abs',
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'premiumAbsolute')
        },
        {
            id: 17,
            name: 'Aufgeld %',
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'premium')
        },
        {
            id: 18,
            name: 'Aufgeld p.a.',
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'premiumAnnual')
        },
        {
            id: 19,
            name: ' Spread abs',
            value: calcSpreadAbs(group?.main?.snapQuote, group.underlyings, group?.assetGroup)
        },
        {
            id: 20,
            name: ' Spread %',
            value: calcSpreadRel(group?.main?.snapQuote, group.underlyings)
        },
        {
            id: 21,
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

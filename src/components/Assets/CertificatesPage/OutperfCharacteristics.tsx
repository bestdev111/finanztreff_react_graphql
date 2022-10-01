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
    getDerivativeKeyFiguresValueWithPerc, getKurs, getMultiplier,
    getPartizipationsFaktor,
    getQuanto
} from "./WarrantCharacteristicsContainer";
import {
    calcAbstandBasispreisAbs, calcAbstandBasispreisRel,
    calcAbstandCapAbs,
    calcSpreadAbs,
    calcSpreadRel, getFalligkeit,
    getSidewaysAnnualReturn
} from "../Derivatives/components/WarrantCharacteristics";

export interface WarrantCharacteristicsContainerProps {
    group: InstrumentGroup;
}

export default function OutperfCharacteristics ({group}: WarrantCharacteristicsContainerProps ) {
    const ShortItems: Array<keyFigureType> = [
        {
            id: 2,
            name: 'Typ',
            value: group?.assetType?.name
        },
        {
            id: 1,
            name: 'Basispreis',
            value: getBasisprice(group.underlyings)
        },
        {
            id: 3,
            name: 'Partizipationsfaktor',
            value: '--'
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
            id: 16,
            name: 'Fälligkeit',
            value: getFalligkeit(group)
        }
    ]

    const FullItems: Array<keyFigureType> = [
        {
            id: 4,
            name: 'Aufgeld abs',
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'premiumAbsolute')
        },
        {
            id: 4,
            name: 'Aufgeld %',
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'premium')
        },
        {
            id: 5,
            name: 'Aufgeld p.a.',
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'premiumAnnual')
        },
        {
            id: 11,
            name: 'Abs.Basispreis abs',
            value: calcAbstandBasispreisAbs(group?.underlyings, getKurs(group?.underlyings))
        },
        {
            id: 12,
            name: 'Abs.Basispreis %',
            value: calcAbstandBasispreisRel(group?.underlyings, getKurs(group?.underlyings))
        },
        {
            id: 15,
            name: ' Spread abs',
            value: calcSpreadAbs(group?.main?.snapQuote, group.underlyings, group?.assetGroup)
        },
        {
            id: 151,
            name: ' Spread %',
            value: calcSpreadRel(group?.main?.snapQuote, group.underlyings)
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

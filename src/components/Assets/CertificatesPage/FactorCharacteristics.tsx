import {DerivativeOptionType, InstrumentGroup} from "../../../generated/graphql";
import {formatDate, formatKeyFigureValue, keyFigureType} from "../../../utils";
import {Button, Collapse, Row} from "react-bootstrap";
import SvgImage from "../../common/image/SvgImage";
import React, {useState} from "react";
import WarrantCharacteristicsItem from "./WarrantCharacteristicsItem";
import {
    getBarriere,
    getBarriereAktiv,
    getBasisprice,
    getCap, getDerivativeKeyFiguresValue,
    getDerivativeKeyFiguresValueWithCurr,
    getDerivativeKeyFiguresValueWithPerc, getKurs, getMultiplier,
    getPartizipationsFaktor,
    getQuanto, getUnderlyingValueValueWithCurr
} from "./WarrantCharacteristicsContainer";
import {
    calcAbstandBarriereAbs, calcAbstandBarriereRel,
    calcAbstandBasispreisAbs, calcAbstandBasispreisRel,
    calcAbstandCapAbs, calcAbstandOutBarriereAbs, calcAbstandOutBarriereRel,
    calcSpreadAbs,
    calcSpreadRel, getFalligkeit,
    getSidewaysAnnualReturn
} from "../Derivatives/components/WarrantCharacteristics";

export interface WarrantCharacteristicsContainerProps {
    group: InstrumentGroup;
}

export default function FactorCharacteristics ({group}: WarrantCharacteristicsContainerProps ) {
    const ShortItems: Array<keyFigureType> = [
        {
            id: 2,
            name: 'Typ',
            value: group?.assetType?.name
        },
        {
            id: 1,
            name: 'Strategie',
            value: group.derivative?.optionType === DerivativeOptionType.Call ? "LONG" : "SHORT"
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
            name: 'Hebel',
            value: isNaN(getDerivativeKeyFiguresValue(group.main?.derivativeKeyFigures, 'gearing')) ? '--' :
                getDerivativeKeyFiguresValue(group.main?.derivativeKeyFigures, 'gearing')
        },
        {
            id: 4,
            name: 'Akt. Basispreis',
            value: getBasisprice(group.underlyings)
        },
        {
            id: 5,
            name: 'Akt. Barriere',
            value: getUnderlyingValueValueWithCurr(group.underlyings, 'knockOut')
        },
        {
            id: 11,
            name: 'Abs.Basispreis abs',
            value: calcAbstandBasispreisAbs(group?.underlyings, getKurs(group?.underlyings))
        },
        {
            id: 12,
            name: 'Abs.Basispreis rel',
            value: calcAbstandBasispreisRel(group?.underlyings, getKurs(group?.underlyings))
        },
        {
            id: 15,
            name: ' Abs.Barriere abs',
            value: calcAbstandOutBarriereAbs(group?.underlyings, getKurs(group?.underlyings))
        },
        {
            id: 151,
            name: ' Abs.Barriere rel',
            value: calcAbstandOutBarriereRel(group?.underlyings, getKurs(group?.underlyings))
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
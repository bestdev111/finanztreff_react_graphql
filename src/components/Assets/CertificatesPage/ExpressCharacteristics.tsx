import {InstrumentGroup} from "../../../generated/graphql";
import {formatDate, keyFigureType} from "../../../utils";
import {Button, Collapse, Row} from "react-bootstrap";
import SvgImage from "../../common/image/SvgImage";
import React, {useState} from "react";
import WarrantCharacteristicsItem from "./WarrantCharacteristicsItem";
import {
    getBarriere, getBasisprice,
    getDerivativeKeyFiguresValueWithCurr,
    getDerivativeKeyFiguresValueWithPerc, getKnockIn, getKurs, getMultiplier,
    getQuanto, getZins
} from "./WarrantCharacteristicsContainer";
import {calcAbstandBarriereAbs, getFalligkeit} from "../Derivatives/components/WarrantCharacteristics";

export interface WarrantCharacteristicsContainerProps {
    group: InstrumentGroup;
}

export default function ExpressCharacteristics({group}: WarrantCharacteristicsContainerProps ) {
    const ShortItems: Array<keyFigureType> = [
        {
            id: 0,
            name: 'Typ',
            value: group.assetType?.name || '--'
        },
        {
            id: 1,
            name: 'Auszahlungslevel',
            value: getBasisprice(group.underlyings)
        },
        {
            id: 2,
            name: 'Barriere',
            value: getKnockIn(group.underlyings)
        },
        {
            id: 3,
            name: 'Zins',
            value: getZins(group.interestRateInformation)
        },
        {
            id: 4,
            name: 'Abs.Barriere',
            value: calcAbstandBarriereAbs(group?.underlyings, getKurs(group?.underlyings))
        },
        {
            id: 5,
            name: 'BV',
            value: getMultiplier(group?.underlyings)
        },
    ]

    const FullItems: Array<keyFigureType> = [
        {
            id: 6,
            name: 'Quanto',
            value: getQuanto(group.derivative)
        },
        {
            id: 9,
            name: 'Beobachtungszeitpunkte',
            value: '???'
        },
        {
            id: 10,
            name: 'Bewertungstag 1',
            value: '???'
        },
        {
            id: 11,
            name: 'Bewertungstag 2',
            value: '???'
        },
        {
            id: 12,
            name: ' Finaler Bewertungstag',
            value: '???'
        },
        {
            id: 13,
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
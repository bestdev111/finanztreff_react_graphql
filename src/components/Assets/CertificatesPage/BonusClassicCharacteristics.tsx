import {InstrumentGroup} from "../../../generated/graphql";
import {keyFigureType} from "../../../utils";
import {Button, Collapse, Row} from "react-bootstrap";
import SvgImage from "../../common/image/SvgImage";
import React, {useState} from "react";
import WarrantCharacteristicsItem from "./WarrantCharacteristicsItem";
import {
    getBarriere, getBarriereAktiv,
    getBonusLevel, getCap, getDerivativeKeyFiguresValue,
    getDerivativeKeyFiguresValueWithCurr,
    getDerivativeKeyFiguresValueWithPerc, getKurs, getMultiplier,
    getQuanto, getSecurityBarrierObservation
} from "./WarrantCharacteristicsContainer";
import {
    calcBonusPufferRel,
    calcSpreadAbs,
    calcSpreadRel,
    getSecurity
} from "../Derivatives/components/WarrantCharacteristics";

export interface WarrantCharacteristicsContainerProps {
    group: InstrumentGroup;
}

export default function BonusClassicCharacteristics ({group}: WarrantCharacteristicsContainerProps ) {
    const ShortItems: Array<keyFigureType> = [
        {
            id: 0,
            name: 'Typ',
            value: group.assetType?.name || '--'
        },
        {
            id: 1,
            name: 'B.Level',
            value: getBonusLevel(group.underlyings)
        }, {
            id: 2,
            name: 'Barriere',
            value: getBarriere(group.underlyings)
        },
        {
            id: 3,
            name: 'B.Puffer abs',
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'bonusBufferAbsolute')
        },
        {
            id: 4,
            name: 'B.Puffer %',
            value: calcBonusPufferRel(getDerivativeKeyFiguresValue(group.main?.derivativeKeyFigures, 'bonusBufferAbsolute'), getKurs(group.underlyings))
        },
        {
            id: 5,
            name: 'B. Betrag abs',
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'bonusReturnAbsolute')
        },
    ]

    const FullItems: Array<keyFigureType> = [
        {
            id: 6,
            name: ' B.Rend %',
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'bonusReturn')
        },
        {
            id: 7,
            name: 'Abstand B. Level abs',
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'deltaBonusLevelAbsolute')
        },
        {
            id: 8,
            name: 'Abstand B. Level %',
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'deltaBonusLevel')
        },
        {
            id: 9,
            name: 'Aufgeld',
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'premium')
        },
        {
            id: 91,
            name: 'Aufgeld abs',
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'premiumAbsolute')
        },
        {
            id: 911,
            name: 'Aufgeld p.a.',
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'premiumAnnual')
        },
        {
            id: 10,
            name: 'B.Ertrag abs',
            value: getDerivativeKeyFiguresValueWithCurr(group.main?.derivativeKeyFigures, group.underlyings, 'bonusReturnAbsolute')
        },
        {
            id: 11,
            name: 'B.Ertrag %',
            value: getDerivativeKeyFiguresValueWithPerc(group.main?.derivativeKeyFigures, 'bonusReturn')
        },
        {
            id: 12,
            name: '!',
            value: getBarriereAktiv(group.underlyings)
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

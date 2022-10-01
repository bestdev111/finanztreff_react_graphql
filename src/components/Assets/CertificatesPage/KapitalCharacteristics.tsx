import {CalculationPeriod, InstrumentGroup} from "../../../generated/graphql";
import {keyFigureType} from "../../../utils";
import {Button, Collapse, Row} from "react-bootstrap";
import SvgImage from "../../common/image/SvgImage";
import React, {useState} from "react";
import WarrantCharacteristicsItem from "./WarrantCharacteristicsItem";
import {
    getBarriere,
    getBonusLevel, getCap,
    getDerivativeKeyFiguresValueWithCurr,
    getDerivativeKeyFiguresValueWithPerc, getManagementGebuhren, getMultiplier, getPerformance,
    getQuanto, getSecurityBarrierObservation
} from "./WarrantCharacteristicsContainer";
import {
    calcSpreadAbs,
    calcSpreadRel,
    getSecurity,
    getSidewaysAnnualReturn
} from "../Derivatives/components/WarrantCharacteristics";

export interface WarrantCharacteristicsContainerProps {
    group: InstrumentGroup;
}

export default function KapitalCharacteristics ({group}: WarrantCharacteristicsContainerProps ) {
    const ShortItems: Array<keyFigureType> = [
        {
            id: 0,
            name: 'Typ',
            value: group.assetType?.name || '--'
        },
        {
            id: 1,
            name: 'Perf. 1M',
            value: getPerformance(group.content?.find(i => i.main)?.performance, CalculationPeriod.Month1)
        },
        {
            id: 2,
            name: 'Perf. 3M',
            value: getPerformance(group.content?.find(i => i.main)?.performance, CalculationPeriod.Month3)
        },
        {
            id: 3,
            name: 'Perf. 6M',
            value: getPerformance(group.content?.find(i => i.main)?.performance, CalculationPeriod.Month6)
        },
        {
            id: 4,
            name: 'Perf. 1J',
            value: getPerformance(group.content?.find(i => i.main)?.performance, CalculationPeriod.Week52)
        },
        {
            id: 5,
            name: 'Perf. 3J',
            value: getPerformance(group.content?.find(i => i.main)?.performance, CalculationPeriod.Year3)
        }
    ]

    const FullItems: Array<keyFigureType> = [
        {

            id: 6,
            name: 'ManagmentGebühr',
            value: getManagementGebuhren(group.derivative, group.underlyings)
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
        {
            id: 6,
            name: 'Spread abs',
            value: calcSpreadAbs(group?.main?.snapQuote, group.underlyings, group?.assetGroup)
        },
        {
            id: 6,
            name: 'Spread %',
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

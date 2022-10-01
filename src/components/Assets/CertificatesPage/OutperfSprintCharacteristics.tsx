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
    getQuanto
} from "./WarrantCharacteristicsContainer";
import {getSidewaysAnnualReturn} from "../Derivatives/components/WarrantCharacteristics";
import SprintCharacteristics from "./SprintCharacteristics";
import OutperfCharacteristics from "./OutperfCharacteristics";

export interface WarrantCharacteristicsContainerProps {
    group: InstrumentGroup;
}

export default function OutperfSprintCharacteristics ({group}: WarrantCharacteristicsContainerProps ) {
    if(group.assetType?.id) {
        return group.assetType?.id?.indexOf('OUTPERFORMANCE_SPRINT') > 0 ? <SprintCharacteristics group={group} /> :
            <OutperfCharacteristics group={group} />
    } else return null;
}
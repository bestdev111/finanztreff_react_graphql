import {InstrumentGroup} from "../../../generated/graphql";
import {keyFigureType} from "../../../utils";
import {Button, Collapse, Row} from "react-bootstrap";
import SvgImage from "../../common/image/SvgImage";
import React, {useState} from "react";
import WarrantCharacteristicsItem from "./WarrantCharacteristicsItem";
import {
    getBarriere, getBarriereAktiv,
    getBonusLevel, getCap,
    getDerivativeKeyFiguresValueWithCurr,
    getDerivativeKeyFiguresValueWithPerc, getMultiplier,
    getQuanto, getSecurityBarrierObservation
} from "./WarrantCharacteristicsContainer";
import {getSecurity} from "../Derivatives/components/WarrantCharacteristics";
import BonusClassicCharacteristics from "./BonusClassicCharacteristics";
import BonusCappedCharacteristics from "./BonusCappedCharacteristics";
import IndexCharacteristics from "./IndexCharacteristics";

export interface WarrantCharacteristicsContainerProps {
    group: InstrumentGroup;
}

export default function BonusCharacteristics ({group}: WarrantCharacteristicsContainerProps ) {

    switch (group.assetType?.id) {
        case 'CERT_BONUS_CLASSIC_CLASSIC':
        case 'CERT_BONUS_CLASSIC_PRO':
        case 'CERT_BONUS_REVERSE_REVERSE':
        case 'CERT_BONUS_REVERSE_REVERSE_PROD':
            return <BonusClassicCharacteristics group={group} />

        case 'CERT_BONUS_CLASSIC_CAPPED_PRO':
        case 'CERT_BONUS_CLASSIC_CAPPED':
        case 'CERT_BONUS_REVERSE_CAPPED_REVERSE_PROD':
        case 'CERT_BONUS_REVERSE_CAPPED_REVERSE':
            return <BonusCappedCharacteristics group={group} />
            // Bonus -> sonstige
            // "id": "CERT_BONUS_OTHER_CAPPED_OUTPERFORMANCE",
            // "id": "CERT_BONUS_OTHER_OTHER",
            // "id": "CERT_BONUS_OTHER_MULTI",
            // "id": "CERT_BONUS_OTHER_CAPPED_MULTI",
            // "id": "CERT_BONUS_OTHER_EASY",
            // "id": "CERT_BONUS_OTHER_CAPPED_EASY",
            // "id": "CERT_BONUS_OTHER_CORRIDOR_PRO",
            // "id": "CERT_BONUS_OTHER_MULTI_PRO",
            // "id": "CERT_BONUS_OTHER_ALPHA",
            // "id": "CERT_BONUS_OTHER_OUTPERFORMANCE",
            // "id": "CERT_BONUS_OTHER_CORRIDOR",
    }
    return <IndexCharacteristics group={group} />
}
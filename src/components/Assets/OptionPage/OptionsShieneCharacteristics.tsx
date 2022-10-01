import {InstrumentGroup} from "../../../generated/graphql";
import React from "react";

export interface WarrantCharacteristicsContainerProps {
    group: InstrumentGroup;
}

export default function OptionsSheineCharacteristics ({group}: WarrantCharacteristicsContainerProps ) {
    // if(group.assetType?.id) {
    //     return group.assetType?.id?.indexOf('INLINE') > 0 ? <InlineOSCharacteristics group={group} /> :
    //         <InlineOSCharacteristics group={group} />
    // } else
        return null;
}
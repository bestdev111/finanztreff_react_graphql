import React from 'react'
import SvgImage from "../../../common/image/SvgImage";
import './UnderlyingTags.scss'
import {AssetGroup, Instrument} from "../../../../generated/graphql";
import {formatAssetGroup, numberFormatDecimals} from "../../../../utils";
import {formatColorOfAssetGroup} from "../../../profile/utils";

interface UnderlyingTagNamesProps {
    assetName: AssetGroup | undefined;
    name: string;
    change: number;
    onTagClick: () => any;
}

export const UnderlyingTagNames = ({name, assetName, change, onTagClick}: UnderlyingTagNamesProps) => {

    return (
        <div className="underlying-wrapper cursor-pointer" onClick={() => onTagClick()}>
            <div className="bg-white m-2 d-flex justify-content-around underlying-tag align-items-center">
                <span className="font-weight-bold tag-asset-name pr-5 ml-2" style={{color: formatColorOfAssetGroup(assetName)}}>{formatAssetGroup(assetName)}</span>
                <span className="font-weight-bold tag-name text-truncate">{name}</span>
                <div>

                    {
                        change >= 0 ?
                            <>
                                <span className="text-green tag-change">+{numberFormatDecimals(change, 2, 2)}%</span>
                                <SvgImage icon="icon_arrow_long_up_green.svg" convert={true} spanClass="ml-2 arrow-svg-icon"
                                          imgClass="arrow-img" width="25"/>
                            </>
                            :
                            <>
                                <span className="text-pink tag-change">{numberFormatDecimals(change, 2, 2)}%</span>
                                <SvgImage icon="icon_arrow_long_down_red.svg" convert={true} spanClass="ml-2 arrow-svg-icon"
                                          imgClass="arrow-img" width="25"/>
                            </>
                    }
                </div>
            </div>
        </div>
    )
}

export default UnderlyingTagNames

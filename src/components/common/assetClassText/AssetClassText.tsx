import React from "react";
import {AssetGroup} from "../../../generated/graphql";
import {textForSEO} from "../../../utils";
import classNames from "classnames";

interface AssetClassTextProps {
    assetGroup: AssetGroup
    isDerivativePage: boolean
}

export const AssetClassText = (props: AssetClassTextProps) => {
    let {text, header} = textForSEO(props.assetGroup);
    return (
        <section style={{boxShadow: "#00000029 0px 3px 6px"}}
                 className={classNames(props.isDerivativePage ? "bg-white main-section mx-md-3 mt-n1" : "bg-white main-section mx-md-3 mt-4")}>
            <h2 style={{fontSize: '18px', fontFamily: 'Roboto Slab'}}
                className={classNames(props.isDerivativePage ? "pb-2 px-3 mt-n5 bg-white" : "mt-md-n4 mt-n2 pt-2 px-3")}>
                {header}
            </h2>
            <p className={"px-3 pb-3 font-size-15px"}>{text}</p>
        </section>
    )
}

export default AssetClassText;

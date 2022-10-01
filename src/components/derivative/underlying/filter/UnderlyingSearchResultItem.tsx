import React from "react";
import {Button} from "react-bootstrap";
import {Instrument} from "../../../../generated/graphql";
import {getAssetGroup} from "../../../profile/utils";

interface UnderlyingSearchResultItemProps {
    onCustomAssetSelect: (instrument: Instrument) => any;
    instrument: Instrument;
}

export default function UnderlyingSearchResultItem(props: UnderlyingSearchResultItemProps) {
    const {name, wkn, group} = props.instrument;
    return (<>
        <div className="result-item">
            <Button className="name text-left p-0" variant="link" onClick={() => props.onCustomAssetSelect(props.instrument)}>
                {name}
            </Button>
            <div>
                <span className={wkn ? '' : 'd-none'}>WKN:&nbsp;{wkn} </span>
                <span className="type text-uppercase">{group.assetGroup && getAssetGroup(group.assetGroup)}</span>
            </div>
        </div>
    </>);
}


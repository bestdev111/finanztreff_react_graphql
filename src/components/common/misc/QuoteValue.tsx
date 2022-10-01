import { AssetGroup } from "graphql/types";
import {Component} from "react";
import {formatPriceWithSign} from "../../../utils";

export interface QuoteValueProperties {
    value?: number | null;
    change?: number | null;
    suffix?: string
    assetGroup?: AssetGroup
}

function getClassByChange(change: number) {
    if (change < 0) {
        return 'text-red';
    }
    if (change > 0) {
        return 'text-green';
    }
    return 'text-black';
}

export class QuoteValue extends Component<QuoteValueProperties, {}> {
    render() {
        if (this.props.value == null) {
            return <>-</>;
        }
        if (this.props.change == null) {
            return <>{formatPriceWithSign(this.props.value, this.props.assetGroup)}</>;
        }
        return (
            <span className={getClassByChange(this.props.value)}>
                {formatPriceWithSign(this.props.value, this.props.assetGroup)}{this.props.suffix || ""}
            </span>
        );
    }
}

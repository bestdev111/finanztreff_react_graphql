import SvgImage from "../../common/image/SvgImage";
import { Instrument } from "../../../generated/graphql";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";

interface AssetRowTitleProps {
    title: string;
    assetGroup?: string;
    instrument?: Instrument | null;
}

export default function AssetRowTitle(props: AssetRowTitleProps) {

    const renderTitle = () => {
        if (props.instrument) {
            return (<AssetLinkComponent instrument={props.instrument} title={props.title} className="asset-link-white text-max-250" />)
        } else {
            return (<span className="text-max-250">{props.title}..</span>);
        }
    }

    return <>
        <span className="asset-type-tag aktie">{props.assetGroup || ''}</span>
        <span className="asset-name">
            <SvgImage icon="icon_hot_flame_orange.svg" spanClass="top-move" imgClass="flame-icon" width="25" />
            {renderTitle()}
        </span>
    </>;
}

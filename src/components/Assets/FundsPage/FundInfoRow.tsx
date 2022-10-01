import SvgImage from "components/common/image/SvgImage";
import { AssetGroup, InstrumentGroupFundTranche } from "generated/graphql";
import { Link } from "react-router-dom";
import { getFinanztreffAssetLink } from "utils";

export function FundInfoRow(props: { alternativeFundTranches?: InstrumentGroupFundTranche[] }) {

    if (props.alternativeFundTranches === undefined) {
        return (<></>);
    }
    let isMain: boolean = props.alternativeFundTranches.filter(item => item.main === true).length === 0;
    let mainTranche = undefined;
    if (isMain === false) {
        mainTranche = props.alternativeFundTranches.filter(item => item.main === true)[0]
    }

    return (
        <div className="bg-white d-flex mb-n3">
            <div className="" style={{ width: "8px", minHeight: "42px", backgroundColor: "#63BD5C" }}>&nbsp;</div>
            <SvgImage icon="icon_tranch_green.svg" convert={false} imgClass="svg-fond-grey ml-1 mt-2" width="28" />
            <div className="my-auto ml-1">
                {
                    isMain ?
                        <span>Dieser Fonds ist der Hauptfonds</span>
                        : <span>Dieser Fonds ist eine <b>Anteilsklasse des Hauptfonds</b></span>
                }
                {
                    !isMain && mainTranche && mainTranche.group && !!mainTranche.group.seoTag &&
                    <Link to={getFinanztreffAssetLink(AssetGroup.Fund, mainTranche.group.seoTag)}
                        className="ml-1 font-weight-bold">{mainTranche.name}</Link>
                }
            </div>
        </div>
    );
}

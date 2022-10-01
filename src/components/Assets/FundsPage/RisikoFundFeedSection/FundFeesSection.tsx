import { InstrumentGroupFundTranche } from "generated/graphql";
import { numberFormat } from "utils";
import {RangeChartDonut} from "../../../common/charts/RangeChartDonut/RangeChartDonut";


interface FundFeesSectionProps {
    fundTranche: InstrumentGroupFundTranche
}

export function FundFeesSection(props: FundFeesSectionProps) {

    return (
        <>
            <div className="content-wrapper">
                <h2 className="content-wrapper-heading font-weight-bold">Fondsgebühren</h2>
                <div className="content">
                    <RangeChartDonut value={props.fundTranche.totalExpenseRatio || 0} />
                    <h3 className="content-wrapper-heading font-weight-bold text-center">Total Expense Ratio (TER)</h3>
                    <FundFeesContent fundTranche={props.fundTranche} />
                </div>
            </div>
        </>
    )
}

export function FundFeesContent(props: { fundTranche: InstrumentGroupFundTranche }) {
    return (
        <>
            <div className="border-bottom-1 border-border-gray py-2 d-flex justify-content-between">
                <span className="">Ausgabeaufschlag</span>
                <span className=" font-weight-bold">
                    {props.fundTranche.assetBasedFee ? numberFormat(props.fundTranche.assetBasedFee, " %") : "-"}
                </span>
            </div>
            <div className="border-bottom-1 border-border-gray py-2 d-flex justify-content-between">
                <span className="">Rücknahmegebühr</span>
                <span className=" font-weight-bold">
                    {props.fundTranche.rePurchasePrice ? numberFormat(props.fundTranche.rePurchasePrice, " %") : "-"}
                </span>
            </div>
            <div className="border-bottom-1 border-border-gray py-2 d-flex justify-content-between">
                <span className="">Verwaltungsgebühr</span>
                <span className=" font-weight-bold">
                    {props.fundTranche.charge ? numberFormat(props.fundTranche.charge, " %") : "-"}
                </span>
            </div>
        </>
    );
}


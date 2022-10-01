import classNames from "classnames";
import SvgImage from "components/common/image/SvgImage";
import { useState } from "react";
import { Collapse, Container } from "react-bootstrap";
import { FundFeesContent } from "./FundFeesSection";
import { RiskSectionContent, RiskSectionDonut } from "./RiskSecton";
import './RisikoFundFees.scss'
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import { InstrumentGroupFundTranche } from "generated/graphql";
import {RangeChartDonut} from "../../../common/charts/RangeChartDonut/RangeChartDonut";

export function RiskAndFundSection(props: RiskAndFundSectionProps) {

    const [open, setOpen] = useState(false);
    const showBigDonuts = useBootstrapBreakpoint({
        xl: true,
        md: true,
        sm: false,
        default: true
    });

    return (
        <div className={classNames("content-wrapper", props.className)}>
            <Container>
                {
                    showBigDonuts ?
                        <div className="row">
                            {props.fundTranche && props.fundTranche.totalExpenseRatio &&
                                <div className="col">
                                    <div>
                                        <RangeChartDonut value={props.fundTranche.totalExpenseRatio} />
                                        <h3 className="content-wrapper-heading font-weight-bold text-center mt-n1">Total Expense Ratio (TER)</h3>
                                    </div>
                                </div>
                            }
                            <div className="col donut-md">
                                <div className="mt-2 pt-1">
                                    <RiskSectionDonut riskFactor={props.fundTranche.srri?.value || 0}/>
                                    <h3 className="content-wrapper-heading font-weight-bold text-center mt-n3">Risiko (KID)</h3>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="d-flex mt-n5 donut-sm">
                            {props.fundTranche && props.fundTranche.totalExpenseRatio &&
                                <div>
                                    <RangeChartDonut value={props.fundTranche.totalExpenseRatio} />
                                    <h5 className="content-wrapper-heading font-weight-bold text-center mt-n1 fs-14px ">Total Expense Ratio (TER)</h5>
                                </div>
                            }
                            <div>
                                <div className="mt-2">
                                <RiskSectionDonut riskFactor={props.fundTranche.srri?.value || 0}/>
                                </div>
                                <h5 className="content-wrapper-heading font-weight-bold text-center mt-n3 pt-1 fs-14px">Risiko (KID)</h5>
                            </div>
                        </div>
                }
            </Container>
            <div className="d-flex justify-content-center text-center ">
                <a className="text-blue" onClick={() => setOpen(!open)}>
                    <span className="text-grey">
                        Mehr zu Gebühren und Risiko
                        <SvgImage icon="icon_direction_down_blue_light.svg" style={open ? { transform: "rotate(180deg)" } : {}}
                            spanClass="svg-grey" width="27"/>
                    </span>
                </a>
            </div>
            <Collapse in={open}>
                <Container>
                    <div className="row">
                        <div className="col mt-sm-4">
                            <div className="border-bottom-1 border-border-gray py-2 d-flex justify-content-start">
                                <span className="font-weight-bold">Gebühren</span>
                            </div>
                            <FundFeesContent fundTranche={props.fundTranche} />
                        </div>
                        <div className="col mt-sm-4">
                            <div className={classNames("coming-soon-component risk-fund-section", props.className)}>
                                <span className="text-white fs-18px coming-soon-text d-flex justify-content-center">Coming soon...</span>
                            </div>
                            <div className="border-bottom-1 border-border-gray py-2 d-flex justify-content-start">
                                <span className="font-weight-bold">Risiko</span>
                            </div>
                            <RiskSectionContent fundTranche={props.fundTranche} />
                        </div>
                    </div>
                </Container>
            </Collapse>
        </div>
    )
}

interface RiskAndFundSectionProps {
    className?: string;
    fundTranche: InstrumentGroupFundTranche
}

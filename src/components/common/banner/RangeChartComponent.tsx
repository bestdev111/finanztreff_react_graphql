import React from "react";
import {RangeChart} from "../../../graphql/types";
import {numberFormat} from "../../../utils";
import classNames from "classnames";

export const RangeChartComponent = (props: any) => {
    const rc: RangeChart = props.data;
    const threshold = rc.threshold && rc.min && rc.max ? Math.round((rc.threshold - rc.min) / (rc.max - rc.min) * 100) : 0;
    const current = rc.current && rc.min && rc.max ? Math.round((rc.current - rc.min) / (rc.max - rc.min) * 100) : 0;
    return (
        <div className={classNames(props.className, "horizontal-bar-movement height-small banner-graph progress just-pointer col")} hbar-with-pointer="">
            {
                props.data && (rc.min !== rc.max) ? (
                    <>
                        <div className="graph-legend left-p">
                            <div className="font-weight-bold">{props.period}-Tief</div>
                            <div>{rc.min ? numberFormat(rc.min) : ""}</div>
                        </div>
                        <div className="graph-wrapper d-flex position-relative">
                            <div className="h-bar-pointer-floating medium-pointer " style={{left: current + '%'}}>
                                <div className="floating-pointer no-border bg-white width-3"/>
                            </div>
                            <div className="progress-bar bg-pink" role="progressbar" style={{width: threshold + '%'}} progress-bar-left-side=""></div>
                            <div className="progress-bar bg-green" role="progressbar" style={{width: (100 - threshold) + '%'}} progress-bar-right-side="">
                                <div className="between-pointer" hbar-pointer="">{props.title}</div>
                            </div>
                        </div>
                        <div className="graph-legend right-p">
                            <div className="font-weight-bold">{props.period}-Hoch</div>
                            <div>{rc.max ? numberFormat(rc.max) : ""}</div>
                        </div>
                    </>

                )
                    :
                (
                    <>
                        <div className="graph-legend left-p">
                            <div className="font-weight-bold">{props.period}-Tief</div>
                            <div>{rc.min ? numberFormat(rc.min) : ""}</div>
                        </div>
                        <div className="graph-wrapper d-flex position-relative">
                            <div className="h-bar-pointer-floating medium-pointer" style={{left: '50%'}}>
                                <div className="floating-pointer no-border bg-white width-3"/>
                            </div>
                            <div className="progress-bar bg-gray" role="progressbar" style={{width: '50%'}} progress-bar-left-side=""></div>
                            <div className="progress-bar bg-gray" role="progressbar" style={{width: '50%'}} progress-bar-right-side="">
                                <div className="between-pointer" hbar-pointer="">{props.title}</div>
                            </div>
                        </div>
                        <div className="graph-legend right-p">
                            <div className="font-weight-bold">{props.period}-Hoch</div>
                            <div>{rc.max ? numberFormat(rc.max) : ""}</div>
                        </div>
                    </>

                )
            }
        </div>
    )
}

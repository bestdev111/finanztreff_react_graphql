import React, {Component} from "react";
import {Col} from "react-bootstrap";
import {InstrumentIndicators, InstrumentStatistics} from "../../../../generated/graphql";
import {numberFormat} from "../../../../utils";

export function TechnicalCompanyKeyFigureBox(props: TechnicalCompanyKeyFigureBoxProps) {
    return (
        <Col>
            <div className="mt-sm-n4 mb-sm-n1 pt-xl-0 mt-xl-n2">
                <div
                    className="border  mt-md-0 border-border-gray fnt-size-14 px-1 py-sm-1  py-sm-0 py-md-1 "
                    style={{height: "62px", marginBottom: "28px"}}>

                    <div className="text-truncate my-n1">{props.name}</div>
                    <div className="text-truncate my-n1">{props.details}</div>
                    <div className="font-weight-bold my-1">{props.value}</div>
                </div>
            </div>
        </Col>
    );
}

interface TechnicalCompanyKeyFigureBoxProps {
    name: string;
    details: string;
    value: string;
}

function mapRelativeTradingVolume(current: number) {
    if(current > 0.02){
        return "sehr hoch";
    }
    else if(current <= 0.02 && current >= -0.02){
        return "hoch";
    }
    else if( current < -0.02 ){
        return "niedrig";
    }
    else {
        return "---";
    }
}

export class TechnicalCompanyKeyFigures extends Component<TechnicalCompanyKeyFiguresProps, {}> {
    render() {
        return (
            <div className="row row-cols-xl-6 mt-sm-2 row-cols-lg-5 row-cols-sm-2 gutter-16 h-75 gutter-tablet-8 ">
                {this.props.allTime && this.props.allTime.deltaHighPrice != null &&
                    <TechnicalCompanyKeyFigureBox
                            name="Abstand"
                            details="Allzeit-Hoch"
                            value={numberFormat(this.props.allTime.deltaHighPrice, '%')}
                        />
                }
                {this.props.allTime && this.props.allTime.deltaLowPrice != null &&
                    <TechnicalCompanyKeyFigureBox
                        name="Abstand"
                        details="Allzeit-Tief"
                        value={numberFormat(this.props.allTime.deltaLowPrice, '%')}
                    />
                }
                {this.props.yearStats && this.props.yearStats?.deltaHighPrice != null &&
                    <TechnicalCompanyKeyFigureBox
                        name="Abstand"
                        details="52W-Hoch"
                        value={numberFormat(this.props.yearStats.deltaHighPrice, '%')}
                    />
                }
                {this.props.allTime && this.props.allTime.highPrice != null && this.props.allTime.highPriceDate != null &&
                    <TechnicalCompanyKeyFigureBox
                        name="Allzeithoch"
                        details={'(' + this.props.allTime.highPriceDate + ')'}
                        value={numberFormat(this.props.allTime.highPrice, " " + (this.props.currencyCode || ""))}
                    />
                }
                {this.props.allTime && this.props.allTime.lowPrice != null && this.props.allTime.lowPriceDate != null &&
                    <TechnicalCompanyKeyFigureBox
                        name="Allzeittief"
                        details={'(' + this.props.allTime.lowPriceDate + ')'}
                        value={numberFormat(this.props.allTime.lowPrice, " " + (this.props.currencyCode || ""))}
                    />
                }
                {this.props.yearStats && this.props.yearStats.deltaLowPrice != null &&
                    <TechnicalCompanyKeyFigureBox
                        name="Abstand"
                        details="52W-Tief"
                        value={numberFormat(this.props.yearStats.deltaLowPrice, '%')}
                    />
                }
                {this.props.indicators && this.props.indicators.movingAverage?.line38Day != null &&
                    <TechnicalCompanyKeyFigureBox
                        name="38"
                        details="Tage-Linie"
                        value={numberFormat(this.props.indicators.movingAverage.line38Day)}
                    />
                }
                {this.props.indicators && this.props.indicators.movingAverage?.line200Day &&
                    <TechnicalCompanyKeyFigureBox
                        name="200"
                        details="Tage-Linie"
                        value={numberFormat(this.props.indicators.movingAverage.line200Day)}
                    />
                }
                {this.props.vola30 &&
                    <TechnicalCompanyKeyFigureBox
                        name="Volatilität"
                        details="(30 Tage)"
                        value={numberFormat(this.props.vola30, "%")}
                    />
                }
                {this.props.indicators && this.props.indicators.relativeStrengthIndex?.last25Days &&
                    <TechnicalCompanyKeyFigureBox
                        name="Relatives"
                        details="Handelsvolumen"
                        value={mapRelativeTradingVolume(this.props.indicators.relativeStrengthIndex?.last25Days || 0)}
                    />
                }
                {this.props.indicators && this.props.indicators.movingAverage?.deltaLine38Day != null &&
                    <TechnicalCompanyKeyFigureBox
                        name="Abstand"
                        details="38 Tage-Linie"
                        value={numberFormat(this.props.indicators.movingAverage.deltaLine38Day, '%')}
                    />
                }
                {this.props.indicators && this.props.indicators.movingAverage?.deltaLine200Day &&
                    <TechnicalCompanyKeyFigureBox
                        name="Abstand"
                        details="200 Tage-Linie"
                        value={numberFormat(this.props.indicators.movingAverage.deltaLine200Day, '%')}
                    />
                }
                {this.props.indicators && this.props.indicators.relativeStrengthIndex?.last25Days &&
                    <TechnicalCompanyKeyFigureBox
                        name="RSI"
                        details="25 Tage"
                        value={numberFormat(this.props.indicators.relativeStrengthIndex?.last25Days)}
                    />
                }
            </div>
        );
    }
}

export interface TechnicalCompanyKeyFiguresProps {
    indicators?: InstrumentIndicators;
    yearStats?: InstrumentStatistics;
    allTime?: InstrumentStatistics;
    vola30?: number;
    currencyCode?: string;
}

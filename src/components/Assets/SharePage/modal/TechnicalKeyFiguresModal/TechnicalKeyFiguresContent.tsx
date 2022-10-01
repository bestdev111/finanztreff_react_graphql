import {Component} from "react";
import {TechnicalCompanyKeyFigures} from "../../common/TechnicalCompanyKeyFigures";
import {InstrumentIndicators, InstrumentStatistics} from "../../../../../generated/graphql";

export class TechnicalKeyFiguresContent extends Component<TechnicalKeyFigureContentProps> {
    render() {
        return (
            <div className="content wb-m col mx-1 mx-md-0">
                <div className="d-sm-block d-md-flex justify-content-between">
                    <h3 className="content-wrapper-heading font-weight-bold ml-1 ml-md-0">Kennzahlen - Unternehmen</h3>
                    {/* <div className=" fnt-size-13 text-kurs-grau mr-2 ml-sm-n1 mb-sm-4 pb-sm-2 mt-sm-n3">
                        <span className="padding-right-5 ml-sm-2 ml-md-0">Zeitpunkt der Berechnung:</span>
                        <span className="ml-5 d-sm-block d-md-none"></span>
                        <span className="padding-right-5 ml-sm-2 ml-md-0"><span>05.08.20 - 09:20:35</span>,</span>
                        <span className="padding-right-5">Ask:</span>
                        <span>14,28 EUR</span>
                    </div> */}
                </div>
                <div className="content mx-1 mx-md-0">
                    <TechnicalCompanyKeyFigures
                        indicators={this.props.indicators}
                        yearStats={this.props.yearStats}
                        allTime={this.props.allTime}
                        vola30={this.props.vola30}
                        currencyCode={this.props.currencyCode}
                    />
                </div>
            </div>
        )
    }
}

export interface TechnicalKeyFigureContentProps {
    indicators?: InstrumentIndicators;
    yearStats?: InstrumentStatistics;
    allTime?: InstrumentStatistics;
    vola30?: number;
    currencyCode?: string;
}

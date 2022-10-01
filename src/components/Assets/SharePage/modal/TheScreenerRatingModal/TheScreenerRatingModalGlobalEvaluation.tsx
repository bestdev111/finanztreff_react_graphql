import {TheScreenerRatingGlobalEvaluation} from "../../../../../generated/graphql";
import React, {Component} from "react";
import {formatDate} from "../../../../../utils";

export interface TheScreenerRatingModalGlobalEvaluationProps {
    globalEvaluation: TheScreenerRatingGlobalEvaluation;
}


export class TheScreenerRatingModalGlobalEvaluation extends Component<TheScreenerRatingModalGlobalEvaluationProps> {
    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between">
                        <span className={" ml-n1"}>Gesamteindruck</span>
                        <span className="boxes-spans">
                        {this.props.globalEvaluation.value === -2 &&
                        <>
                            <span className="bg-blue">&nbsp;</span>
                            <span>&nbsp;</span>
                            <span>&nbsp;</span>
                            <span>&nbsp;</span>
                            <span>&nbsp;</span>
                        </>
                        }
                            {this.props.globalEvaluation.value === -1 &&
                            <>
                                <span>&nbsp;</span>
                                <span className="bg-blue">&nbsp;</span>
                                <span>&nbsp;</span>
                                <span>&nbsp;</span>
                                <span>&nbsp;</span>
                            </>
                            }
                            {this.props.globalEvaluation.value === 0 &&
                            <>
                                <span>&nbsp;</span>
                                <span>&nbsp;</span>
                                <span className="bg-blue">&nbsp;</span>
                                <span>&nbsp;</span>
                                <span>&nbsp;</span>
                            </>
                            }
                            {this.props.globalEvaluation.value === 1 &&
                            <>
                                <span>&nbsp;</span>
                                <span>&nbsp;</span>
                                <span>&nbsp;</span>
                                <span className="bg-blue">&nbsp;</span>
                                <span>&nbsp;</span>
                            </>
                            }
                            {this.props.globalEvaluation.value === 2 &&
                            <>
                                <span>&nbsp;</span>
                                <span>&nbsp;</span>
                                <span>&nbsp;</span>
                                <span>&nbsp;</span>
                                <span className="bg-blue">&nbsp;</span>
                            </>
                            }
                  </span>
                    </h5>
                    {this.props.globalEvaluation.value === -2 &&
                    <>
                        <p className="card-text ml-n1"> Negativ </p>
                        <p className="card-text ml-n1">
                            Die Aktie ist seit dem {formatDate(this.props.globalEvaluation.date)} als negativ eingestuft
                        </p>
                    </>
                    }
                    {this.props.globalEvaluation.value === -1 &&
                    <>
                        <p className="card-text ml-n1"> Eher negativ </p>
                        <p className="card-text ml-n1">
                            Die Aktie ist seit dem {formatDate(this.props.globalEvaluation.date)} als eher negativ eingestuft
                        </p>
                    </>
                    }
                    {this.props.globalEvaluation.value === 0 &&
                    <>
                        <p className="card-text ml-n1"> Neutral </p>
                        <p className="card-text ml-n1">
                            Die Aktie ist seit dem {formatDate(this.props.globalEvaluation.date)} als neutral eingestuft
                        </p>
                    </>
                    }
                    {this.props.globalEvaluation.value === 1 &&
                    <>
                        <p className="card-text ml-n1"> Eher positiv </p>
                        <p className="card-text ml-n1">
                            Die Aktie ist seit dem {formatDate(this.props.globalEvaluation.date)} als eher positiv
                            eingestuft
                        </p>
                    </>
                    }
                    {this.props.globalEvaluation.value === 2 &&
                    <>
                        <p className="card-text ml-n1"> Positiv </p>
                        <p className="card-text ml-n1">
                            Die Aktie ist seit dem {formatDate(this.props.globalEvaluation.date)} als positiv eingestuft
                        </p>
                    </>
                    }
                </div>
            </div>

        );
    }
}

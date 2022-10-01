import React, {Component, useState} from "react";
import {InstrumentGroup} from "../../../../../generated/graphql";
import {Accordion, Button, Card} from "react-bootstrap";
import classNames from "classnames";

class TechnicalKeyFiguresSignalDummy extends Component<any, any> {
    render() {
        return (
            <>
                <div className="table-like-row border-top">
                    <div className="mb-1">Stochastik schneidet Signallinie</div>
                    <div className="d-flex justify-content-between">
                        <span className="small-round-tag bg-green">long</span>
                        <span className="text-green">+0,40%</span>
                        <span>25.08.2015</span>
                    </div>
                </div>
                <div className="table-like-row border-top">
                    <div className="mb-1">RSI überverkauft</div>
                    <div className="d-flex justify-content-between">
                        <span className="small-round-tag bg-green">long</span>
                        <span className="text-pink">-3,60%</span>
                        <span>25.08.2015</span>
                    </div>
                </div>
                <div className="table-like-row border-top">
                    <div className="mb-1">Stochastik schneidet Signallinie</div>
                    <div className="d-flex justify-content-between">
                        <span className="small-round-tag bg-green">long</span>
                        <span className="text-green">+0,76%</span>
                        <span>25.08.2015</span>
                    </div>
                </div>
                <div className="table-like-row border-top">
                    <div className="mb-1">Stochastik überverkauft</div>
                    <div className="d-flex justify-content-between">
                        <span className="small-round-tag bg-pink">short</span>
                        <span className="text-pink">-0,17%</span>
                        <span>25.08.2015</span>
                    </div>
                </div>
            </>
        );
    }
}

export const TechnicalKeyFiguresSignals = (props: TechnicalKeyFiguresSignalsProps) => {
    let [state, setState] = useState<TechnicalKeyFiguresSignalsState>({period: 'YESTERDAY'});

    return (
        <div className="content wb-m col">
            <div className="coming-soon-component technical-key-figures-section">
                <span className="text-white fs-18px coming-soon-text w-100 d-flex justify-content-center ">Coming soon...</span>
            </div>
            <div className="top-wrapper d-md-flex d-lg-flex d-xl-block d-sm-block justify-content-lg-between">
                <div className="d-flex justify-content-between">
                    <h3 className="content-wrapper-heading font-weight-bold ml-sm-2 ml-md-0">Technische Handelssignale</h3>
                </div>
                <div className="sub-navigation d-flex justify-content-between margin-bottom-15 ml-sm-2 ml-md-0">
                    <div className="nav-wrapper nav d-block" role="tablist">
                        <Button variant="link"
                                className={classNames("fnt-size-16 font-weight-bold text-blue", state.period === 'YESTERDAY' ? 'active': '')}
                                onClick={() => setState({...state, period: 'YESTERDAY'})}
                            >Gestern</Button>
                        <Button variant="link"
                                className={classNames("fnt-size-16 font-weight-bold text-blue", state.period === 'DAY5' ? 'active': '')}
                                onClick={() => setState({...state, period: 'DAY5'})}
                            >5 Tage</Button>
                        <Button variant="link"
                                className={classNames("fnt-size-16 font-weight-bold text-blue", state.period === 'MONTH1' ? 'active': '')}
                                onClick={() => setState({...state, period: 'MONTH1'})}
                            >1Monat</Button>
                        <Button variant="link"
                                className={classNames("fnt-size-16 font-weight-bold text-blue", state.period === 'MONTH3' ? 'active': '')}
                                onClick={() => setState({...state, period: 'MONTH3'})}
                            >Quartal</Button>
                    </div>
                </div>
            </div>

            <div className="content">
                <Accordion defaultActiveKey={"Oscillators"}>
                    <Card className="border-0">
                        <Card.Header className="bg-border-gray border-0 p-0">
                            <Accordion.Toggle as={'span'} eventKey={"Oscillators"}
                                              className="d-block position-relative collapsible-link text-body font-weight-bold p-10px">
                                Oszillatoren
                                <i className="drop-arrow right-float-arrow border-blue"/>
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="Oscillators">
                            <Card.Body className="mx-sm-2 mx-md-0">
                                <TechnicalKeyFiguresSignalDummy/>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card className="border-0">
                        <Card.Header className="bg-border-gray border-0 p-0">
                            <Accordion.Toggle as={'span'} eventKey={"TrendFollowers"}
                                              className="d-block position-relative collapsible-link text-body font-weight-bold p-10px">
                                Trendfolger
                                <i className="drop-arrow right-float-arrow border-blue"/>
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="TrendFollowers">
                            <Card.Body className="mx-sm-2 mx-md-0">
                                <TechnicalKeyFiguresSignalDummy/>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                    <Card className="border-0">
                        <Card.Header className="bg-border-gray border-0 p-0">
                            <Accordion.Toggle as={'span'} eventKey={"Candlesticks"}
                                              className="d-block position-relative collapsible-link text-body font-weight-bold p-10px">
                                Candlesticks
                                <i className="drop-arrow right-float-arrow border-blue"/>
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="Candlesticks">
                            <Card.Body className="mx-sm-2 mx-md-0">
                                <TechnicalKeyFiguresSignalDummy/>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                    <Card className="border-0">
                        <Card.Header className="bg-border-gray border-0 p-0">
                            <Accordion.Toggle as={'span'} eventKey={"TrendDeterminers"}
                                              className="d-block position-relative collapsible-link text-body font-weight-bold p-10px">
                                Trendbestimmer
                                <i className="drop-arrow right-float-arrow border-blue"/>
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="TrendDeterminers">
                            <Card.Body className="mx-sm-2 mx-md-0">
                                <TechnicalKeyFiguresSignalDummy/>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>
        </div>
    );
}

interface TechnicalKeyFiguresSignalsProps {
    instrumentGroup: InstrumentGroup;
}

interface TechnicalKeyFiguresSignalsState {
    period: string;
}

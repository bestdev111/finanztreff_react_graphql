import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { AnalysesGridComponent } from "components/analyses/AnalysesGridComponent";
import SvgImage from "components/common/image/SvgImage";
import { AnalysisRecommendation, Query } from "generated/graphql";
import { loader } from "graphql.macro";
import { useState } from "react";
import { Button, Row, Spinner } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {guessInfonlineSection, trigInfonline} from "../../InfonlineService";

export function AnalysesGridWithFilters(props: { group: any, className?: string }) {
    const [state, setState] = useState<AnalysesPageState>({
        isin: props.group.isin,
        institutes: null,
        targetFrom: null,
        targetTo: null,
        updated: null,
        timeFrame: null,
        recommendation: null,
    });

    let { loading, data, fetchMore } = useQuery<Query>(
        loader('./getAnalyses.graphql'),
        {
            variables: {
                first: ANALYSES_PAGE_SIZE, after: null,
                isin: state.isin, institutes: state.institutes,
                targetFrom: state.targetFrom ? state.targetFrom.format('YYYY-MM-DD') : null,
                targetTo: state.targetTo ? state.targetTo.format('YYYY-MM-DD') : null,
                timeFrame: state.timeFrame, updated: state.updated, recommendation: state.recommendation
            }
        }
    );
    return (
        <>
        <section className="main-section">
            <div className="container">
                <div className="heading-with-info justify-content-between align-items-center">
                    <h2 className="section-heading font-weight-bold mb-1 ml-2">
                        <span>Aktuelle Analysen</span>
                    </h2>
                    <div className={classNames("buttons-in-results analyses d-lg-flex justify-content-between align-items-center ml-md-n2", props.className || "")}>
                        <div className="d-sm-flex first-section">
                        <div className="pr-3 pl-sm-3 py-sm-1">
                            <Button variant={'inline'}
                                className={classNames('analyse-positive-button', state.recommendation &&
                                            state.recommendation === AnalysisRecommendation.Positive ? "active" : '')}
                                        onClick={() => setState({
                                            ...state,
                                            recommendation:
                                                state.recommendation === AnalysisRecommendation.Positive ?
                                                    null : AnalysisRecommendation.Positive
                                        })
                                        }
                                    >
                                        Positiv
                                    </Button>
                                    <Button variant={'inline'}
                                        className={classNames('analyse-neutral-button', state.recommendation &&
                                            state.recommendation === AnalysisRecommendation.Neutral ? "active" : '')}
                                onClick={() => setState({
                                        ...state,
                                        recommendation:
                                            state.recommendation === AnalysisRecommendation.Neutral ?
                                                null : AnalysisRecommendation.Neutral
                                    })
                                }
                            >
                                Neutral
                            </Button>
                            <Button variant={'inline'}
                                    className={classNames('analyse-negative-button', state.recommendation &&
                                        state.recommendation === AnalysisRecommendation.Negative ? "active" : '')}
                                onClick={() =>
                                    setState({
                                        ...state,
                                        recommendation:
                                            state.recommendation === AnalysisRecommendation.Negative ?
                                                null : AnalysisRecommendation.Negative
                                    })
                                }
                            >
                                Negativ
                            </Button>
                        </div>

                        <div className="px-3">
                            <Button className={state.timeFrame === 6 ? "active" : ''} variant={'inline'}
                                    onClick={() => setState({
                                        ...state, timeFrame: state.timeFrame === 6 ? null : 6 }
                                    )}
                            >
                                <span className="hide-on-mobile">6 Monaten</span>
                                <span className="d-lg-none">6 M</span>
                            </Button>
                            <Button className={state.timeFrame === 12 ? "active" : ''} variant={'inline'}
                                    onClick={() => setState({
                                        ...state, timeFrame: state.timeFrame === 12 ? null : 12 }
                                    )}
                            >
                                <span className="hide-on-mobile">12 Monaten</span>
                                <span className="d-lg-none">12 M</span>
                            </Button>
                        </div>
                        </div>

                        <div className="pl-3 py-sm-1 second-section">
                            <Button className={state.updated ? "btn active" : "btn"} variant={'inline'}
                                    style={{ height: "30px" }}
                                    onClick={() => setState({
                                        ...state, updated: state.updated ? null : true
                                    })}
                                >
                                    <span className="text-nowrap">
                                        <img className="active-img"
                                            src={process.env.PUBLIC_URL + "/static/img/svg/icon_alert_white.svg"}
                                            style={{ marginTop: "-3px" }}
                                            width="20"
                                            alt="search news icon" />
                                        <img className="inactive-img"
                                            src={process.env.PUBLIC_URL + "/static/img/svg/icon_alert_red.svg"}
                                            width="20"
                                            style={{ marginTop: "-3px" }}
                                            alt="search news icon" />
                                        Nur Analysen mit Update
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="main-section">
                <div className="container">
                    {(loading) ?
                        <Row style={{ height: "50px" }} className="d-flex justify-content-center pt-2">
                            <Spinner animation="border" />
                        </Row> :
                        <>
                        <AnalysesGridComponent analyses={data?.analysisSearch?.edges.map(current => current.node) || []} />
                            {data && data.analysisSearch.pageInfo?.hasNextPage && 
                        <Row>
                            <div className="col-md-4 offset-md-4 col-12">
                                <div className="text-center">
                                    <Button variant="link" onClick={() => {
                                        trigInfonline(guessInfonlineSection(), 'analysenKursziele');
                                        if (!loading && data?.analysisSearch?.pageInfo?.endCursor) {
                                            if (fetchMore) {
                                                fetchMore({
                                                    variables: {
                                                        first: 9,
                                                        after: data.analysisSearch.pageInfo.endCursor,
                                                    }
                                                })
                                            }
                                        }

                                    }}>
                                        Mehr anzeigen
                                        <SvgImage spanClass="top-move" icon="icon_direction_down_blue_light.svg" width={"27"} imgClass="svg-primary" />
                                    </Button>
                                </div>
                            </div>
                            </Row>
                            }
                            <div className="d-flex justify-content-end mt-sm-5 mb-2 ml-auto mr-lg-0 mr-xl-0 mr-md-0 mr-sm-3">
                                <NavLink to="/analysen">
                                    <Button>Alle Analysen</Button>
                                </NavLink>
                            </div>
                        </>
                    }
                </div>
            </section>
        </>
    );
}

interface AnalysesPageState {
    isin: string[] | null;
    institutes: string[] | null;
    targetFrom: moment.Moment | null;
    targetTo: moment.Moment | null;
    updated: boolean | null;
    timeFrame: number | null;
    recommendation: AnalysisRecommendation | null;
}

const ANALYSES_PAGE_SIZE = 6;

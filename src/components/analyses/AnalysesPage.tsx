import {useQuery} from "@apollo/client";
import {AnalysesGridComponent} from "./AnalysesGridComponent";
import InfiniteScroll from "components/common/scroller/InfiniteScroller";
import {AnalysisRecommendation, Query} from "generated/graphql";
import {loader} from "graphql.macro";
import React, {useEffect, useState} from "react";
import {Breadcrumb, Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {SimpleAssetSelectorComponent} from "../layout/filter/SearchStringSelectorComponent/SimpleAssetSelectorComponent";
import moment from "moment";
import {AnalysisPeriodComponent} from "./AnalysisPeriodContentComponent/AnalysisPeriodContentComponent";
import {InstituteSelectorComponent} from "./InstituteSelectorComponent/InstituteSelectorComponent";
import './AnalysesPage.scss';
import classNames from "classnames";
import {guessInfonlineSection, trigInfonline} from "../common/InfonlineService";
import {Helmet} from "react-helmet";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from "components/common/TargetingService";
import keycloak from "keycloak";

interface AnalysesPageState {
    isin: string[] | null;
    institutes: string[] | null;
    targetFrom: moment.Moment | null;
    targetTo: moment.Moment | null;
    updated: boolean | null;
    timeFrame: number | null;
    recommendation: AnalysisRecommendation | null;
}

const ANALYSES_PAGE_SIZE = 18;
export function AnalysesPage() {
    const [state, setState] = useState<AnalysesPageState>({
        isin: null,
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

    const loadMoreAnalyses = () => {
        if (!!data?.analysisSearch?.pageInfo) {
            const endCursor = data.analysisSearch.pageInfo?.endCursor;
            fetchMore && fetchMore({variables: {after: endCursor}})
        }
    }

    useEffect(() => {
        trigInfonline(guessInfonlineSection(), "analysen_page");
    }, [])

    return (
        <div className="page-container analysis-page analysis-page-wrapper">
            <Helmet>
                <title>finanztreff.de - Analysen | Übersicht | Fundamental</title>
                <meta name="description"
                      content= "Analysen im Überblick: Fundamentale Analysen, Positiv, Negativ und Kursziele ➨ auf finanztreff.de topaktuell und kostenlos!"/>
                <meta name="keywords"
                      content="Aktienanalysen, Fundamentalanalysen, Fundamentale Analysen, Analysen"/>
                <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated),null,null,null, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
            </Helmet>
            <Container className="page-header px-1 py-2">
                <Row>
                    <Col>
                        <Container>
                            <Breadcrumb>
                                <Breadcrumb.Item href="#">Analysen</Breadcrumb.Item>
                                <Breadcrumb.Item href="#">Fundamentale Analysen</Breadcrumb.Item>
                            </Breadcrumb>
                            <h1 className="font-weight-bold text-light analysis-page-heading page-title mb-5">Fundamentale Analysen</h1>
                            <Row>
                                <Col xl={6} md={12} xs={12} className="px-2">
                                    <SimpleAssetSelectorComponent
                                        title={"Name, ISIN, WKN"}
                                        onSelect={(v) => {
                                            trigInfonline(guessInfonlineSection(), "analyses_search");
                                            setState({
                                                ...state,
                                                isin: v?.asset?.isin ? [v.asset.isin] : null,
                                                institutes: null,
                                                targetFrom: null,
                                                targetTo: null,
                                                updated: null,
                                                timeFrame: null,
                                                recommendation: null,
                                            })
                                        }}
                                    />
                                </Col>
                                <Col xl={3} md={6} xs={6} className="px-2">
                                    <InstituteSelectorComponent
                                        name={"Analyse-Institut"}
                                        onSelect={(v) => {
                                            trigInfonline(guessInfonlineSection(), "analyses_search");
                                            setState({
                                                ...state,
                                                institutes: v?.institute?.id ? [v.institute.id] : null
                                            })
                                        }}
                                    />
                                </Col>
                                <Col xl={3} md={6} xs={6} className="px-2">
                                    <AnalysisPeriodComponent
                                        onSelect={(v) => {
                                            trigInfonline(guessInfonlineSection(), "analyses_search");
                                            if (v.type && v.date ) {
                                                setState({
                                                    ...state,
                                                    targetFrom: v.type === 'from' ? v.date : null,
                                                    targetTo: v.type === 'to'? v.date : null,
                                                })
                                            } else {
                                                setState({
                                                    ...state,
                                                    targetFrom: null, targetTo:  null
                                                })

                                            }
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
            <section className="main-section">
                <div className="container">
                    <div className="heading-with-info justify-content-between align-items-center">
                        <h2 className="section-heading font-weight-bold mb-1">
                            <span>Ergebnisse</span>
                        </h2>
                        <div className="buttons-in-results d-flex justify-content-between align-items-center analyses">
                            <div className="pr-3">
                                <Button variant={'inline'}
                                    className={classNames('analyse-positive-button', state.recommendation &&
                                                state.recommendation === AnalysisRecommendation.Positive ? "active" : '')}
                                    onClick={() => {
                                        trigInfonline(guessInfonlineSection(), "positive")
                                        setState({
                                            ...state,
                                            recommendation:
                                                    state.recommendation === AnalysisRecommendation.Positive ?
                                                        null : AnalysisRecommendation.Positive
                                        })
                                    }}
                                >
                                    Positiv
                                </Button>
                                <Button variant={'inline'}
                                    className={classNames('analyse-neutral-button', state.recommendation &&
                                                state.recommendation === AnalysisRecommendation.Neutral ? "active" : '')}
                                    onClick={() => {
                                        trigInfonline(guessInfonlineSection(), "neutral")
                                        setState({
                                            ...state,
                                            recommendation:
                                                state.recommendation === AnalysisRecommendation.Neutral ?
                                                    null : AnalysisRecommendation.Neutral
                                        })
                                    }}
                                >
                                    Neutral
                                </Button>
                                <Button variant={'inline'}
                                        className={classNames('analyse-negative-button', state.recommendation &&
                                            state.recommendation === AnalysisRecommendation.Negative ? "active" : '')}
                                    onClick={() => {
                                        trigInfonline(guessInfonlineSection(), "negative")
                                        setState({
                                            ...state,
                                            recommendation:
                                                state.recommendation === AnalysisRecommendation.Negative ?
                                                    null : AnalysisRecommendation.Negative
                                        })
                                    }}
                                >
                                    Negativ
                                </Button>
                            </div>

                            <div className="px-3">
                                <Button className={state.timeFrame === 6 ? "active" : ''} variant={'inline'}
                                        onClick={() => {
                                            trigInfonline(guessInfonlineSection(), "six_months")
                                            setState({
                                                    ...state, timeFrame: state.timeFrame === 6 ? null : 6
                                                }
                                            )
                                        }}
                                >
                                    <span className="hide-on-mobile">6 Monaten</span>
                                    <span className="d-lg-none">6 M</span>
                                </Button>
                                <Button className={state.timeFrame === 12 ? "active" : ''} variant={'inline'}
                                        onClick={() => {
                                            trigInfonline(guessInfonlineSection(), "twelve_months")
                                            setState({
                                                    ...state, timeFrame: state.timeFrame === 12 ? null : 12
                                                }
                                            )
                                        }}
                                >
                                    <span className="hide-on-mobile">12 Monaten</span>
                                    <span className="d-lg-none">12 M</span>
                                </Button>
                            </div>

                            <div className="pl-3 hide-on-mobile">
                                <Button className={state.updated ? "btn active" : "btn"} variant={'inline'}
                                        style={{ height: "30px" }}
                                        onClick={() => {
                                            trigInfonline(guessInfonlineSection(), "analyses_with_updates")
                                            setState({
                                                ...state, updated: state.updated ? null : true
                                            })
                                        }}
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
            <InfiniteScroll
                dataLength={data?.analysisSearch?.edges?.length || 0}
                next={() => loadMoreAnalyses()}
                hasMore={!!data?.analysisSearch?.pageInfo?.hasNextPage}
                loader={
                    <div className="text-center py-2">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Bitte warten... ()</span>
                        </Spinner>
                    </div>
                }
            >
                <div className="px-2">
                    {loading ?
                        <div className="text-center py-2">
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Bitte warten...</span>
                            </Spinner>
                        </div> :
                        <AnalysesGridComponent
                            analyses={data?.analysisSearch?.edges.map(current => current.node) || []}
                        />
                    }
                </div>
            </InfiniteScroll>
        </div>
    );
}

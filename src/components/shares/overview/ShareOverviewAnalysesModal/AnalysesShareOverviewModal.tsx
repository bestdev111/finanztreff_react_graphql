import { useQuery } from "@apollo/client";
import { AnalysesGridComponent } from "components/analyses/AnalysesGridComponent";
import SvgImage from "components/common/image/SvgImage";
import { AnalysisRecommendation, InstrumentGroup, Query } from "generated/graphql";
import { loader } from "graphql.macro";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import moment from "moment";
import {ReactNode, useEffect, useState} from "react";
import { Button, Modal, Row, Spinner } from "react-bootstrap";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

export const AnalysesShareOverviewModal = (props: AnalysesShareOverviewModalProps) => {
    let [modalState, updateModalState] = useState(false);

    const analysisItemSize = useBootstrapBreakpoint({
        xl: 9,
        md: 4,
        sm: 3,
        default: 3
    });

    const [state, setState] = useState<AnalysesShareOverviewModalState>({
        updated: null,
        recommendation: null,
    });

    let { loading, data, fetchMore } = useQuery<Query>(
        loader('./getAnalysesShareOverviewModal.graphql'),
        {
            variables: {
                instrumentGroupId: props.instrumentGroup.id,
                from: moment().subtract(1, 'month').startOf('day'),
                first: analysisItemSize, after: null,
            },
            skip: !modalState
        }
    );

    let [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        if (modalState) {
            trigInfonline(guessInfonlineSection(), "stock_analysis_index");
        }
    }, [modalState])

    if (loading) {
        return (
            <div className="text-center py-2">
                <Spinner animation="border" />
            </div>);
    }

    const loadMoreData = () => {
        trigInfonline(guessInfonlineSection(), 'stock_analysis_index');
        if (!loading && data?.group?.analysis?.pageInfo?.endCursor) {
            const endCursor = data.newsSearch?.pageInfo?.endCursor;
            setLoadingMore(true);
            fetchMore &&  fetchMore({
                variables: {
                    first: 9,
                    after: data.group?.analysis?.pageInfo.endCursor,
                }
            }).finally(() => setLoadingMore(false));
        }
    }

    return (
        <>
            <div className="cursor-pointer" onClick={() => updateModalState(true)}>{props.children}</div>
            <Modal show={modalState} onHide={() => updateModalState(false)} className="modal pl-0 modal-dialog-sky-placement" >
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="row row-cols-1">
                            <div className="col d-flex justify-content-between">
                                <h5 className="modal-title">Aktien-Analysen - {props.instrumentGroup.name}</h5>
                                <button type="button" className="close text-blue" onClick={() => updateModalState(false)} data-dismiss="modal" aria-label="Schliessen">
                                    <span>schließen</span>
                                    <span className="close-modal-butt svg-icon">
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_blue.svg"} alt="" width="27" className="svg-blue" />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-body mobile-modal-body">
                    <section className="main-section index-component">
                        <div className="container">
                            <div className="content-row filters-in-modal-analyses">
                                {/* <section className="main-section">
                                    <div className="container">
                                        <div className="heading-with-info justify-content-between align-items-center">
                                            <h2 className="section-heading font-weight-bold mb-1 ml-2">
                                                <span>Aktuelle Analysen</span>
                                            </h2>
                                            <div className="buttons-in-results analyses d-lg-flex justify-content-between align-items-center ml-md-n2">
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
                                 */}
                                <section className="main-section">
                                    <div className="container">
                                        <AnalysesGridComponent analyses={data?.group?.analysis?.edges.map(current => current.node) || []} />
                                        {  (loading || loadingMore) ?
                                            <Row style={{ height: "50px" }} className="d-flex justify-content-center pt-2">
                                                <Spinner animation="border" />
                                            </Row> :
                                            <Row>
                                                <div className="col-md-4 offset-md-4 col-12">
                                                    <div className="text-center">
                                                        {(data?.group?.analysis.edges || []).length > 0 &&
                                                            <Button variant="link" onClick={() => {
                                                                loadMoreData()
                                                            }}>
                                                                Mehr anzeigen
                                                                <SvgImage spanClass="top-move" convert={false}
                                                                    icon="icon_direction_down_dark.svg"
                                                                    imgClass="svg-primary" />
                                                            </Button>
                                                        }
                                                    </div>
                                                </div>
                                            </Row>
                                        }
                                    </div>
                                </section>

                            </div>
                        </div>
                    </section>
                </div>
            </Modal>
        </>
    );
}

export interface AnalysesShareOverviewModalProps {
    instrumentGroup: InstrumentGroup;
    children?: ReactNode;
}

interface AnalysesShareOverviewModalState {
    updated: boolean | null;
    recommendation: AnalysisRecommendation | null;
}

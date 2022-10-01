import { useQuery } from "@apollo/client";
import { Query, TheScreenerRatingChange } from "generated/graphql";
import { loader } from "graphql.macro";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import { ReactNode, useState } from "react";
import { Modal, Row, Spinner } from "react-bootstrap";
import StackGrid from "react-stack-grid";
import { formatDate } from "utils";
import ShareScreenerRatingCard from "./ShareScreenerRatingCard";

export const ShareScreenerRatingModal = (props: ShareScreenerRatingModalProps) => {
    let [modalState, updateModalState] = useState(false);

    const analysisItemSize = useBootstrapBreakpoint({
        xl: 24,
        md: 24,
        sm: 12,
        default: 3
    });

    let { loading, data } = useQuery<Query>(
        loader('./theScreenerRatingSearchUpdate.graphql'),
        {
            variables: {
                first: analysisItemSize,
                change: props.change,
                instrumentGroupId: props.instrumentGroupId
            },
            skip: !modalState
        }
    );

    return (
        <>
            <div className="cursor-pointer" onClick={() => {updateModalState(true); props.onClickFunction && props.onClickFunction()}}>{props.children}</div>
            <Modal show={modalState} onHide={() => updateModalState(false)} className="modal pl-0 modal-dialog-sky-placement" >
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="row row-cols-1">
                            <div className="col d-flex justify-content-between">
                                <h5 className="modal-title">{props.title} {formatDate(data?.theScreenerRatingSearch[0].date)}</h5>
                                <button type="button" className="close text-blue" onClick={() => updateModalState(false)} data-dismiss="modal" aria-label="Schliessen">
                                    <span>schließen</span>
                                    <span className="close-modal-butt svg-icon">
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_blue.svg"} alt="" className="svg-convert svg-blue" />
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
                                <section className="main-section">
                                    <div className="container">
                                        {loading ?
                                            <div className="text-center py-2">
                                                <Spinner animation="border" size="sm" />
                                            </div>
                                            :
                                            <RatingGridComponent ratings={data?.theScreenerRatingSearch || []} />
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

export interface ShareScreenerRatingModalProps {
    change?: TheScreenerRatingChange;
    onClickFunction?: () => void;
    children?: ReactNode;
    title: string;
    instrumentGroupId?: number;
}

function RatingGridComponent(props: { ratings: any }) {
    const columnWidth = useBootstrapBreakpoint({
        xl: '25%',
        lg: '50%',
        sm: '100%'
    });

    return (
        <StackGrid columnWidth={columnWidth} monitorImagesLoaded={true}>
            {props.ratings.map((current: any, index: number) =>
                <div className="border-2 border-border-gray">
                    <ShareScreenerRatingCard previousRating={current.previousRating || 0}
                        updatedRating={current.rating || 0}
                        date={current.date}
                        instrumentGroup={current.group}
                        status={(current.rating && current.previousRating && current.rating > current.previousRating) ? "Upgrade" : "Downgrade"}
                        showStatus={true}
                        nameIsBold={true}
                    />
                </div>
            )}
        </StackGrid>

    );
}

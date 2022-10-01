import { useQuery } from "@apollo/client";
import { AnalysesGridComponent } from "components/analyses/AnalysesGridComponent";
import SvgImage from "components/common/image/SvgImage";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { loader } from "graphql.macro";
import { Query } from "graphql/types";
import moment from "moment";
import { ReactNode, useState } from "react";
import { Row, Spinner, Button, Modal } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export function AnalysesTitle({ isins }: { isins: string[] }) {
    const START_DATE = moment().startOf('day').format("YYYY-MM-DD");
    const END_DATE = moment().endOf('day').format("YYYY-MM-DD");

    let { loading, data } = useQuery<Query>(
        loader('./getDailyAnalysisCount.graphql'),
        { variables: { isins: isins, startDate: START_DATE, endDate: END_DATE }, skip: isins.length < 1 }
    );

    if (isins.length < 1) {
        return <></>;
    }

    if (!loading) {
        <div className="text-center py-2">
            <Spinner animation="border" />
        </div>
    }

    let countAnalysis = (data?.analysesIsinCount || []).reduce((a, b) => a + (b?.newsCount || 0), 0);

    return (
        <div className="mx-3">
            {
                countAnalysis > 0 ?
                    <AnalysisModal isins={isins}>
                        <Button variant="link" className="text-decoration-none">
                            <SvgImage icon={"icon_analysen_dark.svg"} convert={false} width="25" />
                            <span className="text-blue fs-36px align-middle font-weight-bold">{countAnalysis}</span>
                        </Button>
                        <div className="mt-n1 fs-18px">
                            Analysen Heute
                        </div>
                    </AnalysisModal>
                    :
                    <>
                        <Button variant="link" className="text-decoration-none" disabled>
                            <SvgImage icon={"icon_analysen_dark.svg"} convert={false} width="25" />
                            <span className="text-blue fs-36px align-middle font-weight-bold">{countAnalysis}</span>
                        </Button>
                        <div className="mt-n1 fs-18px">
                            Analysen Heute
                        </div>
                    </>
            }

            <div className="ml-2 mb-2 mt-2">
                <AnalysisModal isins={isins}>
                    <span className="fs-15px text-blue">Alle Analysen</span>
                </AnalysisModal>
            </div>
        </div>
    );
}

export function AnalysisModal(props: AnalysisModalProps) {
    const [isOpen, setOpen] = useState(false);
    const ANALYSES_PAGE_SIZE = 9;
    const START_DATE = moment().startOf('day');
    const END_DATE = moment().endOf('day');

    let { loading, data, fetchMore } = useQuery<Query>(
        loader('./getAnalyses.graphql'),
        {
            variables: {
                first: ANALYSES_PAGE_SIZE, after: null,
                isin: props.isins,
                targetFrom: props.daily ? START_DATE : null,
                targetTo: props.daily ? END_DATE : null
            }, skip: !isOpen
        }
    );
    return (
        <>
            <div className="cursor-pointer" onClick={() => setOpen(true)}>
                {props.children}
            </div>
            <Modal show={isOpen} onHide={() => setOpen(false)} size="xl" className="modal-background modal-dialog-sky-placement">
                <ModalHeaderMeinFinanztreff title="Analysen" close={() => setOpen(false)} />
                <Modal.Body className="bg-white">
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
                </Modal.Body>
            </Modal>
        </>
    );
}

interface AnalysisModalProps {
    children?: ReactNode;
    daily?: boolean;
    isins: string[];
}

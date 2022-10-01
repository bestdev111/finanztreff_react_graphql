import { useQuery } from "@apollo/client";
import SvgImage from "components/common/image/SvgImage";
import { NewsGridComponent } from "components/common/news/NewsGridComponent/NewsGridComponent";
import { loader } from "graphql.macro";
import { NewsCriteria, Query } from "graphql/types";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import moment from "moment";
import { useState } from "react";
import { Modal, Spinner, Row, Button } from "react-bootstrap";
import { ModalHeaderMeinFinanztreff } from "../ModalHeaderMeinFinanztreff";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

interface NewsModalContentProps {
    isOpen: boolean;
    close: () => void;
    isins: string[];
    daily?: boolean;
}

export function NewsModalContent(props: NewsModalContentProps) {
    const newsItemSize = useBootstrapBreakpoint({
        md: 6,
        sm: 3,
        default: 3
    })
    const START_DATE = moment().startOf('day');
    const END_DATE = moment().endOf('day');

    let [loadingMore, setLoadingMore] = useState(false);

    let { loading, data, fetchMore } = useQuery<Query>(
        loader('./getNewsModal.graphql'),
        {
            variables: {
                isins: props.isins, first: newsItemSize,
                intervalStart: props.daily ? START_DATE : null, intervalEnd: props.daily ? END_DATE : null
            }, skip: !props.isOpen
        }
    );

    const searchCriteria: NewsCriteria = {isin: props.isins}
    return (
        <Modal show={props.isOpen} onHide={!props.isOpen} className="modal-dialog-sky-placement modal-background">
            <div className="modal-content account-transaction-modal bg-white">
                <ModalHeaderMeinFinanztreff title="Nachrichten" close={props.close} />
                <Modal.Body className="modal-body bg-white modal-body-xs-news-profile">
                    <div className="p-0 bottom-feed pt-xl-3 pb-xl-1 mt-lg-n1">

                        <NewsGridComponent searchCriteria={searchCriteria} news={data?.newsSearch?.edges.map(current => current.node) || []} loading={loading} />
                        {
                            (loading || loadingMore)
                                ?
                                <div className="text-center py-2">
                                    <Spinner animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </div>
                                :
                                data?.newsSearch?.edges !== [] ?
                                    <Row>
                                        <div className="col-md-4 offset-md-4 col-12">
                                            <div className="text-center">
                                                <Button variant="link" onClick={() => {
                                                    trigInfonline(guessInfonlineSection(), "news_load_more_mf")
                                                    if (!loading && data?.newsSearch?.pageInfo?.endCursor) {
                                                        setLoadingMore(true);
                                                        fetchMore && fetchMore({
                                                            variables: { first: 6, after: data.newsSearch.pageInfo.endCursor }
                                                        }).finally(() => setLoadingMore(false));
                                                    }
                                                }}>
                                                    {data && data.newsSearch && data.newsSearch.pageInfo && data.newsSearch.pageInfo.hasNextPage &&
                                                        <>
                                                            Mehr anzeigen
                                                            <SvgImage spanClass="top-move" convert={false} width={"27"}
                                                                icon="icon_direction_down_blue_light.svg"
                                                                imgClass="svg-primary" />
                                                        </>
                                                    }
                                                </Button>
                                            </div>
                                        </div>
                                    </Row>
                                    : <></>
                        }
                    </div>
                </Modal.Body>
            </div>
        </Modal>);
}

import { useQuery } from "@apollo/client";
import SvgImage from "components/common/image/SvgImage";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { loader } from "graphql.macro";
import { NewsCriteria, NewsFeed, NewsTopic, Query } from "graphql/types";
import { useState } from "react";
import { Modal, Spinner, Row, Button } from "react-bootstrap";
import { NewsGridComponent } from "../NewsGridComponent/NewsGridComponent";
import "./NewsGridModal.scss"
import {guessInfonlineSection, trigInfonline} from "../../InfonlineService";

export function NewsGridModal({ topic, feed, title }: { topic?: NewsTopic, feed?: NewsFeed, title?: string }) {
    const [isOpen, setOpen] = useState<boolean>(false);

    const handleOpen = (value: boolean) => {
       trigInfonline(guessInfonlineSection(), "more_videos_modal_open");
        setOpen(value)
    };
    return (
        <>
            <div className="cursor-pointer" onClick={() => handleOpen(true)}>
                {topic &&
                    <span className="text-blue ml-1">Weitere Videos - {topic?.name}</span>
                }
            </div>
            <Modal show={isOpen} onHide={() => setOpen(false)} className="modal-dialog-sky-placement modal-background">
                <div className="modal-content bg-white">
                    <ModalHeaderMeinFinanztreff title={title ? title : "Nachrichten"} close={() => setOpen(false)} />
                    <ExposeModalBody feed={feed} topic={topic} />
                </div>
            </Modal>
        </>
    );
}

function ExposeModalBody(props: { topic?: NewsTopic, feed?: NewsFeed }) {
    let { loading, data, fetchMore } = useQuery<Query>(
        loader('./getNewsGridModal.graphql'),
        { variables: { first: 12, source: props.feed ? [props.feed] : null, topic: props.topic ? [props.topic.id] : null } }
    );

    let [loadingMore, setLoadingMore] = useState(false);

    const loadMoreNews = () => {
        trigInfonline(guessInfonlineSection(), "more_videos_modal");
        if (!loading && data?.newsSearch?.pageInfo?.endCursor) {
            const endCursor = data?.newsSearch?.pageInfo?.endCursor;
            setLoadingMore(true);
            if (fetchMore) {
                fetchMore({
                    variables: {
                        first: 12,
                        after: endCursor,
                    }
                }).finally(() => setLoadingMore(false))
            }
        }
    }

    const searchCriteria: NewsCriteria = {source: props.feed ? [props.feed] : null, topic: props.topic && props.topic.id ? [props.topic.id] : null}

    return (
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
                                        <Button variant="link" onClick={loadMoreNews}>
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
                            :
                            <></>
                }
            </div>
        </Modal.Body>
    )
}

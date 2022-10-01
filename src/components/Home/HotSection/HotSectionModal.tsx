import { useQuery } from "@apollo/client";
import { getAbsPercentChange } from "components";
import { HotSectionInstrumentCard } from "components/common/card/InstrumentCard/HotSectionInstrumentCard";
import SvgImage from "components/common/image/SvgImage";
import { Query } from "generated/graphql";
import { loader } from "graphql.macro";
import { useState } from "react";
import { Row, Col, Button, Modal, Spinner } from "react-bootstrap";
import { formatPrice } from "utils";
import {trigInfonline} from "../../common/InfonlineService";

export function HotSectionModal(props: { group: any, medianTrades: number, isSharePage: boolean }) {
    const [state, setState] = useState({ isOpen: false, searchString: "" });
    const { data, loading } = useQuery<Query>(loader('./getHotInstruments.graphql'), { variables: { id: "hot_instruments_ex", chartScope: 'INTRADAY' }, skip: !state.isOpen });    

    const openModal = () => setState({ ...state, isOpen: true });
    const closeModal = () => setState({ ...state, isOpen: false });

    return (
        <>
            <Row className={`button-row d-flex mt-lg-3 pb-3 pr-lg-2 ${props.isSharePage ? "mt-4" : "mt-0"}`} onClick={() => {
                trigInfonline('aktienuberblick', 'layer_aktien_hot_werte')
                openModal()
            }}>
                <Col className="d-flex justify-content-center justify-content-lg-end" xs={12}>
                    <Button variant="primary">HOT! Werte</Button>
                </Col>
            </Row>
            <Modal
                show={state.isOpen}
                onHide={closeModal}
                dialogClassName="index-finden-modal"
                className="p-0 modal-dialog-sky-placement"
            >
                <Modal.Header>
                    <Row className="row-cols-1">
                        <div className="col d-flex justify-content-between">
                            <Modal.Title>
                                <h5>
                                    <span>HOT! Werte</span>
                                </h5>
                            </Modal.Title>
                            <button type="button" className="close text-blue" onClick={closeModal}>
                                <span>schließen</span>
                                <SvgImage icon="icon_close_blue.svg" spanClass="close-modal-butt" width={"27"}
                                    imgClass="svg-blue" convert={false} />
                            </button>
                        </div>
                    </Row>
                </Modal.Header>
                <Modal.Body>
                {loading ?
                        <div className="text-center py-2">
                            <Spinner animation="border" role="status" style={{ color: "black" }}>
                            </Spinner>
                        </div>
                        :                    
                    <Row className="mx-0 d-flex">
                        {data?.list?.content && data.list.content.filter((current: any) => current.snapQuote !== null).map((current: any, index: number) =>
                            <Col lg={4} xl={3} xs={12} className="p-lg-2 p-sm-0" key={index}>
                                {current && current.group && current.snapQuote && current.group.id && state.isOpen
                                    && <HotSectionInstrumentCard
                                        name={current.group.name}
                                        id={current.id}
                                        group={current.group}
                                        displayPrice={formatPrice(current.snapQuote.quote?.value, current.group.assetGroup)}
                                        performance={current.snapQuote?.quote?.percentChange}
                                        currency={current.currency.displayCode}
                                        trend={getAbsPercentChange(current) > 1.0}
                                        interest={current.snapQuote?.cumulativeVolume > props.medianTrades}
                                        activity={false}
                                        snapQuote={current.snapQuote}
                                        chart={current.chart || undefined}
                                    />
                                }
                            </Col>
                        )
                        }
                    </Row>
                }
                </Modal.Body>
            </Modal>
        </>
    );
}

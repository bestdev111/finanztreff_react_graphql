import SvgImage from "components/common/image/SvgImage";
import { IndexFindInstrumentCard } from "components/index/FindIndexSection/IndexFindInstrumentCard";
import { Instrument } from "generated/graphql";
import {useEffect, useState} from "react";
import { Row, Col, Button, Modal } from "react-bootstrap";
import { formatPrice } from "utils";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";
import { CommodityFindInstrumentCard } from "./CommodityFindInstrumentCard";

export function FindCommodityModal(props: {commodities: Instrument[]}) {
    const [state, setState] = useState({ isOpen: false, searchString: "" });

    const openModal = () => setState({ ...state, isOpen: true });
    const closeModal = () => setState({ ...state, isOpen: false });

    useEffect(() => {
        if (state.isOpen) {
            trigInfonline(guessInfonlineSection(), "all_raw_materials");
        }
    }, [state.isOpen])

    return (
        <>
            <Row className="button-row d-flex mt-0 mt-lg-3 pb-3 pr-lg-2 mb-sm-4" onClick={() => openModal()}>
                <Col className="d-flex justify-content-center justify-content-lg-end" xs={12}>
                    <Button variant="primary">
                        Alle Rohstoffe
                    </Button>
                </Col>
            </Row>
            <Modal
                show={state.isOpen}
                onHide={closeModal}
                dialogClassName="index-finden-modal modal-dialog-sky-placement"
            >
                <Modal.Header>
                    <Row className="row-cols-1">
                        <div className="col d-flex justify-content-between">
                            <Modal.Title>
                                <h5>
                                    <span>Rohstoff Liste</span>
                                </h5>
                            </Modal.Title>
                            <button type="button" className="close text-blue" onClick={closeModal}>
                                <span>schließen</span>
                                <SvgImage icon="icon_close_blue.svg" spanClass="close-modal-butt" width={"27"}/>
                            </button>
                        </div>
                    </Row>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mx-0 d-flex">
                        {props.commodities.map((current: Instrument, index: number) =>
                            <Col lg={6} xl={3} xs={12} className="p-lg-2 p-sm-0" key={index}>
                                {current && current.group && current && current.group.id && current.snapQuote && current.chart
                                            && <CommodityFindInstrumentCard
                                                snapQuote={current.snapQuote}
                                                className="my-2"
                                                key={index}
                                                chart = {current.chart}
                                                displayPrice={formatPrice(current.snapQuote.quote?.value, current.group.assetGroup)}
                                                currency={current.currency.displayCode}
                                                name={current.group.name}
                                                id={current.id}
                                                group={current.group}
                                                line200dayValue={current.group.main?.indicators?.movingAverage?.deltaLine200Day}
                                                alltimeValue={current.group.main?.stats && current.group.main?.stats.find(current => current.period === 'ALL_TIME')?.deltaHighPrice}
                                                selected="line200day"
                                            />
                                }
                            </Col>
                        )
                        }
                    </Row>
                    {/* {
                            (loading || loadingMore)
                            ?
                            <div className="text-center py-2"><Spinner animation="border" /></div>
                            :
                            <div className="text-center">
                                        <Button variant="link"
                                        onClick={() => {
                                            if (data?.searchCrossRate?.pageInfo?.endCursor) {
                                                setLoadingMore(true);
                                                fetchMore({
                                                    variables: { first: 6, after: data.searchCrossRate.pageInfo.endCursor },
                                                }).finally(() => {
                                                    setLoadingMore(false);
                                                });
                                                
                                            }
                                        }}>
                                            Mehr anzeigen
                                            <SvgImage spanClass="top-move" convert={false}
                                                    icon="icon_direction_down_dark.svg"
                                                    imgClass="svg-primary"/>
                                        </Button>
                            </div>
                        } */}
                </Modal.Body>
            </Modal>
        </>
    )
}

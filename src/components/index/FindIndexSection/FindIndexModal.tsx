import { useQuery } from "@apollo/client";
import SvgImage from "components/common/image/SvgImage";
import { InstrumentEdge, Query } from "generated/graphql";
import { loader } from "graphql.macro";
import {useEffect, useState} from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import { CountriesAndRegionsFilter } from "./filters/CountriesAndRegionsFilter";
import { IndustriesFilter, IndustriesSelectOptionEvent, IndustriesSelectTypeEvent } from "./filters/IndustriesFilter";
import { IndexFindInstrumentCard } from "./IndexFindInstrumentCard";
import './FindIndexSection.scss';
import classNames from "classnames";
import { formatPrice } from "utils";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

interface FindIndexModalProps {
    buttonName?: string;
    className?: string;
    showCardFooter?: boolean;
    regionId?: number,
    region?: string,
    industryId?: number,
    industry?: string,
}

interface FindIndexModalState {
    isOpen: boolean,
    region?: string;
    regionId?: number;
    type?: string;
    typeId?: string;
    option?: string;
    optionId?: number;
    searchString?: string;
    loadingMore: boolean;
}

export function FindIndexModal(props: FindIndexModalProps) {

    const [state, setState] = useState<FindIndexModalState>({
        isOpen: false, region: props.region, regionId: props.regionId,
        type: "Alle", typeId: "", option: props.industry || "", optionId: props.industryId, searchString: "", loadingMore: false
    })

    const openModal = () => setState({...state, isOpen: true});
    const closeModal = () => setState({ ...state, isOpen: false, });

    const handleIndicesTypes = (type: IndustriesSelectTypeEvent, option: IndustriesSelectOptionEvent) => {
        trigInfonline(guessInfonlineSection(), "find_index_layer")
        setState({ ...state, typeId: type.id, type: type.name, optionId: option.id || 0, option: option.name })
    }
    const [loadingMore, setLoadingMore] = useState(false);

    let { loading, data, fetchMore } = useQuery<Query>(loader('./getInstrumentGroupSearchIndexPage.graphql'), {
        variables: {
            regionId: state.regionId ? state.regionId : null,
            sectorId: state.optionId ? state.optionId : null,
            first: 12, after: null
        },
        skip: !state.isOpen
    });

    useEffect(() => {
        if (state.isOpen) {
            trigInfonline(guessInfonlineSection(), "find_index_layer")
        }
    }, [state.isOpen])

    
    const loadMore = () => {
        trigInfonline(guessInfonlineSection(), "find_index_layer")

        if (!!data?.searchIndex?.pageInfo && data.searchIndex.pageInfo.hasNextPage) {
            setLoadingMore(true);
            const endCursor = data.searchIndex?.pageInfo.endCursor;
            fetchMore && fetchMore({variables: {after: endCursor}}).finally(() => setLoadingMore(false));
        }
    }

    return (
        <>
            <Row className={classNames(props.className, "button-row d-flex pr-lg-2")} onClick={() => openModal()}>
                <Col className="d-flex justify-content-center justify-content-lg-end" xs={12}>
                    <Button variant="primary">
                        {props.buttonName}
                    </Button>
                </Col>
            </Row>
            <Modal
                show={state.isOpen}
                onHide={closeModal}
                dialogClassName="index-finden-modal modal-dialog modal-dialog-sky-placement"
            >
                <Modal.Header>
                    <Row className="row-cols-1">
                        <div className="col d-flex justify-content-between">
                            <Modal.Title>
                                <h5>
                                    <span>Index Finden</span>
                                </h5>
                            </Modal.Title>
                            <button type="button" className="close text-blue" onClick={closeModal}>
                                <span>schließen</span>
                                <SvgImage icon="icon_close_blue.svg" width={"27"} spanClass="close-modal-butt"
                                    imgClass="svg-blue" convert={false} />
                            </button>
                        </div>
                    </Row>
                </Modal.Header>
                <Modal.Body className="mt-sm-2">
                    <div className="d-flex flex-wrap pt-lg-2 pl-2 justify-content-end" style={{ fontFamily: "Roboto" }}>
                        {/* <div className="flex-grow-1 m-auto pb-sm-2">
                            <input className="find-index-search-panel" placeholder={"Ergebnisse filtern..."} value={state.searchString?.toString() || ""}
                                onChange={control => setState({ ...state, searchString: control.target.value })}
                            />
                        </div> */}
                        <div className="filters-panel text-nowrap d-none d-xl-inline-flex">
                            <CountriesAndRegionsFilter
                                regionId={state.regionId}
                                region={state.region || ""}
                                onSelect={ev => {
                                    ev.name && trigInfonline(guessInfonlineSection(), "find_index_layer")
                                    setState({...state, region: ev.name, regionId: ev.id})
                                }}
                            />
                            <IndustriesFilter
                                onSelect={handleIndicesTypes}
                                industry={state.option || ""}
                                industryId={state.optionId || 0}
                            />
                            {/* <SortFilter
                                onSelect={ev => { }}
                            /> */}
                        </div>

                    </div>
                    {loading ? <div className="text-center py-2"><Spinner animation="border" /></div> :
                        data && data.searchIndex.edges.length > 0 ?
                            <>
                                <Row className="mx-0 d-flex">
                                    {data && data.searchIndex.edges.map((current: InstrumentEdge, index: number) =>
                                        <Col lg={6} xl={3} xs={12} className="p-lg-2 p-sm-0" key={index}>
                                            {current && current.node.group && current.node && current.node.group.id
                                                && <IndexFindInstrumentCard
                                                    snapQuote={current.node.snapQuote || undefined}
                                                    chart={current.node.group.main?.chart || undefined}
                                                    showCardFooter={true}
                                                    name={current.node.name}
                                                    id={current.node.id}
                                                    group={current.node.group}
                                                    country={current.node.group.refCountry?.name}
                                                    isoAlphaCode={current.node.group.refCountry?.isoAlpha3.toLowerCase()}
                                                    className="index-find-instrument-card"
                                                    displayPrice={formatPrice(current.node?.snapQuote?.quote?.value, current.node.group.assetGroup)}
                                                    currency={current.node?.currency.displayCode}
                                                />
                                            }
                                        </Col>
                                    )
                                    }
                                </Row>
                                {
                                    loadingMore ?
                                        <div className="text-center py-2"><Spinner animation="border" /></div>
                                        :
                                        data && data.searchIndex?.pageInfo?.hasNextPage &&
                                        <div className="text-center">
                                            <Button variant="link text-blue"
                                                onClick={loadMore}>
                                                Mehr anzeigen
                                                <SvgImage spanClass="top-move" convert={false} width={"27"}
                                                    icon="icon_direction_down_blue_light.svg"
                                                    imgClass="svg-primary" />
                                            </Button>
                                        </div>
                                }
                            </>
                            : <div className="text-center fs-16px font-weight-bold text-red">Keine weiteren Ergebnisse gefunden!</div>
                    }
                </Modal.Body>
            </Modal>
        </>
    )
}

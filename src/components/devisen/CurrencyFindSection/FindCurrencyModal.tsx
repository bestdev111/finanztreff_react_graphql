import { useQuery } from "@apollo/client";
import SvgImage from "components/common/image/SvgImage";
import { InstrumentEdge, Query } from "generated/graphql";
import { loader } from "graphql.macro";
import {useEffect, useState} from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
// import { CountriesAndRegionsFilter } from "./filters/CountriesAndRegionsFilter";
// import { IndustriesFilter, IndustriesSelectOptionEvent, IndustriesSelectTypeEvent } from "./filters/IndustriesFilter";
// import { IndexFindInstrumentCard } from "./IndexFindInstrumentCard";
import './FindIndexSection.scss';
import classNames from "classnames";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import { CurrencyEntriesDropdownComponent } from "../CurrencyPageDropdown/CurrencyEntriesDropdown";
import './CurrencyFindSection.scss'
import { SortFilter } from "components/index/FindIndexSection/filters/SortFilter";
import { DaysFilter } from "../Filters/DaysFilter";
import { CurrencyFindInstrumentCard } from "./CurrencyFindInstrumentCard";
import './FindCurrencyModal.scss'
import {getInfonlineTag, guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

interface FindIndexModalProps {
    buttonName?: string;
    className?: string;
    showCardFooter?: boolean;
    regionId?: number,
    region?: string,
    industryId?: number,
    industry?: string,
    idCurrency?: any,
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


interface CurrencyFindSectionState {
    idCurrency: string | null;
}

export function FindCurrencyModal(props: FindIndexModalProps) {
    const indexCardsBreakpoint = useBootstrapBreakpoint({
        xl: 6,
        md: 3,
        sm: 3,
        default: 3
    });


    const [state, setState] = useState<FindIndexModalState>({
        isOpen: false, region: props.region, regionId: props.regionId,
        type: "Alle", typeId: "", option: props.industry || "", optionId: props.industryId, searchString: "", loadingMore: false
    })

    const openModal = () => setState({
        ...state, isOpen: true, region: props.region, regionId: props.regionId,
        type: "Alle", typeId: "", option: props.industry || "", optionId: props.industryId,
    });
    const closeModal = () => {
        setState({ ...state, isOpen: false, });
    }
    const [state4, setState4] = useState<CurrencyFindSectionState>({idCurrency: props.idCurrency});
    const [loadingMore, setLoadingMore] = useState(false);
    const [direction, setDirection] = useState<boolean>();
    const [description, setDescription] = useState<string>();
    const [performance, setPerformance] = useState<string>();

    useEffect(() => {
        if (state.isOpen){
            trigInfonline(guessInfonlineSection(), "find_currency_modal");
        }
    }, [state.isOpen])

    let { loading, data, fetchMore } = useQuery<Query>(loader('./getCardPairsCrossRates.graphql'), {
        variables: {
            homeCurrencyCode: state4.idCurrency,
            first: 9, after: null
        },
        skip: !state.isOpen
    });
    const getValueForInfolineTag =()=> {
        let tagValue = "find_currency_";
        tagValue+= (state4.idCurrency)?.toLowerCase();
        return tagValue;
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
                dialogClassName="currency-finden-modal"
                id="find-currency-modal"
                className="modal-dialog-sky-placement"
            >
                <Modal.Header className="modal-header-fix">
                    <Row className="row-cols-1">
                        <div className="col d-flex justify-content-between">
                            <Modal.Title>
                                {/* <h5 className="section-heading font-weight-bold button-styling">Devisen - <CurrencyEntriesDropdownComponent name={""}
                        hasAllButton ={true}
                        description={props.idCurrency}
                        onSelect={(v) => {
                            if(v?.institute){
                                setState4({
                                    idCurrency: v?.institute?.name.slice(0, 3).toUpperCase() ? v.institute.name.slice(0, 3).toUpperCase() : props.idCurrency,
                                    
                                })
                            }else{
                            setState4({
                                idCurrency: props.idCurrency,
                            })}
                        }}/>
                                </h5> */}
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
                    <div className="flex-grow-1 m-auto pb-sm-2">
                                <h5 className="fix-line-height section-heading font-weight-bold button-styling">Devisen -</h5><CurrencyEntriesDropdownComponent toggleVariant="fix-modal-dropdown" name={""}
                                hasAllButton ={true}
                                description={props.idCurrency}
                                onSelect={(v) => {
                                    if(v?.institute){
                                        trigInfonline(guessInfonlineSection(),getInfonlineTag(guessInfonlineSection(), 'find_currency') + '_' + v?.institute?.id.toUpperCase());
                                        setState4({
                                            idCurrency: v?.institute?.name.slice(0, 3).toUpperCase() ? v.institute.name.slice(0, 3).toUpperCase() : null,
                                            
                                        })
                                    }else{
                                        trigInfonline(guessInfonlineSection(), "find_currency_alle");
                                        setState4({
                                        idCurrency: props.idCurrency,
                                    })}
                                }}
                                />
                            </div>
                        <div className="filters-panel text-nowrap d-none d-xl-inline-flex">
                            <SortFilter
                                    onSelect={() => trigInfonline(guessInfonlineSection(), "find_currency_modal")}
                                    options={["Name", "Performance"]}
                                    direction={direction}
                                    description={description}
                            />
                            <DaysFilter
                                onSelect={() => trigInfonline(guessInfonlineSection(), "find_currency_modal")}
                                performance={performance}
                            />
                        </div>

                    </div>
                    {loading ? <div className="text-center py-2"><Spinner animation="border" /></div> :
                        data && data.searchCrossRate.edges.length > 0 ?
                            <>
                                <Row className="mx-0 d-flex">
                                    {data && data.searchCrossRate.edges.map((current: InstrumentEdge, index: number) =>
                                        <Col lg={6} xl={4} xs={12} className="p-lg-2 p-sm-0" key={index}>
                                            {current && current.node.group && current.node && current.node.group.id && current.node.group.main
                                                && 
                                                
                                                <CurrencyFindInstrumentCard
                                                snapQuote={current.node.snapQuote || undefined}
                                                chart={current.node.group.main.chart || undefined}
                                                showCardFooter={true}
                                                name={current.node.name}
                                                id={current.node.id}
                                                chartScope={"INTRADAY"}
                                                group={current.node.group}
                                                country={current.node.group.main?.country?.name}
                                                isoAlphaCode={current.node.group.main?.country?.isoAlpha3.toLowerCase()}
                                                className="currency-find-instrument-card"
                                                fontSize={"fs-22px"}
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
                                        data && data.searchCrossRate?.pageInfo?.hasNextPage &&
                                        <div className="text-center">
                                            <Button variant="link"
                                                onClick={() => {
                                                    trigInfonline(guessInfonlineSection(), getValueForInfolineTag());
                                                    if (!loading && data?.searchCrossRate?.pageInfo?.endCursor) {
                                                        setLoadingMore(true);
                                                        if (fetchMore) {
                                                            fetchMore({
                                                                variables: {
                                                                    first: indexCardsBreakpoint,
                                                                    after: data.searchCrossRate?.pageInfo.endCursor,
                                                                }
                                                            })
                                                                .finally(() => setLoadingMore(false));
                                                        }
                                                    }
                                                }}>
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

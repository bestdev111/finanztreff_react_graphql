import { useQuery } from "@apollo/client";
import SvgImage from "components/common/image/SvgImage";
import { AssetGroup, InstrumentEdge, Query } from "generated/graphql";
import { loader } from "graphql.macro";
import { useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { SortFilter } from "components/index/FindIndexSection/filters/SortFilter";
import { DaysFilter } from "components/devisen/Filters/DaysFilter";
import { CurrencyFindInstrumentCard } from "components/Assets/CurrencyPage/CurrencyFindSection/CurrencyFindInstrumentCard";
import { CurrencyEntriesDropdownComponent } from "components/devisen/CurrencyPageDropdown/CurrencyEntriesDropdown";
import classNames from "classnames";
import { useMediaQuery } from "react-responsive";


interface FindCurrencyModalProps {
    buttonName?: string;
    className?: string;
    showCardFooter?: boolean;
    region?: string;
    industry?: string;
    modalTitle?: string;
}

interface CurrencyFindSectionState {
    idCurrency: string | null;
}

export function FindCurrencyModal(props: FindCurrencyModalProps) {
    const [state, setState] = useState({ isOpen: false, searchString: "", idCurrency:"" });

    const [direction, setDirection] = useState(false);
    const [description, setDescription] = useState("Name");
    const [performance, setPerformance] = useState("INTRADAY");
    
    const [state1,setState1] = useState<CurrencyFindSectionState>({
        idCurrency: "",
    });

    const openModal = () => setState({ ...state, isOpen: true });
    const closeModal = () => setState({ ...state, isOpen: false });

    const [region, setRegion] = useState("Deutschland")
    const handleRegion = (e: any) => setRegion(e)

    const [indexType, setIndexType] = useState("Alle");
    const [indexOption, setIndexOption] = useState("")
    const handleIndicesTypes = (indexType: string, indexOption: string) => { setIndexType(indexType); setIndexOption(indexOption) }

    let { loading, data } = useQuery<Query>(loader('./getInstrumentGroupSearchCurrencyPage.graphql'), {
        variables: { assetGroup: [AssetGroup.Cross], searchString: state1.idCurrency, first: 19, after: null },
    });

    const isDesktop = useMediaQuery({
        query: '(min-width: 1281px)'
    });

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
                dialogClassName="currency-finden-modal modal-dialog-sky-placement"
            >
                <Modal.Header>
                    <Row className="row-cols-1">
                        <div className="col d-flex justify-content-between">
                            <Modal.Title className="d-flex">
                                {isDesktop === true && 
                                    <h5>
                                        <span>Devisen</span>
                                    </h5>
                                }
                                {isDesktop === false &&
                                    <>
                                        <h5>
                                            <span>Devisen- </span>
                                        </h5>
                                        <CurrencyEntriesDropdownComponent name={""} 
                                        hasAllButton ={true}
                                        onSelect={(v) => {
                                            if(v?.institute === undefined){
                                                setState1({
                                                    idCurrency: "",
                                                })
                                            }else{
                                            setState1({
                                                idCurrency: v?.institute?.name?.slice(0, 3).toUpperCase() ? v.institute.name.slice(0, 3).toUpperCase() : null,
                                            })}
                                        }}/>
                                    </>
                                }
                            </Modal.Title>
                            <button type="button" className="close text-blue" onClick={closeModal}>
                                <span>schließen</span>
                                <SvgImage icon="icon_close_blue.svg" spanClass="close-modal-butt" width={"27"}/>
                            </button>
                        </div>
                    </Row>
                </Modal.Header>
                <Modal.Body>

                    <div className="d-flex flex-wrap pt-lg-2 pl-2" style={{ fontFamily: "Roboto" }}>
                        {isDesktop === true && <div className="flex-grow-1 m-auto pt-sm-2">
                            <CurrencyEntriesDropdownComponent name={""} 
                            hasAllButton ={true}
                                        onSelect={(v) => {
                                            if(v?.institute === undefined){
                                                setState1({
                                                    idCurrency: "",
                                                })
                                            }else{
                                            setState1({
                                                idCurrency: v?.institute?.name.slice(0, 3).toUpperCase()  ? v.institute.name.slice(0, 3).toUpperCase() + "/": null,
                                            })}
                                        }}/>
                        </div>}
                        {isDesktop === false && <div className="flex-grow-1 m-auto pt-sm-2">
                        </div>}
                        <div className="filters-panel float-right d-inline-flex text-nowrap">
                            <SortFilter
                                onSelect={ev => { }}
                                options={["Name", "Performance"]}
                                direction={direction}
                                description={description}
                            />
                            <DaysFilter
                                onSelect={ev => { }}
                                performance={performance}
                            />
                        </div>
                    </div>

                    <Row className="mx-0 d-flex">
                        {data && data.search.edges.map((current: InstrumentEdge, index: number) =>
                            <Col lg={6} xl={4} xs={12} className="p-lg-2 p-sm-0" key={index}>
                                {current && current.node.group && current.node && current.node.group.id
                                    && <CurrencyFindInstrumentCard
                                        id={current.node.id}
                                        key={index}
                                        group={current.node.group}
                                        className="currency-find-instrument-card my-2"
                                    />
                                }
                            </Col>
                        )
                        }
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    )
}

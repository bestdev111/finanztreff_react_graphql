import { useState } from 'react';
import { Accordion, Button, Card, Modal } from "react-bootstrap";
import { ModalHeaderMeinFinanztreff } from './ModalHeaderMeinFinanztreff';

export function FilterMobile(props: FilterMobileProps) {

    let [state, setState] = useState<FilterMobileState>({
        isOpen: false
    });

    const openModal = () => setState({ isOpen: true });
    const closeModal = () => setState({ isOpen: false });

    return (
        <>
            <button className="btn btn-primary d-xl-none" onClick={openModal}>
                <span className="svg-icon">
                    <img src="/static/img/svg/icon_filter_white.svg" alt="" className="svg-convert svg-white" width="27" />
                </span>
                <span>Filter</span>
            </button>
            <Modal show={state.isOpen} onHide={closeModal} className="modal fade bottom profile-modals filter-modal modal-dialog-sky-placement">
                <div className="modal-dialog modal-md all-white-modal modal-content section-einzelwerte">
                    <ModalHeaderMeinFinanztreff title="Ergebnisse filtern" close={closeModal} />
                    <Accordion className="bg-white w-100">
                        {!props.inOverviewWatchlist &&
                            <Card>
                                <Card.Header className="ansicht">
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0" className="btn btn-primary">
                                        Ansicht
                                        <span className="drop-arrow-image open-icon svg-icon top-move">
                                            <img src="/static/img/svg/icon_direction_down_white.svg" className="svg-convert svg-white" alt="" />
                                        </span>
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        {props.isWatchlist &&
                                            <div className="options">
                                                <Button onClick={() => props.handleFilter("Kacheln")} className={props.filter == "Kacheln" ? "btn active" : "btn"} value="Kacheln"> Kacheln </Button>
                                                <Button onClick={() => props.handleFilter("Liste Performance")} className={props.filter == "Liste Performance" ? "btn active" : "btn"} value="Liste Performance">Liste Performance</Button>
                                                <Button onClick={() => props.handleFilter("Liste")} className={props.filter == "Liste" ? "btn active" : "btn"} value="Liste">Liste</Button>
                                            </div>
                                        }
                                        {!props.isWatchlist &&
                                            <>
                                                <div className="options">
                                                    <Button onClick={() => props.handleFilter("Kacheln Portfolio")} className={props.filter == "Kacheln Portfolio" ? "btn active" : "btn"} value="Kacheln Portfolio"> Kacheln Portfolio </Button>
                                                    <Button onClick={() => props.handleFilter("Kacheln Aktuell")} className={props.filter == "Kacheln Aktuell" ? "btn active" : "btn"} value="Kacheln Aktuell"> Kacheln Aktuell </Button>
                                                    <Button onClick={() => props.handleFilter("Performance")} className={props.filter == "Performance" ? "btn active" : "btn"} value="Performance">Performance</Button>
                                                    <Button onClick={() => props.handleFilter("Liste")} className={props.filter == "Liste" ? "btn active" : "btn"} value="Liste">Liste</Button>
                                                    <Button onClick={() => props.handleFilter("Erweitert")} className={props.filter == "Erweitert" ? "btn active" : "btn"} value="Erweitert">Erweitert</Button>
                                                </div>
                                            </>
                                        }
                                        <div className="anwenden">
                                            <Button className="btn" onClick={closeModal}>
                                                <span className="svg-icon">
                                                    <img src="/static/img/svg/icon_check_hook_green.svg" className="svg-convert svg-green"
                                                        alt="" />
                                                </span>
                                                <span>
                                                    Anwenden
                                                </span>
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        }
                        <Card>
                            <Card.Header className="sortierung">
                                <Accordion.Toggle as={Button} variant="link" eventKey="1" className="btn btn-primary">
                                    Sortierung
                                    <span className="drop-arrow-image open-icon svg-icon top-move">
                                        <img src="/static/img/svg/icon_direction_down_white.svg" className="svg-convert svg-white" alt="" />
                                    </span>
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body className="sort-body">
                                    {!props.isWatchlist && !props.inOverviewWatchlist &&
                                        <>
                                            <div className="options">
                                                <Button onClick={() => props.handleSort("Gattung")} className={props.sort == "Gattung" ? "btn active" : "btn"} value="Gattung"> Gattung </Button>
                                                <Button onClick={() => props.handleSort("Name")} className={props.sort == "Name" ? "btn active" : "btn"} value="Name"> Name </Button>
                                                <Button onClick={() => props.handleSort("Erträge")} className={props.sort == "Erträge" ? "btn active" : "btn"} value="Erträge"> Erträge </Button>
                                                <Button onClick={() => props.handleSort("Kaufdatum")} className={props.sort == "Kaufdatum" ? "btn active" : "btn"} value="Kaufdatum"> Kaufdatum </Button>
                                                <Button onClick={() => props.handleSort("Performance heute")} className={props.sort == "Performance heute" ? "btn active" : "btn"} value="Performance heute"> Performance heute </Button>
                                                <Button onClick={() => props.handleSort("Performance gesamt")} className={props.sort == "Performance gesamt" ? "btn active" : "btn"} value="Performance gesamt"> Performance gesamt </Button>
                                            </div>
                                        </>
                                    }
                                    {props.isWatchlist && !props.inOverviewWatchlist &&
                                        <>
                                            <div className="options">
                                                <Button onClick={() => props.handleSort("Gattung")} className={props.sort == "Gattung" ? "btn active" : "btn"} value="Gattung"> Gattung </Button>
                                                <Button onClick={() => props.handleSort("Name")} className={props.sort == "Name" ? "btn active" : "btn"} value="Name"> Name </Button>
                                            </div>
                                            <div className="options">
                                                <Button onClick={() => props.handleSort("Performance")} className={props.sort == "Performance" ? "btn active" : "btn"} value="Performance"> Performance </Button>
                                                <Button onClick={() => props.handleSort("Beobachtungsdauer")} className={props.sort == "Beobachtungsdauer" ? "btn active" : "btn"} value="Beobachtungsdauer"> Beobachtungsdauer </Button>
                                            </div>
                                        </>
                                    }
                                    {props.inOverviewWatchlist && props.isWatchlist &&
                                        <>
                                            <div className="options">
                                                <Button onClick={() => props.handleSort("Name")} className={props.sort == "Name" ? "btn active" : "btn"} value="Name"> Name </Button>
                                                <Button onClick={() => props.handleSort("Anzahl Werte")} className={props.sort == "Anzahl Werte" ? "btn active" : "btn"} value="Anzahl Werte"> Anzahl Werte </Button>
                                                <Button onClick={() => props.handleSort("Erstellt am...")} disabled={true} className={props.sort == "Erstellt am..." ? "btn active" : "btn"} value="Erstellt am..."> Erstellt am... </Button>

                                            </div>
                                        </>
                                    }
                                    {props.inOverviewWatchlist && !props.isWatchlist &&
                                        <>
                                            <div className="options">
                                                <Button onClick={() => props.handleSort("Name")} className={props.sort == "Name" ? "btn active" : "btn"} value="Name"> Name </Button>
                                                <Button onClick={() => props.handleSort("Summe")} className={props.sort == "Summe" ? "btn active" : "btn"} value="Summe"> Summe </Button>
                                            </div>
                                            <div className="options">
                                                <Button onClick={() => props.handleSort("Auflagedatum")} className={props.sort == "Auflagedatum" ? "btn active" : "btn"} value="Auflagedatum"> Auflagedatum </Button>
                                                <Button onClick={() => props.handleSort("Performance gesamt")} className={props.sort == "Performance gesamt" ? "btn active" : "btn"} value="Performance gesamt"> Performance gesamt </Button>
                                            </div>
                                        </>
                                    }
                                    <div className="order">
                                        <Button onClick={() => props.handleOrder("Aufsteigend")} className={props.order == "Aufsteigend" ? "btn active" : "btn"} value="Aufsteigend">
                                            <span className="svg-icon">
                                                <img src="/static/img/svg/icon_arrow_short_fullup_white.svg" className="svg-convert" width={29}
                                                    alt="" />
                                            </span>
                                            <span>Aufsteigend</span>
                                        </Button>
                                        <Button onClick={() => props.handleOrder("Absteigend")} className={props.order == "Absteigend" ? "btn active" : "btn"} value="Absteigend">
                                            <span className="svg-icon">
                                                <img src="/static/img/svg/icon_arrow_short_fullup_white.svg" style={{ transform: "rotate(180deg)" }} className="svg-convert" width={29}
                                                    alt="" />
                                            </span>
                                            <span>Absteigend</span>
                                        </Button>
                                    </div>
                                    <div className="anwenden">
                                        <Button className="btn" onClick={closeModal}>
                                            <span className="svg-icon">
                                                <img src="/static/img/svg/icon_check_hook_green.svg" className="svg-convert svg-green"
                                                    alt="" />
                                            </span>
                                            <span>Anwenden</span>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
            </Modal>
        </>
    );
}

interface FilterMobileState {
    isOpen: boolean
};

interface FilterMobileProps {
    isWatchlist: boolean
    inOverviewWatchlist: boolean
    handleFilter: (e: string | null) => void
    filter?: string
    handleSort: (e: any) => void
    sort: string
    handleOrder: (e: any) => void
    order: any;
};

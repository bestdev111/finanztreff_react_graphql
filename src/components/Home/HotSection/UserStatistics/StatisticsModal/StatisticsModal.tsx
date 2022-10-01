import classNames from "classnames";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import { useState } from "react";
import { Button, Modal, Container, Row, Col } from "react-bootstrap";
import { MostTraded } from "../MostTraded";
import { PeriodDropdown } from "./PeriodDropdownMobile";
import {trigInfonline} from "../../../../common/InfonlineService";

export function MostTradedModal() {
    const [isOpen, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    return (
        <>
            <div className="d-flex justify-content-xl-start justify-content-lg-end justify-content-md-end justify-content-sm-center">
                <Button variant="primary" className="bg-white text-dark-blue border-0 fs-14px mt-xl-2 mt-lg-0 mb-xl-4 mb-lg-n1 mb-sm-n2" onClick={() => {
                    setOpen(true)
                    trigInfonline("homepage", "statistic_modal")
                }}>
                    Mehr anzeigen
                </Button>
            </div>
            <Modal show={isOpen} onHide={handleClose} className="modal-dialog-sky-placement modal-bg-transparent">
                <div className="modal-content border-0">
                    <ModalHeaderMeinFinanztreff title="So handeln finanztreff.de Nutzer" close={handleClose} />
                    <ExposeModalBody />
                </div>
            </Modal>
        </>
    )
}

function ExposeModalBody() {

    const [period, setPeriod] = useState<number>(7);
    const [isTrades, setTrades] = useState<boolean>(false);

    const chartWidth = useBootstrapBreakpoint({
        xl: 70,
        lg: 80,
        md: 80,
        sm: 68,
        default: 80
    });

    const assetNameLenght = useBootstrapBreakpoint({
        xl: 35,
        lg: 35,
        md: 50,
        sm: 20,
        default: 50
    });

    const itemsLenght = useBootstrapBreakpoint({
        xl: 20,
        lg: 20,
        md: 20,
        sm: 10,
        default: 20
    });

    return (
        <Modal.Body className="bg-white border-top-3 border-gray-light rounded-bottom">
            <Container>
                <Row className="my-4">
                    Welche Werte haben finanztreff.de Nutzer in letzter Zeit gehandelt?
                    Welche Trends zeichnen sich in verschiedenen Zeiträumen ab?<br /> Die Darstellung zeigt die
                    größten Stückzahlen oder Trades über einen auswählbaren Zeitraum. Vielleicht sind
                    interessante Werte für Sie dabei? Lassen Sie sich inspirieren!
                </Row>
            </Container>
            <div className="bg-dark-blue mx-xl-n3 mx-lg-n2 mx-md-n2 mx-sm-n2 mb-xl-n3 mb-lg-n3 mb-md-n3 mb-sm-0 rounded-bottom">
                <Container >
                    <Row className="pt-2">
                        <Col className="text-left px-xl-2 px-sm-0">
                            <Button variant="inline" className={classNames("text-white fs-16px mx-2 px-0 pb-0 border-button", !isTrades && "active")} onClick={() => {
                                trigInfonline("homepage", "statistic_modal");
                                setTrades(false)
                            }}>
                                Stück
                            </Button>
                            <Button variant="inline" className={classNames("text-white fs-16px mx-2 px-0 pb-0 border-button", isTrades && "active")} onClick={() => {
                                trigInfonline("homepage", "statistic_modal");
                                setTrades(true)
                            }}>
                                Trades
                            </Button>
                        </Col>
                        <Col className="text-right px-xl-2 px-sm-0 text-nowrap d-md-block d-sm-none">
                            {PERIODS.map((p, index) =>
                                <Button key={index} variant="inline"
                                    className={classNames("text-white fs-16px mx-2 px-0 pb-0 border-button", period === p.id && "active")}
                                    onClick={() => {
                                        trigInfonline("homepage", "statistic_modal");
                                        setPeriod(p.id)
                                    }}>
                                    {p.name}
                                </Button>
                            )}
                        </Col>
                        <Col className="text-right d-xl-none d-lg-none d-md-none d-sm-block">
                            <Row className="justify-content-end">
                                <PeriodDropdown options={PERIODS} activeId={period} onSelect={(ev) => setPeriod(ev)} />
                            </Row>
                        </Col>
                    </Row>
                    <Row className="text-white py-5">
                        <Col xl={6} xs={12}>
                            <MostTraded purchased={true} trades={isTrades} logedIn={false} itemsReturned={itemsLenght} days={period} className="modal-statistics"
                                assetNameLenght={assetNameLenght} chartWidth={chartWidth} childColumnSize="col-sm-6" />
                        </Col>
                        <Col xl={6} xs={12} className="mt-xl-0 mt-sm-5">
                            <MostTraded purchased={false} trades={isTrades} logedIn={false} itemsReturned={itemsLenght} days={period} className="modal-statistics"
                                assetNameLenght={assetNameLenght} chartWidth={chartWidth} childColumnSize={"col-sm-6"} />
                        </Col>
                    </Row>
                </Container>
            </div>
        </Modal.Body>
    );
}

export const PERIODS: { name: string, id: number }[] = [{
    name: "Heute",
    id: 0
}, {
    name: "1 Woche",
    id: 7
}, {
    name: "2 Wochen",
    id: 14
}, {
    name: "1 Monat",
    id: 30
}, {
    name: "3 Monaten",
    id: 90
}, {
    name: "6 Monaten",
    id: 180
}]; 

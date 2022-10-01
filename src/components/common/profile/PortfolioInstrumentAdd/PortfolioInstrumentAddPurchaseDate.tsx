import { Component } from "react";
import { Button, FormControl, InputGroup, Modal } from "react-bootstrap";
import Calendar from 'react-calendar';
import moment from "moment";
import './PortfolioInstrumentAddPurchaseDate.scss';
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import classNames from "classnames";

export class PortfolioInstrumentAddPurchaseDate extends Component<PortfolioInstrumentAddPurchaseDateProps, PortfolioInstrumentAddPurchaseDateState> {
    state = { opened: false, date: moment(this.props.value) };
    render() {
        let callbackFn =
            (value: Date) => {
                this.setState({ ...this.state, opened: false, date: moment(value) });
                this.props.callback && this.props.callback({ value: moment(value) });
            };

        return (
            <>
                <InputGroup>
                    <FormControl className={classNames("form-control-sm text-right", this.props.className)} readOnly
                        value={this.state.date.format("DD.MM.YYYY")}
                    />
                    <InputGroup.Append className="select-calendar-date-trigger">
                        <Button size="sm" className={"px-2"} onClick={() => this.setState({ ...this.state, opened: true })}>
                            <img height="19" src={process.env.PUBLIC_URL + "/static/img/svg/icon_calender_dark.svg"} alt="Auswählen" />
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
                <Modal show={this.state.opened} onHide={() => this.setState({ ...this.state, opened: false })} className="modal bottom inner-modal profile-modals meine-finanztreff-card-modal modal-dialog-sky-placement" style={{ backgroundColor: "rgba(56, 56, 56, 0.92)" }}>
                    <div className="modal-dialog modal-content inner-modal modal-date modal-dialog-sky-placement-date" style={{ alignSelf: "center", borderRadius: "0.3em" }}>
                        <div className="modal-content">
                            <ModalHeaderMeinFinanztreff title="Datum" close={() => this.setState({ ...this.state, opened: false })}/>
                            <Modal.Body className="bg-white py-4" >
                                <div className="d-flex justify-content-between mt-20px">
                                    <Calendar
                                        onChange={value => callbackFn(Array.isArray(value) ? value[0] : value)}
                                        maxDate={new Date()}
                                        value={this.props.value.toDate()}
                                    />
                                </div>
                            </Modal.Body>
                        </div>
                    </div>
                </Modal>
            </>
        );
    }

}

interface PortfolioInstrumentAddPurchaseDateProps {
    value: moment.Moment;
    callback?: (id: DateSelected) => void;
    className?: string;
}

interface PortfolioInstrumentAddPurchaseDateState {
    opened: boolean;
    date?: moment.Moment;
}

export interface DateSelected {
    value: moment.Moment;
}


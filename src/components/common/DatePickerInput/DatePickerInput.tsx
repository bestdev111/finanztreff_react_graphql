import React, {useState} from "react";
import {Button, Dropdown, FormControl, InputGroup, Modal} from "react-bootstrap";
import moment from 'moment';
import Datepicker from "react-datepicker";
import {useViewport} from "../../../hooks/useViewport";
import './DatePickerInput.scss'
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerInputProps {
    label?: string;
    placeHolder?: string;
    onChange?: (moment: moment.Moment) => void;
    format?: string;
    value?: moment.Moment | null;
    minDate?: moment.Moment;
    maxDate?: moment.Moment;
}

interface DatePickerInputState {
    opened: boolean;
    openedModal: boolean;
    value?: moment.Moment;
}

export function DatePickerInput(props: DatePickerInputProps)  {
    const {width} = useViewport();
    let [state, setState] = useState<DatePickerInputState>({
        opened: false, openedModal: false,
        value: props.value !== undefined ? (props.value !== null ? props.value : undefined) : undefined
    });
    let format = props.format || "DD.MM.YYYY";

    if ((props.value == null && state.value != null) ||
            (props.value && props.value.diff(state.value, "day") !== 0)) {
        setState({...state, value: props.value || undefined});
    }

    return (
        <>
            <Dropdown alignRight className={"date-picker-input w-100"} show={state.opened}>
                <Dropdown.Toggle variant="inline" className="p-0 w-100"
                                 onClick={() => {
                                     if (width < 1280) {
                                         setState({ ...state, opened: false, openedModal: !state.openedModal})
                                     } else {
                                         setState({ ...state, opened: !state.opened, openedModal: false })
                                     }
                                 }}
                >
                    <div className={"d-flex"}>
                        {props.label &&
                            <span className="d-block label mr-2">{props.label}</span>
                        }
                        <InputGroup className="m-0 rounded border success">
                            <FormControl
                                className="form-control-sm text-right border-0 bg-transparent" readOnly
                                value={state.value ? state.value.format(format) : ""}
                            />
                            <InputGroup.Append className="icon bg-transparent">
                                <img height="32" src={process.env.PUBLIC_URL + "/static/img/svg/icon_calender_dark.svg"} alt="Auswählen" />
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="border-0 p-0 bg-transparent">
                    <Datepicker
                        selected={state.value !== undefined ? (state.value !== null ? state.value.toDate() : null) : null}
                        minDate={props.minDate ? props.minDate.toDate() : undefined}
                        maxDate={props.maxDate ? props.maxDate.toDate() : undefined}
                        onChange={value => {
                            let date = Array.isArray(value) ? value[0]: value;
                            setState({...state, opened: false, value: moment(date)})
                            if (props.onChange) {
                                props.onChange(moment(date));
                            }
                        }}
                        scrollableMonthYearDropdown
                        inline
                    />
                </Dropdown.Menu>
            </Dropdown>


            <Modal show={state.openedModal} onHide={() => setState({ ...state, openedModal: false })}
                   className="modal bottom inner-modal profile-modals meine-finanztreff-card-modal modal-dialog-sky-placement" style={{ backgroundColor: "rgba(56, 56, 56, 0.92)" }}>
                <Modal.Header className="border-0">
                    <div className="d-flex justify-content-between w-100">
                        <h5 className="modal-title">Datum auwählen</h5>
                        <Button variant={'inline'} className="close text-blue" onClick={() => setState({ ...state, openedModal: false })}>
                            <span>schließen</span>
                            <span className="close-modal-butt svg-icon">
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark.svg"} alt="schliessen" className="svg-convert svg-blue" />
                                </span>
                        </Button>
                    </div>
                </Modal.Header>
                <Modal.Body className="bg-white py-0" >
                    <div className="d-flex justify-content-center">
                        <Datepicker
                            selected={state.value !== undefined ? (state.value !== null ? state.value.toDate() : null) : undefined}
                            minDate={props.minDate ? props.minDate.toDate() : undefined}
                            maxDate={props.maxDate ? props.maxDate.toDate() : undefined}
                            onChange={value => {
                                let date = Array.isArray(value) ? moment(value[0]): moment(value);
                                setState({...state, openedModal: false, value: date});
                                if (props.onChange) {
                                    props.onChange(date);
                                }
                            }}
                            showYearDropdown
                            scrollableMonthYearDropdown
                            inline
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

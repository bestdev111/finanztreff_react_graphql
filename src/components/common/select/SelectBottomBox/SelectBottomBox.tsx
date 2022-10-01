import React, {Component, ReactNode, useState} from "react";
import {Button, Container, Modal} from "react-bootstrap";
import './SelectBottomBox.scss';
import SvgImage from "../../image/SvgImage";
import classNames from "classnames";

interface SelectBottomBoxState<S> {
    selected: S;
    initialSelected?: S;
    opened: boolean;
}


interface SelectBottomBoxOption<T, R> {
    name: T;
    value: R;
}

interface SelectBottomBoxProps<T, R> {
    variant?: "blue" | "white";
    defaultValue?: R;
    options: SelectBottomBoxOption<T, R>[];
    title?: string;
    onSelect?: (value: R) => void;
    className?: string;
    modalHeight?: string;
    icon?: ReactNode;
}

export const SelectBottomBox = <T, R> (props: SelectBottomBoxProps<T, R>) => {
    let [state, setState] = useState<SelectBottomBoxState<R>>(
        {
            selected: props.defaultValue || props.options[0].value,
            initialSelected: props.defaultValue,
            opened: false
        });
    if (props.defaultValue && state.initialSelected !== props.defaultValue) {
        setState({...state, initialSelected: props.defaultValue, selected: props.defaultValue})
    }
    let current = props.options.find(current => current.value === state.selected) || props.options[0];
    return (
        <>
            <Button variant="link"
                    className={classNames(props.className, state.opened ? "opened" : "")}
                    onClick={() => setState({...state, opened: !state.opened})}
            >
                {current.name}
                {props.icon ? props.icon : <SvgImage spanClass={"drop-arrow-image top-move indicator"} icon={"icon_direction_down_" + (props.variant ? props.variant : "blue_light" ) + ".svg"} width="27" convert={false}/>}
            </Button>
            <Modal show={state.opened} onHide={() => setState({...state, opened: false})} className="modal bottom select-instrument-group-bottom modal-dialog-sky-placement">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header single-row border-0">
                            <div className="row row-cols-1">
                                <div className="col d-flex justify-content-between">
                                    {props.title && <h5 className="modal-title">{props.title}</h5>}
                                    <Button variant="link" className="close text-blue" onClick={() => setState({...state, opened: false})} >
                                        <span>schließen</span>
                                        <span className="close-modal-butt svg-icon">
                                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark.svg"} alt="" className="svg-convert svg-blue"/>
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <Modal.Body className="bg-white py-0" style={{overflowX: 'scroll', height: props.modalHeight}}>
                            <Container>
                                {props.options
                                    .map((current: SelectBottomBoxOption<T, R>, index: number) =>
                                        <Button key={index} variant="primary"
                                                onClick={() => {
                                                    setState({...state, opened: false});
                                                    props.onSelect && props.onSelect(current.value)}
                                                }
                                                className={classNames("ml-2 mb-2", current.value === state.selected ? "active" : "")}
                                        >{current.name}</Button>)}
                            </Container>
                        </Modal.Body>
                    </div>
                </div>
            </Modal>
        </>
    );
}

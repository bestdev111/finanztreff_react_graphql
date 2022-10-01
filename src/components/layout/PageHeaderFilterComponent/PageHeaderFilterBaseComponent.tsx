import React, {Dispatch, ReactNode, SetStateAction, useCallback, useContext, useState} from "react";
import {useViewport} from "../../../hooks/useViewport";
import PageHeaderFilterContext from "./PageHeaderFilterContext";
import {Button, Collapse, Dropdown, Modal} from "react-bootstrap";
import classNames from "classnames";
import './PageHeaderFilterComponent.scss';

export function usePageHeaderFilterState<T>(value: T): [T, Dispatch<SetStateAction<T>>] {
    let context = useContext(PageHeaderFilterContext);
    if (context) {
        return [context.state || value, context.setState];
    }
    throw new Error("Invalid context");
}

interface PageHeaderFilterBaseComponentProps {
    title: string | ReactNode;
    variant?: string | undefined;
    toggleVariant?: string | undefined;
    children: ReactNode;
    toggle: ReactNode;
    extra?: ReactNode | undefined;
    className?: string | undefined;
    dropDownClassName?: string | undefined;
    toggleClassName?: string | undefined;
    disabled?: boolean | undefined;
}

interface PageHeaderFilterBaseComponentState {
    show: boolean;
    showModal: boolean;
    subState?: any;
}

export function PageHeaderFilterBaseComponent(props: PageHeaderFilterBaseComponentProps) {
    let [state, setState] = useState<PageHeaderFilterBaseComponentState>({show: false, showModal: false});
    let [substate, setSubState] = useState<any>(null);
    const {width} = useViewport();

    let closeCallback = useCallback(() => {
        setState({...state, show: false, showModal: false});
    }, [state, setState])

    let openCallback = useCallback(() => {
        if (width < 1280) {
            setState({...state, show: false, showModal: !state.showModal});
        } else {
            setState({...state, show: !state.show, showModal: false});
        }
    }, [width, state, setState])

    return (
        <PageHeaderFilterContext.Provider value={{close: closeCallback, open: openCallback, state: substate, setState: setSubState}}>
            <Dropdown className={classNames("header-filter w-100", props.variant, props.className)} show={state.show} alignRight>
                <div className={"d-flex justify-content-between"}>
                    <Dropdown.Toggle variant={props.toggleVariant || "light"} className={classNames("w-100 p-0", props.toggleClassName)}
                                     disabled={props.disabled || false}
                                     onClick={openCallback}>
                        {props.toggle}
                    </Dropdown.Toggle>
                    {props.extra}
                </div>
                <Dropdown.Menu className={classNames("p-0", props.dropDownClassName)}>
                    {props.children}
                </Dropdown.Menu>
            </Dropdown>
            <Modal show={state.showModal} scrollable
                   onHide={() => setState({ ...state, showModal: !state.showModal })}
                   transition={Collapse}
                   className="inner-modal profile-modals bottom modal-dialog-sky-placement" dialogClassName={"mw-100"}>
                <Modal.Header className="border-0">
                    <div className="d-flex justify-content-between w-100">
                        <h5 className="modal-title">{props.title}</h5>
                        <Button variant={'inline'} className="close text-blue" onClick={() => setState({ ...state, showModal: false })}>
                            <span className="pb-2">schließen</span>
                            <span className="close-modal-butt svg-icon mr-1 mt-1 pb-n1">
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_blue.svg"} alt="schliessen" className="svg-convert svg-blue" width={"25"} />
                                </span>
                        </Button>
                    </div>
                </Modal.Header>
                <Modal.Body className="bg-white py-0">
                    {props.children}
                </Modal.Body>
            </Modal>
        </PageHeaderFilterContext.Provider>
    )
}

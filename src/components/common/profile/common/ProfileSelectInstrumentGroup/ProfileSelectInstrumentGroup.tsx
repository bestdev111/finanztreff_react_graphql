import { useRef, useState } from "react";
import { Button, Col, Container, Form, FormControl, InputGroup, Modal, Row } from "react-bootstrap";
import './InstrumentGroupSearchEntry.scss';
import { useDelayedState } from "../../../../../hooks/useDelayedState";
import useWindowDimensions from "../../../../../hooks/useWindowDimensions";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { SearchInstrumentsProfileComponent } from "./SearchInstrumentsProfileComponent";

export interface InstrumentGroupSelected {
    id: number;
    name: string;
}

interface ProfileSelectInstrumentGroupProps {
    value?: string;
    callback?: (selected?: InstrumentGroupSelected) => void;
}

interface ProfileSelectInstrumentGroupState {
    opened: boolean;
    search?: string;
}

export const ProfileSelectInstrumentGroup = (props: ProfileSelectInstrumentGroupProps) => {
    let [state, setState] = useState<ProfileSelectInstrumentGroupState>({ opened: false, search: props.value || undefined });
    let [searchString, setSearchString] = useDelayedState<string>(props.value || '', 500);
    const { height } = useWindowDimensions();
    let callbackFn =
        (value?: InstrumentGroupSelected) => {
            setState({ ...state, opened: false });
            props.callback && value && props.callback(value);
        };
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <>
            <InputGroup className="select-instrument-trigger" onClick={() => setState({ ...state, opened: true })}>
                <Button variant="link"
                    className="text-left"
                    style={!(state.search || props.value) ? { width: '100%', border: "2px solid #FF00FF" } : { width: '100%' }}
                    onClick={() => setState({ ...state, opened: true })}
                >                <span className="exchange-name">{state.search || props.value || 'suchen ...'}</span>
                    <img height="20" style={{ float: "right" }} src={process.env.PUBLIC_URL + "/static/img/svg/icon_search_blue.svg"} alt="Suche" />
                </Button>
            </InputGroup>
            <Modal id="search-results-modal" size="lg" show={state.opened} onHide={()=>!state.opened} onShow={() => inputRef.current?.focus()} className="modal-dialog-sky-placement modal-background">
                <ModalHeaderMeinFinanztreff title="Wertpapier suchen" close={() => setState({ ...state, opened: false })} />
                <Modal.Body className="bg-white" style={{ height: "auto" }}>
                    <Container>
                        <Row>
                            <Col className="px-0">
                                <Form className="modal-form input-bg">
                                    <InputGroup className={"pb-3"}>
                                        <FormControl aria-describedby="Suchbegriff" placeholder="Suchbegriff" ref={inputRef}
                                            className="form-control-sm mr-2 font-weight-bold"
                                            onChange={control => { setState({ ...state, search: control.target.value }); setSearchString(control.target.value) }}
                                            value={state.search}
                                        />
                                        <Button variant="primary" className="with-icon-first">
                                            <span className="svg-icon mr-2">
                                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_search_white.svg"} height="18" alt="" className="" />
                                            </span>
                                            <span>Suchen</span>
                                        </Button>
                                    </InputGroup>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pl-lg-2 pl-sm-1 pr-sm-0">
                                {searchString && searchString.length > 1 &&
                                    <div className="search-results">
                                        <SearchInstrumentsProfileComponent searchString={searchString} callback={callbackFn} />
                                    </div>
                                }
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    )
}

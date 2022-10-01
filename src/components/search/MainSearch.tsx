import SvgImage from "../common/image/SvgImage";
import { Col, Collapse, FormControl, Modal, Row } from "react-bootstrap";
import { useRef, useState } from "react";
import './MainSearch.scss';
import { SearchInstrumentsComponent } from "./SearchInstrumentsComponent";
import { NewsComponent, NewsComponentMedium } from "./NewsComponent";
import { MostSearchedComponent } from "./MostSearchedComponent";
import { useDelayedState } from "../../hooks/useDelayedState";
import {guessInfonlineSection, trigInfonline} from "components/common/InfonlineService";
import { Link } from "react-router-dom";

export function MainSearch() {
    const [state, setState] = useState<MainSearchState>({ opened: false, showResults: false });
    return (<>
        <SvgImage icon="icon_search_blue.svg" spanClass="search-butt top-move svg-icon-search-blue"
            imgClass="search-butt-icon" onClick={() => {
                setState({ ...state, opened: true })
            }
            } />
        {state.opened && <ModalContent close={() => setState({ ...state, opened: false })} />}
    </>);
}

const checkAlphaNumeric = (entry:string)=>{
    return ((entry.match(/^[0-9A-Za-z]+$/) === null) ? false : true);
}
function ModalContent(props: { close: () => void }) {

    const [searchString, setSearchString, transitionalSearchString] = useDelayedState<string>('', 500);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Modal show={true} onHide={props.close} centered
            onShow={() => {
                trigInfonline("homepage", 'search_layer')
                inputRef && inputRef.current?.focus()
            }}
            contentClassName="bg-white"
            className="modal-dialog-sky-placement">
            <Modal.Header className="border-0">
                <Row className="row-cols-1">
                    <div className="col d-flex justify-content-between">
                        <button type="button" className="close text-blue"
                            onClick={props.close}>
                            <span>schließen</span>
                            <SvgImage icon="icon_close_blue.svg" spanClass="close-modal-butt"
                                imgClass="svg-blue" convert={false} width={'27'} />
                        </button>
                    </div>
                </Row>
            </Modal.Header>
            <Modal.Body className="bg-white">
                <div className="form-inline d-block text-center common-input-row input-bg">
                    <FormControl placeholder="Suchbegriff eingeben" className="w-50"
                        ref={inputRef}
                        value={transitionalSearchString}
                        onChange={control => {
                            if (searchString) {
                                trigInfonline("homepage", 'search_input_layer')
                            }
                            setSearchString(control?.target?.value)
                        }}
                        onCopy={(control:any) => {
                            if(checkAlphaNumeric(control?.target?.value)) {
                                trigInfonline(guessInfonlineSection(), 'search_input_layer');
                            }
                        }}
                    />

                    <Link className="bg-primary text-white text-decoration-none fs-14px rounded" style={{ padding: "9px 48px", marginLeft: "16px" }} onClick={props.close}
                        to={{ pathname: "/suche/", state: searchString }}>
                        Suchen
                    </Link>
                </div>
                <Collapse in={!!searchString} className="securities-results mt-5">
                    <Row>
                        <Col id="instruments-search-result" style={{ overflowX: 'clip' }} xs={12} xl={6} className="result-col">
                            <h3 className="col-title">Wertpapiere</h3>
                            {
                                searchString &&
                                <SearchInstrumentsComponent searchString={searchString}
                                    closeTrigger={() => props.close()} />
                            }
                        </Col>
                        <Col id="news-search-result" style={{ overflowX: 'clip' }} xs={12} xl={6} className="result-col news-col mt-md-5 mt-xl-0 mt-sm-5">
                            <h3 className="col-title">Nachrichten</h3>
                            {searchString && <NewsComponent searchString={searchString.toUpperCase()} />}
                            {searchString && <NewsComponentMedium searchString={searchString.toUpperCase()} />}
                        </Col>
                    </Row>
                </Collapse>
            </Modal.Body>
            <Modal.Footer className="bg-white border-0 mr-auto pl-3">
                <MostSearchedComponent closeTrigger={() => props.close()} />
            </Modal.Footer>
        </Modal>

    );
}

interface MainSearchState {
    opened: boolean;
    showResults: boolean;
}

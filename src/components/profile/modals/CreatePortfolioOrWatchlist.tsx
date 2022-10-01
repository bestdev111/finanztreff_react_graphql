import { useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { CREATE_USER_WATCHLIST, CREATE_USER_PORTFOLIO } from '../query';
import { Mutation } from "../../../generated/graphql";
import { ModalHeaderMeinFinanztreff } from './ModalHeaderMeinFinanztreff';
import { ConfirmModal } from './MainSettingsModals/ConfirmModal';
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

interface CreatePortfolioOrWatchlistSettingsState {
    name: string;
    isOpen: boolean
    isDoneOpen: boolean
    itemName: string
}

interface CreatePortfolioOrWatchlistSettingsProps {
    name: string;
    title?: string;
    onComplete: () => void;
}

export function CreatePortfolioOrWatchlist(props: CreatePortfolioOrWatchlistSettingsProps) {

    let [state, setState] = useState<CreatePortfolioOrWatchlistSettingsState>({ name: '', isOpen: false, isDoneOpen: false, itemName: "" });

    const [createNewWatchlist] = useMutation<Mutation>(CREATE_USER_WATCHLIST);
    const [createNewPortfolio] = useMutation<Mutation>(CREATE_USER_PORTFOLIO);

    useEffect(() => {
        if (state.isOpen) {
            if (props.name === "Portfolio") {
                trigInfonline(guessInfonlineSection(), "create_portfolio");
            }
            else {
                trigInfonline(guessInfonlineSection(), "create_watchlist");
            }
        }
    }, [state.isOpen])

    function createPortfolioOrWatchList(type: 'Portfolio' | 'Watchlist', name: string | null): Promise<any> {
        if (type === 'Portfolio') {
            return createNewPortfolio({ variables: { name: name } });
        }
        return createNewWatchlist({ variables: { name: name } });
    }

    function onSubmitClick(type: 'Portfolio' | 'Watchlist', name: string | null) {
        createPortfolioOrWatchList(type, name)
            .then(() => {
                setState({
                    ...state,
                    isOpen: false,
                    isDoneOpen: true
                });
                props.onComplete();
            });
    }


    let name = props.name;
    return (
        <>
            <Button variant="primary" className="with-icon-first text-truncate" onClick={() => setState({ ...state, isOpen: true })}>
                <span className="svg-icon mr-1">
                    <img src="/static/img/svg/icon_plus_white1.svg" className="" alt="" />
                </span>
                {props.title ?
                    <span>{props.title}</span>
                    :
                    <span>Neue{name === "Portfolio" ? "s" : ""} {name} anlegen</span>
                }
            </Button>
            <Modal show={state.isOpen} onHide={() => setState({ ...state, isOpen: false })} size="lg" className="fade modal-dialog-sky-placement">
                <ModalHeaderMeinFinanztreff close={() => setState({ ...state, isOpen: false })} title={
                    <>
                        <span className="svg-icon">
                            <img src="/static/img/svg/icon_plus_green.svg" alt="" className="mx-1 mb-1" />
                        </span>
                        <span>Neue {name} anlegen</span>
                    </>
                } />
                <Modal.Body className="modal-body bg-white">
                    <Row className="form-group d-flex input-bg mt-3 pr-3">
                        <Col className="col-md-2 col-sm-4 pt-1 text-nowrap">{name}name  </Col>
                        <input type="text" className="form-control col-md-10 col-sm-8 form-control-sm" style={{ "width": "180px", backgroundColor: "#f1f1f1", border: "none" }}
                            onChange={(e: any) => setState({ ...state, itemName: e.target.value })} />
                    </Row>
                    <Row>
                        <Col className="col-xl-12 col-md-6 col-sm-12 mb-md-0 mb-sm-2 text-right">
                            <Button variant="primary" onClick={() =>
                                onSubmitClick(name === 'Portfolio' ? 'Portfolio' : 'Watchlist', state.itemName)
                            }>{name} anlegen</Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
            <ConfirmModal title={
                <>
                    <img src="/static/img/svg/icon_plus_green.svg" alt="" className="mx-1 mb-1" />
                    <span>Hinzufügen erfolgreich</span>
                </>
            }
                text={<>Sie haben erfolgreich {name} <b>{state.itemName}</b> hinzugefügt!</>}
                isOpen={state.isDoneOpen || false} handleClose={() => setState({ ...state, isDoneOpen: false })} />
        </>
    );
}

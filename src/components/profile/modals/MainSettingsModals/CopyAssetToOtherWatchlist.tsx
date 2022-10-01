import { useMutation, useQuery } from "@apollo/client";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { WATCHLIST_ENTRY_COPY, WATCHLIST_ENTRY_MOVE } from "components/profile/query";
import { loader } from "graphql.macro";
import { Mutation, Query, Watchlist, WatchlistEntry } from "graphql/types";
import { Component, useState } from "react";
import { Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { ConfirmModal } from "./ConfirmModal";
import "./CopyAssetToOtherPortfolio.scss"

export function CopyAssetToOtherWatchlist(props: CopyAssetToOtherWatchlistProps) {
    const [isOpen, setOpen] = useState<boolean>(false);
    const handleClose = () => {setOpen(false); props.handleClose()};
    return (
        <>
            <Button variant="inline-inverse" className="mb-0 mr-2 mb-2" onClick={() => setOpen(true)}>
                Kopieren/Verschieben
            </Button>
            <Modal show={isOpen} onHide={handleClose} className="bottom modal-background modal-dialog-sky-placement">
                <div className="modal-dialog modal-content inner-modal modal-lg modal-dialog-sky-placement-date align-self-center">
                    <ModalHeaderMeinFinanztreff title="Kopieren/Verschieben" close={handleClose} />
                    <Modal.Body className="bg-white w-100">
                        <ExposeModalBody watchlist={props.watchlist} entry={props.entry} refreshTrigger={props.refreshTrigger} handleClose={handleClose} />
                    </Modal.Body>
                </div>
            </Modal>
        </>
    );
}

interface CopyAssetToOtherWatchlistProps {
    watchlist: Watchlist;
    entry: WatchlistEntry;
    refreshTrigger: () => void;
    handleClose: () => void;
}

interface ExposeModalBodyState {
    watchlistId: number
}

function ExposeModalBody({ entry, watchlist, refreshTrigger, handleClose }: CopyAssetToOtherWatchlistProps & { handleClose: () => void }) {
    const [state, setState] = useState<ExposeModalBodyState>({
        watchlistId: watchlist.id
    });

    const [isMoveDoneOpen, setMoveDoneOpen] = useState<boolean>(false);
    const handleMoveDoneClose = () => { setMoveDoneOpen(false); handleClose() };
    
    const [isCopyDoneOpen, setCopyDoneOpen] = useState<boolean>(false);
    const handleCopyDoneClose = () => { setCopyDoneOpen(false); handleClose() };

    let [copyMutation, { loading: mutationCopyLoading }] = useMutation<Mutation>(WATCHLIST_ENTRY_COPY);
    let [moveMutation, { loading: mutationMoveLoading }] = useMutation<Mutation>(WATCHLIST_ENTRY_MOVE);

    let { data: watchlistData, loading: watchlistsLoading } = useQuery<Query>(
        loader('./getUserWatchlistsAdd.graphql'));

    let validForm = !!state.watchlistId && state.watchlistId !== watchlist.id;

    return (
        <>
            <Container className="px-0">
                <Form className="modal-form input-bg my-4">
                    <Row className="row-cols-lg-2 row-cols-sm-1 pr-3">
                        <Col className="mb-4">
                            Sie haben <b>{entry.name}</b> in Ihrer Watchliste <b>"{watchlist.name}"</b>.
                            <br />Um diese Position in eine andere Watchliste zu kopieren oder zu verschieben, wählen Sie bitte die Ziel-Watchliste aus und klicken auf „Verschieben“ oder „Kopieren“.
                        </Col>
                        <Col className="mb-md-0 mb-sm-5">
                            <Form.Group as={Row} className="form-group justify-content-end align-items-center">
                                <Form.Label className="text-right pr-0 mb-0">Ziel-Watchlist</Form.Label>
                                <Col className="col-sm-7 pr-0 dropdown-menu-height">
                                    {watchlistsLoading ?
                                        <Form.Text><Spinner animation="border" size="sm" /></Form.Text> :
                                        watchlistData?.user?.profile?.watchlists &&
                                        <ProfileSelectWatchlist
                                            watchlists={watchlistData?.user?.profile?.watchlists || []}
                                            callback={value => setState({ ...state, watchlistId: value })}
                                            watchlistId={state.watchlistId}
                                            value={watchlistData?.user?.profile?.watchlists ? watchlistData?.user?.profile?.watchlists.find(current => current.id === state.watchlistId)?.name || "" : ""}
                                        />
                                    }
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>

                <Row className="justify-content-end my-2 pr-3">
                    <Button variant='inline-inverse' className="mb-0 mr-1" onClick={handleClose}>
                        Abbrechen
                    </Button>
                    <Button variant='primary' className="mr-1" disabled={!(validForm)}
                        onClick={() => {
                            moveMutation({
                                variables: {
                                    fromWatchlistId: watchlist.id,
                                    watchlistEntryId: entry.id,
                                    toWatchlistId: state.watchlistId
                                }
                            })
                                .then(() => {
                                    if (refreshTrigger) {
                                        refreshTrigger();
                                    }
                                    setMoveDoneOpen(true);
                                });
                        }}
                    >
                        {mutationMoveLoading && <Spinner animation="border" />}
                        Verschieben
                    </Button>
                    <Button variant="primary" disabled={!(validForm)}
                        onClick={() => {
                            copyMutation({
                                variables: {
                                    fromWatchlistId: watchlist.id,
                                    watchlistEntryId: entry.id,
                                    toWatchlistId: state.watchlistId
                                }
                            })
                                .then(() => {
                                    if (refreshTrigger) {
                                        refreshTrigger();
                                    }
                                    setCopyDoneOpen(true);
                                });
                        }}
                    >
                        {mutationCopyLoading && <Spinner animation="border" />}
                        Kopieren
                    </Button>
                </Row>
            </Container>
            {isMoveDoneOpen &&
                <ConfirmModal title="Verschieben" text="Ihr Wertpapier wurde erfolgreich verschoben." isOpen={isMoveDoneOpen} handleClose={handleMoveDoneClose} />
            }
            {isCopyDoneOpen &&
                <ConfirmModal title="Kopieren" text="Ihr Wertpapier wurde erfolgreich kopiert." isOpen={isCopyDoneOpen} handleClose={handleCopyDoneClose} />
            }
        </>
    );
}

export class ProfileSelectWatchlist extends Component<ProfileSelectWatchlistProps, ProfileSelectWatchlistState> {
    render() {
        let state = { ...this.state, selected: this.props.watchlistId };
        let watchlists = this.props.watchlists.slice()
            .filter(current => current.id!==state.selected && ((state?.selected && current.id === state.selected) || !state?.search || (current.name && current.name?.indexOf(state?.search) >= 0)))
            .sort((a: Watchlist, b: Watchlist) => {
                if (state.selected) {
                    if (a.id === state.selected) {
                        return -1;
                    }
                    if (b.id === state.selected) {
                        return 1;
                    }
                }
                return (a.name?.toLowerCase().localeCompare(b?.name?.toLowerCase() || "")) ? 1 : -1;
            })
            .slice(0, 20);
        return (
            <InputGroup className="">
                <DropdownButton title={this.props.value || "auswählen..."} className={"select-portfolio"} style={{ borderRadius: "3px"  }}>
                    <FormControl value={state?.search} onChange={control => this.setState({ ...state, search: control.target.value })} />
                    <Dropdown.Divider className="mb-0" />
                    {watchlists.map(current =>
                    <>
                        <Dropdown.Item key={current.id} onClick={() => this.props.callback ? this.props.callback(current.id) : undefined}><b>{current.name}</b></Dropdown.Item>
                        <Dropdown.Divider  style={{ margin: "0" }}/>
                        </>
                    )}
                </DropdownButton>
            </InputGroup>

        );
    }
}

interface ProfileSelectWatchlistProps {
    watchlists: Watchlist[];
    callback?: (value: number) => void;
    watchlistId?: number;
    value?: string;
}

interface ProfileSelectWatchlistState {
    selected?: number;
    search?: string;
}
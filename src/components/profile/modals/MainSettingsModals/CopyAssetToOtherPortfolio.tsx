import { useMutation, useQuery } from "@apollo/client";
import { ProfileSelectPortfolio } from "components/common/profile/common/ProfileSelectPortfolio/ProfileSelectPortfolio";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { PORTFOLIO_ENTRY_COPY, PORTFOLIO_ENTRY_MOVE } from "components/profile/query";
import { loader } from "graphql.macro";
import { Mutation, Portfolio, PortfolioEntry, Query } from "graphql/types";
import { useState } from "react";
import { Button, Col, Container, Form, Modal, Row, Spinner } from "react-bootstrap";
import { ConfirmModal } from "./ConfirmModal";
import "./CopyAssetToOtherPortfolio.scss"

export function CopyAssetToOtherPortfolio(props: CopyAssetToOtherPortfolioProps) {
    const [isOpen, setOpen] = useState<boolean>(false);
    const handleClose = () => {setOpen(false); props.handleClose()};
    return (
        <>
            <Button variant="inline-inverse" className="mt-xl-0 mt-lg-0 mt-md-2 mt-sm-2 mb-0 mr-2" onClick={() => setOpen(true)}>
                Kopieren/Verschieben
            </Button>
            <Modal show={isOpen} onHide={handleClose} className="bottom modal-background modal-dialog-sky-placement">
                <div className="modal-dialog modal-content inner-modal modal-lg modal-dialog-sky-placement-date align-self-center">
                    <ModalHeaderMeinFinanztreff title="Kopieren/Verschieben" close={handleClose} />
                    <Modal.Body className="bg-white w-100">
                        <ExposeModalBody portfolio={props.portfolio} entry={props.entry} refreshTrigger={props.refreshTrigger} handleClose={handleClose} />
                    </Modal.Body>
                </div>
            </Modal>
        </>
    );
}

interface CopyAssetToOtherPortfolioProps {
    portfolio: Portfolio;
    entry: PortfolioEntry;
    refreshTrigger: () => void;
    handleClose: () => void;
}

interface ExposeModalBodyState {
    portfolioId: number
}

function ExposeModalBody({ entry, portfolio, refreshTrigger, handleClose }: CopyAssetToOtherPortfolioProps & { handleClose: () => void }) {
    const [state, setState] = useState<ExposeModalBodyState>({
        portfolioId: portfolio.id
    });

    const [isMoveDoneOpen, setMoveDoneOpen] = useState<boolean>(false);
    const handleMoveDoneClose = () => { setMoveDoneOpen(false); handleClose() };
    
    const [isCopyDoneOpen, setCopyDoneOpen] = useState<boolean>(false);
    const handleCopyDoneClose = () => { setCopyDoneOpen(false); handleClose() };

    let [copyMutation, { loading: mutationCopyLoading }] = useMutation<Mutation>(PORTFOLIO_ENTRY_COPY);
    let [moveMutation, { loading: mutationMoveLoading }] = useMutation<Mutation>(PORTFOLIO_ENTRY_MOVE);

    let { data: portfolioData, loading: portfoliosLoading } = useQuery<Query>(
        loader('./getUserPortfoliosAdd.graphql'));

    let validForm = !!state.portfolioId && state.portfolioId !== portfolio.id;

    return (
        <>
            <Container className="px-0">
                <Form className="modal-form input-bg my-4">
                    <Row className="row-cols-lg-2 row-cols-sm-1 pr-3">
                        <Col className="mb-4">
                            Sie haben {entry.quantity} Stück <b>"{entry.name}"</b> in Ihrem Portfolio "{portfolio.name}".
                            <br />Um diese Position in ein anderes Portfolio zu kopieren oder zu verschieben, nutzen Sie bitte das folgende Formular.
                        </Col>
                        <Col className="mb-md-0 mb-sm-5">
                            <Form.Group as={Row} className="form-group justify-content-end align-items-center">
                                <Form.Label className="text-right pr-0 mb-0">Ziel-Portfolio</Form.Label>
                                <Col className="col-sm-7 pr-0 dropdown-menu-height">
                                    {portfoliosLoading ?
                                        <Form.Text><Spinner animation="border" size="sm" /></Form.Text> :
                                        portfolioData?.user?.profile?.portfolios &&
                                        <ProfileSelectPortfolio
                                            portfolios={portfolioData?.user?.profile?.portfolios || []}
                                            callback={value => setState({ ...state, portfolioId: value })}
                                            portfolioId={state.portfolioId}
                                            value={portfolioData?.user?.profile?.portfolios ? portfolioData?.user?.profile?.portfolios.find(current => current.id === state.portfolioId)?.name || "" : ""}
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
                                    fromPortfolioId: portfolio.id,
                                    portfolioEntryId: entry.id,
                                    toPortfolioId: state.portfolioId
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
                                    fromPortfolioId: portfolio.id,
                                    portfolioEntryId: entry.id,
                                    toPortfolioId: state.portfolioId
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
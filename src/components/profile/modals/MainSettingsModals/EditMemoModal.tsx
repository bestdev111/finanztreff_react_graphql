import { ReactNode, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { Mutation, Portfolio, PortfolioEntry } from 'graphql/types';
import { useMutation } from '@apollo/client';
import moment from 'moment';
import { PORTFOLIO_ENTRY_EDIT } from 'components/profile/query';
import { ModalHeaderMeinFinanztreff } from 'components/profile/modals/ModalHeaderMeinFinanztreff';
import { ConfirmModal } from './ConfirmModal';

export function EditMemoModal(props: EditModalProps) {

    const [isOpen, setOpen] = useState<boolean>(false);
    const handleClose = () => setOpen(false);

    return (
        <>
            <div className="d-flex mt-4 w-100 cursor-pointer" onClick={() => setOpen(true)}>
                <span className="svg-icon top-move">
                    <img src="/static/img/svg/icon_note.svg" width="29" className="" alt="" />
                </span>
                <textarea className="d-block w-100 font-italic fs-13px border-0 w-100 bg-white" disabled id="noteInfoTextArea" name="noteInfoTextArea"
                    rows={2} value={props.entry.memo || "No memo"}>
                </textarea>
            </div>
            <Modal show={isOpen} onHide={handleClose} className="bottom modal-background modal-dialog-sky-placement">
                <div className="modal-dialog modal-content inner-modal modal-lg modal-dialog-sky-placement-date align-self-center">
                    <ModalHeaderMeinFinanztreff title="Notiz" close={handleClose} />
                    <Modal.Body className="bg-white w-100">
                        <ExposeModalBody portfolio={props.portfolio} entry={props.entry} onComplete={props.onComplete} handleClose={handleClose} />
                    </Modal.Body>
                </div>
            </Modal>
        </>
    );
}
interface EditModalProps {
    portfolio: Portfolio;
    entry: PortfolioEntry;
    onComplete: () => void;
}

interface ExposeModalBodyProps {
    portfolio: Portfolio;
    entry: PortfolioEntry;
    onComplete: () => void;
    handleClose: () => void;
}

function ExposeModalBody({ entry, portfolio, onComplete, handleClose }: ExposeModalBodyProps) {
    const [memo, setMemo] = useState<string | undefined>(entry.memo || undefined);

    const [isDoneOpen, setDoneOpen] = useState<boolean>(false);
    const handleDoneClose = () => { setDoneOpen(false); handleClose() };

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(PORTFOLIO_ENTRY_EDIT);

    let validForm = memo && memo !== entry.memo;

    return (
        <>
            <Container className="px-0">
                <Form className="modal-form input-bg">
                    <Row className="pr-3">
                        <Col className='pr-0 my-4'>
                            <textarea className="d-block w-100 font-italic" placeholder={"Hier können Sie Ihre Notiz eingeben. (max. 250 Zeichen)"} maxLength={250}
                                value={memo}
                                onChange={control => setMemo(control.target.value)}
                            />
                        </Col>
                    </Row>
                </Form>

                <Row className="justify-content-end mb-2 pr-3">
                    <Button variant='inline-inverse' className="mb-0 mr-1" onClick={handleClose}>
                        Abbrechen
                    </Button>
                    <Button variant="primary" disabled={!validForm}
                        onClick={() => {
                            mutation({
                                variables: {
                                    entry: {
                                        portfolioId: portfolio.id,
                                        portfolioEntryId: entry.id,
                                        instrumentId: entry.instrument?.id,
                                        price: entry.price || 0,
                                        quantity: entry.quantity || 0,
                                        charges: entry.buyCharges || 0,
                                        entryTime: moment(entry.entryTime).format(),
                                        memo: memo
                                    }
                                }
                            })
                                .then(() => {
                                    onComplete();
                                    setDoneOpen(true);
                                });
                        }}
                    >
                        {mutationLoading && <Spinner animation="border" />}
                        Speichern
                    </Button>
                </Row>
            </Container>
            {isDoneOpen &&
                <ConfirmModal title="Bearbeiten" text=" Die bearbeitung Ihres Wertpapiers war erfolgreich." isOpen={isDoneOpen} handleClose={handleDoneClose} />
            }
        </>
    );
}
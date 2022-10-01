import { useMutation } from "@apollo/client";
import { DELETE_ACCOUNT_ENTRY } from "components/profile/query";
import { AccountEntry, Mutation, Portfolio } from "graphql/types";
import { ReactNode, useState } from "react";
import { Button, Container, Modal, Row } from "react-bootstrap";
import { numberFormatWithSign, quoteFormat } from "utils";
import { ModalHeaderMeinFinanztreff } from "../../ModalHeaderMeinFinanztreff";
import { ConfirmModal } from "../ConfirmModal";

export function DeleteAccountEntry(props: DeleteAccountEntryProps) {
    const [isOpen, setOpen] = useState<boolean>(false);
    const handleClose = () => setOpen(false);
    const [isDoneOpen, setDoneOpen] = useState<boolean>(false);
    let [deleteAccountEntry, { loading: deleteLimitLoading }] = useMutation<Mutation>(DELETE_ACCOUNT_ENTRY);

    return (
        <>
            <span onClick={() => setOpen(true)}>{props.children}</span>
            <Modal show={isOpen} onHide={handleClose} className="modal bottom fade inner-modal modal-dialog-sky-placement">
                <div className="modal-dialog modal-content inner-modal modal-lg modal-dialog-sky-placement-date align-self-center">
                    <ModalHeaderMeinFinanztreff title={"Löschen bestätigen"} close={handleClose} />
                    <Modal.Body className="bg-white w-100">
                        <Container>
                            <Row>
                                Hiermit wird der Ertrag "<b>{props.entry.accountTypeDescriptionEn} <span className={props.entry.amount > 0 ? "text-green" : "text-pink"}>{numberFormatWithSign(props.entry.amount)}</span> EUR vom {quoteFormat(props.entry.entryTime)}</b>" endgültig gelöscht.
                            </Row>
                            <Row className="mb-2 mt-5 justify-content-end">
                                <Button variant='inline-inverse' className="mb-0 mr-2" onClick={handleClose}>
                                    Abbrechen
                                </Button>
                                <Button className="btn btn-pink with-icon-first" data-dismiss="modal"
                                    onClick={() => {
                                        const id = props.entry.id;
                                        const portfolioId = props.portfolio.id
                                        deleteAccountEntry({
                                            variables: {
                                                portfolioId: portfolioId,
                                                accountEntryId: id
                                            },
                                            update(cache) {
                                                const normalizedId = cache.identify({ id, __typename: 'AccountEntry' });
                                                cache.evict({ id: normalizedId });
                                                cache.gc();
                                            }
                                        })
                                            .then(() => {
                                                props.onComplete();
                                                setDoneOpen(true);
                                            });

                                    }
                                    }>
                                    <span className="svg-icon pr-1">
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_white.svg"} width="" className="" alt="" />
                                    </span>
                                    Löschen
                                </Button>

                            </Row>
                        </Container>
                    </Modal.Body>
                </div>
            </Modal>

            {isDoneOpen &&
                <ConfirmModal title="Dividende" text="Ihre Dividendenzahlung wurde erfolgreich in Ihr Konto übertragen." isOpen={isDoneOpen} handleClose={() => {setDoneOpen(false);handleClose()}} />
            }
        </>
    );
}

interface DeleteAccountEntryProps {
    children: ReactNode
    entry: AccountEntry;
    portfolio: Portfolio
    onComplete: () => void
}
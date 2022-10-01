import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useContext, useState } from 'react';
import { Button, Card, Col, Modal, Row, Spinner } from 'react-bootstrap';
import { PageHeaderFilterComponent } from 'components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent';
import classNames from 'classnames';
import PageHeaderFilterContext from 'components/layout/PageHeaderFilterComponent/PageHeaderFilterContext';
import { CREATE_USER_PORTFOLIO } from 'components/profile/query';
import { Broker, Mutation, Query } from 'graphql/types';
import { ConfirmModal } from '../MainSettingsModals/ConfirmModal';
import { ModalHeaderMeinFinanztreff } from '../ModalHeaderMeinFinanztreff';
import './CreateRealPortfolio.scss';
import { loader } from 'graphql.macro';

interface CreateRealPortfolioState {
    isOpen: boolean
    isDoneOpen: boolean
    itemName?: string
    brockerId?: number
}

interface CreateRealPortfolioProps {
    onComplete: () => void;
}

export function CreateRealPortfolio(props: CreateRealPortfolioProps) {

    let [state, setState] = useState<CreateRealPortfolioState>({ isOpen: false, isDoneOpen: false });

    const [createNewPortfolio] = useMutation<Mutation>(CREATE_USER_PORTFOLIO);

    let { data, loading } = useQuery<Query>(loader('./getBrokers.graphql'));

    const [broker, setBroker] = useState<{ name: string | undefined, id: number | undefined }>({ name: undefined, id: undefined });
    const handleBroker = (name: string, id: number) => setBroker({ name: name, id: id });
    const formControl: boolean = !!broker.name && !!broker.id && state.itemName !== "" && !!state.itemName;
    return (
        <>
            <Button variant="primary" className="bg-orange border-orange with-icon-first text-truncate" onClick={() => setState({ ...state, isOpen: true })}>
                <span className="svg-icon mr-1">
                    <img src="/static/img/svg/icon_plus_white1.svg" className="" alt="" />
                </span>
                <span>Neue Real-Portfolio anlegen</span>
            </Button>
            <Modal show={state.isOpen} onHide={() => setState({ ...state, isOpen: false })} size="lg" className="fade modal-dialog-sky-placement">
                <ModalHeaderMeinFinanztreff close={() => setState({ ...state, isOpen: false })} title={
                    <>
                        <span className="svg-icon">
                            <img src="/static/img/svg/icon_plus_orange.svg" alt="" className="mx-1 mb-1" />
                        </span>
                        <span>Neue Portfolio anlegen</span>
                    </>
                } />
                <Modal.Body className="modal-body bg-white">
                    <Row className="form-group d-flex input-bg mt-3 pr-3">
                        <Col className="col-md-2 col-sm-4 pt-1 text-nowrap">Portfolioname </Col>
                        <input type="text" className="form-control col-md-10 col-sm-8 form-control-sm" style={{ "width": "180px", backgroundColor: "#f1f1f1", border: "none" }}
                            onChange={(e: any) => setState({ ...state, itemName: e.target.value })} />
                    </Row>

                    <Row className="form-group d-flex input-bg pr-3">
                        <Col className="col-md-2 col-sm-4 pt-1 text-nowrap">Broker </Col>
                        {
                            loading &&
                            <div className={"mt-4 d-flex justify-content-center"} style={{ height: "70px" }}><Spinner animation="border" /></div>
                        }
                        {data && data.brokers &&
                            <Col className="broker-card bg-gray-light pl-0"  >
                                <PageHeaderFilterComponent
                                    variant={"inline-inverse"}
                                    toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_dark.svg"}
                                    title={broker.name}
                                    toggleVariant={"inline-blue-dropdown"}>
                                    <BrokerCard broker={broker} handleBroker={handleBroker} brokersList={data.brokers} />
                                </PageHeaderFilterComponent>
                            </Col>
                        }
                    </Row>

                    <Row className="fs-13px">
                        <Col className=" border-bottom-2 border-gray-light py-3 mx-3 px-0">
                            Ist Ihr Broker nicht dabei? Möglicherweise haben wir ihn noch nicht im System. Wenn Sie uns bei der Lösung dieses Problems unterstützen möchten, wenden Sie sich bitte an <u>ccc@finanztreff.de</u>
                        </Col>
                    </Row>
                    <Row className='justify-content-between mt-3'>
                        <Col className="col-md-6 col-sm-12 mb-md-0 mb-sm-2 text-md-left text-sm-right">
                            <Button variant="primary" className="bg-gray-light border-gray-light text-blue">
                                Leeres Real-Portfolio anlegen
                            </Button>
                        </Col>
                        <Col className="col-md-6 col-sm-12 mb-md-0 mb-sm-2 text-right">
                            <Button variant="primary" className="bg-orange border-orange" disabled={!formControl} onClick={() => {
                                if (formControl)
                                    createNewPortfolio({ variables: { name: state.itemName, real: true } })
                                        .then(() => {
                                            setState({
                                                ...state,
                                                isOpen: false,
                                                isDoneOpen: true
                                            });
                                            props.onComplete();
                                        })
                            }}>Anlegen und Order-PDFs hochladen</Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
            <ConfirmModal title={
                <>
                    <img src="/static/img/svg/icon_plus_orange.svg" alt="" className="mx-1 mb-1" />
                    <span>Hinzufügen erfolgreich</span>
                </>
            }
                text={<>Sie haben erfolgreich Portfolio <b>{state.itemName}</b> hinzugefügt!</>}
                isOpen={state.isDoneOpen || false} handleClose={() => setState({ ...state, isDoneOpen: false })} />
        </>
    );
}

export function BrokerCard(props: BrokerCardProps) {
    let context = useContext(PageHeaderFilterContext);

    let closeAction = useCallback(() => {
        if (context && context.close) {
            context.close();
        }
    }, [context]);

    return (
        <Card className={classNames("mr-auto ml-auto borderless shadow-none align-items-center")}>
            <Card.Body className="d-flex justify-content-center p-0" style={{ width: "550px" }}>
                <div className="button-container align-self-center">
                    {
                        props.brokersList.map((current, index) =>
                            <Button key={index} variant={'inline-inverse'} onClick={() => {
                                props.handleBroker(current.name, current.id);
                                closeAction()
                            }} className={classNames("btn m-1 p-1 px-2 f", props.broker.id === current.id && "active")}>
                                {current.name}
                            </Button>
                        )
                    }
                </div>
            </Card.Body>
        </Card>
    )
}

interface BrokerCardProps {
    handleBroker: (name: string, id: number) => void;
    broker: { name: string | undefined, id: number | undefined };
    brokersList: Broker[];
}
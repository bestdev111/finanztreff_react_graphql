import { useMutation } from '@apollo/client';
import classNames from 'classnames';
import SvgImage from 'components/common/image/SvgImage';
import { ConfirmModal } from 'components/profile/modals/MainSettingsModals/ConfirmModal';
import { ModalHeaderMeinFinanztreff } from 'components/profile/modals/ModalHeaderMeinFinanztreff';
import { UPDATE_USER_PORTFOLIO_ALERT } from 'components/profile/query';
import { Mutation, Portfolio } from 'graphql/types';
import { useViewport } from 'hooks/useViewport';
import {ReactNode, useEffect, useState} from 'react';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import { BoundaryDropdown } from './BoundaryDropdown';
import "./PortfolioAlert.scss";
import {guessInfonlineSection, trigInfonline} from "../../../../common/InfonlineService";

export function PortfolioAllertModal(props: PortfolioAllertModalProps) {
    let [state, setState] = useState<PortfolioAllertModalState>(
        {
            isOpen: false,
            portfolioAlert: props.portfolio.portfolioAlert,
            positionAlert: props.portfolio.positionAlert,
            portfolioLowerLimit: props.portfolio.portfolioLowerLimit || 4,
            portfolioUpperLimit: props.portfolio.portfolioUpperLimit || 4,
            positionLowerLimit: props.portfolio.positionLowerLimit || 4,
            positionUpperLimit: props.portfolio.positionUpperLimit || 4,
            isUpdateDoneOpen: false
        });
    let { width } = useViewport();

    let [updatePortfolioAlert, loading] = useMutation<Mutation>(UPDATE_USER_PORTFOLIO_ALERT);

    const close = () => setState({ ...state, isOpen: false });
    const handlePercent = (percent: number, inPosition: boolean, upperLimit: boolean) => {
        if (inPosition) {
            setState({ ...state, positionAlert: true });
            upperLimit ? setState({ ...state, positionUpperLimit: percent }) : setState({ ...state, positionLowerLimit: percent });
        }
        else {
            setState({ ...state, portfolioAlert: true });
            upperLimit ? setState({ ...state, portfolioUpperLimit: percent }) : setState({ ...state, portfolioLowerLimit: percent });
        }
    }

    useEffect(() => {
        if (state.isOpen) {
            trigInfonline(guessInfonlineSection(), "portfolio_alert_modal");
        }
    }, [state.isOpen])

    let validFormUpdate: boolean = state.portfolioAlert !== props.portfolio.portfolioAlert ||
        state.positionAlert !== props.portfolio.positionAlert ||
        state.portfolioLowerLimit !== props.portfolio.portfolioLowerLimit ||
        state.portfolioUpperLimit !== props.portfolio.portfolioUpperLimit ||
        state.positionLowerLimit !== props.portfolio.positionLowerLimit ||
        state.positionUpperLimit !== props.portfolio.positionUpperLimit;

    return (<>
        <Button variant="link" className="text-decoration-none text-white px-0" onClick={() => setState({ ...state, isOpen: true })}>
            {props.children}
        </Button>
        <Modal show={state.isOpen} onHide={() => setState({ ...state, isOpen: false })} size="lg" className={classNames("fade modal-dialog-sky-placement", width < 576 && 'bottom')}>
            <ModalHeaderMeinFinanztreff title={
                <span className="align-middle">
                    {(props.portfolio.portfolioAlert || props.portfolio.positionAlert) ?
                        <SvgImage icon="icon_portfolioalert_on_dark.svg" width="28" />
                        :
                        <SvgImage icon="icon_portfolioalert_off_dark.svg" width="28" />
                    }
                    <span className="ml-2">Portfolio-Alert</span>
                </span>
            } close={close} />
            <Modal.Body className="bg-white mx-xl-0 mx-lg-0 mx-sm-0">
                <Row className="fs-15px my-3">
                    <Col>
                    <b>Keine Sorge, Sie werden nichts mehr verpassen.</b>
                    <div>Wir benachrichtigen Sie wenn die Performance dieses Portfolios oder einer der enthaltenen Einzelwerte einen bestimmten Prozentwerte überschreitet. Beobachtet wird täglich die Veränderung zum Vortag.</div>
                    </Col>
                </Row>
                <Row className="dropdoown-percents mx-1 border-bottom-2 border-top-2 border-gray-light">
                    <Col className="col-lg-6 col-sm-12 px-0 pt-2 pb-2">
                        <Row className=''>
                            <Button variant="link" className="text-decoration-none font-weight-bold fs-18px text-gray-dark roboto-heading ml-n1"
                                onClick={() => setState({ ...state, portfolioAlert: !state.portfolioAlert })}>
                                {state.portfolioAlert ?
                                    <img src="/static/img/svg/icon_checkbox_checked_dark.svg" className="mb-1" width="30" alt="" /> :
                                    <img src="/static/img/svg/icon_checkbox_unchecked_dark.svg" className="mb-1" width="30" alt="" />
                                }
                                <span>Portfolio beobachten</span>
                            </Button>
                        </Row>
                        {state.portfolioAlert &&
                            <Row className="d-flex">
                                <div>
                                    <div className="d-flex ml-3">
                                        <span className="bg-green arrow px-1">
                                            <SvgImage icon="icon_limit_top_white.svg" convert={false} width="25" />
                                        </span>
                                        <BoundaryDropdown onSelect={(value: number) => handlePercent(value, false, true)} selected={state.portfolioUpperLimit} />
                                    </div>
                                    <div className="text-right fs-11px text-dark mt-n3 pt-1">obere Grenze</div>
                                </div>
                                <div>
                                    <div className="d-flex ml-2">
                                        <span className="bg-pink arrow px-1">
                                            <SvgImage icon="icon_limit_bottom_white.svg" convert={false} width="25" />
                                        </span>
                                        <BoundaryDropdown onSelect={(value: number) => handlePercent(value, false, false)} selected={state.portfolioLowerLimit} />
                                    </div>
                                    <div className="text-right fs-11px text-dark mt-n3 pt-1">untere Grenze</div>
                                </div>
                            </Row>
                        }
                    </Col>
                    <Col className="px-0 pt-2 pb-2 ">
                        <Row>
                            <Button variant="link" className="text-decoration-none font-weight-bold fs-18px text-gray-dark roboto-heading ml-n1"
                                onClick={() => setState({ ...state, positionAlert: !state.positionAlert })}>
                                {state.positionAlert ?
                                    <img src="/static/img/svg/icon_checkbox_checked_dark.svg" className="mb-1" width="30" alt="" /> :
                                    <img src="/static/img/svg/icon_checkbox_unchecked_dark.svg" className="mb-1" width="30" alt="" />
                                }
                                <span>Einzelwerte beobachten</span>
                            </Button>
                        </Row>
                        {state.positionAlert &&
                            <Row className="d-flex ml-1">
                                <div>
                                    <div className="d-flex">
                                        <span className="bg-green arrow px-1">
                                            <SvgImage icon="icon_limit_top_white.svg" convert={false} width="25" />
                                        </span>
                                        <BoundaryDropdown onSelect={(value: number) => handlePercent(value, true, true)} selected={state.positionUpperLimit} />
                                    </div>
                                    <div className="text-right fs-11px text-dark mt-n3 pt-1">obere Grenze</div>
                                </div>
                                <div>
                                    <div className="d-flex ml-2">
                                        <span className="bg-pink arrow px-1">
                                            <SvgImage icon="icon_limit_bottom_white.svg" convert={false} width="25" />
                                        </span>
                                        <BoundaryDropdown onSelect={(value: number) => handlePercent(value, true, false)} selected={state.positionLowerLimit} />
                                    </div>
                                    <div className="text-right fs-11px text-dark mt-n3 pt-1">untere Grenze</div>
                                </div>
                            </Row>
                        }
                    </Col>
                </Row>
                <Row className="d-flex justify-content-end mt-4 mx-1">
                    <Button className="btn btn-primary bg-border-gray text-blue border-border-gray mr-2" onClick={() => setState({ ...state, isOpen: false })}>
                        Abbrechen
                    </Button>
                    <Button variant="primary" disabled={!validFormUpdate}
                        onClick={() => {
                            updatePortfolioAlert({
                                variables: {
                                    entry: {
                                        portfolioId: props.portfolio.id,
                                        portfolioAlert: state.portfolioAlert,
                                        portfolioLowerLimit: state.portfolioLowerLimit,
                                        portfolioUpperLimit: state.portfolioUpperLimit,
                                        positionAlert: state.positionAlert,
                                        positionLowerLimit: state.positionLowerLimit,
                                        positionUpperLimit: state.positionUpperLimit,
                                    }
                                }
                            })
                                .then(() => {
                                    setState({
                                        ...state,
                                        isOpen: false,
                                        isUpdateDoneOpen: true
                                    });
                                });

                        }}>
                        Speichern und schließen
                    </Button>
                </Row>
            </Modal.Body>
        </Modal>
        <ConfirmModal title={<><img src="/static/img/svg/icon_check_hook_green.svg" width="16" alt="" className="mr-1" />Ihre Einstellungen wurden gespeichert</>}
            text={<></>}
            isOpen={state.isUpdateDoneOpen || false} handleClose={() => setState({ ...state, isUpdateDoneOpen: false })} />
    </>)
}

interface PortfolioAllertModalProps {
    children?: ReactNode
    portfolio: Portfolio
}

interface PortfolioAllertModalState {
    isOpen: boolean;
    portfolioAlert: boolean;
    positionAlert: boolean;
    portfolioLowerLimit: number
    portfolioUpperLimit: number
    positionLowerLimit: number
    positionUpperLimit: number
    isUpdateDoneOpen: boolean
}

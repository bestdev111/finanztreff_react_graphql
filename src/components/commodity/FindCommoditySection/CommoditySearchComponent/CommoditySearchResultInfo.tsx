import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { loader } from "graphql.macro";
import {Query, SearchEtfCriterion} from "graphql/types";
import { useViewport } from "hooks/useViewport";
import { useState} from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { BaseCardInfoComponent } from "components/common/SearchCard/BaseSearchCard";
import { CommodityResultView } from "./CommodityResultView";
import { CommodityCardDetails } from "./BaseCommoditySearchCard";
import { numberFormatDecimals } from "utils";
import {trigInfonline} from "../../../common/InfonlineService";

type CommoditySearchResultInfoProps = BaseCardInfoComponent<SearchEtfCriterion, CommodityCardDetails>;

export function CommoditySearchResultInfo(props: CommoditySearchResultInfoProps) {
    const [showModal, setShowModal] = useState(false);
    const closeModal = () => setShowModal(false);
    let { width } = useViewport();

    let { loading, data } = useQuery<Query>(loader('./getEtfSearchCount.graphql'), {
        variables: {
            criterion: {...props.criteria}
        },
        skip: !props.enabled
    });

    return (
        <>
            <Button variant="primary" className="fs-14px px-2 py-0 rounded-0" onClick={() => {
                setShowModal(true);
                trigInfonline('homepage', '003_01_02_L_TI_SuEr');
            }}
                    disabled={!props.enabled || (data && data.searchEtf.count < 1) || false}>
                {loading ?
                    <span className="mr-2"><Spinner animation="border" size="sm" /></span>
                    :
                    <b> {!props.enabled ? "-" : numberFormatDecimals(data?.searchEtf.count, 0)} </b>
                }
                Treffer anzeigen
            </Button>
            {showModal &&
                <>
                    <Modal
                        show={showModal}
                        scrollable={true}
                        className={classNames("fund-cards-in-modal modal-dialog-sky-placement", width < 576 && 'bottom')}
                        onHide={closeModal}
                        contentClassName="bg-white"
                        dialogClassName="px-2"
                    >
                        <ModalHeaderMeinFinanztreff title="Etf" close={closeModal} />
                        <Modal.Body  className="bg-border-gray  fund-search-result">
                            {props.children && <div className="funds-card d-xl-flex d-lg-flex d-md-flex d-sm-none flex-wrap flex-grow-inherit bg-white shadow-sm rounded-0 border-3 border-blue p-3">{props.children}</div>}
                            <CommodityResultView criteria={props.criteria} details={props.details || null}/>
                        </Modal.Body>
                    </Modal>
                </>
            }
        </>
    );
}

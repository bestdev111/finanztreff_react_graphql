import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { loader } from "graphql.macro";
import {Query, SearchBondCriterion} from "graphql/types";
import { useViewport } from "hooks/useViewport";
import {useEffect, useState} from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { BaseCardInfoComponent } from "components/common/SearchCard/BaseSearchCard";
import { BondResultView } from "components/bond/BondSearchPage/BondResultView";
import {numberFormatDecimals} from "../../../utils";
import {GlobalBondSearchProps} from "./BaseBondSearchCard";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

type BondSearchResultInfoProps = BaseCardInfoComponent<SearchBondCriterion, GlobalBondSearchProps>;

export function BondSearchResultInfo(props: BondSearchResultInfoProps) {
    const [showModal, setShowModal] = useState(false);
    const closeModal = () => setShowModal(false);
    let { width } = useViewport();

    let { loading, data } = useQuery<Query>(loader('./getBondSearchCount.graphql'), {
        variables: {
            criterion: {...props.criteria},
            sort: []
        },
        skip: !props.enabled
    });

    useEffect(() => {
        if (showModal) {
            trigInfonline(guessInfonlineSection(), "search_result")
        }
    }, [showModal])

    return (
        <>
            <Button variant="primary" className="fs-14px px-2 py-0 rounded-0" onClick={() => {
                setShowModal(true);
                // trigInfonline('homepage', '003_01_02_L_TI_SuEr');
            }}
                    disabled={!props.enabled || (data && data.searchBond.count < 1) || false}>
                {loading ?
                    <span className="mr-2"><Spinner animation="border" size="sm" /></span>
                    :
                    <b> {!props.enabled ? "-" : numberFormatDecimals(data?.searchBond.count, 0)} </b>
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
                        <ModalHeaderMeinFinanztreff title="Anleihen" close={closeModal} />
                        <Modal.Body  className="bg-border-gray  fund-search-result">
                            {props.children && <div className="funds-card d-xl-flex d-lg-flex d-md-flex d-sm-none flex-wrap flex-grow-inherit bg-white shadow-sm rounded-0 border-3 border-blue p-3">{props.children}</div>}
                            <BondResultView criteria={props.criteria} details={props.details || null}/>
                        </Modal.Body>
                    </Modal>
                </>
            }
        </>
    );
}

import React, {useEffect, useState} from "react";
import {BaseCardInfoComponent} from "../../common/SearchCard/BaseSearchCard";
import {Query, SearchShareCriterion, ShareSortField} from "../../../generated/graphql";
import {ShareSearchCardDetails} from "./BaseShareSearchCard";
import {useViewport} from "../../../hooks/useViewport";
import {useQuery} from "@apollo/client";
import {loader} from "graphql.macro";
import {Button, Modal, Spinner} from "react-bootstrap";
import {numberFormatDecimals} from "../../../utils";
import classNames from "classnames";
import {ModalHeaderMeinFinanztreff} from "../../profile/modals/ModalHeaderMeinFinanztreff";
import ShareSearchResultView from "./ShareSearchResultView";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

type ShareSearchResultInfoProps = BaseCardInfoComponent<SearchShareCriterion, ShareSearchCardDetails>;

export const ShareSearchResultInfo = (props: ShareSearchResultInfoProps) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const closeModal = () => setShowModal(false);
    let { width } = useViewport();

    let {data, loading} = useQuery<Query>(loader('./getSearchShareCount.graphql'), {
        variables: {
            criterion: {...props.criteria}
        },
        skip: !props.enabled
    });

    return (
        <>
            <Button variant="primary" className="fs-14px px-2 py-0 rounded-0" onClick={() => {
                setShowModal(true);
                trigInfonline(guessInfonlineSection(), 'search_result_Drop_Down');
            }} disabled={!props.enabled || (data && data.searchShare.count < 1) || false}>
                {loading ?
                    <span className="mr-2"><Spinner animation="border" size="sm"/></span>
                    :
                    <b> {!props.enabled ? "-" : numberFormatDecimals(data?.searchShare.count, 0)} </b>
                }
                Treffer anzeigen
            </Button>
            {
                showModal &&
                <>
                    <Modal
                        show={showModal}
                        scrollable={true}
                        className={classNames("fund-cards-in-modal modal-dialog-sky-placement", width < 576 && 'bottom')}
                        onHide={closeModal}
                        contentClassName="bg-white"
                        dialogClassName="px-2"
                    >
                        <ModalHeaderMeinFinanztreff title="Aktien" close={closeModal}/>
                        <Modal.Body id="share-search-results" className="bg-border-gray">
                            {props.children && <div
                                className="funds-card d-xl-flex d-lg-flex d-md-flex d-sm-none flex-wrap flex-grow-inherit bg-white shadow-sm rounded-0 border-3 border-blue p-3">{props.children}</div>}
                            <ShareSearchResultView shareSort={props.shareSort as ShareSortField}
                                cardResult={props.cardResult}
                                criteria={props.criteria}
                                tableHeaders={props.shareTableHeaders}
                                details={props.details as ShareSearchCardDetails | null}
                            />
                        </Modal.Body>
                    </Modal>
                </>
            }
        </>
    )
}

export default ShareSearchResultInfo

import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { loader } from "graphql.macro";
import { Query, SearchFundCriterion } from "graphql/types";
import { useViewport } from "hooks/useViewport";
import {ReactNode, useEffect, useState} from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { FundResults } from "./FundResults";
import {BaseCardInfoComponent} from "../../common/SearchCard/BaseSearchCard";
import { numberFormatDecimals } from "utils";
import { trigInfonline } from "components/common/InfonlineService";

type FundSearchResultInfoProps = BaseCardInfoComponent<SearchFundCriterion> ;
interface FundSearchResultInfoButon {
    buttonChild?: ReactNode;
    buttonName?: string;
    companyName?: string
}

export function FundSearchResultInfo(props: FundSearchResultInfoProps & FundSearchResultInfoButon ) {
    const [showModal, setShowModal] = useState(false);
    const closeModal = () => setShowModal(false);
    let { width } = useViewport();

    let { loading, data } = useQuery<Query>(loader('./getFundSearchCount.graphql'), {
        variables: {
            criterion: props.criteria,
            sort: []
        },
        skip: !props.enabled
    });

    useEffect(() => {
        if (showModal) {
            trigInfonline("fonds_search", "search_result");
        }
    }, [showModal])

    return (
        <>
        {
            props.buttonChild ?
            <span onClick={() => {
                setShowModal(true);
                trigInfonline('homepage', '003_01_02_L_TI_SuEr');
            }}>{props.buttonChild}</span>
            :
            <Button variant="primary" className={classNames("fs-14px px-2 py-0", props.className)} onClick={() => {
                setShowModal(true);
                // trigInfonline('homepage', '003_01_02_L_TI_SuEr');
            }}
                    disabled={!props.enabled || (data && data.searchFund.count < 1) || false}>
                {loading ?
                    <span className="mr-2"><Spinner animation="border" size="sm" /></span>
                    :
                    <b> {!props.enabled ? "-" : numberFormatDecimals(data?.searchFund.count, 0)} </b>
                }
                {props.buttonName ? props.buttonName : "Treffer anzeigen"}
            </Button>
        }
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
                        <ModalHeaderMeinFinanztreff title="Fonds" close={closeModal} />
                        <Modal.Body id="fund-search-results" className="bg-border-gray fund-search-result">
                            {props.children && <div  className="funds-card d-xl-flex d-lg-flex d-md-flex d-sm-none flex-wrap flex-grow-inherit bg-white shadow-sm rounded-0 border-3 border-blue p-3">{props.children}</div>}
                            <FundResults criteria={props.criteria} companyName={props.companyName}/>
                        </Modal.Body>
                    </Modal>
                </>
            }
        </>
    );
}

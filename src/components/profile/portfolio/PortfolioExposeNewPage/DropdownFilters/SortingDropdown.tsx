import SvgImage from "components/common/image/SvgImage";
import { usePageHeaderFilterState } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { useContext, useCallback, useState } from "react";
import { Card, Button } from "react-bootstrap";

function DropdownBody(props: SortingDropdownProps) {
    let [state, setState] = usePageHeaderFilterState<SortOption>({ sortType: props.sort.sortType, direction: props.sort.direction });
    let context = useContext(PageHeaderFilterContext);

    let closeAction = useCallback(() => {
        if (context) {
            context.close();
        }
    }, [context]);
    return (
        <Card className="countries-regions-filter px-3 pt-1 border-0">
            <Card.Header className="bg-white pb-0 pt-1 px-0 d-flex justify-content-between">
                <h6 className="font-weight-bold pt-2 fs-17px">Sortierung</h6>
                <span className="close-modal-butt svg-icon mr-n1 align-self-center cursor-pointer" onClick={() => closeAction()}>
                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_gray.svg"} alt="" className="svg-convert" width="27" />
                </span>
            </Card.Header>
            <Card.Body className="px-0 py-1">
                <div className="d-flex flex-wrap button-container mx-n1 border-bottom-2 border-gray-light py-2">
                    {
                        LIST_SORTING_TYPES.map(current =>
                            <Button variant={'inline-inverse'} onClick={() => setState({ ...state, sortType: current })}
                                className={state.sortType === current ? "btn active m-1" : "btn m-1"}>
                                {current}
                            </Button>
                        )
                    }
                </div>
                <div className="d-flex flex-wrap button-container mx-n1 mt-3 pb-0">
                    <Button variant={'inline-inverse'} onClick={() => setState({ ...state, direction: true })} className={state.direction ? "btn active" : "btn"} value="Aufsteigend">
                        <SvgImage icon={"icon_arrow_short_fullup_" + (state.direction ? "white" : "blue") + ".svg"} width="20" />
                        <span>Aufsteigend</span>
                    </Button>
                    <Button variant={'inline-inverse'} onClick={() => setState({ ...state, direction: false })} className={!state.direction ? "btn active" : "btn"} value="Aufsteigend">
                        <SvgImage icon={"icon_arrow_short_fulldown_" + (!state.direction ? "white" : "blue") + ".svg"} width="20" />
                        <span>Absteigend</span>
                    </Button>
                </div>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-end py-1 pr-0 bg-white">
                <Button variant={'inline-action'} className="px-0"
                    onClick={() => {
                        if (state.sortType !== props.sort.sortType || state.direction !== props.sort.direction) {
                            props.handleSort({ sortType: state.sortType, direction: state.direction })
                        }
                        closeAction();
                    }}
                >
                    <img className="check_icon mr-1" src={process.env.PUBLIC_URL + "/static/img/svg/icon_check_hook_green.svg"}
                        width="12" alt="Green check icon" />
                    Anwenden
                </Button>
            </Card.Footer>
        </Card>
    );
}


export function SortingDropdown(props: SortingDropdownProps) {

    return (
        <PageHeaderFilterComponent
            variant={"dropdown-panel"}
            toggleVariant={"panel-button"}
            toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"}
            title={<span className="title-dropdown">Sortierung</span>}
            description={
                <>
                <span className="d-none d-xl-block">{props.sort.sortType}</span>
                <div className="d-xl-none d-lg-flex d-sm-flex">
                    <SvgImage icon="icon_sort_white.svg" spanClass="mr-1" convert={false} width="34" />
                    <div className="">
                        <div className="fs-14px description-dropdown">
                            Sortierung
                        </div>
                    </div>
                </div>
                </>
            }>
            <DropdownBody sort={{ sortType: props.sort.sortType, direction: props.sort.direction }} handleSort={props.handleSort} />
        </PageHeaderFilterComponent>
    );
}

interface SortingDropdownProps {
    handleSort: (value: SortOption) => void;
    sort: SortOption;
}

interface SortOption {
    sortType: string;
    direction: boolean;
}

const LIST_SORTING_TYPES = ["Name", "Kaufdatum", "Erträge", "Performance gesamt", "Performance heute", "Gattung"]
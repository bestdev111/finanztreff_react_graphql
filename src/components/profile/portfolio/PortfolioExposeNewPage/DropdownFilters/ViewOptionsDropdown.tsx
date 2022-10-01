import SvgImage from "components/common/image/SvgImage";
import { usePageHeaderFilterState } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { useCallback, useContext, useState } from "react";
import { Card, Button } from "react-bootstrap";

function DropdownBody(props: DropdownBodyProps) {
    let [state, setState] = usePageHeaderFilterState<Option>({ name: props.viewName, id: props.viewId });
    let context = useContext(PageHeaderFilterContext);

    let closeAction = useCallback(() => {
        if (context) {
            context.close();
        }
    }, [context]);
    return (
        <Card className="countries-regions-filter px-3 pt-1 border-0">
            <Card.Header className="bg-white pb-0 pt-1 px-0 d-flex justify-content-between">
                <h6 className="font-weight-bold pt-2 fs-17px">Ansicht auswählen</h6>
                <span className="close-modal-butt svg-icon mr-n1 align-self-center cursor-pointer" onClick={() => closeAction()}>
                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_gray.svg"} alt="" className="svg-convert" width="27" />
                </span>
            </Card.Header>
            <Card.Body className="px-0 py-2">
                <div className="fs-17px font-weight-bold">Kacheln</div>
                <div className="d-flex flex-wrap button-container mx-n1">
                    {
                        CARD_OPTIONS.map(current =>
                            <Button variant={'inline-inverse'} onClick={() => {props.handleView({id: current.id, name: current.name }); closeAction()
                        }}
                                className={state.id === current.id ? "btn active m-1" : "btn m-1"}>
                                {current.name}
                            </Button>
                        )
                    }
                </div>
                <div className="fs-17px font-weight-bold mt-2">Liste</div>
                <div className="d-flex flex-wrap button-container mx-n1">
                    {
                        LIST_OPTIONS.map(current =>
                            <Button variant={'inline-inverse'} onClick={() => { props.handleView({id: current.id, name: current.name }); closeAction()
                        }}
                                className={state.id === current.id ? "btn active m-1" : "btn m-1"}>
                                {current.name}
                            </Button>
                        )
                    }
                </div>
            </Card.Body>
        </Card>
    );
}


export function ViewOptionsDropdown(props: ViewOptionsDropdownProps) {

    return (
        <PageHeaderFilterComponent
            variant={"dropdown-panel"}
            toggleVariant={"panel-button"}
            toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"}
                title={<span className="title-dropdown">Ansicht</span>}
            description={
                <>
                <span className="d-none d-xl-block">{props.view.name}</span>
                <div className="d-xl-none d-sm-flex">
                    <SvgImage icon="icon_filter_white.svg" spanClass="ml-n1 mt-n1" convert={false} width="37" />
                    <div className="">
                        <div className="fs-14px description-dropdown">
                        Ansicht
                        </div>
                    </div>
                </div>
                </>
            }>
            <DropdownBody viewName={props.view.name} viewId={props.view.id} handleView={props.handleView}/>
        </PageHeaderFilterComponent>
    );
}

interface Option {
    name: string;
    id: string;
}

interface DropdownBodyProps{
    viewName: string;
    viewId: string;
    handleView: (value: Option) => void;
}

const CARD_OPTIONS: Option[] = [{
    name: "Portfolio",
    id: "Portfolio",
}, {
    name: "Chart",
    id: "Chart",
}, {
    name: "Kennzahlen",
    id: "Kennzahlen",
}, {
    name: "Performance",
    id: "PerformanceKacheln",
}, {
    name: "News/Analysen",
    id: "News/Analysen",
}];

const LIST_OPTIONS: Option[] = [{
    name: "Einfach",
    id: "Einfach",
}, {
    name: "Performance",
    id: "PerformanceListe",
}, {
    name: "Erweitert",
    id: "Erweitert",
}];

interface ViewOptionsDropdownProps {
    handleView: (value: Option) => void;
    view: Option;
}
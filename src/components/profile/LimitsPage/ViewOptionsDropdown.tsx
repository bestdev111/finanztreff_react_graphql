import SvgImage from "components/common/image/SvgImage";
import { usePageHeaderFilterState } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { useCallback, useContext } from "react";
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
                <div className="d-flex flex-wrap button-container mx-n1">
                    <Button variant={'inline-inverse'} onClick={() => {
                        props.handleView({ id: "Kacheln", name: "Kacheln" }); closeAction()
                    }}
                        className={state.id === "Kacheln" ? "btn active m-1" : "btn m-1"}>
                        Kacheln
                    </Button>
                    <Button variant={'inline-inverse'} onClick={() => {
                        props.handleView({ id: "Liste", name: "Liste" }); closeAction()
                    }}
                        className={state.id === "Liste" ? "btn active m-1" : "btn m-1"}>
                        Liste
                    </Button>
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
            className="mx-xl-0 mx-lg-n2"
            description={
                <>
                    <span className="d-none d-xl-block">{props.view.name}</span>
                    <div className="d-xl-none d-sm-flex">
                        <SvgImage icon="icon_filter_white.svg" spanClass="ml-n1 mt-n1" convert={false} width="27" />
                        <div className="">
                            <div className="fs-14px description-dropdown">
                                Ansicht
                            </div>
                        </div>
                    </div>
                </>
            }>
            <DropdownBody viewName={props.view.name} viewId={props.view.id} handleView={props.handleView} />
        </PageHeaderFilterComponent>
    );
}

interface Option {
    name: string;
    id: string;
}

interface DropdownBodyProps {
    viewName: string;
    viewId: string;
    handleView: (value: Option) => void;
}

interface ViewOptionsDropdownProps {
    handleView: (value: Option) => void;
    view: Option;
}
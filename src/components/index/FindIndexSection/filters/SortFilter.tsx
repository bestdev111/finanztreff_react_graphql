import classNames from "classnames";
import SvgImage from "components/common/image/SvgImage";
import { usePageHeaderFilterState } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { ReactNode, useCallback, useContext, useState } from "react";
import { Button, Card } from "react-bootstrap";
import './CountriesAndRegionsFilter.scss';
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

interface SortFilterContentProps {
    className?: string;
    title: string;
    onSelect?: (type: SortTypeEvent, direction: boolean) => void;
    options?: string[];
    description?: string;
    direction?: boolean
}

interface SortTypeEvent {
    id: string;
    name: string;
}

interface SortFilterContentState {
    type: string;
    direction: boolean | any;
}

function SortFilterContent({ className, title, onSelect, options, description, direction }: SortFilterContentProps) {
    let [state, setState] = usePageHeaderFilterState<SortFilterContentState>({ type: description || "", direction: direction });
    let context = useContext(PageHeaderFilterContext);

    let closeAction = useCallback(() => {
        if (context) {
            context.close();
        }
    }, [context]);

    return (
        <Card className={classNames(className, "sort-filter px-3 pt-1 border-0")}>
            <Card.Header className="bg-white pb-0 pt-1 px-0 d-flex justify-content-between">
                <h6 className="font-weight-bold pt-2">
                    {title}
                </h6>
                <span className="close-modal-butt svg-icon mt-n1 mr-n1 cursor-pointer" onClick={() => closeAction()}>
                    <SvgImage icon="icon_close_blue.svg" imgClass="svg-blue" convert={false} width="27" />
                </span>
            </Card.Header>
            <Card.Body className="d-flex flex-wrap py-3 px-0">
                {
                    (options ? options : SORT_TYPE).map(current =>
                        <Button variant={'inline-inverse'} onClick={() => {
                            setState({ ...state, type: current })
                        }} className={state.type == current ? "btn active" : "btn"}>
                            {current}
                        </Button>
                    )
                }
            </Card.Body>
            <Card.Footer className="px-0 bg-white">
                <Button variant={'inline-inverse'} onClick={() => {
                    setState({ ...state, direction: true })
                }} className={state.direction == true ? "active btn" : "btn"}>
                    <SvgImage icon={state.direction ? "icon_arrow_short_fullup_white.svg" : "icon_arrow_short_fullup_blue.svg"} width="20" />
                    Aufsteigend
                </Button>
                <Button variant={'inline-inverse'} onClick={() => {
                    setState({ ...state, direction: false })
                }} className={!state.direction ? "active btn" : "btn"}>
                    <SvgImage icon={!state.direction  ? "icon_arrow_short_fullup_white.svg" : "icon_arrow_short_fullup_blue.svg"} style={{ transform: "rotate(180deg)" }} width="20" />
                    Absteigend
                </Button>
                <div className="d-flex justify-content-end pb-1 pt-3 pr-0 bg-white">
                    <Button variant={'inline-action'} className="px-0"
                        onClick={() => {
                            trigInfonline(guessInfonlineSection(), "limit_Sortierung");
                            if (onSelect) {
                                onSelect({ id: state.type, name: state.type }, state.direction);
                            }
                            closeAction();
                        }}
                    >
                        <img className="check_icon mr-1" src={process.env.PUBLIC_URL + "/static/img/svg/icon_check_hook_green.svg"}
                            width="12" alt="Green check icon" />
                        Anwenden
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    );
}

interface SortFilterState {
    description: string;
    direction: boolean | any;
}


export function SortFilter(props: SortFilterProps) {
    let [state, setState] = useState<SortFilterState>({ description: props.description || "", direction: props.direction });

    return (
        <PageHeaderFilterComponent
            variant={"dropdown-panel"}
            toggleVariant={"panel-button"}
            toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"}
            title={props.title ? props.title : "Sortierung"}
            className={classNames("mx-xl-0 mx-lg-n2", props.className)}
            description={
                state.description && !props.title ?
                    <>
                        <img src="/static/img/svg/icon_arrow_short_fullup_white.svg" style={{ transform: state.direction ? "" : "rotate(180deg)" }} width="20" className="svg-convert" alt="" />
                        {state.description}
                    </>
                    : null
            }
        >
            <SortFilterContent
                title={"Sortierung"}
                options={props.options}
                description={state.description}
                direction={state.direction}
                onSelect={(type: SortTypeEvent, direction: boolean) => {
                    if (props.onSelect) {
                        props.onSelect(type, direction);
                    }
                    setState({ description: type.name, direction: direction });
                }}
            />
        </PageHeaderFilterComponent>
    );
}

interface SortFilterProps {
    onSelect: (type: SortTypeEvent, direction: boolean) => void;
    options?: string[];
    description?: string;
    direction?: boolean
    title?: ReactNode
    className?: string;
}

const SORT_TYPE = ["Name", "Performance"];

import classNames from "classnames";
import { usePageHeaderFilterState } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { useCallback, useContext, useState } from "react";
import { Button, Card, } from "react-bootstrap";
interface FiltersFundProps {
    className?: string;
    title: string;
    onSelect?: (type: TypeSelectEvent) => void;
    options: any[];
    option?: string;
    optionId?: number;
    selected?: string;
}

interface TypeSelectEvent {
    id: number;
    name: string;
}

interface FiltersFundState {
    selected: string;
}

function FiltersFund({ className, title, options, onSelect, option, optionId, selected }: FiltersFundProps) {
    let [state, setState] = usePageHeaderFilterState<FiltersFundState>({ selected: selected || "" });
    let context = useContext(PageHeaderFilterContext);
    if (option && optionId && onSelect) {
        onSelect({ id: optionId, name: option })
    }

    let closeAction = useCallback(() => {
        if (context) {
            context.close();
        }
    }, [context]);

    return (
        <Card className={classNames(className, "options-filter px-3 pt-1 border-0")}>
            <Card.Header className="bg-white pb-0 pt-1 px-0 d-flex justify-content-between d-none d-xl-flex d-sm-none d-md-none d-lg-none">
                <h6 className="font-weight-bold pt-2">{title}</h6>
                <span className="close-modal-butt svg-icon mt-1 mr-n1 cursor-pointer" onClick={() => closeAction()}>
                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark.svg"} alt="" className="svg-convert svg-blue" />
                </span>
            </Card.Header>
            <Card.Body className="d-flex justify-content-center justify-content-xl-start px-0">
                <div className="d-flex flex-wrap button-container ml-xl-n3">
                    {
                        options.map(current =>
                            <Button variant={'inline-inverse'} onClick={() => {
                                setState({ ...state, selected: state.selected == current.name ? "Egal" : current.name })
                                if (onSelect) {
                                    onSelect({ id: state.selected === current.name ? 0 : current.id, name: state.selected === current.name ? "Egal" : current.name });
                                }
                                closeAction();
                            }} className={classNames("btn m-1",state.selected === current.name && "active")}>
                                {current.name}
                            </Button>
                        )
                    }
                </div>
            </Card.Body>
        </Card>
    );
}

interface FilterState {
    description: string;
}

export function Filter(props: FilterProps) {
    let [state, setState] = useState<FilterState>({ description: props.description || "Egal" });

    return (
        <PageHeaderFilterComponent
            variant={"dropdown-panel"}
            toggleVariant={"panel-button"}
            toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"}
            title={props.title}
            description={state.description}>
            <FiltersFund
                title={props.title}
                onSelect={(ev: TypeSelectEvent) => {
                    if (props.onSelect) {
                        props.onSelect(ev);
                    }
                    setState({ description: ev.name });
                }}
                selected={state.description}
                options={props.options ? props.options : [{ name: "Egal", id: 0 }, { name: "Ja", id: 1 }, { name: "Nein", id: 2 }]}
            />
        </PageHeaderFilterComponent>
    );
}

interface FilterProps {
    title: string;
    description?: string;
    options?: any;
    onSelect: (e: TypeSelectEvent) => void;
}
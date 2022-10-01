import classNames from "classnames";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { useCallback, useContext } from "react";
import { Button, Card } from "react-bootstrap";
import {guessInfonlineSection, trigInfonline} from "../InfonlineService";

interface FiltersFundProps<Type extends OptionItem> {
    className?: string;
    title: string;
    onSelect?: (type: Type) => void;
    options: Type[];
    selected?: Type;
    style?: any;
}

export type OptionItem = Option<string>;

export interface Option<ID> {
    id: ID;
    name: string;
}

function FiltersFund<Type extends OptionItem>({ className, title, options, onSelect, selected, style }: FiltersFundProps<Type>) {
    let context = useContext(PageHeaderFilterContext);

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
            <Card.Body className="d-flex justify-content-center justify-content-xl-start px-0" style={style}>
                <div className="d-flex flex-wrap button-container">
                    {
                        options.map(current =>
                            <Button key={current.id}
                                    variant={'inline-inverse text-truncate'}
                                    onClick={() => {
                                        if (onSelect) {
                                            onSelect(current);
                                        }
                                        closeAction();
                                        trigInfonline(guessInfonlineSection(), "search_result_Drop_Down")
                                    }}
                                    className={classNames("m-1", selected?.id === current.id && "active")}
                            >
                                {current.name}
                            </Button>
                        )
                    }
                </div>
            </Card.Body>
        </Card>
    );
}

interface FilterProps<Type extends OptionItem> {
    activeId?: string;
    onSelect: (e: Type) => void;
    options: Type[];
    style?: any;
}

export function FilterDropdownItem<Type extends OptionItem>(props: FilterProps<Type>) {
    if (props.options.length < 1) {
        return <></>;
    }

    const currentActive =
        (props.activeId && props.options.find(current => current.id === props.activeId)) || props.options[0];

    return (
        <PageHeaderFilterComponent title={currentActive.name}
            variant={"dropdown-plane-text"}
            toggleVariant={"dropdown-plane-text"}
            toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_blue.svg"}
            className="fund-filter-dropdown-item">
            <FiltersFund
                title={currentActive.name}
                onSelect={(ev: Type) => {
                    if (props.onSelect) {
                        props.onSelect(ev);
                    }
                }}
                selected={currentActive}
                options={props.options}
                style={props.style}
            />
        </PageHeaderFilterComponent>
    );
}

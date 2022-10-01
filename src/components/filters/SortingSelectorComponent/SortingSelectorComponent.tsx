import classNames from "classnames";
import { ReactNode, useCallback, useContext } from "react";
import { Button, Card, } from "react-bootstrap";
import { PageHeaderFilterBaseComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { usePageHeaderFilterState } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import SvgImage from "components/common/image/SvgImage";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";



interface SortingSelectorContentProps<T> {
    className?: string;
    title: string;
    onChange?: (value: Sorting<T>) => void;
    options: SortOption<T>[];

    optionId: T;
    direction: SortingDirection;
}

interface SortingSelectorContentState<T> {
    optionId: T;
    direction: SortingDirection;
}

function SortingSelectorContent<T>({ className, title, onChange, direction, options, optionId }: SortingSelectorContentProps<T>) {
    let [state, setState] = usePageHeaderFilterState<SortingSelectorContentState<T>>({ optionId, direction });
    let context = useContext(PageHeaderFilterContext);
    let closeAction = useCallback(() => {
        if (context) {
            context.close();
        }
    }, [context]);
    return (
        <Card className={classNames(className, "sorting-funds-filter px-3 pt-1 border-0")}>
            <Card.Header className="bg-white pb-0 pt-1 px-0 d-flex justify-content-between d-none d-xl-flex d-sm-none d-md-none d-lg-none">
                <h6 className="font-weight-bold pt-2">{title}</h6>
                <span className="close-modal-butt svg-icon mt-1 mr-n1 cursor-pointer" onClick={() => closeAction()}>
                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark.svg"} alt="" className="svg-convert svg-blue" />
                </span>
            </Card.Header>
            <Card.Body className="d-flex justify-content-center justify-content-xl-start px-0">
                <div>
                    <div className="d-flex flex-wrap button-container ml-xl-n3 pb-2">
                        {
                            options.map(option =>
                                <Button variant={'inline-inverse'} onClick={() => {
                                    trigInfonline(guessInfonlineSection(), "search_result");
                                    trigInfonline("fonds_search", "search_result");
                                    setState({ ...state, optionId: option.id })
                                }} className={classNames("btn m-1", option.id === state.optionId && "active")}
                                        disabled={option.disabled || false}
                                >
                                    {option.name}
                                </Button>
                            )
                        }
                    </div>
                    <div className="d-flex flex-wrap button-container ml-xl-n3 border-top-2 border-bottom-2 border-border-gray py-2">
                        <Button variant={'inline-inverse'} onClick={() => {
                            trigInfonline("fonds_search", "search_result");
                            trigInfonline(guessInfonlineSection(), "search_result");
                            setState({...state, direction: SortingDirection.ASCENDING})
                        }}
                                className={state.direction === SortingDirection.ASCENDING ? "btn active m-1" : "btn m-1"}>
                            Aufsteigend
                            <SvgImage icon={"icon_arrow_short_fullup_" + (state.direction === SortingDirection.ASCENDING ? "white" : "blue") + ".svg"} imgClass="mr-n2 mt-n1"  convert={false} width="18"/>
                        </Button>
                        <Button variant={'inline-inverse'} onClick={() => {
                            trigInfonline("fonds_search", "search_result");
                            trigInfonline(guessInfonlineSection(), "search_result");
                            setState({...state, direction: SortingDirection.DESCENDING})
                        }
                        } className={state.direction === SortingDirection.DESCENDING ? "btn active m-1" : "btn m-1"}>
                            Absteigend
                            <SvgImage icon={"icon_arrow_short_fulldown_" + (state.direction === SortingDirection.DESCENDING ? "white" : "blue") + ".svg"} imgClass="mr-n2 mt-n1" convert={false} width="18"/>
                        </Button>
                    </div>

                    <div className="d-flex justify-content-end mr-n3">
                        <Button className="text-blue d-flex align-items-center" variant="link"
                                onClick={() => { closeAction(); onChange && onChange({ id: state.optionId, direction: state.direction }); }}>
                            <SvgImage icon="icon_check_hook_green.svg" imgClass="mr-1" convert={false} />
                            <span>Anwenden</span>
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

export enum SortingDirection {
    ASCENDING,
    DESCENDING
}

export interface Sorting<T> {
    id: T;
    direction: SortingDirection;
}

export interface SortOption<T> {
    id: T;
    name: string;
    disabled?: boolean;
}

interface SortingSelectorComponentProps<T> {
    variant?: string | undefined;
    title: string;
    onChange: (e: Sorting<T>) => void;
    options: SortOption<T>[];

    description?: string | ReactNode;

    optionId: T;
    direction: SortingDirection;
}


export function SortingSelectorComponent<T = string>(props: SortingSelectorComponentProps<T>) {
    return (
        <PageHeaderFilterBaseComponent
            variant={props.variant || "dropdown-panel"}
            // toggleVariant={"sort-variant"}
            toggleVariant={"panel-button"}

            title={props.title}
            toggle={<SvgImage spanClass="px-2" icon="icon_sort.svg" convert={false} width="36" />}
            >
            <SortingSelectorContent<T>
                title={props.title}
                onChange={(ev: Sorting<T>) => {
                    if (props.onChange) {
                        props.onChange(ev);
                    }
                }}
                options={props.options}
                optionId={props.optionId}
                direction={props.direction}/>
        </PageHeaderFilterBaseComponent>
    );
}


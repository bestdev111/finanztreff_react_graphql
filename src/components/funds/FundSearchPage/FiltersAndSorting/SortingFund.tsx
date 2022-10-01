import classNames from "classnames";
import { ReactNode, useCallback, useContext } from "react";
import { Button, Card, } from "react-bootstrap";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { usePageHeaderFilterState } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import SvgImage from "components/common/image/SvgImage";
import { FundSortField, SearchFundSort } from "graphql/types";



interface SortingFundProps {
    className?: string;
    title: string;
    onSelect?: (value: SearchFundSort) => void;
    option?: string;
    optionId?: number;

    field: FundSortField | undefined;
    descending: boolean | undefined;
}

interface SortingFundState {
    field: FundSortField | undefined;
    descending: boolean | undefined;
}

function SortingFund({ className, title, onSelect, field, descending }: SortingFundProps) {
    let [state, setState] = usePageHeaderFilterState<SortingFundState>({ field: field, descending: descending });
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
                            [{name: "Name", id: FundSortField.Name}, {name: "Gebühren (TER)", id: FundSortField.TotalExpenseRatio}, {name: "Abstand 52W", id: FundSortField.FundTrancheVolume}, {name: "Fondsvolumen", id: FundSortField.FundVolume}].map(option =>
                                <Button variant={'inline-inverse'} onClick={() => {
                                    setState({ ...state, field: option.id })
                                }} className={classNames("btn m-1", option.id === state.field && "active")}>
                                    {option.name}
                                </Button>
                            )
                        }
                    </div>
                    <div className="d-flex flex-wrap button-container ml-xl-n3 border-top-2 border-bottom-2 border-border-gray py-2">
                        <Button variant={'inline-inverse'} onClick={() => setState({ ...state, descending: true })}
                            className={state.descending === true ? "btn active m-1" : "btn m-1"}>
                            Aufsteigend
                            <SvgImage icon={"icon_arrow_short_fullup_" + (state.descending === true ? "white" : "blue") + ".svg"} imgClass="mr-n2 mt-n1"  convert={false} width="18"/>
                        </Button>
                        <Button variant={'inline-inverse'} onClick={() => setState({ ...state, descending: false })
                        } className={state.descending === false ? "btn active m-1" : "btn m-1"}>
                            Absteigend
                            <SvgImage icon={"icon_arrow_short_fulldown_" + (state.descending === false ? "white" : "blue") + ".svg"} imgClass="mr-n2 mt-n1" convert={false} width="18"/>
                        </Button>
                    </div>

                    <div className="d-flex justify-content-end mr-n3">
                        <Button className="text-blue d-flex align-items-center" variant="link"
                            onClick={() => { closeAction(); onSelect && onSelect({ field: state.field, descending: state.descending }); }}>
                            <SvgImage icon="icon_check_hook_green.svg" imgClass="mr-1" convert={false} />
                            <span>Anwenden</span>
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}


export function Sorting(props: SortingProps) {

    return (
        <PageHeaderFilterComponent
            // variant={"dropdown-panel"}
            // toggleVariant={"panel-button"}
            title={"Sortierung"}
            description={props.description}>
            <SortingFund
                title={props.title}
                onSelect={(ev: SearchFundSort) => {
                    if (props.onSelect) {
                        props.onSelect(ev);
                    }
                }
                }
                field={props.field}
                descending={props.descending}/>
        </PageHeaderFilterComponent>
    );
}

interface SortingProps {
    title: string;
    onSelect: (e: SearchFundSort) => void;
    description?: string | ReactNode;

    field: FundSortField | undefined;
    descending: boolean | undefined;
}

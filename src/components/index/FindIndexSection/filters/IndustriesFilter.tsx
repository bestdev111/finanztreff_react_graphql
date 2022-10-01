import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { usePageHeaderFilterState } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { Sector } from "generated/graphql";
import { loader } from "graphql.macro";
import { useCallback, useContext, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import './CountriesAndRegionsFilter.scss';
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

interface IndustiesFilterContentProps {
    className?: string;
    title: string;
    onSelect?: (type: IndustriesSelectTypeEvent, option: IndustriesSelectOptionEvent) => void;
    options: { [key: string]: any[] };
    industry?: string;
    industryId?: number;
}

export interface IndustriesSelectTypeEvent {
    id: string;
    name: string;
}

export interface IndustriesSelectOptionEvent {
    id?: number;
    name: string;
}

interface IndustiesFilterContentState {
    selectedType: string;
    selectedOption?: {
        id?: number;
        name?: string;
    };
}

function IndustiesFilterContent({ className, title, options, onSelect, industry, industryId }: IndustiesFilterContentProps) {
    let [state, setState] = usePageHeaderFilterState<IndustiesFilterContentState>({ selectedType: industryId ? "Branchen" : "Alle", selectedOption: { id: industryId, name: industry } });
    let context = useContext(PageHeaderFilterContext);

    let closeAction = useCallback(() => {
        if (context) {
            context.close();
        }
    }, [context]);

    return (
        <Card className={classNames(className, "industries-filter px-3 pt-1 border-0")}>
            <Card.Header className="bg-white pb-0 pt-1 px-0 d-flex justify-content-between">
                <h6 className="font-weight-bold pt-2">
                    {title}
                </h6>
                <span className="close-modal-butt svg-icon mt-n1 mr-n1 cursor-pointer" onClick={() => {
                    if (onSelect) {
                        onSelect({ id: "", name: "" }, { id: undefined, name: "" });
                    };
                    setState({ selectedType: "Alle", selectedOption: { id: undefined, name: undefined } });
                    closeAction();
                }}>
                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark.svg"} alt="" className="svg-convert svg-blue" />
                </span>
            </Card.Header>
            <Card.Body className="d-flex flex-wrap py-3 px-0">
                {
                    Object.keys(options).map(current =>
                        <Button variant={'inline-inverse'} onClick={() => {
                            trigInfonline(guessInfonlineSection(), "industries_filter")
                            setState({ ...state, selectedType: current, selectedOption: { name: "", id: 0 } })
                        }} className={state.selectedType === current ? "btn active m-1" : "btn m-1"}>
                            {current}
                        </Button>
                    )
                }
            </Card.Body>
            {options[state.selectedType].length > 0 &&
                <Card.Footer className="px-0 bg-white">
                    <div className="font-weight-bold pb-1 font-size-15px">
                        Alle
                    </div>
                    <div className="d-flex flex-wrap">
                        {
                            options[state.selectedType].map(current =>
                                <Button variant={''} onClick={() => {
                                    trigInfonline(guessInfonlineSection(), "industries_filter")
                                    setState({ ...state, selectedOption: { name: current.name, id: current.id } })
                                }} className={state.selectedOption?.id === current.id ? "active branch-types text-left" : "branch-types text-left"}>
                                    {current.name}
                                </Button>
                            )
                        }
                    </div>
                </Card.Footer>
            }
            <Card.Footer className="d-flex justify-content-end py-1 pr-0 bg-white">
                <Button variant={'inline-action'} className="px-0"
                        onSelect={() =>   trigInfonline(guessInfonlineSection(), "industries_filter")}
                    onClick={() => {
                        if (onSelect) {
                            onSelect({ id: state.selectedType, name: state.selectedType }, { id: state.selectedOption?.id || undefined, name: state.selectedOption?.name || "" });
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

interface IndustriesFilterState {
    description: string;
}

interface IndustriesFilterProps {
    onSelect: (type: IndustriesSelectTypeEvent, option: IndustriesSelectOptionEvent) => void;
    industry?: string;
    industryId?: number;
}

export function IndustriesFilter(props: IndustriesFilterProps) {
    let [state, setState] = useState<IndustriesFilterState>({ description: '' });
    const { data: sectorsQueryResult, loading } = useQuery(loader('./getSectors.graphql'));
    let BranchesAndTypesOptions: any = {};
    if (!loading) {
        BranchesAndTypesOptions = {
            "Alle": [],
            "Branchen": !loading && sectorsQueryResult.sectors.map((current: Sector) => current),
        }
    }
    return (
        <PageHeaderFilterComponent
            variant={"dropdown-panel"}
            toggleVariant={"panel-button"}
            toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"}
            title={"Branchen & Arten"}
            description={props.industry}>
            {
                loading ?
                    <div className="text-center py-2"><Spinner animation="border" /></div>
                    :
                    <IndustiesFilterContent
                        title={"Branchen & Arten"}
                        onSelect={(type: IndustriesSelectTypeEvent, option: IndustriesSelectOptionEvent) => {
                            if (props.onSelect) {
                                props.onSelect({ id: type.id, name: type.name }, { id: option.id, name: option.name });
                            }
                            setState({ description: type.name });
                        }}
                        options={BranchesAndTypesOptions}
                        industry={props.industry}
                        industryId={props.industryId}
                    />
            }
        </PageHeaderFilterComponent>
    );
}

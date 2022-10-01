import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { usePageHeaderFilterState } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { loader } from "graphql.macro";
import { useCallback, useContext, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import './CountriesAndRegionsFilter.scss';

interface IndexSectionFilterContentProps {
    className?: string;
    title: string;
    onSelect?: (type: RegionsSelectEvent) => void;
    options: any[];
    region?: string;
    regionId?: number;
}

interface RegionsSelectEvent {
    id?: number;
    name?: string;
}

interface IndexSectionFilterContentState {
    selected: string;
}

function IndexSectionFilterContent({className, title, options, onSelect, region, regionId}: IndexSectionFilterContentProps) {
    let [state, setState] = usePageHeaderFilterState<IndexSectionFilterContentState>({selected: region || "Alle"});
    let context  = useContext(PageHeaderFilterContext);
    if(region && regionId && onSelect){
        onSelect({id: regionId, name: region})
    }

    let closeAction = useCallback(() => {
        if (context) {
            context.close();
        }
    }, [context]);

    return (
        <Card className={classNames(className, "countries-regions-filter px-3 pt-1 border-0")}>
            <Card.Header className="bg-white pb-0 pt-1 px-0 d-flex justify-content-between">
                <h6 className="font-weight-bold pt-2">{title}</h6>
                <span className="close-modal-butt svg-icon mt-n1 mr-n1 cursor-pointer" onClick={() => closeAction()}>
                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark.svg"} alt="" className="svg-convert svg-blue" />
                </span> 
            </Card.Header>
            <Card.Body className="d-flex justify-content-center px-0">
                <div className="d-flex flex-wrap button-container">
                    <Button variant={'inline-inverse'} onClick={() => {
                                setState({...state, selected: "Alle"})
                                if (onSelect) {
                                    onSelect({id: 0, name: "Alle"});
                                }
                                closeAction();
                            }} className={state.selected === "Alle" ? "btn active m-1" : "btn m-1"}>
                            Alle
                    </Button>
                {
                    options.map(current =>
                        <Button variant={'inline-inverse'} onClick={() => {
                                setState({...state, selected: current.name})
                                if (onSelect) {
                                    onSelect({id: current.id, name: current.name});
                                }
                                closeAction();
                            }} className={state.selected === current.name ? "btn active m-1" : "btn m-1"}>
                            {current.name}
                        </Button>
                    )
                }
                </div>
            </Card.Body>
        </Card>
    );
}

interface CountriesAndRegionsFilterState {
    description?: string;
}


export function CountriesAndRegionsFilter(props: CountriesAndRegionsFilterProps) {
    let [state, setState] = useState<CountriesAndRegionsFilterState>({description: ''});
    const {data: regionsQueryResult, loading} = useQuery(loader('./getRegions.graphql'));
    return (
        <PageHeaderFilterComponent
            variant={"dropdown-panel"}
            toggleVariant={"panel-button"}
            toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"}
            title={"Regionen & Länder"}
            description={props.region || state.description}>
                {
                    loading ? 
                    <div className="text-center py-2"><Spinner animation="border"/></div>
                    :
                    <IndexSectionFilterContent
                        title={"Regionen & Länder"}
                        onSelect={(ev: RegionsSelectEvent) => {
                            if (props.onSelect) {
                                props.onSelect(ev);
                            }
                            setState({description: ev.name});
                        }}
                        options={regionsQueryResult.regions}
                    />
                }
        </PageHeaderFilterComponent>
    );
}

interface CountriesAndRegionsFilterProps {
    onSelect: (e: RegionsSelectEvent) => void;
    region?: string | undefined;
    regionId?: number | undefined;
}
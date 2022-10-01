import classNames from "classnames";
import { usePageHeaderFilterState } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { useCallback, useContext, useState } from "react";
import { Button, Card } from "react-bootstrap";
import './DaysFilter.scss';

interface IndexSectionFilterContentProps {
    className?: string;
    title: string;
    onSelect?: (type: RegionsSelectEvent) => void;
    options: string[];
}

interface RegionsSelectEvent {
    id: string;
    name: string;
}

interface IndexSectionFilterContentState {
    selected: string;
}

function IndexSectionFilterContent({className, title, options, onSelect}: IndexSectionFilterContentProps) {
    let [state, setState] = usePageHeaderFilterState<IndexSectionFilterContentState>({selected: options[0]});
    let context  = useContext(PageHeaderFilterContext);

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
                {
                    options.map(current =>
                        <Button variant={'inline-inverse'} onClick={() => {
                                setState({...state, selected: current})
                                if (onSelect) {
                                    onSelect({id: current, name: current});
                                }
                                closeAction();
                            }} className={state.selected == current ? "btn active m-1" : "btn m-1"}>
                            {current}
                        </Button>
                    )
                }
                </div>
            </Card.Body>
        </Card>
    );
}

interface CountriesAndRegionsFilterState {
    description: string;
}


export function DaysFilter(props: CountriesAndRegionsFilterProps) {
    let [state, setState] = useState<CountriesAndRegionsFilterState>({description: ''});

    return (
        <PageHeaderFilterComponent
            variant={"dropdown-panel"}
            toggleVariant={"panel-button"}
            toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"}
            title={"Zeitraum"}
            description={state.description}>
            <IndexSectionFilterContent
                key ={state.description}
                title={"Ansicht auswählen"}
                onSelect={(ev: RegionsSelectEvent) => {
                    if (props.onSelect) {
                        props.onSelect(ev);
                    }
                    setState({description: ev.name});
                }}
                options={peroidOptions}
            />
        </PageHeaderFilterComponent>
    );
}

interface CountriesAndRegionsFilterProps {
    onSelect: (e: RegionsSelectEvent) => void;
    performance?: string
}

const peroidOptions = ["Intraday", "1 Woche", "1 Monat", "6 Monate", "1 Jahr", "3 Jahre"];
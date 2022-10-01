import {PageHeaderFilterComponent} from "../../layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import React, {ReactNode, useCallback, useContext, useState} from "react";
import PageHeaderFilterContext from "../../layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import {Button, Card, Spinner} from "react-bootstrap";
import classNames from "classnames";
import './InstituteSelectorComponent.scss'
import {usePageHeaderFilterState} from "../../layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import {useQuery} from "@apollo/client";
import {loader} from "graphql.macro";
import {Query} from "../../../generated/graphql";

interface Institute {
    id: string;
    name: string;
}

const INSTITUTES: Institute[] = [
    {id: 'DZ', name: 'DZ Bank'},
    {id: 'Kepler', name: 'Kepler Cheuvrex'},
    {id: 'DB', name: 'Deutsche Bank'}
];

interface InstituteSelectorContentComponentState {
    institute?: Institute;
}

interface InstituteSelectEvent {
    institute?: Institute;
}

interface InstituteSelectorContentComponentProps {
    onSelect?: (ev: InstituteSelectEvent) => void;
}

function InstituteSelectorContentComponent(props: InstituteSelectorContentComponentProps) {
    let [state, setState] = usePageHeaderFilterState<InstituteSelectorContentComponentState>({});
    let context  = useContext(PageHeaderFilterContext);
    let {data, loading} = useQuery<Query>(loader('./getAnalysisInstitutes.graphql'));

    let closeDropDown = useCallback(() => {
        if (context && context.close) {
            context.close();
        }
    }, [context]);

    return (
        <Card className={"border-0 institute-selector"}>
            <Card.Body className="border-0 p-0 d-flex justify-content-center">
                <div className="card-body-wrapper overflow-auto" style={{height: '300px'}}>
                    <Button variant='inline-action'
                            className={classNames("text-left w-100 font-weight-bold py-1", !state.institute ? 'active' : '')}
                            onClick={() => {
                                setState({...state, institute: undefined});
                                if (props.onSelect) {
                                    props.onSelect({});
                                }
                                closeDropDown();
                            }}
                    >Alle</Button>
                    {loading ? <Spinner animation={"border"}/> :

                        data?.analysisInstitute?.map(current =>
                        <>
                            <hr className={"m-0"}/>
                            <Button variant='inline-action'
                                    className={classNames("text-left w-100 py-2 font-weight-bold", state.institute?.name === current.name ? 'active' : '')}
                                    onClick={() => {
                                        let institute: Institute =  {id: current?.id || "", name: current?.name || ""};
                                        setState({...state, institute: institute});
                                        if (props.onSelect) {
                                            props.onSelect({institute: institute});
                                        }
                                        closeDropDown();
                                    }}
                            >{current.name}</Button>
                        </>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
}

interface InstituteSelectorComponentProps {
    name?: string;
    onSelect?: (ev: InstituteSelectEvent) => void;
}

interface InstituteSelectorComponentState {
    description?: string | ReactNode;
}

export function InstituteSelectorComponent(props: InstituteSelectorComponentProps) {
    let [state, setState] = useState<InstituteSelectorComponentState>({});
    return (
        <PageHeaderFilterComponent title={props.name || "Institute"} description={state.description}>
            <InstituteSelectorContentComponent
                onSelect={(ev) => {
                    if (props.onSelect) {
                        props.onSelect(ev);
                    }
                    if (ev.institute) {
                        setState({description: (<span className="text-uppercase">{ev.institute.name + " (" + ev.institute.id + ")"}</span>)})
                    } else {
                        setState({description: undefined});
                    }
                }}
            />
        </PageHeaderFilterComponent>
    );
}

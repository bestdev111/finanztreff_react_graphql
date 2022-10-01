import React, { ReactNode, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { CompositionTabComponent } from "./CompositionTabComponent";
import {
    CalculationPeriod,
    ChartScope,
    InstrumentGroup,
    InstrumentGroupComposition,
    Query
} from "../../../../graphql/types";
import { GET_INDEX_COMPOSITION, GET_INDEX_COMPOSITIONS } from "../../../../graphql/query";
import { getEnumValue, getFinanztreffAssetLink, KeyValuePair } from "../../../../utils";
import { TopAndFlopComponent } from "./TopAndFlopComponent";
import { DropdownButtonComponent } from "../../../common/dropdown-button";
import { CompositionViewCtrlBar, IndexCompositionView } from "./CompositionViewCtrlBar";
import { loader } from "graphql.macro";
import { Link } from 'react-router-dom'
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

export function IndexCompositionComponent(props: IndexCompositionComponentProps) {

    return (
        <>

            <section className="main-section index-component mt-5">
                <div className="container">
                    <div className="content-wrapper">
                        {props.group && <IndexComposition group={props.group} />}
                        {props.showOtherIndicesButton &&
                            <ImportantIndecesRow groupName={props.group.name || ""} />
                        }
                    </div>
                </div>
            </section>
        </>
    );
}

export function IndexComposition(props: {
    group: InstrumentGroup
}) {
    const { data, loading } = useQuery<Query>(GET_INDEX_COMPOSITIONS, {
        variables: { groupId: props.group.id }, skip: !props.group.id
    });

    if (data && data.group && data.group.compositions && data.group.compositions.length > 0) {

        return (<IndexCompositionContent group={props.group} compositions={data.group.compositions} />);

    }
    return (<></>)
}

export function IndexCompositionContent(props: {
    group: InstrumentGroup;
    compositions: InstrumentGroupComposition[];
}) {
    const [currentView, setCurrentView] = useState<IndexCompositionView>(IndexCompositionView.Charts);
    const [currentPeriod, setCurrentPeriod] = useState<CalculationPeriod>(CalculationPeriod.Intraday);
    const [composition, setCurrentComposition] = useState<InstrumentGroupComposition>(props.compositions[0]);
    const [currentSort, setCurrentSort] = useState<string[]>(['Alle', 'Aufsteigend']);
    const [isMobileFilterVisible, setMobileFilterStatus] = useState<boolean>(false);
    const [interval,setCurrentInterval] =  useState<string>(ChartScope.Intraday)
    return (<>
        <section className={"mobile-filter " + (isMobileFilterVisible ? " active" : "")}>
            <div className="row">
                <div className="col border-top-3 border-border-gray padding-top-15 margin-top-15 ">
                    <div className="col p-0">
                        <div className="row mb-3">
                            <h5 className="col-auto section-heading font-weight-bold">Ansicht filtern</h5>
                            <Button variant="link" className="col text-right" onClick={() => {
                                setMobileFilterStatus(false)
                            }}>
                                <span>schließen</span>
                                <span className="close-modal-butt svg-icon">
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark.svg"} alt="" className="svg-convert svg-blue" />
                                </span>
                            </Button>
                        </div>
                    </div>
                    <DropdownButtonComponent
                        values={
                            Object.keys(IndexCompositionView).map(
                                view => {
                                    const key = getEnumValue(IndexCompositionView, view);
                                    const value = view;
                                    return ({ key, value } as KeyValuePair)
                                }
                            )
                        }
                        title={'Ansicht'}
                        selected={currentView}
                        onChangeEvent={(value: IndexCompositionView) => {
                            setMobileFilterStatus(false);
                            setCurrentView(value);
                        }} />
                    <DropdownButtonComponent
                        values={
                            props.compositions
                                .filter(current => current.name)
                                .map((item: InstrumentGroupComposition) => {
                                    const key = item.name || null;
                                    const instrumentGroupComposition: InstrumentGroupComposition = {...item, } 
                                    const value = item;
                                    return ({ key, value } as KeyValuePair)
                                }
                                )
                        }
                        title={'Börsenplatz'}
                        selected={composition.name || ''}
                        onChangeEvent={(value: InstrumentGroupComposition) => {
                            setMobileFilterStatus(false);
                            setCurrentComposition(value);
                        }}
                    />
                </div>
            </div>
        </section>
        {props.group.id &&<CompositionCards
            interval={interval}
            groupName={props.group.name || ""}
            composition={composition}
            groupId={props.group.id}
            view={currentView}
            sort={currentSort}
            period={currentPeriod}
        >
            <CompositionViewCtrlBar
                onIntervalChange={(selected:string)=>setCurrentInterval(selected)}
                onViewChange={(selected: IndexCompositionView) => setCurrentView(selected)}
                onPeriodChange={(selected: CalculationPeriod) => setCurrentPeriod(selected)}
                onStockChange={(selected: InstrumentGroupComposition) => { setCurrentComposition(selected) }}
                onSortChange={(selected: string[]) => { setCurrentSort(selected) }}
                compositions={props.compositions}
            /></CompositionCards>
        }
    </>)

}
interface CompositionCardsProps {
    groupName: string;
    composition?: InstrumentGroupComposition;
    groupId: number;
    children: ReactNode
    view: IndexCompositionView
    sort: string[]
    period: CalculationPeriod
    interval : string
}

export function CompositionCards(props: CompositionCardsProps) {
    const [interval,_] =  useState<string>(props.interval);
    const { data, loading } = useQuery<Query>(GET_INDEX_COMPOSITION, {
        variables: { groupId: props.groupId, compositionId: props.composition && props.composition.id || 0 , chartScope :interval }
    });

    return (
        <>
            <div className="mx-xl-n3 mx-lg-n3 mx-sm-n1 mb-xl-4 mb-lg-4 mb-sm-3" style={{ marginTop: "-60px" }} id="indexzusammensetzung">
                <div className="heading-with-info d-flex justify-content-between align-items-center">
                    <h2 className="section-heading font-weight-bold ml-n2 ml-md-0" id="index-composition"> {props.groupName && props.groupName + " Einzelwerte /"} Indexzusammensetzung</h2>
                    {
                        loading ?
                            <div className="text-center py-2" ><Spinner animation="border" /></div>
                            :
                            data && data.group && data.group.composition &&
                            <TopAndFlopComponent composition={data.group.composition} />
                    }
                </div>
            </div>
            <div className="row">
                <div className="col">
                    {props.children}
                    {
                        loading ?
                            <div className="text-center py-2" ><Spinner animation="border" /></div>
                            :
                            data && data.group && data.group.composition && props.composition &&
                            <CompositionTabComponent
                                composition={data.group.composition}
                                currentView={props.view}
                                currentPeriod={props.period}
                                currentSort={props.sort}
                            />
                    }
                </div>
            </div>
        </>

    );
}

export function ImportantIndecesRow(props: { groupName: string }) {

    const { loading: importantIndicesLoading, data: importantIndicesData } = useQuery<Query>(
        loader('./getImportantIndices.graphql')
    );
    return (
        <div className="row">
            <div className="col border-top-3 border-border-gray padding-top-15 margin-top-15">
                <h3 className="content-wrapper-heading font-weight-bold pt-xl-2">Weitere Indizes</h3>
                <div className="content">
                    <div className="d-flex flex-wrap align-content-between mb-xl-n3">
                        {importantIndicesLoading ?
                            <Spinner animation="border" /> :
                            (importantIndicesData?.list?.content || [])
                                .filter(item => item.group.name !== props.groupName)
                                .map(item => item.group)
                                .map((group: InstrumentGroup, index: number) =>
                                (group.assetGroup && group.seoTag &&
                                    <Link onClick={()=>{ trigInfonline(guessInfonlineSection(), "portrait_page")}} key={index} to={getFinanztreffAssetLink(group.assetGroup, group.seoTag)} className="btn btn-primary mr-2 mb-2">{group.name}</Link>)
                                )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

interface IndexCompositionComponentProps {
    group: InstrumentGroup;
    showOtherIndicesButton?: boolean;
}

import React, {useState} from "react";
import {CompositionChartTabComponent} from "./CompositionChartTabComponent";
import {CompositionBasisTabComponent} from "./CompositionBasisTabComponent";
import {CompositionPerformanceTabComponent} from "./CompositionPerformanceTabComponent";
import {CompositionFKTabComponent} from "./CompositionFKTabComponent";
import {CompositionTKTabComponent} from "./CompositionTKTabComponent";
import {getEnumValue} from "../../../../utils";
import {CalculationPeriod, InstrumentGroupComposition} from "../../../../graphql/types";
import {Spinner} from "react-bootstrap";
import {IndexCompositionView} from "./CompositionViewCtrlBar";

export interface TabProperties {
    composition: InstrumentGroupComposition,
    currentView?: IndexCompositionView,
    currentPeriod?: CalculationPeriod,
    currentSort?: string[],
}

export function CompositionTabComponent(props: TabProperties) {
    const composition = props.composition;
    const currentView = props.currentView;
    if (!composition) return (<div className={"p-1"} style={{height: "70px"}}><Spinner animation="border"/></div>);
    return (
        <div className="content tab-content">

            {currentView === IndexCompositionView.Charts &&
            <CompositionChartTabComponent composition={composition} period={props.currentPeriod} currentSort={props.currentSort} />}

            {currentView === IndexCompositionView.Basis &&
            <CompositionBasisTabComponent composition={composition} />}

            {currentView === "Fund.Kennzahlen" &&
            <CompositionFKTabComponent composition={composition} />}

            {currentView === "Techn.Kennzahlen" &&
            <CompositionTKTabComponent composition={composition} />}

            {currentView === IndexCompositionView.Performance &&
            <CompositionPerformanceTabComponent composition={composition}/>}

        </div>
    )
}

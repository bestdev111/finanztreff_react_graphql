import {InstrumentGroup} from "../../../../../generated/graphql";
import React from "react";

interface TheScreenerRatingModalAnalysesProps {
    group: InstrumentGroup;
}
export const TheScreenerRatingModalAnalyses = (props: TheScreenerRatingModalAnalysesProps) => {
    return (
        <div className="content wb-m col pl-4">
            <div className="d-flex justify-content-between">
                <h3 className="content-wrapper-heading font-weight-bold">Aktuelle Kurzanalyse</h3>
            </div>
            <div className="content pr-2 pr-md-0">
                <div className="font-weight-bold margin-bottom-25">DAIMLER erreicht dank zusätzlichem Stern Gesamteindruck Neutral
                </div>
                <div className="font-size-13px text-kurs-grau">18.07.2020 - 06:03</div>
                <p className={"font-size-15px"}>
                    Das unabhängige Finanzanalyseunternehmen theScreener hat DAIMLER (DE) im Sektor Fahrzeugbau einen neuen
                    Stern
                    vergeben. Der Titel erreicht jetzt 4 von 4 Sternen. Bezüglich seines Börsenverhaltens bleibt er unverändert
                    und
                    wird als riskant eingestuft. theScreener ist der Ansicht, dass dies eine leichte Heraufstufung auf Neutral
                    ermöglicht. Am Datum der Analyse, dem 17. Juli 2020, betrug der Schlusskurs EUR 39,28 mit einem Zielwert von
                    EUR
                    35,36.
                </p>
            </div>
        </div>
    );
}

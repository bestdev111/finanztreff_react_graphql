import React from "react";
import classNames from "classnames";
import {numberFormatShort, shortNumberFormat} from "../../../../../utils";
import {createStatementRows} from "../BalanceSheetModal/utils";
import {useQuery} from "@apollo/client";
import {Query} from "../../../../../generated/graphql";
import {loader} from "graphql.macro";
import {Spinner} from "react-bootstrap";

export const SnapShotTable = (props: SnapShotTableProps) => {
    let {loading, data} = useQuery<Query>(
        loader('./getSnapShotTable.graphql'),
        {variables: {groupId: props.instrumentGroupId, category: 'SNAPSHOT', from: props.fromYear, to: props.toYear}}
    );

    if (loading) {
        return <Spinner animation="border"/>;
    }

    if (!data?.group?.company?.statements) {
        return <></>;
    }

    let entries = createStatementRows(data.group.company.statements.filter(current => current.name !== 'Aktuell ausstehende Aktien'));

    let years = Object.keys(entries[0].data)
        .map(current => Number.parseInt(current))
        .sort((a: number, b:number) => b - a)
        .slice(0, 5);
    return (
        <section className="main-section">
            <div className="container">
                <div className="content-row">
                    <div className="content-wrapper">
                        <h3 className="content-wrapper-heading font-weight-medium pl-2">Wertpapierdaten</h3>
                        <table className="table light-table text-center custom-border last-with-border fixed-layout-table">
                            <thead className="thead-light">
                            <tr className={"font-size-15px"}>
                                <th scope="col" className="text-left pl-2">
                                    <div>Datum</div>
                                </th>
                                {years.map((current: number, index: number) =>
                                    <th scope="col" className={classNames("text-right", index > 1 ? "d-none d-md-table-cell" : "")}>
                                        <div>{current}</div>
                                    </th>
                                )}
                            </tr>
                            </thead>
                            <tbody>
                            {
                                entries.map(current =>
                                    <tr className={"font-size-15px"}>
                                        <td className={classNames("text-left pl-2", current.important ? "font-weight-bold" : "")}>
                                            <span>{current.name}</span>
                                        </td>
                                        {
                                            years.map((year: number, index: number) =>
                                                <td className={classNames("text-right", current.important ? "font-weight-bold" : "", index > 1 ? "d-none d-md-table-cell" : "")}>
                                                    <div>{numberFormatShort(current.data[year])}</div>
                                                </td>
                                            )
                                        }
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                        <div className="bottom-text">
                            Aktuell ausstehende Aktien {shortNumberFormat(data.group.company.outstandingShares)}.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export interface SnapShotTableProps {
    instrumentGroupId: number;
    fromYear: number;
    toYear: number;
}

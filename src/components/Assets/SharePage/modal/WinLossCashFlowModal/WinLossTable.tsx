import React from "react";
import classNames from "classnames";
import {numberFormatShort} from "../../../../../utils";
import {createStatementRows} from "../BalanceSheetModal/utils";
import {useQuery} from "@apollo/client";
import {Query} from "../../../../../generated/graphql";
import {loader} from "graphql.macro";
import {Spinner, Table} from "react-bootstrap";

export const WinLossTable = (props: WinLossTableProps) => {
    let {loading, data} = useQuery<Query>(
        loader('./getWinLossTable.graphql'),
        {variables: {groupId: props.instrumentGroupId, category: 'INCOMESTATEMENT_OTHEROPERATINGRESULTS', from: props.fromYear, to: props.toYear}}
    );

    if (loading) {
        return <Spinner animation="border"/>;
    }

    if (!data?.group?.company?.statements) {
        return <></>;
    }

    let entries = createStatementRows(data.group.company.statements);

    let years = Object.keys(entries[0].data)
        .map(current => Number.parseInt(current))
        .sort((a: number, b:number) => b - a)
        .slice(0, 5);
    return (
        <section className="main-section">
            <div className="container">
                <div className="content-row">
                    <div className="content-wrapper">
                        <h3 className="content-wrapper-heading font-weight-medium ml-n1 ml-md-0">Gewinn und Verlustrechnung</h3>
                        <Table className="table light-table text-center custom-border last-with-border fixed-layout-table">
                            <thead className="thead-light">
                            <tr className={"font-size-15px"}>
                                <th scope="col" className="text-left">
                                    <div className={"ml-n1 ml-md-0"}>Datum</div>
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
                                        <td className={classNames("text-left pr-0 pl-2 pl-md-2 d-flex", current.important ? "font-weight-bold" : "")}>
                                            <span className={"text-truncate"}>{current.name}</span>
                                        </td>
                                        {
                                            years.map((year: number, index: number) =>
                                                <td className={classNames("text-right pl-0", current.important ? "font-weight-bold" : "", index > 1 ? "d-none d-md-table-cell" : "")}>
                                                    <div>{numberFormatShort(current.data[year])}</div>
                                                </td>
                                            )
                                        }
                                    </tr>
                                )
                            }
                            </tbody>
                        </Table>
                        <div className="bottom-text ml-n1">
                            Bilanziert nach {data.group.company.accountingStandard}, Angaben in Mio. {data?.group?.company?.currency?.name || ""}. Das Geschäftsjahr endet am {data?.group?.company?.fiscal?.day || 1}.{data?.group?.company?.fiscal?.month || 1}.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export interface WinLossTableProps {
    instrumentGroupId: number;
    fromYear: number;
    toYear: number;
}

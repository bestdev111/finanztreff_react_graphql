import React from "react";
import classNames from "classnames";
import {numberFormatShort} from "../../../../../utils";
import {createStatementRows} from "../BalanceSheetModal/utils";
import {useQuery} from "@apollo/client";
import {Query} from "../../../../../generated/graphql";
import {loader} from "graphql.macro";
import {Spinner} from "react-bootstrap";

export const CashFlowTable = (props: CashFlowTableProps) => {
    let {loading, data} = useQuery<Query>(
        loader('./getCashFlowTable.graphql'),
        {variables: {groupId: props.instrumentGroupId, category: 'CASHFLOW', from: props.fromYear, to: props.toYear}}
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
                        <h3 className="content-wrapper-heading font-weight-medium ml-n1">Cashflow</h3>
                        <table className="table light-table text-center custom-border last-with-border fixed-layout-table">
                            <thead className="thead-light">
                            <tr>
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
                        <div className="bottom-text ml-n1">
                            Bilanziert nach {data.group.company.accountingStandard}, Angaben in Mio. {data?.group?.company?.currency?.name || ""}. Das Geschäftsjahr endet am {data?.group?.company?.fiscal?.day || 1}.{data?.group?.company?.fiscal?.month || 1}.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export interface CashFlowTableProps {
    instrumentGroupId: number;
    fromYear: number;
    toYear: number;
}

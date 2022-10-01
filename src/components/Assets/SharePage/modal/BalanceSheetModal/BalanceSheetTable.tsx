import React, {Component} from "react";
import {numberFormatShort} from "../../../../../utils";
import classNames from "classnames";
import {StatementRow} from "./utils";

export class BalanceSheetTable extends Component<BalanceSheetTableProps, any> {
    render() {
        let years = Object.keys(this.props.assets[0].data)
                            .map(current => Number.parseInt(current))
                            .sort((a: number, b:number) => b - a)
                            .slice(0, 5);
        return (
            <>
                <h3 className="content-wrapper-heading font-weight-medium ml-n1 ml-md-0">Bilanz</h3>
                <table className="table light-table fixed-layout-table text-center custom-border last-with-border">
                    <thead className="thead-light">
                    <tr className={"font-size-15px"}>
                        <th scope="col" className="text-left">
                            <div className={"ml-n1 ml-md-0"}>Aktiva</div>
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
                            this.props.assets.map(current =>
                                <tr className={"font-size-15px"}>
                                    <td className={classNames("text-left pr-0 pl-2 pl-md-2 d-flex", current.important ? "font-weight-bold" : "")}>
                                        <span>{current.name}</span>
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
                        <tr className={"font-size-15px"}>
                            <td className="inner-table-heading">
                                <span className={"ml-n1 ml-md-0"}>Passiva</span>
                            </td>
                            {
                                years.map((_: number, index: number) =>
                                    <td className={classNames("inner-table-heading", index > 1 ? "d-none d-md-table-cell" : "")}>&nbsp;</td>
                                )
                            }
                        </tr>
                        {
                            this.props.liabilities.map(current =>
                                <tr className={"font-size-15px"}>
                                    <td className={classNames("text-left pr-0 pl-2 pl-md-2 d-flex", current.important ? "font-weight-bold" : "")}>
                                        <span className={"text-truncate"}>{current.name}</span>
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
                <div className="bottom-text">Bilanziert nach {this.props.meta.accounting}, Angaben in Mio. {this.props.meta.currency}. Das Geschäftsjahr endet am {this.props.meta.day}.{this.props.meta.month}.</div>
            </>
        );
    }
}

export interface BalanceMetadata {
    day: number;
    month: number;
    accounting: string;
    currency: string;
}

export interface BalanceSheetTableProps {
    meta: BalanceMetadata;
    assets: StatementRow[];
    liabilities: StatementRow[];
}

import React, {Component} from "react";
import {formatPrice, numberFormat, quoteFormat, shortNumberFormat} from "../../../../utils";
import {QuoteInformation} from "../PriceComparison/utils";
import {Table} from "react-bootstrap";
import { AssetGroup } from "graphql/types";

export class QuoteHistoryTable extends Component<QuoteHistoryTableProps, {}> {
    render() {
        return (
            <Table className="light-table text-center custom-border last-with-border">
                <thead className="thead-light">
                    <tr className={"font-size-15px"}>
                        <th scope="col" style={{width:"30px"}} className={"pr-0"}>&nbsp;</th>
                        <th scope="col" style={{width:"100px"}} className="text-right pl-0">
                            Datum
                        </th>
                        <th style={{width:"150"}} className="text-right d-none d-md-table-cell">
                            Eröffnung
                        </th>
                        <th className="text-right d-none d-md-table-cell">
                            Hoch
                        </th>
                        <th className="text-right d-none d-md-table-cell">
                            Tief
                        </th>
                        <th className="text-right">
                            Schlusskurs
                        </th>
                        <th className="text-right d-none d-md-table-cell">
                            GVolumen
                        </th>
                    </tr>
                </thead>
                <tbody>
                {
                    this.props.quotes.map(current =>
                        <tr className={"font-size-15px"}>
                            <td className="text-left pr-0 pl-2" style={{width:"30"}}>
                                {(Number(current.lastPrice || 0) > Number(current.firstPrice || 0)) ?
                                    <span className="svg-icon move-arrow">
                                        <img
                                            src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_up_green.svg"}
                                            alt=""/>
                                    </span>
                                    :
                                    <span className="svg-icon move-arrow">
                                        <img
                                            src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_down_red.svg"}
                                            alt=""/>
                                    </span>

                                }
                            </td>
                            <td className="text-right pl-0">
                                <span>{quoteFormat(current.when)}</span>
                            </td>
                            <td className="text-right d-none d-md-table-cell">
                                <span>{formatPrice(current.firstPrice, this.props.assetGroup)}</span>
                                <span> {this.props.currencyCode}</span>
                            </td>
                            <td className="text-right d-none d-md-table-cell">
                                <span>{formatPrice(current.highPrice, this.props.assetGroup)}</span>
                                <span> {this.props.currencyCode}</span>
                            </td>
                            <td className="text-right d-none d-md-table-cell">
                                <span>{formatPrice(current.lowPrice, this.props.assetGroup)}</span>
                                <span> {this.props.currencyCode}</span>
                            </td>
                            <td className="text-right">
                                <span>{formatPrice(current.lastPrice, this.props.assetGroup)}</span>
                                <span> {this.props.currencyCode}</span>
                            </td>
                            <td className="text-right d-none d-md-table-cell">
                                <span>{shortNumberFormat(current.volume)}</span>
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </Table>
        );
    }
}

interface QuoteHistoryTableProps {
    quotes: QuoteInformation[];
    currencyCode: string;
    assetGroup?: AssetGroup
}

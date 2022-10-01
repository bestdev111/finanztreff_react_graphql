import React, {Component} from "react";
import {Instrument, InstrumentGroup} from "../../../../generated/graphql";
import {Table} from "react-bootstrap";
import {ExchangeOverviewLabelRow} from "./ExchangeOverviewLabelRow";
import {ExchangeOverviewRow} from "./ExchangeOverviewRow";
import {getAssetLink} from "../../../../utils";
import {ProfileInstrumentAddPopup} from "../../modals/ProfileInstrumentAddPopup";
import SvgImage from "../../image/SvgImage";

function exchangeSort(a: Instrument, b: Instrument) {
    if(a.snapQuote?.quotes.filter(item => item?.type==="TRADE")[0]?.delay !== null && b.snapQuote?.quotes.filter(item => item?.type=="TRADE")[0]?.delay !== null){
        return a.snapQuote?.quotes.filter(item => item?.type==="TRADE")[0]?.delay! - b.snapQuote?.quotes.filter(item => item?.type=="TRADE")[0]?.delay!;
    }
    else return 10000;
}

export class ExchangeOverviewTable extends Component<ExchangeOverviewTableProps, any> {
    render() {
        let localExchanges: Instrument[] = this.props.instruments.filter(current => current.countryId === 48).sort(exchangeSort);
        let foreignExchanges: Instrument[] = this.props.instruments.filter(current => current.countryId !== 48).sort(exchangeSort);
        return (
            <Table responsive={true} className="custom-border last-with-border exchange-overview custom-border-top" style={{fontSize:"15px"}}>
                <thead className="thead-light table-figures">
                <tr className="first-row pl-2">
                    <th scope="col" rowSpan={2} className="text-left column-indicator p-0 d-sm-none d-md-table-cell">
                        &nbsp;
                    </th>
                    <th scope="col" className="text-left column-exchange p-0 pl-2 pl-xl-0 pb-1 pb-md-0 font-size-15px">
                        Börse
                    </th>
                    <th scope="col" className="text-left column-exchange p-0 d-sm-table-cell d-md-none">

                    </th>
                    <th scope="col" rowSpan={2} className="text-right align-middle d-none d-xl-table-cell column-currency pt-12 pb-12 font-size-15px">
                        Währung
                    </th>
                    <th scope="col" className="text-right align-bottom column-trade pt-12 pb-0 pr-0 font-size-15px">
                        Kurs
                    </th>
                    <th scope="col" className="text-right align-bottom d-none d-md-table-cell column-change pt-12 pb-0 font-size-15px">
                        +/-
                    </th>
                    <th scope="col" className="text-right align-bottom column-time pt-12 pb-0 pr-10px font-size-15px">
                        Zeit
                    </th>
                    <th scope="col" className="text-right align-bottom d-none d-md-table-cell column-bid pt-12 pb-0 font-size-15px">
                        Bid
                    </th>
                    <th scope="col" className="text-right align-bottom d-none d-md-table-cell column-bid pt-12 pb-0 font-size-15px">
                        Ask
                    </th>
                    <th scope="col" className="text-right align-bottom d-none d-xl-table-cell column-stats pt-12 pb-0 font-size-15px">
                        Vortag
                    </th>
                    <th scope="col" className="text-right align-bottom d-none d-xl-table-cell column-peak pt-12 pb-0 font-size-15px">
                        Hoch
                    </th>
                    <th scope="col" className="text-right align-bottom d-none d-xl-table-cell column-year-stats pt-12 pb-0 font-size-15px">
                        J-Hoch
                    </th>
                    <th scope="col" className="text-right align-bottom d-none d-xl-table-cell column-volume pt-12 pb-0 font-size-15px">
                        Trades
                    </th>
                    <th scope="col" rowSpan={2} style={{width: "40"}} className="p-2 d-none d-xl-table-cell column-profile pt-12 pb-0">
                        &nbsp;
                    </th>
                </tr>
                <tr className="second-row">
                    <th scope="col" className="align-top text-left p-0  pl-sm-2 pl-md-2 pl-xl-0 font-size-15px">
                        ISIN
                    </th>
                    <th scope="col" className="text-left column-exchange p-0 d-sm-table-cell d-md-none">

                    </th>
                    <th scope="col" className="text-right align-top pt-0 pb-0 px-0 font-size-15px text-nowrap">
                        GVol. Stk.
                    </th>
                    <th scope="col" className="text-right align-top d-none d-md-table-cell pt-0 pb-0 font-size-15px">
                        %
                    </th>
                    <th scope="col" className="text-right align-top pt-0 pb-0 pr-10px font-size-15px">
                        Volumen
                    </th>
                    <th scope="col" className="text-right align-top d-none d-md-table-cell pt-0 pb-0 font-size-15px">
                        Stück
                    </th>
                    <th scope="col" className="text-right align-top d-none d-md-table-cell pt-0 pb-0 font-size-15px">
                        Stück
                    </th>
                    <th scope="col" className="text-right align-top d-none d-xl-table-cell pt-0 pb-0 font-size-15px">
                        Eröffnung
                    </th>
                    <th scope="col" className="text-right align-top d-none d-xl-table-cell pt-0 pb-0 font-size-15px">
                        Tief
                    </th>
                    <th scope="col" className="text-right align-top d-none d-xl-table-cell pt-0 pb-0 font-size-15px">
                        J-Tief
                    </th>
                    <th scope="col" className="text-right align-top d-none d-xl-table-cell pt-0 pb-0 font-size-15px">
                        GVolumen
                    </th>
                </tr>
                </thead>
                <tbody className="padding-bottom-body">
                { localExchanges.length > 0 &&
                <>
                    <ExchangeOverviewLabelRow headingPaddingTop={true} title="Deutsche Börsen"/>
                    {
                        localExchanges
                            .map(item =>
                                <ExchangeOverviewRow
                                    isLink={this.props.isLink}
                                    instrument={item}
                                    group={this.props.group}
                                    url={getAssetLink(this.props.group)}
                                    callback={id => this.props.callback && this.props.callback(id || 0 )}
                                >
                                    {this.props.group && this.props.group.id && this.props.onActivate &&
                                        <ProfileInstrumentAddPopup
                                            instrumentId={item.id}
                                            instrumentGroupId={this.props.group.id}
                                            name={item.name}
                                            className="p-0 m-0"
                                            onActivate={() => this.props.onActivate && this.props.onActivate()}
                                            watchlist={true} portfolio={true}>
                                            <SvgImage icon="icon_plus_blue.svg" convert={false} imgClass="shrink-08" width="28"/>
                                        </ProfileInstrumentAddPopup>
                                    }
                                </ExchangeOverviewRow>
                            )
                    }
                </>
                }
                { foreignExchanges.length > 0 &&
                <>
                    <ExchangeOverviewLabelRow headingPaddingTop={false} title="Ausländische Börsen"/>
                    {
                        foreignExchanges
                            .map(item =>
                                <ExchangeOverviewRow instrument={item}
                                                     group={this.props.group}
                                                     url={getAssetLink(this.props.group)}
                                                     callback={id => this.props.callback && this.props.callback(id || 0)}
                                >
                                    {this.props.group && this.props.group.id && this.props.onActivate &&
                                        <ProfileInstrumentAddPopup
                                            instrumentId={item.id}
                                            instrumentGroupId={this.props.group.id}
                                            name={item.name}
                                            className="p-0 m-0"
                                            onActivate={() => this.props.onActivate && this.props.onActivate()}
                                            watchlist={true} portfolio={true}>
                                            <SvgImage icon="icon_plus_blue.svg" convert={false} imgClass="shrink-08" width="28"/>
                                        </ProfileInstrumentAddPopup>
                                    }
                                </ExchangeOverviewRow>
                            )
                    }
                </>
                }
                </tbody>
            </Table>

        );
    }
}
interface ExchangeOverviewTableProps {
    instruments: Instrument[];
    group?: InstrumentGroup;
    onActivate?: () => void;
    callback?: (id: number) => void;
    isLink?: boolean;
}

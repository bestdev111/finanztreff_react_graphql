import { useMutation } from "@apollo/client";
import classNames from "classnames";
import { getColor } from "components/commodity/CommodityChartsSection/CommodityResultCard";
import SvgImage from "components/common/image/SvgImage";
import { WatchlistInstrumentAdd } from "components/common/profile/WatchlistInstrumentAdd";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { InstrumentLimits } from "components/profile/common/InstrumentLimits/InstrumentLimits";
import { DeleteWatchlistEntry, EditWatchlistEntry } from "components/profile/modals";
import { NewsModalMeinFinanztreff } from "components/profile/modals/NewsModal/NewsModalMeinFinanztreff";
import { CopyWKN } from "components/profile/portfolio/PortfolioExposeNewPage/TableViews/SimpleViewTable";
import { getAssetGroup, orderWatchlistEntriesInListView } from "components/profile/utils";
import { loader } from "graphql.macro";
import { LimitEntry, Mutation, QuoteType, UserProfile, Watchlist, WatchlistEntry } from "graphql/types";
import moment from "moment";
import { useState } from "react";
import { Button } from "react-bootstrap";
import {
    formatPrice,
    fullDateTimeFormat,
    numberFormat,
    numberFormatWithSign,
    quoteFormat,
    shortNumberFormat
} from "utils";
import { CSVExportButton } from "../WatchlistContentCards/CSVExportButton";

export function ExpandedInformationViewTable(props: WatchlistEntriesViewProps & {handleSort: (value: string) => void}) {
    let watchlist: WatchlistEntry[] = orderWatchlistEntriesInListView(props.entries, props.sort.sortType, props.sort.direction);

    let [mutation] = useMutation<Mutation>(loader('./editWatchlistOrder.graphql'));

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const handleClose = () => {
        setDeleteModalOpen(false);
    }


    return (
        <div className="tab-pane fade view-type-liste show active overflow-auto mt-sm-2">
            <div className="content-wrapper overflow-auto">
                <table className="table light-table text-center custom-border last-with-border fnt-size-15">
                    <thead className="thead-light">
                        <tr className="table-with-sort">
                            <th className="text-left pr-0">
                                <div className="d-flex"  onClick={() => props.handleSort("TableBezeichnung")} >Bezeichnung
                                    {props.sort.sortType === "TableBezeichnung" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" className="svg-convert img-dropdown" width={20} style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                                <div>
                                    <span className="py-0 pl-0 font-weight-light text-blue" onClick={() => props.handleSort("TableGattung")}>
                                        Gattung
                                        {props.sort.sortType === "TableGattung" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" className="svg-convert img-dropdown" width={20} style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                    </span>
                                    <span className="py-0 pl-2 font-weight-light text-dark cursor-default">WKN</span>
                                </div>
                            </th>
                            <th className="px-0 text-nowrap">
                                <div className="text-right text-dark pl-n3" >Aufnahme Kurs
                                </div>
                                <div className="text-right " onClick={() => props.handleSort("TableAufnahme Datum")}>Aufnahme Datum
                                    {props.sort.sortType === "TableAufnahme Datum" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                            </th>
                            <th className="text-left" onClick={() => props.handleSort("TableKurs")}>Kurs aktuell
                                {props.sort.sortType === "TableKurs" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                <div></div>
                            </th>
                            <th className="px-0 text-nowrap">
                                <div className="text-right" onClick={() => props.handleSort("Table+/-")}>+/-
                                    {props.sort.sortType === "Table+/-" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                                <div className="text-right " onClick={() => props.handleSort("Table%")}>%
                                    {props.sort.sortType === "Table%" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                            </th>
                            <th className="text-nowrap px-0">
                                <div className="text-right cursor-default" onClick={() => props.handleSort("TableGUmsatz")}>GUmsatz
                                    {props.sort.sortType === "TableGUmsatz" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                                <div className="text-right " onClick={() => props.handleSort("TableTrades")}>Trades
                                    {props.sort.sortType === "TableTrades" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                            </th>
                            <th className=" text-nowrap px-0">
                                <div className="text-right" onClick={() => props.handleSort("TableBID")} >BID
                                    {props.sort.sortType === "TableBID" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                                <div className="text-right " onClick={() => props.handleSort("TableASK")}>ASK
                                    {props.sort.sortType === "TableASK" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                            </th>
                            <th className="pl-0 text-nowrap">
                                <div className="text-right" onClick={() => props.handleSort("TableStückBid")} >Stück
                                    {props.sort.sortType === "TableStückBid" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                                <div className="text-right " onClick={() => props.handleSort("TableStückAsk")}>Stück
                                    {props.sort.sortType === "TableStückAsk" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                            </th>
                            <th className="pl-0 text-nowrap">
                                <div className="text-right" onClick={() => props.handleSort("TableUmsatz")} >GVolumen
                                    {props.sort.sortType === "TableUmsatz" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                                <div className="text-right" onClick={() => props.handleSort("TableVola")}>Vola %
                                    {props.sort.sortType === "TableVola" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                            </th>
                            <th className="pl-0 text-nowrap">
                                <div className="text-right" onClick={() => props.handleSort("TableVortag")}>Vortag
                                    {props.sort.sortType === "TableVortag" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                                <div className="text-right " onClick={() => props.handleSort("TableEröffnung")}>Eröffnung
                                    {props.sort.sortType === "TableEröffnung" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                            </th>
                            <th className="pl-0 text-nowrap">
                                <div className="text-right" onClick={() => props.handleSort("TableHoch")} >Hoch
                                    {props.sort.sortType === "TableHoch" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                                <div className="text-right" onClick={() => props.handleSort("TableTief")}>Tief
                                    {props.sort.sortType === "TableTief" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                            </th>
                            <th className=" px-0">&nbsp;</th>
                            <th className=" px-0">&nbsp;</th>
                            <th className=" px-0">&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {watchlist.map((entry, index) => {
                            const quote = (entry.snapQuote &&
                                (entry.snapQuote.quotes.find(current => current?.type === QuoteType.Trade)
                                    || entry.snapQuote.quotes.find(current => current?.type === QuoteType.NetAssetValue))) || undefined;
                            const BID = (entry.snapQuote &&
                                (entry.snapQuote.quotes.find(current => current?.type === QuoteType.Bid)
                                    || entry.snapQuote.quotes.find(current => current?.type === QuoteType.IssuePrice))) || undefined;
                            const ASK = (entry.snapQuote &&
                                (entry.snapQuote.quotes.find(current => current?.type === QuoteType.Ask)
                                    || entry.snapQuote.quotes.find(current => current?.type === QuoteType.RedemptionPrice))) || undefined;
                            let delay = quote && quote?.delay && quote?.delay > 1 ? 15 : 1;
                            const assetType: string = getAssetGroup(entry?.instrument?.group.assetGroup);

                            const oldAssetNoTradding = moment().subtract(10, "d").isAfter(moment(quote && quote.when)) || !quote;
                            let limits = props.limits.filter(limit => entry.instrument && limit.instrumentId === entry.instrument.id);
                            const performance = entry.instrument?.performance;

                            const vola = (performance || []).find(current => current.period === 'MONTH1')?.vola;

                            return (
                                <>
                                    <tr key={entry.id} className={classNames("fs-14px", oldAssetNoTradding && "bg-gray-neutral")}>
                                        <td className="text-left text-nowrap py-1 pr-0">
                                            {oldAssetNoTradding && <img className="align-middle" style={{ marginTop: "-2px" }}
                                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_alert_red.svg"}
                                                width="20"
                                                alt="search news icon" />
                                            }
                                            <AssetLinkComponent instrument={entry.instrument} className="font-weight-bold" size={25} />
                                            <div className="p-0 border-0" style={{ minWidth: "120px" }}>
                                                <span className={classNames("asset-type-text-color font-weight-bold pr-2 ", entry.instrument?.group.assetGroup)}>{assetType.toUpperCase()}</span>
                                                <span>{entry.instrument?.wkn}</span>
                                                {entry.instrument && entry.instrument.wkn &&
                                                    <span className="py-0 pl-0 font-weight-light border-0 text-right ">
                                                        <CopyWKN wkn={entry.instrument?.wkn || ""} className="p-0 mt-n1" />
                                                    </span>
                                                }
                                            </div>
                                        </td>
                                        <td className="px-0 py-1">
                                            <div className="text-right">
                                                <span>{numberFormat(entry.price)}</span>
                                            </div>
                                            <div className="text-right">
                                                {quoteFormat(entry.entryTime)}
                                            </div>
                                        </td>
                                        <td className="text-left font-weight-bold pr-0 text-nowrap py-1">
                                            {quote && quote.delay === 1 &&
                                                <span className="timing-info-box bg-orange" style={{ width: "5%" }}>RT</span>
                                            }
                                            {quote && quote.delay !== 1 &&
                                                <span className="timing-info-box bg-gray-dark" style={{ width: "15px" }}>{delay}</span>
                                            }

                                            <span>{quote && quote.value && formatPrice(quote.value, entry.instrument?.group?.assetGroup,quote?.value, entry.instrument?.currency.displayCode || "")} </span>
                                            <span className="svg-icon move-arrow">
                                                {
                                                    quote && quote.percentChange ?
                                                        quote.percentChange > 0 ?
                                                            <img src="/static/img/svg/icon_arrow_short_up_green.svg" alt="" />
                                                            : quote.percentChange < 0 ?
                                                                <img src="/static/img/svg/icon_arrow_short_down_red.svg" alt="" />
                                                                : <img src="/static/img/svg/icon_arrow_short_right_grey.svg" alt="" width={28} />
                                                        : ""
                                                }
                                            </span>
                                            <div className="font-weight-light">
                                                {quote && fullDateTimeFormat(quote.when)}
                                                <span className="ml-2 mr-n2">{entry.instrument?.exchange.code}</span>
                                            </div>
                                        </td>
                                        <td className={classNames("pr-0 py-1 ", getColor(quote?.percentChange || 0))}>
                                            <div className={classNames("text-right")}>
                                                {numberFormatWithSign(quote?.change)}
                                            </div>
                                            <div className={classNames("text-right")}>
                                                <span className={classNames("font-weight-light ml-2", getColor(quote?.percentChange || 0))}> {quote && numberFormatWithSign(quote.percentChange, "%")}</span>
                                            </div>
                                        </td>
                                        <td className="py-1 pr-0">
                                            <div className="text-right">
                                                {shortNumberFormat(entry.snapQuote?.cumulativeTurnover)}
                                            </div>
                                            <div className="text-right text-nowrap">
                                                {shortNumberFormat(quote?.size)}
                                            </div>
                                        </td>
                                        <td className="py-1 pr-0">
                                            <div className="text-right">
                                                {formatPrice(BID?.value, entry.instrument?.group?.assetGroup)}
                                            </div>
                                            <div className="text-right">
                                                {formatPrice(ASK?.value, entry.instrument?.group?.assetGroup)}
                                            </div>
                                        </td>
                                        <td className="py-1 pl-0">
                                            <div className="text-right text-nowrap">
                                                {shortNumberFormat(BID?.size)}
                                            </div>
                                            <div className="text-right text-nowrap">
                                                {shortNumberFormat(ASK?.size)}
                                            </div>
                                        </td>
                                        <td className="pl-0 py-1">
                                            <div className="text-right">
                                                {shortNumberFormat(entry.instrument?.snapQuote?.cumulativeVolume)}
                                            </div>
                                            <div className="text-right">
                                                {numberFormat(vola, "%")}
                                            </div>
                                        </td>
                                        <td className="pl-0 py-1">
                                            <div className={classNames("text-right")}>
                                                {entry.snapQuote?.yesterdayPrice !== 0 ? numberFormat(entry.snapQuote?.yesterdayPrice) : "-"}
                                            </div>
                                            <div className={classNames("text-right")}>
                                                {entry.snapQuote?.firstPrice !== 0 ? numberFormat(entry.snapQuote?.firstPrice) : "-"}
                                            </div>
                                        </td>
                                        <td className="pl-0 py-1">
                                            <div className={classNames("text-right")}>
                                                {entry.snapQuote?.highPrice !== 0 ? numberFormat(entry.snapQuote?.highPrice) : "-"}
                                            </div>
                                            <div className={classNames("text-right")}>
                                                {entry.snapQuote?.lowPrice !== 0 ? numberFormat(entry.snapQuote?.lowPrice) : "-"}
                                            </div>
                                        </td>
                                        <td className="pl-0 ">
                                            <div className="mt-n2 mr-n4">
                                                <InstrumentLimits
                                                    profile={props.profile}
                                                    instrumentGroupId={entry.instrument?.group.id || 0}
                                                    instrumentId={entry.instrument?.id || 0}
                                                    svgColor="dark"
                                                    limits={limits}
                                                    refreshTrigger={props.refetch}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-0">
                                            {entry.instrument?.isin ?
                                                <div className="">
                                                    <NewsModalMeinFinanztreff isins={[entry.instrument.isin]} />
                                                </div>
                                                :
                                                <Button variant="link" className="" disabled>
                                                    <SvgImage icon={"icon_news.svg"} convert={false} width="26" />
                                                </Button>
                                            }
                                        </td>
                                        <td className="pl-0">
                                            {entry &&
                                                <EditWatchlistEntry entry={entry} watchlist={props.watchlist} refreshTrigger={() => props.refreshTrigger()} >
                                                    <div className="three-dots text-nowrap">
                                                        <span className="bg-blue"></span> <span className="bg-blue"></span> <span className="bg-blue"></span>
                                                    </div>
                                                </EditWatchlistEntry>
                                            }
                                        </td>
                                    </tr>
                                    {entry.memo && entry.memo !== "" && props.showMemo &&
                                        <tr>
                                            <td className="text-left pl-4 fs-14px" colSpan={11} style={{ border: "none" }}>
                                                <span className="svg-icon">
                                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_note.svg"} width="28" alt="" className="" />
                                                </span>
                                                <span className="pl-2" ><i>{entry.memo}</i></span>
                                            </td>
                                        </tr>
                                    }
                                </>
                            )
                        })}
                        {props.entriesWithoutInstrument.map((entry, index) => {
                            return (
                                <tr className="bg-gray-light fs-14px" key={index}>
                                    <td className="text-left py-1" colSpan={6}>{entry.name}</td>
                                    <td className="text-right py-1">-</td>
                                    <td className="text-right py-1">-</td>
                                    <td className="text-right py-1">-</td>
                                    <td className="text-right py-1">-</td>
                                    <td className="text-right py-1">-</td>
                                    <td className="text-right py-1">-</td>

                                    <td className="py-1">
                                        <div className="top d-flex justify-content-center">
                                            <span className="svg-icon cursor-pointer" onClick={() => setDeleteModalOpen(true)}>
                                                <img src="/static/img/svg/icon_close_dark_pink.svg" width="12" className="" alt="" />
                                            </span>
                                            {deleteModalOpen &&
                                                <DeleteWatchlistEntry watchlistName={props.watchlist.name || ""} handleClose={handleClose} isOpen={deleteModalOpen} entry={entry} watchlistId={props.watchlist.id} />
                                            }
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="button-row d-flex justify-content-xl-end justify-content-lg-end justify-content-md-end justify-content-sm-start">
                    <WatchlistInstrumentAdd
                        className="p-1"
                        watchlistId={props.watchlist.id}
                        onComplete={() => props.refreshTrigger()}
                    >
                        <span className="svg-icon mr-1">
                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_plus_white.svg"} height="20" alt="" />
                        </span>
                        <span>Wertpapier hinzufügen</span>
                    </WatchlistInstrumentAdd>
                    <span className="ml-1"><CSVExportButton watchlist={watchlist} watchlistName={props.watchlist.name || ""} entriesWithoutInstrument={props.entriesWithoutInstrument || []} /></span>
                </div>
            </div>
        </div>
    );
}

export interface WatchlistEntriesViewProps {
    profile: UserProfile;
    watchlist: Watchlist;
    entries: WatchlistEntry[];
    entriesWithoutInstrument: WatchlistEntry[];
    refreshTrigger: () => void;
    refetch: () => void;
    limits: LimitEntry[];
    showMemo: boolean;
    sort: SortOption
}

interface SortOption {
    sortType: string;
    direction: boolean;
}

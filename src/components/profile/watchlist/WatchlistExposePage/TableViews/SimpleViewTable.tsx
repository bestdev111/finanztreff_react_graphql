import { useState } from "react";
import { calculateChange, calculateWatchlistEntry, calculateWatchlistEntryDelay, getAssetGroup, orderWatchlistEntriesInListView } from "../../../utils";
import {formatPrice, numberFormat, numberFormatWithSign, quoteFormat, shortNumberFormat} from "../../../../../utils";
import { Mutation, QuoteType, WatchlistEntry } from "../../../../../generated/graphql";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { InstrumentLimits } from "components/profile/common/InstrumentLimits/InstrumentLimits";
import { Button } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";
import { WatchlistEntriesViewProps } from "../../WatchlistViewsComponent";
import { WatchlistInstrumentAdd } from "components/common/profile/WatchlistInstrumentAdd";
import { EditWatchlistEntry, DeleteWatchlistEntry } from "components/profile/modals";
import SvgImage from "../../../../common/image/SvgImage";
import classNames from "classnames";
import moment from "moment";
import { CSVExportButton } from "../WatchlistContentCards/CSVExportButton";
import { NewsModalMeinFinanztreff } from "components/profile/modals/NewsModal/NewsModalMeinFinanztreff";
import { useMutation } from "@apollo/client";
import { loader } from "graphql.macro";

export function SimpleViewTable(props: WatchlistEntriesViewProps) {

    let watchlist: WatchlistEntry[] = orderWatchlistEntriesInListView(props.entries, props.sort.sortType, props.sort.direction);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const handleClose = () => {
        setDeleteModalOpen(false);
    }

    const [wknCopied, setWknCopied] = useState<boolean>(false);

    return (
        <div className="tab-pane fade view-type-liste show active overflow-auto">
            <div className="content-wrapper overflow-auto">
                <table className="table light-table text-center custom-border last-with-border-3">
                    <thead className="thead-light">
                        <tr className="table-with-sort">
                            <th className="text-left" >
                                <div className="" onClick={() => props.handleSort("TableBezeichnung")} >Bezeichnung
                                    {props.sort.sortType === "TableBezeichnung" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                                <th className="py-0 pl-0 font-weight-light text-blue" onClick={() => props.handleSort("TableGattung")} style={{ minWidth: "115px" }}>
                                    Gattung
                                    {props.sort.sortType === "TableGattung" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction ? { transform: "rotate(180deg)" } : {}} />}
                                </th>
                                <th className="py-0 font-weight-light">WKN</th>
                            </th>
                            <th className="text-center pr-0 py-4" style={{ width: "10%" }} onClick={() => props.handleSort("TableBranche")}>
                                Branche
                                {props.sort.sortType === "TableBranche" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" alt="" width={20} className="svg-convert img-dropdown" style={!props.sort.direction ? { transform: "rotate(180deg)" } : {}} />}
                            </th>
                            <th className="text-right pr-0 py-4" colSpan={3}  onClick={() => props.handleSort("TableKurs")}>
                                Kurs
                                {props.sort.sortType === "TableKurs" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" alt="" width={20} className="svg-convert img-dropdown" style={!props.sort.direction ? { transform: "rotate(180deg)" } : {}} />}
                            </th>
                            <th className="text-right pr-0 py-4"  onClick={() => props.handleSort("TableZeit")}>
                                Zeit
                                {props.sort.sortType === "TableZeit" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" alt="" width={20} className="svg-convert img-dropdown" style={!props.sort.direction ? { transform: "rotate(180deg)" } : {}} />}
                            </th>
                            <th className="text-right pr-0 py-4" onClick={() => props.handleSort("Table%")}>
                                %
                                {props.sort.sortType === "Table" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" alt="" width={20} className="svg-convert img-dropdown" style={!props.sort.direction ? { transform: "rotate(180deg)" } : {}} />}
                            </th>
                            <th className="text-right pr-0 py-4" onClick={() => props.handleSort("Table+/-")}>
                                +/-
                                {props.sort.sortType === "Table+/-" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" alt="" width={20} className="svg-convert img-dropdown" style={!props.sort.direction ? { transform: "rotate(180deg)" } : {}} />}
                            </th>
                            <th className="text-right pr-0 py-4" onClick={() => props.handleSort("TableBörse")}>
                                Börse
                                {props.sort.sortType === "TableBörse" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" alt="" width={20} className="svg-convert img-dropdown" style={!props.sort.direction ? { transform: "rotate(180deg)" } : {}} />}
                            </th>
                            <th className="text-right pr-0 py-4" onClick={() => props.handleSort("TableUmsatz")}>
                                Umsatz
                                {props.sort.sortType === "TableUmsatz" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" alt="" width={20} className="svg-convert img-dropdown" style={!props.sort.direction ? { transform: "rotate(180deg)" } : {}} />}
                            </th>
                            <th className="text-right pr-0 py-4" onClick={() => props.handleSort("TableTrades")}>
                                Trades
                                {props.sort.sortType === "TableTrades" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" alt="" width={20} className="svg-convert img-dropdown" style={!props.sort.direction ? { transform: "rotate(180deg)" } : {}} />}
                            </th>
                            <th className="text-right pr-0 py-4" onClick={() => props.handleSort("TableGUmzatz")}>
                                GUmsatz
                                {props.sort.sortType === "TableGUmzatz" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" alt="" width={20} className="svg-convert img-dropdown" style={!props.sort.direction ? { transform: "rotate(180deg)" } : {}} />}
                            </th>
                            <th colSpan={2}>&nbsp;</th>
                            <th colSpan={2}>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {watchlist.map(entry => {
                            const quote = (entry.snapQuote &&
                                (entry.snapQuote.quotes.find(current => current?.type === QuoteType.Trade)
                                    || entry.snapQuote.quotes.find(current => current?.type === QuoteType.NetAssetValue))) || undefined;

                            const tradeChange: number = quote?.percentChange || 0;
                            const tradeChangeColor = (tradeChange > 0) ? "text-green" : (tradeChange < 0) ? "text-red" : "";
                            const when = Date.parse(quote?.when);
                            let delay = calculateWatchlistEntryDelay(entry);
                            const sector = entry.instrument?.group.sector?.name ? entry.instrument?.group.sector?.name?.length! > 11 ? entry.instrument?.group.sector?.name?.substr(0, 9) + "..." : entry.instrument?.group.sector?.name : "-";
                            const assetType: string = getAssetGroup(entry?.instrument?.group.assetGroup);
                            let limits = props.limits.filter(limit => entry.instrument && limit.instrumentId === entry.instrument.id);
                            const oldAssetNoTradding = moment().subtract(10, "d").isAfter(moment(quote && quote.when)) || !quote;
                            return (
                                <>
                                    <tr key={entry.id} className={classNames("fs-14px", oldAssetNoTradding && "bg-gray-neutral")}>
                                        <td className="text-left text-nowrap py-1">
                                            {oldAssetNoTradding && <img className="align-middle" style={{ marginTop: "-2px" }}
                                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_alert_red.svg"}
                                                width="20"
                                                alt="search news icon" />
                                            }
                                            <AssetLinkComponent instrument={entry.instrument} className="font-weight-bold" size={30} />
                                            <th className="p-0 border-0" style={{ minWidth: "120px" }}>
                                                <span className={"asset-type-text-color " + entry.instrument?.group.assetGroup}>{assetType.toUpperCase()}</span>
                                            </th>
                                            <th className="p-0 pl-2 font-weight-light border-0" style={{ minWidth: "60px" }}>
                                                <span>{entry.instrument?.wkn}</span>
                                            </th>
                                            {entry.instrument && entry.instrument.wkn &&
                                                <th className="py-0 pl-0 font-weight-light border-0 text-right ">
                                                    <CopyToClipboard text={entry.instrument?.wkn} onCopy={() => {
                                                        setWknCopied(true);
                                                    }}>
                                                        <Button variant="link" className="p-0 mt-n1 ml-2" title={wknCopied ? "Copied" : "Copy"} >
                                                              <SvgImage icon= "icon_copy_dark.svg" convert={false} spanClass="copy-icon" width={'28'} />
                                                        </Button>
                                                    </CopyToClipboard>
                                                </th>
                                            }
                                        </td>
                                        <td className="text-center py-3 px-0">{sector}</td>
                                        <td className="text-right font-weight-bold pr-0">
                                            {quote?.delay === 1 &&
                                                <span className="timing-info-box bg-orange">RT</span>
                                            }
                                            {quote?.delay !== 1 &&
                                                <span className="timing-info-box bg-gray-dark">{delay}</span>
                                            }
                                        </td>
                                        <td className="text-right font-weight-bold pr-0 pl-0">
                                            <span>{quote && quote.value && formatPrice(quote.value)}</span>
                                        </td>
                                        <td className="text-left font-weight-bold px-0">
                                            <span className="svg-icon move-arrow">
                                                {quote && quote.percentChange ?
                                                    <>
                                                        {quote.percentChange > 0 ?
                                                            <img src="/static/img/svg/icon_arrow_short_up_green.svg" alt="" />
                                                            :
                                                            quote.percentChange < 0 ?
                                                                <img src="/static/img/svg/icon_arrow_short_down_red.svg" alt="" />
                                                                :
                                                                <img src="/static/img/svg/icon_arrow_short_right_grey.svg" alt="" width={28} />
                                                        }
                                                    </>
                                                    : "-"
                                                }
                                            </span>
                                        </td>
                                        <td className="text-right pr-0">{when ? quoteFormat(when) : ""}</td>
                                        <td className={"text-right font-weight-bold pr-0 " + tradeChangeColor}>{numberFormatWithSign(tradeChange)}%</td>
                                        <td className={"text-right font-weight-bold pr-0 " + tradeChangeColor}>{numberFormatWithSign(quote?.change!)}</td>
                                        <td className="text-right pr-0">{entry.instrument?.exchange.name}</td>
                                        <td className="text-right pr-0">{shortNumberFormat(entry.snapQuote?.cumulativeVolume)}</td>
                                        <td className="text-right pr-0">{shortNumberFormat(entry.snapQuote?.cumulativeTrades)}</td>
                                        <td className="text-right pr-0">{shortNumberFormat(entry.snapQuote?.cumulativeTurnover)}</td>
                                        <td className="px-0">
                                            <div className="mt-n2 mr-n2">
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
                                        <td className="pl-0 pr-2">
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
                                    <td className="text-left" colSpan={6}>{entry.name}</td>
                                    <td className="text-right">-</td>
                                    <td className="text-right">-</td>
                                    <td className="text-right">-</td>
                                    <td className="text-right">-</td>
                                    <td className="text-right">-</td>
                                    <td className="text-right">-</td>
                                    <td className="text-right">-</td>
                                    <td className="text-right">-</td>

                                    <td>
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

                <div className="button-row d-flex justify-content-end">
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

interface SimpleViewTableState {
    order: string
    direction: boolean
}

interface SortOption {
    sortType: string;
    direction: boolean;
}

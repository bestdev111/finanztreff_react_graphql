
import { WatchlistInstrumentAdd } from "components/common/profile/WatchlistInstrumentAdd";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { InstrumentLimits } from "components/profile/common/InstrumentLimits/InstrumentLimits";
import { EditWatchlistEntry, DeleteWatchlistEntry } from "components/profile/modals";
import { orderWatchlistEntriesInListView, calculateWatchlistEntry, calculateWatchlistEntryDelay, getAssetGroup } from "components/profile/utils";
import { Mutation, QuoteType, WatchlistEntry } from "graphql/types";
import { useState } from "react";
import { Button } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";
import {formatPrice, numberFormat} from "utils";
import { WatchlistEntriesViewProps } from "../../WatchlistViewsComponent";
import { ViewTablePerformanceRow } from "./ViewTablePerformanceRow";
import SvgImage from "../../../../common/image/SvgImage";
import moment from "moment";
import classNames from "classnames";
import { CSVExportButton } from "../WatchlistContentCards/CSVExportButton";
import { NewsModalMeinFinanztreff } from "components/profile/modals/NewsModal/NewsModalMeinFinanztreff";
import { useMutation } from "@apollo/client";
import { loader } from "graphql.macro";

export function PerformanceViewTable(props: WatchlistEntriesViewProps) {
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
                                <div className="" onClick={() => props.handleSort("TableBezeichnung")}  >Bezeichnung
                                    {props.sort.sortType === "TableBezeichnung" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </div>
                                <th className="py-0 pl-0 font-weight-light text-blue" onClick={() => props.handleSort("TableGattung")}  style={{ minWidth: "115px" }}>
                                    Gattung
                                    {props.sort.sortType === "TableGattung" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                                </th>
                                <th className="py-0 font-weight-light">WKN</th>
                            </th>
                            <th className="text-right py-4" onClick={() => props.handleSort("TableBranche")} >
                                Branche
                                {props.sort.sortType === "TableBranche" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" alt="" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                            </th>
                            <th className="text-right py-4" colSpan={3} onClick={() => props.handleSort("TableKurs")} >
                                Kurs
                                {props.sort.sortType === "TableKurs" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" alt="" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                            </th>

                            <th className="text-right pl-0 py-4" onClick={() => props.handleSort("TableHeute")}>Heute
                                {props.sort.sortType === "TableHeute" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                            </th>
                            <th className="text-right pl-0 py-4 text-nowrap"  onClick={() => props.handleSort("Table1 Woche")}>1 Woche
                                {props.sort.sortType === "Table1 Woche" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                            </th>
                            <th className="text-right pl-0 py-4 text-nowrap"  onClick={() => props.handleSort("Table1 Monat")}>1 Monat
                                {props.sort.sortType === "Table1 Monat" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                            </th>
                            <th className="text-right pl-0 py-4 text-nowrap"  onClick={() => props.handleSort("Table6 Monate")}>6 Monate
                                {props.sort.sortType === "Table6 Monate" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                            </th>
                            <th className="text-right pl-0 py-4 text-nowrap" onClick={() => props.handleSort("Table1 Jahr")}>1 Jahr
                                {props.sort.sortType === "Table1 Jahr" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                            </th>
                            <th className="text-right pl-0 py-4 text-nowrap" onClick={() => props.handleSort("Table3 Jahre")}>3 Jahre
                                {props.sort.sortType === "Table3 Jahre" && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction  ? { transform: "rotate(180deg)" } : {}} />}
                            </th>
                            <th >&nbsp;</th>
                            <th >&nbsp;</th>
                            <th >&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {watchlist.map(entry => {
                            // const name = entry.instrument?.name?.length! > 23 ? entry.instrument?.name?.substr(0, 21) + "..." : entry.instrument?.name;
                            let delay = calculateWatchlistEntryDelay(entry);
                            const sector = entry.instrument?.group.sector?.name ? entry.instrument?.group.sector?.name?.length! > 11 ? entry.instrument?.group.sector?.name?.substr(0, 9) + "..." : entry.instrument?.group.sector?.name : "-";
                            const assetType: string = getAssetGroup(entry?.instrument?.group.assetGroup!);
                            let limits = props.limits.filter(limit => entry.instrument && limit.instrumentId === entry.instrument.id);
                            const quote = entry && entry.snapQuote && entry.snapQuote.quotes.find(current => current && (current.type === QuoteType.Trade || current.type === QuoteType.NetAssetValue));
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
                                        <td className="text-center">{sector}</td>
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
                                        <td className="text-left font-weight-bold pl-0">
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
                                        <ViewTablePerformanceRow entry={entry} intradayChange={quote && quote.percentChange || 0} />
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
                                                <EditWatchlistEntry watchlist={props.watchlist} entry={entry} refreshTrigger={() => props.refreshTrigger()}>
                                                    <div className="three-dots  text-nowrap">
                                                        <span className="bg-blue"></span> <span className="bg-blue"></span> <span className="bg-blue"></span>
                                                    </div>
                                                </EditWatchlistEntry>
                                            }
                                        </td>
                                    </tr>

                                    {entry.memo && entry.memo !== "" && props.showMemo &&
                                        <tr>
                                            <td className="text-left pl-4" colSpan={11} style={{ border: "none" }}>
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
                                    <td></td>
                                    <td>
                                        <div className="top d-flex justify-content-center">
                                            <span className="svg-icon cursor-pointer" onClick={() => setDeleteModalOpen(true)}>
                                                <img src="/static/img/svg/icon_close_dark_pink.svg" width="12" className="" alt="" />
                                            </span>
                                        </div>
                                        {deleteModalOpen &&
                                            <DeleteWatchlistEntry watchlistName={props.watchlist.name || ""} handleClose={handleClose} isOpen={deleteModalOpen} entry={entry} watchlistId={props.watchlist.id} />
                                        }
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
                    <span className="ml-1"><CSVExportButton watchlist={watchlist} watchlistName={props.watchlist.name || ""} entriesWithoutInstrument={props.entriesWithoutInstrument || []}/></span>
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
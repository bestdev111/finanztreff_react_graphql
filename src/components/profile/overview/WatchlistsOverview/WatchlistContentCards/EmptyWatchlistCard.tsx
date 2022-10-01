import SvgImage from "components/common/image/SvgImage";
import { WatchlistInstrumentAdd } from "components/common/profile/WatchlistInstrumentAdd";
import { WatchlistSettings } from "components/profile/modals/PortfolioWatchlistSettings/WatchlistSettings";
import { Watchlist } from "graphql/types";
import { useState } from "react";
import { Button, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export function EmptyWatchlistCard({ index, refreshTrigger, watchlist, showMemo }: WatchlistCardProps) {
    const [state, setState] = useState<{ globalShowMemo: boolean, localShowMemo: boolean }>({ globalShowMemo: showMemo, localShowMemo: false });
    if (state.globalShowMemo !== showMemo) {
        setState({ globalShowMemo: showMemo, localShowMemo: showMemo });
    }

    const notificationShow = watchlist.eom || watchlist.wd1 || watchlist.wd2 || watchlist.wd3 || watchlist.wd4
        || watchlist.wd5 || watchlist.wd6 || watchlist.wd7;

    return (
        <Col key={index} className="px-xl-2 px-lg-2 px-0">
            <div className="content-wrapper p-0 d-flex flex-row justify-content-between watchlist-card-height">
                <div className="watchlist-card-width py-2 d-flex flex-column justify-content-between">
                    <div className="mx-2 text-container-max-width font-weight-bold fs-18px">
                        {notificationShow &&
                            < img src={process.env.PUBLIC_URL + "/static/img/svg/icon_envelope_filled_dark.svg"} width="20" alt="" className="pb-1" />
                        }
                        <Link to={`/mein-finanztreff/watchlist/${watchlist.id}`}>{watchlist.name}</Link>
                    </div>
                    <div className="mx-2">
                        <div>Sie haben noch keine Werte in Ihrer Watchlist.</div>
                        <div>
                            <WatchlistInstrumentAdd
                                className="p-1"
                                watchlistId={watchlist.id} onComplete={refreshTrigger}>
                                <span className="svg-icon mr-1">
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_plus_white.svg"} height="20" alt="" />
                                </span>
                                <span className="mb-n1">Wertpapier hinzufügen</span>
                            </WatchlistInstrumentAdd>
                        </div>
                    </div>
                    {state.localShowMemo && watchlist.memo && watchlist.memo !== "" &&
                        <div className="py-1 d-flex pl-2">
                            <span className="svg-icon">
                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_note.svg"} width="28" alt="" className="" />
                            </span>
                            <span className="pl-2" ><i>{watchlist.memo}</i></span>
                        </div>
                    }
                </div>
                <div className="action-wrapper d-flex flex-column justify-content-between">
                    <WatchlistSettings watchlist={watchlist} onComplete={refreshTrigger} className="top d-flex justify-content-center d-none">
                        <span className="mt-2 ml-n2">
                            <SvgImage icon={"icon_menu_vertical_blue.svg"}spanClass="cursor-pointer" convert={false} width="27" />
                        </span>
                    </WatchlistSettings>
                    <div className="bottom">
                        <Button variant="link" className="px-2 mt-n2" disabled={watchlist.memo === "" || !watchlist.memo} onClick={() => setState({ ...state, localShowMemo: !state.localShowMemo })}>
                            <SvgImage icon={"icon_note.svg"} convert={false} width="28" />
                        </Button>
                        <Button variant="inline" disabled={true}>
                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_news.svg"} className="ml-n2" alt="" width={27} />
                        </Button>
                    </div>
                </div>
            </div>
        </Col>

    )
}

interface WatchlistCardProps {
    index: number,
    watchlist: Watchlist,
    showMemo: boolean,
    refreshTrigger: () => void,
}
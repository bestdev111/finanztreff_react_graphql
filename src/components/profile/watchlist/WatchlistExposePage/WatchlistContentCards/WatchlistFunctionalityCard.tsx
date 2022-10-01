import { WatchlistInstrumentAdd } from "components/common/profile/WatchlistInstrumentAdd";
import { Watchlist } from "graphql/types";
import { Col } from "react-bootstrap";
import { CSVExportButton } from "./CSVExportButton";

export function WatchlistFunctionalityCard(props: WatchlistFunctionalityCardProps) {
    return (
        <Col key={-1} className="px-xl-2 px-lg-2 px-0 mb-2">
            <div className="content-wrapper d-flex flex-column justify-content-center text-center watchlist-entry-card-height">
                <div>
                    <WatchlistInstrumentAdd
                        className="p-1"
                        watchlistId={props.watchlist.id} onComplete={props.refreshTrigger}>
                        <span className="svg-icon mr-1">
                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_plus_white.svg"} height="20" alt="" />
                        </span>
                        <span>Wertpapier hinzufügen</span>
                    </WatchlistInstrumentAdd>
                </div>
                <div className="mt-2">
                    <CSVExportButton watchlist={props.watchlist.entries || []} watchlistName={props.watchlist.name || ""} 
                       entriesWithoutInstrument={props.watchlist.entries?.filter(current => !current.instrument) || []}
                        />
                </div>
            </div>
        </Col>
    )
}

interface WatchlistFunctionalityCardProps {
    refreshTrigger: () => void;
    watchlist: Watchlist;
}
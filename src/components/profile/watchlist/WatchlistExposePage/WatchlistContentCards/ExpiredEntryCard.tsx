import { DeleteWatchlistEntry } from "components/profile/modals";
import { WatchlistEntry, Watchlist } from "graphql/types";
import { useState } from "react";
import { Col, Button } from "react-bootstrap";

export function ExpiredEntryCard({ index, entry, refreshTrigger, watchlist }: ExpiredEntryCardProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const handleClose = () => setDeleteModalOpen(false)
    return (
        <Col key={index} className="px-xl-2 px-lg-2 px-0">
            <div className="content-wrapper p-0 d-flex flex-row justify-content-between bg-lighten-gray" style={{ height: "252px", background: "rgba(0, 0, 0, 0.03)" }}>
                <div className="watchlist-card-width p-2">
                    <div className="font-weight-bold text-truncate fs-15px">{entry.name}</div>
                </div>
                <div className="action-wrapper d-flex flex-column justify-content-between">
                    <Button variant="link" className="mt-2 ml-n1" onClick={() => setDeleteModalOpen(true)}>
                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark_pink.svg"} width="17" alt="" />
                    </Button>
                </div>
            </div>
            {deleteModalOpen &&
                <DeleteWatchlistEntry watchlistName={watchlist.name || ""} handleClose={handleClose} isOpen={deleteModalOpen} entry={entry} watchlistId={watchlist.id} />
            }
        </Col >
    )
}

interface ExpiredEntryCardProps {
    index: number,
    entry: WatchlistEntry,
    refreshTrigger: () => void;
    watchlist: Watchlist;
}
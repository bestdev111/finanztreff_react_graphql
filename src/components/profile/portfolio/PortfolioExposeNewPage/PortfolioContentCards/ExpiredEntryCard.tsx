import { RemovePositionModal } from "components/profile/modals/MainSettingsModals/RemovePositionModal";
import { PortfolioEntry, Portfolio } from "graphql/types";
import { Col, Button } from "react-bootstrap";
import { REALDATE_FORMAT, numberFormat } from "utils";

export function ExpiredEntryCard({ index, entry, refreshTrigger, portfolio }: ExpiredEntryCardProps) {
    return (
        <Col key={index} className="px-xl-2 px-lg-2 px-0">
            <div className="content-wrapper p-0 d-flex flex-row justify-content-between bg-lighten-gray" style={{ height: "252px", background: "rgba(0, 0, 0, 0.03)" }}>
                <div className="portfolio-card-width p-2">
                    <div className="font-weight-bold text-truncate fs-15px">{entry.name}</div>
                    <div className="info-rows">
                        <p className="m-0">
                            Kauf: <b> {REALDATE_FORMAT(entry.entryTime)}</b>, <b> {entry.quantity}</b> Stück zu <b>{numberFormat(entry.price)}</b>
                        </p>

                    </div>
                </div>

                <div className="action-wrapper d-flex flex-column justify-content-between">
                    <RemovePositionModal portfolio={portfolio} entry={entry} refreshTrigger={refreshTrigger} >
                        <Button variant="link" className="mt-2 ml-n1">
                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark_pink.svg"} width="17" alt="" />
                        </Button>
                    </RemovePositionModal>
                </div>
            </div>
        </Col >
    )
}

interface ExpiredEntryCardProps {
    index: number,
    entry: PortfolioEntry,
    refreshTrigger: () => void;
    portfolio: Portfolio;
}
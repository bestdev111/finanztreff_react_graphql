import { useQuery } from "@apollo/client";
import { PurchaseAssetModal } from "components/profile/modals/MainSettingsModals/PurchaseAssetModal";
import { loader } from "graphql.macro";
import { Query } from "graphql/types";
import { Spinner } from "react-bootstrap";

interface PurchaseSalesButtonsProps {
    instrumentId: number;
    portfolioId: number;
}

export function PurchaseButton(props: PurchaseSalesButtonsProps) {
    const { data, loading } = useQuery<Query>(loader('./getProfilePortfolio.graphql'));

    if (loading) {
        return (<div className="text-center py-2" style={{ height: "10px" }}><Spinner animation="border" /></div>);
    }

    const portfolio = data && data.user && data?.user.profile && data?.user?.profile?.portfolios && data?.user?.profile?.portfolios.find(current => current.id === props.portfolioId);
    const entry = portfolio && portfolio.entries && portfolio.entries.find(current => current.instrumentId === props.instrumentId);

    if (entry && portfolio)
        return (
            <PurchaseAssetModal entry={entry} portfolio={portfolio} >
                <span className="collapse-inner--button text-white bg-green align-center cursor-pointer">
                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_plus_borderless_white.svg"} height="36" alt="" className="collapse-inner--icon" />
                </span>
            </PurchaseAssetModal>
        )
    return (<></>)
}
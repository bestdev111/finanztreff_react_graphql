import { useQuery } from "@apollo/client";
import { SaleAssetModal } from "components/profile/modals/MainSettingsModals/SaleAssetModal";
import { loader } from "graphql.macro";
import { Query } from "graphql/types";
import { Spinner } from "react-bootstrap";

export function SalesButton(props: PurchaseSalesButtonsProps) {
    const { data, loading } = useQuery<Query>(loader('./getProfilePortfolio.graphql'));

    if (loading) {
        return (<div className="text-center py-2" style={{ height: "10px" }}><Spinner animation="border" /></div>);
    }
    const portfolio = data && data.user && data?.user.profile && data?.user?.profile?.portfolios && data?.user?.profile?.portfolios.find(current => current.id === props.portfolioId);
    const entry = portfolio && portfolio.entries && portfolio.entries.find(current => current.instrumentId === props.instrumentId);

    if (entry && portfolio) {
        return (
            <SaleAssetModal entry={entry} portfolio={portfolio} >
                <span className="collapse-inner--button text-white bg-pink align-center cursor-pointer">
                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_minus_white.svg"} width="12" alt="" className="collapse-inner--icon minus" />
                </span>
            </SaleAssetModal>
        )
    }
    return (<></>)
}

interface PurchaseSalesButtonsProps {
    instrumentId: number;
    portfolioId: number;
}
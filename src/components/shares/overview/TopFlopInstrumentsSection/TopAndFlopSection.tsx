import { useQuery } from "@apollo/client";
import { TopFlopSection } from "components/Home";
import { loader } from "graphql.macro";
import { Query } from "graphql/types";
import { Spinner } from "react-bootstrap";
import { BestAndWorseCarouselComponent } from "../BestAndWorst/BestAndWorseCarouselComponent";
import ShareScreenerRating from "../ShareScreenerRaiting/ShareScreenerRating";
import StockAnalysesComponent from "../StockAnalysesComponent";

export function TopAndFlopSection() {

    let { data, loading } = useQuery<Query>(
        loader('./getTopFlopTab.graphql')
    );

    if (loading) {
        return (<div className="text-center py-2"><Spinner animation="border" /></div>)
    }

    if (data && data.list && data.list.content) {
        return (
            <>
                <StockAnalysesComponent instruments={data.list.content} />
                <ShareScreenerRating />
                <TopFlopSection showOtherTopsAndFlops={true}/>
                <BestAndWorseCarouselComponent instruments={data.list.content} />
            </>
        )
    }
    return (<></>);
}
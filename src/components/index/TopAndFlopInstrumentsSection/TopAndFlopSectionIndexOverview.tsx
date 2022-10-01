import { useQuery } from "@apollo/client";
import { TopFlopSection } from "components/Home";
import { BestAndWorseCarouselComponent } from "components/shares/overview/BestAndWorst/BestAndWorseCarouselComponent";
import StockAnalysesComponent from "components/shares/overview/StockAnalysesComponent";
import { loader } from "graphql.macro";
import { Query } from "graphql/types";
import { Spinner } from "react-bootstrap";

export function TopAndFlopSectionIndexOverview() {
    let { data, loading } = useQuery<Query>(loader('./getTopFlopTab.graphql'));

    if (loading) {
        return (<div className="text-center py-2"><Spinner animation="border" /></div>)
    }

    if (data && data.list && data.list.content && data.list.content.length > 0) {

        return (<>
            <TopFlopSection showOtherTopsAndFlops={true}/>
            <BestAndWorseCarouselComponent instruments={data.list.content} />
            <StockAnalysesComponent instruments={data.list.content} />
        </>
        );
    }

    return (<></>)
}
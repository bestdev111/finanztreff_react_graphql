import {useQuery} from "@apollo/client";
import {Query} from "../../../generated/graphql";
import {loader} from "graphql.macro";
import {Spinner} from "react-bootstrap";
import {formatDate, formatPrice} from "../../../utils";


interface AnalysisDetailModalHistoryComponentProps {
    id: string;
    isin: string;
    institute: string;
}

export function AnalysisDetailModalHistoryComponent(props: AnalysisDetailModalHistoryComponentProps) {
    let {data, loading} = useQuery<Query>(
        loader('./getAnalysisHistory.graphql'),
        {variables: {isin: props.isin, institute: props.institute, first: 20}}
    );
    if (loading) {
        return <Spinner animation={'border'}/>
    }

    if (!data?.analysisSearch?.edges?.length || data?.analysisSearch?.edges?.length < 2) {
        // Current analysis is included into the list
        return <></>;
    }

    return (
        <div className={"d-flex justify-content-start jus w-100 shadow-sm py-2 font-size-13px"}>
            <div className={"icon px-2 h-100 align-self-center"}>
                <img className=" align-middle"
                     src={process.env.PUBLIC_URL + "/static/img/svg/icon_alert_red.svg"}
                     width="32"
                     alt="search news icon"/>
            </div>
            <div className={"content"}>
                <table>
                    <tbody>
                    {
                        data?.analysisSearch?.edges?.map(current => current.node)
                            .filter(current => !!current.updated)
                            .map(current =>
                                <tr key={current.date}>
                                    <td className={"font-weight-bold text-nowrap align-top"}>Update {formatDate(current.date)}:</td>
                                    <td>
                                        
                                        {current.targetPrice==current.targetPricePrevious && current.targetPricePrevious==current.targetPrice ?
                                            "Urteil unverändert, Kursziel unverändert."
                                        
                                        : (!!current.targetPrice && current.targetPricePrevious
                                            && current.targetPrice > 0 && current.targetPricePrevious > 0) ?
                                            current.recommendationPrevious ? 
                                            <>Urteil wurde von {current.recommendationPrevious} auf {current.recommendation} geändert.
                                            Kursziel wurde von {formatPrice(current.targetPricePrevious)} auf {formatPrice(current.targetPrice)} geändert.</>
                                            :
                                            <>Kursziel wurde von {formatPrice(current.targetPricePrevious)} auf {formatPrice(current.targetPrice)} geändert.</>
                                            :
                                            <></>
                                        }
                                    </td>
                                </tr>
                            )
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

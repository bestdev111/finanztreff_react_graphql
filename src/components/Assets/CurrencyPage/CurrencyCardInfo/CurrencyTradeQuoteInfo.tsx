import { useQuery } from "@apollo/client";
import { InstrumentPerformance, Query, SnapQuote } from "generated/graphql";
import { loader } from "graphql.macro";
import { Spinner } from "react-bootstrap";
import {formatPrice, formatPriceWithSign, numberFormatDecimals} from "utils";

interface CurrencyTradeQuoteInfoProps {
    className?: string;
    id: number;
    chartScope?: string;
}

export function CurrencyTradeQuoteInfo(props: CurrencyTradeQuoteInfoProps) {
    let { loading, data } = useQuery<Query>(
        loader('./getInstrumentSnapQuote.graphql'),
        { variables: { instrumentId: props.id }},
    )
    var scope = props.chartScope
    
    let { loading: loading1, data: data1 } = useQuery<Query>(
        loader('./getInstrumentPerformance.graphql'),
        { variables: { instrumentId: props.id, period: convertScope(scope)} }
    )
        if (loading) {
            return <div className="instrument-info-loading"><Spinner animation="border" size="sm" /></div>;
        }
        if(loading1){
            return <div className="instrument-info-loading"><Spinner animation="border" size="sm" /></div>
        }
        if(!convertScope(scope)){
        let snapQuote: SnapQuote;
        if (data && data.instrument && data.instrument.snapQuote) {
            snapQuote = data.instrument.snapQuote;
            return (
                <QuoteInfo snapQuote={snapQuote} />
            );
        }
        }else{
        let performance: InstrumentPerformance[];
        if(data1 && data1.instrument){
            performance = data1?.instrument?.performance;
            return (
                <QuoteInfoFilter performance={performance}/>
            )
        }
        }
        return (<></>)
    }

function QuoteInfo(props: { snapQuote?: SnapQuote }) {
    return (
        <div>
            <div className="fs-24px font-weight-bold">
                {numberFormatDecimals(props.snapQuote?.quote?.value, 4)}
                <span className="arrow flex-nowrap svg-icon arrow-movement pl-1">
                    {props?.snapQuote?.quote && props?.snapQuote.quote.percentChange ?
                        (props.snapQuote.quote?.percentChange > 0 ?
                            <img
                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_up_green.svg"}
                                alt="" className="move-arrow-icon pl-1 pb-1" width="24px"  /> :
                            <img
                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_down_red.svg"}
                                alt="" className="move-arrow-icon pl-1 pb-1" width="24px"  />
                        ) :
                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_right_grey.svg"}
                            alt="" className="move-arrow-icon pl-1 pb-1" width="24px" />
                    }
                </span>
            </div>
            <div className="mt-n1 text-truncate">
                <span className={"mr-2 font-weight-bold " + (props?.snapQuote?.quote?.change && props.snapQuote.quote.change > 0 ? 'text-green' : 'text-pink')}>
                            {props?.snapQuote?.quote?.change && props?.snapQuote.quote.change > 0 ? "+" : " "}
                            {formatPrice(props?.snapQuote?.quote?.change)}
                </span>
                <span className={"mr-2 " + (props?.snapQuote?.quote?.percentChange && props?.snapQuote.quote.percentChange > 0 ? 'text-green' : 'text-pink')}>
                            {props?.snapQuote?.quote?.percentChange && props.snapQuote.quote.percentChange > 0 ? "+" : " "}
                            {numberFormatDecimals(props?.snapQuote?.quote?.percentChange || 0,4)}%
                </span>
            </div>
        </div>
    );
}

function QuoteInfoFilter(props: { performance?: InstrumentPerformance[] }) {
    return (
        <div>
            <div className="fs-24px font-weight-bold">
                {props?.performance ? numberFormatDecimals(props.performance[0]?.averagePrice, 4) : "-"}
                <span className="arrow flex-nowrap svg-icon arrow-movement pl-1">
                    {props?.performance && props?.performance[0].performance ?
                        (props?.performance[0].performance > 0 ?
                            <img
                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_up_green.svg"}
                                alt="" className="move-arrow-icon pl-1 pb-1" width="24px"  /> :
                            <img
                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_down_red.svg"}
                                alt="" className="move-arrow-icon pl-1 pb-1" width="24px"  />
                        ) :
                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_right_grey.svg"}
                            alt="" className="move-arrow-icon pl-1 pb-1" width="24px" />
                    }
                </span>
            </div>
            <div className="mt-n1 text-truncate">
                <span className={"mr-2 font-weight-bold " + (props?.performance && props?.performance[0].performance && (props?.performance[0].performance > 0 ? 'text-green' : 'text-pink'))}>
                            {props?.performance && props?.performance[0].performance && (props.performance[0].performance > 0 ? "+" : " ")}
                            {props?.performance ? numberFormatDecimals(props?.performance[0]?.performance || 0,4) : "-"}
                </span>
                <span className={"mr-2 " + (props?.performance && props?.performance[0].performanceAbsolute && (props?.performance[0].performanceAbsolute > 0 ? 'text-green' : 'text-pink'))}>
                            {props?.performance && props.performance[0].performanceAbsolute && (props.performance[0].performanceAbsolute > 0 ? "+" : " ")}
                            {props?.performance ? numberFormatDecimals(props?.performance[0]?.performanceAbsolute || 0,4) : "-"}%
                </span>
            </div>
        </div>
    );
}

function convertScope(value: string | undefined){
    switch(value){
        case "WEEK" : return "WEEK1";
        case "MONTH" : return "MONTH1";
        case "SIX_MONTH" : return "MONTH6"
        case "YEAR" : return "WEEK52"
        case "THREE_YEAR" : return "YEAR3"
    }
}
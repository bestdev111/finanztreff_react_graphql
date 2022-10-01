import {useQuery} from "@apollo/client";
import {GET_STICKY_INSTRUMENTS} from "graphql/query";
import {
    Exchange,
    InstrumentGroup,
    Query,
    QuoteType,
    SnapQuote,
    useUpdateStickyInstrumentSubscription
} from "graphql/types";
import {Link} from "react-router-dom";
import {
    formatPrice,
    getFinanztreffAssetLink,
    numberFormatWithSign,
} from "utils";
import {useMediaQuery} from 'react-responsive';
import classNames from "classnames";
import {PercentChangeVisualizationResult, usePercentChangeVisualization} from "../../../hooks/usePercentChangeVisualization";

export function StickyInstruments() {
    const isDesktop = useMediaQuery({
        query: '(min-width: 1280px)'
    });
    const {loading, data} = useQuery<Query>(GET_STICKY_INSTRUMENTS);
    if (loading) {
        return <div style={{ height: "23px" }}></div>;
    }

    const tabletInstrumentsFilter: number[] = [12557, 27590, 2485106, 2639453] // 'DAX' 'S&P 500' 'EUR/USD' 'GOLD/USD'
    return (
        <div className="stock-latest pr-dn w-100">
            <div className="inner d-flex gap-10px">
                {isDesktop ?
                data?.list?.content && data?.list?.content?.map(current => {
                    if (!current || !current.group) return <></>;
                    return (
                        <StickyInstrumentItem key={current.id} instrumentId={current.id}
                            initial={current.snapQuote || null}
                            exchange={current.exchange}
                            group={current.group}
                        />
                    )
                })
                :
                    data?.list?.content && data?.list?.content?.filter(instrument => tabletInstrumentsFilter.includes(instrument.id)).map(current => {
                    if (!current || !current.group) return <></>;
                    return (
                        <StickyInstrumentItem key={current.id} instrumentId={current.id}
                            initial={current.snapQuote || null}
                            exchange={current.exchange}
                            group={current.group}
                        />
                    )
                })
                }
            </div>
        </div>
    )
}

interface StickyInstrumentItemProps {
    instrumentId: number
    initial: SnapQuote | null
    group: InstrumentGroup
    exchange: Exchange
}

function StickyInstrumentItem(props: StickyInstrumentItemProps) {
    const pushEvent: PercentChangeVisualizationResult =  usePercentChangeVisualization(props.instrumentId)
    const currentSnapQuote = pushEvent?.value || props.initial;
    const currentQuote = (currentSnapQuote?.quotes || []).find(current => current?.type == QuoteType.Trade);

    return (
        <div key={props.instrumentId}
            className={"stock-holder " + (currentQuote?.percentChange && currentQuote?.percentChange > 0 ? "positive-movement" : "negative-movement")}>
            <Link to={getFinanztreffAssetLink("" + props.group?.assetGroup, "" + props.group?.seoTag, props.exchange.code === "CGMD" ? props.exchange.code : "")} className="stock-name">{props.group?.name}</Link>
            <span>
                <span style={{ padding: "1px" }} className={'stock-value'}>
                    {formatPrice(currentQuote?.value, props.group.assetGroup)}</span>
            </span>
            <span className="arrow svg-icon">
                {currentQuote?.percentChange && currentQuote?.percentChange > 0 ?
                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_up_green.svg"} alt=""
                        className="move-arrow-icon" /> :
                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_down_red.svg"} alt=""
                        className="move-arrow-icon" />
                }
            </span>
            <span>
                <span style={{ padding: "1px" }} className={classNames("stock-value-movement ml-0",
                    pushEvent.toggle ? 'asset-value-movement-blinker' : '' )}>
                    {numberFormatWithSign(currentQuote?.percentChange && currentQuote?.percentChange, "%")}
                </span>
            </span>
        </div>
    )
}



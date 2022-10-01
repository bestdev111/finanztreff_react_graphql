import {Chart, Query, QuoteType} from "../../../../generated/graphql";
import {useQuery} from "@apollo/client";
import {loader} from "graphql.macro";
import {Col, Spinner} from "react-bootstrap";
import {
    formatPriceWithSign,
    numberFormatDecimals,
    numberFormatWithSign,
    quoteFormat,
    separateNumber, UpdateStateProps
} from "../../../../utils";
import {SnapQuoteDelayIndicator} from "../../indicators";
import {InstrumentTileChart} from "../../charts/InstrumentTileChart/InstrumentTileChart";
import moment from "moment";
import React, {Component, ReactNode, useEffect, useState} from "react";
import './InstrumentSnapQuoteCard.scss'
import classNames from "classnames";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import {usePercentChangeVisualization} from "../../../../hooks/usePercentChangeVisualization";

interface InstrumentSnapQuoteCardChartProps {
    instrumentId: number;
    height?: number | string;
    width?: number | string;

}
export const InstrumentSnapQuoteCardChart = ({instrumentId, height, width}: InstrumentSnapQuoteCardChartProps) => {
    let {data, loading} = useQuery<Query>(
        loader('./getInstrumentSnapQuoteChart.graphql'),
        {
            variables: {instrumentId: instrumentId},
            skip: !instrumentId
        }
    )
    if (loading) {
        return <Spinner animation="border"/>;
    }
    let chart: Chart | null = null;
    if (data?.instrument?.chart?.series && data?.instrument?.chart?.series.length > 0) {
        chart = data?.instrument?.chart;
    }
    return instrumentId ? (
        <InstrumentTileChart
            points={
                (chart?.series[0].data || []).map(current => ({y: current.value, x: moment(current.when)}))
            }
            threshold={chart?.threshold?.value || undefined}
            height={height || 80}
            width={width || 364}
            enableMouseTracking={false}
        />
    ) : null;
}

interface QuoteRateProps {
    value: number | undefined | null;
    currency?: string;
}

export class QuoteRate extends Component<QuoteRateProps> {
    render() {
        let {integer, fraction} = separateNumber(this.props.value || 0);
        return (
            <div className="rate d-flex justify-content-between">
                <div className="integer p-0">{numberFormatDecimals(integer, 0, 0)}</div>
                <div className="fraction p-0">
                    <div>
                        <Col xs={12} className="fraction pl-0 pr-1">,{fraction}</Col>
                        <Col xs={12} className="currency pl-0 pr-1">{this.props.currency}</Col>
                    </div>
                </div>
            </div>
        );
    }
}

interface InstrumentSnapQuoteCardProps {
    instrumentId: number;
    children?: ReactNode;
    className?: string;
    isHomePage?: boolean
}

export const InstrumentSnapQuoteCard = ({ instrumentId, children, className, isHomePage }: InstrumentSnapQuoteCardProps) => {
    let { data, loading } = useQuery<Query>(
        loader('./getInstrumentSnapQuoteCardInfo.graphql'),
        { variables: { instrumentId: instrumentId } }
    );
    const pushEvent =  usePercentChangeVisualization(instrumentId)

    if (loading) {
        return <Spinner animation="border" />;
    }
    if (!data?.instrument) {
        return <></>;
    }

    let currentSnapQuote = pushEvent?.value || data.instrument.snapQuote;
    let currentQuote = (currentSnapQuote?.quotes || []).find(current => current?.type == QuoteType.Trade);

    const quote = data.instrument && data.instrument.snapQuote && data.instrument.snapQuote.quotes
        && data.instrument.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);

    if (quote) {
        return (
            <div className={classNames("instrument-snap-quote-chart top text-main-text", className)}>
                <div className="top d-flex justify-content-between p-1">
                    <div className="asset-name">
                        <AssetLinkComponent instrument={data?.instrument} />
                    </div>
                    {children && <div>{children}</div>}
                </div>
                <div className="value-info px-1">
                    <div className="d-flex justify-content-between">
                        <div>
                            {
                                currentQuote?.value
                                    && <QuoteRate value={currentQuote.value} currency={data?.instrument?.currency.displayCode || ""} />
                            }
                        </div>
                        <div className="quote-value">
                            {currentQuote?.change != null &&
                                <Col xs={12} className={classNames('change px-0', currentQuote?.change >= 0 ? 'text-color-green' : 'text-color-red')}>
                                    <span className="mr-1">
                                        {formatPriceWithSign(quote.change)}
                                    </span>
                                    {
                                        !!currentQuote.percentChange &&  currentQuote?.percentChange > 0 ?
                                        <span className={classNames("mr-1 text-green", isHomePage && pushEvent.toggle ? 'asset-value-movement-blinker' : '' )}>
                                        {numberFormatWithSign(currentQuote.percentChange, '%')}
                                    </span> :
                                     <span className={classNames("mr-1 text-pink", isHomePage && pushEvent.toggle ? 'asset-value-movement-blinker' : '' )}>
                                        {numberFormatWithSign(currentQuote.percentChange, '%')}
                                    </span>
                                    }

                                    <span className="arrow svg-icon top-move">
                                        {currentQuote.change >= 0 ?
                                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_up_green.svg"}
                                                alt="" className="move-arrow-icon" /> :
                                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_down_red.svg"}
                                                alt="" className="move-arrow-icon" />
                                        }
                                    </span>
                                </Col>
                            }
                            <Col xs={12} className="time px-0">
                                <span className="delay-indicator">
                                    <SnapQuoteDelayIndicator delay={currentQuote?.delay} />
                                </span>
                                <span className="value fnt-size-11 p-1">{quoteFormat(currentQuote?.when, ' Uhr')}</span>
                            </Col>
                        </div>
                    </div>
                </div>
                <div className="chart">
                    <InstrumentSnapQuoteCardChart instrumentId={instrumentId} height={114} width={"100%"} />
                </div>
            </div>
        );
    }

    return (<></>);
}

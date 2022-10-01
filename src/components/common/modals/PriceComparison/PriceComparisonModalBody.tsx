import { Component } from "react";
import classNames from "classnames";
import { Instrument } from "../../../../generated/graphql";
import { mapQuoteHistory, QuoteInformation } from "./utils";
import { JapanesePriceCandle } from "./JapanesePriceCandle";
import { DailyQuoteInformation } from "./DailyQuoteInformation";

export class PriceComparisonModalBody extends Component<PriceComparisonModalBodyProps, any> {
    render() {
        let { currency, quoteHistory } = this.props.instrument;
        let priceInformation: QuoteInformation[] = (quoteHistory.edges || [])
            .map(current => mapQuoteHistory(current.node))
            .sort((a: QuoteInformation, b: QuoteInformation) => a.when.isBefore(b.when) ? 1 : -1);

        priceInformation = priceInformation.slice(0, 7).reverse();
        let min = Math.min(...priceInformation.map(current => current.lowPrice || -1).filter(current => current > 0));
        let max = Math.max(...priceInformation.map(current => current.highPrice || -1).filter(current => current > 0));
                
        return (
            <div className="container">
                <div className="content-row">
                    <div className="content-wrapper wb-m col">
                        <div className="content">
                            {/*<div className="candle-bars-wrapper-mobile">*/}
                            {/*    <div className="middle-line bg-border-gray" style={{top: "100px;"}}></div>*/}
                            {/*</div>*/}
                            <div className="candle-bars-wrapper">
                                <div className="middle-line bg-border-gray">
                                    <div className="row">
                                        {
                                            priceInformation.map((current: QuoteInformation, index: number) =>
                                                <div className={classNames("col", (index < priceInformation.length-2? (index < priceInformation.length-5 ? "d-none d-xl-block" : "d-none d-md-block") : ""))}>
                                                    <JapanesePriceCandle info={current} min={min} max={max} />
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="week-days-wrapper">
                                <div className="row">
                                    {
                                        priceInformation.map((current: QuoteInformation, index: number) =>
                                            <div className={classNames("col", (index < priceInformation.length-2 ? (index < priceInformation.length-5 ? "d-none d-xl-block" : "d-none d-md-block") : ""))}>
                                                <DailyQuoteInformation currencyCode={currency?.displayCode || ""} info={current} assetGroup={this.props.instrument.group?.assetGroup || undefined} />
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

interface PriceComparisonModalBodyProps {
    instrument: Instrument;
}

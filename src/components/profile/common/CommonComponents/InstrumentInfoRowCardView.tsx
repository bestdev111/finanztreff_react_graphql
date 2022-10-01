import classNames from "classnames";
import SvgImage from "components/common/image/SvgImage";
import { getNumberColor } from "components/profile/utils";
import { PortfolioEntry, QuoteType, WatchlistEntry } from "graphql/types";
import { useState } from "react";
import { Button } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";
import {numberFormatWithSign, numberFormat, quoteFormat, formatPrice} from "utils";

export const InstrumentInfoRowCardView = ({ entry, withTradeQuote }: InstrumentInfoRowCardViewProps) => {
    const [wknCopied, setWknCopied] = useState<boolean>(false);;
    const WKN = entry.instrument?.wkn;
    const trade = entry.snapQuote?.quotes.find(current => current?.type === QuoteType.Trade);
    const nav = entry.snapQuote?.quotes.find(current => current?.type === QuoteType.NetAssetValue);
    const quote = trade ? trade : nav ? nav : undefined;

    const currency = entry.instrument?.currency.displayCode || "";
    const exchange = entry.instrument?.exchange;

    return (
        <div>
            <div className="d-flex justify-content-between">
                <div className="text-truncate">
                    {WKN ?
                        <>
                            <span className="fs-13px align-middle">{WKN}</span>
                            <CopyToClipboard text={WKN} onCopy={() => {
                                setWknCopied(false);
                            }}>
                                <Button className="copy-button" title={wknCopied ? "Copied" : "Copy"}>
                                  <SvgImage icon= "icon_copy_dark.svg" convert={false} spanClass="copy-icon" width={'28'} />
                                </Button>
                            </CopyToClipboard>
                        </>
                        : <span>-</span>
                    }
                </div>
                {withTradeQuote ?
                    quote &&
                    <div>
                        {quote.delay === 1 ?
                            <span className="bg-orange text-white px-2 fs-11px align-middle">RT</span> : <span className="bg-gray-dark text-white px-2 fs-11px align-middle">+15</span>
                        }
                        {!!quote.value &&
                            <span className="font-weight-bold fs-15px"> {formatPrice(quote.value, entry?.instrument?.group?.assetGroup,quote.value, currency)}  </span>
                        }
                        {!!quote.percentChange &&
                            <span className={classNames("ml-2 fs-15px", getNumberColor(quote.percentChange))}> {numberFormatWithSign(quote.percentChange, "%")}</span>
                        }
                    </div>
                    : exchange &&
                    <div className="fs-13px text-gray pt-1">
                        {trade ? quoteFormat(trade.when, " Uhr") : nav && quoteFormat(nav.when, " Uhr")}, {exchange.code}
                    </div>
                }
            </div>
        </div>
    );
}

interface InstrumentInfoRowCardViewProps {
    entry: PortfolioEntry | WatchlistEntry
    withTradeQuote?: boolean
}
import { Currency, TheScreenerRatingEarningsRevisionTrend } from "../../../../../generated/graphql";
import { formatDate, numberFormat } from "../../../../../utils";
import SvgImage from "components/common/image/SvgImage";

export interface TheScreenerRatingModalEarningsRevisionTrendProps {
    earningRevisionTrend: TheScreenerRatingEarningsRevisionTrend;
    currency: Currency;
}

export function TheScreenerRatingModalEarningsRevisionTrend(props: TheScreenerRatingModalEarningsRevisionTrendProps) {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title d-flex justify-content-between">
                    <span className={"ml-n1"}>Ertragswert-veränderungstrend</span>
                    <div className="">
                        {
                            props.earningRevisionTrend.value === 1 &&
                            <>
                                <SvgImage icon="icon_arrow_short_fullup_green.svg" imgClass="svg-green" convert={false} width="28"/>
                                <SvgImage icon="icon_star_filled.svg" imgClass="svg-blue" convert={false} width="32"/>
                            </>
                        }
                        {
                            props.earningRevisionTrend.value === 0 &&
                            <>
                                <SvgImage icon="icon_arrow_short_right_grey.svg" imgClass="svg-grey" convert={false} width="28"/>
                                <SvgImage icon="icon_star.svg" imgClass="svg-blue" convert={false} width="32"/>
                            </>
                        }
                        {
                            props.earningRevisionTrend.value === -1 &&
                            <>
                                <SvgImage icon="icon_arrow_short_fulldown_red.svg" imgClass="svg-red" convert={false} width="28"/>
                                <SvgImage icon="icon_star.svg" imgClass="svg-blue" convert={false} width="32"/>
                            </>
                        }
                    </div>
                </h5>
                {
                    props.earningRevisionTrend.value === 1 &&
                    <>
                        <p className="card-text ml-n1"> Positive Analystenhaltung seit {formatDate(props.earningRevisionTrend.date)} </p>
                        <p className="card-text ml-n1"> Die Gewinnprognosen pro Aktie sind heute höher als vor sieben Wochen. Dieser positive Trend hat am {formatDate(props.earningRevisionTrend.date)} bei einem Kurs von <b>{numberFormat(props.earningRevisionTrend.price)} {props.currency.displayCode} </b> eingesetzt. </p>
                    </>
                }
                {
                    props.earningRevisionTrend.value === 0 &&
                    <>
                        <p className="card-text ml-n1"> Analysten neutral, zuvor positiv (seit {formatDate(props.earningRevisionTrend.date)}) </p>
                        <p className="card-text ml-n1"> Die Gewinnprognosen pro Aktie haben sich in den letzten 7 Wochen nicht wesentlich verändert (Veränderungen zwischen +1% bis -1% werden als neutral betrachtet). Das letzte signifikante Analystensignal war positiv und hat am {numberFormat(props.earningRevisionTrend.price)} bei einem Kurs von <b> {props.currency.displayCode} </b> eingesetzt. </p>
                    </>
                }
                {
                    props.earningRevisionTrend.value === -1 &&
                    <>
                        <p className="card-text ml-n1"> Negative Analystenhaltung seit {formatDate(props.earningRevisionTrend.date)} </p>
                        <p className="card-text ml-n1"> Die Gewinnprognosen pro Aktie sind heute tiefer als vor sieben Wochen. Dieser negative Trend hat am {formatDate(props.earningRevisionTrend.date)} bei einem Kurs von
                            <b> {numberFormat(props.earningRevisionTrend.price)} {props.currency.displayCode} </b>
                            eingesetzt. 
                        </p>
                    </>
                }
            </div>
        </div>

    );
}


import classNames from "classnames";
import { TradeRateBubbleChart } from "components/common/charts/TradeRateBubbleChart/TradeRateBubbleChart";
import { trigInfonline, guessInfonlineSection } from "components/common/InfonlineService";
import { AnalysesOverviewModal } from "components/common/modals/AnalysesOverviewModal";
import { getAssetForUrl } from "components/profile/utils";
import { InstrumentGroup, Query } from "generated/graphql";
import { Link, useParams } from "react-router-dom";
import { numberFormat } from "utils";

export const ShareAnalysesReportView = function (props: ShareAnalysesReportViewProps) {

    const price: number = props.group.content.filter(item => item.main===true)[0].snapQuote?.lastPrice || 0;
    const currency = props.group.content.filter(item => item.main===true)[0].currency.displayCode;
    const analysisPrice: number =( props.data?.group?.analysisReport?.price || 0 )* (currency==="GBX" ? 100 : 1);
    const expectedChangePct = price > 0 ? (analysisPrice - price) * 100 / price : 0;
    const pathParam = useParams<{ section: string, seoTag: string }>();

    return (

        <div className="content-wrapper height-100 d-flex flex-column analysen-kurs">
            <h3 className="content-wrapper-heading font-weight-bold">Analysen &amp; Kursziele für die nächsten 12 Monate</h3>
            <div className="content d-flex justify-content-between flex-column">
                <div className="row">
                    <div className="col text-center left-side d-flex flex-column justify-content-end">
                        <div className="font-weight-bold small-title d-none d-lg-block">Durchschnittliches Kursziel
                            (aus {(props.data?.group?.analysisReport?.negativeCount || 0)
                            + (props.data?.group?.analysisReport?.neutralCount || 0)
                            + (props.data?.group?.analysisReport?.positiveCount || 0)} Analysen)
                        </div>
                        <div className={
                            classNames(
                                "d-flex justify-content-between align-items-center  border info-box",
                                price <= analysisPrice ? 'text-green text-border-green' : 'text-red text-red-border')

                        }>
                            <div>
                                <div className="value-row font-weight-bold">Ø {numberFormat(analysisPrice)} {props.group.main?.currency.sign || currency}</div>
                                {(analysisPrice > 0) && (price > 0) &&
                                <div className="percent-row font-weight-bold">
                                    {numberFormat(expectedChangePct, ' %')}
                                </div>
                                }
                            </div>
                            <div className="buy-sell-rating">
                                <div className="font-weight-normal">Empfehlung</div>
                                <div className="font-weight-bold buy-or-sell">
                                    {price <= analysisPrice ? 'KAUFEN' : 'VERKAUFEN'}
                                </div>
                            </div>
                        </div>

                        {/*MOBILE DUPLICATE*/}
                        <div className="font-weight-bold small-title d-lg-none mt-3">Durchschnittliches Kursziel
                            (aus {(props.data?.group?.analysisReport?.negativeCount || 0)
                            + (props.data?.group?.analysisReport?.neutralCount || 0)
                            + (props.data?.group?.analysisReport?.positiveCount || 0)} Analysen)
                        </div>
                        <div className="info-numbers d-none d-lg-flex">
                            <span className="kaufen">Positive: {props.data?.group?.analysisReport?.positiveCount || 0}</span>
                            <span className="halten">Neutral: {props.data?.group?.analysisReport?.neutralCount || 0}</span>
                            <span className="verkaufen">Negative: {props.data?.group?.analysisReport?.negativeCount || 0}</span>
                        </div>
                    </div>
                    <div className="col">
                        {(props.data?.group?.analysisReport?.targets || []).length > 0 &&
                        <div className="graph-wrapper">
                            <TradeRateBubbleChart targets={(props.data?.group?.analysisReport?.targets || [])} />
                        </div>
                        }
                        <div className="info-numbers d-lg-none">
                            <span className="kaufen">Positive: {props.data?.group?.analysisReport?.positiveCount || 0}</span>
                            <span className="halten">Neutral: {props.data?.group?.analysisReport?.neutralCount || 0}</span>
                            <span className="verkaufen">Negative: {props.data?.group?.analysisReport?.negativeCount || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="button-row d-flex justify-content-end mt-25px">
                    <Link className="text-blue mr-4"
                        to={"/" + getAssetForUrl(props.group.assetGroup || "") + "/analysen/" + pathParam.seoTag + "/"}
                        onClick={() => trigInfonline(guessInfonlineSection(), 'analysenKursziele')}>
                        Weitere Analysen & Kursziele
                    </Link>
                </div>
            </div>
            <div className="vertical-float-border hide-lg"></div>
        </div>
    );
}

interface ShareAnalysesReportViewProps {
    group: InstrumentGroup;
    data: Query;
}
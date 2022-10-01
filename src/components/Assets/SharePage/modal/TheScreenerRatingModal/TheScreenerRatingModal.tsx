import { Instrument, InstrumentGroup, TheScreenerRating } from "../../../../../generated/graphql";
import { Modal } from "react-bootstrap";
import { InstrumentModalHeader } from "../../../../common";
import { formatDate } from "../../../../../utils";
import { TheScreenerRatingModalReview } from "./TheScreenerRatingModalReview";
import { TheScreenerRatingModalMarketCapitalisationCard } from "./TheScreenerRatingModalMarketCapitalisationCard";
import { TheScreenerRatingModalEarningsRevisionTrend } from "./TheScreenerRatingModalEarningsRevisionTrend";
import { TheScreenerRatingModalBearMarket } from "./TheScreenerRatingModalBearMarket";
import { TheScreenerRatingModalRisk } from "./TheScreenerRatingModalRisk";
import { TheScreenerRatingModalLongTermEarning } from "./TheScreenerRatingModalLongTermEarning";
import { TheScreenerRatingModalGlobalPriceEarningsRatio } from "./TheScreenerRatingModalGlobalPriceEarningsRatio";
import { TheScreenerRatingModalInterest } from "./TheScreenerRatingModalInterest";
import { TheScreenerRatingModalGlobalEvaluation } from "./TheScreenerRatingModalGlobalEvaluation";
import { TheScreenerRatingModalLongTermGrowth } from "./TheScreenerRatingModalLongTermGrowth";
import { TheScreenerRatingModalValueAtRisk } from "./TheScreenerRatingModalValueAtRisk";
import { TheScreenerRatingModalMediumTechnicalTrend } from "./TheScreenerRatingModalMediumTechnicalTrend";
import { TheScreenerRatingModalDividend } from "./TheScreenerRatingModalDividend";
import { TheScreenerRatingModalPerformance } from "./TheScreenerRatingModalPerformance";
import { TheScreenerRatingModalNumberOfAnalyses } from "./TheScreenerRatingModalNumberOfAnalyses";
import { TheScreenerRatingModalCorrelation } from "./TheScreenerRatingModalCorrelation";
import { TheScreenerRatingModalValuation } from "./TheScreenerRatingModalValuation";
import { TheScreenerRatingModalBeta } from "./TheScreenerRatingModalBeta";
import { TheScreenerRatingModalBadNews } from "./TheScreenerRatingModalBadNews";
import { getAssetForUrl } from "components/profile/utils";
import { Link, useParams } from "react-router-dom";
import { trigInfonline, guessInfonlineSection } from "components/common/InfonlineService";

export interface TheScreenerRatingModalProps {
    group: InstrumentGroup;
    rating: TheScreenerRating;
    instrument?: Instrument;
}

export function TheScreenerRatingModal(props: TheScreenerRatingModalProps) {
    const pathParam = useParams<{ section: string, seoTag: string }>();
    if (!props.rating.currency) {
        return <></>;
    }
    const instrument = props.instrument ? props.instrument : props.group.content.filter((item: any) => item.main === true)[0] || props.group.content[0];
    const exchange = instrument.exchange?.code ? instrument.exchange.code + '' : '';
    return (
        <>
            <Link className="text-blue mt-1 pr-1" style={{marginRight:'-6px'}} to={"/" + getAssetForUrl(props.group.assetGroup).toLowerCase() + "/rating/" + pathParam.seoTag + "/"} onClick={() => trigInfonline(guessInfonlineSection(), 'theScreenerRating')}>
                Ausführliches theScreener Rating...
            </Link>
            {pathParam.section === "rating" &&
                <Link className="fade modal-backdrop"
                    to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.group.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchange ? ("boerse-" + exchange) : "") }}>
                    <Modal onClick={(e: any) => e.stopPropagation()} show={true} className="modal modal-dialog-sky-placement" >
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="row row-cols-1">
                                    <div className="col d-flex justify-content-between ml-n3 pl-1 ml-md-0 pl-md-0">
                                        <h5 className="modal-title">theScreener Rating</h5>
                                        <Link className="mr-n2 text-nowrap"
                                            to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.group.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchange ? ("boerse-" + exchange) : "") }}>
                                            <span>schließen</span>
                                            <span className="close-modal-butt svg-icon">
                                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_blue.svg"} width={"27"} alt="" className="svg-blue" />
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <InstrumentModalHeader className={"ml-n3 pl-1 ml-md-0 pl-md-0"} modalsTitle={props.group} instrument={instrument} />
                            </div>
                        </div>
                        <div className="modal-body mobile-modal-body">
                            <section className="main-section">
                                <div className="container">
                                    <div className="content-row">
                                        {/* <div className="content-wrapper"> */}
                                        {/* <div className="row">
                                            <div className="section-left-part col-xl-9 col-lg-6 col-md-6">
                                                <TheScreenerRatingModalAnalyses group={props.group}/>
                                            </div>
                                            <div className="section-right-part col-xl col-lg-6 col-md-6">
                                                {
                                                    props.rating.rating &&
                                                        <TheScreenerRatingModalReview rating={props.rating.rating}/>
                                                }
                                            </div>
                                        </div> */}
                                        <div className="content-wrapper wb-m px-0">
                                            <div className="section-right-part px-0">
                                                {
                                                    props.rating.rating &&
                                                    <TheScreenerRatingModalReview rating={props.rating.rating} previousRating={props.rating.previousRating || 0} />
                                                }
                                            </div>
                                        </div>
                                        <div className="content-wrapper wb-m">
                                            <h3 className="content-wrapper-heading font-weight-bold">Analyse</h3>
                                            <div className="content">
                                                <div className="card-columns modal-cards">
                                                    {
                                                        !!props.rating.marketCapitalisation &&
                                                        <TheScreenerRatingModalMarketCapitalisationCard
                                                            name={props.group.name}
                                                            marketCapitalisation={props.rating.marketCapitalisation}
                                                            currency={props.rating.currency}
                                                        />
                                                    }
                                                    {
                                                        !!props.rating.earningsRevisionTrend && !!props.rating.earningsRevisionTrend.value &&
                                                        <TheScreenerRatingModalEarningsRevisionTrend
                                                            earningRevisionTrend={props.rating.earningsRevisionTrend}
                                                            currency={props.rating.currency}
                                                        />
                                                    }
                                                    {
                                                        !!props.rating.valuationRating &&
                                                        <TheScreenerRatingModalValuation
                                                            valuationRating={props.rating.valuationRating}
                                                        />
                                                    }
                                                    {
                                                        !!props.rating.globalPriceEarningsRatio &&
                                                        <TheScreenerRatingModalGlobalPriceEarningsRatio
                                                            value={props.rating.globalPriceEarningsRatio}
                                                            premium={props.rating.premium || undefined}
                                                        />
                                                    }
                                                    {
                                                        !!props.rating.longTermPriceEarnings
                                                        && !!props.rating.longTermGrowth?.year
                                                        && <TheScreenerRatingModalLongTermEarning
                                                            longTermPriceEarnings={props.rating.longTermPriceEarnings}
                                                            year={props.rating.longTermGrowth?.year}
                                                        />
                                                    }
                                                    {
                                                        !!props.rating.longTermGrowth
                                                        && <TheScreenerRatingModalLongTermGrowth
                                                            longTermGrowth={props.rating.longTermGrowth}
                                                        />
                                                    }
                                                    {
                                                        !!props.rating.numberOfAnalysts
                                                        && <TheScreenerRatingModalNumberOfAnalyses
                                                            numberOfAnalysts={props.rating.numberOfAnalysts}
                                                        />
                                                    }
                                                    {
                                                        !!props.rating.dividend && !!props.rating.payout
                                                        && <TheScreenerRatingModalDividend
                                                            dividend={props.rating.dividend}
                                                            payout={props.rating.payout}
                                                        />
                                                    }
                                                    {
                                                        !!props.rating.technicalReverse && !!props.rating.mediumTermTechnicalTrend
                                                        && <TheScreenerRatingModalMediumTechnicalTrend
                                                            technicalReverse={props.rating.technicalReverse}
                                                            currency={props.rating.currency}
                                                            mediumTechnicalTrend={props.rating.mediumTermTechnicalTrend}
                                                        />
                                                    }
                                                    {
                                                        !!props.rating.performance2week && !!props.rating.referenceIndexName
                                                        && <TheScreenerRatingModalPerformance
                                                            performance={props.rating.performance2week}
                                                            referenceIndex={props.rating.referenceIndexName}
                                                        />
                                                    }
                                                    {
                                                        !!props.rating.globalEvaluation &&
                                                        <TheScreenerRatingModalGlobalEvaluation
                                                            globalEvaluation={props.rating.globalEvaluation}
                                                        />
                                                    }
                                                    {
                                                        !!props.rating.rating && !!props.rating.marketCapitalisation
                                                        && <TheScreenerRatingModalInterest
                                                            rating={props.rating.rating}
                                                            marketCapitalisation={props.rating.marketCapitalisation}
                                                        />
                                                    }
                                                </div>
                                            </div>
                                            <div className="text-right font-weight-bold">Stand: {formatDate(props.rating.date)}</div>
                                        </div>
                                    </div>
                                    <div className="content-wrapper wb-m">
                                        <h3 className="content-wrapper-heading font-weight-bold">Risikokennzahlen</h3>
                                        <div className="content">
                                            <div className="card-columns modal-cards">
                                                {
                                                    props.rating.risk &&
                                                    <TheScreenerRatingModalRisk risk={props.rating.risk} />
                                                }
                                                {
                                                    props.rating.bearMarket &&
                                                    <TheScreenerRatingModalBearMarket
                                                        bearMarket={props.rating.bearMarket}
                                                    />
                                                }
                                                {
                                                    props.rating.badNews &&
                                                    <TheScreenerRatingModalBadNews
                                                        badNews={props.rating.badNews}
                                                    />
                                                }
                                                {
                                                    props.rating.beta && props.rating.referenceIndexName &&
                                                    <TheScreenerRatingModalBeta
                                                        beta={props.rating.beta}
                                                        referenceIndex={props.rating.referenceIndexName}
                                                    />
                                                }
                                                {
                                                    props.rating.correlation && props.rating.referenceIndexName &&
                                                    <TheScreenerRatingModalCorrelation
                                                        correlation={props.rating.correlation}
                                                        referenceIndex={props.rating.referenceIndexName}
                                                    />
                                                }
                                                {
                                                    props.rating.valueAtRisk &&
                                                    <TheScreenerRatingModalValueAtRisk
                                                        valueAtRisk={props.rating.valueAtRisk}
                                                    />
                                                }
                                            </div>
                                            <div className="text-right font-weight-bold">Stand: {formatDate(props.rating.date)}</div>
                                        </div>
                                    </div>
                                    <div className="padding-top-16 margin-bottom-12">
                                        Diese Informationen basieren auf Auswertungen von <a href="https://www.thescreener.com/">theScreener.com</a>
                                    </div>
                                    {/* </div> */}
                                </div>
                            </section>
                        </div>
                    </Modal>
                </Link>
            }
        </>
    );
}

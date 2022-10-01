import { Analysis, Instrument, InstrumentGroup, Query } from "generated/graphql";
import { useEffect, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { InstrumentModalHeader } from "../common";
import { AnalysesGridWithFilters } from "./AnalysesGridWithFilters";
import { AnalysesOverviewAdvertisementComponent } from "./AnalysesOverviewAdvertisementComponent";
import { PerformancesAndAnalysesSection } from "./PerformanceAndAnalysesChartSection/PerformancesAndAnalysesSection";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { guessInfonlineSection, trigInfonline } from "../../InfonlineService";
import { getAssetForUrl } from "components/profile/utils";
import { useParams, Link } from "react-router-dom";
import classNames from "classnames";
import { formatAssetGroup, formatPrice, getTextColorByValue, numberFormatWithSign, quoteFormat, extractQuotes } from "utils";

export const AnalysesOverviewModal = (props: AnalysesOverviewModalProps) => {

    const pathParam = useParams<{ section: string, seoTag: string }>();

    let { data, loading } = useQuery<Query>(
        loader('./ChartAnalyses.graphql'), {
        variables: {
            first: 100, after: null,
            isin: props.instrumentGroup.isin
        }, skip: (pathParam.section !== "analysen")
    });

    let analyses: Analysis[] = props.analyses || [];

    const instrument = props.instrument ? props.instrument : props.instrumentGroup.content.filter((item: any) => item.main === true)[0] || props.instrumentGroup.content[0];
    const exchange = instrument.exchange?.code ? instrument.exchange.code + '' : '';

    if (!loading && props.analyses == null) {
        analyses = data?.analysisSearch.edges.map((current: any) => current.node).filter((current: any) => current.targetPrice !== 0) || [];
    }
    return (
        <>
            {pathParam.section === "analysen" &&
                <Link className="fade modal-backdrop"
                    to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchange ? ("boerse-" + exchange) : "") }}>
                    <Modal onClick={(e: any) => e.stopPropagation()} show={true} className="modal modal-dialog-sky-placement" aria-labelledby="timesSalesModal" aria-hidden="false">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="row row-cols-1 mb-n1">
                                    <div className="col d-flex justify-content-between  ml-n3 pl-2 ml-md-0 pl-md-0">
                                        <h5 className="modal-title">Analysen & Kursziele</h5>
                                        <Link className="mr-n2 text-nowrap"
                                            to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchange ? ("boerse-" + exchange) : "") }}>
                                            <span>schließen</span>
                                            <span className="close-modal-butt svg-icon">
                                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_blue.svg"} width={"27"} alt="" className="svg-blue" />
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <InstrumentModalHeader className={" ml-n3 pl-2 ml-md-0 pl-md-0"} modalsTitle={props.instrumentGroup} instrument={instrument} />
                            </div>
                        </div>
                        <div className="modal-body mobile-modal-body">
                            <section className="main-section">
                                <div className="container">
                                    <div className="content-row">
                                        {analyses &&
                                            <PerformancesAndAnalysesSection currency={props.instrumentGroup.content.filter(item => item.main===true)[0].currency.displayCode || ""} instrumentId={props.instrumentGroup.main?.id || 0} analyses={analyses} />                                        }
                                    </div>
                                </div>
                            </section>
                            <section className="main-section index-component">
                                <div className="container">
                                    <div className="content-row filters-in-modal-analyses">
                                        <AnalysesOverviewAdvertisementComponent />
                                        <AnalysesGridWithFilters group={props.instrumentGroup} className="analyses-buttons-modal" />
                                    </div>
                                </div>
                            </section>
                        </div>
                    </Modal>
                </Link>
            }
        </>
    );
}

export interface AnalysesOverviewModalProps {
    instrumentGroup: InstrumentGroup;
    instrument?: Instrument
    buttonTitle?: string;
    analyses?: Analysis[];
}
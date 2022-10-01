import React, { useState } from "react";
import { Instrument, InstrumentGroup, Query } from "../../../../../generated/graphql";
import { Button, Modal, Spinner } from "react-bootstrap";
import { InstrumentModalHeader } from "../../../../common";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import moment from 'moment';
import { CompanyKeyFiguresCharts } from "./CompanyKeyFiguresCharts";
import { ProfitabilityKeyFiguresCharts } from "./ProfitabilityKeyFiguresCharts";
import { FundamentalKeyFigureDevelopmentCharts } from "./FundamentalKeyFigureDevelopmentCharts";
import { LiquidityRatiosDevelopment } from "./LiquidityRatiosDevelopment";
import { OtherKeyFiguresCharts } from "./OtherKeyFiguresCharts";
import { AssetCapitalStructureDevelopmentCharts } from "./AssetCapitalStructureDevelopmentCharts";
import { trigInfonline, guessInfonlineSection } from "components/common/InfonlineService";
import { getAssetForUrl } from "components/profile/utils";
import { Link, useParams } from "react-router-dom";

export const FundamentalKeyFiguresModal = (props: KeyFiguresModalProps) => {
    let toYear = moment().year();
    const pathParam = useParams<{ section: string, seoTag: string }>();

    let { loading: companyLoading, data: companyData } = useQuery<Query>(
        loader('./getCompanyKeyFigures.graphql'),
        { variables: { groupId: props.instrumentGroup.id, fromYear: toYear - 6, toYear: toYear }, skip: pathParam.section !== "fundamantale-kennzahlen" }
    );
    let { loading: estimatesLoading, data: estimatesData } = useQuery<Query>(
        loader('./getCompanyKeyFiguresEstimate.graphql'),
        { variables: { groupId: props.instrumentGroup.id }, skip: pathParam.section !== "fundamantale-kennzahlen" }
    );

    let loading = companyLoading || estimatesLoading;
    const instrument = props.instrument ? props.instrument : props.instrumentGroup.content.filter((item: any) => item.main === true)[0] || props.instrumentGroup.content[0];
    const exchange = instrument.exchange?.code ? instrument.exchange.code + '' : '';
    return (
        <>
            <Link className="text-blue mt-1 pr-1" style={{marginRight:'-6px'}} to={"/" + getAssetForUrl(props.instrumentGroup.assetGroup).toLowerCase() + "/fundamantale-kennzahlen/" + pathParam.seoTag  + "/"} onClick={() => trigInfonline(guessInfonlineSection(), 'fundamentaleKennzahlen')}>                Weitere fundamentale Kennzahlen...
            </Link>
            {pathParam.section === "fundamantale-kennzahlen" &&
                <Link className="fade modal-backdrop"
                    to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchange ? ("boerse-" + exchange) : "") }}>
                    <Modal onClick={(e: any) => e.stopPropagation()} show={true} className="modal modal-dialog-sky-placement" aria-labelledby="timesSalesModal" aria-hidden="true">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="row row-cols-1">
                                    <div className="col d-flex justify-content-between ml-n3 pl-1 ml-md-0 pl-md-0">
                                        <h5 className="modal-title">Fundamentale Kennzahlen</h5>
                                        <Link className="mr-n2 text-nowrap"
                                            to={{ key: "kurse", pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup) + "/kurse/" + pathParam.seoTag + "/", hash: (exchange ? ("boerse-" + exchange) : "") }}>
                                            <span>schließen</span>
                                            <span className="close-modal-butt svg-icon">
                                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_blue.svg"} width={"27"} alt="" className="svg-blue" />
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <InstrumentModalHeader className={" ml-n3 pl-1 ml-md-0 pl-md-0"} modalsTitle={props.instrumentGroup} instrument={props.instrument} />
                            </div>
                        </div>
                        <div className="modal-body mobile-modal-body">
                            <section className="main-section">
                                <div className="container">
                                    <div className="content-row">
                                        <div className="content-wrapper">
                                            {loading ? <Spinner animation="border" /> :
                                                <>
                                                    <CompanyKeyFiguresCharts
                                                        company={companyData?.group?.company?.keyFigures || []}
                                                        estimates={[estimatesData?.group?.estimates?.current || {}, estimatesData?.group?.estimates?.next || {}] || []}
                                                    />
                                                    <FundamentalKeyFigureDevelopmentCharts company={companyData?.group?.company?.keyFigures || []} />
                                                    <ProfitabilityKeyFiguresCharts company={companyData?.group?.company?.keyFigures || []} />
                                                    <AssetCapitalStructureDevelopmentCharts company={companyData?.group?.company?.keyFigures || []} />
                                                    <LiquidityRatiosDevelopment company={companyData?.group?.company?.keyFigures || []} />
                                                    <OtherKeyFiguresCharts company={companyData?.group?.company?.keyFigures || []} />
                                                </>
                                            }
                                        </div>
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


export interface KeyFiguresModalProps {
    instrumentGroup: InstrumentGroup;
    instrument?: Instrument;
}

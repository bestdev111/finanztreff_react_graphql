import { Component } from "react";
import { InstrumentGroup, PeerGroupCompareChart, Query } from "../../../../../generated/graphql";
import { loader } from "graphql.macro";
import { useQuery } from "@apollo/client";
import { Spinner } from "react-bootstrap";
import {
    getFinanztreffAssetLink,
    hideIfEmpty,
    numberFormat,
    numberFormatWithSign
} from "../../../../../utils";
import classNames from "classnames";
import { Link } from 'react-router-dom';

export interface SharePeerGroupSectionProps {
    instrumentGroup: InstrumentGroup;
}


interface SharePeerGroupSectionPanelProps {
    name: string;
    value: number;
    chart?: PeerGroupCompareChart | undefined;
    customInstrumentNames?: string[];
}

export class SharePeerGroupSectionPanel extends Component<SharePeerGroupSectionPanelProps, {}> {
    render() {
        if (this.props.chart?.min.value === null || this.props.chart?.max.value === null || this.props.chart?.current.value === null
                || this.props.chart?.min.value === undefined || this.props.chart?.max.value === undefined || this.props.chart?.current.value === undefined
        ) {
            return <></>;
        }
        let correction = Math.abs(Math.min(0, this.props.chart.min.value));
        let min = this.props.chart.min.value + correction;
        let max = this.props.chart.max.value + correction;
        let current = Math.min(this.props.chart.current.value + correction, max);
        let breakPoint = Math.min(this.props.chart.breakPoint + correction, max);
        let axis = (max - min);
        // debugger;
        return (
            <div className={classNames("stock-info-wrapper with-border", this.props.chart.breakPoint > this.props.value ? 'negative-movement' : 'positive-movement')}>
                <div className="d-flex justify-content-between w-100">
                    <div>
                        <div className="name">{this.props.name}</div>
                        <div className="percentage">{numberFormat(this.props.value)}</div>
                    </div>
                    {this.props.chart.breakPoint > this.props.value ?
                        <img className="thumbs" src={process.env.PUBLIC_URL + "/static/img/thumb-down-icon.png"} />
                        : <img className="thumbs" src={process.env.PUBLIC_URL + "/static/img/thumb-up-icon.png"} />
                    }
                </div>
                {this.props.chart && this.props.chart.current.group && this.props.chart.min.group && this.props.chart.max.group &&
                    <div className="bar-holder">
                        <div className="horizontal-bar-movement height-small progress justify-content-between">
                            <div className="h-bar-pointer-floating" style={{ left: ((current - min) * 100 / axis) + '%' }}>
                                <div className={classNames("pointer-name", ((current - min) * 100 / axis) > 50 ? 'positive-pos' : '')}>
                                    {this.props.customInstrumentNames ?
                                        <>{this.props.customInstrumentNames[1]}</>
                                        :
                                        this.props.chart.current.group?.name}</div>
                                <div className="floating-pointer"></div>
                            </div>
                            <div className="h-bar-pointer left-end"></div>
                            <div className="progress-bar bg-pink" role="progressbar" style={{ width: ((breakPoint - min) * 100 / axis) + '%' }}></div>
                            <div className="progress-bar bg-green" role="progressbar" style={{ width: ((1 - ((breakPoint - min) / axis)) * 100) + '%' }}></div>
                            <div className="h-bar-pointer right-end"></div>
                        </div>
                        <div className="bar-asset-info d-flex justify-content-between mt-10px">
                            <div>
                                {this.props.customInstrumentNames ?
                                    <>{this.props.customInstrumentNames[0]}</>
                                    :

                                    this.props.chart.min.group.assetGroup && this.props.chart.min.group.seoTag ?
                                        <Link
                                            to={getFinanztreffAssetLink(this.props.chart.min.group.assetGroup, this.props.chart.min.group.seoTag)}>{this.props.chart.min.group.name}</Link>
                                        : <div>{this.props.chart.min.group.name}</div>
                                }
                                <div className={classNames("asset-percentage text-color-pink")}>
                                    {numberFormatWithSign(this.props.chart.min.value)}
                                </div>
                            </div>
                            <div className="text-right">
                                {this.props.customInstrumentNames ?
                                    <>{this.props.customInstrumentNames[2]}</>
                                    :
                                    this.props.chart.max.group.assetGroup && this.props.chart.max.group.seoTag ?
                                        <Link
                                            to={getFinanztreffAssetLink(this.props.chart.max.group.assetGroup, this.props.chart.max.group.seoTag)}>{this.props.chart.max.group.name}</Link>
                                        : <div>{this.props.chart.max.group.name}</div>
                                }
                                <div className={classNames("asset-percentage text-color-green")}>
                                    {numberFormatWithSign(this.props.chart.max.value)}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}


export const SharePeerGroupCompareSection = (props: SharePeerGroupSectionProps) => {
    let { data, loading, error } = useQuery<Query>(
        loader('./getSharePeerGroupCompares.graphql'),
        { variables: { groupId: props.instrumentGroup.id }, skip: !props.instrumentGroup.id,  errorPolicy: 'all'  }
    );

    if (loading) {
        return (
            <div className="text-center py-2">
                <Spinner animation="border" />
            </div>);
    }

    if (!data?.group?.peerGroupCompare) {
        return <></>;
    }
    return (
        <div className={`content-wrapper col ${hideIfEmpty(data.group.peerGroupCompare)}`}>
            <h3 className="content-wrapper-heading font-weight-bold">Peergroup & Rentabilität</h3>
            <div className="content">
                <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-1">
                    {data.group.peerGroupCompare
                        .filter(current => NAMES_MAP.hasOwnProperty(current.type))
                        .map(current =>
                            current.chart?.min.value !== undefined && current.chart?.max.value !== undefined
                                && current.chart?.current.value !== undefined &&
                            <div className="col">
                                <SharePeerGroupSectionPanel
                                    name={NAMES_MAP[current.type]}
                                    value={current.value}
                                    chart={current.chart || undefined}
                                />
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

const NAMES_MAP: { [key: string]: string } = {
    "DIVIDEND": "Dividende",
    "NET_DIVIDEND_YIELD": 'Dividendenrendite',
    "PRICE_CASHFLOW_RATIO": 'KCV',
    "PRICE_EARNINGS_RATIO": 'KGV',
    "PRICE_TO_SALES_RATIO": 'KUV',
    "DIVIDEND_PAYOUT_RATIO": 'Ausschüttungsquote',
    "PRICE_EARNING_TO_GROWTH": 'PEG',
    "SALES": 'Umsatz',
    "PROFIT": 'Gewinn',
    "OPERATIVE_MARGIN": 'Operative Marge'
};

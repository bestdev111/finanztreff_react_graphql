import React from "react";
import classNames from "classnames";
import {AssetGroup, Query} from "../../../../generated/graphql";
import {useQuery} from "@apollo/client";
import {Col, Row, Spinner} from "react-bootstrap";
import {loader} from "graphql.macro";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import {
    InstrumentSnapQuoteCardChart,
    QuoteRate,
    SnapQuoteDelayIndicator
} from "../../../common";
import {
    formatAssetGroup, getFinanztreffAssetLink, numberFormatWithSign,
    quoteFormat
} from "../../../../utils";
import SvgImage from "../../../common/image/SvgImage";
import {Link} from "react-router-dom";

interface UnderlyingProps {
    id?: number | undefined;
    className: string;
    lowPrice?: number;
    highPrice?: number
    groupId?: any
    assetGroup?: AssetGroup | undefined
}

export function Underlying(props: UnderlyingProps) {

    let {loading} = useQuery<Query>(
        loader('./getInstrumentChart.graphql'),
        {
            variables: {
                instrumentId: props.id, chartScope: 'INTRADAY'
            }
        }
    );

    if (loading) {
        return <Spinner animation="border"/>
    }

    return (<>
        <div className={classNames("content-wrapper", props.className)}>
            <h2 className="content-wrapper-heading font-weight-bold border-bottom-4 border-gray-light pb-2">
                Basiswert
            </h2>
            <Row className="content">
                <Col xs={12} lg={6} xl={12}>
                    <div className = "d-flex justify-content-between">
                        <Link
                            to = {getFinanztreffAssetLink(props.groupId?.underlyings[0]?.group?.assetGroup, props.groupId?.underlyings[0]?.group?.seoTag)}
                            className="font-weight-bold mt-n2 text-blue"
                            style={{fontSize: '20px'}}
                        >
                            {props.groupId?.underlyings[0]?.group?.name}
                        </Link>
                        <ProfileInstrumentAddPopup instrumentGroupId={props?.groupId?.underlyings[0]?.group?.id}
                                                   name={props?.groupId?.underlyings[0]?.group?.name}
                                                   instrumentId={props?.groupId?.underlyings[0]?.instrument?.id}
                                                   watchlist={true}
                                                   portfolio={true}
                                                   className={"mt-n3 mr-n3"}
                        >
                            <SvgImage convert={false} icon="icon_plus_blue.svg" spanClass="action-icons" imgClass="plus-butt-icon"/>
                        </ProfileInstrumentAddPopup>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span className="bg-dark-blue font-size-12px text-white py-1 pl-2 pr-2">{formatAssetGroup(props.groupId?.underlyings[0]?.group?.assetGroup).toUpperCase()}</span>
                        <span className="font-size-13px ml-2 pt-1">
                            {props.groupId?.underlyings[0]?.group?.isin && `ISIN: ${props.groupId?.underlyings[0]?.group?.isin}`}
                        </span>
                        <span className="font-size-13px ml-2 pt-1">
                            {props.groupId?.underlyings[0]?.group?.wkn && `WKN:${props.groupId?.underlyings[0]?.group?.wkn}`}
                        </span>
                    </div>
                    <div className="d-flex justify-content-between mt-10px">
                        <span style={{fontSize: '20px'}}>
                            <QuoteRate
                                currency={props.groupId?.underlyings[0]?.currency?.displayCode}
                                value={props.groupId?.underlyings[0]?.instrument?.snapQuote?.quotes[0]?.value}
                            />
                        </span>
                        <div className="quote-value">
                            {props.groupId?.underlyings[0]?.instrument?.snapQuote?.quote?.change != null &&
                            <Col xs={12} className={classNames('change px-0', props.groupId?.underlyings[0]?.instrument?.snapQuote?.quote?.change >= 0 ? 'text-color-green' : 'text-color-red')}>
                                <span className="mr-1">
                                    {numberFormatWithSign(props.groupId?.underlyings[0]?.instrument?.snapQuote?.quote?.change)}
                                </span>
                                <span className="mr-1">
                                    {numberFormatWithSign(props.groupId?.underlyings[0]?.instrument?.snapQuote?.quote?.percentChange, '%')}
                                </span>
                                <span className="arrow svg-icon top-move">
                                    {props.groupId?.underlyings[0]?.instrument?.snapQuote?.quote?.change >= 0 ?
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_up_green.svg"}
                                             alt="" className="move-arrow-icon"/> :
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_down_red.svg"}
                                             alt="" className="move-arrow-icon"/>
                                    }
                                </span>
                            </Col>
                            }
                            <Col xs={12} className="time px-0">
                            <span className="delay-indicator">
                                <SnapQuoteDelayIndicator delay={props.groupId?.underlyings[0]?.instrument?.snapQuote?.quote?.delay}/>
                            </span>
                                <span className="value fnt-size-11 p-1">{quoteFormat(props.groupId?.underlyings[0]?.instrument?.snapQuote?.quote?.when, ' Uhr')}</span>
                            </Col>
                        </div>
                    </div>
                    <div className="font-size-13px">
                        <span className = "pr-3">Börse: {(props.groupId?.underlyings[0]?.instrument?.exchange?.name)?.toUpperCase()}</span>
                    </div>
                </Col>
                <Col xl={12} lg={6} xs={12} className="underlying-wrapper px-0">
                    <InstrumentSnapQuoteCardChart
                        instrumentId={props.groupId?.underlyings[0]?.instrument?.id}
                        height={114}
                        width={"100%"}
                    />
                </Col>
            </Row>
        </div>
    </>)
}

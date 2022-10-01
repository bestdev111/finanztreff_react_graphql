import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { loader } from "graphql.macro";
import { Instrument, Query } from "graphql/types";
import { Row, Col, Spinner } from "react-bootstrap";
import { shortNumberFormat } from "utils";
import { PERIODS } from "./StatisticsModal/StatisticsModal";

function getPercentage(value: number, maxValue: number, width: number) {
    return value / maxValue * width;
}

export function MostTraded(props: { purchased: boolean, logedIn: boolean, assetNameLenght?: number, days: number, itemsReturned: number, trades: boolean, chartWidth: number, className?: string, childColumnSize?: string; }) {
    let { data, loading } = useQuery<Query>(loader('./getTradedAssets.graphql'),
        { variables: { days: props.days, buy: props.purchased, itemsReturned: props.itemsReturned } }
    );

    if (loading) {
        return (
            <Row className="py-3 justify-content-center" style={{ height: "70px" }}><Spinner animation="border" /></Row>
        );
    }

    let periodName = PERIODS.find(current => current.id === props.days)?.name;

    if (data) {
        let instrumentGroupTradesOrVolume = props.trades ? (data.instrumentGroupTradesTopTrades || []) : (data.instrumentGroupTradesTopVolume || []);
        const maxValue = Math.max(...(instrumentGroupTradesOrVolume || []).map(current => current ? (props.trades ? current.trades : current.quantity) : 0));

        return (
            <Row className={classNames("fs-15px align-items-center", !props.purchased && "border-lg-gray", props.className)}>
                <Col className={classNames(props.childColumnSize ? props.childColumnSize : "col-sm-5")}>
                </Col>
                <Col className={classNames("font-weight-bold title", props.childColumnSize ? props.childColumnSize : "col-sm-7")}>
                    {props.purchased ? "Meistgekauft" : "Meistverkauft"}
                </Col>
                {instrumentGroupTradesOrVolume.length > 0 ?
                    instrumentGroupTradesOrVolume.map((asset, index) =>
                        <RowProgressBar childColumnSize={props.childColumnSize} blur={index < 3 && props.logedIn} assetNameLenght={props.assetNameLenght} instrument={asset?.group?.main || undefined}
                            percentage={getPercentage(asset ? (props.trades ? asset.trades : asset.quantity) : 0, maxValue, props.chartWidth)}
                            value={asset ? (props.trades ? asset.trades : asset.quantity) : 0} positive={props.purchased} />
                    )
                    :
                    <>
                        <Col>
                        </Col>
                        <Col className={classNames(props.childColumnSize ? "col-md-6 col-sm-12 ml-md-0 ml-sm-4" : "col-sm-12 text-center","fs-16px font-weight-bold text-white pl-2")}>
                            {(props.purchased ? "Keine Wertpapierkäufe - " : "Keine Wertpapierverkäufe - ") + periodName}
                        </Col>
                    </>
                }
            </Row>
        )
    }
    return (<></>);
}

function RowProgressBar({ instrument, percentage, value, positive, blur, assetNameLenght, childColumnSize }: { instrument?: Instrument, percentage: number, value: number, positive: boolean, blur: boolean, assetNameLenght?: number, childColumnSize?: string }) {
    return (
        <>
            <Col className={classNames("statistics-col", childColumnSize ? childColumnSize : "col-sm-5 ")}>
                <Row className="d-inline">
                    <span className={classNames("fs-13px text-nowrap text-value", blur && "blur-text-4px")}
                        style={{ position: "absolute", marginRight: (percentage + 3) + "%", right: "0" }}
                    >
                        {value <= 1000000000 ? shortNumberFormat(value) : "> 1 Mrd."}
                    </span>
                    <span className={classNames("chart-value", positive ? "bg-green" : "bg-pink")}
                        style={{ width: percentage + "%", position: "absolute", bottom: "5px", right: "0" }}>
                    </span>
                </Row>
            </Col>
            <Col className={classNames("fs-13px asset-name text-nowrap", blur && "blur-text-4px", childColumnSize ? childColumnSize : "col-sm-7")}>
                {blur ?
                    <span>{instrument?.name && instrument?.name.length > 27 ? (instrument?.name.slice(0, 24) + "...") : instrument?.name}</span>
                    :
                    <AssetLinkComponent instrument={instrument} size={assetNameLenght ? assetNameLenght : 27} className="text-white" />
                }
            </Col>
        </>
    )
}
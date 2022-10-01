import {useQuery} from "@apollo/client";
import {InstrumentTopFlop, Query} from "../../../generated/graphql";
import {loader} from "graphql.macro";
import {Col, ProgressBar, Row, Spinner, Table} from "react-bootstrap";
import {formatPrice, numberFormatWithSign, quoteFormat, UpdateStateProps} from "../../../utils";
import classNames from "classnames";
import './TopFlopGroup.scss';
import {InstrumentSnapQuoteCard} from "../../common";
import {Component, useEffect, useState} from "react";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import {usePercentChangeVisualization} from "../../../hooks/usePercentChangeVisualization";

interface TopFlopGroupProps {
    groupId: number;
    instrumentId: number;
    isHomePage?: boolean
}

interface TopFlopTableProps {
    topFlops: InstrumentTopFlop[];
    isHomePage?: boolean
}
interface TopFlopRowProps {
    index: number,
    current: InstrumentTopFlop | null,
    middle: number
    isHomePage?: boolean,
    positiveMax: number,
    negativeMax : number
}

export function TopFlopTable(props: TopFlopTableProps) {
    let positiveMax = Math.max(...(props.topFlops || []).map(current => current?.snapQuote?.quote?.percentChange || -1).filter(current => current >= 0));
    let negativeMax = Math.min(...(props.topFlops || []).map(current => current?.snapQuote?.quote?.percentChange || 1).filter(current => current < 0));
    let middle = Math.ceil(props.topFlops.length / 2);
    return (
        <Table variant="top-flop">
            <tbody>
            {props.topFlops.slice()
                .sort((a, b) =>
                    (b?.snapQuote?.quote?.percentChange || 0) - (a?.snapQuote?.quote?.percentChange || 0))
                .map((current: InstrumentTopFlop | null, index: number) =><TopFlopRow index={index} current={current} middle={middle} isHomePage={props.isHomePage} positiveMax={positiveMax} negativeMax={negativeMax}/> )}
            </tbody>
        </Table>
    );
}

 function TopFlopRow(props: TopFlopRowProps) {
    return (
        <>
            <tr key={2 * props.index + 1} className={classNames(props.index === props.middle ? "delimiter" : "")}>
                <td className="column-name font-weight-bold text-blue pl-0 py-1 py-md-2 text-truncate">
                    <AssetLinkComponent instrument={props.current?.instrument}/>
                </td>
                <td className="text-right py-1 py-md-2 column-last-trade align-middle">
                    {formatPrice(props.current?.snapQuote.quote?.value, props.current?.instrument?.group?.assetGroup, props.current?.snapQuote.quote?.value, props.current?.instrument?.currency?.displayCode || "")}
                </td>
                <td className={classNames(
                    "font-weight-bold py-1 py-md-2 pr-1 text-right align-middle",
                    props.current?.snapQuote?.quote?.percentChange && props.current?.snapQuote?.quote?.percentChange >= 0 ? 'text-color-green' : 'text-color-pink',
                    // props.isHomePage && pushEvent.toggle ? 'asset-value-movement-blinker' : ''
                )}
                >
                    {numberFormatWithSign(props.current?.snapQuote?.quote?.percentChange, '%')}
                </td>
                <td className="py-1 py-md-2 pl-1 pt-3  text-left d-none d-md-table-cell align-middle column-progress">
                    {props.current?.snapQuote?.quote?.percentChange !== null && props.current?.snapQuote?.quote?.percentChange !== undefined &&
                        <ProgressBar className="bg-transparent rounded-0" variant={
                            props.current?.snapQuote?.quote?.percentChange >= 0 ? 'success' : 'danger'
                        }
                                     now={props.current?.snapQuote?.quote?.percentChange * 100 / (props.current?.snapQuote?.quote?.percentChange >= 0 ? props.positiveMax : props.negativeMax)}
                                     style={{height: '8px'}}
                        />
                    }
                </td>
                <td className="py-1 py-md-2 d-none d-xl-table-cell column-sector align-middle">
                    {props.current?.instrument?.group?.sector?.name}
                </td>
                <td className="py-1 py-md-2 d-none d-md-table-cell align-middle">
                    {quoteFormat(props.current?.snapQuote?.quote?.when)}
                </td>
            </tr>
            <tr key={2 * props.index} className={classNames("d-table-row d-md-none")}>
                <td colSpan={3} className="px-0 pt-0" style={{borderTop: 0}}>
                    {props.current?.snapQuote?.quote?.percentChange !== null && props.current?.snapQuote?.quote?.percentChange !== undefined &&
                        <ProgressBar className="bg-transparent rounded-0" variant={
                            props.current?.snapQuote?.quote?.percentChange >= 0 ? 'success' : 'danger'
                        }
                                     now={props.current?.snapQuote?.quote?.percentChange * 100 / (props.current?.snapQuote?.quote?.percentChange >= 0 ? props.positiveMax : props.negativeMax)}
                                     style={{height: '8px'}}
                        />
                    }
                </td>
            </tr>
        </>
    )
}

export const TopFlopGroup = ({groupId, instrumentId: refInstrumentId, isHomePage }: TopFlopGroupProps) => {
    let {data, loading} = useQuery<Query>(
        loader('./getTopFlopContent.graphql'), {variables: {groupId: groupId}});
    let mainInstrument = data?.group?.main;
    return (
        <Row>
            <Col xl={9} lg={12}>
                {loading &&
                    <Spinner animation="border"/>
                }
                {data &&
                    <TopFlopTable topFlops={data?.group?.topFlop || []} isHomePage={isHomePage}/>
                }
            </Col>

            <Col xl={3} lg={12}>
                <Row>
                    <Col md={6} xl={12} className={"mt-0 mt-md-2 mt-xl-0"}>
                        {mainInstrument && <InstrumentSnapQuoteCard isHomePage={isHomePage} instrumentId={mainInstrument.id}/>}
                    </Col>
                    <Col md={6} xl={12}>
                        {(!mainInstrument || refInstrumentId !== mainInstrument.id)
                        && <InstrumentSnapQuoteCard className="mt-2" isHomePage={isHomePage} instrumentId={refInstrumentId}/>
                        }
                    </Col>
                </Row>

            </Col>

        </Row>
    )
}

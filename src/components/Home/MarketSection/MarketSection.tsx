import React, { useState } from 'react';
import { MarketCarousel } from "./MarketCarousel/MarketCarousel";
import { Button, Container, Spinner } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { Query } from "../../../generated/graphql";
import { GET_HOME_LIST_INSTRUMENTS, GET_INSTRUMENTS_LIST } from "../../../graphql/query";
import { SelectBottomBox } from "../../common/select/SelectBottomBox/SelectBottomBox";
import classNames from "classnames";
import './MarketSection.scss';
import { useBootstrapBreakpoint } from "../../../hooks/useBootstrapBreakpoint";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

export const MarketSection = (props: MarketSectionProps) => {
	let markets = props.markets;
	let [list, setState] = useState(markets[0].listId);
	let { loading: getInstrumentListLoading, data: getInstrumentListData } = useQuery<Query>(GET_INSTRUMENTS_LIST, { variables: { id: list }, skip: !props.inSharePage || !list},);
	let { loading: getHomeListInstrumentsLoading, data: getHomeListInstrumentsData } = useQuery<Query>(GET_HOME_LIST_INSTRUMENTS, { variables: { listId: list }, skip: props.inSharePage || !list },)
	const height = useBootstrapBreakpoint({
		xs: 337,
		md: 200
	});

	const loading = props.inSharePage ? getInstrumentListLoading : getHomeListInstrumentsLoading;
	const data = props.inSharePage ? getInstrumentListData : getHomeListInstrumentsData;

	return (
		<section className={classNames("market-overview-section")}>
			<Container className={classNames("header", props.className)}>
				<div className="d-flex justify-content-between market-section-heading">
					<h1 className="section-title roboto-heading pt-1">
						{props.title}
					</h1>
					<SelectBottomBox
						className="d-xl-none mr-n4 pr-3" variant="white"
						defaultValue={list}
						title={props.title}
						modalHeight="100px"
						onSelect={value => {
							if(value) {
								setState(value);
								trigInfonline(guessInfonlineSection(), value)
							}
						}}
						options={
							markets.map(current => {
								return {
									value: current.listId,
									name: current.name
								}
							})
						}
					/>
				</div>
			</Container>
			<Container className="market-container px-2 pt-1 px-lg-3 pt-lg-1">
				<div className="sub-navigation justify-content-between d-none d-xl-block py-2">
					{markets.map((current: Market) =>
						<Button variant="link"
							key={current.listId}
							className={classNames("btn-navigation fnt-size-16 text-color-white px-0 py-0 my-2 mr-3 rounded-0", list === current.listId ? "active" : "")}
							onClick={() => {
								trigInfonline(guessInfonlineSection(), current.listId)
								setState(current.listId)
							}}
						>{current.name}</Button>
					)}
				</div>
				<div style={{ minHeight: height }} className="text-center">
					{loading ?
						<Spinner style={{ color: 'white' }} animation="border" />
						: (data?.list ?
							<MarketCarousel showAdvertisement={props.showAdvertisement}
								list={data?.list}
								isChartColorfull={props.isChartColored}
								showExchangeLabelSlider={props.showExchangeLabelSlider}
								bottomPadding={true}
							/>
							: <></>
						)
					}
				</div>
			</Container>
		</section>
	);
}

interface MarketSectionProps {
	title: string;
	showAdvertisement: boolean;
	isChartColored: boolean;
	className?: string;
	showExchangeLabelSlider?: boolean;
	markets: Market[];
	showComodityTab?: boolean
	showCurrencyTab?: boolean
	inSharePage?: boolean
}
export interface Market { name: string, listId: string }

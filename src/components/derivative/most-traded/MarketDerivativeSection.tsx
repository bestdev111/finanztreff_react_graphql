import { useState } from 'react';
import { Button, Carousel, Container, Modal, Row, Spinner } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { AssetGroup, Instrument, List, Maybe, Query } from "../../../generated/graphql";
import { GET_MOST_SEARCHED_BY_CERT, GET_MOST_SEARCHED_BY_KNOCK, GET_MOST_SEARCHED_BY_WARR, GET_MOST_TRADED_BY_CERT, GET_MOST_TRADED_BY_KNOCK, GET_MOST_TRADED_BY_WARR } from "../../../graphql/query";
import classNames from "classnames";
import { useBootstrapBreakpoint } from "../../../hooks/useBootstrapBreakpoint";
import { CarouselWrapper } from 'components/common';
import SvgImage from 'components/common/image/SvgImage';
import MostTradedDerivativeCard from './MostTradedDerivativeCard';
import { trigInfonline } from 'components/common/InfonlineService';

export const MarketDerivativeSection = () => {

	const [type, handleType] = useState("Meistgesucht");
	const [assetType, handleAssetType] = useState("Optionsscheine");

	let { loading, data } = useQuery<Query>(getQuery());

	const height = useBootstrapBreakpoint({
		xs: 337,
		md: 200
	});

	function getQuery() {
		let query: any;
		switch (assetType) {
			case "Optionsscheine":
				query = type === "Meistgesucht" ? GET_MOST_SEARCHED_BY_WARR : GET_MOST_TRADED_BY_WARR;
				break;
			case 'Zertifikate':
				query = type === "Meistgesucht" ? GET_MOST_SEARCHED_BY_CERT : GET_MOST_TRADED_BY_CERT;
				break;
			case 'Knock Outs':
				query = type === "Meistgesucht" ? GET_MOST_SEARCHED_BY_KNOCK : GET_MOST_TRADED_BY_KNOCK;
				break;
			default:
				query = GET_MOST_SEARCHED_BY_WARR;
		}
		return query;
	}

	function filterIvwTags() {
		let ivw:any;
		switch (assetType) {
			case "Optionsscheine":
				ivw = type === "Meistgesucht" ? trigInfonline('derivatives', 'meistgehandelt') : trigInfonline('derivatives', 'meistgesucht');
				break;
			case 'Zertifikate':
				ivw = type === "Meistgesucht" ? trigInfonline('derivatives', 'meistgehandelt') : trigInfonline('derivatives', 'meistgesucht');
				break;
			case 'Knock Outs':
				ivw = type === "Meistgesucht" ? trigInfonline('derivatives', 'meistgehandelt') : trigInfonline('derivatives', 'meistgesucht');
				break;
			default:
				ivw = '';
		}

	}

	return (
		<section className={classNames("market-overview-section")}>
			<Container className="header">
				<div className="d-flex justify-content-between">
					<SelectBottomBox handleAssetType={handleAssetType} handleType={handleType} type={type} assetType={assetType} />
				</div>
			</Container>
			<Container className="market-container px-2 pt-1 px-lg-3 pt-lg-1">
				<div className="sub-navigation justify-content-between d-none d-xl-flex py-2">
					<div className="d-flex justify-content-start">
						<Button variant="link"
							className={classNames("btn-navigation fnt-size-16 text-color-white px-0 py-0 my-2 mr-3 rounded-0", type === "Meistgesucht" && "active")}
							onClick={() => {
								handleType("Meistgesucht")
								trigInfonline('derivatives', 'meistgesucht')
							}}
						>Meistgesucht</Button>
						<Button variant="link"
							className={classNames("btn-navigation fnt-size-16 text-color-white px-0 py-0 my-2 mr-3 rounded-0", type === "Meistgehandelt" && "active")}
							onClick={() => {
								handleType("Meistgehandelt")
								trigInfonline('derivatives', 'meistgehandelt')
							}}
						>Meistgehandelt</Button>
					</div>
					<div className="d-flex justify-content-end">
						<Button variant="link"
							className={classNames("btn-navigation fnt-size-16 text-color-white px-0 py-0 my-2 mr-3 rounded-0", assetType === "Zertifikate" && "active")}
							onClick={() => {
								handleAssetType("Zertifikate")
								filterIvwTags()

							}}
						>Zertifikate</Button>
						<Button variant="link"
							className={classNames("btn-navigation fnt-size-16 text-color-white px-0 py-0 my-2 mr-3 rounded-0", assetType === "Optionsscheine" && "active")}
							onClick={() => {
								handleAssetType("Optionsscheine")
								filterIvwTags()
							}}
						>Optionsscheine</Button>
						<Button variant="link"
							className={classNames("btn-navigation fnt-size-16 text-color-white px-0 py-0 my-2 mr-3 rounded-0", assetType === "Knock Outs" && "active")}
							onClick={() => {
								filterIvwTags()
								handleAssetType("Knock Outs")
							}}
						>Knock Outs</Button>
					</div>
				</div>
				<div style={{ minHeight: height }} className="text-center">
					{loading ?
						<Spinner style={{ color: 'white' }} animation="border" />
						: (data?.list ?
							<MarketCarousel
								list={data?.list}
							/>
							: <></>
						)
					}
				</div>
			</Container>
		</section>
	);
}

export interface Market { name: string, listId: string }

function generateCarouselItems(data: Maybe<Instrument>[], size: number) {
	let array = [];
	let actualSize = size;
	let i = 0;
	while (i * actualSize < data.length) {
		array.push(
			<Carousel.Item key={i} className={"derivative-carusel"} >
				<Row xl={6} sm={2} lg={3} className="gutter-16 gutter-tablet-8 gutter-mobile-8">
					{
						data.slice(i * actualSize, (i + 1) * actualSize).map((current: any) =>
							<MostTradedDerivativeCard derivative={{
								type: current.group?.assetGroup === AssetGroup.Cert ? current.group?.assetClass?.name :
								current.group && current.group.derivative && current.group.derivative.optionType && current.group.derivative.optionType.toLowerCase() || "",
								wkn: current.wkn,
								underlying: current.group?.underlyings?.length > 0 ? current.group?.underlyings[0] : null,
								issuer: current.group?.issuer?.name,
								leverage: current.keyFigures && current.keyFigures.gearing,
								trades: current.snapQuote && current.snapQuote.cumulativeTrades || 0,
								maxRend: current.group?.assetGroup === AssetGroup.Cert &&
									(current.group?.assetClass.name === "Bonus" || current.group?.assetClass.name === "Discount") ?
									current.keyFigures.maxAnnualReturn : 0,
								instrument: current
							}} />
						)
					}
				</Row>
			</Carousel.Item>
		);
		i++;
	}
	return array;

}

export function MarketCarousel(props: MarketCarouselProps) {
	const { list } = props;
	const size = useBootstrapBreakpoint({
		default: 4,
		md: 6
	});
	return (
		<Carousel
			className={"derivative-carusel"}
			touch={true}
			prevIcon={<SvgImage icon="icon_direction_left_white.svg" spanClass="move-arrow" convert={false} />}
			nextIcon={<SvgImage icon="icon_direction_right_white.svg" spanClass="move-arrow" convert={false} />}
			controls={(list.content && list.content.length > 6) || false}
			indicators={(list.content && list.content.length > 6) || false}
			as={CarouselWrapper}
			onSelect={() => trigInfonline('derivatives', 'slider')}
		>
			{generateCarouselItems(list?.content?.slice(0, 12) || [], size)}
		</Carousel>
	);
}

interface MarketCarouselProps {
	list: List;
}

export function SelectBottomBox(props: { handleAssetType: any, handleType: any, type: string, assetType: string }) {
	const [isOpen, handleOpen] = useState(false);
	return (
		<>
			<h3 className="d-xl-none banner-inner-heading mt-16px mb-xl-4 text-nowrap">Derivate Überblick</h3>
			<Button variant="link"
				className="d-xl-none mr-n4 pr-3 text-nowrap"
				onClick={() => handleOpen(true)}
			>
				{props.type}
				<SvgImage spanClass={"drop-arrow-image top-move indicator"} icon={"icon_direction_down_white.svg"} convert={false} />
			</Button>
			<Modal show={isOpen} onHide={() => handleOpen(false)} className="modal bottom select-instrument-group-bottom modal-dialog-sky-placement">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header single-row border-0">
							<div className="row row-cols-1">
								<div className="col d-flex justify-content-between">
									{props.type} {props.assetType}
									<Button variant="link" className="close text-blue" onClick={() => handleOpen(false)} >
										<span>schließen</span>
										<span className="close-modal-butt svg-icon">
											<img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark.svg"} alt="" className="svg-convert svg-blue" />
										</span>
									</Button>
								</div>
							</div>
						</div>
						<Modal.Body className="bg-white py-0" style={{ overflowX: 'scroll', height: "100px" }}>
							<Container>
								<div>
									<Button variant="primary"
										className={classNames("ml-2 mb-2", props.type === "Meistgesucht" && "active")}
										onClick={() => { props.handleType("Meistgesucht"); handleOpen(false) }}
									>Meistgesucht</Button>
									<Button variant="primary"
										className={classNames("ml-2 mb-2", props.type === "Meistgehandelt" && "active")}
										onClick={() => { props.handleType("Meistgehandelt"); handleOpen(false) }}
									>Meistgehandelt</Button>
								</div>
								<div className="border-top mt-2 mb-3">

								</div>
								<div>
									<Button variant="primary"
										className={classNames("ml-2 mb-2", props.assetType === "Zertifikate" && "active")}
										onClick={() => props.handleAssetType("Zertifikate")}
									>Zertifikate</Button>
									<Button variant="primary"
										className={classNames("ml-2 mb-2", props.assetType === "Optionsscheine" && "active")}
										onClick={() => props.handleAssetType("Optionsscheine")}
									>Optionsscheine</Button>
									<Button variant="primary"
										className={classNames("ml-2 mb-2", props.assetType === "Knock Outs" && "active")}
										onClick={() => props.handleAssetType("Knock Outs")}
									>Knock Outs</Button>
								</div>
							</Container>
						</Modal.Body>
					</div>
				</div>
			</Modal>
		</>
	);
}
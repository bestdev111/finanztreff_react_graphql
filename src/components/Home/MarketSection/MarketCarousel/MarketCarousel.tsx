import { Carousel, Col, Row } from 'react-bootstrap';
import { Instrument, List, Maybe } from '../../../../graphql/types';
import { getFinanztreffAssetLink } from "../../../../utils";
import { CarouselWrapper, InstrumentCard } from "../../../common";
import SvgImage from "../../../common/image/SvgImage";
import { useBootstrapBreakpoint } from "../../../../hooks/useBootstrapBreakpoint";
import { MarketCarouselAdvertisement } from "./MarketCarouselAdvertisement";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

function generateCarouselItems(data: Maybe<Instrument>[], size: number, showAdvertisement: boolean, isChartColorfull: boolean, bottomPadding: boolean | undefined) {
	let array = [];
	let actualSize = showAdvertisement ? size - 1 : size;
	let i = 0;
	while (i * actualSize < data.length) {
		array.push(
			<Carousel.Item key={i} className={bottomPadding ? "pb-5" : ""}>
				<Row xl={6} sm={2} lg={3} className="gutter-16 gutter-tablet-8 gutter-mobile-8">
					{
						data.slice(i * actualSize, (i + 1) * actualSize).map((current: any) =>
							<Col key={current.id}>
								<InstrumentCard name={current.name}
									id={current.id}
									groupId={current.group.id}
									price={current.snapQuote?.quote?.value}
									performance={current.snapQuote?.quote?.percentChange}
									decimals={current.group.assetGroup === "CROSS" ? 4 : 2}
									currency={current.currency.displayCode}
									lowPrice={current.snapQuote?.lowPrice}
									highPrice={current.snapQuote?.highPrice}
									isChartColorfull={isChartColorfull}
									url={getFinanztreffAssetLink(current.group.assetGroup, current.group.seoTag, current.exchange.code)}
									chart={current.chart || undefined}
									isHomeComponent={true}
								/>
							</Col>
						)
					}
					{showAdvertisement &&
						<Col>
							<MarketCarouselAdvertisement />
						</Col>
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
			onSelect={()=>trigInfonline(guessInfonlineSection(), list.id)}
			touch={true}
			prevIcon={
				<SvgImage spanClass="move-arrow svg-icon d-none d-xl-block" onClick={() => {
					props.handleTitle && props.handleTitle("Meistgesuchte")
				}}
					icon="icon_direction_left_white.svg" convert={false}>
					{props.bottomPadding ?
						(
							<>
								vorheriger {props.showExchangeLabelSlider}
							</>
						)
						:
						<>
							Meistgesuchte
						</>
					}
				</SvgImage>
			}
			nextIcon={
				<SvgImage spanClass="move-arrow svg-icon d-none d-xl-block" childBeforeImage={true} onClick={() => {
					props.handleTitle && props.handleTitle("Meistgehandelte")
				}}
					icon="icon_direction_right_white.svg" convert={false}>
					{
						props.bottomPadding ? (
							<>
								nächster {props.showExchangeLabelSlider}
							</>
						) : (
							<>
								Meistgehandelte
							</>
						)
					}
				</SvgImage>
			}
			controls={(list.content && list.content.length > 6) || false}
			indicators={(list.content && list.content.length > 6) || false}
			as={CarouselWrapper}
		>
			{generateCarouselItems(list?.content || [], size, props.showAdvertisement, props.isChartColorfull, props.bottomPadding)}
		</Carousel>
	);
}

interface MarketCarouselProps {
	showAdvertisement: boolean;
	list: List;
	isChartColorfull: boolean;
	showExchangeLabelSlider?: boolean;
	bottomPadding?: boolean;
	handleTitle?: (value: string) => void;
}

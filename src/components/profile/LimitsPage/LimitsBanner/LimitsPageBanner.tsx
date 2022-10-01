import { Carousel, Col, Container, Row } from 'react-bootstrap';
import './Limits.scss';
import { Link } from 'react-router-dom';
import { LimitsAdd } from './LimitsAdd';
import SvgImage from 'components/common/image/SvgImage';
import { LimitEntry, UserProfile } from 'generated/graphql';
import { LimitsModal } from './LimitsModal';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import highchartsDumbbell from 'highcharts/modules/dumbbell';
import highchartsLollipop from 'highcharts/modules/lollipop';
import { CarouselWrapper } from 'components/common';
import { useBootstrapBreakpoint } from 'hooks/useBootstrapBreakpoint';

HC_more(Highcharts);
highchartsDumbbell(Highcharts);
highchartsLollipop(Highcharts);

export function LimitsPageBanner(props: { profile: UserProfile; limits: LimitEntry[], refetch: () => void }) {
	
	const carouselItemsSize = useBootstrapBreakpoint({
		default: 6,
		md: 4,
		xl: 6,
		sm: 2
	})
	let currentXPositive = 10;
	let currentXNegative = 10.2;

	let currentXpositionPositive = currentXPositive;
	let currentXpositionNegative = currentXNegative;

	let instrumentMap = props.limits.filter((current: LimitEntry) => current.instrument !== null && current.hitStatus == false && current.initialValue).map((current: any) => current.instrument?.id)
		.filter((value: any, index: number, self: any) => self.indexOf(value) === index);

	let lollipopSeries: Series[] = instrumentMap.map((id: number) => {
		let name = "";
		let currentData = props.limits.filter((current: any) => current.instrument !== null && current.instrument?.id == id && current.hitStatus == false)
			.map((current: any, index: number) => {
				let currentY = getPercentage(current.instrument?.snapQuote?.lastPrice || 0, current.effectiveLimitValue || 0, current.upper || false);
				name = current.instrument.name;
				currentY < 0 ? currentXpositionNegative += 2.8 : currentXpositionPositive += 2.8;
				return {
					x: index + currentY < 0 ? currentXpositionNegative : currentXpositionPositive,
					y: currentY,
					z: id,
					color: current.upper ? "#18C48F" : "#FF4D7D",
					marker: {
						color: "white",
						enabled: true,
						symbol: "circle",
						fillColor: "white",
						radius: 6,
						lineColor: "black",
						lineWidth: 1,
						zIndex: 100
					},
				}
			}) || [];
		let currentSerie = {
			name: name,
			data: currentData,
			showInLegend: false,
		}
		currentXpositionPositive = currentXPositive;
		currentXpositionNegative = currentXNegative;
		return currentSerie;
	})

	let min = -10;
	let max = 10;
	lollipopSeries.map(current => current.data.map(item => item.y >= 0 ? item.y += max : item.y += min))

	let emptyChartOptions = [];
	let count = carouselItemsSize - (lollipopSeries.length % carouselItemsSize);
	while (count) {
		let serie: any = { data: [{ marker: { enabled: false }, x: 0, y: 0, z: 0 }], name: "", showInLegend: false }
		emptyChartOptions.push(serie);
		count--;
	}
	let options = createOptions(carouselItemsSize, max, min, lollipopSeries.concat(emptyChartOptions));

	function getPercentage(currentValue: number, targetValue: number, upper: boolean) {
		let percent = currentValue && targetValue ?
			Math.abs(targetValue - currentValue) / currentValue
			: 0
		percent = upper ? percent : -percent;
		return percent * 100;
	}
	return (
		<>
			<section className="home-banner mein-finanztreff lollipop-banner" id="limits-page-chart">
				<div className="top-row">
					<Container>
						<Row>
							<Col className="page-path">
								<Link style={{ textDecoration: "none" }} className="page-path" to={"/mein-finanztreff/"}>Mein finanztreff </Link>
								/ Limits
							</Col>
							<Col className="justify-content-end bigger-icons d-flex">
								<LimitsAdd
									refreshTrigger={props.refetch}
									variant="link" className="text-white">
									<span className="svg-icon action-icons d-flex">
										<SvgImage icon="icon_add_limit_white.svg" convert={false} width="25" />
										<span className="d-flex mt-1">Neues Limit <span className="d-none d-md-block pl-1"> anlegen</span></span>
									</span>
								</LimitsAdd>
								{/* <span  onClick={() => {window.print()}} className="d-flex align-items-center mx-xl-0 mx-lg-0 mx-md-0 mx-sm-n2">
                                <SvgImage style={{filter: "brightness(0) invert(1)"}} icon="icon-print.svg" width="19" />
                                <span className="ml-1"></span>
								</span> */}
							</Col>

						</Row>
					</Container>
				</div>
				<h4 className="text-white pl-3 py-2 limit-title font-weight-bold mt-sm-n5 pt-sm-3 mt-lg-2">Abstände zum Limit</h4>

				<Carousel
					touch={true}
					prevIcon={
						<SvgImage spanClass="move-arrow svg-icon d-none d-xl-block"
							icon="icon_direction_left_white.svg" convert={true}>
						</SvgImage>
					}
					nextIcon={
						<SvgImage spanClass="move-arrow svg-icon d-none d-xl-block" childBeforeImage={true}
							icon="icon_direction_right_white.svg" convert={true}>
						</SvgImage>
					}
					controls={(options.length > 6) || false}
					indicators={(options.length > 6) || false}
					as={CarouselWrapper}
				>
					{generateCarouselItems(options || [], carouselItemsSize, props.profile, props.limits)}
				</Carousel>

				<div className="chart-y-axis">
					<div className="positive">
						<div>25%</div>
						<div>20%</div>
						<div>15%</div>
						<div>10%</div>
						<div>5%</div>
					</div>
					<div className="negative">
						<div>5%</div>
						<div>10%</div>
						<div>15%</div>
						<div>20%</div>
						<div>25%</div>
					</div>
				</div>
			</section >
		</>
	);
}

function generateCarouselItems(data: any, size: number, profile: UserProfile, limits: LimitEntry[]) {
	let array = [];
	let actualSize = size;
	let i = 0;

	while (i * actualSize < data.length) {
		array.push(
			<Carousel.Item key={i} className={"pb-5 lollipop-banner"}>
				<Row xl={6} sm={2} lg={4} className="gutter-16 gutter-tablet-8 gutter-mobile-8">
					{
						data.slice(i * actualSize, (i + 1) * actualSize).map((current: any) =>
							<Col key={current.id} className="chart-wrapper">
								<LimitsModal profile={profile} limits={limits} id={current.series[0].data[0].z} showSummary={true} stopPropagation={current.series[0].data[0].z === 0}>
									<HighchartsReact highcharts={Highcharts} options={current} />
								</LimitsModal>
							</Col>
						)
					}
				</Row>
			</Carousel.Item>
		);
		i++;
	}
	return array;

}

interface Series {
	name: string;
	data: {
		x: number,
		y: number
	}[]
}

function createOptions(carouselItemsSize: number, max: number, min: number, lollipopSeries?: any) {

	let options = lollipopSeries.map((serie: any) => {
		return {
			credits: { enabled: false },
			chart: {
				type: 'lollipop',
				backgroundColor: null,
				rangeSelector: { enabled: true },
				scrollbar: { enabled: false },
				navigator: { enabled: false },
				title: { text: "" },
				width: carouselItemsSize == 6 ? 239 : carouselItemsSize == 2 ? 221 : 219
			},
			tooltip: {
				formatter: function (props: { this: any }): string {
					props.this = this;
					return ' <b>' + Math.abs(props.this.y - (props.this.y >= 0 ? max : min)).toFixed(2) + '%</b>';
				}
			},
			title: { text: '' },
			mode: "dark",
			xAxis: {
				min: 0,
				max: 30,
				categories: [''],
				labels: {
					enabled: false
				},
				lineColor: "transparent",
				plotLines: [{
					color: 'transparent',
					label: {
						useHTML: true,
						formatter: function () {
							return "<span class='name-in-lollipop " + serie.data[0].z + "'>" + (serie.name.length > 18 ? serie.name.slice(0, 17) + "..." : serie.name) + "</span>";

						},

						rotation: "0",
						y: -10,
						x: 0,
						verticalAlign: "middle",
						style: {
							fontFamily: "Roboto",
							color: "white",
							fontWeight: "bold",
							fontSize: "16px",
							width: 70,
							height: 30
						},
					},
					zIndex: 2000,
					width: 4,
					value: 10,
				}],

			},

			yAxis: {
				min: -35,
				max: 35,
				gridLineWidth: 0.2,
				lineColor: 'rgba(0, 0, 0, 0.1)',
				type: "categories",
				title: { text: '' },
				tickInterval: 5,
				labels: { enabled: false },
				plotBands: [{
					from: -10,
					to: 10,
					color: '#383838',
					zIndex: 5,
				},
				{
					from: 10,
					to: 35,
					color: {
						linearGradient: { x1: 0, x2: 0, y1: 0, y2: 3 },
						stops: [[0, '#383838'], [1, 'rgba(28, 216, 158,0.2)']]
					},
				},
				{
					from: -10,
					to: -35,
					color: {
						linearGradient: { x1: 0, x2: 0, y1: -1, y2: 0.8 },
						stops: [[0, 'rgba(255, 77, 125,0.1)'], [1, '#383838']]
					}
				}],
				plotLines: [{
					color: 'white',
					label: {
						align: 'right', x: -10, y: 20,
						rotation: 0,
						style: {
							fontFamily: "Roboto",
							color: "#383838",
							fontWeight: "bold"
						}
					},
					zIndex: 60,
					width: 3,
					value: -10
				}, {
					color: 'white',
					label: {
						align: 'right', x: -10, y: 20, rotation: 0,
						style: {
							fontFamily: "Roboto",
							color: "#383838",
							fontWeight: "bold"
						}
					},
					zIndex: 6,
					width: 3,
					value: 10
				}]
			},
			series: [serie]
		}
	});
	return options
}
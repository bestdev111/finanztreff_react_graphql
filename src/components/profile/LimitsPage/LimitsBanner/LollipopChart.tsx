import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState, useCallback } from "react";
import HC_more from 'highcharts/highcharts-more';
import highchartsDumbbell from 'highcharts/modules/dumbbell';
import highchartsLollipop from 'highcharts/modules/lollipop';
import { LimitEntry } from "generated/graphql";

HC_more(Highcharts);
highchartsDumbbell(Highcharts);
highchartsLollipop(Highcharts);

export function LollipopChart(props: LollipopChartProps) {
	let pageCount = (props.size || 0) <= 370 ? 2 : (props.size || 0) <= 780 ? 4 : 7;
	let max = Math.ceil(props.options.series.length / pageCount);

	const [state, setState] = useState<LollipopChartState>({ clientXMove: 1, currentPage: 0 });

	const handleTouchStart = useCallback(
		(event) => {
			let currentMove = event.touches[0].clientX;
			setState({ ...state, clientXMove: currentMove });
		},
		[state.clientXMove, state.currentPage],
	);

	const handleTouchEnd = useCallback(
		(event) => {
			let currentMove = event.changedTouches[0].clientX;
			if (currentMove > state.clientXMove && state.currentPage > 0) {
				setState({ ...state, currentPage: Math.abs(state.currentPage - 1) });
			}
			if (currentMove < state.clientXMove && state.currentPage < max - 1) {
				setState({ ...state, currentPage: Math.abs(state.currentPage + 1) });
			}
		},
		[state.clientXMove, state.currentPage],
	);

	const handleMouseOver = () => {
		setState({ ...state, showArrows: true })
	}

	const handleMouseOut = () => {
		setState({ ...state, showArrows: false })
	}

	return (<>
		<div className="lollipop-container ml-n2">
			<div className="lollipop-container-inner" style={{ left: (state.currentPage * -(props.size || 0)) + "px", transitionTimingFunction: 'ease-in-out' }}
				onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
				<HighchartsReact {...props.size} highcharts={Highcharts} options={props.options} callback={props.callback}/>
			</div>
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

		</div>
		<div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
			<ol className="carousel-indicators bg-black">
				{state.showArrows && state.currentPage !== 0 ?
					<span className="move-arrow svg-icon" onClick={() => setState({ ...state, currentPage: state.currentPage - 1 })}>
						<img src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_left_white.svg"} className="svg-convert" alt="" />
					</span>
					:
					<span className="move-arrow svg-icon">
						<img src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_left_dark.svg"} className="svg-convert" alt="" />
					</span>
				}
				{
					[...Array(Math.ceil(max))].map((current: any, index: number) =>
						<li onClick={() => setState({ ...state, currentPage: index })} key={index} className={state.currentPage == index ? "active" : ""}></li>
					)
				}
				{state.showArrows && state.currentPage !== max - 1 ?
					<span className="move-arrow svg-icon" onClick={() => setState({ ...state, currentPage: state.currentPage + 1 })}>
						<img src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_right_white.svg"} className="svg-convert" alt="" />
					</span>
					:
					<span className="move-arrow svg-icon">
						<img src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_right_dark.svg"} className="svg-convert" alt="" />
					</span>
				}
			</ol>
		</div>

	</>
	)
}

interface LollipopChartProps {
	options: any;
	size: number;
	limits: LimitEntry[];
	callback: (chart: any) => void;
}

interface LollipopChartState {
	clientXMove: number;
	currentPage: number;
	max?: number;
	showArrows?: boolean;
	size?: number;
}

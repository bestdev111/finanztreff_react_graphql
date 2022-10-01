import classNames from "classnames";
import {Component} from "react";
import {AssetGroup, CalculationPeriod, Instrument, InstrumentPerformance, Maybe} from "../../../../generated/graphql";
import {formatPrice} from "../../../../utils";
import './PerformanceSection.scss';

interface PerformanceSectionProps {
    instrument: Instrument;
    className?: string;
    title?: string
}

export class PerformanceSection extends Component<PerformanceSectionProps, {}> {
    render() {
        if (this.props.instrument) {
            const minPos = Math.min(...this.props.instrument.performance.filter((item: any) => item.performance >= 0).map((item: any) => item.performance));
            const maxPos = Math.max(...this.props.instrument.performance.filter((item: any) => item.performance >= 0).map((item: any) => item.performance));
            const stepPos = (maxPos - minPos) / 4;
            const minNeg = Math.min(...this.props.instrument.performance.filter((item: any) => item.performance < 0).map((item: any) => item.performance));
            const maxNeg = Math.max(...this.props.instrument.performance.filter((item: any) => item.performance < 0).map((item: any) => item.performance));
            const stepNeg = (maxNeg - minNeg) / 4;
            let sign = (this.props.instrument.currency.sign && this.props.instrument.currency.sign!==" " && this.props.instrument.currency.sign!=="%") ? this.props.instrument.currency.sign : this.props.instrument.currency.displayCode;
            if(this.props.instrument.currency.displayCode === "XXZ"){
                sign = "€"
            }
            const exchange = this.props.instrument.exchange?.code ? ' (' + this.props.instrument.exchange.code + ')' : '';

            if(!this.props.instrument.performance || this.props.instrument.performance.length===0 ){
                return(<></>);
            }

            return (
                <div className={classNames("performance-section", this.props.className)}>
                    {this.props.instrument.group.assetGroup === AssetGroup.Index || this.props.instrument.group.assetGroup === AssetGroup.Share ? (
                            <h3 className="content-wrapper-heading font-weight-medium">
                                {this.props.title ? this.props.title : "Performance - " + this.props.instrument.name + exchange}
                            </h3>
                        )
                        : (
                            <h2 className="content-wrapper-heading font-weight-medium">
                                {this.props.title ? this.props.title : "Performance - " + this.props.instrument.name + exchange}
                            </h2>
                        )
                    }
                    <div className="content d-flex justify-content-between position-relative">
                        <div className="vert-line"></div>
                        <PerformanceEvent sign={sign} performance={getPerformance(this.props.instrument.performance, CalculationPeriod.Intraday)} title={'1 Tag'} stepPos={stepPos} stepNeg={stepNeg} assetGroup={this.props.instrument.group.assetGroup || undefined} />
                        <PerformanceEvent sign={sign} performance={getPerformance(this.props.instrument.performance, CalculationPeriod.Week1)} title={'1 Woche'} stepPos={stepPos} stepNeg={stepNeg} assetGroup={this.props.instrument.group.assetGroup || undefined} />
                        <PerformanceEvent sign={sign} performance={getPerformance(this.props.instrument.performance, CalculationPeriod.Month1)} title={'1 Monat'} stepPos={stepPos} stepNeg={stepNeg} assetGroup={this.props.instrument.group.assetGroup || undefined} />
                        <PerformanceEvent sign={sign} performance={getPerformance(this.props.instrument.performance, CalculationPeriod.Month6)} title={'6 Monat'} stepPos={stepPos} stepNeg={stepNeg} assetGroup={this.props.instrument.group.assetGroup || undefined} />
                        <PerformanceEvent sign={sign} performance={getPerformance(this.props.instrument.performance, CalculationPeriod.Week52)} title={'1 Jahr'} stepPos={stepPos} stepNeg={stepNeg} assetGroup={this.props.instrument.group.assetGroup || undefined} />
                        <PerformanceEvent sign={sign} performance={getPerformance(this.props.instrument.performance, CalculationPeriod.Year3)} title={'3 Jahre'} stepPos={stepPos} stepNeg={stepNeg} assetGroup={this.props.instrument.group.assetGroup || undefined} />
                        <PerformanceEvent sign={sign} performance={getPerformance(this.props.instrument.performance, CalculationPeriod.Year5)} title={'5 Jahre'} stepPos={stepPos} stepNeg={stepNeg} assetGroup={this.props.instrument.group.assetGroup || undefined} />
                        <PerformanceEvent sign={sign} performance={getPerformance(this.props.instrument.performance, CalculationPeriod.Year10)} title={'10 Jahre'} stepPos={stepPos} stepNeg={stepNeg} assetGroup={this.props.instrument.group.assetGroup || undefined} />
                    </div>
                </div>
            );
        }
        else return <></>
    }
}

const getPerformance = function (list: Array<Maybe<InstrumentPerformance>>, period: CalculationPeriod) {
    let found: any = null;
    list && list.map((item) => {
        if (item && (period === item.period)) {
            found = item;
            return item;
        }
    });
    return found;
}

const PerformanceEvent = function (props: any) {
    if (!props.performance || props.performance.performance === null) return (<></>);

    const className = 'performance-event ' + (props.performance.performance < 0 ? 'negative-movement' : 'positive-movement');
    let size = 1;
    if (props.performance.performance >= 0) {
        size = Math.floor(props.performance.performance / props.stepPos);
    } else {
        size = Math.floor(props.performance.performance / props.stepNeg) * (-1);
    }
    size += 1;
    if (size > 5) size = 5;

    const circleSizeCSS = "scale-circle d-flex size-" + size;

    return (
        <div className={className}>
            <div className="period d-lg-none">{props.title}</div>
            <div className={circleSizeCSS}><span>&nbsp;</span></div>
            <div className="period d-none d-lg-block">{props.title}</div>
            <div className="percentage">{formatPrice(props.performance.performance, props.assetGroup)}%</div>
            <div className="value">{formatPrice(props.performance.averagePrice, props.assetGroup)} {props.sign}</div>
        </div>
    );
}



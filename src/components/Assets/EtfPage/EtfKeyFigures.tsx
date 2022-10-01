import {CalculationPeriod, EtfKeyFigures as EtfValue, Instrument} from "../../../generated/graphql";
import {formatKeyFigureValue} from "../../../utils";

export function EtfKeyFigures(props: {instrument: Instrument, keyFigures?: EtfValue}) {
    let volatility1Year = props.instrument.performance.find(current => current.period == CalculationPeriod.Week52);
    let volatility3Year = props.instrument.performance.find(current => current.period == CalculationPeriod.Year3);

    return (
        <div className="content-wrapper">
            <h2 className="content-wrapper-heading font-weight-bold">Risiko</h2>
            <div className="content">
                <div className="py-2 d-flex justify-content-between">
                    <span className="">Volatilität (1J / 3J)</span>
                    <span className=" font-weight-bold">
                        {volatility1Year?.vola && formatKeyFigureValue(volatility1Year.vola, 2, 2, ' %') || "--"}
                    </span>
                    <span className=" font-weight-bold">
                        {volatility3Year?.vola && formatKeyFigureValue(volatility3Year.vola, 2, 2, ' %') || "--"}
                    </span>
                </div>
                <div className="py-2 d-flex justify-content-between">
                    <span className="">Tracking Error</span>
                    <span className=" font-weight-bold"> &nbsp; </span>
                    <span className=" font-weight-bold">
                        {props.keyFigures?.trackingError && formatKeyFigureValue(props.keyFigures?.trackingError, 2, 2, ' %') || "--"}
                    </span>
                </div>
                <div className="py-2 d-flex justify-content-between">
                    <span className="">Jensens Alpha</span>
                    <span className=" font-weight-bold"> &nbsp; </span>
                    <span className=" font-weight-bold">
                        {props.keyFigures?.jensenAlpha && formatKeyFigureValue(props.keyFigures?.jensenAlpha, 2, 2, ' %') || "--"}
                    </span>
                </div>
                <div className="py-2 d-flex justify-content-between">
                    <span className="">Beta</span>
                    <span className=" font-weight-bold"> &nbsp; </span>
                    <span className=" font-weight-bold">
                        {props.keyFigures?.betaFactor && formatKeyFigureValue(props.keyFigures?.betaFactor, 2, 2, ' %') || "--"}
                    </span>
                </div>
                <div className="py-2 d-flex justify-content-between">
                    <span className="">Positive Regression</span>
                    <span className=" font-weight-bold"> &nbsp; </span>
                    <span className=" font-weight-bold">
                        {props.keyFigures?.positiveRegression && formatKeyFigureValue(props.keyFigures?.positiveRegression, 2, 2, ' %') || "--"}
                    </span>
                </div>
                <div className="py-2 d-flex justify-content-between">
                    <span className="">Negative Regression</span>
                    <span className=" font-weight-bold"> &nbsp; </span>
                    <span className=" font-weight-bold">
                        {props.keyFigures?.negativeRegression && formatKeyFigureValue(props.keyFigures?.negativeRegression, 2, 2, ' %') || "--"}
                    </span>
                </div>
            </div>
        </div>
    )
}

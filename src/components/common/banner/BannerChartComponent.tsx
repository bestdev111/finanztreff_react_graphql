import {
    AssetGroup,
    ChartScope,
    DerivativeInstrumentKeyFigures,
    Instrument, InstrumentGroup,
    InstrumentGroupUnderlying
} from "../../../generated/graphql";
import {useEffect, useState} from "react";
import {ChartComponent} from "./ChartComponent";
import {ChartKeyfiguresSection} from "./ChartKeyfiguresSection";
import {getAssetForUrl} from "components/profile/utils";
import {Link, useParams} from "react-router-dom";
import {useBootstrapBreakpoint} from "../../../hooks/useBootstrapBreakpoint";

// import ChartToolModal from "./ChartToolModal";

interface BannerChartComponentProps {
    instrument: Instrument
    underlyings: InstrumentGroupUnderlying[] | undefined
    keyFigures?: DerivativeInstrumentKeyFigures | undefined
    investmentFund?: boolean;
    group: InstrumentGroup
    setEntireInstrument: (val: Instrument) => void;
    setChartScope: (value: ChartScope) => void;
}

export function BannerChartComponent(props: BannerChartComponentProps) {
    const [chartScope, setChartScope] = useState((props.group.assetGroup=== AssetGroup.Bond || props.group.assetGroup=== AssetGroup.Fund || props.group.assetGroup=== AssetGroup.Mmr || props.group.assetGroup=== AssetGroup.Vwl) ? ChartScope.Year : ChartScope.Intraday);
    const [isStrikeChecked, setIsStrikeChecked] = useState<boolean>(false)
    const [isUnderlyingChecked, setIsUnderlyingChecked] = useState<boolean>(false)
    const [isStopLossChecked, setIsStopLossChecked] = useState<boolean>(false)
    const [underlyingInstrumentId, setUnderlyingInstrumentId] = useState<number | null | undefined>(props.underlyings && props.underlyings[0]?.instrumentId);
    const [strike, setStrike] = useState<number | null | undefined>(props.underlyings && props.underlyings[0]?.strike);
    const [stopLoss, setStopLoss] = useState<number | null | undefined>(props.underlyings && props.underlyings[0]?.knockOut);
    const [showStockTools, setShowStockTools] = useState<boolean>(false);
    const [currInstrument, setCurrInstrument] = useState<Instrument>(props.instrument)
    const [isDerivativePage, setIsDerivativePage] = useState<boolean>(true);

    const showChartTools = useBootstrapBreakpoint({
        xl: true,
        md: false,
        lg: false,
        sm: false,
        default: false
    })

    const handleStrikeClick = () => {
        let val = !isStrikeChecked;
        setIsStrikeChecked(!isStrikeChecked);
        if (val) {
            setStrike(props.underlyings && props.underlyings[0].strike);
        } else {
            setStrike(undefined);
        }
    };

    const handleStopLossClick = () => {
        let val = !isStopLossChecked;
        setIsStopLossChecked(!isStopLossChecked)
        if (val) {
            setStopLoss(props.underlyings && props.underlyings[0]?.knockOut);
        } else {
            setStopLoss(undefined);
        }
    };

    useEffect(() => {
        const {assetGroup} = props.group;
        if (assetGroup === AssetGroup.Knock || assetGroup === AssetGroup.Cert || assetGroup === AssetGroup.Warr) {
            setIsDerivativePage(false);
        }
    }, [isDerivativePage])

    useEffect(() => {
        if (!isUnderlyingChecked) {
            // uncheck other checkboxes
            setIsStopLossChecked(false);
            setIsStrikeChecked(false);
            setUnderlyingInstrumentId(undefined);
            setStrike(undefined);
            setStopLoss(undefined);
        } else {
            setUnderlyingInstrumentId(props.underlyings && props.underlyings[0].instrumentId);
        }
    }, [isUnderlyingChecked, setStrike, setStopLoss]);
    const pathParam = useParams<{ section: string, seoTag: string }>();
    return (
        <div className="carousel-item-right-part pr-xl-3 pr-0 col-xl-5 col-lg-12 pt-md-32px">
            <div className="top">
                <div className="time-interval">
                    {
                        !props.investmentFund &&
                        <>
                            <span className={`${chartScope === ChartScope.Intraday ? "active" : ""}`}
                                onClick={() => setChartScope(ChartScope.Intraday)}>1 T</span>
                            <span className={`${chartScope === ChartScope.Week ? "active" : "1"}`}
                                onClick={() => setChartScope(ChartScope.Week)}>1W</span>
                        </>
                    }

                    <span className={`${chartScope === ChartScope.Month ? "active" : ""}`}
                        onClick={() => setChartScope(ChartScope.Month)}>1M</span>
                    <span className={`${chartScope === ChartScope.ThreeMonth ? "active" : ""}`}
                        onClick={() => setChartScope(ChartScope.ThreeMonth)}>3M</span>
                    <span className={`${chartScope === ChartScope.SixMonth ? "active" : ""}`}
                        onClick={() => setChartScope(ChartScope.SixMonth)}>6M</span>
                    <span className={`${chartScope === ChartScope.Year ? "active" : ""}`}
                        onClick={() => setChartScope(ChartScope.Year)}>1J</span>
                    <span className={`${chartScope === ChartScope.ThreeYear ? "active" : ""}`}
                        onClick={() => setChartScope(ChartScope.ThreeYear)}>3J</span>
                    <span className={`${chartScope === ChartScope.FiveYear ? "active" : ""}`}
                        onClick={() => setChartScope(ChartScope.FiveYear)}>5J</span>
                    <span className={`${chartScope === ChartScope.TenYear ? "active" : ""}`}
                        onClick={() => setChartScope(ChartScope.TenYear)}>10J</span>
                </div>
            </div>
            {(isDerivativePage && showChartTools) ?  <Link className="text-blue mt-1 mr-4" onClick={() => setShowStockTools(true)}
                   to={{
                       key: '',
                       pathname: "/" + getAssetForUrl(props.group.assetGroup).toLowerCase() + "/chart-analyse/" + pathParam.seoTag + "/",
                       state: {
                           instrumentId: currInstrument.id,
                           chartType: chartScope,
                           underlyingInstrumentId: underlyingInstrumentId,
                           strike: strike,
                           stoploss: stopLoss
                       }
                   }}>
                <ChartComponent instrumentId={currInstrument.id}
                                chartType={chartScope}
                                underlyingInstrumentId={underlyingInstrumentId}
                                strike={strike}
                                stoploss={stopLoss}/>
            </Link> : (
                <ChartComponent instrumentId={currInstrument.id}
                                chartType={chartScope}
                                underlyingInstrumentId={underlyingInstrumentId}
                                strike={strike}
                                stoploss={stopLoss}
                />
            )}
            <ChartKeyfiguresSection instrument={props.instrument}
                onUnderlyingChecked={() => setIsUnderlyingChecked(!isUnderlyingChecked)}
                underlyingChecked={isUnderlyingChecked}
                onStrikeChecked={handleStrikeClick}
                strikeChecked={isStrikeChecked}
                onStopLossChecked={handleStopLossClick}
                stopLossChecked={isStopLossChecked}
            />
        </div>
    )
}

import {SizeMe} from "react-sizeme";
import classNames from "classnames";
import { Instrument,
    CalculationPeriod,
    InstrumentGroupExchangeTradedFund
 } from "generated/graphql";
import { AssetSummaryCard } from "components/common/AssetSummaryCard/AssetSummaryCard";
import { RangeChartDonut } from "components/common/charts/RangeChartDonut/RangeChartDonut";
import { ProfileInstrumentAddPopup } from "components/common/modals/ProfileInstrumentAddPopup";
import { numberFormat, shortNumberFormat } from "utils";
import SvgImage from "components/common/image/SvgImage";
import { getColor } from "components/commodity/CommodityChartsSection/CommodityResultCard";

interface CommoditySummaryCardProps {
    instrument: Instrument;
}
export function CommoditySummaryCard({instrument}: CommoditySummaryCardProps) {
    let performanceOneYear = instrument.performance && instrument.performance.filter(p => p.period === CalculationPeriod.Week52)[0];
    let performanceThreeYear = instrument.performance && instrument.performance.filter(p => p.period === CalculationPeriod.Year3)[0];
    return (
        <AssetSummaryCard instrumentId={instrument.id}
                          name={instrument.group.name}
                          assetDescription={
                              instrument.group.assetClass?.name &&
                              <span className="bg-ETF p-1 my-auto text-white" style={{ fontSize: "12px" }}>
                                {instrument.group.assetTypeGroup?.name}
                              </span> || <></>
                          }
                          features={[
                              <>
                                  <SizeMe>
                                      {({size}) =>
                                          <RangeChartDonut value={instrument.group.etf?.keyFigures?.totalExpenseRatio || 0}
                                                         width={(size.width || 120) * 0.95} height={(size.width || 120) * .35}/>
                                      }
                                  </SizeMe>
                                  <div className="fs-15px font-weight-bold text-center">Gebühren (TER)</div>
                              </>,
                              <>
                                  <div className={classNames("fs-22px font-weight-bold", getColor(performanceOneYear && performanceOneYear.performance || 0))}>
                                      {numberFormat(performanceOneYear && performanceOneYear.performance, " %")}
                                  </div>
                                  <div className="fs-15px font-weight-bold text-center">Perf. 1 Jahr</div>
                              </>,
                              <>
                                  <div className={classNames("fs-22px font-weight-bold", getColor(performanceThreeYear && performanceThreeYear.performance || 0))}>
                                        {numberFormat(performanceThreeYear && performanceThreeYear.performance, " %")}
                                  </div>
                                  <div className="fs-15px font-weight-bold text-center">Perf. 3 Jahr</div>
                              </>,
                              <>
                                  <div className="fs-22px font-weight-bold">
                                      { instrument.group.bond?.maturityDate &&
                                          numberFormat(instrument.stats[0].deltaHighPrice, '%') || "--"}
                                  </div>
                                  <div className="fs-15px font-weight-bold text-center">Abstand 52W</div>
                              </>,
                              <>
                                  <div className="fs-22px font-weight-bold text-truncate">
                                      {shortNumberFormat(instrument.group.etf?.investmentVolume?.value, 2)}
                                  </div>
                                  <div className="fs-15px font-weight-bold text-center">Volumen</div>
                              </>

                          ]}
                          actions={instrument.id && instrument.group.id &&
                              [<ProfileInstrumentAddPopup
                                  instrumentId={instrument.id}
                                  instrumentGroupId={instrument.group.id}
                                  name={instrument.group.name}
                                  className="p-0 mr-n1"
                                  watchlist={true} portfolio={true}>
                                  <SvgImage icon="icon_plus_blue.svg" imgClass="svg-blue mt-2" width="28" />
                              </ProfileInstrumentAddPopup>]
                              || []
                          }
                          assetGroup={"ETF"}
                          exchangeCode={instrument.exchange.code || ""}
                          exchangeName={instrument.exchange.name || ""}
                          seoTag={instrument.group.seoTag || ""}
                          snapQuote={instrument.snapQuote || undefined}
                          currencyCode={instrument.currency?.displayCode || ""}
                          customInformation={
                              instrument.group.etf && <EtfSummary instrument={{...instrument}} etf={instrument.group.etf}/> || <></>
                          }
        />
    );
}

function EtfSummary({instrument,etf}: {instrument: Instrument, etf: InstrumentGroupExchangeTradedFund}) {
    let options = generateOptions(etf);

    return (
        <>
            <div className="d-flex fs-13px">
                <div className="">
                    <span className="font-weight-bold mr-1">Region</span>
                    <span className="text-nowrap"> {etf.region?.name || "--"} </span>
                </div>
                <div className="mx-2">
                    <span className="font-weight-bold mr-1">Sektor</span>
                    <span className="text-nowrap ">{etf.sector?.name || "--"}</span>
                </div>
                <div className="mx-2">
                    <span className="font-weight-bold mr-1">Strategie</span>
                    <span className="text-nowrap ">{etf.strategy?.name || "--"}</span>
                </div>
            </div>
            <div className="fs-15px" style={{ lineHeight: "1.2" }}>
                {instrument.group.assetTypeGroup?.name &&
                    <>
                        <b>{instrument.group.assetTypeGroup?.name}</b>
                        {options && options.length > 0 && ","}
                    </>} {options.join(", ")}
                <br/>
                { !!etf?.issuer?.name && `KAG: ${etf?.issuer?.name}`}
            </div>
        </>
    );
}

function generateOptions(etf: InstrumentGroupExchangeTradedFund): string[] {
    let options = [];
    if (etf.distributing !== null) {
        options.push(etf.distributing ? "Ausschüttend" : "Thesaurierend");
    }
    if (!!etf.replication?.name) {
        options.push(etf.replication.name)
    }
    if (etf.quanto != null) {
        options.push((!etf.quanto ? "ohne ": "mit ") + "Fremdwährungsrisiko");
    }
    return options;
}

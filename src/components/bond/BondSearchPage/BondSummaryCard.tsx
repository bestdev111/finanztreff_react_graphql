import {CalculationPeriod, Instrument, InstrumentGroupBond} from "../../../generated/graphql";
import {AssetSummaryCard} from "../../common/AssetSummaryCard/AssetSummaryCard";
import {SizeMe} from "react-sizeme";
import classNames from "classnames";
import {formatDate, numberFormat, numberFormatDecimals, shortNumberFormat} from "../../../utils";
import {getColor} from "../../funds/FundSearchPage/ResultCards/FundResultCard";
import {ProfileInstrumentAddPopup} from "../../common/modals/ProfileInstrumentAddPopup";
import SvgImage from "../../common/image/SvgImage";
import {RangeChartDonut} from "../../common/charts/RangeChartDonut/RangeChartDonut";
import {BOND_INVERSE_PALETTE} from "../utils";

export function BondSummaryCard({instrument}: {instrument: Instrument}) {
    let performanceOneYear = instrument.performance && instrument.performance.filter(p => p.period === CalculationPeriod.Week52)[0];
    return (
        <AssetSummaryCard instrumentId={instrument.id}
                          name={instrument.group.name}
                          assetDescription={
                              <span className="bg-BOND p-1 my-auto text-white" style={{ fontSize: "12px" }}>
                                {instrument.group.bond?.type?.name || "Anleihen"}
                              </span> || <></>
                          }
                          features={[
                              <>
                                  <SizeMe>
                                      {({size}) =>
                                        <RangeChartDonut value={instrument.derivativeKeyFigures?.ismaYield || 0}
                                                   width={(size.width || 120) * 0.95} height={(size.width || 120) * .35}/>
                                      }
                                  </SizeMe>
                                  <div className="fs-15px font-weight-bold text-center">Rendite</div>
                              </>,
                              <>
                                  <SizeMe>
                                      {({size}) =>
                                          <RangeChartDonut value={instrument.derivativeKeyFigures?.accruedInterest || 0}
                                                           palette={BOND_INVERSE_PALETTE}
                                                           width={(size.width || 120) * 0.95} height={(size.width || 120) * .35}/>
                                      }
                                  </SizeMe>
                                  <div className="fs-15px font-weight-bold text-center text-nowrap">Stückzinsen *</div>
                              </>,
                              <>
                                  <div className={classNames("fs-22px font-weight-bold", getColor(performanceOneYear && performanceOneYear.performance || 0))}>
                                      {numberFormat(performanceOneYear && performanceOneYear.performance, " %")}
                                  </div>
                                  <div className="fs-15px font-weight-bold text-center">Perf. 1 Jahr</div>
                              </>,
                              <>
                                  <div className="fs-22px font-weight-bold">
                                      { instrument.group.bond?.maturityDate &&
                                            formatDate(instrument.group.bond?.maturityDate) || "--"}
                                  </div>
                                  <div className="fs-15px text-center font-weight-bold">Laufzeit</div>
                              </>,
                              <>
                                  <div className="fs-22px font-weight-bold">
                                      { instrument.group.bond?.maturityDate &&
                                          shortNumberFormat(instrument.group.bond?.issueSize) || "--"}
                                  </div>
                                  <div className="fs-15px font-weight-bold text-center">Ausgabevolumen</div>
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
                          assetGroup={"BOND"}
                          exchangeCode={instrument.exchange.code || ""}
                          exchangeName={instrument.exchange.name || ""}
                          seoTag={instrument.group.seoTag || ""}
                          snapQuote={instrument.snapQuote || undefined}
                          currencyCode={instrument.currency?.sign || ""}
                          customInformation={
                              instrument.group.bond && <BondSummary instrument={{...instrument}} bond={instrument.group.bond}/> || <></>
                         }
        />
    );
}

function BondSummary({instrument,bond}: {instrument: Instrument, bond: InstrumentGroupBond}) {
    return (
        <>
            <div className="d-flex fs-13px">
                <div className="">
                    <span className="font-weight-bold mr-1">Land</span>
                    <span className="text-nowrap"> -- </span>
                </div>
                <div className="mx-2">
                    <span className="font-weight-bold mr-1">Währung</span>
                    <span className="text-nowrap ">{bond.nominalCurrency?.displayCode || "--"}</span>
                </div>
            </div>
            <div className="d-flex flex-wrap fs-13px" style={{ lineHeight: "1.2" }}>
                <div className="pr-3">
                    <span className="font-weight-bold mr-1">Angelaufene Stückzinstage</span>
                    <span className="text-nowrap ">{""}</span>
                </div>
                <div className="pr-3">
                    <span className="font-weight-bold mr-1">Stückzinsen</span>
                    <span className="text-nowrap ">{numberFormatDecimals(instrument.derivativeKeyFigures?.accruedInterest, 2,2, '%')}</span>
                </div>
                <div className="pr-3">
                    <span className="font-weight-bold mr-1">Kaufpreis inkl. Stückzinsen</span>
                    <span className="text-nowrap ">{numberFormatDecimals(instrument.derivativeKeyFigures?.dirtyPrice, 2, 2, '%')}</span>
                </div>
                <div className="pr-3">
                    <span className="font-weight-bold mr-1">Kleinste handelbare Einheit</span>
                    <span className="text-nowrap ">{bond.minAmountTradableLot || "--"} {bond.nominalCurrency?.displayCode || "--"}</span>
                </div>
                <div className="pr-3">
                    <span className="font-weight-bold mr-1">Zinsperiode</span>
                    <span className="text-nowrap ">{"--"}</span>
                </div>
            </div>
            <div className={"text-grey fs-11px"}>
                * Für die Berechnung der Stückzinsen werden 360 Tage herangezogen.
            </div>
        </>
    );

}

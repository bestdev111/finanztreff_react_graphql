import classNames from "classnames";
import { PortfolioInstrumentAdd } from "components/common";
import SvgImage from "components/common/image/SvgImage";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { InstrumentLimits } from "components/profile/common/InstrumentLimits/InstrumentLimits";
import { AccountOverviewModal, TransactionHistory } from "components/profile/modals";
import { RemovePositionModal } from "components/profile/modals/MainSettingsModals/RemovePositionModal";
import { NewsModalMeinFinanztreff } from "components/profile/modals/NewsModal/NewsModalMeinFinanztreff";
import { TransactionImportModal } from "components/profile/modals/TransactionImportModal/TransactionImportModal";
import { calculateChange, calculateEntryTotalInPositionCurrency, calculatePortfolio, calculatePortfolioEntry, calculatePortfolioEntryErtrage, calculatePortfolioErtrage, calculatePortfolioKonto, getAssetGroup, getCurrencyCode, getOrderInTablePortfolio, totalPortfolioList } from "components/profile/utils";
import { PortfolioEntry, QuoteType } from "graphql/types";
import moment from "moment";
import { Button, Col, Container, Row } from "react-bootstrap";
import {formatPrice, getTextColorByValue, numberFormat, numberFormatWithSign, quoteFormat} from "utils";
import { MainSeetingsModal } from "../../../modals/MainSettingsModals/MainSettingsModal";
import { PortfolioEntriesViewProps } from "../../PortfolioViewsComponent";
import { CSVExportButton } from "../PortfolioContentCards/CSVExportButton";
import { ColumnName } from "./ColumnName";
import { ColumnValue, CopyWKN } from "./SimpleViewTable";

export function ExpandedInformationViewTable(props: PortfolioEntriesViewProps) {

    let entries: PortfolioEntry[] = getOrderInTablePortfolio(props.sort.sortType, props.sort.direction, props.portfolio);

    const [initial, yesterday, last] = calculatePortfolio(props.portfolio);
    const ertrage: number = calculatePortfolioErtrage(props.portfolio);
    const total = last + ertrage;

    const konto: number = calculatePortfolioKonto(props.portfolio);

    let [purchasePrice, income, priceGain, totalInPortoflio] = totalPortfolioList(props.portfolio!);

    const ertragePct: number = initial > 0 ? (ertrage / initial) * 100 : 0;
    const [diff, diffPct] = calculateChange(initial, last);

    const [diffDaily, diffDailyPct] = calculateChange(yesterday, last);

    const [totalDiff, totalPct] = calculateChange(initial, total);

    return (
        <>
            <Container className="bg-white p-3 overflow-auto mt-3" style={{ boxShadow: "#00000029 0px 3px 6px" }}>
                <Container className="overflow-auto" style={{ maxWidth: "1216px", width: "1216px" }}>
                    <Row className="bg-gray-light py-2">
                        <ColumnName portfolio={props.portfolio} size={1} name="Stück" className="text-center font-weight-bold pl-0" />
                        <Col xs={2} className="pl-0">
                            <Row><ColumnName portfolio={props.portfolio} name="Bezeichnung" className="font-weight-bold" /></Row>
                            <Row><ColumnName portfolio={props.portfolio} name="Gattung" className="fs-13px" /> </Row>
                            <Row> <ColumnName portfolio={props.portfolio} size={4} name="Gewichtung" className="fs-13px" /><Col xs={5} className="text-right fs-13px"> WKN </Col></Row>
                        </Col>
                        <Col xs={2} className="pl-0">
                            <Row className="font-weight-bold"><ColumnName portfolio={props.portfolio} name="Kurs aktuell" /></Row>
                            <Row><ColumnName portfolio={props.portfolio} size={4} name="Zeit" className="fs-13px" /> <ColumnName portfolio={props.portfolio} size={4} className="text-right fs-13px" name="Börse" /></Row>
                        </Col>
                        <Col xs={1} className="pr-0">
                            <Row className="font-weight-bold fs-15px text-blue text-right"> <ColumnName portfolio={props.portfolio} name="Kaufdatum" className="font-weight-bold" /></Row>
                            <Row className="font-weight-bold fs-15px text-blue text-right"> <ColumnName portfolio={props.portfolio} name="Kaufkurs" className="font-weight-bold" /></Row>
                            <Row className="font-weight-bold fs-15px text-blue text-right"> <ColumnName portfolio={props.portfolio} name="Kaufsumme" className="font-weight-bold" /></Row>
                        </Col>
                        <Col xs={1} className="pr-0">
                            <Row className="font-weight-bold fs-15px text-blue text-right text-nowrap"><ColumnName portfolio={props.portfolio} className="pr-0" name="+/- Erträge" /></Row>
                            <Row className="font-weight-bold fs-15px text-blue text-right text-nowrap"><ColumnName portfolio={props.portfolio} className="pr-0" name="% Erträge" /></Row>
                        </Col>
                        <Col xs={1} className="pr-1">
                            <Row className="font-weight-bold fs-15px text-blue text-right text-nowrap"><ColumnName portfolio={props.portfolio} className="pr-0" name="+/- Heute" /></Row>
                            <Row className="font-weight-bold fs-15px text-blue text-right text-nowrap"><ColumnName portfolio={props.portfolio} className="pr-0" name="% Heute" /></Row>
                        </Col>
                        <Col xs={1} className="pr-0 ml-3">
                            <Row className="font-weight-bold fs-15px text-blue text-right text-nowrap"><ColumnName portfolio={props.portfolio} className="pr-0" name="+/- Kursgewinn" /></Row>
                            <Row className="font-weight-bold fs-15px text-blue text-right text-nowrap"><ColumnName portfolio={props.portfolio} className="pr-0" name="% Kursgewinn" /></Row>
                        </Col>
                        <Col xs={2} className="pr-5">
                            <Row><ColumnName portfolio={props.portfolio} className="font-weight-bold pr-0 text-right" name="+/- Gesamt" /></Row>
                            <Row><ColumnName portfolio={props.portfolio} className=" font-weight-bold pr-0 text-right" name="% Gesamt" /></Row>
                            <Row><ColumnName portfolio={props.portfolio} className=" font-weight-bold pr-0 text-right" name="Gesamtsumme" /></Row>
                        </Col>
                        <Col xs={1}></Col>
                    </Row>
                    <Row className="bg-gray-light border-top-2 border-white fs-12px">
                        <Col xs={3}></Col>
                        <Col xs={3} className="text-center border-left-2 border-white"> In Kaufwährung </Col>
                        <Col xs={5} className="text-center border-left-2 border-white"> In Euro </Col>
                        <Col xs={1} className="border-left-2 border-white"></Col>
                    </Row>
                    {entries.map((entry, index) => {
                        const [initial, yesterday, last] = calculatePortfolioEntry(entry);
                        const initialInPositionCurrency = calculateEntryTotalInPositionCurrency(entry);
                        const [diff, diffPct] = calculateChange(initial, last);
                        const assetType: string = getAssetGroup(entry?.instrument?.group.assetGroup);
                        const ertrage: number = calculatePortfolioEntryErtrage(props.portfolio, entry);
                        const ertragePct: number = initial > 0 ? (ertrage / initial) * 100 : 0;
                        const [diffDaily, diffDailyPct] = calculateChange(yesterday, last);
                        const total: number = last + ertrage;
                        let limits = props.limits.filter(limit => limit.instrumentId === entry.instrumentId);
                        const percentOfPortfolio: number = last / totalInPortoflio * 100;
                        const quote = entry && entry.snapQuote && entry.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
                        const oldAssetNoTradding = moment().subtract(10, "d").isAfter(moment(quote && quote.when)) || !quote;
                        let delay = quote && quote?.delay && quote?.delay > 1 ? 15 : 1;
                        const [totalDiff, totalPct] = calculateChange(initial, total);
                        return (
                            <Row key={index} className="border-bottom-1 border-gray-light py-1">
                                <Col xs={1} className="text-right pr-0">
                                    <Row>
                                        <ColumnValue size={7} value={entry.quantity} className="fs-14px text-right font-weight-bold px-0" />
                                    </Row>
                                </Col>
                                <Col xs={2} className="text-left text-nowrap pl-0">
                                    <Row>
                                        <Col>
                                            {oldAssetNoTradding && <img className="align-middle" style={{ marginTop: "-4px" }}
                                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_alert_red.svg"}
                                                width="20"
                                                alt="search news icon" />
                                            }
                                            <AssetLinkComponent instrument={entry.instrument} className="font-weight-bold" size={20} />
                                        </Col>
                                    </Row>
                                    <Row className="fs-12px align-items-center">
                                        <Col xs={4}><span className={"asset-type-text-color font-weight-bold " + entry.instrument?.group.assetGroup}>{assetType.toUpperCase()}</span>
                                        </Col>
                                    </Row>
                                    <Row className="fs-14px align-items-center mt-n1">
                                        <ColumnValue size={4} value={percentOfPortfolio} className="font-weight-bold text-right text-nowrap" suffix={"%"} />
                                        <Col xs={8}>
                                            {entry.instrument && entry.instrument.wkn ?
                                                <>
                                                    <span>{entry.instrument.wkn}</span>
                                                    <CopyWKN wkn={entry.instrument.wkn || ""} className="p-0 mt-n1" />
                                                </>
                                                :
                                                entry.instrument && entry.instrument.isin &&
                                                <span>{entry.instrument.isin}</span>
                                            }
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={2} className="text-left font-weight-bold pr-0 text-nowrap py-1 pl-1">
                                    <Row className="align-items-center">
                                        <Col>
                                            <span>
                                                {quote && quote.delay === 1 &&
                                                    <span className="fs-11px text-white px-2 bg-orange" style={{ width: "15px" }}>RT</span>
                                                }
                                                {quote && quote.delay !== 1 &&
                                                    <span className="fs-11px text-white px-2 bg-gray-dark" style={{ width: "15px" }}>{delay}</span>
                                                }
                                            </span>
                                            <span className="px-1">{quote && quote.value && formatPrice(quote.value,entry.instrument?.group?.assetGroup,quote?.value, entry.instrument?.currency.displayCode || "")}</span>
                                            <span className="svg-icon move-arrow">
                                                {quote && quote.percentChange ?
                                                    quote.percentChange > 0 ?
                                                        <img src="/static/img/svg/icon_arrow_short_up_green.svg" alt="" className="mt-n1" width={12} />
                                                        : quote.percentChange < 0 ?
                                                            <img src="/static/img/svg/icon_arrow_short_down_red.svg" alt="" className="mt-n1" width={12} />
                                                            : <img src="/static/img/svg/icon_arrow_short_right_grey.svg" alt="" width={28} />
                                                    : ""
                                                }
                                            </span>
                                            <span className={classNames("pl-2", getTextColorByValue(quote?.percentChange))}>{numberFormatWithSign(quote?.percentChange, "%")}</span>
                                        </Col>
                                    </Row>
                                    <Row className="fs-12px align-items-center">
                                        <Col>
                                            <div className="font-weight-light">
                                                {quote && quoteFormat(quote.when)}
                                                <span className="ml-2 mr-n2">{entry.instrument?.exchange.code}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={1} className="text-right fs-14px pr-0">
                                    <Row className="justify-content-end"><Col>{quoteFormat(entry.entryTime)}</Col></Row>
                                    <Row className="justify-content-end"><ColumnValue value={entry.price} /></Row>
                                    <Row className="justify-content-end"><ColumnValue value={initialInPositionCurrency} /></Row>
                                </Col>
                                <Col xs={1} className="text-right fs-14px pr-0">
                                    <Row className="justify-content-end"><ColumnValue value={ertrage} className="pr-0" colored={true} /></Row>
                                    <Row className="justify-content-end"><ColumnValue value={ertragePct} className="pr-0" colored={true} suffix="%" /></Row>
                                </Col>
                                <Col xs={1} className="text-right fs-14px pr-0">
                                    <Row className="justify-content-end"><ColumnValue value={diffDaily} className="pr-0" colored={true} /></Row>
                                    <Row className="justify-content-end"><ColumnValue value={diffDailyPct} className="pr-0" colored={true} suffix="%" /></Row>
                                </Col>
                                <Col xs={1} className="text-right fs-14px pr-n3 ml-3">
                                    <Row className="justify-content-end"><ColumnValue value={diff} className="pr-0 mr-n3" colored={true} /></Row>
                                    <Row className="justify-content-end"><ColumnValue value={diffPct} className="pr-0 mr-n3" colored={true} suffix="%" /></Row>
                                </Col>
                                <Col xs={1} className="text-right fs-14px pl-0">
                                    <Row className="justify-content-end"><ColumnValue size={1} className="pr-0 text-right" value={totalDiff} colored={true} /></Row>
                                    <Row className="justify-content-end"><ColumnValue size={1} className="pr-0 text-right" value={totalPct} colored={true} suffix="%" /></Row>
                                    <Row className="justify-content-end font-weight-bold"><ColumnValue size={1} className="pr-0 text-right" value={total} /></Row>
                                </Col>
                                <Col xs={1}></Col>
                                <Col xs={1} className="text-right pl-2 ml-n3">
                                    <Row className="align-items-center">
                                        <div className="mx-n2">
                                            {entry.instrumentId && entry.instrumentGroupId &&
                                                <InstrumentLimits
                                                    profile={props.profile}
                                                    instrumentGroupId={entry.instrumentGroupId}
                                                    instrumentId={entry.instrumentId}
                                                    svgColor="dark"
                                                    limits={limits}
                                                    refreshTrigger={props.refreshTrigger}
                                                />
                                            }
                                        </div>
                                        {entry.instrument?.isin ?
                                            <div className="pt-1 pl-n1 pr-2">
                                                <NewsModalMeinFinanztreff isins={[entry.instrument.isin]} />
                                            </div>
                                            :
                                            <Button variant="link px-0 pl-n1 pr-1 pb-n1" className="" disabled>
                                                <SvgImage icon={"icon_news.svg"} convert={false} width="26" />
                                            </Button>
                                        }
                                        <MainSeetingsModal
                                            entries={entries}
                                            portfolio={props.portfolio} index={index}
                                            refreshTrigger={props.refreshTrigger}
                                            realportfolio={props.realportfolio}
                                        >
                                            <SvgImage icon={"icon_menu_horizontal_blue.svg"} spanClass="cursor-pointer" convert={false} width="27" />

                                        </MainSeetingsModal>
                                    </Row>
                                </Col>

                                {props.showMemo && entry.memo && entry.memo !== "" &&
                                    <Col xs={12}>
                                        <span className="svg-icon">
                                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_note.svg"} width="28" alt="" className="" />
                                        </span>
                                        <span className="pl-2" ><i>{entry.memo}</i></span>
                                    </Col>
                                }
                            </Row>)
                    })}
                    {props.entriesWithoutInstrument.map((entry, index) => {
                        const [initial, yesterday, last1] = calculatePortfolioEntry(entry);
                        const name = entry.name;

                        return (
                            <Row className="bg-gray-light fs-14px py-2 border-bottom-2 border-white" key={index}>
                                <Col xs={1} className="text-right pr-0">
                                    <Row>
                                        <ColumnValue size={7} value={entry.quantity} className="fs-14px text-right font-weight-bold px-0" />
                                    </Row>
                                </Col>
                                <Col xs={10} className="text-left text-nowrap pl-0">
                                    {name}
                                </Col>
                                <Col xs={1} className="pl-1 text-right">
                                    <RemovePositionModal portfolio={props.portfolio} entry={entry} refreshTrigger={props.refreshTrigger} >
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark_pink.svg"} width="15" className="svg-convert svg-gray-dark cursor-pointer" alt="" />
                                    </RemovePositionModal>
                                </Col>
                            </Row>
                        )
                    })}
                    <Row className="align-items-center pt-3">

                        <Col xs={4} />
                        <Col xs={2} className="fs-14px text-right pr-0">Kaufsumme</Col>
                        <Col xs={1} className="fs-14px text-right pr-0 ml-3">Erträge</Col>
                        <Col xs={1} className="fs-14px text-right pr-0 ml-2">Heute</Col>
                        <Col xs={2} className="fs-14px text-right pl-0 ml-n5">Kursgewinn</Col>
                        <Col xs={1} className="fs-14px text-right pl-0">Summe</Col>
                        <Col xs={1}></Col>
                    </Row>
                    <Row className="align-items-center">

                        <Col xs={3} />
                        <Col xs={2} className="text-right fs-16px font-weight-bold pr-0" >Portfolio Gesamt*</Col>
                        <Col xs={1} className="text-right text-nowrap fs-14px pr-0 pr-0">{numberFormat(initial, " EUR")}</Col>
                        <ColumnValue size={1} value={ertrage} className="fs-14px text-right text-nowrap pr-0 ml-3" colored={true} />
                        <ColumnValue size={1} value={diffDaily} className="fs-14px text-right text-nowrap pr-0 ml-2" colored={true} />
                        <ColumnValue size={2} value={diff} className="fs-14px text-right text-nowrap font-weight-bold pl-0 ml-n5" colored={true} />
                        <ColumnValue size={1} value={totalDiff} className="fs-14px text-right text-nowrap font-weight-bold pl-0" colored={true} />
                        <Col xs={1}></Col>
                    </Row>
                    <Row className="align-items-center ">

                        <Col xs={6} />
                        <ColumnValue size={1} value={ertragePct} className="fs-14px text-right text-nowrap pr-0 ml-3" suffix="%" colored={true} />
                        <ColumnValue size={1} value={diffDailyPct} className="fs-14px text-right text-nowrap pr-0 ml-2" suffix="%" colored={true} />
                        <ColumnValue size={2} value={diffPct} className="fs-14px text-right text-nowrap font-weight-bold pl-0 ml-n5" suffix="%" colored={true} />
                        <ColumnValue size={1} value={totalPct} className="fs-14px text-right text-nowrap font-weight-bold pl-0" suffix="%" colored={true} />
                        <Col xs={1}></Col>
                    </Row>
                    <Row className="align-items-center border-bottom-1 border-gray-light pb-3">

                        <Col xs={9} />
                        <ColumnValue size={2} value={total} className="fs-15px text-right text-nowrap font-weight-bold ml-n4" />
                        <Col xs={1}></Col>
                    </Row>
                    <Row className="align-items-center border-bottom-2 border-gray-light py-1">

                        <Col xs={8} />
                        <Col xs={1} className="text-right fs-16px font-weight-bold" >Konto*</Col>
                        <ColumnValue size={2} value={konto} className="fs-16px text-right text-nowrap font-weight-bold ml-n4" colored={true} />
                        <Col xs={1}></Col>
                    </Row>
                    <Row className="justify-content-xl-end justify-content-sm-start pt-3">
                        {props.portfolio.real && props.realportfolio ?
                            <TransactionImportModal portfolio={props.portfolio} onComplete={props.refreshTrigger} />
                            :
                            <PortfolioInstrumentAdd
                                portfolioId={props.portfolio.id}
                                className="text-nowrap p-1"
                                onComplete={props.refreshTrigger}
                            >
                                <span className="svg-icon mr-1">
                                    <img src="/static/img/svg/icon_plus_white.svg" height="20" alt="" />
                                </span>
                                <span>Wertpapier hinzufügen</span>
                            </PortfolioInstrumentAdd>
                        }
                        <span className="pl-2">
                            <AccountOverviewModal portfolio={props.portfolio} inBanner={false} refreshTrigger={props.refreshTrigger} />
                        </span>
                        <span className="pl-2">
                            <TransactionHistory portfolio={props.portfolio} performanceEntries={props.performanceEntries} inBanner={false} />
                        </span>
                        <span className="pl-2">
                            <CSVExportButton portfolio={props.portfolio} />
                        </span>
                    </Row>
                </Container>
            </Container>
            <Container className="fs-15px px-1 pt-2 font-weight-bold">
                *Zur Berechnung der Portfolio-Gesamtsummen wurden ausländische Währungen zum aktuellen Währungskurs in EUR umgerechnet.
            </Container>
        </>
    );
}

interface SortOption {
    sortType: string;
    direction: boolean;
}
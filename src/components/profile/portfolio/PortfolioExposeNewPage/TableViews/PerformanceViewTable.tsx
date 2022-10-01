import classNames from "classnames";
import { PortfolioInstrumentAdd } from "components/common";
import SvgImage from "components/common/image/SvgImage";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { InstrumentLimits } from "components/profile/common/InstrumentLimits/InstrumentLimits";
import { AccountOverviewModal, TransactionHistory } from "components/profile/modals";
import { RemovePositionModal } from "components/profile/modals/MainSettingsModals/RemovePositionModal";
import { NewsModalMeinFinanztreff } from "components/profile/modals/NewsModal/NewsModalMeinFinanztreff";
import { TransactionImportModal } from "components/profile/modals/TransactionImportModal/TransactionImportModal";
import { calculatePortfolio, calculatePortfolioEntry, calculatePortfolioEntryErtrage, calculatePortfolioErtrage, getAssetGroup, getOrderInTablePortfolio, getPerformance } from "components/profile/utils";
import { PortfolioEntry, QuoteType } from "graphql/types";
import moment from "moment";
import { Button, Col, Container, Row } from "react-bootstrap";
import {formatPrice, getTextColorByValue, numberFormat, numberFormatWithSign, quoteFormat} from "utils";
import { MainSeetingsModal } from "../../../modals/MainSettingsModals/MainSettingsModal";
import { PortfolioEntriesViewProps } from "../../PortfolioViewsComponent";
import { CSVExportButton } from "../PortfolioContentCards/CSVExportButton";
import { ColumnName } from "./ColumnName";
import { CopyWKN } from "./SimpleViewTable";

export function PerformanceViewTable(props: PortfolioEntriesViewProps) {

    let entries: PortfolioEntry[] = getOrderInTablePortfolio(props.sort.sortType, props.sort.direction, props.portfolio);

    const [initial, yesterday, last] = calculatePortfolio(props.portfolio);
    const ertrage: number = calculatePortfolioErtrage(props.portfolio);
    const total = last + ertrage;

    return (
        <>
            <Container className="bg-white p-3 overflow-auto mt-3" style={{ boxShadow: "#00000029 0px 3px 6px" }}>
                <Container className="overflow-auto" style={{ maxWidth: "1216px", width: "1216px" }}>
                    <Row className="bg-gray-light py-2 align-items-center">
                        <ColumnName portfolio={props.portfolio} size={1} name="Stück" className="text-center pl-0 font-weight-bold " />
                        <Col xs={2} className="pl-0">
                            <Row className="font-weight-bold fs-15px text-blue"><ColumnName portfolio={props.portfolio} name="Bezeichnung" className="font-weight-bold" /></Row>
                            <Row><ColumnName portfolio={props.portfolio} size={4} name="Gattung" className="fs-13px" />  <Col xs={8} className="fs-13px"> WKN </Col></Row>
                        </Col>
                        <ColumnName portfolio={props.portfolio} size={1} name="Summe" className="text-right pr-0 font-weight-bold " />
                        <Col xs={1} className="">
                            <Row className="font-weight-bold"><ColumnName portfolio={props.portfolio} name="Kurs aktuell" /></Row>
                            <Row><ColumnName portfolio={props.portfolio} size={6} name="Zeit" className="fs-13px" /> <ColumnName portfolio={props.portfolio} size={4} className="text-right fs-13px" name="Börse" /></Row>
                        </Col>
                        <ColumnName portfolio={props.portfolio} size={1} name="Heute" className="text-right pr-0 font-weight-bold " />
                        <ColumnName portfolio={props.portfolio} size={1} name="1 Woche" className="text-right pl-0 font-weight-bold " />
                        <ColumnName portfolio={props.portfolio} size={1} name="1 Monat" className="text-right pl-0 font-weight-bold " />
                        <ColumnName portfolio={props.portfolio} size={1} name="6 Monate" className="text-right pl-0 font-weight-bold " />
                        <ColumnName portfolio={props.portfolio} size={1} name="1 Jahr" className="text-right pl-0 font-weight-bold " />
                        <ColumnName portfolio={props.portfolio} size={1} name="3 Jahre" className="text-right pl-0 pr-4 font-weight-bold " />
                        <Col xs={1}></Col>
                    </Row>
                    {entries.map((entry, index) => {
                        const [initial, yesterday, last] = calculatePortfolioEntry(entry);
                        const assetType: string = getAssetGroup(entry?.instrument?.group.assetGroup);
                        const ertrage: number = calculatePortfolioEntryErtrage(props.portfolio, entry);
                        const total: number = last + ertrage;
                        let limits = props.limits.filter(limit => limit.instrumentId === entry.instrumentId);
                        const quote = entry && entry.snapQuote && entry.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
                        const oldAssetNoTradding = moment().subtract(10, "d").isAfter(moment(quote && quote.when)) || !quote;
                        let delay = quote && quote?.delay && quote?.delay > 1 ? 15 : 1;

                        return (
                            <Row key={index} className="border-bottom-1 border-gray-light align-items-center py-1">
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
                                            <AssetLinkComponent instrument={entry.instrument} className="font-weight-bold" size={27} />
                                        </Col>
                                    </Row>
                                    <Row className="fs-12px align-items-center">
                                        <Col xs={4}><span className={"asset-type-text-color font-weight-bold " + entry.instrument?.group.assetGroup}>{assetType.toUpperCase()}</span>
                                        </Col>
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
                                <ColumnValue size={1} value={total} className="fs-14px text-right text-nowrap px-0 font-weight-bold" suffix={" " + "EUR"} />
                                <Col xs={1} className="text-left font-weight-bold pr-0 text-nowrap py-1">
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
                                            <span className="px-1">{quote && quote.value && formatPrice(quote.value, entry.instrument?.group?.assetGroup,quote?.value, entry.instrument?.currency.displayCode || "")}</span>
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
                                <ColumnValue size={1} value={quote?.percentChange} className="fs-14px text-right text-nowrap px-0" suffix={"%"} colored={true} />
                                <ColumnValue size={1} value={getPerformance(entry, "WEEK1")} className="fs-14px text-right text-nowrap pl-0" suffix={"%"} colored={true} />
                                <ColumnValue size={1} value={getPerformance(entry, "MONTH1")} className="fs-14px text-right text-nowrap pl-0" suffix={"%"} colored={true} />
                                <ColumnValue size={1} value={getPerformance(entry, "MONTH6")} className="fs-14px text-right text-nowrap pl-0" suffix={"%"} colored={true} />
                                <ColumnValue size={1} value={getPerformance(entry, "WEEK52")} className="fs-14px text-right text-nowrap pl-0" suffix={"%"} colored={true} />
                                <ColumnValue size={1} value={getPerformance(entry, "YEAR3")} className="fs-14px text-right text-nowrap pl-0 pr-4" suffix={"%"} colored={true} />
                                <Col xs={1} className="text-right pl-0">
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
                    <Row className="align-items-center py-3 border-bottom-2 border-gray-light fs-16px font-weight-bold">
                        <Col xs={1} />
                        <Col xs={2} className="text-right" >Portfolio Gesamt*</Col>
                        <Col xs={1} className="text-right text-nowrap">{numberFormat(total, " EUR")}</Col>
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

export function ColumnValue(props: { size?: number, value?: number | null, className?: string, suffix?: string, colored?: boolean }) {
    return (
        <Col xs={props.size} className={classNames(props.colored && getTextColorByValue(props.value), props.className)}>
            {props.colored ? numberFormatWithSign(props.value, props.suffix) : numberFormat(props.value, props.suffix)}
        </Col>
    )
}
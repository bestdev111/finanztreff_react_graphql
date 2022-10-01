import { useState } from "react";
import { calculateChange, calculatePortfolio, calculatePortfolioEntry, calculateEntryTotalInPositionCurrency, getAssetGroup, calculatePortfolioErtrage, calculatePortfolioEntryErtrage, totalPortfolioList, getCurrencyCode, getOrderInTablePortfolio, calculatePortfolioKonto } from "../../../utils";
import {
    formatPrice,
    getTextColorByValue,
    numberFormat,
    numberFormatDecimals,
    numberFormatWithSign,
    quoteFormat
} from "../../../../../utils";
import { PortfolioEntry, QuoteType } from "../../../../../generated/graphql";
import { AccountOverviewModal, TransactionHistory } from "components/profile/modals";
import { PortfolioInstrumentAdd } from "components/common";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { InstrumentLimits } from "components/profile/common/InstrumentLimits/InstrumentLimits";
import classNames from "classnames";
import { Button, Col, Container, Row } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";
import { PortfolioEntriesViewProps } from "../../PortfolioViewsComponent";
import { RemovePositionModal } from "components/profile/modals/MainSettingsModals/RemovePositionModal";
import { MainSeetingsModal } from "../../../modals/MainSettingsModals/MainSettingsModal";
import SvgImage from "../../../../common/image/SvgImage";
import { TransactionImportModal } from "components/profile/modals/TransactionImportModal/TransactionImportModal";
import moment from "moment";
import { CSVExportButton } from "../PortfolioContentCards/CSVExportButton";
import { NewsModalMeinFinanztreff } from "components/profile/modals/NewsModal/NewsModalMeinFinanztreff";
import { ColumnName } from "./ColumnName";

export function SimpleViewTable(props: PortfolioEntriesViewProps) {

    let entries: PortfolioEntry[] = getOrderInTablePortfolio(props.sort.sortType, props.sort.direction, props.portfolio);

    const [initial, yesterday, last] = calculatePortfolio(props.portfolio);
    const ertrage: number = calculatePortfolioErtrage(props.portfolio);
    const total = last + ertrage;
    const konto: number = calculatePortfolioKonto(props.portfolio);
    
    const ertragePct: number = initial > 0 ? (ertrage / initial) * 100 : 0;
    const [diff, diffPct] = calculateChange(initial, last);
    const [diffDaily, diffDailyPct] = calculateChange(yesterday, last);
    const [totalDiff, totalPct] = calculateChange(initial, total);
    
    return (
        <>
            <Container className="bg-white p-3 overflow-auto mt-3" style={{ boxShadow: "#00000029 0px 3px 6px" }}>
                <Container className="overflow-auto" style={{ maxWidth: "1216px", width: "1216px" }}>
                    <Row className="bg-gray-light py-2 align-items-center">
                        <ColumnName portfolio={props.portfolio} size={1} name="Stück" className="text-center pl-0 font-weight-bold" />
                        <Col xs={3} className="pl-0">
                            <Row><ColumnName portfolio={props.portfolio} className="font-weight-bold" name="Bezeichnung"/></Row>
                            <Row><ColumnName portfolio={props.portfolio} size={4} className="fs-13px" name="Gattung"/> <Col className="fs-13px" xs={8}> WKN </Col></Row>
                        </Col>
                        <Col xs={2} className="">
                            <Row><ColumnName portfolio={props.portfolio} className="font-weight-bold" name="Kurs aktuell" /></Row>
                            <Row><ColumnName portfolio={props.portfolio} size={4} name="Zeit" className="fs-13px" /> <ColumnName portfolio={props.portfolio} size={4} className="text-right fs-13px" name="Börse" /></Row>
                        </Col>
                        <ColumnName portfolio={props.portfolio} size={1} name="Kaufsumme" className="text-left pr-0 font-weight-bold" />
                        <ColumnName portfolio={props.portfolio} size={1} name="Erträge" className="text-right pr-2 font-weight-bold" />
                        <ColumnName portfolio={props.portfolio} size={1} name="Heute" className="text-right font-weight-bold" />
                        <ColumnName portfolio={props.portfolio} size={1} name="Kursgewinn" className="text-center pl-0 font-weight-bold" />
                        <ColumnName portfolio={props.portfolio} size={1} name="Gesamt EUR" className="text-center pl-0 font-weight-bold" />
                        <Col xs={1}></Col>
                    </Row>
                    {entries.map((entry, index) => {
                        const currencyCode = getCurrencyCode(entry);
                        const [initial, yesterday, last] = calculatePortfolioEntry(entry);
                        const initialInPositionCurrency = calculateEntryTotalInPositionCurrency(entry);
                        const [diff, diffPct] = calculateChange(initial, last);
                        const assetType: string = getAssetGroup(entry?.instrument?.group.assetGroup);
                        const ertrage: number = calculatePortfolioEntryErtrage(props.portfolio, entry);
                        const ertragePct: number = initial > 0 ? (ertrage / initial) * 100 : 0;

                        const [diffDaily, diffDailyPct] = calculateChange(yesterday, last);
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
                                <Col xs={3} className="text-left text-nowrap pl-0">
                                    <Row>
                                        <Col>
                                            {oldAssetNoTradding && <img className="align-middle" style={{ marginTop: "-4px" }}
                                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_alert_red.svg"}
                                                width="20"
                                                alt="search news icon" />
                                            }
                                            <AssetLinkComponent instrument={entry.instrument} className="font-weight-bold" size={35} />
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
                                <Col xs={2} className="text-left font-weight-bold pr-0 text-nowrap py-1">
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
                                <ColumnValue size={1} value={initialInPositionCurrency} className="fs-14px text-right text-nowrap px-0" suffix={" " + currencyCode} />
                                <ColumnValue size={1} value={ertragePct} className="fs-14px text-right" colored={true} suffix={"%"} />
                                <ColumnValue size={1} value={diffDailyPct} className="fs-14px text-right" colored={true} suffix={"%"} />
                                <ColumnValue size={1} value={diffPct} className="fs-14px text-right" colored={true} suffix={"%"} />
                                <ColumnValue size={1} value={total} className="fs-14px text-right font-weight-bold" />
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

                        <Col xs={6} />
                        <Col xs={1} className="fs-14px text-right">Kaufsumme</Col>
                        <Col xs={1} className="fs-14px text-right">Erträge</Col>
                        <Col xs={1} className="fs-14px text-right">Heute</Col>
                        <Col xs={1} className="fs-14px text-right">Kursgewinn</Col>
                        <Col xs={1} className="fs-14px text-right">Summe</Col>
                        <Col xs={1}></Col>
                    </Row>
                    <Row className="align-items-center">

                        <Col xs={4} />
                        <Col xs={2} className="text-right fs-16px font-weight-bold" >Portfolio Gesamt*</Col>
                        <Col xs={1} className="text-right text-nowrap fs-14px">{numberFormat(initial, " EUR")}</Col>
                        <ColumnValue size={1} value={ertrage} className="fs-14px text-right text-nowrap" colored={true} />
                        <ColumnValue size={1} value={diffDaily} className="fs-14px text-right text-nowrap" colored={true} />
                        <ColumnValue size={1} value={diff} className="fs-14px text-right text-nowrap font-weight-bold" colored={true} />
                        <ColumnValue size={1} value={totalDiff} className="fs-14px text-right text-nowrap font-weight-bold" colored={true} />
                        <Col xs={1}></Col>
                    </Row>
                    <Row className="align-items-center ">

                        <Col xs={7} />
                        <ColumnValue size={1} value={ertragePct} className="fs-14px text-right text-nowrap" suffix="%" colored={true} />
                        <ColumnValue size={1} value={diffDailyPct} className="fs-14px text-right text-nowrap" suffix="%" colored={true} />
                        <ColumnValue size={1} value={diffPct} className="fs-14px text-right text-nowrap font-weight-bold" suffix="%" colored={true} />
                        <ColumnValue size={1} value={totalPct} className="fs-14px text-right text-nowrap font-weight-bold" suffix="%" colored={true} />
                        <Col xs={1}></Col>
                    </Row>
                    <Row className="align-items-center border-bottom-1 border-gray-light pb-3">

                        <Col xs={10} />
                        <ColumnValue size={1} value={total} className="fs-15px text-right text-nowrap  font-weight-bold" />
                        <Col xs={1}></Col>
                    </Row>
                    <Row className="align-items-center border-bottom-2 border-gray-light py-1">

                        <Col xs={9} />
                        <Col xs={1} className="text-right fs-16px font-weight-bold" >Konto*</Col>
                        <ColumnValue size={1} value={konto} className="fs-16px text-right text-nowrap font-weight-bold" colored={true} />
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

export function ColumnValue(props: { size?: number, value?: number | null, className?: string, suffix?: string, colored?: boolean }) {
    return (
        <Col xs={props.size} className={classNames(props.colored && getTextColorByValue(props.value), props.className)}>
            {props.colored ? numberFormatWithSign(props.value, props.suffix) : (props.value && props.value>=1 ? formatPrice(props.value,null,props?.value, props.suffix) : numberFormatDecimals(props.value,4))}
        </Col>
    )
}

export function CopyWKN({ wkn, className }: { wkn: string, className?: string }) {

    const [wknCopied, setWknCopied] = useState<boolean>(false);
    return (
        <CopyToClipboard text={wkn} onCopy={() => {
            setWknCopied(true);
        }}>
            <Button variant="link" className={className} title={wknCopied ? "Copied" : "Copy"} >
                <SvgImage icon="icon_copy_dark.svg" convert={false} spanClass="copy-icon" width={'28'} />
            </Button>
        </CopyToClipboard>
    );
}
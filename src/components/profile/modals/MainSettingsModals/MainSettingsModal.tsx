import classNames from "classnames";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { InstrumentLimits } from "components/profile/common/InstrumentLimits/InstrumentLimits";
import { CopyAssetToOtherPortfolio } from "components/profile/modals/MainSettingsModals/CopyAssetToOtherPortfolio";
import { EditEntryModal } from "components/profile/modals/MainSettingsModals/EditEntryModal";
import { EditMemoModal } from "components/profile/modals/MainSettingsModals/EditMemoModal";
import { PurchaseAssetModal } from "components/profile/modals/MainSettingsModals/PurchaseAssetModal";
import { RemovePositionModal } from "components/profile/modals/MainSettingsModals/RemovePositionModal";
import { SaleAssetModal } from "components/profile/modals/MainSettingsModals/SaleAssetModal";
import { SplitAssetModal } from "components/profile/modals/MainSettingsModals/SplitAssetModal";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { NewsModalMeinFinanztreff } from "components/profile/modals/NewsModal/NewsModalMeinFinanztreff";
import { calculateChange, calculateEntryTotalInPositionCurrency, calculatePortfolioEntry, calculatePortfolioEntryErtrage, calculatePortfolioEntryValue, getAssetGroup, getCurrencyCode, getDividendsIncome, getSnapQuote, totalPortfolioList } from "components/profile/utils";
import { PortfolioEntry, Portfolio, Instrument, QuoteType, SnapQuote, AssetGroup } from "graphql/types"
import { ReactNode, useEffect, useState } from "react"
import { Accordion, Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import {
    REALDATE_FORMAT,
    shortNumberFormat,
    numberFormatWithSign,
    numberFormat,
    getTextColorByValue,
    quoteFormat,
    formatPrice, formatPriceWithSign
} from "utils";
import { guessInfonlineSection, trigInfonline } from "../../../common/InfonlineService";
import { DevidendEntriesModal } from "./AccountEntry/DividendEntriesModal";
import { EditEntryMobileButton } from "./AccountEntry/EditEntryMobileButton";

export function MainSeetingsModal(props: MainSeetingsModalProps) {
    const [open, setOpen] = useState(false);
    const handleModalOpen = (value: boolean) => setOpen(value);
    const portfolioEntriesWithInstrument = props.entries.filter(entry => entry.instrument);

    useEffect(() => {
        if (open) {
            trigInfonline(guessInfonlineSection(), "edit_single_value");
        }
    }, [open])

    return (
        <>
            <div className="top d-flex justify-content-center" onClick={() => handleModalOpen(true)}>
                {props.children}
            </div>
            <Modal show={open} onHide={() => handleModalOpen(false)} size="lg" className="modal-background modal-dialog-sky-placement">
                <ModalHeaderMeinFinanztreff titleClassName="font-weight-normal fs-13px" title={<span style={{ fontFamily: "Roboto" }}>{props.portfolio.real && <span className="text-orange font-weight-bold mr-1">Real-Portfolio</span>}{props.portfolio.name} - Einzelposition</span>} close={() => handleModalOpen(false)} />
                <ExposeModalBodyAndFooter realportfolio={props.realportfolio} index={props.index} entries={portfolioEntriesWithInstrument} portfolio={props.portfolio} refreshTrigger={props.refreshTrigger} handleClose={() => handleModalOpen(false)} />
            </Modal>
        </>
    );
}

function ExposeModalBody(props: {
    index: number, entries: PortfolioEntry[], refreshTrigger: () => void, portfolio: Portfolio, handleClose: () => void,
    realportfolio?: boolean
}) {
    const incomeEntry = props.entries[props.index];
    const [entry, setEntry] = useState<PortfolioEntry>(incomeEntry);
    if (incomeEntry !== entry) {
        setEntry(incomeEntry)
    }
    return (
        <>
            <EntryInfoRow entry={entry} />
            {(!(props.portfolio.real && props.realportfolio)) && //temprary realportoflio, delete true
                <ButtonsRow entry={entry} refreshTrigger={props.refreshTrigger} portfolio={props.portfolio} handleClose={props.handleClose} />
            }
            <EntryDetailsTable entry={entry} portfolio={props.portfolio} />
            <EditMemoModal entry={entry} portfolio={props.portfolio} onComplete={props.refreshTrigger} />
        </>
    );
}

function ExposeModalBodyAndFooter(props: {
    realportfolio?: boolean, index: number, entries: PortfolioEntry[], refreshTrigger: () => void, handleClose: () => void, portfolio: Portfolio
}) {
    const [index, setIndex] = useState<number>(props.index);
    const previousEntry = () => {
        if (props.entries[index - 1])
            trigInfonline(guessInfonlineSection(), "edit_single_value");
        setIndex(prevState => prevState - 1);
    }
    const nextEntry = () => {
        if (props.entries[index + 1])
            trigInfonline(guessInfonlineSection(), "edit_single_value");
        setIndex(prevState => prevState + 1);
    }

    return (
        <>
            <Modal.Body className="bg-white" >
                <Container className="px-0">
                    <ExposeModalBody realportfolio={props.realportfolio} index={index} entries={props.entries} refreshTrigger={props.refreshTrigger} portfolio={props.portfolio} handleClose={props.handleClose} />
                </Container>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="link" disabled={index === 0} onClick={previousEntry}>
                    <span className="prev-arrow svg-icon">
                        <img src="/static/img/svg/icon_direction_left_dark_big.svg" width="10" alt="" className="" />
                    </span>
                </Button>
                <span className="font-weight-bold text-gray">
                    {index + 1} von {props.entries.length}
                </span>
                <Button variant="link" disabled={index >= props.entries.length - 1} onClick={nextEntry}>
                    <span className="next-arrow svg-icon">
                        <img src="/static/img/svg/icon_direction_right_dark_big.svg" width="10" alt="" className="" />
                    </span>
                </Button>
            </Modal.Footer>
        </>
    );

}

function ButtonsRow({ entry, portfolio, refreshTrigger, handleClose }: { entry: PortfolioEntry, portfolio: Portfolio, refreshTrigger: () => void, handleClose: () => void }) {
    const dividendSpilEnabled = entry.instrument?.group.assetGroup === AssetGroup.Share ||
        entry.instrument?.group.assetGroup === AssetGroup.Etf ||
        entry.instrument?.group.assetGroup === AssetGroup.Bond ||
        entry.instrument?.group.assetGroup === AssetGroup.Fund;

    return (
        <Row className="mb-1 py-xl-2 py-lg-2 py-md-3 py-sm-3 px-3 justify-content-between">
            <Col xl={6} lg={6} className="px-0 d-xl-block d-lg-block d-md-none d-sm-none">
                <EditEntryModal portfolio={portfolio} entry={entry} onComplete={refreshTrigger} />
                {dividendSpilEnabled &&
                    <DevidendEntriesModal portfolio={portfolio} entry={entry} onComplete={refreshTrigger} />
                }
                {dividendSpilEnabled &&
                    <SplitAssetModal portfolio={portfolio} entry={entry} onComplete={refreshTrigger} />
                }
                <RemovePositionModal portfolio={portfolio} entry={entry} refreshTrigger={refreshTrigger} handleClose={handleClose} >
                    <Button variant="pink" className="px-2 mb-0" >
                        <img src="/static/img/svg/icon_close_white.svg" width="12" className="" alt="" />
                    </Button>
                </RemovePositionModal>
            </Col>
            <Col xl={6} lg={6} md={6} sm={6} className="px-0 d-xl-none d-lg-none d-md-block d-sm-block">
                <EditEntryMobileButton portfolio={portfolio} entry={entry} refreshTrigger={refreshTrigger} handleClose={handleClose} />
            </Col>
            <Col xl={3} lg={3} className="px-0 d-xl-block d-lg-block d-md-none d-sm-none">
                <CopyAssetToOtherPortfolio portfolio={portfolio} entry={entry} refreshTrigger={refreshTrigger} handleClose={handleClose} />
            </Col>
            <Col xl={3} lg={3} md={6} sm={6} className="px-0 text-right">
                <span className="">
                    <PurchaseAssetModal portfolio={portfolio} entry={entry} onComplete={refreshTrigger} >
                        <Button variant="green" className="text-white">Zukauf</Button>
                    </PurchaseAssetModal>
                </span>
                <span className="pl-2">
                    <SaleAssetModal portfolio={portfolio} entry={entry} onComplete={refreshTrigger} >
                        <Button variant="pink" className="text-white">Verkauf</Button>
                    </SaleAssetModal>
                </span>
            </Col>
        </Row>
    );

}

function EntryDetailsTable({ entry, portfolio }: { entry: PortfolioEntry, portfolio: Portfolio }) {
    const currencyCode = entry && entry.instrument ? getCurrencyCode(entry) : "";
    const [initial, yesterday, last] = calculatePortfolioEntry(entry);
    const initialInPositionCurrency = calculateEntryTotalInPositionCurrency(entry);
    const [diff, diffPct] = calculateChange(initial, last);
    const [diffDaily, diffDailyPct] = calculateChange(yesterday, last);

    let [purchasePrice, income, priceGain, totalInPortoflio] = totalPortfolioList(portfolio);
    const percentOfPortfolio: number = last / totalInPortoflio * 100;
    const ertrage: number = calculatePortfolioEntryErtrage(portfolio, entry);
    const dividendIncomesEntries = getDividendsIncome(portfolio, entry);
    const ertragePct: number = initial > 0 ? (ertrage / initial) * 100 : 0;
    const totalDiff: number = diff + ertrage;
    const totalPct: number = (diffPct + ertragePct);
    const quantity: number = entry.quantity;

    const quote = getSnapQuote(entry);

    return (
        <>
            <Row className="pt-1 mt-xl-2 mt-lg-2 mt-md-0 mt-sm-0 mx-xl-n3 mx-lg-n4 mx-md-n4 mx-sm-n4">
                <Col xl={6} lg={6} md={6} sm={12}>
                    <Row className="fs-14px" xl={2} lg={2} md={2} sm={2}>
                        <Col className="pr-1 pb-2">
                            <div className="border-1 border-gray-light px-2 py-1">
                                <div className="text-truncate">Kaufdatum</div>
                                <div className="font-weight-bold">{REALDATE_FORMAT(entry.entryTime)}</div>
                            </div>
                        </Col>
                        <Col className="pl-1 pb-2">
                            <div className="border-1 border-gray-light px-2 py-1">
                                <div className="text-truncate">Stück</div>
                                <div className="font-weight-bold">{quantity}</div>
                            </div>
                        </Col>
                        <Col className="pr-1 pb-2">
                            <div className="border-1 border-gray-light px-2 py-1">
                                <div className="text-truncate">Kaufkurs</div>
                                <div className="font-weight-bold d-flex justify-content-between">
                                    <span>{numberFormat(entry.price)} {entry.instrument?.currency.displayCode}</span>
                                    <span className="mr-2">{entry.instrument?.exchange.code}</span>
                                </div>
                            </div>
                        </Col>
                        <Col className="pl-1 pb-2">
                            <div className="border-1 border-gray-light px-2 py-1">
                                <div className="text-truncate">Spesen</div>
                                <div className="font-weight-bold">{shortNumberFormat(entry.buyCharges)} EUR</div>
                            </div>
                        </Col>
                        <Col className="pr-1 pb-2">
                            <div className="border border-border-gray px-2 py-1">
                                <div className="text-truncate">Kaufsumme</div>
                                <div className="font-weight-bold">{numberFormat(initialInPositionCurrency)} {currencyCode}</div>
                            </div>
                        </Col>
                        <Col className="pl-1 pb-2">
                            <div className="border border-border-gray px-2 py-1 position-relative">
                                <div className="text-truncate">Portfolio-Gewichtung</div>
                                <div className="font-weight-bold">{numberFormat(percentOfPortfolio)}%</div>
                                <div className={classNames("bg-" + entry.instrument?.group.assetGroup)}
                                    style={{ width: percentOfPortfolio + "%", position: "absolute", left: "0px", height: "3px" }}></div>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col xl={6} lg={6} md={6} sm={12} className="pl-xl-0 pl-lg-0 pl-sm-3">
                    <div className="border-1 border-gray-light px-2 py-1">
                        {dividendIncomesEntries && dividendIncomesEntries.length > 0 &&
                            <Accordion>
                                <Card className="border-0">
                                    <Accordion.Toggle eventKey="0" className="px-0 fs-14px text-decoration-none border-0 bg-white">
                                        <div className="d-flex justify-content-between">
                                            <div className="text-blue" id="headingErtrage" data-toggle="collapse"
                                                data-target="#collapseErtrage" aria-expanded="false" aria-controls="collapseErtrage">
                                                Erträge
                                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_blue_light.svg"} className="toggle-icon mt-n1" alt="Dropdown arrow down" width="30" />
                                            </div>
                                            <div className={getTextColorByValue(ertrage)}>
                                                <span className="w-25 mr-5">{numberFormatWithSign(ertrage)} EUR </span>
                                                <span>{numberFormatWithSign(ertragePct)} %</span>
                                            </div>
                                        </div>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0" className="accordion-content">
                                        <Card.Body className="mb-2">
                                            {
                                                dividendIncomesEntries.map((current, index) => {
                                                    return (
                                                        <Row className="fs-13px" key={index}>
                                                            <Col>{REALDATE_FORMAT(current.entryTime)}</Col>
                                                            <Col>{current.accountTypeDescriptionEn}</Col>
                                                            <Col className={classNames(getTextColorByValue(current.amount), "text-right")}>{numberFormatWithSign(current.amount, " EUR")}</Col>
                                                        </Row>
                                                    );
                                                })
                                            }

                                        </Card.Body>

                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        }
                        {dividendIncomesEntries.length == 0 &&
                            <Row className="fs-13px mx-0">
                                <Col className="px-0">Erträge</Col>
                                <Col className={classNames(getTextColorByValue(ertrage), "text-right px-0")}>
                                    {numberFormatWithSign(ertrage, " EUR")}
                                </Col>
                                <Col className={classNames(getTextColorByValue(ertragePct), "text-right px-0")}>
                                    {numberFormatWithSign(ertragePct, ' %')}
                                </Col>
                            </Row>
                        }
                        <Row className="fs-13px mx-0">
                            <Col className="px-0">Kursgewinn</Col>
                            <Col className={classNames(getTextColorByValue(diff), "text-right px-0")}>
                                {numberFormatWithSign(diff, " EUR")}
                            </Col>
                            <Col className={classNames(getTextColorByValue(diffPct), "text-right px-0")}>
                                {numberFormatWithSign(diffPct, ' %')}
                            </Col>
                        </Row>
                        <Row className="fs-15px font-weight-bold mx-0">
                            <Col className="px-0">Gesamt</Col>
                            <Col className={classNames(getTextColorByValue(totalDiff), "text-right px-0")}>
                                {numberFormatWithSign(totalDiff, " EUR")}
                            </Col>
                            <Col className={classNames(getTextColorByValue(totalPct), "text-right px-0")}>
                                {numberFormatWithSign(totalPct, ' %')}
                            </Col>
                        </Row>
                    </div>
                    <Row className="fs-14px border-1 border-gray-light px-2 my-2 mx-0">
                        <Col className="px-0">Heute</Col>
                        <Col className={classNames(getTextColorByValue(diffDaily), "text-right px-0")}>
                            {formatPriceWithSign(diffDaily, entry?.instrument?.group?.assetGroup, quote?.value, "EUR")}
                        </Col>
                        <Col className={classNames(getTextColorByValue(diffDailyPct), "text-right px-0")}>
                            {numberFormatWithSign(diffDailyPct, ' %')}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

function AssetInfoRow({ instrument, snapQuote }: { instrument: Instrument, snapQuote: SnapQuote }) {
    const assetType: string = getAssetGroup(instrument.group.assetGroup);
    const quote = snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);

    return (
        <>
            <div className="d-xl-flex d-lg-flex d-md-none d-sm-none align-items-center">
                <AssetLinkComponent instrument={instrument} size={30} className="fs-22px" />
                <span className={classNames("asset-type-tag ml-3", instrument.group.assetGroup)}>{assetType}</span>
            </div>
            <div className="fs-13px d-xl-flex d-lg-flex d-md-block">
                <div>
                    <span className="mr-2"><span className="font-weight-bold">WKN</span> {instrument.wkn}</span>
                    <span className="mr-2"><span className="font-weight-bold">ISIN</span> {instrument.isin}</span>
                </div>
                <div>
                    {
                        quote &&
                        <>
                            <span className="">
                                {quote.delay === 1 ?
                                    <span className="bg-orange text-white px-2 fs-11px align-middle">RT</span> : <span className="bg-gray-dark text-white px-2 fs-11px align-middle">+15</span>
                                }
                            </span>
                            <span className="mr-2"> {formatPrice(quote.value, instrument?.group?.assetGroup, quote.value, instrument?.currency?.displayCode)}
                                {
                                    quote.percentChange && quote.percentChange > 0 ?
                                        <img src="/static/img/svg/icon_arrow_short_up_green.svg" alt="" width="10" className="mb-1 ml-1" />
                                        : quote.percentChange && quote.percentChange < 0 ?
                                            <img src="/static/img/svg/icon_arrow_short_down_red.svg" alt="" width="10" className="mb-1 ml-1" />
                                            : quote.percentChange && <img src="/static/img/svg/icon_arrow_short_right_grey.svg" alt="" width={20} className="mb-1" />
                                }
                            </span>
                            <span className={classNames("mr-2", getTextColorByValue(quote.percentChange))}>{numberFormatWithSign(quote.percentChange, " %")}</span>
                            <span className=""> {quoteFormat(quote.when)}</span>
                        </>
                    }
                </div>
            </div>
        </>
    )

}

function EntryInfoRow({ entry }: { entry: PortfolioEntry }) {
    const assetType: string = getAssetGroup(entry.instrument?.group.assetGroup);
    return (
        <>
            <div className="border-top-1 border-bottom-3 border-gray-light py-2">

                <div className="d-xl-none d-lg-none d-md-flex d-sm-flex align-items-center justify-content-between">
                    <AssetLinkComponent instrument={entry.instrument} size={25} className="fs-22px" />
                    <span className={classNames("asset-type-tag ml-3", entry.instrument?.group.assetGroup)}>{assetType}</span>
                </div>
                <div className="d-flex justify-content-between">
                    <div>
                        {entry.instrument && entry.snapQuote &&
                            <AssetInfoRow instrument={entry.instrument} snapQuote={entry.snapQuote} />
                        }
                    </div>
                    <div className="d-flex align-items-center mr-n3">
                        {entry.instrument?.isin ?
                            <NewsModalMeinFinanztreff isins={[entry.instrument.isin]} />
                            :
                            <Button variant="link" disabled={true}>
                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_news.svg"} className="svg-convert" alt="" width={25} />
                            </Button>
                        }
                        <span className="ml-n3 pb-1" >
                            <InstrumentLimits instrumentId={entry.instrumentId || 0} instrumentGroupId={entry.instrumentGroupId || undefined}
                                svgColor="dark" innerModal={true} />
                        </span>
                    </div>
                </div>
            </div>
        </>
    );

}


interface MainSeetingsModalProps {
    portfolio: Portfolio
    entries: PortfolioEntry[]
    children: ReactNode
    index: number
    realportfolio?: boolean
    refreshTrigger: () => void;
}

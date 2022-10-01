import classNames from "classnames";
import moment from "moment";
import { Col, Container, Row, Button } from "react-bootstrap";
import { QuoteType, LimitEntry } from "../../../generated/graphql";
import { formatPrice, getTextColorByValue, numberFormatWithSign, quoteFormat, numberFormat, formatPriceWithSign } from "../../../utils";
import SvgImage from "../../common/image/SvgImage";
import { AssetLinkComponent } from "../common/AssetLinkComponent";
import { NewsModalMeinFinanztreff } from "../modals/NewsModal/NewsModalMeinFinanztreff";
import { ProfileImportProcess } from "../modals/profile-import/ProfileImportProcess";
import { CopyWKN } from "../portfolio/PortfolioExposeNewPage/TableViews/SimpleViewTable";
import { filterLimits, getAssetGroup } from "../utils";
import { getPercentOfChange } from "./LimitChartComponent";
import { LimitEditDelete } from "./LimitsBanner/LimitEditDelete";
import { LimitsAdd } from "./LimitsBanner/LimitsAdd";

export function LimitsTableComponent(props: LimitsGridComponentProps) {

    let limits = filterLimits(props.limits, props.isActive, props.isUpper, props.sort.sortType, props.sort.direction).filter((current: LimitEntry) => current.initialValue && current.instrument);

    function ColumnName({ size, name, className }: { size?: number, name: string, className?: string }) {
        function setEntriesOrder(order: string) {
            props.handleSort({ id: order, name: order }, props.sort.sortType === order ? !props.sort.direction : true);
        }
        return (
            <Col xs={size} onClick={() => setEntriesOrder("Table" + name)} className={classNames("text-blue fs-15px cursor-pointer", name === "Abstand zum Limit" ? "" : "text-nowrap", className)}>
                {name}
                {props.sort.sortType === "Table" + name && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!props.sort.direction ? { transform: "rotate(180deg)" } : {}} />}
            </Col>
        )
    }

    return (
        <>
            <Container className="bg-white p-3 overflow-auto mt-3" style={{ boxShadow: "#00000029 0px 3px 6px" }}>
                <Container className="overflow-auto" style={{ maxWidth: "1216px", width: "1216px" }}>
                    <Row className="bg-gray-light py-2">
                        <Col xs={3} className="">
                            <Row><ColumnName className="font-weight-bold" name="Bezeichnung" /></Row>
                            <Row><ColumnName size={4} className="fs-13px" name="Gattung" /> <Col className="fs-13px" xs={8}> WKN </Col></Row>
                        </Col>
                        <Col xs={2} className="">
                            <Row><ColumnName className="font-weight-bold" name="Kurs aktuell" /></Row>
                            <Row><ColumnName size={4} name="Zeit" className="fs-13px" /> <ColumnName size={4} className="text-right fs-13px" name="Börse" /></Row>
                        </Col>
                        <Col xs={2} className="text-right pr-0">
                            <Row><ColumnName className="font-weight-bold" name="Limit absolut" /></Row>
                            <Row><ColumnName className="font-weight-bold" name="Limit %" /></Row>
                        </Col>
                        <ColumnName size={1} name="Art" className="text-left pr-0 font-weight-bold" />
                        <ColumnName size={1} name="Abstand zum Limit" className="text-center pr-2 pl-0 font-weight-bold" />
                        <ColumnName size={1} name="Status" className="text-left font-weight-bold" />
                        <Col xs={1}></Col>
                    </Row>
                    {limits.map((entry, index) => {
                        const assetType: string = getAssetGroup(entry?.instrument?.group.assetGroup);

                        const quote = entry && entry.instrument && entry.instrument.snapQuote && entry.instrument.snapQuote.quotes.find(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue);
                        const oldAssetNoTradding = moment().subtract(10, "d").isAfter(moment(quote && quote.when)) || !quote;
                        let delay = quote && quote?.delay && quote?.delay > 1 ? 15 : 1;
                        const showInPercent = entry.percent || entry.trailing;
                        const percentToTarger = entry.hitStatus ? 0 : entry.effectiveLimitValue && entry.effectiveLimitValue > 0 && quote && quote.value ? (Math.abs(Math.abs(entry.effectiveLimitValue - quote.value) / quote.value) * 100) : 0;
                        return (
                            <>
                                <Row key={index} className="border-bottom-1 border-gray-light align-items-center py-1">
                                    <Col xs={3} className="text-left text-nowrap">
                                        <Row>
                                            <Col>
                                                {oldAssetNoTradding && <img className="align-middle" style={{ marginTop: "-4px" }}
                                                    src={process.env.PUBLIC_URL + "/static/img/svg/icon_alert_red.svg"}
                                                    width="20"
                                                    alt="search news icon" />
                                                }
                                                <AssetLinkComponent instrument={entry.instrument} className="font-weight-bold fs-14px" size={37} />
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
                                    <Col xs={2} className="text-left font-weight-bold pr-0 text-nowrap py-1 fs-14px">
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
                                                <span className="px-1">{quote && quote.value && formatPrice(quote.value, entry.instrument?.group.assetGroup)} {entry.instrument?.currency.displayCode || ""}</span>
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
                                                <span className={classNames("pl-2", getTextColorByValue(quote?.percentChange))}>{formatPriceWithSign(quote?.percentChange, entry.instrument?.group.assetGroup,quote?.value, "%")}</span>
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
                                    <Col xs={2} className="text-right fs-14px pl-0 font-weight-bold">
                                        {showInPercent ?
                                            <>
                                                <Row className={classNames("justify-content-end", entry.upper ? "text-green" : "text-pink")}>
                                                    <Col className="text-right px-0">
                                                        {formatPrice(entry.effectiveLimitValue, entry.instrument?.group.assetGroup) + " " + entry.instrument?.currency.displayCode || ""}
                                                    </Col>
                                                </Row>
                                                <Row className={classNames("text-white justify-content-end")}>
                                                    <span className={classNames("px-2 rounded", entry.upper ? "bg-green" : "bg-pink")}>
                                                        {entry.upper ?
                                                            <SvgImage icon="icon_limit_top_white.svg" width="24" />

                                                            :
                                                            <SvgImage icon="icon_limit_bottom_white.svg" width="24" />
                                                        }
                                                        {formatPriceWithSign(entry.limitValue)} %
                                                    </span>
                                                </Row>
                                            </>
                                            :

                                            <>
                                                <Row className={classNames("text-white justify-content-end")}>
                                                    <span className={classNames("px-2 rounded", entry.upper ? "bg-green" : "bg-pink")}>
                                                        {entry.upper ?
                                                            <SvgImage icon="icon_limit_top_white.svg" width="24" />

                                                            :
                                                            <SvgImage icon="icon_limit_bottom_white.svg" width="24" />
                                                        }
                                                        {formatPrice(entry.limitValue, entry.instrument?.group.assetGroup)} {entry.instrument?.currency.displayCode || ""}
                                                    </span>
                                                </Row>
                                                <Row className={classNames("justify-content-end", entry.upper ? "text-green" : "text-pink")}>
                                                    <Col className="text-right pr-0">
                                                        {entry.effectiveLimitValue ?

                                                            formatPriceWithSign(getPercentOfChange(entry.effectiveLimitValue, entry.initialValue || 1), entry.instrument?.group.assetGroup) + "%"
                                                            :
                                                            entry.effectiveLimitValue === 0 ? "-100%" : "-"
                                                        }
                                                    </Col>
                                                </Row>
                                            </>
                                        }
                                    </Col>
                                    <Col xs={1}>
                                        {entry.trailing ?
                                            <SvgImage icon="icon_repeat.svg" width="20" />
                                            :
                                            entry.percent ?
                                                <SvgImage icon="icon_percent.svg" width="20" />
                                                :
                                                <SvgImage icon="icon_absolute.svg" width="20" />
                                        }
                                    </Col>
                                    <Col xs={1} className="text-center fs-14px">
                                        {formatPrice(percentToTarger)}%
                                    </Col>
                                    <Col xs={2} className="pl-2 pr-n2">
                                        <Row className="pl-1 align-items-center">
                                            <Col xs={2} className="pl-0">
                                                {entry.hitStatus ?
                                                    <img src="/static/img/svg/icon_alert_red.svg" className="svg-convert cursor-default" width="32" alt="" />
                                                    :
                                                    entry.instrument?.snapQuote &&
                                                    <div className="pulse mb-n3"></div>
                                                }
                                            </Col>
                                            <Col xs={10} className="fs-12px pl-2 pr-0">
                                                {entry.upper ?
                                                    <span className="text-green font-weight-bold">Oberes Limit</span>
                                                    :
                                                    <span className="text-pink font-weight-bold">Unteres Limit</span>
                                                }
                                                {entry.hitStatus ?
                                                    <span> am {quoteFormat(entry.hitTime)} <b>durchbrochen</b></span>
                                                    :
                                                    <span> noch nicht durchbrochen </span>
                                                }
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={1} className="text-right px-0 ml-n3">
                                        <Row className="align-items-center justify-content-end">
                                            {entry.instrument?.isin ?
                                                <div className="pt-1">
                                                    <NewsModalMeinFinanztreff isins={[entry.instrument.isin]} />
                                                </div>
                                                :
                                                <Button variant="link px-0 pl-n1 pr-1 pb-n1" className="" disabled>
                                                    <SvgImage icon={"icon_news.svg"} convert={false} width="26" />
                                                </Button>
                                            }
                                            <LimitEditDelete
                                                limit={entry}
                                                refreshTrigger={props.refetch}
                                                variant="link" className="text-white"
                                            >
                                                <SvgImage icon={"icon_menu_horizontal_blue.svg"} spanClass="cursor-pointer" className="ml-n3" convert={false} width="27" />
                                            </LimitEditDelete>
                                        </Row>
                                    </Col>
                                    <Col xs={12}>

                                        {props.showMemo && !!entry.memo && entry.memo.length > 0 &&
                                            <Row>
                                                <span className="svg-icon">
                                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_note.svg"} width="28" alt="" className="" />
                                                </span>
                                                <span className="pl-2" ><i>{entry.memo}</i></span>
                                            </Row>

                                        }
                                    </Col>
                                </Row>
                            </>
                        )
                    })}
                </Container>
                <Container>

                    <Row className="justify-content-xl-end justify-content-sm-start pt-3">
                        <span className="pl-2">
                            <ProfileImportProcess>
                                <span className="svg-icon live-portfolio-icon">
                                    <img src="/static/img/svg/icon_liveportfolio_white_dark.svg" className="mr-2" alt="" />
                                </span>
                                <span className="mb-n1">finanztreff.de Limits importieren</span>
                            </ProfileImportProcess>
                        </span>
                        <span className="pl-2 mt-md-0 mt-sm-2">
                            <LimitsAdd
                                refreshTrigger={() => props.refetch()}
                                variant="primary" className="text-white py-0 px-3">
                                <span className="svg-icon action-icons d-flex py-0">
                                    <SvgImage icon="icon_add_limit_white.svg" convert={false} width="26" imgClass="ml-n2 mr-1" />
                                    <span className="d-flex mt-1">Limit hinzufügen</span>
                                </span>
                            </LimitsAdd>
                        </span>
                    </Row>
                </Container>
            </Container>
            <Container className="fs-13px px-1 pt-2">
                <span className="pr-4">
                    <SvgImage icon="icon_absolute.svg" width="20" className="pr-2" /> Absolutes Limit
                </span>
                <span className="pr-4">
                    <SvgImage icon="icon_percent.svg" width="20" className="pr-2" /> Relatives Limit
                </span>
                <span className="">
                    <SvgImage icon="icon_repeat.svg" width="20" className="pr-2" /> Trailing Limit (Zahl gibt an wie oft getroffen)
                </span>
            </Container>
        </>

    );

}
interface LimitsGridComponentProps {
    showMemo: boolean
    sort: { sortType: string, direction: boolean }
    handleSort: (value: { id: string, name: string }, order: boolean) => void;
    limits: LimitEntry[];
    refetch: () => void;
    description?: string;
    direction?: boolean;
    inModal?: boolean;
    isUpper?: boolean;
    isActive?: boolean;
}

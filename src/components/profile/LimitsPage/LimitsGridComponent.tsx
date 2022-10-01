import classNames from "classnames";
import SvgImage from "components/common/image/SvgImage";
import { LimitEntry, QuoteType } from "generated/graphql";
import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { formatPrice, fullDateTimeFormat, numberFormat } from "utils";
import { AssetLinkComponent } from "../common/AssetLinkComponent";
import { ProfileImportProcess } from "../modals/profile-import/ProfileImportProcess";
import { filterLimits, getAssetGroup, getColorOfAssetGroup } from "../utils";
import { LimitChartComponent } from "./LimitChartComponent";
import { LimitEditDelete } from "./LimitsBanner/LimitEditDelete";
import { LimitsAdd } from "./LimitsBanner/LimitsAdd";

export function LimitsGridComponent(props: LimitsGridComponentProps) {

    const [showMemo, setShowMemo] = useState(props.showMemo);
    useEffect(() => {
        setShowMemo(props.showMemo);
    }, [props.showMemo]);


    if (props.limits.length === 0) {
        return (<>
            <h5 className="d-flex justify-content-center mt-30px">Keine limits gefunden!</h5>
            {!props.inModal &&
                <Col xl={4} lg={6} xs={12} className="p-2">
                    <Container className="content-wrapper pt-2 portfolio-card-height mt-0" key={-1}>
                        <Row className="py-5 border-bottom-2 border-gray-light ">
                            <Col className="text-center">
                                <LimitsAdd
                                    refreshTrigger={() => props.refetch()}
                                    variant="primary" className="text-white py-0 px-3">
                                    <span className="svg-icon action-icons d-flex py-0">
                                        <SvgImage icon="icon_add_limit_white.svg" convert={false} width="25" imgClass="ml-n1" />
                                        <span className="d-flex mt-1">Neues Limit <span className="d-none d-md-block pl-1"> anlegen</span></span>
                                    </span>
                                </LimitsAdd>
                            </Col>
                        </Row>
                        <Row className="line-height-1 mt-3 fs-15px">
                            <Col className="text-center">Hier können Sie Ihre bestehenden Limits<br /> aus dem "alten" finanztreff importieren:</Col>
                        </Row>
                        <Row className="mt-3">
                            <Col className="text-center">
                                <ProfileImportProcess>
                                    <span className="svg-icon live-portfolio-icon">
                                        <img src="/static/img/svg/icon_liveportfolio_white_dark.svg" className="mr-2" alt="" />
                                    </span>
                                    <span>Limits importieren</span>
                                </ProfileImportProcess>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            }
        </>);
    }

    let limits = filterLimits(props.limits, props.isActive, props.isUpper, props.description, props.direction);

    return (

        <div className="content-row meine-finanztreff-cards">

            <div className="row row-cols-xl-3 row-cols-lg-2 row-cols-sm-1 gutter-xl-8 px-2">
                {limits.filter((current: LimitEntry) => current.initialValue && current.instrument).map((limit: LimitEntry, index: number) => {
                    const quote = limit && limit.instrument && limit.instrument.snapQuote && limit.instrument.snapQuote.quotes && limit.instrument.snapQuote.quotes.filter(current => current?.type === QuoteType.Trade || QuoteType.NetAssetValue)[0];
                    const percentToTarger = limit.effectiveLimitValue && limit.effectiveLimitValue > 0 && quote && quote.value ? (Math.abs(Math.abs(limit.effectiveLimitValue - quote.value) / quote.value)*100) : 0;
                    return (
                        <div className="limit-card-item px-2" key={index}>
                            <div className={classNames("content-wrapper card-wrapper mt-3", (!limit.instrument || (limit.instrument && !limit.instrument.snapQuote)) && "bg-gray-light")}>
                                <div className="content">
                                    <div className="data-wrapper d-flex justify-content-between">
                                        <span className="font-weight-bold fs-18px text-truncate">
                                            {limit.instrument?.snapQuote ?
                                                <AssetLinkComponent instrument={limit.instrument} className="font-weight-bold" size={23} />
                                                :
                                                <>{limit.instrument?.name}</>
                                            }
                                        </span>
                                        {limit.instrument && limit.instrument?.group.assetGroup &&
                                            <span className={"asset-type-tag pb-n3"} style={{ backgroundColor: getColorOfAssetGroup(limit.instrument?.group.assetGroup) }}>
                                                {getAssetGroup(limit.instrument?.group.assetGroup)}
                                            </span>
                                        }
                                    </div>
                                    <div className="w-100">
                                        <LimitChartComponent variant={'lg'} className={'mt-2 mb-3'}
                                            exchangeName={limit.instrument?.exchange.name || ""}
                                            effectiveLimitValue={limit.effectiveLimitValue || undefined}
                                            assetGroup={limit.instrument?.group.assetGroup || undefined}
                                            date={limit.initialTime}
                                            currentPrice={quote?.value || undefined}
                                            targetPrice={limit.limitValue || 0}
                                            referencePrice={limit.initialValue || 0}
                                            trailing={limit.trailing || false}
                                            percent={limit.percent || false}
                                            hitStatus={limit.hitStatus || false}
                                            quoteDate={quote?.when || ""}
                                            percentChange={quote?.percentChange || undefined}
                                            currencyCode={limit.instrument?.currency.alphaCode || ""}
                                            upper={limit.upper || undefined}
                                        />
                                    </div>
                                    <div style={{ fontSize: "13px" }} className="limit-condition text-truncate">
                                        {limit.hitStatus ?
                                            <>
                                                <span className={classNames("font-weight-bold", limit.upper ? "text-green" : "text-pink")}> {limit.upper ? "Oberes " : "Unteres "} Limit </span>
                                                am {fullDateTimeFormat(limit.hitTime)} <b> durchbrochen</b>
                                            </>
                                            :
                                            <>Abstand zum Limit: <b>{formatPrice(percentToTarger, limit.instrument?.group.assetGroup, quote?.value , "%")}</b>.</>
                                        }

                                    </div>
                                    {(props.showMemo && showMemo && !!limit.memo && limit.memo.length > 0) &&
                                        <div className="pt-2 d-flex">
                                            <span className="svg-icon">
                                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_note.svg"} width="28" alt="" className="" />
                                            </span>
                                            <span className="pl-2" ><i>{limit.memo}</i></span>
                                        </div>
                                    }
                                    <div className="actions-wrapper">
                                        <LimitEditDelete
                                            limit={limit}
                                            refreshTrigger={props.refetch}
                                            variant="link" className="text-white"
                                        >
                                            <div className="three-dots">
                                                <div className="bg-blue"></div>
                                                <div className="bg-blue"></div>
                                                <div className="bg-blue"></div>
                                            </div>
                                        </LimitEditDelete>
                                        {limit.hitStatus ?
                                            <div>
                                                <div className=" news">
                                                    <span className="icon-news svg-icon top-move active">
                                                        <img src="/static/img/svg/icon_alert_red.svg" className="svg-convert cursor-default" width="32" alt="" />
                                                    </span>
                                                </div>
                                            </div>
                                            :
                                            limit.instrument?.snapQuote &&
                                            <div className="bottom">
                                                <div className=" news">
                                                    <div className="pulse"></div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                )}
                {!props.inModal &&
                    <Col xl={4} lg={6} xs={12} className="py-3 px-2">
                        <Container className="content-wrapper pt-2 lollipop-card mt-0" key={-1}>
                            <Row className="py-4 border-bottom-2 border-gray-light ">
                                <Col className="text-center py-2">
                                    <LimitsAdd
                                        refreshTrigger={() => props.refetch()}
                                        variant="primary" className="text-white py-0 px-3">
                                        <span className="svg-icon action-icons d-flex py-0">
                                            <SvgImage icon="icon_add_limit_white.svg" convert={false} width="25" imgClass="ml-n1" />
                                            <span className="d-flex mt-1">Neues Limit <span className="d-none d-md-block pl-1"> anlegen</span></span>
                                        </span>
                                    </LimitsAdd>
                                </Col>
                            </Row>
                            <Row className="line-height-1 mt-3 fs-15px">
                                <Col className="text-center">Hier können Sie Ihre bestehenden Limits<br /> aus dem "alten" finanztreff importieren:</Col>
                            </Row>
                            <Row className="mt-4 pb-2">
                                <Col className="text-center" style={{ paddingBottom: "6px" }}>
                                    <ProfileImportProcess>
                                        <span className="svg-icon live-portfolio-icon">
                                            <img src="/static/img/svg/icon_liveportfolio_white_dark.svg" className="mr-2" alt="" />
                                        </span>
                                        <span>Limits importieren</span>
                                    </ProfileImportProcess>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                }
            </div>
        </div>
    )

}

interface LimitsGridComponentProps {
    showMemo: boolean
    limits: LimitEntry[];
    refetch: () => void;
    description?: string;
    direction?: boolean;
    inModal?: boolean;
    isUpper?: boolean;
    isActive?: boolean;
}
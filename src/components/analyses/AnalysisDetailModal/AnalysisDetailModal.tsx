import {Analysis, AnalysisRecommendation, SnapQuote} from 'graphql/types';
import {Col, Modal, Row} from 'react-bootstrap';
import classNames from "classnames";
import {useViewport} from 'hooks/useViewport';
import {calculateDaysWithTimeFrame, formatDate, getAssetLink, getFinanztreffAssetLink, numberFormat} from 'utils';
import {Link} from 'react-router-dom';
import {AnalysisDetailModalHistoryComponent} from "./AnalysisDetailModalHistoryComponent";
import './AnalysisDetailModal.scss';
import {AnalysisProgressChartComponent} from "../AnalysisProgressChartComponent/AnalysisProgressChartComponent";
import {useEffect} from "react";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

interface AnalysisModalProps {
    analysis: Analysis;
    snapQuote?: SnapQuote;
    currencyCode?: string;
    isOpen: boolean;
    closeModal: () => void;
}

export function AnalysisDetailModal(props: AnalysisModalProps) {
    let { width } = useViewport();
    let days = calculateDaysWithTimeFrame(props.analysis.date, props.analysis.timeFrame || undefined);

    useEffect(() => {
        if (props.isOpen) {
            trigInfonline(guessInfonlineSection(), "analysen_modal")
        }
    }, [props.isOpen])

    let referencePrice = props.analysis.referencePrice;
    let currentPrice ;
    if (props?.snapQuote?.quotes) {
        currentPrice = props?.snapQuote?.quotes?.find(current => current?.type === "TRADE")?.value;
    } else {
        currentPrice = props?.snapQuote?.quote?.value;
    }
    let targetPrice = props.analysis.targetPrice;
    let isPositive = null;
    if (referencePrice && targetPrice) {
        isPositive = props.analysis.recommendation === AnalysisRecommendation.Positive || (referencePrice < targetPrice);
    }
    let isTargetAchieved = null;
    if (isPositive && currentPrice && targetPrice) {
        isTargetAchieved = (( currentPrice > targetPrice && isPositive) || ( currentPrice < targetPrice && !isPositive));
    }
    return (
        <>
            <Modal show={props.isOpen} onHide={() => props.closeModal()} scrollable style={{ backgroundColor: "rgba(56, 56, 56, 0.72)" }}
                className={classNames("fade analysis-modal modal-dialog-sky-placement", width < 576 && 'bottom')} size={"lg"}
                contentClassName={"border-0"} dialogClassName={width < 576 ? "m-0" : undefined}
            >
                <Modal.Header className="border-0">
                    <div className="row row-cols-1">
                        <div className="col d-flex justify-content-between">
                            <h5 className="modal-title text-dark">
                                <img className="inactive-img"
                                     src={process.env.PUBLIC_URL + "/static/img/svg/icon_news.svg"}
                                     width="20"
                                     style={{ marginTop: "-3px" }}
                                     alt="search news icon" />Fundamentale Analyse</h5>
                            <button type="button" className="close text-blue"
                                    onClick={() => props.closeModal()}>
                                <span>schließen</span>
                                <span className="close-modal-butt svg-icon">
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_blue.svg"}
                                         alt="" width={"27"} className="svg-blue"
                                    />
                                </span>
                            </button>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className="bg-white p-0">
                    <div className="analysis-description px-3">
                        <div className={"w-100 d-flex justify-content-between flex-wrap"}>
                            <div className="font-weight-bold fs-18px text-blue text-ellipsis flex-grow-1">
                                { props.analysis.group && props.analysis.group?.name &&
                                    (props.analysis.group?.assetGroup && props.analysis.group?.seoTag ?
                                        <Link
                                            to={getFinanztreffAssetLink(props.analysis.group.assetGroup, props.analysis.group.seoTag)}
                                            className="font-weight-bold font-size-22px text-color-blue"
                                        >
                                            {props.analysis.group.name}
                                        </Link> :
                                        <div className="font-weight-bold">
                                            {props.analysis.group.name}
                                        </div>
                                    )
                                }
                            </div>
                            <div className="fs-15px line-height-42px text-nowrap">
                                Analyst:
                                <b className="text-truncate"> {props.analysis.institute?.name}</b>
                            </div>
                        </div>
                        <Row className="line-height-42px font-size-15px px-3">
                            <Col xs={12} lg={9} className={"d-flex justify-content-between px-3 bg-lighten-gray"}>
                                <span>{formatDate(props.analysis.date)}</span>
                                <span className={"text-nowrap"}>
                                    Kursziel ({props.analysis.timeFrame} M)
                                    <b className={"pl-2"}>
                                        {!!targetPrice && targetPrice > 0 ? numberFormat(targetPrice) : "-"} {props.analysis.currency?.displayCode}
                                    </b>
                                </span>
                            </Col>
                            {
                                props.analysis.recommendation === AnalysisRecommendation.Positive &&
                                <Col xs={12} lg={3} className="font-weight-bold bg-green text-white text-center h-100">POSITIV</Col>
                            }
                            {
                                props.analysis.recommendation === AnalysisRecommendation.Negative &&
                                <Col xs={12} lg={3} className="font-weight-bold bg-pink text-white text-center flex-grow-1">NEGATIV</Col>
                            }
                            {
                                props.analysis.recommendation === AnalysisRecommendation.Neutral &&
                                <Col xs={12} lg={3} className="font-weight-bold bg-yellow text-white text-center flex-grow-1">NEUTRAL</Col>
                            }
                        </Row>
                    { !!targetPrice && targetPrice > 0 && referencePrice && props.analysis.group &&
                        <AnalysisProgressChartComponent variant={'lg'} className={'mt-5 mb-3'}
                            currentPrice={currentPrice || 0} targetPrice={targetPrice} referencePrice={referencePrice}
                            percentChange={props.snapQuote?.quote?.percentChange || undefined}
                            analysisCurrencyCode={props.analysis.currency?.displayCode || ""}
                            currencyCode={props.currencyCode || ""}
                            timeFrame={props.analysis.timeFrame || undefined}
                            name={props?.analysis?.group?.name || ""}
                            url={getAssetLink(props?.analysis.group)}
                            updated={props.analysis.updated || undefined}
                        />
                    }
                    </div>
                    {!!targetPrice && targetPrice > 0
                        && <div className="py-2 px-3 mt-1 fs-15px w-100 bg-gray-dark text-white">
                            {isTargetAchieved && isPositive
                                && <span>
                                        {props.analysis.group?.name} hat das Kursziel
                                        von {numberFormat(targetPrice)} {props.analysis.currency?.displayCode} überschritten.
                                    </span>
                            }
                            {isTargetAchieved && !isPositive
                                && <span>
                                        {props.analysis.group?.name} hat das Kursziel
                                        von {numberFormat(targetPrice)} {props.analysis.currency?.displayCode} unterschritten.
                                    </span>
                            }
                            {!isTargetAchieved && !!days && !!currentPrice
                                && <span>
                                        {props.analysis.group?.name} muss noch weitere <span className={classNames('font-weight-bold', isPositive ? "text-green" : "text-pink")}>
                                            {numberFormat((targetPrice - currentPrice) / currentPrice * 100)}%
                                        </span> in <b>{days} {days > 0 ? "Tagen" : "Tag"}</b> {isPositive ? "steigen" : "fallen"} um das Kursziel von {numberFormat(targetPrice)} {props.analysis.currency?.displayCode} zu
                                        erreichen.
                                    </span>
                            }
                        </div>
                    }
                    {props.analysis.id && props.analysis.group?.isin && props.analysis.institute?.id
                        && <AnalysisDetailModalHistoryComponent
                                id={props.analysis.id} isin={props.analysis.group?.isin}
                                institute={props.analysis.institute?.id}
                            />
                    }
                    <div className={"analysis-content p-3"}>
                        <h1 className="media-title media-title-news mt-10">{props.analysis.headline}</h1>
                        <span className="news-resume">{formatDate(props.analysis.date)}</span>
                        <div className="mb-4">{props.analysis.body}</div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

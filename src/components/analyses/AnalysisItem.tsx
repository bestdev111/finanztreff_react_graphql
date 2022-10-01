import {useState} from 'react';
import {Analysis, AnalysisRecommendation, SnapQuote, Instrument} from 'graphql/types';
import {calculateDaysWithTimeFrame, formatDate, getAssetLink, numberFormat} from 'utils';
import {AnalysisDetailModal} from './AnalysisDetailModal/AnalysisDetailModal';
import {NewsInstrumentInfoComponent} from "../common/news/NewsInstrumentInfo";
import {Card} from "react-bootstrap";
import {AnalysisProgressChartComponent} from "./AnalysisProgressChartComponent/AnalysisProgressChartComponent";
import SvgImage from "../common/image/SvgImage";

export function AnalysisItem(props: AnalysisItemProps) {
    const [state, setState] = useState<AnalysisItemState>({ isOpen: false });
    
    let days = calculateDaysWithTimeFrame(props.analysis.date, props.analysis.timeFrame || undefined);
    let currentPrice
    if(props.analysis.group?.main?.snapQuote?.quotes){
     currentPrice =   props.analysis.group?.main?.snapQuote?.quotes?.find(current => current?.type==="TRADE")?.value;
    }else {
     currentPrice =  props.analysis.group?.main?.snapQuote?.quote?.value
    }
    let referencePrice = props.analysis.referencePrice;
    let targetPrice = props.analysis.targetPrice;

    return (
        <>
            <Card className={"mx-0 mx-md-2 my-2 rounded-0 border-0"} onClick={() => setState({...state, isOpen: true})} style={{ boxShadow: "0px 3px 6px #00000029", cursor: "pointer"}}>
                <Card.Body className="p-3">
                    <div className="d-flex justify-content-between">
                        <span className="font-weight-bold fs-15px">Fundamentale Analyse</span>
                        <span>vom {formatDate(props.analysis.date)}</span>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                        <span className="font-weight-bold fs-18px text-blue pt-2 text-ellipsis large font-weight-bold">
                            {props.analysis?.group?.name}
                        </span>
                        <div className="font-size-13px">
                            <div>Analyst</div>
                            <div className="text-right font-weight-bold">
                                {props.analysis.institute?.id}
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mt-1 bg-lighten-gray py-2">
                        <span className="d-flex justify-content-between px-2 w-100">
                            <span>
                                Kursziel ({props.analysis.timeFrame} M)
                            </span>
                            <span className="text-right font-weight-bold">
                                { targetPrice !== 0 ? numberFormat(targetPrice) : "-" } { props.analysis.currency?.displayCode }
                            </span>

                        </span>
                        <div className="">
                            {
                                props.analysis.recommendation === AnalysisRecommendation.Positive &&
                                    <span className="font-weight-bold bg-green text-white positive">POSITIV</span>
                            }
                            {
                                props.analysis.recommendation === AnalysisRecommendation.Negative &&
                                    <span className="font-weight-bold bg-pink text-white negative">NEGATIV</span>
                            }
                            {
                                props.analysis.recommendation === AnalysisRecommendation.Neutral &&
                                    <span className="font-weight-bold bg-yellow text-white neutral">NEUTRAL</span>
                            }
                        </div>
                    </div>
                    <div className="d-flex justify-content-between fs-13px mt-1">
                        <span className="pt-1">Läuft in <b>{days} Tagen </b>aus</span>
                        { props.analysis.updated &&
                            <span>
                                <SvgImage icon={"icon_alert_red.svg"} width={"20"} convert={false} imgClass={"pb-1"}/>
                                    Analyse wurde geändert
                            </span>
                        }
                    </div>
                            <div className="info-rows px-0">
                                {!!targetPrice && !!referencePrice
                                    && <AnalysisProgressChartComponent variant={'sm'} className={"my-3"}
                                       currentPrice={currentPrice || undefined } targetPrice={targetPrice}
                                       referencePrice={referencePrice}
                                       analysisCurrencyCode={props.analysis.currency?.displayCode || ""}
                                       percentChange={props.analysis.group?.main?.snapQuote?.quote?.percentChange || undefined}
                                       currencyCode={props.analysis.group?.main?.currency?.displayCode || ""}
                                       timeFrame={props.analysis.timeFrame || undefined}
                                       name={props?.analysis?.group?.name || ""}
                                       url={getAssetLink(props?.analysis.group)}
                                    />
                                }
                            </div>
                            <div className="d-flex fs-15px mt-1">
                                <NewsInstrumentInfoComponent
                                    snapQuote={props.analysis.group?.main?.snapQuote}
                                    currencyCode={props.analysis.group?.main?.currency?.displayCode || ""}
                                    name={props?.analysis?.group?.name || ""}
                                    url={getAssetLink(props?.analysis.group)}
                                    showPrice={true}
                                    className={"w-100"}
                                    isHomeComponent={props.isHomeComponent}
                                />
                            </div>
                </Card.Body>
            </Card>
            <AnalysisDetailModal snapQuote={props.analysis.group?.main?.snapQuote || undefined}
                analysis={props.analysis} isOpen={state.isOpen}
                currencyCode={props.analysis.group?.main?.currency?.displayCode || ""}
                closeModal={() => setState({...state, isOpen: false})}
            />
        </>
    );
}

interface AnalysisItemProps {
    analysis: Analysis;
    instrument?: Instrument,
    isHomeComponent ?: boolean
}

interface AnalysisItemState {
    isOpen: boolean;
    snapQuote?: SnapQuote | null;
}

export default AnalysisItem;

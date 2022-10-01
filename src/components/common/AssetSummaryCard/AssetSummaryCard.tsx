import {ProfileInstrumentAddPopup} from "../modals/ProfileInstrumentAddPopup";
import SvgImage from "../image/SvgImage";
import { AssetLinkComponentSimple} from "../../profile/common/AssetLinkComponent";
import {
    FundChartComponent
} from "../../funds/FundSearchPage/ResultCards/ChartComponent/getFundPerformanceChart";
import {AssetGroup, ChartScope, SnapQuote} from "../../../generated/graphql";
import {extractQuotes, formatPrice, numberFormat, quoteFormat, shortNumberFormat} from "../../../utils";
import {Button, Col, Collapse, Row} from "react-bootstrap";
import {SizeMe, SizeMeProps} from "react-sizeme";
import {useViewport} from "../../../hooks/useViewport";
import {ReactElement, useState} from "react";
import './AssetSummaryCard.scss';

interface AssetSummaryCardProps {
    instrumentId: number;
    name: string;
    assetDescription?: ReactElement;
    assetGroup: string;
    exchangeCode: string;
    exchangeName: string;
    seoTag: string;
    snapQuote: SnapQuote | undefined;
    currencyCode: string;
    features?: ReactElement[];
    actions?: ReactElement[];
    customInformation: ReactElement;
}

export function AssetSummaryCard(props: AssetSummaryCardProps) {
    const [open, setOpen] = useState(false);

    const {width} = useViewport();
    let { trade, nav } = extractQuotes(props.snapQuote);
    return (
        <div className="bg-white asset-summary-card mb-3 d-flex flex-column flex-md-row">
            <div className="d-flex flex-md-column icon-line justify-content-md-start justify-content-sm-between px-1">
                <div className="d-flex flex-row flex-md-column">
                    { props.actions }
                </div>
                <div className={"d-inline-block d-md-none py-2"}>
                { props.assetDescription }
                </div>
            </div>
            <div className="p-1 p-md-2 ">
                <div className={"d-flex flex-row justify-content-start"}>
                    <div className={"d-none d-md-block"}>
                        { props.assetDescription }
                    </div>
                    <div className="ml-2 text-truncate" style={{width: (width < 576 ? 500 : (width < 1280 ? 576: Math.min(1000, width*.75))) + "px"}}>
                        <AssetLinkComponentSimple className={"fs-18px text-blue"}
                                                  assetGroup={props.assetGroup}
                                                  name={props.name}
                                                  seoTag={props.seoTag}
                                                  exchangeCode={props.exchangeCode}
                        />
                    </div>
                </div>
                <div className="mt-3 fund-information d-flex flex-column flex-md-row flex-wrap">
                    <div className={"d-flex w-100"}>
                        <div className={"d-none d-md-inline-block"}>
                            <div className="fs-13px text-kurs-grau mb-n4">Zeitraum: 3J</div>
                            <FundChartComponent instrumentId={props.instrumentId} chartType={ChartScope.ThreeYear} height={90} width={230}/>
                            <div className="">
                                <span className="fs-22px font-weight-bold">{(nav || trade) && formatPrice((nav || trade)?.value, props.assetGroup as AssetGroup, props?.snapQuote?.quote?.value,  props.currencyCode || "")}</span>
                                <div className="mt-n2 line-height-1" >
                                    <span className="fs-13px">{(nav || trade) && quoteFormat((nav || trade)?.when)}</span>
                                    <span className="fs-13px"> Börse: {props.exchangeName}</span>
                                </div>
                            </div>
                        </div>
                        {
                            (props.customInformation || props.features) &&
                                <Row className={"px-xl-4 px-0 flex-fill"}>
                                    {
                                        props.features && props.features.map(feature => (
                                            <Col xl={2} sm={4} className={"d-flex flex-column text-center justify-content-end"}>
                                                {feature}
                                            </Col>
                                        ))
                                    }
                                    {props.customInformation &&
                                        <Col sm={12} className={"d-none d-xl-block"}>
                                            {props.customInformation}
                                        </Col>
                                    }
                                </Row>
                        }
                    </div>
                    <div className={"flex-grow-1"}>
                        {width < 576 &&
                            <div className="d-flex justify-content-center align-items-center cursor-default">
                                <Button variant={"link"} className="text-blue" onClick={() => setOpen(!open)}>
                                    Details anzeigen
                                    <SvgImage icon="icon_direction_down_blue_light.svg" width={"27"}
                                              className="pt-n1" style={{transform: open ? "rotate(180deg)" : ""}}/>
                                </Button>
                            </div>
                        }
                        <Collapse in={(open && width < 576) || (576 <= width && width <= 1024)}>
                            <div className={"fund-details w-100"}>
                                <div className={"d-flex flex-column"}>
                                    <div className={"d-inline-block d-md-none "}>
                                        <SizeMe>
                                            {({size}) =>
                                                <>
                                                    <div className="fs-13px text-kurs-grau mb-n4">Zeitraum: 3J</div>
                                                    <FundChartComponent instrumentId={props.instrumentId} chartType={ChartScope.ThreeYear} height={150} width={size.width || 360}/>
                                                    <div className="">
                                                        <span className="fs-22px font-weight-bold">{(nav || trade) && formatPrice((nav || trade)?.value, props.assetGroup as AssetGroup, props?.snapQuote?.quote?.value,  props.currencyCode || "")}</span>
                                                        <div className="mt-n2 line-height-1" >
                                                            <span className="fs-13px">{(nav || trade) && quoteFormat((nav || trade)?.when)}</span>
                                                            <span className="fs-13px"> Börse: {props.exchangeCode}</span>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </SizeMe>
                                    </div>
                                    {props.customInformation}
                                </div>
                            </div>
                        </Collapse>
                    </div>
                </div>
            </div>
        </div>
    );
}

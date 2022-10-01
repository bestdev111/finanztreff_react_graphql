import { Button, Card, Carousel, Col, Row } from "react-bootstrap";
import { CarouselWrapper } from "../../common";
import SvgImage from "../../common/image/SvgImage";
import { useBootstrapBreakpoint } from "../../../hooks/useBootstrapBreakpoint";
import './ShareClasses.scss';
import classNames from "classnames";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { InstrumentGroupFundTranche } from "generated/graphql";
import { getFinanztreffAssetLink, numberFormat, shortNumberFormat } from "utils";
import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { Link } from "react-router-dom";

export function ShareClassesSection(props: { instrumentGroupFundTranches: InstrumentGroupFundTranche[], fundTranche: InstrumentGroupFundTranche }) {
    const carouselItemsSize = useBootstrapBreakpoint({
        default: 3,
        md: 3,
        xl: 4,
        sm: 3
    });

    let instrumentGroupFundTranches: InstrumentGroupFundTranche[] = [...props.instrumentGroupFundTranches, props.fundTranche];
    return (
        <div className="content-wrapper col" id="anteilsklassen">
            <h3 className="content-wrapper-heading font-weight-medium">
                <SvgImage icon="icon_tranch.svg" convert={false} imgClass="svg-black" width="28" />
                Anteilsklassen
            </h3>
            <div className="card-overflow-hidden">
                <Carousel as={CarouselWrapper} controlclass={"dark-version"} slide={true}
                    prevIcon={
                        <SvgImage icon={`icon_direction_left_dark.svg`}
                            spanClass="move-arrow d-none d-xl-block" convert={false} />
                    }
                    nextIcon={
                        <SvgImage icon={`icon_direction_right_dark.svg`}
                            spanClass="move-arrow d-none d-xl-block" convert={false} />
                    }
                >
                    {generateCarouselItems(carouselItemsSize, instrumentGroupFundTranches)}
                </Carousel>
            </div>
        </div>
    )
}

function generateCarouselItems(size: number, instrumentGroupFundTranches: InstrumentGroupFundTranche[]) {
    let array = [];
    let i = 0;
    let counter = 0;
    let mainFund = instrumentGroupFundTranches.filter(current => current.main === true)[0];
    instrumentGroupFundTranches.filter(current => current);
    while (i * size < instrumentGroupFundTranches.filter(current => current.main === false).length) {
        array.push(
            <Carousel.Item key={i} className="pb-5">
                <Row className={"p-1"} key={i}>\
                    {mainFund &&
                        <div className="col-xl-3 col-lg-4 col-md-3 ml-n1">
                            <ShareClassesCard primary={true} fundTranche={mainFund} />
                        </div>
                    }
                    {
                        instrumentGroupFundTranches.filter(current => current.main === false).slice(i * (size - (mainFund ? 1 : 0)), (i + 1) * (size - (mainFund ? 1 : 0))).map((current: any, index: number) =>
                            <>
                                <div key={index} className="col-xl-3 col-lg-4 col-md-3 ml-n1">
                                    <ShareClassesCard primary={false} isCurrent={index === 0 && counter === 0} fundTranche={current} />
                                </div>
                            </>
                        )
                    }
                </Row>
            </Carousel.Item>
        );
        i++;
        counter++;
    }
    return array;
}

function ShareClassesCard(props: { primary?: boolean, isCurrent?: boolean, fundTranche: InstrumentGroupFundTranche }) {

    const [wknCopied, setWknCopied] = useState<boolean>(false);
    const wkn = props.fundTranche.group?.wkn || "";

    return (
        <>
            <Card className={classNames("share-classes-card", props.primary && "primary", props.isCurrent && "current-card")}>
                <Card.Header>{props.primary ? "Hauptfonds" : props.isCurrent ? "Anteilsklasse (Dieser Fonds)" : "Anteilsklasse"}</Card.Header>
                <Card.Body>
                    <div className="d-none d-xl-block d-lg-block d-md-block">
                        <div className="border-bottom-1 border-border-gray pb-2 text-center text-blue font-weight-bold card-title">
                            {props.fundTranche.group && props.fundTranche.group.assetGroup && props.fundTranche.group.seoTag ?
                            <Link
                                to={getFinanztreffAssetLink(props.fundTranche.group.assetGroup, props.fundTranche.group.seoTag)}
                                className={""}
                            >{wkn}</Link>
                            : <>{wkn}</>
                            }
                            <CopyToClipboard text={wkn} onCopy={() => {
                                setWknCopied(false);
                            }}>
                                <Button className="move-arrow svg-icon top-move copy-button" title={wknCopied ? "Copied" : "Copy"}>
                                   <SvgImage icon= "icon_copy_dark.svg" convert={false} spanClass="move-arrow" width={'28'} />
                                </Button>
                            </CopyToClipboard>
                        </div>
                        <div className="py-2 d-flex justify-content-between">
                            <div className="fs-14px">
                                <div className="text-center">TER</div>
                                <div className="text-center font-weight-bold mt-n1">
                                    {props.fundTranche.totalExpenseRatio ?
                                        numberFormat(props.fundTranche.totalExpenseRatio) :
                                        "-"
                                    }
                                </div>
                                <div className="text-center mt-2">Sparplanfähig?</div>
                                <div className="text-center font-weight-bold mt-n1">ja</div>
                                <div className="text-center mt-2">Ausgabe</div>
                                <div className="text-center font-weight-bold mt-n1">
                                    {props.fundTranche.assetBasedFee ? numberFormat(props.fundTranche.assetBasedFee, " %") : "-"}
                                </div>
                            </div>
                            <div className="fs-14px">
                                <div className="text-center">Währung</div>
                                <div className="text-center font-weight-bold mt-n1">{
                                    props.fundTranche.currency && props.fundTranche.currency.name ?
                                        props.fundTranche.currency.name : "-"}</div>
                                <div className="text-center mt-2">VL-fähig?</div>
                                <div className="text-center font-weight-bold mt-n1">
                                    {props.fundTranche.germanVwlCapable !== null ?
                                        props.fundTranche.germanVwlCapable === true ?
                                            "Ja" : "Nein" : "-"}</div>
                                <div className="text-center mt-2">Volumen AK</div>
                                <div className="text-center font-weight-bold mt-n1 text-nowrap">{
                                    props.fundTranche.investmentVolume && props.fundTranche.investmentVolume.value ?
                                        shortNumberFormat(props.fundTranche.investmentVolume.value) : "-"
                                }</div>
                            </div>
                        </div>
                        <div className="pb-2 fs-14px">
                            <div className="text-center">Ertragverwendung</div>
                            <div className="text-center font-weight-bold mt-n1">
                                {
                                    props.fundTranche.distributionFrequency && props.fundTranche.distributionFrequency.month ?
                                        <>
                                            {props.fundTranche.distributing ? "ausschüttend" : "thesaurierend"}  {12 / props.fundTranche.distributionFrequency?.month} x
                                        </>
                                        :
                                        <>
                                            -
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="d-lg-none d-xl-none d-md-none">
                        <div className="border-bottom-1 border-border-gray pb-2 text-center text-blue font-weight-bold card-title">
                            WKN {wkn}
                        </div>
                        <div className="pb-2 d-flex justify-content-between fs-14px">
                            <div>
                                <div className="text-center">TER</div>
                                <div className="text-center font-weight-bold mt-n1">
                                    {props.fundTranche.totalExpenseRatio ?
                                        numberFormat(props.fundTranche.totalExpenseRatio) :
                                        "-"
                                    }
                                </div>
                            </div>
                            <div>
                                <div className="text-center">VL-fähig?</div>
                                <div className="text-center font-weight-bold mt-n1">
                                    {props.fundTranche.germanVwlCapable !== null ?
                                        props.fundTranche.germanVwlCapable === true ?
                                            "Ja" : "Nein" : "-"}
                                </div>
                            </div>
                            <div>
                                <div className="text-center">Währung</div>
                                <div className="text-center font-weight-bold mt-n1">{
                                    props.fundTranche.currency && props.fundTranche.currency.name ?
                                        props.fundTranche.currency.name : "-"}</div>
                            </div>
                            <div>
                                <div className="text-center">Ausgabe</div>
                                <div className="text-center font-weight-bold mt-n1">
                                    {props.fundTranche.assetBasedFee ? numberFormat(props.fundTranche.assetBasedFee, " %") : "-"}
                                </div>
                            </div>
                        </div>
                        <div className="py-2 d-flex justify-content-between fs-14px">
                            <div>
                                <div className="text-center">Sparplanfähig?</div>
                                <div className="text-center font-weight-bold mt-n1">ja</div>
                            </div>
                            <div>
                                <div className="text-center">Volumen AK</div>
                                <div className="text-center font-weight-bold mt-n1 text-nowrap">{
                                    props.fundTranche.investmentVolume && props.fundTranche.investmentVolume.value ?
                                        shortNumberFormat(props.fundTranche.investmentVolume.value) : "-"
                                }</div>
                            </div>
                            <div>
                                <div className="text-center">Ertragverwendung</div>
                                <div className="text-center font-weight-bold mt-n1">
                                    {
                                        props.fundTranche.distributionFrequency && props.fundTranche.distributionFrequency.month ?
                                            <>
                                                {props.fundTranche.distributing ? "ausschüttend" : "thesaurierend"}  {12 / props.fundTranche.distributionFrequency?.month} x
                                            </>
                                            :
                                            <>
                                                -
                                            </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}

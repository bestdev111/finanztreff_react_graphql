import React, { useState } from 'react'
import { Button, Card, Col, Row } from "react-bootstrap";
import SvgImage from "../../../common/image/SvgImage";
import classNames from "classnames";
import CircularProgressbar from "../../../common/indicators/Progress";
import {formatPrice, numberFormat, quoteFormat} from 'utils';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Instrument, Issuer, Quote } from 'generated/graphql';
import { ProfileInstrumentAddPopup } from 'components/common/modals/ProfileInstrumentAddPopup';
import { AssetLinkComponent } from 'components/profile/common/AssetLinkComponent';
import { PartnerLogo } from './PartnerLogo';


interface MatchingProductsProps extends React.HTMLAttributes<HTMLElement> {
    tage: string;
    title: string;
    headingColor: string;
    wknValue: string;
    pieChartValue: number;
    pieChartColor: string;

    askQuote?: Quote;
    bidQuote?: Quote;

    gearing?: number;
    strike?: number;
    strikeCurrency?: string;
    instrument?: Instrument;
    issuer?: Issuer | any;
}

declare global {
    interface Window {
        dataLayer: any;
    }
}
export function gtag(arg1: string, arg2: string, arg3: any){
   window && window.dataLayer &&  window.dataLayer.push(arguments)
}

const zeroPad = (num: any, places: any) => String(num).padStart(places, '0');

export function eventTime() {
var ts = new Date();
return(zeroPad(ts.getDate(), 2) + '.' + zeroPad((ts.getMonth()+1), 2) + '.' + ts.getFullYear() + '-' + zeroPad(ts.getHours(), 2) + ':' + zeroPad(ts.getMinutes(), 2) + ':' + zeroPad(ts.getSeconds(), 2));
};

export const Product = (props: MatchingProductsProps) => {

    const [wknCopied, setWknCopied] = useState<boolean>(false);
    let productIsin= props.instrument?.isin
    let nameWkn = props.issuer?.name + " - " + props.wknValue;

    return (
        <Card style={{ filter: 'drop-shadow(3px 2px 2px rgba(0, 0, 0, .15))', maxWidth: "343px", minWidth: "290px" }}
            className={classNames(props.className)}>
            <Card.Title className={classNames("text-white pl-2 text-center", props.headingColor)}>
                <span style={{ fontSize: '0.96rem' }}>{props.title}</span>
            </Card.Title>
            <Card.Body className="pt-0 pb-2">
                <div className="d-flex justify-content-between">
                    <span className="font-weight-bold d-flex">{props.wknValue}
                        <CopyToClipboard text={props.wknValue} onCopy={() => {
                            setWknCopied(true);
                        }}>
                            <Button className="move-arrow svg-icon top-move copy-button" title={wknCopied ? "Copied" : "Copy"} onClick={() => {
                                return gtag('event', 'view_item', {
                                    items: [{
                                        item_name: productIsin,
                                        item_brand: nameWkn,
                                        item_category: 'Monte Carlo Simulation',
                                        item_category2: 'Related Products',
                                        item_category3: 'Copy Identification',
                                        item_category5: eventTime(),
                                    }]
                                });
                            }}>
                              <SvgImage icon= "icon_copy_dark.svg" convert={false} spanClass="copy-icon" width={'28'} />
                            </Button>
                        </CopyToClipboard>
                    </span>
                    {props.issuer && <PartnerLogo className="mr-n4" issuer={props.issuer} />}
                </div>
                <Row className="line-height-1 mt-2">
                    <RowItem name="Hebel" value={numberFormat(props.gearing)} className="pr-0" />
                    <RowItem name="RLZ" value={props.tage} className="pr-0 text-right mr-3" />
                </Row>
                <Row className="line-height-1 mt-n3 d-flex justify-content-between" style={{ height: "50px" }}>
                    <RowItem name="Strike" value={numberFormat(props.strike, props.strikeCurrency)} className="pr-0" />
                    <div className="w-25 p-0 m-0 mt-n1 mx-auto">
                        <CircularProgressbar value={props.pieChartValue}
                            counterClockwise={true}
                            styles={{
                                path: {
                                    stroke: props.pieChartColor,
                                },
                                trail: {
                                    stroke: '#f1f1f1',
                                },
                                root: {
                                    transform: 'scale(0.5)',
                                    marginTop: '-8px'
                                }
                            }} />
                    </div>
                </Row>
                <div className="d-flex justify-content-between text-center line-height-1">
                    <div>
                        <span className="font-weight-bold">Bid: <span style={{ fontSize: "16px" }}>{formatPrice(props.bidQuote?.value, props.instrument?.group?.assetGroup)}</span></span>
                        <br />
                        <span className="font-size-12px">{quoteFormat(props.bidQuote?.when)}</span>
                        <br />
                        <span className="font-size-12px">{numberFormat(props.bidQuote?.size, " Stück")}</span>
                    </div>
                    <div>
                        <span className="font-weight-bold">Ask: <span style={{ fontSize: "16px" }}>{formatPrice(props.askQuote?.value, props.instrument?.group?.assetGroup)}</span></span>
                        <br />
                        <span className="font-size-12px">{quoteFormat(props.askQuote?.when)}</span>
                        <br />
                        <span className="font-size-12px">{numberFormat(props.askQuote?.size, " Stück")}</span>
                    </div>
                </div>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between bg-white">
                {props.instrument && props.instrument.group && props.instrument.id && props.instrument.group.id &&
                    <ProfileInstrumentAddPopup
                        instrumentId={props.instrument.id}
                        instrumentGroupId={props.instrument.group.id}
                        name={props.instrument.group.name}
                        className="p-0 mr-n1"
                        watchlist={true} portfolio={true}
                        direction="up"
                        productIsin={productIsin}
                        nameWkn={nameWkn}>
                        <SvgImage icon="icon_plus_blue.svg" convert={false} imgClass="shrink-08" width="28" />
                    </ProfileInstrumentAddPopup>
                }
                <AssetLinkComponent instrument={props.instrument} size={30} title="zum Portrait" productIsin = {productIsin} nameWkn ={nameWkn} />
            </Card.Footer>
        </Card>
    )
}

export default Product

interface RowItemProps extends React.HTMLAttributes<HTMLElement> {
    name: string;
    value: React.ReactNode;
}

function RowItem(props: RowItemProps) {
    return (
        <Col {...props}>
            <div className="fnt-size-14 px-1 py-1 margin-bottom-20">
                <div className="text-truncate">{props.name}</div>
                <div className="font-weight-bold" style={{ fontSize: "16px" }}>{props.value}</div>
            </div>
        </Col>
    );
}

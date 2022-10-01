import { Carousel, Container } from "react-bootstrap";
import { ReactNode, useState } from "react";
import { BannerItemComponent } from "./BannerItemComponent";
import { CarouselWrapper } from "../index";
import {
    AssetGroup, ChartScope,
    DerivativeInstrumentKeyFigures,
    Instrument,
    InstrumentGroup,
    InstrumentGroupUnderlying
} from "../../../generated/graphql";
import classNames from "classnames";
import { useLocation } from 'react-router-dom';
import { ProfileInstrumentAddPopupForBanner } from "../modals/ProfileInstrumentAddPopup";
import { CertificateTypeName, extractQuotes, quoteFormat, sortByExchanges } from "../../../utils";
import { InstrumentLimits } from "components/profile/common/InstrumentLimits/InstrumentLimits";
import { trigInfonline, guessInfonlineSection } from "../InfonlineService";
import { getAssetGroup } from "components/profile/utils";
import "./PageBannerComponent.scss";

export const PageBannerComponent = (props: PageBannerComponentProperties) => {
    let location = useLocation();
    let content = sortByExchanges(props.group.content);
    let [state, setState] = useState<PageBannerComponentState>({ activeSlide: content.indexOf(content.find(current => current.main) || content[0]) });
    const hash = location.hash;
    const code = hash.replace(/(\#boerse)-(.*?)/i, '$2');
    if (code && state.exchange !== code && location.hash.includes("boerse-")) {
        const index: number = content.findIndex((value: any) => value.exchange.code === code);
        setState({ ...state, exchange: code, activeSlide: index });
    } 

    let changeSlide = (selectedIndex: number) => {
        setState({ ...state, activeSlide: selectedIndex });
        window.location.hash = content[selectedIndex].exchange.code ? ("boerse-" + content[selectedIndex].exchange.code) : "";
        props.change && props.change(content[selectedIndex].id);
    };

    let changeDropDown = (selectedIndex: number) => {
        props.change && props.change(content[selectedIndex].id);
        window.location.hash = content[selectedIndex].exchange.code ? ("boerse-" + content[selectedIndex].exchange.code) : "";
    };

    let instruments: {name: string, delay?: number, volume: number, date: string, showDelay?: boolean}[] = content.map((item: Instrument) => {
        let {trade, nav} = extractQuotes(item.snapQuote);
        let instrument: {name: string, delay?: number, volume: number, date: string, showDelay?: boolean} = {name: item.exchange?.name + ' in ' + item.currency?.name || item.name + ' in ' + item.currency?.name,
                                                                                        delay: item.snapQuote?.delay || undefined ,
                                                                                        volume: item.snapQuote?.cumulativeVolume || undefined,
                                                                                        date: quoteFormat((trade || nav)?.when),
                                                                                        showDelay: item.group.assetGroup!==AssetGroup.Index }
        return instrument
    });

    return (
        <>
            <section className={classNames("home-banner", props.className)}>
                <div className="top-row">
                    <div className="container">
                        <div className="row">
                            {props.typeId !== CertificateTypeName.Faktor && props.assetGroup !== AssetGroup.Warr && props.assetGroup !== AssetGroup.Knock && props.assetGroup !== undefined && props.assetGroup !== AssetGroup.Cert
                                ? (
                                    <>
                                        <span className={classNames("asset-type", props.assetClassName)}> {props.assetClass} </span>
                                        <div className="stock-group col d-flex align-items-center"> {getAssetGroup(props.group.assetGroup)} / {props.group.name} </div>
                                    </>
                                ) :
                                <>
                                    <div className={"mb-sm-4 mb-md-0"}>
                                        <span className={classNames("asset-type ml-2 ml-md-0", props.assetClassName)} style={{ height: "21px" }}> {props.assetClass} </span>
                                        <div className="stock-group col d-flex align-items-center"> {getAssetGroup(props.group.assetGroup)} / {props.group.name} </div>
                                        {(props.assetGroup===AssetGroup.Knock || props.assetGroup===AssetGroup.Warr ||props.assetGroup===AssetGroup.Cert)  ? (
                                            <span className={
                                                props.typeId === CertificateTypeName.Faktor ?
                                                    "d-none" : "asset-type bg-white text-dark d-md-none ml-sm-2 ml-md-0"}
                                                style={{ borderRadius: "0px", height: "21px" }}
                                            >
                                                {props.assetType}
                                            </span>)
                                            :
                                            (
                                                <></>
                                            )
                                        }
                                    </div>
                                </>
                            }
                            <div className="action-icons-holder col d-flex mb-sm-2">
                                <span className="" style={{marginTop: "-1px", marginRight:'8px'}}>
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_share_white.svg"} alt="" className=""  width="27"/>
                                </span>
                                <span className="ml-xl-n2 mr-xl-n3 ml-n3 mr-n4" style={{marginTop: "-7px"}}>
                                    <InstrumentLimits instrumentId={content[state.activeSlide]?.id} instrumentGroupId={props.group?.id || undefined}
                                        svgColor="white" />

                                </span>
                                {instruments[state.activeSlide] && content[state.activeSlide]?.id && props.group?.id && props.group?.name &&
                                    <>
                                        <ProfileInstrumentAddPopupForBanner
                                            instrumentId={content[state.activeSlide].id}
                                            instrumentGroupId={props.group.id}
                                            name={props.group.name}
                                            className="p-0 ml-2 mt-n1"
                                            portfolio={true}/>
                                        <ProfileInstrumentAddPopupForBanner
                                            instrumentId={content[state.activeSlide].id}
                                            instrumentGroupId={props.group.id}
                                            name={props.group.name}
                                            className="p-0 ml-2 mt-n1"
                                            watchlist={true}/>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>


                <Carousel
                    activeIndex={state.activeSlide} onSelect={changeSlide}
                    prevIcon={<span onClick={()=> trigInfonline(guessInfonlineSection(), 'slider')} className="move-arrow svg-icon"><img src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_left_white.svg"} alt="" />vorheriger Börsenplatz</span>}
                    nextIcon={<span onClick={()=> trigInfonline(guessInfonlineSection(), 'slider')} className="move-arrow svg-icon">nächster Börsenplatz<img src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_right_white.svg"} alt="" /></span>}
                    prevLabel={"vorheriger Börsenplatz"}
                    nextLabel={"nächster Börsenplatz"}
                    as={CarouselWrapper}
                    onSlid={(eventKey: number, direction: 'left' | 'right') => {
                        trigInfonline(guessInfonlineSection(), 'slider');
                        setState({ ...state, activeSlide: eventKey });
                    }}
                >

                    {
                        content.map((instrument: any, index: any) =>
                            <Carousel.Item key={index}>
                                {state.activeSlide===index &&
                                <Container>
                                    <div key={instrument.id} className="">
                                        <BannerItemComponent setChartScope = {props.setChartScope} key={index} assetType={props.assetType} assetClass={props.assetClass} index={index} assetGroup={props.group.assetGroup} instrument={instrument}
                                            onSelectExchange={(selectedIndex: any) => {
                                                setState({ ...state, activeSlide: Number.parseInt(selectedIndex) });
                                                changeDropDown(selectedIndex);
                                            }}
                                            assetTypeGroupName={props.assetTypeGroupName}
                                            assetClassName={props.assetClassName}
                                            instruments={instruments} activeSlide={state.activeSlide}
                                            keyFigures={props.keyFigures}
                                            underlyings={props.underlyings} typeId={props.typeId}
                                            group={props.group}
                                            fundType={props.fundType}
                                        />
                                    </div>
                                </Container> 
                            }
                            </Carousel.Item>)
                    }

                </Carousel>
                {props.children}
            </section>
        </>
    );
}

export interface PageBannerComponentProperties {
    assetType?: any;
    assetClass: string
    group: InstrumentGroup;
    assetTypeGroupName?: string;
    className?: string;
    assetClassName?: string;
    change?: (instrument: number) => void;
    keyFigures?: DerivativeInstrumentKeyFigures | null | undefined,
    underlyings?: InstrumentGroupUnderlying[] | null | undefined,
    children?: ReactNode;
    typeId?: string | undefined | null
    assetGroup?: AssetGroup;
    fundType?: string;
    setChartScope?: (value: ChartScope) => void
}

export interface PageBannerComponentState {
    activeSlide: number;
    exchange?: string;
}

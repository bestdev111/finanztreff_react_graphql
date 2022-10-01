import React from "react";
import Carousel from "react-bootstrap/Carousel";
import {CarouselWrapper} from "../../common";
import {CarouselItem} from "react-bootstrap";
import AssetMainCard from "./AssetMainCard";
import AssetCarouselItem from "./AssetCarouselItem";
import AssetTagsCarouselItem from "./tags/AssetTagsCarouselItem";
import AssetTagsCard from "./tags/AssetTagsCard";
import {FilterType} from "./filter/UnderlyingFilters";
import {AssetClass, Instrument} from "../../../generated/graphql";
import {useBootstrapBreakpoint} from "../../../hooks/useBootstrapBreakpoint";

export interface AssetRowProps {
    title: string;
    otherTitle: string;
    bottomInfo: string;
    showHeaderInfo?: boolean;
    showCustomAsset: any;
    showTime?: boolean;
    type1?: string;
    type2?: string;
    tags?: string[];
    assetType?: FilterType;
    assetClass: AssetClass;
    instruments?: any[];
}

export default function AssetRow(props: AssetRowProps) {
    const isMobile = useBootstrapBreakpoint({
        default: true,
        md: false,
        xl: false
    })

    return (<>
        <div className="assets-row mt-xl-0 mt-md-0 mt-sm-5">
            <h2 className="section-heading font-weight-bold pt-xl-5 pt-md-4 mt-md-3 mt-xl-0 mb-md-n2  pb-xl-2">
                <h2 className={"derivative-page-section-heading-sm"}>{props.title}</h2>
                &nbsp;
                {
                    props.assetType === FilterType.top5Traded ? 'auf die Top 5 Meistgehandelten Werte'
                    : (props.assetType === FilterType.top5Searched ? 'auf die Top 5 Meistgesuchten Werte'
                        : props.assetType === FilterType.top5Dax ? 'auf Top 5 DAX Werte'
                        :( props.assetType === FilterType.worst5Dax ? 'auf Flop 5 DAX Werte' : ''))
                }
            </h2>
            <div className="content">

                {
                    !isMobile &&
                    <div className="row row-cols-xl-2 row-cols-lg-2 gutter-16 mt-4 mt-md-3 d-none d-lg-flex pt-1">
                        {
                            props.instruments?.map(i => {
                                return {...i, ...i.instrument} as Instrument
                            }).map(
                                i =>
                                    <AssetMainCard
                                        key={i.group?.id}
                                        title={i.group?.name}
                                        groupId={i.group?.id || -1}
                                        instrument={i} showHeaderInfo={props.showHeaderInfo} otherTitle={props.otherTitle}
                                        assetClassId={props.assetClass.id}
                                        assetClassGroup={props.assetClass.assetGroup}
                                        assetClassName={props.title}
                                        type1={props.type1} type2={props.type2}
                                        showTime={props.showTime} bottomInfo={props.bottomInfo}/>
                            )
                        }

                        <AssetTagsCard tags={props.tags} showCustomAsset={props.showCustomAsset}
                                       jetztHref={"/hebelprodukte/suche?aclass=" + props.title}
                                       findMoreText={"Jetzt " + props.title + " suchen"}/>
                    </div>
                }
                {
                    isMobile &&
                    <div className="slider-wrapper mobile-multi-card-slider mt-3 d-lg-none">
                        <div className="derivate-big-card">
                            <Carousel as={CarouselWrapper} controlclass="dark-version">
                                {
                                    props.instruments?.map(i => {
                                        return {...i, ...i.instrument} as Instrument
                                    }).map(
                                        i =>
                                            <CarouselItem>
                                                <AssetCarouselItem
                                                    key={i.group?.id}
                                                    title={i.group?.name}
                                                    groupId={i.group?.id || -1}
                                                    instrument={i} showHeaderInfo={props.showHeaderInfo}
                                                    otherTitle={props.otherTitle}
                                                    assetClassId={props.assetClass.id}
                                                    assetClassGroup={props.assetClass.assetGroup}
                                                    assetClassName={props.title}
                                                    type1={props.type1} type2={props.type2}
                                                    showTime={props.showTime} bottomInfo={props.bottomInfo}/>
                                            </CarouselItem>
                                    )
                                }
                                <CarouselItem>
                                    <AssetTagsCarouselItem tags={props.tags} showCustomAsset={props.showCustomAsset}
                                                           findMoreText={"Jetzt " + props.title + " suchen"}/>
                                </CarouselItem>
                            </Carousel>
                        </div>
                    </div>
                }
            </div>
        </div>
    </>);
}

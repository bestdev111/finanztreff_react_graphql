import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { CarouselWrapper } from "../../../common";
import SvgImage from "../../../common/image/SvgImage";
import { Accordion, CarouselItem } from "react-bootstrap";
import InvestmentProductAccordion from "./InvestmentProductAccordion";
import AssetRowTitle from "../../common/AssetRowTitle";
import AssetRowHeaderInfo from "../../common/AssetRowHeaderInfo";
import InvestmentProductAssetRowCarouselItem from "./InvestmentProductAssetRowCarouselItem";
import { useBootstrapBreakpoint } from "../../../../hooks/useBootstrapBreakpoint";
import { AssetClass, Instrument } from "../../../../generated/graphql";
import { formatAssetGroup } from "../../../../utils";
import { FilterType } from "../filter/UnderlyingFilters";
import {trigInfonline} from "../../../common/InfonlineService";

export interface InvestmentProductAssetRowProps {
    instruments: Instrument[];
    assetClasses: AssetClass[];
    assetType: FilterType;
}

export default function InvestmentProductAssetRow({ instruments, assetClasses, assetType }: InvestmentProductAssetRowProps) {
    const productCardHeight = useBootstrapBreakpoint({
        default: "426px",
        xl: "426px",
        md: "704px",
        sm: "245px"
    })

    const isMobile = useBootstrapBreakpoint({
        default: true,
        md: false,
        xl: false
    })

    const [currentIdx, setCurrentIdx] = useState(0);
    const [instrument, setInstrument] = useState<Instrument | null>(null);
    const [activeCaruselKey, setActiveCaruselKey] = useState(0);

    const title = assetType === FilterType.top5Traded ? 'auf die Top 5 Meistgehandelten Werte'
        : (assetType === FilterType.top5Searched ? 'auf die Top 5 Meistgesuchten Werte'
            : assetType === FilterType.top5Dax ? 'auf Top 5 DAX Werte'
                : (assetType === FilterType.worst5Dax ? 'auf Flop 5 DAX Werte' : ''));

    useEffect(() => {
        if (instruments && instruments.length > 0 && instruments.length > currentIdx) {
            setInstrument(instruments[currentIdx])
        } else setInstrument(null);
    }, [instruments, currentIdx]);

    if (!instrument) return null;

    return (<>
        <div className="assets-row">
            <h2 className="section-heading font-weight-bold d-none ml-0  d-lg-block">
                Anlageprodukte {title}</h2>
            <h2 className="section-heading font-weight-bold fnt-size-20 d-lg-none pt-3">
                Anlageprodukte {title}</h2>
            <div className="content" id="analogproduct-derivative">
                {
                    !isMobile &&
                    <div className="row row-cols-xl-1 mt-2    d-none d-lg-flex">
                        <div className="col">
                            <div className="derivate-big-card h-95 mt-md-2 single-whole-width pb-2 "
                                 style={{height: "fit-content"}}>
                                <div className="top p-2">
                                    <AssetRowTitle title={instrument?.group.name || ''}
                                                   assetGroup={formatAssetGroup(instrument?.group?.assetGroup)}
                                                   instrument={instrument}/>
                                    <AssetRowHeaderInfo
                                        exchCode={instrument?.exchange?.code || ''}
                                        delay={instrument?.exchange?.delay || 0}
                                        percentChange={instrument?.snapQuote?.quote?.percentChange || 0}
                                        currencyCode={instrument?.currency?.displayCode || ''}
                                        quoteValue={instrument?.snapQuote?.quote?.value}
                                        when={instrument?.snapQuote?.quote?.when}
                                    />
                                </div>
                                <div className="slider-wrapper">
                                    <Carousel className="mt-sm-0 mt-md-n2 mt-xl-0 pb-md-5 pb-sm-0"
                                              onSlid={(key) => {
                                                  trigInfonline('derivatives', 'anlageprodukte');
                                                  setActiveCaruselKey(key);
                                              }}
                                              as={CarouselWrapper}
                                              controlclass="dark-version mb-xl-n2 pt-xl-2"
                                              activeIndex={currentIdx}
                                              onSelect={(e) => setCurrentIdx(e)}
                                              prevIcon={
                                                  currentIdx > 0 ?
                                                      <>
                                                          <SvgImage icon="icon_direction_left_dark_big.svg"
                                                                    spanClass="move-arrow" convert={false}/>
                                                          <span>{instruments[currentIdx - 1].group.name}</span>
                                                      </> : null
                                              }
                                              nextIcon={
                                                  currentIdx < instruments.length - 1 ?
                                                      <>
                                                          <span>{instruments[currentIdx + 1].group.name}</span>
                                                          <SvgImage icon="icon_direction_right_dark_big.svg"
                                                                    spanClass="move-arrow" convert={false}/>
                                                      </> : null
                                              }
                                    >
                                        {
                                            instruments.map(
                                                (i, idx) =>
                                                    <CarouselItem key={i.id} >
                                                        {
                                                            activeCaruselKey === idx &&
                                                            <InvestmentProductAssetRowCarouselItem instrument={i}
                                                                                                   assetClasses={assetClasses}/>
                                                        }
                                                    </CarouselItem>
                                            )
                                        }
                                    </Carousel>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {
                    isMobile &&
                    <div className="d-lg-none pt-2">
                        <div className="derivate-big-card single-whole-width">
                            <div className="top">
                                <AssetRowTitle title={instrument?.name || ''}
                                               assetGroup={formatAssetGroup(instrument?.group?.assetGroup)}
                                               instrument={instrument}/>
                                <AssetRowHeaderInfo
                                    exchCode={instrument?.exchange?.code || ''}
                                    delay={instrument?.exchange?.delay || 0}
                                    percentChange={instrument?.snapQuote?.quote?.percentChange || 0}
                                    currencyCode={instrument?.currency?.displayCode || ''}
                                    quoteValue={instrument?.snapQuote?.quote?.value}
                                    when={instrument?.snapQuote?.quote?.when}
                                />
                            </div>

                            <Carousel
                                as={CarouselWrapper}
                                controlclass="dark-version "
                                activeIndex={currentIdx}
                                onSelect={(e) => {
                                    setCurrentIdx(e);
                                }}
                                prevIcon={
                                    currentIdx > 0 ?
                                        <>
                                            <SvgImage icon="icon_direction_left_dark_big.svg"
                                                      spanClass="move-arrow" convert={false}/>
                                        </> : null
                                }
                                nextIcon={
                                    currentIdx < instruments.length - 1 ?
                                        <>
                                            <SvgImage icon="icon_direction_right_dark_big.svg"
                                                      spanClass="move-arrow" convert={false}/>
                                        </> : null
                                }
                            >
                                {
                                    instruments.map(
                                        (i, index) =>
                                            <CarouselItem key={index}>
                                                <div className="data-wrapper">
                                                    {
                                                        <Accordion className={"mb-5"}>
                                                            {
                                                                assetClasses.map(
                                                                    (c, idx) =>
                                                                        <InvestmentProductAccordion
                                                                            key={idx + 1}
                                                                            eventKey={idx + 1} instrument={i}
                                                                            assetClass={c}
                                                                        />
                                                                )
                                                            }
                                                        </Accordion>
                                                    }
                                                </div>
                                            </CarouselItem>
                                    )
                                }
                            </Carousel>
                        </div>
                    </div>
                }
            </div>
        </div>
    </>);
}


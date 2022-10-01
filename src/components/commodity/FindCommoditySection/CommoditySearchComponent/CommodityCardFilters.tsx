import { Button, ButtonGroup, Carousel, CarouselItem, Container, Row } from "react-bootstrap";
import '../../../Home/HotSection/HotSection.scss';
import '../FindCommoditySection.scss';
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import SvgImage from "components/common/image/SvgImage";
import { createChunk } from "components/common/utils";
import { CarouselWrapper } from "components/common";
import { EtfSearchCard, GlobalEtfSearchProps } from "./BaseCommoditySearchCard";
import {CommodityLastPerformanceCard} from "./cards/CommodityLastPerformanceCard";
import { useState } from "react";
import CommoditySearchContext, { CommoditySearchContextProps } from "./CommoditySearchContext";
import classNames from "classnames";
import { CommodityDistanceCard } from "./cards/CommodityDistanceCard";
import { CommodityDistance52WCard } from "./cards/CommodityDistance52WCard";
import { CommodityDistanceAllTimeCard } from "./cards/CommodityDistanceAllTimeCard";

export const COMMODITY_CARDS: EtfSearchCard[] = [
    CommodityDistanceCard, CommodityLastPerformanceCard, CommodityDistance52WCard, CommodityDistanceAllTimeCard,
]
    .sort((a, b) => {
        if (a.enabled == b.enabled) {
            return 0;
        }
        return a.enabled && !b.enabled ? -1 : 1;
    });

    const TAGS: string[] =
    COMMODITY_CARDS
        .map(current => current.tags || [])
        .map(current => [...current])
        .reduce((prev, current) => {
            current.forEach(item => {
                if (prev.indexOf(item) < 0) {
                    prev.push(item);
                }
            })
            return prev;
        }, [])
        .filter(current => !!current)
        .sort((a, b) => a.localeCompare(b));

interface CommoditySearchState {
    searchProps: GlobalEtfSearchProps;
    category: string;
    overrideTypeId: boolean;
    cards: EtfSearchCard[];
}

const ALL_SELECTED = "Alle";

export function CommodityCardFilters() {

    const [state, setState] = useState<CommoditySearchState>({
        searchProps: {
            typeId: null,
            regionId: null,
            strategyId: null,
            sectorId: null
        },
        overrideTypeId: false,
        category: ALL_SELECTED,
        cards: COMMODITY_CARDS
    });

    const value: CommoditySearchContextProps = {
        // etfTypes: [
        //     DEFAULT_ETF_OPTION,
        //     ...((data && [...data.classification.reduce((a: AssetTypeGroup[], b: AssetClass) => [...a, ...b.typeGroups],[])]) || [])
        //                     .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
        //                     .map(current => ({id: "" + current?.id  || "" , name: current?.name || "", value: current?.id || null} as EtfTypeOption))
        // ],
        // etfAllocations: ((data && [...data.etfAllocation]) || [])
        //                     .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
        //                     .map(current => current as EtfAllocation),
        // etfPositions: ((data && [...data.etfPosition]) || [])
        //                     .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
        //                     .map(current => current as EtfPosition),
        // etfRegions: ((data && [...data.etfRegions]) || [])
        //                     .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
        //                     .map(current => current as EtfRegion),
        // etfStrategies: ((data && [...data.etfStrategies]) || [])
        //                     .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
        //                     .map(current => current as EtfStrategy),
        // etfSectors: ((data && [...data.etfSectors]) || [])
        //                     .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
        //                     .map(current => current as EtfSector),
        // etfReplications: ((data && [...data.etfReplications]) || [])
        //                     .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
        //                     .map(current => current as EtfReplication),
        // etfIssuers: ((data && [...data.etfIssuers]) || [])
        //                     .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
        //                     .map(current => current as EtfIssuer)
    };

    // let overrideTypeId = state.overrideTypeId ? state.searchProps.typeId : value.etfTypes.filter(current => current.id != DEFAULT_ETF_OPTION_ID)[0].id;
    // let overrideSearchProps = {...state.searchProps, typeId: overrideTypeId};

    const updateCategory = (value: string) => {
        const cards = value == ALL_SELECTED ? COMMODITY_CARDS : COMMODITY_CARDS.filter(current => current.tags && current.tags.indexOf(value) >= 0);
        setState({ ...state, category: value, cards: cards });
    }


    return (
        <CommoditySearchContext.Provider value={value}>
            <div className="page-container">
                <ButtonGroup>
                    <Row className={`ml-2 ml-xl-3 ml-md-3 mt-3`}>
                        <Button className={classNames("tagcloud", ALL_SELECTED == state.category && "active")}
                                onClick={() => updateCategory(ALL_SELECTED)}>{ALL_SELECTED}</Button>
                        {
                            TAGS.map((current, index) =>
                                <Button key={index} onClick={() => current && updateCategory(current)} className={classNames("tagcloud ", current == state.category && "active")}
                                >
                                    {current}
                                </Button>
                            )
                        }
                    </Row>
                </ButtonGroup>
                <Container className="px-3">
                    <CommoditySearchCarousel cards={state.cards} 
                    // props={{
                    //     // ...overrideSearchProps,
                    //     typeId:  null
                    // }}
                    />
                </Container>
            </div>
        </CommoditySearchContext.Provider>
    );
}

interface CommoditySearchCarouselProps {
    cards: EtfSearchCard[];
    //props: GlobalEtfSearchProps;
}

function CommoditySearchCarousel({cards}: CommoditySearchCarouselProps) {
    const etfSearchCarouselItemsSize = useBootstrapBreakpoint({
        default: {itemsPerSlide: 4, showControls: true},
        md: {itemsPerSlide: 4, showControls: true},
        xl: {itemsPerSlide: 4, showControls: false}
    });

    return (
        <Carousel
            controlclass="dark-version"
            touch={true}
            prevIcon={
                <SvgImage color="black" icon="icon_direction_left_dark.svg"
                          spanClass="move-arrow svg-black" convert={true} />
            }
            nextIcon={
                <SvgImage color="black" icon="icon_direction_right_dark.svg"
                          spanClass="move-arrow svg-black" convert={true} />
            }
            controls={etfSearchCarouselItemsSize.showControls}
            indicators={etfSearchCarouselItemsSize.showControls}
            as={CarouselWrapper}
        >
            {
                createChunk(cards, etfSearchCarouselItemsSize.itemsPerSlide).map((items: EtfSearchCard[], index: number) =>
                    <CarouselItem key={index}>
                        <Row className="px-md-2 px-sm-0">                            
                            {
                                items.map((Card: EtfSearchCard, index: number) =>
                                    <Card key={"FundSearchPage-card-" + index} defaultSearchProps={undefined}/>
                                )
                            }
                        </Row>
                    </CarouselItem>
                )
            }
        </Carousel>
    );
}
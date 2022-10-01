import classNames from "classnames";
import React, {useContext} from "react";
import {Container, Spinner} from "react-bootstrap";
import DerivativeTag from "./DerivativeTag";
import {ConfigContext, FilterContext} from "../DerivativeSearch";
import {AssetClass, Query} from "../../../generated/graphql";
import {gql} from "graphql.macro";
import {useQuery} from "@apollo/client";
import FilterTag from "./FilterTag";
import {DerivativeSearchConfig} from "./types/DerivativeSearchTypes";
import UnderlyingTagNames from "./underlying/UnderlyingTagNames";


const getTopsFlops = gql`query getTopFlopInstruments {
    list(id: "topflop_instruments") {
        id
        content {
            id
            name
            group {
                id
                name
                seoTag
                assetGroup
            }
            exchange {
                id
                name
                code
            }
        }
    }
}`;
const getTopFlopContent = gql`query getTopFlopContent($groupId:Int!) {
        group(id: $groupId) {
            id
            name
            seoTag
            assetGroup
            content {
                id
                main
            }
            topFlop {
                instrument {
                    id
                    name
                    group {
                        id
                        name
                        seoTag
                        assetGroup
                        sector {
                            name
                        }
                    }
                    currency {
                        displayCode
                    }
                    exchange {
                        id
                        name
                        code
                    }
                }
                snapQuote {
                    lastChange
                    instrumentId
                    quote(type:TRADE) {
                        percentChange
                        value
                        when
                    }
                }
            }
        }
    }`


const TopFlopContent = function ({groupId, assetClass}: any) {
    const {getSearchConfig, setSearchConfig} = useContext(ConfigContext);
    const assetType = assetClass.types.length > 0 ? assetClass.types[0] : null;

    const tfContentLoader = useQuery<Query>(getTopFlopContent, {variables: {groupId: groupId}});
    return (
        <>
            {tfContentLoader.loading && <Spinner animation={"border"}/>}

            {
                !tfContentLoader.loading && tfContentLoader.data?.group?.topFlop &&
                tfContentLoader.data?.group?.topFlop
                    // .slice(0, 3)
                    // .concat(tfContentLoader.data?.group?.topFlop.slice(5, 8))
                    .map(
                        (current, index) =>
                            <UnderlyingTagNames
                                key={index}
                                assetName={current.instrument.group.assetGroup || undefined}
                                name={current.instrument.group.name}
                                change={current.snapQuote?.quote?.percentChange || 0}
                                onTagClick={() => {
                                    setSearchConfig({
                                        ...getSearchConfig(),
                                        underlying: current.instrument,
                                        assetClass: assetClass,
                                        assetType: assetType
                                    } as DerivativeSearchConfig)
                                }}
                            />
                    )
            }
        </>
    )
}

export const DerivativeAssetClassTagComponent = ({assetClass, tradedData, tradedType}: any) => {
    const assetType = assetClass.types.length > 0 ? assetClass.types[0] : null;
    const {getSearchConfig, setSearchConfig} = useContext(ConfigContext);
    const tfLoader = useQuery<Query>(getTopsFlops, {
        skip: tradedData
    });
    if (assetClass.name !== 'Optionsscheine' && assetClass.name !== 'Knock-Out') return null;


    if (tradedData) {
        return (
            <Container>
                <div id="derivative-search-tags">
                <h3 className="roboto-heading ml-2" style={{fontSize: '18px'}}>
                    {assetClass.name} auf {tradedType} Basiswerte</h3>
                <div className="derivative-tags-wrapper">
                    <div className="d-flex flex-wrap derivate-tags mb-4">
                        {
                            tradedData.list.content.map(
                                (current: any, index: number) =>
                                    <UnderlyingTagNames
                                    key={index}
                                    assetName={current.group?.assetGroup || current.instrument?.group?.assetGroup || undefined}
                                    name={current.group?.name || current.instrument?.group?.name}
                                    change={current.snapQuote?.quote?.percentChange || 0}
                                    onTagClick={() => {
                                        setSearchConfig({
                                            ...getSearchConfig(),
                                            underlying: current,
                                            assetClass: assetClass,
                                            assetType: assetType
                                        } as DerivativeSearchConfig)
                                    }}
                                />
                            )

                        }
                    </div>
                </div>
                </div>
            </Container>
        )

    }


    return (
        <Container>
            <div id="derivative-search-tags">
                {
                    !tfLoader.loading && tfLoader.data?.list?.content && (tfLoader.data?.list?.content?.length > 0) &&
                    tfLoader.data.list.content.map(
                        i =>
                            <>
                                <h3 className="roboto-heading ml-2" style={{fontSize: '18px'}}>{assetClass.name} auf
                                    Tops&Flops {i.group.name}</h3>
                                <div className="derivative-tags-wrapper">
                                    <div className="d-flex flex-wrap derivate-tags mb-4">
                                        <TopFlopContent groupId={i.group.id} assetClass={assetClass}/>
                                    </div>
                                </div>
                            </>
                    )
                }
            </div>
        </Container>
    );
}

export default DerivativeAssetClassTagComponent

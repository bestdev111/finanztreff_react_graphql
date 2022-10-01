import React, {useEffect, useState} from "react";
import {Container, Spinner, Tab} from "react-bootstrap";
import UnderlyingFilters, {FilterType} from "./filter/UnderlyingFilters";
import InvestmentProductAssetRow from "./investment-product/InvestmentProductAssetRow";
import AssetRow from "./AssetRow";
import CustomAssetRow from "./CustomAssetRow";
import {AssetGroup, Instrument, InstrumentTopFlop, Query} from "../../../generated/graphql";
import {useQuery,} from "@apollo/client";
import {GET_INSTRUMENTS_LIST, GET_MOST_SEARCHED, GET_TOP_FLOP_DAX} from "../../../graphql/query";
import {loader} from "graphql.macro";
import AssetClassText from "../../common/assetClassText/AssetClassText";

export function UnderlyingSection() {
    const [underlyingView, setUnderlyingView] = useState<'AllAssetsView' | 'customAssesSelectionView'>('AllAssetsView');
    const [assetType, setAssetType] = useState<FilterType>(FilterType.top5Dax);
    const [customAsset, setCustomAsset] = useState<Instrument | null>(null);
    const [instruments, setInstruments] = useState<InstrumentTopFlop[]>([]);

    const showAllAssets = (type: FilterType) => {
        setAssetType(type);
        setUnderlyingView('AllAssetsView');
    }

    const showCustomAsset = (asset: Instrument) => {
        setCustomAsset(asset);
        setUnderlyingView('customAssesSelectionView');
    }

    let qry: any = null; let v: any;
    switch (assetType) {
        case FilterType.top5Dax:
        case FilterType.worst5Dax:
            qry = GET_TOP_FLOP_DAX; v = {}
            break;
        case FilterType.top5Searched:
            qry = GET_MOST_SEARCHED; v ={}
            break;
        default:
            qry = GET_INSTRUMENTS_LIST; v = {variables: {id: "hot_instruments_by_trades"}}
            break;
    }

    const dataDax = useQuery(qry, v);

    const dataCategory = useQuery<Query>(loader('../search/getDerivativeTypeInput.graphql'))

    useEffect(() => {
        if (dataDax.data) {

            if (assetType === FilterType.top5Traded) {
                setInstruments(dataDax.data.list.content.filter((i: any) => i.group.underlying).slice(0, 5));
            }
            if (assetType === FilterType.top5Searched) {
                setInstruments(dataDax.data.list.content.filter((i: any) => i.group.underlying).slice(0, 5));
            }

            if (assetType === FilterType.top5Dax) {
                setInstruments(dataDax.data.list.content[0].group.topFlop.slice(0, 5).map((i: any) => {return {...i, ...i.instrument}}));
            }

            if (assetType === FilterType.worst5Dax) {
                setInstruments(dataDax.data.list.content[0].group.topFlop.slice(5).map((i: any) => {return {...i, ...i.instrument}}));
            }

        } else setInstruments([])
    }, [dataDax, assetType]);


    return <>
        <section className="main-section pt-md-3 pt-xl-3 pt-0">
            <Container>
                <h2 className="section-heading font-weight-bold d-none  d-lg-block">Basiswert-Auswahl</h2>
                <div className="content mt-md-n3 mt-xl-n1">
                    <UnderlyingFilters showAllAssets={showAllAssets}
                                       showCustomAsset={showCustomAsset}
                                       customAsset={customAsset?.name || ''}/>
                </div>
            </Container>
        </section>

        {
            dataDax.loading &&
            <div className={"p-3"} style={{height: "100px", width: "100%", textAlign: "center"}}><Spinner animation="border"/></div>
        }

        {
            !dataDax.loading &&
            <section className="main-section derivate-assets-rows derivative-asset-rows-wrapper">
                <Container>
                    <Tab.Container activeKey={underlyingView}>
                        <Tab.Content>
                            <Tab.Pane eventKey="AllAssetsView">

                                {
                                    dataCategory.loading ?
                                    <div className={"p-3"} style={{height: "100px", width: "100%", textAlign: "center"}}><Spinner animation="border"/></div>
                                        :
                                        dataCategory.data?.classification.filter(
                                            c => c.leveraged
                                        ).map(
                                            c =>
                                                <AssetRow key={c.id} title={c.name}
                                                          otherTitle={"Weitere " + (c.name === "Optionsscheine" ? "OS" : (c.name === "Knock-out" ? "KO" : c.name))}
                                                          showHeaderInfo={true} showTime={true}
                                                          type1={c.assetGroup === AssetGroup.Warr ? "call" : "long"}
                                                          type2={c.assetGroup === AssetGroup.Warr ? "put" : "short"}
                                                          assetType={assetType} assetClass={c} instruments={instruments}
                                                          showCustomAsset={showCustomAsset}
                                                          tags={['DAX', 'Xiaomi', 'Moderna', 'Tui', 'Siemens', 'Pfizer', 'Curevac', 'Alibaba', 'Bayer', 'Byd', 'Tesla', 'Sap', 'Lufthansa', 'Amazon', 'Nel']}
                                                          bottomInfo={(c.name === "Optionsscheine" ? "OS" : (c.name === "Knock-out" ? "KO" : c.name)) +
                                                              " mit größtem Hebel aus dem Bereich 10-20"} />
                                        )
                                }
                                <InvestmentProductAssetRow
                                    instruments={instruments.map(i => {return {...i, ...i.instrument} as Instrument}) || []}
                                    assetClasses={dataCategory.data?.classification?.filter(c => !c.leveraged) || []}
                                    assetType={assetType}
                                />
                            </Tab.Pane>

                            <Tab.Pane eventKey="customAssesSelectionView">
                                <CustomAssetRow title={customAsset?.name || ''} instrument={customAsset} assetClasses={dataCategory.data?.classification || []} />
                                <InvestmentProductAssetRow
                                    instruments={customAsset ? [customAsset] : []}
                                    assetClasses={dataCategory.data?.classification?.filter(c => !c.leveraged) || []}
                                    assetType={assetType}
                                />
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Container>
            </section>
        }
    </>;
}

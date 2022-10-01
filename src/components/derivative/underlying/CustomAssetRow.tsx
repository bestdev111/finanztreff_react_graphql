import React from "react";
import {Row} from "react-bootstrap";
import AssetRowTitle from "../common/AssetRowTitle";
import AssetRowHeaderInfo from "../common/AssetRowHeaderInfo";
import {CustomAssetMainCardLg, CustomAssetMainCardSm} from "./CustomAssetMainCard";
import {useBootstrapBreakpoint} from "../../../hooks/useBootstrapBreakpoint";
import {formatAssetGroup} from "../../../utils";
import {AssetClass, AssetGroup, Instrument} from "../../../generated/graphql";

interface CustomAssetRowProps {
    title: string;
    instrument: Instrument | null;
    assetClasses: AssetClass[];
}

export default function CustomAssetRow(props: CustomAssetRowProps) {

    const customAssetMainCardHeight = useBootstrapBreakpoint({
            default: "581px",
            xl: "581px",
            md: "674px",
            sm:"482px"
        }
    )

    return (<>
        <div className="assets-row">
            <h2 className="section-heading font-weight-bold d-none d-lg-block">
                Hebelprodukte auf die meistgehandelten Basiswerte
            </h2>
            <h2 className="fnt-size-20 section-heading font-weight-bold mt-5 d-lg-none " style={{fontFamily:"Roboto Slab"}}>Hebelprodukte</h2>
            <div className="content">
                <Row className="row-cols-xl-1 mt-4 d-none d-lg-flex">
                    <div className="col">
                        <div className="derivate-big-card single-whole-width">
                            <div className="top" style={{height:"37px"}}>
                                <AssetRowTitle title={props.instrument?.name || props.title}
                                               assetGroup={formatAssetGroup(props.instrument?.group?.assetGroup) }
                                               instrument={props.instrument}
                                />
                                <AssetRowHeaderInfo
                                    exchCode={props.instrument?.exchange?.code || ''}
                                    delay={props.instrument?.snapQuote?.quote?.delay || 0}
                                    percentChange={props.instrument?.snapQuote?.quote?.percentChange || 0}
                                    currencyCode={props.instrument?.currency.displayCode || ''}
                                    quoteValue={props.instrument?.snapQuote?.quote?.value}
                                    when={props.instrument?.snapQuote?.quote?.when}
                                    />
                            </div>
                            <Row className="row-cols-xl-3 row-cols-lg-3 gutter-16 padding-top-16" style={{height:customAssetMainCardHeight}}>
                                {
                                    props.assetClasses.filter(c => c.leveraged).map(
                                        c =>
                                            <CustomAssetMainCardLg type={c.name} otherTitle={"Weitere " + (c.name)}
                                                                   key={c.id}
                                                                   type1={c.assetGroup === AssetGroup.Warr ? "call" : "long"}
                                                                   type2={c.assetGroup === AssetGroup.Warr ? "put" : "short"}
                                                                   instrument={props.instrument} assetClassId={c.id}
                                                                   assetClassName={c.name} assetClassGroup={c.assetGroup}
                                                                   bottomInfo={c.name + " mit höchstem Hebel aus dem Bereich 10-20"} />
                                    )
                                }
                            </Row>
                        </div>
                    </div>
                </Row>
                <div className="mobile-vertical-cards d-lg-none">
                    <div className="derivate-big-card single-whole-width">
                        <div className="top">
                            <AssetRowTitle title={props.instrument?.name || props.title}
                                           assetGroup={formatAssetGroup(props.instrument?.group?.assetGroup) }
                                           instrument={props.instrument}
                            />
                        </div>
                        {
                            props.assetClasses.filter(c => c.leveraged).map(
                                c =>
                                    <CustomAssetMainCardSm type={c.name} otherTitle={"Weitere " + (c.name)} instrument={props.instrument}
                                                           key={c.id}
                                                           assetClassId={c.id} assetClassName={c.name} assetClassGroup={c.assetGroup}
                                                           bottomInfo={c.name + " mit höchstem Hebel aus dem Bereich 10-20"}
                                                           type1={c.assetGroup === AssetGroup.Warr ? "call" : "long"}
                                                           type2={c.assetGroup === AssetGroup.Warr ? "put" : "short"}
                                    />
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    </>);
}

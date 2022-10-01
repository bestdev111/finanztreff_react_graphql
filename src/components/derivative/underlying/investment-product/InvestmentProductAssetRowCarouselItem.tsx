import React from "react";
import InvestmentProductAssetRowCarouselItemCol from "./InvestmentProductAssetRowCarouselItemCol";
import {Row} from "react-bootstrap";
import {AssetClass, Instrument} from "../../../../generated/graphql";


export interface InvestmentProductAssetRowCarouselItemProps {
    instrument: Instrument;
    assetClasses: AssetClass[];
}

export default function InvestmentProductAssetRowCarouselItem({instrument, assetClasses}: InvestmentProductAssetRowCarouselItemProps) {
    return (<>
        <Row className="row-cols-xl-6 row-cols-lg-3 gutter-16">
            {
                assetClasses.slice(0, 6).map(
                    c =>
                        <InvestmentProductAssetRowCarouselItemCol key={c.id + "_" + instrument.id} assetClass={c} instrument={instrument} />
                )
            }
        </Row>
    </>);
}


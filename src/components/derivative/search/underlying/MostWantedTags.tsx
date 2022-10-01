import React from "react";
import MostWantedTagNames from "./MostWantedTagNames";

interface MostWantedTagsProps {
    heading: string
}

export const MostWantedTags = (props: MostWantedTagsProps) => {
    return (
        <>
            <div className="mt-5 d-none d-xl-block">
                <h3 className="roboto-heading ml-2" style={{fontSize: '18px'}}>{props.heading}</h3>
                <div className="d-flex flex-wrap">
                    <MostWantedTagNames assetName="AKTIE" name="Biontech" change="+ 0.40%" value="228,20 EUR"/>
                    <MostWantedTagNames assetName="AKTIE" name="Xiaomi" change="+ 0.40%" value="228,20 EUR"/>
                    <MostWantedTagNames assetName="AKTIE" name="DAX" change="+ 0.40%" value="228,20 EUR"/>
                    <MostWantedTagNames assetName="AKTIE" name="Tui" change="+ 0.40%" value="228,20 EUR"/>
                    <MostWantedTagNames assetName="AKTIE" name="Gold" change="+ 0.40%" value="228,20 EUR"/>
                    <MostWantedTagNames assetName="AKTIE" name="Pfizer" change="+ 0.40%" value="228,20 EUR"/>
                    <MostWantedTagNames assetName="AKTIE" name="Curevac" change="+ 0.40%" value="228,20 EUR"/>
                    <MostWantedTagNames assetName="AKTIE" name="Bayer" change="+ 0.40%" value="228,20 EUR"/>
                    <MostWantedTagNames assetName="AKTIE" name="Alibaba" change="+ 0.40%" value="228,20 EUR"/>
                    <MostWantedTagNames assetName="AKTIE" name="Biontech" change="+ 0.40%" value="228,20 EUR"/>
                    <MostWantedTagNames assetName="AKTIE" name="Biontech" change="+ 0.40%" value="228,20 EUR"/>
                    <MostWantedTagNames assetName="AKTIE" name="Biontech" change="+ 0.40%" value="228,20 EUR"/>
                    <MostWantedTagNames assetName="AKTIE" name="ALLIANZ" change="+ 0.40%" value="228,20 EUR"/>
                </div>
            </div>

        </>
    )
}

export default MostWantedTags

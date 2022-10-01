import React, {useContext} from 'react'
import {Container} from "react-bootstrap";
import UnderlyingTagNames from "./UnderlyingTagNames";
import {AssetGroup, Instrument, Query} from "../../../../generated/graphql";
import {ActiveConfigContext, ConfigContext} from "../../DerivativeSearch";
import {DerivativeSearchConfig} from "../types/DerivativeSearchTypes";
import {trigInfonline} from "../../../common/InfonlineService";

interface UnderlyingTagsProps {
    heading: string;
    data?: Instrument[] | any;
}

export const UnderlyingTags = ({heading, data}: UnderlyingTagsProps) => {
    const {getSearchConfig, setSearchConfig} = useContext(ConfigContext);
    const config = getSearchConfig();

    return (
        <>
            <Container className="pt-5 mt-n3">
                <h3 className="roboto-heading ml-n2 ml-xl-0" style={{fontSize: '18px'}}>{heading}</h3>
                <div className="d-flex flex-wrap ml-n3 ml-xl-n2">
                    {
                        data && data.map((content: Instrument, index: number) => (
                            content.group.assetGroup &&
                            <UnderlyingTagNames
                                key={index}
                                assetName={content.group.assetGroup}
                                name={content.group.name}
                                change={content.snapQuote?.quote?.percentChange || 0}
                                onTagClick={() => {
                                    trigInfonline('derivatives', 'underlying_tags')
                                    setSearchConfig({...config, underlying: content} as DerivativeSearchConfig)
                                }}
                            />
                        ))
                    }
                </div>
            </Container>
        </>
    )
}

export default UnderlyingTags;
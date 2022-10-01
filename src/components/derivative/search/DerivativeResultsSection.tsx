import React, {useContext, useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import './DerivativeTopSearch.scss'
import {DerivativeSearchResult} from "./DerivativeSearchResult";
import {ButtonItem} from "./filters/layout/ButtonItem";
import {
    AssetClass,
    AssetGroup,
    AssetType, AssetTypeGroup,
    DerivativeAssetTypeGroupBucket,
    DerivativeOptionType,
    Instrument
} from "../../../generated/graphql";
import {DerivativeFilterControl} from "./filters/DerivativeFilterControl";
import {DerivativeFilter, emptyDerivativeFilter} from "./types/DerivativeSearchTypes";
import {ActiveConfigContext, ConfigContext, DataContext, FilterContext} from "../DerivativeSearch";
import './inputStyle.scss'
import { trigInfonline } from "components/common/InfonlineService";

interface DerivativeResultsSectionProps {
    // underlyingAssetGroup?: AssetGroup | null,
    // underlyingInstrumentGroupId?: number | null;
    // assetGroup: AssetGroup | undefined;
    // assetTypes: AssetType[];
    // optionType?: DerivativeOptionType | null | undefined;
    // leverageFrom?: number | null | undefined;
    // leverageTo?: number | null | undefined;
    // issuerId?: number | null | undefined;
    // issuerName?: string | null | undefined;
    // instrument?: Instrument|null|undefined;
}


export const DerivativeResultsSection = (props: DerivativeResultsSectionProps) => {
    const {activeConfig, setActiveConfig} = useContext(ActiveConfigContext);
    const {getSearchConfig, setSearchConfig} = useContext(ConfigContext);
    const {getSearchFilter, setSearchFilter} = useContext(FilterContext);
    const {derivativeAssetTypeGroups} = useContext(DataContext);
    const coreData = useContext(DataContext);
    const assetClasses = coreData.derivativeTypeInput?.classification;

    const config = getSearchConfig ? getSearchConfig() : null;
    const filter = getSearchFilter ? getSearchFilter() : null;

    const setTab = function (assetTypeGroup: AssetTypeGroup | null | undefined) {
        if(config)
            setSearchConfig({...config, assetTypeGroup: assetTypeGroup ? {id: assetTypeGroup.id, name: assetTypeGroup.name} as AssetTypeGroup : null});
    }


    if(!assetClasses) return null;
    if(!derivativeAssetTypeGroups) return null;
    if(!config) return null;
    if(!filter) return null;


    return(
        <div className="derivative-filter-results-wrapper py-3 ">
            <Container className="bg-white pt-3">
                <div className="tab-section">
                    <div
                        className="border-bottom-1 border-border-gray pb-2 d-none d-xl-flex justify-content-start flex-wrap">
                        {
                            derivativeAssetTypeGroups &&
                            derivativeAssetTypeGroups.map((value: DerivativeAssetTypeGroupBucket) =>
                            value && value.assetTypeGroup &&
                            <ButtonItem className="py-2 button-fixed-results" key={value.assetTypeGroup.id}
                                        active={config?.assetTypeGroup?.id === value.assetTypeGroup.id}
                                        onClick={() => {setTab(value.assetTypeGroup);trigInfonline('derivatives', 'search_result')}}
                                        disabled={value.count === 0}
                            >
                                {value.assetTypeGroup.name}
                            </ButtonItem>
                        )
                        }
                    </div>

                    <DerivativeFilterControl />
                </div>

                {
                    config.underlying && config.assetClass && config.assetTypeGroup &&
                    <DerivativeSearchResult />
                }
            </Container>
        </div>
    )
}

export default DerivativeResultsSection;

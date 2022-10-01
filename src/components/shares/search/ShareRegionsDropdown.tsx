import React, {useContext} from "react";
import {ShareRegionOption} from "./utils";
import {CriteriaState} from "./BaseShareSearchCard";
import ShareSearchContext from "./ShareSearchContext";
import {FilterDropdownItem} from "../../common/SearchCard/FilterDropdownItem";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";
export const ShareRegionsDropdown = (props: CriteriaState<any>) => {
    const metaDataContext = useContext(ShareSearchContext);
    return (
        <>
            <FilterDropdownItem<ShareRegionOption & {value: string}>
                onSelect={(option: ShareRegionOption & {value: string}) => {
                    props.setCriteria({ ...props.state, regionId: parseInt(option?.id)});
                }}
                options={metaDataContext?.shareRegions as any}
                activeId={props.state?.regionId as unknown as string}
            />
        </>
    )
}

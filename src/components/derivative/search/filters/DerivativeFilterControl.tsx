import React, {useContext, useEffect, useState} from "react";
import {useBootstrapBreakpoint} from "../../../../hooks/useBootstrapBreakpoint";
import {FiltersGroup} from "./FiltersGroup";
import {DropdownButton} from "./layout/DropdownButton";
import {Modal} from "react-bootstrap";
import {ModalHeader} from "./layout/ModalHeader";
import {ButtonItem} from "./layout/ButtonItem";
import {AssetClass, AssetType, DerivativeOptionType, Instrument, Issuer} from "../../../../generated/graphql";
import {CallFilter} from "./buttons/CallFilter";
import {PutFilter} from "./buttons/PutFilter";
import {LongFilter} from "./buttons/LongFilter";
import {ShortFilter} from "./buttons/ShortFilter";
import moment from "moment";
import Moment from "moment";
import {DerivativeFilter, emptyDerivativeFilter} from "../types/DerivativeSearchTypes";
import {ActiveConfigContext, ConfigContext, DataContext, FilterContext} from "../../DerivativeSearch";
import ExpressResultTable from "../table-body/ExpressResultTable";

export function DerivativeFilterControl() {
    const {activeConfig, setActiveConfig} = useContext(ActiveConfigContext);
    const {getSearchConfig, setSearchConfig} = useContext(ConfigContext);
    const {getSearchFilter, setSearchFilter} = useContext(FilterContext);
    const coreData = useContext(DataContext);
    const assetClasses = coreData.derivativeTypeInput?.classification;

    const config = getSearchConfig ? getSearchConfig() : null;
    const filter = getSearchFilter ? getSearchFilter() : null;

    const [showTypeModal, setShowTypeModal] = useState<boolean>(false);

    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });


    const getFilterForActiveTab = () => {
        return getSearchFilter();
    }

    const calculateMaturityDate = (filter: DerivativeFilter) => {
        let _from: any = null;
        let _to: any = null;

        if (filter.runningTime.from || filter.runningTime.to) {
            _from = moment();
            _to = moment();

            if (filter.runningTime.from) {
                if (Moment.isDate(filter.runningTime.from)) {
                    _from = moment(filter.runningTime.from);
                } else {
                    _from.add(filter.runningTime.from, "months");
                }
            }

            if (filter.runningTime.to) {
                if (Moment.isDate(filter.runningTime.to)) {
                    _to = moment(filter.runningTime.to);
                } else {
                    _to.add(filter.runningTime.to, "months");
                }
            }

            _from = _from.format('YYYY-MM-DD');
            _to = _to.format('YYYY-MM-DD');
        }

        return {from: _from, to: _to}
    }

    const setFilterForActiveTab = (filter: DerivativeFilter) => {
        filter.maturityDate = calculateMaturityDate(filter);
        setSearchFilter({...filter}, null);
    }

    const updateFilter = function (newFilter: DerivativeFilter) {
        setFilterForActiveTab(newFilter);
    }

    let filterContent: any;

    if(!config?.assetTypeGroup?.id) {
        filterContent = <FiltersGroup
            filters={["SonstigeTypFilter", "PerformanceFilter", "LeverageFilter", "IssuerFilter"]}
            isDesktop={isDesktop}
            getFilterForActiveTab={getFilterForActiveTab}
            updateFilter={updateFilter}/>
    } else
    switch (config?.assetTypeGroup?.id) {
        case "WARR_CLASSIC" :
            filterContent = <FiltersGroup
                filters={["CallFilter", "PutFilter", "LeverageFilter", "UnderlyingFilter", "RunningTimeFilter", "IssuerFilter"]}
                isDesktop={isDesktop}
                getFilterForActiveTab={getFilterForActiveTab}
                updateFilter={updateFilter}/>
            break;

        case "WARR_DISCOUNT" :
            filterContent = <FiltersGroup
                filters={["CallFilter", "PutFilter", "UnderlyingCapFilter", "RunningTimeFilter", "IssuerFilter"]}
                isDesktop={isDesktop}
                getFilterForActiveTab={getFilterForActiveTab}
                updateFilter={updateFilter}/>
            break;

        case "WARR_OTHER_DOWN_OUT":
        case "WARR_OTHER" :
            filterContent = <FiltersGroup
                filters={["CallFilter", "PutFilter", "HitSchwelleFilter", "RunningTimeFilter", "IssuerFilter"]}
                isDesktop={isDesktop}
                getFilterForActiveTab={getFilterForActiveTab}
                updateFilter={updateFilter}/>
            break;

        case "WARR_INLINE" :
            filterContent = <FiltersGroup
                filters={["CallFilter", "PutFilter", "BarrierObenUntenFilter", "RunningTimeFilter", "IssuerFilter"]}
                isDesktop={isDesktop}
                getFilterForActiveTab={getFilterForActiveTab}
                updateFilter={updateFilter}/>
            break;

        case "KNOCK_X_TURBO_OPEN_END" :
        case "KNOCK_CLASSIC" :
        case "KNOCK_OPEN_END_WITH_SL" :
        case "KNOCK_OPEN_END_WITHOUT_SL" :
        case "KNOCK_X_TURBO" :
        case "KNOCK_SMART" :
        case "622" :
        case "623" :
        case "KNOCK_CLASSIC" :
        case "626" :
        case "630" :
        case "633" :

            filterContent =
                <FiltersGroup
                    filters={["LongFilter", "ShortFilter", "LeverageFilter", "StrikeStopLossFilter", "DiffStopLossFilter", "RunningTimeFilter", "IssuerFilter"]}
                    isDesktop={isDesktop}
                    getFilterForActiveTab={getFilterForActiveTab}
                    updateFilter={updateFilter}/>
            break;

        case "CERT_FACTOR_OTHER" :
        case "CERT_FACTOR_ALL":
            filterContent =
                <FiltersGroup filters={["LongFilter", "ShortFilter", "LeverageFilter", "IssuerFilter"]}
                              isDesktop={isDesktop}
                              getFilterForActiveTab={getFilterForActiveTab}
                              updateFilter={updateFilter}/>
            break;


        case "CERT_REVERSE_CLASSIC_PROTECT":
        case "CERT_REVERSE_OTHER_PROTECT_EASY":
        case "552":
            filterContent =
                <FiltersGroup
                    filters={["ZinsFilter", "MaxRenditeFilter", "SWRenditeFilter", "RunningTimeFilter", "IssuerFilter"]}
            // "LeverageFilter"
                    isDesktop={isDesktop}
                    getFilterForActiveTab={getFilterForActiveTab}
                    updateFilter={updateFilter}/>
            break;


        case "553":
        case "554":
        case "555":
        case "556":
        case "CERT_REVERSE_OTHER":
            filterContent =
                <FiltersGroup
                    filters={["PerformanceFilter", "RunningTimeFilter", "IssuerFilter"]}
                    //"LeverageFilter"
                    isDesktop={isDesktop}
                    getFilterForActiveTab={getFilterForActiveTab}
                    updateFilter={updateFilter}/>
            break;

        case "591":
        case "CERT_BONUS_CAPPED":
        case "CERT_BONUS_CAPPED_MULTI":
        case "CERT_BONUS_CAPPED_PRO":
        case "CERT_BONUS_CLASSIC":
        case "CERT_BONUS_MULTI":
        case "CERT_BONUS_PRO":
        case "CERT_BONUS_REVERSE":
        case "CERT_BONUS_REVERSE_CAP":
            filterContent =
                <FiltersGroup filters={["BonuslevelBarriereFilter", "BonusRenditeFilter",
                    "BonusPufferFilter", "BonusAufgeldFilter", "BonusBarrierGebrochenFilter", "BonusQuantoFilter",
                    "RunningTimeFilter", "IssuerFilter"]}
                              isDesktop={isDesktop}
                              getFilterForActiveTab={getFilterForActiveTab}
                              updateFilter={updateFilter}/>
            break;
        case "CERT_BONUS_OTHER":
            filterContent =
                <FiltersGroup filters={["BonusQuantoFilter",
                    "RunningTimeFilter", "IssuerFilter"]}
                              isDesktop={isDesktop}
                              getFilterForActiveTab={getFilterForActiveTab}
                              updateFilter={updateFilter}/>
            break;

        case "CERT_DISC_CLASSIC_PROTECT_PROTECT_PRO":
            filterContent =
                <FiltersGroup
                    filters={["DiscountCapFilter", "DiscountDiscountFilter", "MaxRenditeFilter",
                        "SWRenditeFilter", "BonusQuantoFilter", "RunningTimeFilter", "IssuerFilter"]}
                    isDesktop={isDesktop}
                    getFilterForActiveTab={getFilterForActiveTab}
                    updateFilter={updateFilter}/>
            break;

        case "561":
        case "562":
        case "563":
        case "564":
        case "565":
        case "CERT_DISC_OTHER":
            filterContent =
                <FiltersGroup filters={["PerformanceFilter", "BonusQuantoFilter",
                    "RunningTimeFilter", "IssuerFilter"]}
                              isDesktop={isDesktop}
                              getFilterForActiveTab={getFilterForActiveTab}
                              updateFilter={updateFilter}/>
            break;

        case "CERT_EXPRESS_CLASSIC":
        case "568":
        case "569":
        case "570":
        case "573":
        case "574":
        case "575":
        case "CERT_EXPRESS_OTHER":
            filterContent =
                <FiltersGroup
                    filters={["PerformanceFilter", "RunningTimeFilter", "IssuerFilter"]}
                    // filters={["ExpressTypFilter", "ExpressAbstandBarriereFilter", "PerformanceFilter", "RunningTimeFilter", "IssuerFilter"]}
                    isDesktop={isDesktop}
                    getFilterForActiveTab={getFilterForActiveTab}
                    updateFilter={updateFilter}/>
            break;

/// INDEX CERT
        case "CERT_INDEX_CLASSIC":
            filterContent =
                <FiltersGroup
                    filters={["PerformanceFilter", "BonusQuantoFilter", "RunningTimeFilter", "IssuerFilter"]}
                    isDesktop={isDesktop}
                    getFilterForActiveTab={getFilterForActiveTab}
                    updateFilter={updateFilter}/>
            break;

        case "CERT_INDEX_REVERSE":
        case "CERT_INDEX_OTHER":
            filterContent =
                <FiltersGroup
                    filters={["PerformanceFilter", "RunningTimeFilter", "IssuerFilter"]}
                    isDesktop={isDesktop}
                    getFilterForActiveTab={getFilterForActiveTab}
                    updateFilter={updateFilter}/>
            break;

        case "CERT_CAP_PROTECTION_ALPHA":
        case "CERT_CAP_PROTECTION_OTHER":
        case "CERT_CAP_PROTECTION_CLASSIC":
            filterContent =
                <FiltersGroup
                    filters={["PerformanceFilter", "KapitalMagemantFilter", "RunningTimeFilter", "IssuerFilter"]}
                    isDesktop={isDesktop}
                    getFilterForActiveTab={getFilterForActiveTab}
                    updateFilter={updateFilter}/>
            break;

        case "607":
        case "608":
        case "609":
        case "614":
            filterContent =
                <FiltersGroup
                    filters={["PartizipationFilter", "PerformanceFilter", "OutperfAufgeldFilter", "RunningTimeFilter", "IssuerFilter"]}
                    isDesktop={isDesktop}
                    getFilterForActiveTab={getFilterForActiveTab}
                    updateFilter={updateFilter}/>
            break;

        case "610":
        case "611":
        case "612":
        case "613":
            filterContent =
                <FiltersGroup
                    filters={["BandbreiteFilter", "PerformanceFilter", "MaxRenditeFilter", "RunningTimeFilter", "IssuerFilter"]}
                    isDesktop={isDesktop}
                    getFilterForActiveTab={getFilterForActiveTab}
                    updateFilter={updateFilter}/>
            break;




    }

    const tab = config?.assetTypeGroup?.id;

    const getTabName = function (tab: string | null | undefined) {
        let name: string | null | undefined;
        assetClasses.forEach((t: AssetClass) => {
            if (t.assetGroup === tab) name = t.name
        })
        return name || "";
    }


    if(!config?.assetTypeGroup) return null;

    return (
        <>
            <div className="derivative-results-filters d-flex align-content-between w-100 flex-wrap">
                <DropdownButton text="Typ" className="d-xl-none w-auto mr-3 " subText={getTabName(tab)}
                                onClick={() => setShowTypeModal(!showTypeModal)}
                                style={{maxWidth: "10em", overflow: "hidden"}}/>
                <Modal show={showTypeModal} className="d-xl-none bottom modal-dialog-sky-placement"
                       contentClassName="bg-white"
                       onHide={() => setShowTypeModal(false)}>
                    <ModalHeader title="Typ auswahlen" close={() => setShowTypeModal(false)}/>
                    <div className="mx-auto mb-4 w-100 px-3">
                        {
                            (config  && config?.assetClass && config?.assetClass?.typeGroups)  &&
                            config.assetClass.typeGroups.map(value =>
                                <ButtonItem className="py-2" key={value.id}
                                            active={tab === value.id}
                                            onClick={() => {
                                                setSearchConfig({...config, assetTypeGroup: value})
                                            }}>
                                    {value.name}
                                </ButtonItem>)
                        }
                    </div>
                </Modal>
                <div className="derivative-results-filters d-flex flex-wrap">
                    {filterContent}

                    {/*<div className={""}>*/}
                    {/*    <PutFilter filter={getFilterForActiveTab()}*/}
                    {/*               onChange={(newFilter) => updateFilter(newFilter)}/>*/}
                    {/*    <CallFilter filter={getFilterForActiveTab()}*/}
                    {/*                onChange={(newFilter) => updateFilter(newFilter)}/>*/}
                    {/*</div>*/}
                </div>
            </div>
        </>
    )
}

export interface DerivativeFilterProps {
    activeTab: string | undefined | null;
    assetTypes: AssetType[];
    getTabName: any;
    currentFilter: DerivativeFilter | null | undefined;
    onTabChange: (newTab: string) => any;
    onFilterChange: (filter: DerivativeFilter) => any;
}




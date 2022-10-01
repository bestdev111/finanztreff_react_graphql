import {CallFilter} from "./buttons/CallFilter";
import {PutFilter} from "./buttons/PutFilter";
import {LeverageFilter} from "./buttons/LeverageFilter";
import {UnderlyingFilter} from "./buttons/UnderlyingFilter";
import {RunningTimeFilter} from "./buttons/RunningTimeFilter";
import {IssuerFilter} from "./buttons/IssuerFilter";
import React, {useContext, useState} from "react";
import {DropdownButton} from "./layout/DropdownButton";
import {CSSTransition} from "react-transition-group";
import {SvgCancel} from "../../../common/svg/svg-cancel";
import {SvgCheck} from "../../../common/svg/svg-check";
import {CapFilter} from "./buttons/UnderlyingCapFilter";
import {HitSchwelleFilter} from "./buttons/HitSchwelleFilter";
import {BarrierObenUntenFilter} from "./buttons/BarrierObenUntenFilter";
import {LongFilter} from "./buttons/LongFilter";
import {ShortFilter} from "./buttons/ShortFilter";
import {StrikeStopLossFilter} from "./buttons/StrikeStopLossFilter";
import {DiffStopLossFilter} from "./buttons/DiffStopLossFilter";
import {ActiveConfigContext, ConfigContext, DataContext, FilterContext} from "../../DerivativeSearch";
import {SelectFromListFilter} from "./buttons/SelectFromListFilter";
import {BonuslevelBarriereFilter} from "./buttons/BonuslevelBarriereFilter";
import {DiscountCapFilter} from "./buttons/DiscountCapFilter";
import {ExpressAbstandBarriereFilter} from "./buttons/ExpressAbstandBarriereFilter";
import {BandbreiteFilter} from "./buttons/BandbreiteFilter";
import {PerformanceFilter} from "./buttons/PerformanceFilter";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

export function FiltersGroup({filters, isDesktop, getFilterForActiveTab, updateFilter}: any) {
    const [activeContent, setActiveContent] = useState<string | null>(null);
    const [showFiltersModal, setShowFiltersModal] = useState(false);

    const {activeConfig, setActiveConfig} = useContext(ActiveConfigContext);
    const {getSearchConfig, setSearchConfig} = useContext(ConfigContext);
    const {getSearchFilter, setSearchFilter} = useContext(FilterContext);
    const coreData = useContext(DataContext);
    const assetClasses = coreData.derivativeTypeInput?.classification;

    const config = getSearchConfig ? getSearchConfig() : null;
    const filter = getSearchFilter ? getSearchFilter() : null;

    const countActiveFilters = function () {
        let cnt = 0;

        if (filter) {
            filters.forEach(
                (f: string) => {
                    switch (f) {
                        // case "CallFilter":
                        //     if (filter.callPut === "CALL") cnt++;
                        //     break;
                        //
                        // case "PutFilter":
                        //     if (filter.callPut === "PUT") cnt++;
                        //     break;
                        //
                        // case "LongFilter":
                        //     if (filter.callPut === "CALL") cnt++;
                        //     break;
                        //
                        // case "ShortFilter":
                        //     if (filter.callPut === "PUT") cnt++;
                        //     break;

                        case "LeverageFilter":
                            if (filter.leverage.from || filter.leverage.to) cnt++;
                            break;

                        case "UnderlyingFilter":
                            if (filter.osWert.from || filter.osWert.to || filter.basisprise.period.from || filter.basisprise.period.to) cnt++;
                            break;

                        case "RunningTimeFilter":
                            if (filter.runningTime.from || filter.runningTime.to) cnt++;
                            break;

                        case "IssuerFilter":
                            if (filter.issuers.length > 0) cnt++;
                            break;

                        case "UnderlyingCapFilter":
                            if (filter.cap.period.from || filter.cap.period.to) cnt++;
                            break;

                        case "HitSchwelleFilter":
                            if (filter.hitSchwelle.period.from || filter.hitSchwelle.period.to) cnt++;
                            break;

                        case "BarrierObenUntenFilter":
                            if (filter.oben.period.from || filter.oben.period.to) cnt++;
                            break;

                        case "BonuslevelBarriereFilter":
                            if (filter.bonusLevel.period.from || filter.bonusLevel.period.to) cnt++;
                            break;

                        case "StrikeStopLossFilter":
                            if (filter.basisprise.period.from || filter.basisprise.period.to || filter.stopLoss.period.from || filter.stopLoss.period.to) cnt++;
                            break;

                        case "DiffStopLossFilter":
                            if (filter.diffSL.from || filter.diffSL.to) cnt++;
                            break;
                    }
                }
            );
        }

        return (cnt > 0) ? cnt + " aktiv" : "";
    }

    const applyFilter = function () {
        setShowFiltersModal(false);
    }

    const cancelFilter = function () {
        setShowFiltersModal(false);
    }


    const build = (isDesktop: boolean, isButton: boolean = false) => {
        const _class = isButton ? "m-3" : "d-none d-sm-block w-auto mr-3 mt-3";

        return (
            <>
                {
                    filters.map(
                        (f: string) => {
                            let control = null;

                            if (isDesktop)
                                switch (f) {
                                    case "CallFilter":
                                        control =
                                            <CallFilter filter={getFilterForActiveTab()}
                                                        onChange={(newFilter) => updateFilter(newFilter)}
                                                        key={config?.assetTypeGroup?.id + f}/>
                                        break;

                                    case "PutFilter":
                                        control =
                                            <PutFilter filter={getFilterForActiveTab()}
                                                       onChange={(newFilter) => updateFilter(newFilter)}
                                                       key={config?.assetTypeGroup?.id + f}/>
                                        break;

                                    case "LongFilter":
                                        control =
                                            <LongFilter filter={getFilterForActiveTab()}
                                                        onChange={(newFilter) => updateFilter(newFilter)}
                                                        key={config?.assetTypeGroup?.id + f}/>
                                        break;

                                    case "ShortFilter":
                                        control =
                                            <ShortFilter filter={getFilterForActiveTab()}
                                                         onChange={(newFilter) => updateFilter(newFilter)}
                                                         key={config?.assetTypeGroup?.id + f}/>
                                        break;
                                }

                            switch (f) {
                                case "LeverageFilter":
                                    control =
                                        <LeverageFilter className={_class} currentFilter={getFilterForActiveTab()}
                                                        onFilterChange={(newFilter) => updateFilter(newFilter)}
                                                        showButton={isButton || isDesktop} showContent={!isButton}
                                                        key={config?.assetTypeGroup?.id + f}
                                                        contentActive={activeContent === "LeverageFilter"}
                                                        onVisbilityChange={(visibility) => {
                                                            setActiveContent(visibility ? "LeverageFilter" : "")
                                                        }}
                                                        onClick={() => {setActiveContent("LeverageFilter");
                                                        trigInfonline(guessInfonlineSection(),'search_result')
                                                        }}/>
                                    break;

                                case "UnderlyingFilter":
                                    control =
                                        <UnderlyingFilter className={_class} currentFilter={getFilterForActiveTab()}
                                                          onFilterChange={(newFilter) => updateFilter(newFilter)}
                                                          showButton={isButton || isDesktop} showContent={!isButton}
                                                          key={config?.assetTypeGroup?.id + f}
                                                          contentActive={activeContent === "UnderlyingFilter"}
                                                          onVisbilityChange={(visibility) => {
                                                              setActiveContent(visibility ? "UnderlyingFilter" : "")
                                                          }}
                                                          onClick={() =>{ setActiveContent("UnderlyingFilter");
                                                          trigInfonline(guessInfonlineSection(),'search_result')
                                                          }}/>
                                    break;

                                case "RunningTimeFilter":
                                    control =
                                        <RunningTimeFilter className={_class} currentFilter={getFilterForActiveTab()}
                                                           onFilterChange={(newFilter) => updateFilter(newFilter)}
                                                           showButton={isButton || isDesktop} showContent={!isButton}
                                                           key={config?.assetTypeGroup?.id + f}
                                                           contentActive={activeContent === "RunningTimeFilter"}
                                                           onVisbilityChange={(visibility) => {
                                                               setActiveContent(visibility ? "RunningTimeFilter" : "")
                                                           }}
                                                           onClick={() => {setActiveContent("RunningTimeFilter");
                                                           trigInfonline(guessInfonlineSection(),'search_result')
                                                           }}/>
                                    break;

                                case "IssuerFilter":
                                    control =
                                        <IssuerFilter className={_class} currentFilter={getFilterForActiveTab()}
                                                      onFilterChange={(newFilter) => updateFilter(newFilter)}
                                                      showButton={isButton || isDesktop} showContent={!isButton}
                                                      key={config?.assetTypeGroup?.id + f}
                                                      contentActive={activeContent === "IssuerFilter"}
                                                      onVisbilityChange={(visibility) => {
                                                          setActiveContent(visibility ? "IssuerFilter" : "")
                                                      }}
                                                      onClick={() => {setActiveContent("IssuerFilter");
                                                      trigInfonline(guessInfonlineSection(),'search_result')
                                                      }}/>
                                    break;

                                case "UnderlyingCapFilter":
                                    control =
                                        <CapFilter className={_class} currentFilter={getFilterForActiveTab()}
                                                   onFilterChange={(newFilter) => updateFilter(newFilter)}
                                                   showButton={isButton || isDesktop} showContent={!isButton}
                                                   key={config?.assetTypeGroup?.id + f}
                                                   contentActive={activeContent === "UnderlyingCapFilter"}
                                                   onVisbilityChange={(visibility) => {
                                                       setActiveContent(visibility ? "UnderlyingCapFilter" : "")
                                                   }}
                                                   onClick={() => setActiveContent("UnderlyingCapFilter")}/>
                                    break;

                                case "DiscountCapFilter":
                                    control =
                                        <DiscountCapFilter className={_class} currentFilter={getFilterForActiveTab()}
                                                   onFilterChange={(newFilter) => updateFilter(newFilter)}
                                                   showButton={isButton || isDesktop} showContent={!isButton}
                                                   key={config?.assetTypeGroup?.id + f}
                                                   contentActive={activeContent === "DiscountCapFilter"}
                                                   onVisbilityChange={(visibility) => {
                                                       setActiveContent(visibility ? "DiscountCapFilter" : "")
                                                   }}
                                                   onClick={() => setActiveContent("DiscountCapFilter")}/>
                                    break;

                                // case "HitSchwelleFilter":
                                //     control =
                                //         <HitSchwelleFilter className={_class} currentFilter={getFilterForActiveTab()}
                                //                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                //                            showButton={isButton || isDesktop} showContent={!isButton} key={activeTab+f}
                                //                            contentActive={activeContent === "HitSchwelleFilter"}
                                //                            onVisbilityChange={(visibility) => {
                                //                                setActiveContent(visibility ? "HitSchwelleFilter" : "")
                                //                            }}
                                //                            onClick={() => setActiveContent("HitSchwelleFilter")}/>
                                //     break;

                                case "BarrierObenUntenFilter":
                                    control =
                                        <BarrierObenUntenFilter className={_class}
                                                                currentFilter={getFilterForActiveTab()}
                                                                onFilterChange={(newFilter) => updateFilter(newFilter)}
                                                                showButton={isButton || isDesktop}
                                                                showContent={!isButton} key={config?.assetTypeGroup?.id + f}
                                                                contentActive={activeContent === "BarrierObenUntenFilter"}
                                                                onVisbilityChange={(visibility) => {
                                                                    setActiveContent(visibility ? "BarrierObenUntenFilter" : "")
                                                                }}
                                                                onClick={() => setActiveContent("BarrierObenUntenFilter")}/>
                                    break;

                               case "BonuslevelBarriereFilter":
                                    control =
                                        <BonuslevelBarriereFilter className={_class}
                                                                currentFilter={getFilterForActiveTab()}
                                                                onFilterChange={(newFilter) => updateFilter(newFilter)}
                                                                showButton={isButton || isDesktop}
                                                                showContent={!isButton} key={config?.assetTypeGroup?.id + f}
                                                                contentActive={activeContent === "BonuslevelBarriereFilter"}
                                                                onVisbilityChange={(visibility) => {
                                                                    setActiveContent(visibility ? "BonuslevelBarriereFilter" : "")
                                                                }}
                                                                onClick={() => setActiveContent("BonuslevelBarriereFilter")}/>
                                    break;

                                case "StrikeStopLossFilter":
                                    control =
                                        <StrikeStopLossFilter className={_class} currentFilter={getFilterForActiveTab()}
                                                              onFilterChange={(newFilter) => updateFilter(newFilter)}
                                                              showButton={isButton || isDesktop} showContent={!isButton}
                                                              key={config?.assetTypeGroup?.id + f}
                                                              contentActive={activeContent === "StrikeStopLossFilter"}
                                                              onVisbilityChange={(visibility) => {
                                                                  setActiveContent(visibility ? "StrikeStopLossFilter" : "")
                                                              }}
                                                              onClick={() => setActiveContent("StrikeStopLossFilter")}/>
                                    break;

                                case "ShareReverseClasicTypFilter":
                                    control =
                                        <SelectFromListFilter
                                            values={["Alle", ...coreData.derivativeAssetTypeTyps?.filter((t: any) => t.count > 0).map((t: any) => t.assetType.name) || []]}
                                            filterKey={"typ"} shortTitle={"Typ"} fullTitle={"Typ"}
                                            className={_class}
                                            currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop}
                                            showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "ShareReverseClasicTypFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "ShareReverseClasicTypFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("ShareReverseClasicTypFilter")}/>
                                    break;

                                case "ShareReverseOthersTypFilter":
                                    control =
                                        <SelectFromListFilter
                                            // values={["Multi", "Multi Protect", "Floater"]}
                                            values={["Alle", ...coreData.derivativeAssetTypeTyps?.map((t: any) => t.assetType.name) || []]}
                                            filterKey={"typ"} shortTitle={"Typ"} fullTitle={"Typ"}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "ShareReverseOthersTypFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "ShareReverseOthersTypFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("ShareReverseOthersTypFilter")}/>
                                    break;

                                case "ZinsFilter1":
                                    control =
                                        <SelectFromListFilter
                                            values={[">= 5%", ">= 10%", ">= 20%", ">= 30%"]}
                                            filterKey={"zins"} shortTitle={"Zins p.a."} fullTitle={"Zins p.a."}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "ShareReverseOthersTypFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "ShareReverseOthersTypFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("ShareReverseOthersTypFilter")}/>
                                    break;

                                case "MaxRenditeFilter":
                                    control =
                                        <SelectFromListFilter
                                            values={["< 5%", "5%-10%", "10%-15%", "15%-20%", "20%-25%", "25%-30%", ">30%"]}
                                            filterKey={"maxRendite"} shortTitle={"Max. Rendite p.a."} fullTitle={"Max. Rendite p.a."}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "ShareReverseOthersTypFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "ShareReverseOthersTypFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("ShareReverseOthersTypFilter")}/>
                                    break;

                                case "SWRenditeFilter":
                                    control =
                                        <SelectFromListFilter
                                            values={["< 5%", "5%-10%", "10%-15%", "15%-20%", "20%-25%", ">30%"]}
                                            filterKey={"swRendite"} shortTitle={"SW Rendite p.a."} fullTitle={"SW Rendite p.a."}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "ShareReverseOthersTypFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "ShareReverseOthersTypFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("ShareReverseOthersTypFilter")}/>
                                    break;

                                case "PerformanceFilter":
                                    control =
                                        <PerformanceFilter
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "ShareReverseOthersTypFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "ShareReverseOthersTypFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("ShareReverseOthersTypFilter")}/>
                                    break;

                                case "BonusClassicTypFilter":
                                    control =
                                        <SelectFromListFilter
                                            // values={["Alle", "Classic", "Cap", "Pro", "Pro Cap"]}
                                            values={["Alle", ...coreData.derivativeAssetTypeTyps?.map((t: any) => t.assetType.name) || []]}
                                            filterKey={"typ"} shortTitle={"Typ"} fullTitle={"Typ"}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "BonusClassicTypFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "BonusClassicTypFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("BonusClassicTypFilter")}/>
                                    break;

                                case "BonusPufferFilter":
                                    control =
                                        <SelectFromListFilter
                                            values={["alle", "> 1%", "< 5%", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%",
                                                "> 30%", "> 35%", "> 40%", "> 45%", "> 50%"]}
                                            filterKey={"bonusPuffer"} shortTitle={"Bonuspuffer"} fullTitle={"Bonuspuffer"}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "BonusPufferFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "BonusPufferFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("BonusPufferFilter")}/>
                                    break;

                                case "BonusRenditeFilter":
                                    control =
                                        <SelectFromListFilter
                                            values={["alle", "> 2.5%", "> 5.0%", "> 7.5%", "> 10.0%", "> 12.5%", "> 15.0%", "> 20.0%",  "> 25.0%"]}
                                            filterKey={"bonusRendite"} shortTitle={"Bonusrendite p.a."} fullTitle={"Bonusrendite p.a."}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "BonusRenditeFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "BonusRenditeFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("BonusRenditeFilter")}/>
                                    break;

                                case "BonusAufgeldFilter":
                                    control =
                                        <SelectFromListFilter
                                            values={["alle", "< -20.0%", "< -10.0%", "< -2.5%", "< -1.0%", "< 0%", "< 1.0%",
                                                "< 1.0%", "< 2.5%", "< 3.0%", "< 4.0%", "< 5.0%", "< 7.5%", "< 10.0%",
                                                "< 20.0%", "< 30.0%", "> 30.0%"]}
                                            filterKey={"bonusAufgeld"} shortTitle={"Aufgeld p.a."} fullTitle={"Aufgeld p.a."}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "BonusRenditeFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "BonusRenditeFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("BonusRenditeFilter")}/>
                                    break;

                                case "BonusBarrierGebrochenFilter":
                                    control =
                                        <SelectFromListFilter
                                            values={["beliebig", "nein", "ja"]}
                                            filterKey={"bonusBarrierGebrochen"} shortTitle={"Barrierе Gebrochen"} fullTitle={"Barrierе Gebrochen"}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "BonusBarrierGebrochenFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "BonusBarrierGebrochenFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("BonusBarrierGebrochenFilter")}/>
                                    break;

                                case "BonusQuantoFilter":
                                    control =
                                        <SelectFromListFilter
                                            values={["beliebig", "ja", "nein"]}
                                            filterKey={"bonusQuanto"} shortTitle={"Quanto"} fullTitle={"Quanto"}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "BonusQuantoFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "BonusQuantoFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("BonusQuantoFilter")}/>
                                    break;


                                case "DiscountClassicTypFilter":
                                    control =
                                        <SelectFromListFilter
                                            // values={["Alle", "Classic", "Protect", "Protect Pro"]}
                                            values={["Alle", ...coreData.derivativeAssetTypeTyps?.map((t: any) => t.assetType.name) || []]}
                                            filterKey={"typ"} shortTitle={"Typ"} fullTitle={"Typ"}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "DiscountClassicTypFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "DiscountClassicTypFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("DiscountClassicTypFilter")}/>
                                    break;

                                case "ExpressTypFilter":
                                    control =
                                        <SelectFromListFilter
                                            // values={["Alle", "Classic", "Easy"]}
                                            values={["Alle", ...coreData.derivativeAssetTypeTyps?.map((t: any) => t.assetType.name) || []]}
                                            filterKey={"typ"} shortTitle={"Typ"} fullTitle={"Typ"}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "ExpressTypFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "ExpressTypFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("ExpressTypFilter")}/>
                                    break;

                                case "DiscountSonstigeTypFilter":
                                    control =
                                        <SelectFromListFilter
                                            values={["Alle", ...coreData.derivativeAssetTypeTyps?.map((t: any) => t.assetType.name) || []]}
                                            filterKey={"typ"} shortTitle={"Typ"} fullTitle={"Typ"}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "DiscountSonstigeTypFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "DiscountSonstigeTypFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("DiscountSonstigeTypFilter")}/>
                                    break;

                                case "IndexTypFilter":
                                    control =
                                        <SelectFromListFilter
                                            // values={["Alle", "Classic", "Reverse"]}
                                            values={["Alle", ...coreData.derivativeAssetTypeTyps?.map((t: any) => t.assetType.name) || []]}
                                            filterKey={"typ"} shortTitle={"Typ"} fullTitle={"Typ"}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "IndexTypFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "IndexTypFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("IndexTypFilter")}/>
                                    break;

                                case "KapitalTypFilter":
                                    control =
                                        <SelectFromListFilter
                                            // values={["Alle", "Classic", "Partial", "Lock-In", "Alpha", "Sonstige" ]}
                                            values={["Alle", ...coreData.derivativeAssetTypeTyps?.map((t: any) => t.assetType.name) || []]}
                                            filterKey={"typ"} shortTitle={"Typ"} fullTitle={"Typ"}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "KapitalTypFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "KapitalTypFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("KapitalTypFilter")}/>
                                    break;

                                case "OutperfTypFilter":
                                    control =
                                        <SelectFromListFilter
                                            // values={["Alle", "Classic", "Cap", "Protect" ]}
                                            values={["Alle", ...coreData.derivativeAssetTypeTyps?.map((t: any) => t.assetType.name) || []]}
                                            filterKey={"typ"} shortTitle={"Typ"} fullTitle={"Typ"}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "OutperfTypFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "OutperfTypFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("OutperfTypFilter")}/>
                                    break;

                                case "SonstigeTypFilter":
                                    control =
                                        <SelectFromListFilter
                                            // values={["Alle", "Airbag", "Hedge", "Alpha", "Sonstige" ]}
                                            values={["Alle", ...coreData.derivativeAssetTypeTyps?.map((t: any) => t.assetType.name) || []]}
                                            filterKey={"typ"} shortTitle={"Typ"} fullTitle={"Typ"}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "SelectFromListFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "SelectFromListFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("SelectFromListFilter")}/>
                                    break;

                                case "DiscountCapFilter":
                                    control =
                                        <DiscountCapFilter className={_class} currentFilter={getFilterForActiveTab()}
                                                   onFilterChange={(newFilter) => updateFilter(newFilter)}
                                                   showButton={isButton || isDesktop} showContent={!isButton}
                                                   key={config?.assetTypeGroup?.id + f}
                                                   contentActive={activeContent === "DiscountCapFilter"}
                                                   onVisbilityChange={(visibility) => {
                                                       setActiveContent(visibility ? "DiscountCapFilter" : "")
                                                   }}
                                                   onClick={() => setActiveContent("DiscountCapFilter")}/>
                                    break;

                                case "ExpressAbstandBarriereFilter":
                                    control =
                                        <ExpressAbstandBarriereFilter className={_class} currentFilter={getFilterForActiveTab()}
                                                   onFilterChange={(newFilter) => updateFilter(newFilter)}
                                                   showButton={isButton || isDesktop} showContent={!isButton}
                                                   key={config?.assetTypeGroup?.id + f}
                                                   contentActive={activeContent === "ExpressAbstandBarriereFilter"}
                                                   onVisbilityChange={(visibility) => {
                                                       setActiveContent(visibility ? "ExpressAbstandBarriereFilter" : "")
                                                   }}
                                                   onClick={() => setActiveContent("ExpressAbstandBarriereFilter")}/>
                                    break;

                                case "DiscountDiscountFilter":
                                    control =
                                        <SelectFromListFilter
                                            values={[">= 5%", ">= 10%", ">= 20%", ">= 30%", ">= 40%"]}
                                            filterKey={"discount"} shortTitle={"Discount"} fullTitle={"Discount"}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "DiscountDiscountFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "DiscountDiscountFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("DiscountDiscountFilter")}/>
                                    break;



                                case "DiscountRenditeFilter":
                                    control =
                                        <SelectFromListFilter
                                            values={["5%-8%", "8%-10%", "10%-12%", "12%-15%", "15%-20%", "20%-25%", "25%-30%", "30%-35%", "35%-40%", "> 40%"]}
                                            filterKey={"bonusRendite"} shortTitle={"Max.rendite p.a."} fullTitle={"Max.rendite p.a."}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "DiscountRenditeFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "DiscountRenditeFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("DiscountRenditeFilter")}/>
                                    break;


                                case "KapitalMagemantFilter":
                                    control =
                                        <SelectFromListFilter
                                            values={["beliebig", "ja", "nein"]}
                                            filterKey={"bonusQuanto"} shortTitle={"Managemantgebühr"} fullTitle={"Managemantgebühr"}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "KapitalMagemantFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "KapitalMagemantFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("KapitalMagemantFilter")}/>
                                    break;

                                case "PartizipationFilter":
                                    control =
                                        <SelectFromListFilter
                                            values={["alle", "> 100%", "> 125%", "> 150%", "> 200%"]}
                                            filterKey={"partizipation"} shortTitle={"Partizipation"} fullTitle={"Partizipation"}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "PartizipationFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "PartizipationFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("PartizipationFilter")}/>
                                    break;

                                case "OutperfAufgeldFilter":
                                    control =
                                        <SelectFromListFilter
                                            values={["alle", "< -20%", "< -10%", "< -5%", "< 1%", "< 5%", "< 10%", "> 10 %", "> 20%"]}
                                            filterKey={"outprefAufgeld"} shortTitle={"Aufgeld p.a."} fullTitle={"Aufgeld p.a."}
                                            className={_class} currentFilter={getFilterForActiveTab()}
                                            onFilterChange={(newFilter) => updateFilter(newFilter)}
                                            showButton={isButton || isDesktop} showContent={!isButton}
                                            key={config?.assetTypeGroup?.id + f}
                                            contentActive={activeContent === "OutperfAufgeldFilter"}
                                            onVisbilityChange={(visibility) => {
                                                setActiveContent(visibility ? "OutperfAufgeldFilter" : "")
                                            }}
                                            onClick={() => setActiveContent("OutperfAufgeldFilter")}/>
                                    break;


                                case "BandbreiteFilter":
                                    control =
                                        <BandbreiteFilter className={_class} currentFilter={getFilterForActiveTab()}
                                                           onFilterChange={(newFilter) => updateFilter(newFilter)}
                                                           showButton={isButton || isDesktop} showContent={!isButton}
                                                           key={config?.assetTypeGroup?.id + f}
                                                           contentActive={activeContent === "BandbreiteFilter"}
                                                           onVisbilityChange={(visibility) => {
                                                               setActiveContent(visibility ? "BandbreiteFilter" : "")
                                                           }}
                                                           onClick={() => setActiveContent("BandbreiteFilter")}/>
                                    break;

                                // case "DiffStopLossFilter":
                                //     control =
                                //         <DiffStopLossFilter className={_class} currentFilter={getFilterForActiveTab()}
                                //                             onFilterChange={(newFilter) => updateFilter(newFilter)}
                                //                             showButton={isButton || isDesktop} showContent={!isButton} key={activeTab+f}
                                //                             contentActive={activeContent === "DiffStopLossFilter"}
                                //                             onVisbilityChange={(visibility) => {
                                //                                 setActiveContent(visibility ? "DiffStopLossFilter" : "")
                                //                             }}
                                //                             onClick={() => setActiveContent("DiffStopLossFilter")}/>
                                //     break;
                            }
                            return control;
                        }
                    )
                }
            </>)
    }


    return (
        isDesktop ?
            <>
                {build(true, false)}
            </>
            :
            <>
                <DropdownButton text="Filter" icon="icon_filter_white.svg" className="d-xl-none w-auto mr-2"
                                subText={countActiveFilters()}
                                onClick={() => {
                                    setShowFiltersModal(!showFiltersModal);
                                    setActiveContent("");
                                }}
                />

                <div
                    className={"d-xl-none carusel-modal " + (showFiltersModal ? "visible" : "hidden")}
                    onClick={() => setShowFiltersModal(false)}
                >

                    <CSSTransition timeout={250}
                                   classNames={"carusel-modal-left"}
                                   in={!activeContent || activeContent === ""}>
                        <div className={"container carusel-modal-left"} onClick={(event) => {
                            event.stopPropagation();
                        }}>
                            <div className="d-flex justify-content-between bg-white py-3 pl-3">
                                <span className="font-weight-bold roboto-heading">Filter</span>
                                <button type="button" className="btn btn-link"
                                        onClick={cancelFilter}>schließen<SvgCancel></SvgCancel></button>
                            </div>

                            <div className="mx-auto" style={{width: 330}}>
                                <div className={"flex-row flex-nowrap bottom"}>
                                    {build(false, true)}
                                </div>
                            </div>

                            <div className="d-flex justify-content-end border-0 bg-white modal-footer">
                                <button type="button" className="pr-0 btn btn-link" onClick={() => applyFilter()}>
                                    <SvgCheck></SvgCheck>Einstellung übernehmen
                                </button>
                            </div>
                        </div>
                    </CSSTransition>


                    {build(false, false)}

                </div>
                <div  className="d-xl-none flex-fill align-self-end">
                {
                    filters.map(
                        (f: string) => {
                            let control = null;

                            switch (f) {
                                case "CallFilter":
                                    control =
                                        <CallFilter filter={getFilterForActiveTab()}
                                                    onChange={(newFilter) => updateFilter(newFilter)}
                                                    key={config?.assetTypeGroup?.id + f}/>
                                    break;

                                case "PutFilter":
                                    control =
                                        <PutFilter filter={getFilterForActiveTab()}
                                                   onChange={(newFilter) => updateFilter(newFilter)}
                                                   key={config?.assetTypeGroup?.id + f}/>
                                    break;

                                case "LongFilter":
                                    control =
                                        <LongFilter filter={getFilterForActiveTab()}
                                                    onChange={(newFilter) => updateFilter(newFilter)}
                                                    key={config?.assetTypeGroup?.id + f}/>
                                    break;

                                case "ShortFilter":
                                    control =
                                        <ShortFilter filter={getFilterForActiveTab()}
                                                     onChange={(newFilter) => updateFilter(newFilter)}
                                                     key={config?.assetTypeGroup?.id + f}/>
                                    break;
                            }

                            return control
                        }
                    )
                }
                </div>
            </>
    );
}

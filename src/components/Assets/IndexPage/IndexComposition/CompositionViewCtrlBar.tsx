import React, {useRef, useState} from "react";
import {CalculationPeriod, ChartScope, InstrumentGroupComposition} from "../../../../generated/graphql";
import {DropdownMenuOption, DropdownMenuOptions, SelectButtonComponent} from "../../../common/select-button";
import SvgImage from "../../../common/image/SvgImage";
import { SnapQuoteDelayIndicator } from "components/common";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

export enum IndexCompositionView {
    'Charts' = 'Charts', 'Basis' = 'Basis', 'FundKennzahlen' = 'Fund.Kennzahlen', 'TechnKennzahlen' = 'Techn.Kennzahlen', 'Performance' = 'Performance',
}

interface CompositionViewCtrlBarProps {
    onIntervalChange: any,
    onViewChange: any,
    onPeriodChange: any,
    onStockChange: any,
    onSortChange: any,
    compositions: InstrumentGroupComposition[],
}

const ansichtOptions = {
    dropdownTitle: "Ansicht:",
    menuTitle: "Ansicht auswählen",
    closeOnSelect: true,
    groups: [{
        options: [
            {key: IndexCompositionView.Charts, value: IndexCompositionView.Charts},
            {key: IndexCompositionView.Basis, value: IndexCompositionView.Basis},
            {key: IndexCompositionView.FundKennzahlen, value: IndexCompositionView.FundKennzahlen},
            {key: IndexCompositionView.TechnKennzahlen, value: IndexCompositionView.TechnKennzahlen},
            {key: IndexCompositionView.Performance, value: IndexCompositionView.Performance},
        ]
    }]
};

const zeitraumOptions = {
    dropdownTitle: "Zeitraum:",
    menuTitle: "Zeitraum auswählen",
    closeOnSelect: true,
    groups: [{
        options: [
            {value: CalculationPeriod.Intraday, key: "Intraday" , interval:ChartScope.Intraday},
            {value: CalculationPeriod.Week1, key: "1 Woche", interval: ChartScope.Week},
            {value: CalculationPeriod.Month1, key: "1 Monat" , interval: ChartScope.Month},
            {value: CalculationPeriod.Month6, key: "6 Monate" , interval : ChartScope.SixMonth},
            {value: CalculationPeriod.Week52, key: "1 Jahr", interval : ChartScope.Year},
            {value: CalculationPeriod.Year3, key: "3 Jahre",interval: ChartScope.ThreeYear},
        ]
    }]
};

const sortOptionsForCharts = [
    {key: "Name", value: "Alle"},
    {key: "Tops & Flops", value: "Tops"},
    {key: "Umsatz", value: "Umsatz"},
    {key: "Volumen", value: "Volumen"},
    {key: "Trades", value: "Trades"},
];
const sortOptionsForBasis = [
    {key: "Bezeichnung", value: "name"},
    {key: "Branche", value: "sector"},
    {key: "Kurs", value: "value"},
    {key: "Zeit", value: "when"},
    {key: "% Change", value: "percentChange"},
    {key: "Change", value: "change"},
    {key: "Umzatz", value: "cumulativeTurnover"},
    {key: "Umzats", value: "cumulativeVolume"},
    {key: "Trades", value: "cumulativeTrades"},
];
const sortOptionsForTK = [
    {key: "Bezeichnung", value: "name"},
    {key: "Branche", value: "sector"},
    {key: "Kurs", value: "value"},
    {key: "Vola.30T", value: "vola"},
    {key: "RSL", value: "rsl"},
    {key: "Allzeithoch", value: "allz"},
    {key: "52W-Hoch", value: "52W"},
    {key: "200T-line", value: "200T"},
];
const sortOptionsForFK = [
    {key: "Bezeichnung", value: "name"},
    {key: "Branche", value: "sector"},
    {key: "Kurs", value: "value"},
    {key: "Div.Rend.", value: "divident"},
    {key: "KGV", value: "kgv"},
    {key: "KUV", value: "kuv"},
    {key: "KCV", value: "kcv"},
    {key: "MK", value: "mk"},
];

const sortirienOptions = {
    dropdownTitle: "Sortierung Kacheln:",
    menuTitle: "Sortierung",
    closeOnSelect: true,
    groups: [{
        options: sortOptionsForCharts
    },
        {
            options: [
                {key: "Aufsteigend", value: "Aufsteigend"},
                {key: "Absteigend", value: "Absteigend"},
            ]
        }]
}

export const CompositionViewCtrlBar = (props: CompositionViewCtrlBarProps) => {
    const stockOptions: DropdownMenuOptions = {
        dropdownTitle: "Börsenplatz:",
        menuTitle: "Börsenplatz auswählen",
        closeOnSelect: true,
        groups: [{
            options: props.compositions ?
                props.compositions.map((c: InstrumentGroupComposition, index: number) => {
                    return {
                        key: (c.name || "noname"),
                        html: <div className="stock-menu-item text-truncate" key={index}><span className="timing-info-box"><SnapQuoteDelayIndicator delay={c.delay}/></span>&nbsp;<span>{c.name || "noname"}</span></div>,
                        value: c
                    }
                }) : []
        }]
    };

    const [viewOption, setViewOptions] = useState<DropdownMenuOption>(ansichtOptions.groups[0].options[0]);
    const [selectedSortOptions, setSelectedSortOptions] = useState<DropdownMenuOption[]>([sortirienOptions.groups[0].options[0], sortirienOptions.groups[1].options[0]]);
    const [dropdownSortOption, setDropDownSortOption] = useState<DropdownMenuOptions>(sortirienOptions);
    const [selectedZeitraumOption, setSelectedZeitraumOption] = useState<DropdownMenuOption>(zeitraumOptions.groups[0].options[0]);
    const [selectedStockOption, setSelectedStockOption] = useState<DropdownMenuOption>(stockOptions.groups[0].options[0]);
    const [mobileFilterVisible, setMobileFilterVisible] = useState<boolean>(false);
    const [mobileSortierungVisible, setMobileSortierungVisible] = useState<boolean>(false);

    const ansichtEl = useRef(null);
    const zeitraumEl = useRef(null);
    const sortirienEl = useRef(null);
    const stockEl = useRef(null);

    const setCurrentView = function (selected: DropdownMenuOption) {
        if (viewOption === selected) return;

        const newSortOptions = {...sortirienOptions};

        switch (selected.value) {
            case IndexCompositionView.Charts:
                newSortOptions.groups[0].options = sortOptionsForCharts;
                break;
            case IndexCompositionView.Basis:
                newSortOptions.groups[0].options = sortOptionsForBasis;
                break;
            case IndexCompositionView.FundKennzahlen:
                newSortOptions.groups[0].options = sortOptionsForFK;
                break;
            case IndexCompositionView.TechnKennzahlen:
                newSortOptions.groups[0].options = sortOptionsForTK;
                break;

        }

        setDropDownSortOption({...newSortOptions});
        const newSelection = [newSortOptions.groups[0].options[0], newSortOptions.groups[1].options[0]];
        setSelectedSortOptions(newSelection);

        setViewOptions(selected);
        if (props.onViewChange) {
            props.onViewChange(selected.value)
        }

        if (props.onSortChange) {
            props.onSortChange(newSelection.map(o => o.value));
        }
    }

    const setCurrentPeriod = function (selected: DropdownMenuOption) {
        setSelectedZeitraumOption(selected);

        if (props.onPeriodChange) {
            props.onIntervalChange(selected.interval)
            props.onPeriodChange(selected.value)
        }
    }

    const setCurrentSort = function (selected: string) {
        if (!selectedSortOptions || !dropdownSortOption) return;

        const final: DropdownMenuOption[] = [...selectedSortOptions];

        if (dropdownSortOption.groups[1].options[0].value === selected) {
            final[1] = dropdownSortOption.groups[1].options[0]
        } else if (dropdownSortOption.groups[1].options[1].value === selected) {
            final[1] = dropdownSortOption.groups[1].options[1]
        } else {
            dropdownSortOption.groups[0].options.forEach(
                o => {
                    if (o.value === selected) {
                        final[0] = o;
                    }
                }
            )
        }
        setSelectedSortOptions(final);
        if (props.onSortChange) {
            props.onSortChange(final.map(o => o.value));
        }
    }
    const setCurrentStock = function (selected: DropdownMenuOption) {
        setSelectedStockOption(selected);
        if (props.onStockChange) {
            props.onStockChange(selected.value)
        }
    }

    const closeAllMenus = function () {
        if (ansichtEl.current) {// @ts-ignore
            ansichtEl.current.closeMenu();
        }
        if (zeitraumEl.current) { // @ts-ignore
            zeitraumEl.current.closeMenu();
        }
        if (stockEl.current) { // @ts-ignore
            stockEl.current.closeMenu();
        }
        if (sortirienEl.current) { // @ts-ignore
            sortirienEl.current.closeMenu();
        }
    }

    const closeMobileFilter = function () {
        setMobileFilterVisible(false);
        setMobileSortierungVisible(false);
    }

    return (
        <>
            <div className={"index-mobile-filter"}>
                {
                    viewOption?.value === IndexCompositionView.Charts &&
                    <div className={"btn btn-primary p-1 pr-2"} onClick={()=>setMobileSortierungVisible(true)}>
                        <SvgImage icon="icon_filter_white.svg" imgClass="svg-white" width="28" convert={false}/>
                        <span>Sortierung</span>
                    </div>
                }

                <div className={"btn btn-primary p-1 pr-2"} onClick={()=>setMobileFilterVisible(true)}>
                    <SvgImage icon="icon_filter_white.svg" convert={false} imgClass="svg-white" width="28"/>
                    <span>Ansicht und Filter</span>
                </div>
            </div>

            <div className={"filters-holder " + (mobileFilterVisible || mobileSortierungVisible ? "show" : "d-md-none d-xl-flex")}>
                <div className={"left-block " + (mobileSortierungVisible ? "" : "d-none d-xl-flex")}>
                    {
                        viewOption?.value === IndexCompositionView.Charts &&

                        <SelectButtonComponent ref={sortirienEl}
                                               options={dropdownSortOption}
                                               selectedOptions={selectedSortOptions}
                                               beforeOpen={closeAllMenus}
                                               onSelectionChanged={(selected: DropdownMenuOption[]) => {
                                                   closeMobileFilter();
                                                   setCurrentSort(selected[0].value)
                                                   trigInfonline(guessInfonlineSection(), "index_composition");
                                               }}
                                               style={{marginRight: 0}}
                        />
                    }
                </div>

                <div className={"right-block"+ (mobileFilterVisible ? " show " : " d-none d-xl-flex")}>
                    <div className={"index-mobile-filter-title"}>
                        <h2>Filter</h2>
                        <span className="drop-arrow-image close-icon svg-icon top-move"
                              onClick={closeMobileFilter}>
                            <SvgImage icon="icon_close_dark.svg" convert={false} width="28"/>
                        </span>
                    </div>

                    {
                        viewOption?.value === IndexCompositionView.Charts &&
                        <>
                        <SelectButtonComponent ref={zeitraumEl}
                                               options={zeitraumOptions}
                                               selectedOptions={selectedZeitraumOption ? [selectedZeitraumOption] : []}
                                               beforeOpen={closeAllMenus}
                                               onSelectionChanged={(selected: DropdownMenuOption[]) => {
                                                   closeMobileFilter();
                                                   setCurrentPeriod(selected[0])
                                                   trigInfonline(guessInfonlineSection(), "index_composition");
                                               }}
                        />&nbsp;&nbsp;
                        </>
                    }

                    <SelectButtonComponent ref={stockEl}
                                           options={stockOptions}
                                           selectedOptions={selectedStockOption ? [selectedStockOption] : []}
                                           beforeOpen={closeAllMenus}
                                           onSelectionChanged={(selected: DropdownMenuOption[]) => {
                                               closeMobileFilter();
                                               setCurrentStock(selected[0])
                                               trigInfonline(guessInfonlineSection(), "index_composition");
                                           }}
                                           dropDownMenuCss={"dropdown-menu-right"}
                    />&nbsp;&nbsp;

                    <SelectButtonComponent ref={ansichtEl}
                                           options={ansichtOptions}
                                           selectedOptions={viewOption ? [viewOption] : []}
                                           beforeOpen={closeAllMenus}
                                           onSelectionChanged={(selected: DropdownMenuOption[]) => {
                                               closeMobileFilter();
                                               setCurrentView(selected[0])
                                               trigInfonline(guessInfonlineSection(), "index_composition");
                                           }}
                                           dropDownMenuCss={"dropdown-menu-right"}
                    />
                </div>
            </div>

            <div
                className={"index-mobile-modal-backdrop" + (mobileFilterVisible || mobileSortierungVisible ? " visible" : "")}
                onClick={closeMobileFilter}
            >&nbps;</div>

        </>
    )
}

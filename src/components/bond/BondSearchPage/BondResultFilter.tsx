import React, { useContext, useState } from "react";
import moment from "moment";
import {
    Range,
    RangeSelected,
    RangeSelectorComponent
} from "../../filters/RangeSelectorComponent/RangeSelectorComponent";
import { FormControl, InputGroup } from "react-bootstrap";
import {
    IndexSelectorComponent,
    Option as IndexOption
} from "../../filters/IndexSelectorComponent/IndexSelectorComponent";
import BondSearchContext from "./BondSearchContext";
import { DatePickerInput } from "../../common/DatePickerInput/DatePickerInput";
import { FilterOptionSelectorComponent } from "components/layout/filter/FilterOptionSelectorComponent/FilterOptionSelectorComponent";
import { NumberOption } from "components/layout/filter/FilterOptionSelectorComponent/MultiSectionFilterOptionSelectorComponent";
import { Filter } from "components/funds/FundSearchPage/FiltersAndSorting/FiltersFund";

export interface BondResultFilterValue {
    maturityPeriodId?: number | null;
    startDate?: moment.Moment | null;
    endDate?: moment.Moment | null;
    nominalCurrencyId?: number | null;
    ismaYieldRangeId?: number | null;
    yieldFrom?: number | null;
    yieldTo?: number | null;

    issuerId?: number | null;
}

interface BondResultFilterState extends BondResultFilterValue {
}

interface BondResultFilterProps {
    issuerId: number | null;
    nominalCurrencyId?: number | null;

    selectedMaturityPeriodId: number | null;
    maturityDateFrom?: moment.Moment | null;
    maturityDateTo?: moment.Moment | null;

    selectedIsmaYieldRangeId?: number | null;
    ismaYieldFrom?: number | null;
    ismaYieldTo?: number | null;

    onChange?: (ev: BondResultFilterValue) => void;
}

const INTEGER_REGEXP = /[0-9]+/;

export function BondResultFilter({ onChange, ...props }: BondResultFilterProps) {
    let [state, setState] = useState<BondResultFilterState>({
        issuerId: props.issuerId || null,
        nominalCurrencyId: props.nominalCurrencyId || null,
        startDate: props.maturityDateFrom || null, endDate: props.maturityDateTo || null,
    });
    const metadataContext = useContext(BondSearchContext);

    const issuerOptions: (IndexOption & { value: number })[] =
        ((metadataContext && metadataContext.bondIssuers) || [])
            .map(current => ({ id: "" + current?.id || "", name: current?.legalName || "", value: current?.id || 0 }));

    const currencyOptions = metadataContext?.bondNominalCurrencies.map(current => {
        return {
            id: "" + current?.currency?.id || "0",
            name:
                <>
                    <img src={process.env.PUBLIC_URL + "/static/img/svg/flags/" + current.currency?.displayCode?.toLowerCase() + ".svg"}
                        alt="" className="mr-1" width="24px" height="16px" />
                    {current?.currency?.displayCode}
                </>,
            value: current.currency?.id || 0
        };
    })
    return (
        <div className="d-flex flex-column flex-xl-row">
            <RangeSelectorComponent<moment.Moment>
                variant={"dropdown-panel range-selector-160 range-selector mr-2"}
                toggleVariant={"panel-button"}
                toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"}
                title={"Laufzeit"}
                description={"Egal"}
                format={(value) => {
                    if (!!value) {
                        if (!!value.selected) {
                            return value.selected.name;
                        }
                        if (value.from !== undefined && value.to !== undefined) {
                            return `${value.from.format("DD/MM/YYYY")} - ${value.to.format("DD/MM/YYYY")}`;
                        }
                        if (value.from !== undefined) {
                            return `von ${value.from.format("DD/MM/YYYY")}`;
                        }
                        if (value.to !== undefined) {
                            return `bis ${value.to.format("DD/MM/YYYY")}`;
                        }
                    }
                    return 'Egal';
                }}
                input={(props) => {
                    return (<DatePickerInput
                        label={props.label || ""}
                        value={props.value || null}
                        onChange={value => props.onChange(value)}
                        format='DD/MM/YYYY'
                    />)
                }}
                ranges={MATURITY_PERIODS}
                onSelect={(ev: RangeSelected<moment.Moment>) => {
                    let selectedMaturityRangeId = MATURITY_PERIODS.findIndex(current => current == ev.selected);
                    let updateValue = {
                        ...state,
                        maturityPeriodId: (selectedMaturityRangeId >= 0 && selectedMaturityRangeId) || null,
                        startDate: ev.from, endDate: ev.to
                    };
                    setState(updateValue);
                    onChange && onChange(updateValue);
                }}
                value={{
                    selected: (props.selectedMaturityPeriodId && MATURITY_PERIODS[props.selectedMaturityPeriodId]) || undefined,
                    from: props.maturityDateFrom || undefined,
                    to: props.maturityDateTo || undefined
                }}
            />
            <RangeSelectorComponent
                variant={"dropdown-panel range-selector-160 range-selector mr-2"}
                toggleVariant={"panel-button"}
                toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"}
                title={"Rendite"}
                description={"Egal"}
                input={(props) => {
                    return (<div className={"d-flex value-input"}>
                        {props.label && <span className="d-block label mr-2">{props.label}</span>}
                        <InputGroup className="m-0 rounded border success">
                            <FormControl className="form-control-sm text-right border-0 bg-transparent"
                                value={props.value != undefined ? props.value : ""}
                                onChange={value =>
                                    props.onChange(
                                        INTEGER_REGEXP.test(value.target.value) ? Number.parseInt(value.target.value) : undefined
                                    )
                                }
                            />
                        </InputGroup>
                    </div>
                    )
                }}
                format={(value) => {
                    if (!!value) {
                        if (!!value.selected) {
                            return value.selected.name;
                        }
                        if (value.from !== undefined && value.to !== undefined) {
                            return `${value.from}% - ${value.to}%`;
                        }
                        if (value.from !== undefined) {
                            return `> ${value.from}%`;
                        }
                        if (value.to !== undefined) {
                            return `< ${value.to}%`;
                        }
                    }
                    return 'Egal';
                }}
                ranges={YIELD_RANGES}
                onSelect={(ev: RangeSelected<number>) => {
                    let selectedIsmaYieldRangeId = YIELD_RANGES.findIndex(current => current == ev.selected);
                    let updateValue = {
                        ...state,
                        ismaYieldRangeId: (selectedIsmaYieldRangeId >= 0 && selectedIsmaYieldRangeId) || null,
                        yieldFrom: ev.from,
                        yieldTo: ev.to
                    };
                    setState(updateValue);
                    onChange && onChange(updateValue);
                }}
                value={{
                    selected: (props.selectedIsmaYieldRangeId && YIELD_RANGES[props.selectedIsmaYieldRangeId]) || undefined,
                    from: props.ismaYieldFrom != undefined ? props.ismaYieldFrom : undefined,
                    to: props.ismaYieldTo != undefined ? props.ismaYieldTo : undefined,
                }}
            />
            <IndexSelectorComponent<IndexOption & { value: number }>
                title="Emittent"
                // subtitle="Emittent"
                description={"Alle"}
                variant={"dropdown-panel range-selector-160 mr-2"}
                toggleVariant={"panel-button"}
                toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"}
                options={issuerOptions}
                selected={(props.issuerId && ("" + props.issuerId)) || null}
                onSelect={(ev) => {
                    setState({ ...state, issuerId: ev.selected?.value || null });
                    onChange && onChange({ ...state, issuerId: ev.selected?.value || null });
                }}
            />
            <Filter
                options={currencyOptions}
                title="Währung"
                description={ "Alle"}
                onSelect={(value: any) => {
                    setState({ ...state, nominalCurrencyId: value?.id || null });
                    onChange && onChange({ ...state, nominalCurrencyId: value?.id || null });
                }}
            />
        </div>
    );
}

const YIELD_RANGES: Range<number>[] = [
    { name: 'beliebig' },
    {
        name: "< 5%",
        to: 5,
    },
    {
        name: "5% - 10%",
        from: 5,
        to: 10
    },
    {
        name: "10% - 15%",
        from: 10,
        to: 15
    },
    {
        name: "15% - 20%",
        from: 15,
        to: 20
    },
    {
        name: "> 20%",
        from: 20,
    },

]

const MATURITY_PERIODS: Range<moment.Moment>[] = [
    {
        name: '1 Monat',
        from: moment().local(true).startOf('date'),
        to: moment().local(true).add(1, 'month').endOf('date')
    },
    {
        name: '1-3 Monate',
        from: moment().local(true).add(1, 'month').startOf('date'),
        to: moment().local(true).add(3, 'month').endOf('date')
    },
    {
        name: '3-6 Monate',
        from: moment().local(true).add(3, 'month').startOf('date'),
        to: moment().local(true).add(6, 'month').endOf('date')
    },
    {
        name: '6-12 Monate',
        from: moment().local(true).add(6, 'month').startOf('date'),
        to: moment().local(true).add(12, 'month').endOf('date')
    }
];

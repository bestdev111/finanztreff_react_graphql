import {BondKeyFigure, BondSortField, Query, SearchBondCriterion} from "../../../generated/graphql";
import {useQuery} from "@apollo/client";
import {loader} from "graphql.macro";
import InfiniteScroll from "../../common/scroller/InfiniteScroller";
import {Spinner} from "react-bootstrap";
import {BondSummaryCard} from "./BondSummaryCard";
import {BondResultFilter, BondResultFilterValue} from "./BondResultFilter";
import React, {useState} from "react";
import moment from "moment";
import {
    SortingDirection,
    SortingSelectorComponent,
    SortOption
} from "../../filters/SortingSelectorComponent/SortingSelectorComponent";
import {MobileFilterComponent} from "../../layout/PageHeaderFilterComponent/MobileFilterComponent";
import {GlobalBondSearchProps} from "./BaseBondSearchCard";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

interface BondResultProps {
    criteria: SearchBondCriterion;
    details: GlobalBondSearchProps | null;
}

interface BondResultState {
    selectedMaturityRangeId?: number | null;
    maturityDateFrom?: moment.Moment | null;
    maturityDateTo?: moment.Moment | null;
    nominalCurrencyId?: number | null;

    selectedIsmaYieldRangeId?: number | null;
    ismaYieldFrom?: number | null;
    ismaYieldTo?: number | null;

    issuerId?: number | null;

    sortOptionId: BondSortField;
    sortDirection: SortingDirection;

    defaultDetails: GlobalBondSearchProps | null;
}

export function BondResultView(props: BondResultProps) {
    let [state, setState] = useState<BondResultState>({
        sortOptionId: BondSortField.IsmaYield, sortDirection: SortingDirection.DESCENDING,
        issuerId: props.details?.issuerId,
        nominalCurrencyId: props.details?.nominalCurrencyId || undefined,
        maturityDateFrom: props.details?.maturityDateFrom || undefined,
        maturityDateTo: props.details?.maturityDateTo || undefined,
        ismaYieldFrom: props.details && props.details?.ismaYieldFrom != null ? props.details.ismaYieldFrom : undefined,
        ismaYieldTo: props.details && props.details?.ismaYieldTo != null ? props.details.ismaYieldTo : undefined,

        defaultDetails: props.details
    });

    let { loading, data, fetchMore } = useQuery<Query>(loader('./getBondSearchResult.graphql'), {
        variables: {
            criterion: {
                ...props.criteria,
                maturityDateFrom:  state.maturityDateFrom && state.maturityDateFrom.format('YYYY-MM-DD'),
                maturityDateTo: state.maturityDateTo && state.maturityDateTo.format('YYYY-MM-DD'),
                issuerId: state.issuerId,
                nominalCurrencyId: state.nominalCurrencyId,
                keyFigures: [
                    ...(props.criteria.keyFigures || []),
                    ...((state.ismaYieldFrom != null || state.ismaYieldTo != null) ?
                            [{ keyFigure: BondKeyFigure.IsmaYield, from: state.ismaYieldFrom, to: state.ismaYieldTo}] : [])
                ]
            },
            sort: [{
                keyFigure: state.sortOptionId,
                descending: state.sortDirection
            }],
            first: 6, after: null
        }
    });

    if (state.defaultDetails != props.details) {
        setState({
            ...state,
            selectedMaturityRangeId: null,
            maturityDateFrom: props.details?.maturityDateFrom || undefined,
            maturityDateTo: props.details?.maturityDateTo || undefined,
            selectedIsmaYieldRangeId: null,
            ismaYieldFrom: props.details && props.details?.ismaYieldFrom != null ? props.details.ismaYieldFrom : undefined,
            ismaYieldTo: props.details && props.details?.ismaYieldTo != null ? props.details.ismaYieldTo : undefined,
            defaultDetails: props.details
        });
    }

    const updateFilter = (ev: BondResultFilterValue) => {
        trigInfonline(guessInfonlineSection(), "search_result")
        let overrideMaturityPeriod = (!!ev.startDate || !!ev.endDate);
        let overrideIsmaYield= (ev.yieldFrom != undefined || ev.yieldTo != undefined ||
                                    ev.yieldFrom != null || ev.yieldTo != null);
        setState({
            ...state,
            selectedMaturityRangeId: ev.maturityPeriodId,
            nominalCurrencyId: ev.nominalCurrencyId,
            maturityDateFrom: overrideMaturityPeriod ? ev.startDate : props.details?.maturityDateFrom,
            maturityDateTo: overrideMaturityPeriod ? ev.endDate : props.details?.maturityDateTo,
            selectedIsmaYieldRangeId: ev.ismaYieldRangeId,
            ismaYieldFrom: overrideIsmaYield ? ev.yieldFrom : props.details?.ismaYieldFrom,
            ismaYieldTo: overrideIsmaYield ? ev.yieldTo : props.details?.ismaYieldTo,
            issuerId: ev.issuerId
        })
    }

    let filterCount = (!!state.maturityDateTo || !!state.maturityDateFrom ? 1: 0) + (!!state.ismaYieldFrom || !!state.ismaYieldTo ? 1: 0)
    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between mt-xl-2 mt-lg-0 mt-md-2 mt-sm-n4">
                <h5 className="d-none d-xl-flex font-weight-bold my-auto"> {data?.searchBond.count} Ergebnisse </h5>
                <div className="d-xl-none d-lg-flex d-md-flex d-sm-flex filters-funds-smalll-button filter-button-mobile">
                    <MobileFilterComponent filtersCount={filterCount}>
                        <BondResultFilter
                            nominalCurrencyId={state.nominalCurrencyId || null}
                            issuerId={state.issuerId || null}
                            selectedMaturityPeriodId={state.selectedMaturityRangeId || null}
                            maturityDateFrom={state.maturityDateFrom || null}
                            maturityDateTo={state.maturityDateTo || null}
                            selectedIsmaYieldRangeId={state.selectedIsmaYieldRangeId || null}
                            ismaYieldFrom={state.ismaYieldFrom != null ? state.ismaYieldFrom : null}
                            ismaYieldTo={state.ismaYieldTo != null ? state.ismaYieldTo : null}
                            onChange={updateFilter}
                        />
                    </MobileFilterComponent>
                </div>
                <div className="d-flex">
                    <div className="d-none d-xl-flex filters-funds mr-3">
                        <BondResultFilter
                            nominalCurrencyId={state.nominalCurrencyId || null}
                            issuerId={state.issuerId || null}
                            selectedMaturityPeriodId={state.selectedMaturityRangeId || null}
                            maturityDateFrom={state.maturityDateFrom || null}
                            maturityDateTo={state.maturityDateTo || null}
                            selectedIsmaYieldRangeId={state.selectedIsmaYieldRangeId || null}
                            ismaYieldFrom={state.ismaYieldFrom != null ? state.ismaYieldFrom : null}
                            ismaYieldTo={state.ismaYieldTo != null ? state.ismaYieldTo : null}
                            onChange={updateFilter}
                        />
                    </div>
                    <div className="d-flex sort-funds filters-funds-smalll-button ml-5">
                        <SortingSelectorComponent<BondSortField>
                            variant={"dropdown-panel"}
                            title={"Sortieren"}
                            optionId={state.sortOptionId}
                            direction={state.sortDirection}
                            options={SORT_OPTIONS}
                            onChange={sorting => {
                                setState({...state, sortOptionId: sorting.id, sortDirection: sorting.direction});
                            }}
                        />
                    </div>
                </div>
            </div>
            <InfiniteScroll
                style={{ overflowY: 'auto' }}
                className="search-results"
                dataLength={data?.searchBond.edges.length || 0}
                hasMore={loading ? true : (data?.searchBond.pageInfo?.hasNextPage || false)}
                next={() => {
                    return fetchMore({ variables: { after: data?.searchBond.pageInfo?.endCursor } })
                }}
                loader={<div className="text-center" style={{ height: 25 }}><Spinner animation="border" size="sm" /></div>}
                height={450}
                scrollableTarget="instruments-search-result"
            >
                {
                    data && data.searchBond && data.searchBond.edges.length > 0 ?
                        (data?.searchBond.edges || []).map((bond, index) => {
                            if (!bond || !bond.node) {
                                return <></>;
                            }
                            return <BondSummaryCard instrument={bond.node} key={index} />
                        })
                        :
                        !loading && <div className="text-center fs-16px font-weight-bold text-red">Keine weiteren Ergebnisse gefunden!</div>
                }
            </InfiniteScroll>
        </div>
    )
}

const SORT_OPTIONS: SortOption<BondSortField>[] = [
    {id: BondSortField.IsmaYield, name: 'Rendite'},
    {id: BondSortField.AccruedInterest, name: 'Stückzinsen'},
    {id: BondSortField.PerformanceYear_1, name: 'Perf. 1 Jahr'},
    {id: BondSortField.MaturityDate, name: 'Laufzeit'},
    {id: BondSortField.IssueSize, name: 'Ausgabevolumen'},
    {id: BondSortField.Region, name: 'Land', disabled: true},
    {id: BondSortField.NominalValue, name: 'Nominalwert'},
    {id: BondSortField.NominalCurrency, name: 'Währung'},
    {id: BondSortField.DirtyPrice, name: 'Kaufpreis inkl. Stückzinsen'},
    {id: BondSortField.MinAmountTradableLot, name: 'Kleinste handelbare Einheit'},
]

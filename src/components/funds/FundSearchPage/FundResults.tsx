import {FundResultCard} from "./ResultCards/FundResultCard";
import {FiltersFundsModal} from "./FiltersAndSorting/FiltersFundsModal";
import {FiltersButton} from "./FiltersAndSorting/FiltersButton";
import React, {useState} from "react";
import { FundSortField, Instrument, Query, SearchFundCriterion } from "graphql/types";
import {Spinner} from "react-bootstrap";
import InfiniteScroll from "components/common/scroller/InfiniteScroller";
import {useQuery} from "@apollo/client";
import {loader} from "graphql.macro";
import './FundModal.scss';
import { SortingDirection, SortingSelectorComponent, SortOption } from "../../filters/SortingSelectorComponent/SortingSelectorComponent";

interface FundResultsProps {
    criteria: SearchFundCriterion;
}

interface SearchFundSort {
    field: FundSortField;
    descending: boolean;
}

interface FundDetailInformationProps{
    companyName?: string;
}

export function FundResults(props: FundResultsProps & FundDetailInformationProps) {
    const [sort, setSort] = useState<SearchFundSort>({ field: FundSortField.Name, descending: true });
    const [state, setFilter] = useState<FiltersFundsModalState>({ distribution: undefined, plans: undefined, diverse: undefined, capitalHolder: { option: props.companyName || undefined, id: props.criteria.fundCompanyId || undefined} });

    function handleDistribution(distribution: { option?: string, optionId?: number }) {
        setFilter({ ...state, distribution: distribution })
    }

    function handlePlans(plans: { option?: string, optionId?: number }) {
        setFilter({ ...state, plans: plans })
    }

    function handleDiverse(diverse: { option?: string, optionId?: number }) {
        setFilter({ ...state, diverse: diverse })
    }

    function handleCapitalHolder(capitalHolder: { option?: string, optionId?: number }) {
        setFilter({ ...state, capitalHolder: capitalHolder })
    }

    let { loading, data, fetchMore } = useQuery<Query>(loader('./getFundSearchResult.graphql'), {
        variables: {
            criteria: {
                ...props.criteria,          
                germanVwlCapable: state.plans?.id===1 ? true : state.plans?.id===2 ? false : null,
                savingPlanCapable: state.diverse?.id===1 ? true : state.diverse?.id===2 ? false : null ,
                distributing: state.distribution?.id===1 ? true : state.distribution?.id===2 ? false : null,
                fundCompanyId: state.capitalHolder?.id===-1 ? null : state.capitalHolder?.id,
            },
            sort: [sort],
            first: 6, after: null
        }
    });

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between mt-xl-2 mt-lg-0 mt-md-2 mt-sm-n4">
                <h5 className="d-none d-xl-flex font-weight-bold my-auto"> {data?.searchFund.count} Ergebnisse </h5>
                <div className="d-xl-none d-lg-flex d-md-flex d-sm-flex filters-funds-smalll-button filter-button-mobile">
                    <FiltersButton handleDistribution={handleDistribution} distribution={state.distribution}
                        handlePlans={handlePlans} plans={state.plans}
                        handleDiverse={handleDiverse} diverse={state.diverse}
                        handleCapitalHolder={handleCapitalHolder} capitalHolder={state.capitalHolder} />
                </div>
                <div className="d-flex">
                    <div className="d-none d-xl-flex filters-funds mr-3">
                        <FiltersFundsModal handleDistribution={handleDistribution} distribution={state.distribution}
                            handlePlans={handlePlans} plans={state.plans}
                            handleDiverse={handleDiverse} diverse={state.diverse}
                            handleCapitalHolder={handleCapitalHolder} capitalHolder={state.capitalHolder} />
                    </div>
                    <div className="d-flex sort-funds filters-funds-smalll-button ml-5">
                        <SortingSelectorComponent<FundSortField>                             variant={"dropdown-panel"}
                            title={"Sortieren"}
                            optionId={sort.field}
                            direction={sort.descending ? SortingDirection.DESCENDING : SortingDirection.ASCENDING}
                            options={SORT_OPTIONS}
                            onChange={sorting => {
                                setSort({...sort, field: sorting.id, descending: sorting.direction == SortingDirection.DESCENDING});
                            }}
                        />
                    </div>
                </div>
            </div>
            <InfiniteScroll
                style={{ overflowY: 'auto' }}
                className="search-results"
                dataLength={data?.searchFund.edges.length || 0}
                hasMore={loading ? true : (data?.searchFund.pageInfo?.hasNextPage || false)}
                next={() => fetchMore({ variables: { after: data?.searchFund.pageInfo?.endCursor } })}
                loader={<div className="text-center" style={{ height: 25 }}><Spinner animation="border" size="sm" /></div>}
                height={450}
                scrollableTarget="instruments-search-result"
            >
                {
                    data && data.searchFund && data.searchFund.edges.length>0 ?
                        (data?.searchFund.edges || []).map((fund, index) => {
                        if (!fund || !fund.node) {
                            return <></>;
                        }
                        return <ResultCard fund={fund.node} key={index} />
                    })
                    :
                    !loading && <div className="text-center fs-16px font-weight-bold text-red">Keine weiteren Ergebnisse gefunden!</div>
                }
            </InfiniteScroll>
        </div>
    )
}

export function ResultCard({fund}: { fund: Instrument }) {
    if (!fund) {
        return <></>;
    }
    return (
        <>
            <FundResultCard fund={fund} />
        </>
    );
}

const SORT_OPTIONS: SortOption<FundSortField>[] = [
    {name: "Name", id: FundSortField.Name},
    {name: "Gebühren (TER)", id: FundSortField.TotalExpenseRatio},
    {name: "Abstand 52W", id: FundSortField.FundTrancheVolume, disabled: true},
    {name: "Fondsvolumen", id: FundSortField.FundVolume}
];

interface FiltersFundsModalState {
    distribution?: {
        option?: string;
        id?: number;
    },
    plans?: {
        option?: string;
        id?: number;
    },
    diverse?: {
        option?: string;
        id?: number;
    },
    capitalHolder?: {
        option?: string;
        id?: number;
    },
}

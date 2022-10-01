import {useQuery} from "@apollo/client";
import {loader} from "graphql.macro";
import {Spinner} from "react-bootstrap";
import React, {useState} from "react";
import { SearchEtfCriterion, Query, EtfSortField } from "generated/graphql";
import { SortingDirection, SortOption, SortingSelectorComponent } from "components/filters/SortingSelectorComponent/SortingSelectorComponent";
import { MobileFilterComponent } from "components/layout/PageHeaderFilterComponent/MobileFilterComponent";
import {CommodityResultFilter} from "./CommodityResultFilter";
import InfiniteScroll from "components/common/scroller/InfiniteScroller";
import { CommoditySummaryCard } from "./CommoditySummaryCard";
import {CommodityCardDetails} from "./BaseCommoditySearchCard"


interface EtfResultProps {
    criteria: SearchEtfCriterion;
    details: CommodityCardDetails | null;
}

interface EtfResultState {
    sortOptionId: EtfSortField;
    sortDirection: SortingDirection;

    distributing?: boolean | null;
    replicationId?: number | null;
    issuerId?: number | null;

    details: CommodityCardDetails | null;
}

export function CommodityResultView(props: EtfResultProps) {
    let [state, setState] = useState<EtfResultState>({
        sortOptionId: SORT_OPTIONS[0].id, sortDirection: SortingDirection.ASCENDING,
        distributing: props.details?.distributing,
        replicationId: props.details?.replicationId,
        details: props.details
    });

    if (state.details != props.details) {
        setState({
            ...state,
            distributing: props.details?.distributing,
            replicationId: props.details?.replicationId,
            details: props.details
        });
    }
    let { loading, data, fetchMore } = useQuery<Query>(loader('./getEtfSearchResult.graphql'), {
        variables: {
            criterion: {
                ...props.criteria,
                distributing: state.distributing,
                replicationId: state.replicationId,
                issuerId: state.issuerId
            },
            sort: [{
                field: state.sortOptionId,
                descending: state.sortDirection == SortingDirection.DESCENDING
            }],
            first: 6,
            after: null
        }
    });

    let filterCount = (state.distributing !== undefined ? 1 : 0) + (!!state.replicationId ? 1 : 0) + (!!state.issuerId ? 1 : 0);
    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between mt-xl-2 mt-lg-0 mt-md-2 mt-sm-n4">
                <h5 className="d-none d-xl-flex font-weight-bold my-auto"> {data?.searchEtf.count} Ergebnisse </h5>
                <div className="d-xl-none d-lg-flex d-md-flex d-sm-flex filters-funds-smalll-button filter-button-mobile">
                    <MobileFilterComponent filtersCount={filterCount}>
                        <CommodityResultFilter
                            distributing={state.distributing === undefined || state.distributing == null ? null : (state.distributing || false)}
                            replicationId={state.replicationId || null}
                            onChange={(ev) => {
                                setState({
                                    ...state,
                                    distributing: ev.distributing,
                                    replicationId: ev.replication,
                                    issuerId: ev.issuer
                                })
                            }}
                        />
                    </MobileFilterComponent>
                </div>
                <div className="d-flex">
                    <div className="d-none d-xl-flex filters-funds mr-3">
                        <CommodityResultFilter
                            distributing={state.distributing === undefined || state.distributing == null ? null : (state.distributing || false)}
                            replicationId={state.replicationId || null}
                            onChange={(ev) => {
                                setState({
                                    ...state,
                                    distributing: ev.distributing,
                                    replicationId: ev.replication,
                                    issuerId: ev.issuer
                                })
                            }}
                        />
                    </div>
                    <div className="d-flex sort-funds filters-funds-smalll-button ml-5">
                        <SortingSelectorComponent<EtfSortField>
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
                dataLength={data?.searchEtf.edges.length || 0}
                hasMore={loading ? true : (data?.searchEtf.pageInfo?.hasNextPage || false)}
                next={() => {
                    return fetchMore({ variables: { after: data?.searchEtf.pageInfo?.endCursor } })
                }}
                loader={<div className="text-center" style={{ height: 25 }}><Spinner animation="border" size="sm" /></div>}
                height={450}
                scrollableTarget="instruments-search-result"
            >
                {
                    data && data.searchEtf && data.searchEtf.edges.length > 0 ?
                        (data?.searchEtf.edges || []).map((current, index) => {
                            if (!current || !current.node) {
                                return <></>;
                            }
                            return <CommoditySummaryCard instrument={current.node} key={index} />
                        })
                        :
                        !loading && <div className="text-center fs-16px font-weight-bold text-red">Keine weiteren Ergebnisse gefunden!</div>
                }
            </InfiniteScroll>
        </div>
    )
}

const SORT_OPTIONS: SortOption<EtfSortField>[] = [
    {id: EtfSortField.Name, name: 'Name'},
    {id: EtfSortField.TotalExpenseRatio, name: 'TER'},
    {id: EtfSortField.Volume, name: 'Volumen'},
    {id: EtfSortField.PerformanceYear_1, name: 'Perf. 1 Jahr'}
];

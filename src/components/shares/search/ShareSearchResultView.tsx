import React, {useEffect, useState} from "react";
import {InstrumentEdge, Query, SearchShareCriterion, ShareSortField} from "../../../generated/graphql";
import {ShareSearchCardDetails} from "./BaseShareSearchCard";
import {SortingDirection} from "../../filters/SortingSelectorComponent/SortingSelectorComponent";
import {useQuery} from "@apollo/client";
import {loader} from "graphql.macro";
import InfiniteScroll from "../../common/scroller/InfiniteScroller";
import {Spinner, Table} from "react-bootstrap";
import {calculatePeriod, CardResults, filterHeaders, isColumnVisible, mapShareSearchRow, ResultRowProps} from "./utils";
import {tableHeaderType} from "./tables/shareTableHeaders";
import {
    CashflowSalesNetIncome,
    CashflowSalesNetIncomeMobile,
    Kurs,
    Region,
    ShareName,
    ShowChangeArrowIcon,
    TableColumn
} from "./cards/common/CommonTableElements";
import {ProfileInstrumentAddPopup} from "../../common/modals/ProfileInstrumentAddPopup";
import SvgImage from "../../common/image/SvgImage";
import {useBootstrapBreakpoint} from "../../../hooks/useBootstrapBreakpoint";
import {getFinanztreffAssetLink} from "../../../utils";
import {Link} from "react-router-dom";
import {trigInfonline} from "../../common/InfonlineService";

interface ShareSearchResultProps {
    criteria: SearchShareCriterion
    details: ShareSearchCardDetails | null
    tableHeaders?: tableHeaderType[]
    cardResult: any
    shareSort: ShareSortField
}

interface ShareSearchResultState {
    sortOptionId: ShareSortField
    sortDirection: SortingDirection
    details: ShareSearchCardDetails | null | undefined
}

export const ShareSearchResultView = (props: ShareSearchResultProps) => {
    const RESULT_SIZE: number = 30;
    let [state, setState] = useState<ShareSearchResultState>({
        sortDirection: SortingDirection.DESCENDING,
        details: props.details,
        sortOptionId: props.shareSort
    })
    const [tableBody, setTableBody] = useState<any>([])
    let {data: regionsData} = useQuery<Query>(loader('./getShareRegions.graphql'))
    let {loading, data, fetchMore} = useQuery<Query>(loader('./getShareSearchResult.graphql'), {
        variables: {
            criterion: {
                ...props.criteria
            },
            sort: [{
                field: state.sortOptionId,
                descending: state.sortDirection === SortingDirection.DESCENDING
            }],
            first: RESULT_SIZE,
            after: null
        }
    })

    useEffect(() => {
        if (data?.searchShare){
            setTableBody(data?.searchShare?.edges.map((edge: InstrumentEdge) => mapShareSearchRow(edge.node, props.criteria.regionId, regionsData?.regions)).map((row: ResultRowProps, index: number) => (
                <ResultBody key={index} {...row} cardResult={props.cardResult} tableHeaders={props.tableHeaders} criteria={props.criteria} newPeriod={calculatePeriod(props.details?.period)}/>
            )))
        }
    }, [data, props])

    const isMedium = useBootstrapBreakpoint({
        xl: false,
        lg: true,
        md: true,
        sm: false,
        default: false
    });

    function handleSorting(state: ShareSearchResultState, header: tableHeaderType) {
        trigInfonline("sharessearch", "search_result")
        if (state.sortDirection === SortingDirection.ASCENDING) {
            setState({
                ...state,
                sortOptionId: header.sortOption as ShareSortField,
                sortDirection: SortingDirection.DESCENDING
            })
        } else {
            setState({
                ...state,
                sortOptionId: header.sortOption as ShareSortField,
                sortDirection: SortingDirection.ASCENDING
            })
        }
    }

    function renderSortIcon(header: tableHeaderType) {
        if (header.canSort){
            if (header.sortOption === state.sortOptionId && !loading){
                return <span style={{transform: state.sortDirection === SortingDirection.ASCENDING ? "rotate(-90deg)" : "rotate(90deg)"}} className={"sort-arrow svg-icon"}>
                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_long_right_dark.svg"} alt={""}/>
            </span>
            }
        }
    }

    return (
        <div className={"mt-4"}>
            <div className="ml-n3 mr-n3">
                <div className="bg-white mt-3 mx-lg-2 mx-md-2 borderless">
                    <h5 className="font-weight-bold pl-3 pt-3 float-left py-2 pb-1" style={{fontSize: '18px', fontFamily: 'Roboto Slab'}}>
                        {
                            loading ?
                                <Spinner animation="border" size="sm"/>
                                : <>Ergebnisse ({data?.searchShare?.count}) </>
                        }
                    </h5>
                    <InfiniteScroll
                        className="w-100"
                        style={{overflow:'none'}}
                        scrollableTarget="share-search-results"
                        next={() => { return fetchMore({variables: {after: data?.searchShare?.pageInfo?.endCursor}})}}
                        hasMore={!!(data && data.searchShare && data.searchShare.pageInfo && data.searchShare.pageInfo.hasNextPage)}
                        loader={<div className="text-center" style={{height: 25}}><Spinner animation="border" size="sm"/></div>}
                        dataLength={data?.searchShare?.edges?.length || 0}
                    >
                        <Table className="table-borderless">
                            <thead className="bg-gray-light">
                                <tr>
                                    {
                                        filterHeaders(props.tableHeaders, props.criteria, props.cardResult)?.map((header: tableHeaderType) => (
                                                <th className={header.className}
                                                    key={header.id}
                                                    style={{width: header.width,
                                                        maxWidth: (header.name === "Bezeichnung" && props.tableHeaders && props.tableHeaders?.filter(item => item.dataIndex === "cashflow").length > 0 && isMedium) ?
                                                            "130px" : header.width
                                                    }}
                                                >
                                                    <a onClick={() => handleSorting(state, header)}
                                                       className={header.canSort ? "can-sort text-blue cursor-pointer " : "text-dark text-decoration-none"}>
                                                        {header.name}
                                                    </a>
                                                    {renderSortIcon(header)}
                                                </th>
                                            ))
                                    }
                                    <th className="text-center p-0 m-0">&nbsp;</th>
                                    <th className="text-center p-0 m-0">&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>{!loading && tableBody}</tbody>
                        </Table>
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    )
}

function ResultBody(props: ResultRowProps) {

    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        lg: false,
        md: false,
        sm: false,
        default: false
    });
    const isMedium = useBootstrapBreakpoint({
        xl: false,
        lg: true,
        md: true,
        sm: false,
        default: false
    });
    const isSmall = useBootstrapBreakpoint({
        xl: false,
        lg: false,
        md: false,
        sm: true,
        default: false
    });

    if (isSmall)
        return (
            <>
                <tr className="border-bottom border-border-gray bg-white">
                    <td className="font-weight-bold share-name-column" style={{maxWidth: (props.tableHeaders && props.tableHeaders.filter(item => item.dataIndex==="cashflow").length>0) ? "160px" : "200px"}}>
                        {props.securityCategoryId && props.seoTag ?
                            <Link to={(getFinanztreffAssetLink(props.securityCategoryId, props.seoTag, props.exchangeCode))}
                                  className="ml-xl-n2">{props.bezeichnung}</Link> :
                            <>{props.bezeichnung}</>
                        }
                        <br/>
                        <span className="font-weight-bold d-flex font-size-15px text-right"><span>{props.kurs} {props.kurs !== '-' && <span>{props.displayCode}</span>}</span>
                        </span><ShowChangeArrowIcon percentChange={props.percentChange}/>
                    </td>
                    <td className={`font-weight-bold text-left ${isColumnVisible("marketCap", props.tableHeaders) ? 'd-table-cell' : 'd-none'}`}>
                        <span /><br />{props.marketCapitalization}</td>
                    {
                        //2nd card  and 8th card
                        (props.cardResult === CardResults.updatingShares || props.cardResult === CardResults.sharesRisingDividend) &&
                            <>
                                <CashflowSalesNetIncomeMobile
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.cashflowPercentageChange}
                                    shareValue={props.cashFlowYear1}
                                    dataIndex={"cashflow"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncomeMobile
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.salesPercentChange}
                                    shareValue={props.salesYear1}
                                    dataIndex={"sales"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncomeMobile
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.netIncomePercentChange}
                                    shareValue={props.netIncomeYear1}
                                    dataIndex={"netIncome"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                            </>
                    }
                    {
                        // 3rd card
                        props.cardResult === CardResults.updatingSales && <>
                            <CashflowSalesNetIncomeMobile
                                displayCode={props.companyCurrencyDisplayCode}
                                percentChange={props.salesPercentChange}
                                shareValue={props.salesYear1}
                                dataIndex={"sales"}
                                tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                            />
                        </>
                    }
                    {props.cardResult === CardResults.compRisingDividend && <td className={"pt-3"}>{props.dividendYield}%</td>}
                    {props.cardResult === CardResults.stocksRisingDividend && <td className={"pt-3"}>{props.divYield}</td>}
                    {(props.cardResult === CardResults.compChangingDividend || props.cardResult === CardResults.compIncrDividend) &&
                    <CashflowSalesNetIncomeMobile
                        displayCode={""}
                        percentChange={props.dividendChangePercent}
                        shareValue={props.dividendChange}
                        tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                    />}
                    {props.cardResult === CardResults.risingDivAndCashflow && <TableColumn value={props.dividendPerShare}/>}
                    { // 10th card
                        props.cardResult === CardResults.sharesUpdatingAnnually && (
                            <>
                                <CashflowSalesNetIncomeMobile
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year5CashflowChangePercent}
                                    shareValue={props.cashFlowYear1}
                                    dataIndex={"cashflow"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncomeMobile
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year5SalesChangePercent}
                                    shareValue={props.salesYear1}
                                    dataIndex={"sales"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncomeMobile
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year5NetIncomeChangePercent}
                                    shareValue={props.netIncomeYear1}
                                    dataIndex={"netIncome"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                            </>

                        )
                    }
                    { // 11th card
                        props.cardResult === CardResults.sharesUpdatingAnnually3Years && (
                            <>
                                <CashflowSalesNetIncomeMobile
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year3CashflowChangePercent}
                                    shareValue={props.cashFlowYear1}
                                    dataIndex={"cashflow"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncomeMobile
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year3SalesChangePercent}
                                    shareValue={props.salesYear1}
                                    dataIndex={"sales"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncomeMobile
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year3NetIncomeChangePercent}
                                    shareValue={props.netIncomeYear1}
                                    dataIndex={"netIncome"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                            </>

                        )
                    }
                    {props.cardResult === CardResults.stocksTurnover && <CashflowSalesNetIncomeMobile
                        displayCode={props.displayCode}
                        percentChange={props.salesPerEmployeeChangePercent}
                        shareValue={props.salesPerEmployee}
                        tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                    />}
                    {props.cardResult === CardResults.dividendPayoutRatio && <TableColumn value={props.dividendPayoutRatio + '%'}/>}
                    <td className="px-0 text-right pt-3 mb-0 pb-2 ">
                        <ProfileInstrumentAddPopup
                            className="text-white p-0 m-0"
                            instrumentGroupId={props.groupId}
                            instrumentId={props.id}
                            name={props.name}
                            watchlist={true}
                            portfolio={true}
                            emptyPortfolioText={'Noch keinem Portfolio hinzugefügt'}
                            emptyWatchlistText={'Noch nicht beobachtet'}
                        >
                            <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons" imgClass="plus-butt-icon" />
                        </ProfileInstrumentAddPopup>
                    </td>
                </tr>
            </>
        )

    if (isDesktop)
        return (
            <>
                <tr className="border-bottom border-border-gray bg-white">
                    <ShareName seoTag={props.seoTag} bezeichnung={props.bezeichnung} securityCategoryId={props.securityCategoryId} />
                    <Kurs displayCode={props.displayCode} kurs={props.kurs} percentChange={props.percentChange} className="d-flex"/>
                    <Region region={props.region} />
                    <td className={`text-left font-weight-bold pt-3 mb-0 pb-2`}>{props.sector}</td>

                    {props.cardResult === CardResults.marketCap && <td className={`text-right font-weight-bold pt-3 mb-0 pb-2`}>{props.marketCapitalization} {props.marketCapCurrencyCode}</td>}

                    { // 2nd card
                        props.cardResult === CardResults.updatingShares && (
                            <>
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.cashflowPercentageChange}
                                    shareValue={props.cashFlowYear1}
                                    dataIndex={"cashflow"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.salesPercentChange}
                                    shareValue={props.salesYear1}
                                    dataIndex={"sales"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.netIncomePercentChange}
                                    shareValue={props.netIncomeYear1}
                                    dataIndex={"netIncome"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                            </>
                        )
                    }

                    { // 3rd card
                        props.cardResult === CardResults.updatingSales && (
                            <>
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.salesPercentChange}
                                    shareValue={props.salesYear1}
                                    dataIndex={"sales"}
                                    tableHeaders={props.tableHeaders}
                                />
                                <td>{props.newPeriod}</td>
                            </>
                        )
                    }

                    { // 4th card
                        props.cardResult === CardResults.compRisingDividend && <>
                        <td className={"pt-3"}>{props.dividendYield}%</td>
                        <td>{props.newPeriod}</td>
                    </>
                    }

                    { // 5th card
                        props.cardResult === CardResults.stocksRisingDividend && (
                        <>
                            <TableColumn value={props.dividendYield + '%'}/>
                            <td>{props.newPeriod}</td>
                        </>
                    )}

                    {props.cardResult === CardResults.compChangingDividend && (
                        <>
                            <CashflowSalesNetIncome
                                displayCode={""}
                                percentChange={props.dividendChangePercent}
                                shareValue={props.dividendChange}
                                tableHeaders={props.tableHeaders}
                            />
                            <td>{props.newPeriod}</td>
                        </>
                    )}

                    {props.cardResult === CardResults.compIncrDividend && (
                        <>
                            <CashflowSalesNetIncome
                                displayCode={""}
                                percentChange={props.dividendChangePercent}
                                shareValue={props.dividendChange}
                                tableHeaders={props.tableHeaders}
                            />
                            <td>{props.newPeriod}</td>
                        </>
                    )}

                    {
                        // 8th card
                        props.cardResult === CardResults.sharesRisingDividend && (
                            <>
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.cashflowPercentageChange}
                                    shareValue={props.cashFlowYear1}
                                    dataIndex={"cashflow"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.salesPercentChange}
                                    shareValue={props.salesYear1}
                                    dataIndex={"sales"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.netIncomePercentChange}
                                    shareValue={props.netIncomeYear1}
                                    dataIndex={"netIncome"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                            </>
                        )
                    }

                    {
                        // 9th card
                        props.cardResult === CardResults.risingDivAndCashflow && (
                            <>
                                <td className={"pt-3"}>{props.dividendPerShare}</td>
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.cashflowPercentageChange}
                                    shareValue={props.cashFlowYear1}
                                    dataIndex={"cashflow"}
                                    tableHeaders={props.tableHeaders}
                                />
                            </>
                        )
                    }

                    { // 10th card
                        props.cardResult === CardResults.sharesUpdatingAnnually && (
                            <>
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year5CashflowChangePercent}
                                    shareValue={props.cashFlowYear1}
                                    dataIndex={"cashflow"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year5SalesChangePercent}
                                    shareValue={props.salesYear1}
                                    dataIndex={"sales"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year5NetIncomeChangePercent}
                                    shareValue={props.netIncomeYear1}
                                    dataIndex={"netIncome"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                            </>
                        )
                    }

                    { // 11th card
                        props.cardResult === CardResults.sharesUpdatingAnnually3Years && (
                            <>
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year3CashflowChangePercent}
                                    shareValue={props.cashFlowYear1}
                                    dataIndex={"cashflow"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year3SalesChangePercent}
                                    shareValue={props.salesYear1}
                                    dataIndex={"sales"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year3NetIncomeChangePercent}
                                    shareValue={props.netIncomeYear1}
                                    dataIndex={"netIncome"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                            </>
                        )
                    }

                    {  // 12th card
                        props.cardResult === CardResults.stocksTurnover && (
                            <>
                                <CashflowSalesNetIncome
                                    displayCode={props.displayCode}
                                    percentChange={props.salesPerEmployeeChangePercent}
                                    shareValue={props.salesPerEmployee}
                                    tableHeaders={props.tableHeaders}
                                />
                                <td>{props.newPeriod}</td>
                            </>
                        )
                    }

                    {   // 13th card
                        props.cardResult === CardResults.dividendPayoutRatio && (
                            <>
                                <TableColumn value={props.dividendPayoutRatio + '%'}/>
                                <TableColumn value={props.dividendYieldAverage + '%'}/>
                            </>
                        )
                    }
                    <td className="d-xl-table-cell d-none px-0 text-right pt-3 mb-0 pb-2 ">
                        <ProfileInstrumentAddPopup
                            className="text-white p-0 m-0"
                            instrumentGroupId={props.groupId}
                            instrumentId={props.id}
                            name={props.name}
                            watchlist={true}
                            portfolio={true}
                            emptyPortfolioText={'Noch keinem Portfolio hinzugefügt'}
                            emptyWatchlistText={'Noch nicht beobachtet'}
                            direction={'left'}
                        >
                            <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons" imgClass="plus-butt-icon" />
                        </ProfileInstrumentAddPopup>
                    </td>
                </tr>
            </>
        );

    if (isMedium)
        return (
            <>
                <tr className="border-bottom border-border-gray bg-white">
                    <td className="font-weight-bold d-md-table-cell d-none share-name-column medium" style={{maxWidth: (props.tableHeaders && props.tableHeaders.filter(item => item.dataIndex==="cashflow").length>0) ? "160px" : "200px"}}>
                        {props.securityCategoryId && props.seoTag ?
                            <Link to={(getFinanztreffAssetLink(props.securityCategoryId, props.seoTag, props.exchangeCode))}
                                  className="ml-xl-n2">{props.bezeichnung}</Link> :
                            <>{props.bezeichnung}</>
                        }
                        <br/>
                        <span className="font-weight-bold d-flex font-size-15px"><span style={{minWidth:"100px"}}>{props.kurs} {props.kurs !== '-' && <span>{props.displayCode}</span>}</span>
                            <ShowChangeArrowIcon className="ml-n2" percentChange={props.percentChange}/>
                        </span>
                    </td>
                    <td className=" d-sm-none d-md-table-cell text-ellipsis" style={{ maxWidth: '60px' }}>{props.region}</td>
                    <td className={`text-left font-weight-bold pt-3 mb-0 pb-2`}>{props.sector}</td>
                    {props.cardResult === CardResults.marketCap && <td className={`text-right font-weight-bold pt-3 mb-0 pb-2`}>{props.marketCapitalization} {props.marketCapCurrencyCode}</td>}
                    { // 2nd card
                        props.cardResult === CardResults.updatingShares && (
                            <>
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.cashflowPercentageChange}
                                    shareValue={props.cashFlowYear1}
                                    dataIndex={"cashflow"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.salesPercentChange}
                                    shareValue={props.salesYear1}
                                    dataIndex={"sales"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.netIncomePercentChange}
                                    shareValue={props.netIncomeYear1}
                                    dataIndex={"netIncome"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                            </>
                        )
                    }
                    { // 3rd card
                        props.cardResult === CardResults.updatingSales && (
                            <>
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.salesPercentChange}
                                    shareValue={props.salesYear1}
                                    dataIndex={"sales"}
                                    tableHeaders={props.tableHeaders}
                                />
                            </>
                        )
                    }
                    { // 4th card
                        props.cardResult === CardResults.compRisingDividend && <>
                            <td className={"pt-3"}>{props.dividendYield}%</td>
                            <td>{props.newPeriod}</td>
                        </>
                    }
                    { // 5th card
                        props.cardResult === CardResults.stocksRisingDividend && (
                            <>
                                <TableColumn value={props.dividendYield + '%'}/>
                                <td>{props.newPeriod}</td>
                            </>
                        )
                    }
                    {props.cardResult === CardResults.compChangingDividend && (
                        <>
                            <CashflowSalesNetIncome
                                displayCode={""}
                                percentChange={props.dividendChangePercent}
                                shareValue={props.dividendChange}
                                tableHeaders={props.tableHeaders}
                                className={"pl-0 ml-n5"}
                            />
                        </>
                    )}
                    {props.cardResult === CardResults.compIncrDividend && (
                        <>
                            <CashflowSalesNetIncome
                                displayCode={""}
                                percentChange={props.dividendChangePercent}
                                shareValue={props.dividendChange}
                                tableHeaders={props.tableHeaders}
                                className={"pl-0 ml-n5"}
                            />
                        </>
                    )}

                    {
                        // 8th card
                        props.cardResult === CardResults.sharesRisingDividend && (
                            <>
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.cashflowPercentageChange}
                                    shareValue={props.cashFlowYear1}
                                    dataIndex={"cashflow"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.salesPercentChange}
                                    shareValue={props.salesYear1}
                                    dataIndex={"sales"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.netIncomePercentChange}
                                    shareValue={props.netIncomeYear1}
                                    dataIndex={"netIncome"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                            </>
                        )
                    }
                    {
                        // 9th card
                        props.cardResult === CardResults.risingDivAndCashflow && (
                            <td className={"pt-3"}>{props.dividendPerShare}</td>
                        )
                    }
                    { // 10th card
                        props.cardResult === CardResults.sharesUpdatingAnnually && (
                            <>
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year5CashflowChangePercent}
                                    shareValue={props.cashFlowYear1}
                                    dataIndex={"cashflow"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year5SalesChangePercent}
                                    shareValue={props.salesYear1}
                                    dataIndex={"sales"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year5NetIncomeChangePercent}
                                    shareValue={props.netIncomeYear1}
                                    dataIndex={"netIncome"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                            </>
                        )
                    }
                    { // 11th card
                        props.cardResult === CardResults.sharesUpdatingAnnually3Years && (
                            <>
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year3CashflowChangePercent}
                                    shareValue={props.cashFlowYear1}
                                    dataIndex={"cashflow"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year3SalesChangePercent}
                                    shareValue={props.salesYear1}
                                    dataIndex={"sales"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                                <CashflowSalesNetIncome
                                    displayCode={props.companyCurrencyDisplayCode}
                                    percentChange={props.year3NetIncomeChangePercent}
                                    shareValue={props.netIncomeYear1}
                                    dataIndex={"netIncome"}
                                    tableHeaders={filterHeaders(props.tableHeaders, props.criteria)}
                                />
                            </>
                        )
                    }
                    {  // 12th card
                        props.cardResult === CardResults.stocksTurnover && (
                            <>
                                <CashflowSalesNetIncome
                                    displayCode={props.displayCode}
                                    percentChange={props.salesPerEmployeeChangePercent}
                                    shareValue={props.salesPerEmployee}
                                    tableHeaders={props.tableHeaders}
                                />
                            </>
                        )
                    }

                    {   // 13th card
                        props.cardResult === CardResults.dividendPayoutRatio && (
                            <>
                                <TableColumn value={props.dividendPayoutRatio + '%'}/>
                                <TableColumn value={props.dividendYieldAverage + '%'}/>
                            </>
                        )
                    }
                    <td className="px-0 text-right pt-3 mb-0 pb-2 ">
                        <ProfileInstrumentAddPopup
                            className="text-white p-0 m-0"
                            instrumentGroupId={props.groupId}
                            instrumentId={props.id}
                            name={props.name}
                            watchlist={true}
                            portfolio={true}
                            emptyPortfolioText={'Noch keinem Portfolio hinzugefügt'}
                            emptyWatchlistText={'Noch nicht beobachtet'}
                        >
                            <SvgImage icon="icon_plus_blue.svg" spanClass="action-icons" imgClass="plus-butt-icon" />
                        </ProfileInstrumentAddPopup>
                    </td>
                </tr>
            </>
        )

    return (<></>);
}

export default ShareSearchResultView

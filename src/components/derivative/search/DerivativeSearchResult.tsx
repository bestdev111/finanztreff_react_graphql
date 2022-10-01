import {gql, QueryResult, useQuery} from "@apollo/client";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {Spinner, Table} from "react-bootstrap";
import {extractQuotes, numberFormatDecimals} from "../../../utils";
import {
    AssetGroup, DerivativeKeyFigure,
    DerivativeOptionType,
    Instrument,
    InstrumentGroupUnderlying,
    Query
} from "../../../generated/graphql";
import {loader} from "graphql.macro";
import InfiniteScroll from "../../common/scroller/InfiniteScroller";
import classNames from "classnames";
import './DerivativeSearchResult.scss';
import moment from "moment";
import DiscountResultTable from "./table-body/DiscountResultTable";
import WarrantClassicResultTable from "./table-body/WarrantClassicResultTable";
import KnockResultTable from "./table-body/KnockResultTable";
import DiscountOthersResultTable from "./table-body/DiscountOthersResultTable";
import WarrantDiscountResultTable from "./table-body/WarrantDiscountResultTable";
import WarrantStayResultTable from "./table-body/WarrantStayResultTable";
import WarrantInlineResultTable from "./table-body/WarrantInlineResultTable";
import FactorResultTable from "./table-body/FactorResultTable";
import BonusClassicResultTable from "./table-body/BonusClassicResultTable";
import BonusReverseCapResultTable from "./table-body/BonusReverseCapResultTable";
import {
    bonusClassicResultTable,
    bonusReverseCapResultTable,
    capitalResultTable, DERIVATIVE_TABLE_SORT_COLUMNS,
    derivativeClassicWarrantResultTable,
    derivativeDiscountWarrantTable, derivativeDownOutputWarrantTable,
    derivativeInlineWarrantTable,
    derivativeKOResultTable,
    derivativeStayWarrantTable,
    derivativeTable,
    discountResultTable,
    discountSonstigeResultTable,
    expressResultTable,
    factorResultTable, indexBonusResultTable, indexResultTable, indexSonstigeTable,
    outperformanceResultTable,
    reverseConvertibleBondsResultTable,
    revOtherConvertibleBondsResultTable, sonstigeBonusResultTable, sonstigeTable, sprintResultTable
} from "./tableHeaders";
import ExpressResultTable from "./table-body/ExpressResultTable";
import RevConvertibleBondsClassicResultTable from "./table-body/RevConvertibleBondsClassicResultTable";
import RevOtherConvertibleBondsResultTable from "./table-body/RevOtherConvertibleBondsResultTable";
import CapitalResultTable from "./table-body/CapitalResultTable";
import OutperformanceResultTable from "./table-body/OutperformanceResultTable";
import IndexResultTable from "./table-body/IndexResultTable";
import {ConfigContext, DataContext, FilterContext} from "../DerivativeSearch";
import {IndexSonstigeTable} from "./table-body/IndexSonstigeTable";
import SonstigeResultTable from "./table-body/SonstigeResultTable";
import {DerivativeFilter, emptyDerivativeFilter} from "./types/DerivativeSearchTypes";
import * as net from "net";
import WarrantDownOutputResultTable from "./table-body/WarrantDownOutputResultTable";

interface DerivativeSearchResultProps {
    // results?: QueryResult;
    // assetGroup: AssetGroup | undefined;
    // assetType: string;
    // underlyingInstrumentGroupId?: number | null;
    // typeName: any;
    // filter: DerivativeFilter;
    // instrument?:Instrument|null|undefined;
}

// export function DerivativeSearchResult({assetType, assetGroup, underlyingInstrumentGroupId, typeName, filter, instrument}: DerivativeSearchResultProps) {
export function DerivativeSearchResult() {
    const RESULT_SIZE = 30;
    const {getSearchConfig, setSearchConfig} = useContext(ConfigContext);
    const {getSearchFilter, setSearchFilter} = useContext(FilterContext);
    const coreData = useContext(DataContext);

    const config = getSearchConfig ? getSearchConfig() : null;
    const filter = getSearchFilter ? getSearchFilter() : emptyDerivativeFilter();


    const generateVariables = function () {

        const convertMaturityDate = function (md: any) {
            if (md) {
                if (md.constructor.name === 'Date') {
                    return moment(md).format('YYYY-MM-DD')
                }
                if (md.constructor.name === 'Number') {
                    return moment().add(md, "months").format('YYYY-MM-DD')
                }
            }

            return null;
        }

        const v: any = {
            underlyingInstrumentGroupId: config?.underlying?.group?.id,
            first: RESULT_SIZE, after: null,
            assetTypeGroup: config?.assetTypeGroup?.id,
            assetGroup: config?.assetClass?.assetGroup,
            maturityDateFrom: convertMaturityDate(filter?.runningTime.from),
            maturityDateTo: convertMaturityDate(filter?.runningTime.to),
            issuerId: filter?.issuers.map(i => i.id).length === 0 ? null : filter?.issuers.map(i => i.id),
        }

        if (filter?.callPut === "CALL") v.optionType = DerivativeOptionType.Call;
        if (filter?.callPut === "PUT") v.optionType = DerivativeOptionType.Put;


        if (filter?.typ) {
            const items = coreData.derivativeAssetTypeTyps?.filter((t: any) => t.assetType.name === filter?.typ);
            if (items && items.length > 0) v.assetType = items[0].assetType.id;
        }


        const keyFigures: any[] = [];
        const sort: any = [];

        if (filter?.leverage.from || filter?.leverage.to) {
            keyFigures.push({
                keyFigure: 'GEARING',
                from: filter?.leverage.from,
                to: filter?.leverage.to
            });
        }
        if (filter?.stopLoss.period.from || filter?.stopLoss.period.to) {
            keyFigures.push({
                keyFigure: 'KNOCK_OUT',
                from: filter?.stopLoss.period.from,
                to: filter?.stopLoss.period.to
            });
        }

        if (filter?.basisprise.period.from || filter?.basisprise.period.to) {
            keyFigures.push({
                keyFigure: 'STRIKE',
                from: filter?.basisprise.basis === "absolut" ? filter?.basisprise.period.from :
                    (filter?.basisprise.period.from ? filter?.basisprise.period.from / 100 * (config?.underlying?.snapQuote?.quote?.value || 1) +
                        (config?.underlying?.snapQuote?.quote?.value || 1) : null),
                to: filter?.basisprise.basis === "absolut" ? filter?.basisprise.period.to :
                    (filter?.basisprise.period.to ? filter?.basisprise.period.to / 100 * (config?.underlying?.snapQuote?.quote?.value || 1) +
                        (config?.underlying?.snapQuote?.quote?.value || 1) : null)
            });
        }

        if (filter?.oben.period.from || filter?.oben.period.to) {
            keyFigures.push({
                keyFigure: 'KNOCK_OUT_UPPER_BARRIER',
                from: filter?.oben.basis === "absolut" ? filter?.oben.period.from :
                    (filter?.oben.period.from ? filter?.oben.period.from / 100 * (config?.underlying?.snapQuote?.quote?.value || 1) +
                        (config?.underlying?.snapQuote?.quote?.value || 1) : null),
                to: filter?.oben.basis === "absolut" ? filter?.oben.period.to :
                    (filter?.oben.period.to ? filter?.oben.period.to / 100 * (config?.underlying?.snapQuote?.quote?.value || 1) +
                        (config?.underlying?.snapQuote?.quote?.value || 1) : null)
            });
        }

        if (filter?.unten.period.from || filter?.unten.period.to) {
            keyFigures.push({
                keyFigure: 'KNOCK_OUT_LOWER_BARRIER',
                from: filter?.unten.basis === "absolut" ? filter?.unten.period.from :
                    (filter?.unten.period.from ? filter?.unten.period.from / 100 * (config?.underlying?.snapQuote?.quote?.value || 1) +
                        (config?.underlying?.snapQuote?.quote?.value || 1) : null),
                to: filter?.unten.basis === "absolut" ? filter?.unten.period.to :
                    (filter?.unten.period.to ? filter?.unten.period.to / 100 * (config?.underlying?.snapQuote?.quote?.value || 1) +
                        (config?.underlying?.snapQuote?.quote?.value || 1) : null)
            });
        }

        if (filter?.bonusLevel.period.from || filter?.bonusLevel.period.to) {
            keyFigures.push({
                keyFigure: 'BONUS_LEVEL',
                from: filter?.bonusLevel.basis === "absolut" ? filter?.bonusLevel.period.from :
                    (filter?.bonusLevel.period.from ? filter?.bonusLevel.period.from / 100 * (config?.underlying?.snapQuote?.quote?.value || 1) +
                        (config?.underlying?.snapQuote?.quote?.value || 1) : null),
                to: filter?.bonusLevel.basis === "absolut" ? filter?.bonusLevel.period.to :
                    (filter?.bonusLevel.period.to ? filter?.bonusLevel.period.to / 100 * (config?.underlying?.snapQuote?.quote?.value || 1) +
                        (config?.underlying?.snapQuote?.quote?.value || 1) : null)
            });
        }

        if (filter?.barriere.period.from || filter?.barriere.period.to) {
            keyFigures.push({
                keyFigure: 'BONUS_BARRIER',
                from: filter?.barriere.basis === "absolut" ? filter?.barriere.period.from :
                    (filter?.barriere.period.from ? filter?.barriere.period.from / 100 * (config?.underlying?.snapQuote?.quote?.value || 1) +
                        (config?.underlying?.snapQuote?.quote?.value || 1) : null),
                to: filter?.barriere.basis === "absolut" ? filter?.barriere.period.to :
                    (filter?.barriere.period.to ? filter?.barriere.period.to / 100 * (config?.underlying?.snapQuote?.quote?.value || 1) +
                        (config?.underlying?.snapQuote?.quote?.value || 1) : null)
            });
        }

        if (filter?.osWert.from || filter?.osWert.to) {
            keyFigures.push({
                keyFigure: 'MONEYNESS',
                from: filter?.osWert.from,
                to: filter?.osWert.to
            });
        }

        if (filter?.performance.from || filter?.performance.to) {
            keyFigures.push({
                keyFigure: 'PERFORMANCE_MONTH1',
                from: filter?.performance.from,
                to: filter?.performance.to
            });
        }

        const parseFromToValues = function (v: string) {
            v = v.trim();
            let vF = null;
            let vT = null;

            if ((v.length > 0) && (v !== "alle")) {
                if (v[0] === '<') {
                    vT = v.replace('%', '').replace('<', '')
                        .replace('=', '').trim();
                } else if (v[0] === '>') {
                    vF = v.replace('%', '').replace('>', '')
                        .replace('=', '').trim();
                } else {
                    const parts = v.split('-');
                    if(parts.length === 2) {
                        vF = parts[0].replace('%', '').trim();
                        vT = parts[1].replace('%', '').trim();
                    }
                }

                if(vT) {
                    vT = parseFloat(vT);
                    if(isNaN(vT)) vT = null;
                }

                if(vF) {
                    vF = parseFloat(vF);
                    if(isNaN(vF)) vF = null;
                }
            }

            return {from: vF, to: vT};
        }

        if (filter?.maxRendite) {
            const {from, to} = parseFromToValues(filter?.maxRendite);
            keyFigures.push({
                keyFigure: 'MAX_RETURN_ANNUAL',
                from: from,
                to: to
            });
        }

        if (filter?.swRendite) {
            const {from, to} = parseFromToValues(filter?.swRendite);
            keyFigures.push({
                keyFigure: 'SIDEWAYS_RETURN_ANNUAL',
                from: from,
                to: to
            });
        }

        if (filter?.bonusAufgeld) {
            const {from, to} = parseFromToValues(filter?.bonusAufgeld);
            keyFigures.push({
                keyFigure: 'PREMIUM_ANNUAL',
                from: from,
                to: to
            });
        }

        if (filter?.bonusPuffer) {
            const {from, to} = parseFromToValues(filter?.bonusPuffer);
            keyFigures.push({
                keyFigure: 'BONUS_BUFFER_ABSOLUTE',
                from: from,
                to: to
            });
        }

        if (filter?.bonusRendite) {
            const {from, to} = parseFromToValues(filter?.bonusRendite);
            keyFigures.push({
                keyFigure: 'BONUS_RETURN_ANNUAL',
                from: from,
                to: to
            });
        }

        if (filter?.discount) {
            const {from, to} = parseFromToValues(filter?.discount);
            keyFigures.push({
                keyFigure: 'DISCOUNT_ABSOLUTE',
                from: from,
                to: to
            });
        }


        if (filter?.cap.period.from || filter?.cap.period.to) {
            keyFigures.push({
                keyFigure: 'CAP',
                from: filter?.cap.basis === "absolut" ? filter?.cap.period.from :
                    (filter?.cap.period.from ? filter?.cap.period.from / 100 * (config?.underlying?.snapQuote?.quote?.value || 1)
                        + (config?.underlying?.snapQuote?.quote?.value || 1) : null),
                to: filter?.cap.basis === "absolut" ? filter?.cap.period.to :
                    (filter?.cap.period.to ? filter?.cap.period.to / 100 * (config?.underlying?.snapQuote?.quote?.value || 1)
                        + (config?.underlying?.snapQuote?.quote?.value || 1) : null)
            });
        }


        if (filter?.sort) {
            sort.push({field: filter?.sort.field, descending: filter?.sort.descending});
        }

        return {...v, keyFigures: keyFigures, sort: sort};
    }


    const {
        data,
        loading,
        fetchMore,
        refetch,
        networkStatus,
        error
    } = useQuery<Query>(loader('../getDerivativeSearchResult.graphql'), {
            skip: !filter || !config,
            variables: generateVariables(),
        }
    );
    
    useEffect(() => {
        if (!loading) {
            // refetch(variables);
        }
    }, [filter]);

    const loadMoreResult = () => {
        if (data && data.searchDerivative && data.searchDerivative.pageInfo) {
            const endCursor = data.searchDerivative.pageInfo?.endCursor;
            fetchMore && fetchMore({variables: {after: endCursor}})
        }
    }

    let derivativeTableMap: any = {
        "WARR_CLASSIC": derivativeClassicWarrantResultTable,
        "WARR_OTHER_DOWN_OUT": derivativeDownOutputWarrantTable,
        "WARR_DISCOUNT": derivativeDiscountWarrantTable,
        "WARR_INLINE": derivativeInlineWarrantTable,
        "WARR_OTHER": derivativeStayWarrantTable,
        "KNOCK_X_TURBO_OPEN_END": derivativeKOResultTable,
        "KNOCK_OPEN_END_WITH_SL": derivativeKOResultTable,
        "KNOCK_CLASSIC": derivativeKOResultTable,
        "KNOCK_OPEN_END_WITHOUT_SL": derivativeKOResultTable,
        "KNOCK_X_TURBO": derivativeKOResultTable,
        "KNOCK_SMART": derivativeKOResultTable,
        "KNOCK_WITH_SL": derivativeKOResultTable,
        "CERT_DISC_CLASSIC_PROTECT_PROTECT_PRO": discountResultTable,
        "559": discountResultTable,

        "560": discountResultTable,
        "565": discountSonstigeResultTable,
        "562": discountSonstigeResultTable,
        "563": discountSonstigeResultTable,
        "566": discountSonstigeResultTable,
        "561": discountSonstigeResultTable,
        "564": discountSonstigeResultTable,

        "CERT_FACTOR_ALL": factorResultTable,
        "CERT_FACTOR_OTHER": factorResultTable,
        "579": bonusClassicResultTable,
        "580": bonusClassicResultTable,
        "581": bonusClassicResultTable,
        "582": bonusClassicResultTable,
        "583": bonusReverseCapResultTable,
        "584": bonusReverseCapResultTable,
        "CERT_EXPRESS_CLASSIC": expressResultTable,
        "568": expressResultTable,
        "569": expressResultTable,
        "570": expressResultTable,
        "573": expressResultTable,
        "574": expressResultTable,
        "575": expressResultTable,
        "CERT_EXPRESS_OTHER": expressResultTable,

        "CERT_CAP_PROTECTION_ALPHA": capitalResultTable,
        "CERT_CAP_PROTECTION_OTHER": capitalResultTable,
        "CERT_CAP_PROTECTION_CLASSIC": capitalResultTable,

        "CERT_SPRINT_OUTPERFORMANCE_OUTPERFORMANCE": outperformanceResultTable,
        "CERT_SPRINT_OUTPERFORMANCE_SPRINT": outperformanceResultTable,
        "CERT_SPRINT_OUTPERFORMANCE_OTHER": outperformanceResultTable,

        "610": sprintResultTable,
        "611": sprintResultTable,
        "612": sprintResultTable,
        "613": sprintResultTable,

        "599": indexSonstigeTable,
        "CERT_INDEX_OTHER": indexSonstigeTable,
        "CERT_INDEX_CLASSIC": indexResultTable,


        "601": indexResultTable,
        "600": indexResultTable,
        "602": indexResultTable,
        "603": indexResultTable,
        "604": indexResultTable,
        "605": indexResultTable,

        "999": sonstigeBonusResultTable,
        "591": sonstigeBonusResultTable,
        "CERT_BONUS_CAPPED_MULTI": sonstigeBonusResultTable,
        "CERT_BONUS_MULTI": sonstigeBonusResultTable,
        "CERT_BONUS_OTHER": sonstigeBonusResultTable,

        "592": indexBonusResultTable,
        "CERT_BONUS_CAPPED": indexBonusResultTable,
        "CERT_BONUS_CAPPED_PRO": indexBonusResultTable,
        "CERT_BONUS_CLASSIC": indexBonusResultTable,
        "CERT_BONUS_PRO": indexBonusResultTable,
        "CERT_BONUS_REVERSE": indexBonusResultTable,
        "CERT_BONUS_REVERSE_CAP": indexBonusResultTable,

        "CERT_REVERSE_CLASSIC_PROTECT": reverseConvertibleBondsResultTable,
        "CERT_REVERSE_OTHER": revOtherConvertibleBondsResultTable,
    }

    if (loading) {
        return (
            <div>
                <Spinner animation={"border"}/>
            </div>
        )
    }

    let tableHeaders: any = sonstigeTable;
    let tableBody: any = null;

    if (config?.assetTypeGroup?.id) {
        tableHeaders = derivativeTableMap[config?.assetTypeGroup?.id] || sonstigeTable;
    }

    const TableHeaderCell = function (props: any) {
        const filter = props.filter;

        for (let i = 0; i < DERIVATIVE_TABLE_SORT_COLUMNS.length; i++) {

            if (DERIVATIVE_TABLE_SORT_COLUMNS[i].columName === props.val.name) {
                return <th key={props.val.id + '_' + i}
                           className={classNames(props.val.classNameValue, 'can-sort', 'text-blue', 'text-left')}>
                    <a href={"#"} onClick={(e) => {
                        e.preventDefault();
                        props.onClick(DERIVATIVE_TABLE_SORT_COLUMNS[i].fieldName)
                    }}>{props.val.name}</a>
                    {
                        filter.sort && filter.sort.field === DERIVATIVE_TABLE_SORT_COLUMNS[i].fieldName &&
                        <span className={classNames("svg-icon sort-arrow", {
                            "direction-bottom": filter.sort?.descending,
                            "direction-top": !filter.sort?.descending
                        })}>
                       <img src="/static/img/svg/icon_arrow_long_right_dark.svg"/>
                   </span>
                    }
                </th>
            }
        }

        return <th key={props.val.id} className={classNames(props.val.classNameValue)}>{props.val.name}</th>
    }


    const toggleSorting = function (fieldName: string) {
        let newFilter: DerivativeFilter = {...filter};

        if (newFilter.sort && newFilter.sort?.field === fieldName) {
            if (newFilter.sort?.descending) newFilter.sort = null;
            else newFilter.sort.descending = true;
        } else {
            newFilter.sort = {field: fieldName, descending: false};
        }

        setSearchFilter(newFilter, null);
    }

    return <>
        <div className="pt-4">
            <h5 className="font-weight-bold float-left">Ergebnisse ({data?.searchDerivative.count}) </h5>
        </div>

        <InfiniteScroll
            className="w-100"
            style={{overflowY: 'hidden'}}
            next={() => !loading && loadMoreResult()}
            hasMore={!!(data && data.searchDerivative && data.searchDerivative.pageInfo && data.searchDerivative.pageInfo.hasNextPage)}
            loader={!tableBody &&
                <div>
                    <Spinner animation={"border"}/>
                </div>}
            dataLength={data ? data?.searchDerivative.edges.length : 0}
        >
            <div>
                <Table variant="derivative" className="table-borderless w-100" style={{opacity: loading ? '0.5' : '1'}}>
                    {
                        tableHeaders ? (
                                <thead className="bg-gray-light">
                                <tr>
                                    {
                                        tableHeaders?.map((val: derivativeTable) => (
                                            <TableHeaderCell val={val} filter={filter}
                                                             onClick={(fieldName: string) => toggleSorting(fieldName)}/>
                                        ))
                                    }
                                    <th className="text-right p-0">&nbsp;</th>
                                    <th className="text-right p-0">&nbsp;</th>
                                </tr>
                                </thead>
                            ) :
                            <h4 className={"text-center"}>Keine Treffer gefunden</h4>
                    }
                    <tbody>
                    {
                        data && data?.searchDerivative?.edges?.length > 0 && !loading &&
                        <TableBody
                            typeName={'Classic OS'}
                            assetType={config?.assetTypeGroup}
                            nodes={data?.searchDerivative?.edges}/>
                    }
                    </tbody>
                </Table>
                {
                    loading && <div>
                        <Spinner animation={"border"}/>
                    </div>
                }
            </div>
        </InfiniteScroll>
    </>;
}

export function computeDueToCss(dueTo: number | null | undefined): string | null {
    if (dueTo == null || Number.isNaN(dueTo) || dueTo < 0) {
        return "text-black";
    }
    if (dueTo > 90) {
        return "text-green";
    }
    if (dueTo > 30) {
        return "text-orange";
    }
    return "text-pink";
}

export function formatMoneyness(osWert: number | null | undefined): string {
    if (!osWert) {
        return "-";
    }
    if (osWert < -10) {
        return "stark aus dem Geld";
    }
    if (osWert < -5) {
        return "aus dem geld";
    }
    if (osWert <= 5) {
        return "am Geld";
    }
    if (osWert < 10) {
        return "im Geld";
    }
    return "stark im Geld";
}

export function formatUnderlyingStrike(underlying: InstrumentGroupUnderlying | null | undefined): string {
    if (!underlying || underlying.strike === null) {
        return "-";
    }
    return (numberFormatDecimals(underlying.strike, 2, 2) + " " + (underlying.currency?.displayCode || ""));
}

export function formatUnderlyingKnockOut(underlying: InstrumentGroupUnderlying | null | undefined): string {
    if (!underlying || underlying.knockOut === null) {
        return "-";
    }
    return (numberFormatDecimals(underlying.knockOut, 2, 2) + " " + (underlying.currency?.displayCode || ""));
}

export function formatUnderlyingCap(underlying: InstrumentGroupUnderlying | null | undefined): string {
    if (!underlying || underlying.cap == null) {
        return "-";
    }
    return (numberFormatDecimals(underlying.cap, 2, 2) + " " + (underlying.currency?.displayCode || ""));
}

export function formatUnderlyingDiffCap(deltaCap: number | null | undefined): string {
    if (!deltaCap || deltaCap == null) {
        return "-";
    }
    return (numberFormatDecimals(deltaCap, 2, 2));
}

interface typeNameProps extends Instrument {
    typeName?: any;
    assetType?: any;
}

function TableBody({typeName, assetType, nodes}: any) {
    return (<>
        {
            nodes.map(
                (row: any, index: number) =>
                    <ResultRow typeName={typeName} assetType={assetType}
                               key={row.node.id + '_' + index} {...row.node}  />)
        }</>)
}

function ResultRow({
                       id,
                       wkn,
                       typeName,
                       assetType,
                       derivativeKeyFigures,
                       snapQuote,
                       group,
                       performance
                   }: typeNameProps): any {
    let optionName = "";
    let {bid, ask} = extractQuotes(snapQuote);
    let dueTo: number | null = null;
    if (group?.main?.lastTradingDay) {
        let lastTradingDay = moment(group.main.lastTradingDay);
        dueTo = lastTradingDay.diff(moment(), 'd');
    } else {
        if (group?.derivative?.maturityDate) {
            let maturityDay = moment(group?.derivative?.maturityDate);
            dueTo = maturityDay.diff(moment(), 'd');
        }
    }

    if (group.derivative?.optionType === DerivativeOptionType.Call) {
        optionName = "LONG"
    } else if (group.derivative?.optionType === DerivativeOptionType.Put) {
        optionName = "SHORT"
    }

    let diffSl = derivativeKeyFigures?.deltaStopLossAbsolute;
    let typeNameValue = typeName;

    let maxReturn = derivativeKeyFigures?.maxReturn;

    const tableBody = (): any => {
        switch (assetType.id) {
            case "KNOCK_X_TURBO_OPEN_END":
            case "KNOCK_OPEN_END_WITH_SL":
            case "KNOCK_CLASSIC":
            case "KNOCK_OPEN_END_WITHOUT_SL":
            case "KNOCK_X_TURBO":
            case "KNOCK_SMART":
                return (
                    <>
                        <KnockResultTable assetTypeValue={assetType} group={group} loading={false} wkn={wkn}
                                          diffSl={diffSl} ask={ask} bid={bid}
                                          dueTo={dueTo}
                                          keyFigures={derivativeKeyFigures}
                                          snapQuote={snapQuote}
                                          id={id} optionName={optionName} typeNameValue={typeNameValue}/>
                    </>
                )
            case "WARR_CLASSIC":
                return (
                    <>
                        <WarrantClassicResultTable group={group} loading={false} wkn={wkn} ask={ask} bid={bid}
                                                   keyFigures={derivativeKeyFigures}
                                                   snapQuote={snapQuote}
                                                   dueTo={dueTo} id={id} typeNameValue={typeNameValue}/>
                    </>
                )
            case "WARR_OTHER_DOWN_OUT":
                return (
                    <>
                        <WarrantDownOutputResultTable group={group} loading={false} wkn={wkn} ask={ask} bid={bid}
                                                      keyFigures={derivativeKeyFigures}
                                                      snapQuote={snapQuote}
                                                      dueTo={dueTo}
                                                      id={id} typeNameValue={typeNameValue}/>
                    </>
                )
            case "WARR_DISCOUNT":
                return (
                    <>
                        <WarrantDiscountResultTable group={group} loading={false} wkn={wkn} ask={ask} bid={bid}
                                                    keyFigures={derivativeKeyFigures}
                                                    snapQuote={snapQuote}
                                                    dueTo={dueTo}
                                                    id={id} typeNameValue={typeNameValue}/>
                    </>
                )
            case "WARR_OTHER":
                return (
                    <>
                        <WarrantStayResultTable group={group} loading={false} wkn={wkn} ask={ask} bid={bid}
                                                keyFigures={derivativeKeyFigures}
                                                snapQuote={snapQuote}
                                                dueTo={dueTo} id={id} typeNameValue={typeNameValue}/>
                    </>
                )
            case "WARR_INLINE":
                return (
                    <>
                        <WarrantInlineResultTable group={group} loading={false} wkn={wkn} ask={ask} bid={bid}
                                                  dueTo={dueTo} keyFigures={derivativeKeyFigures}
                                                  snapQuote={snapQuote}
                                                  id={id} typeNameValue={typeNameValue}/>
                    </>
                )
            case "CERT_DISC_CLASSIC_PROTECT_PROTECT_PRO":
            case "559":
            case "560":
                return (
                    <>
                        <DiscountResultTable assetTypeValue={group.assetType} group={group} loading={false} wkn={wkn}
                                             ask={ask} bid={bid} id={id} dueTo={dueTo}
                                             keyFigures={derivativeKeyFigures}
                                             snapQuote={snapQuote}
                                             typeNameValue={typeNameValue}/>
                    </>
                )

            case "565":
            case "562":
            case "563":
            case "561":
            case "564":
            case "566":
                return (
                    <>
                        <DiscountOthersResultTable assetTypeValue={assetType} group={group} loading={false} wkn={wkn}
                                                   ask={ask} bid={bid} id={id} dueTo={dueTo}
                                                   keyFigures={derivativeKeyFigures}
                                                   snapQuote={snapQuote}
                                                   typeNameValue={typeNameValue}/>
                    </>
                )
            case "CERT_FACTOR_ALL":
            case "CERT_FACTOR_OTHER":
                return (
                    <>
                        <FactorResultTable assetTypeValue={assetType} group={group} loading={false} wkn={wkn}
                                           ask={ask} bid={bid} id={id} dueTo={dueTo}
                                           keyFigures={derivativeKeyFigures}
                                           snapQuote={snapQuote}
                                           typeNameValue={typeNameValue} optionName={optionName}/>
                    </>
                )
            case "CERT_BONUS_CLASSIC":
                return (
                    <>
                        <BonusClassicResultTable assetTypeValue={assetType} group={group} loading={false} wkn={wkn}
                                                 ask={ask} bid={bid} id={id} dueTo={dueTo}
                                                 keyFigures={derivativeKeyFigures}
                                                 snapQuote={snapQuote}
                                                 typeNameValue={typeNameValue}/>
                    </>
                )
            case "CERT_BONUS_REVERSE":
            case "584":
                return (
                    <>
                        <BonusReverseCapResultTable assetTypeValue={assetType} group={group} loading={false} wkn={wkn}
                                                    ask={ask} bid={bid} id={id} dueTo={dueTo}
                                                    keyFigures={derivativeKeyFigures}
                                                    snapQuote={snapQuote}
                                                    typeNameValue={typeNameValue}/>
                    </>
                )
            case "CERT_EXPRESS_CLASSIC":
            case "568":
            case "569":
            case "570":
            case "573":
            case "574":
            case "575":
            case "CERT_EXPRESS_OTHER":
                return (
                    <>
                        <ExpressResultTable assetTypeValue={assetType} group={group} loading={false} wkn={wkn}
                                            ask={ask} bid={bid} id={id} dueTo={dueTo}
                                            keyFigures={derivativeKeyFigures}
                                            snapQuote={snapQuote}
                                            performance={performance}
                                            typeNameValue={typeNameValue}/>
                    </>
                )

            case "CERT_REVERSE_CLASSIC_PROTECT":
                return (
                    <>
                        <RevConvertibleBondsClassicResultTable assetTypeValue={assetType} group={group}
                                                               loading={false} wkn={wkn} ask={ask} bid={bid} id={id}
                                                               dueTo={dueTo} keyFigures={derivativeKeyFigures}
                                                               snapQuote={snapQuote}
                                                               typeNameValue={typeNameValue}/>
                    </>
                )
            case "CERT_REVERSE_OTHER":
            case "591":
            case "CERT_BONUS_CAPPED_MULTI":
            case "CERT_BONUS_MULTI":
            case "CERT_BONUS_OTHER":
                return (
                    <>
                        <RevOtherConvertibleBondsResultTable assetTypeValue={assetType} group={group} loading={false}
                                                             wkn={wkn} ask={ask} bid={bid} id={id} dueTo={dueTo}
                                                             keyFigures={derivativeKeyFigures}
                                                             snapQuote={snapQuote}
                                                             performance={performance}
                                                             typeNameValue={typeNameValue}/>
                    </>
                )
            case "CERT_CAP_PROTECTION_ALPHA":
            case "CERT_CAP_PROTECTION_OTHER":
            case "CERT_CAP_PROTECTION_CLASSIC":
                return (
                    <>
                        <CapitalResultTable assetTypeValue={assetType} group={group} loading={false} wkn={wkn}
                                            ask={ask} bid={bid} id={id} dueTo={dueTo}
                                            performance={performance}
                                            keyFigures={derivativeKeyFigures}
                                            snapQuote={snapQuote}
                                            typeNameValue={typeNameValue}/>
                    </>
                )
            case "CERT_SPRINT_OUTPERFORMANCE_OUTPERFORMANCE":
            case "CERT_SPRINT_OUTPERFORMANCE_SPRINT":
            case "CERT_SPRINT_OUTPERFORMANCE_OTHER":
                return (
                    <>
                        <OutperformanceResultTable assetTypeValue={assetType} group={group} loading={false} wkn={wkn}
                                                   ask={ask} bid={bid} id={id} dueTo={dueTo}
                                                   keyFigures={derivativeKeyFigures}
                                                   performance={performance}
                                                   snapQuote={snapQuote}
                                                   typeNameValue={typeNameValue}/>
                    </>
                )
            case "610":
            case "611":
            case "612":
            case "613":
            case "CERT_INDEX_CLASSIC":
                return (
                    <>
                        <IndexResultTable assetTypeValue={assetType} group={group} loading={false} wkn={wkn} ask={ask}
                                          bid={bid} id={id} dueTo={dueTo}
                                          keyFigures={derivativeKeyFigures}
                                          snapQuote={snapQuote}
                                          performance={performance}
                                          typeNameValue={typeNameValue}/>
                    </>
                )
            case "599":
            case "CERT_INDEX_OTHER":
                return (
                    <>
                        <IndexSonstigeTable assetTypeValue={assetType} group={group} loading={false} wkn={wkn} ask={ask}
                                            bid={bid} id={id} dueTo={dueTo}
                                            keyFigures={derivativeKeyFigures}
                                            snapQuote={snapQuote}
                                            performance={performance}
                                            typeNameValue={typeNameValue}/>
                    </>
                )


            default:
                return (
                    <>
                        <SonstigeResultTable assetTypeValue={assetType} group={group} loading={false} wkn={wkn}
                                             ask={ask} keyFigures={derivativeKeyFigures}
                                             snapQuote={snapQuote}
                                             bid={bid} id={id} dueTo={dueTo}
                                             typeNameValue={typeNameValue}/>
                    </>
                )
        }
    }

    return (
        <>
            {tableBody()}
        </>
    );
}

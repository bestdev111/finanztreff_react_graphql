import React, {useState} from "react";
import {CalculationPeriod, Instrument, InstrumentGroupComposition, Maybe} from "../../../../graphql/types";
import {
    compareTwoValues,
    getAssetLink,
    getTextColorByValue,
    numberFormat, quoteFormat,
} from "../../../../utils";
import {Spinner} from "react-bootstrap";
import {SnapQuoteDelayIndicator, PagerComponent, SortArrowComponent} from "../../../common";
import {Link} from "react-router-dom";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import SvgImage from "../../../common/image/SvgImage";

export interface TKTabProperties {
    composition?: Maybe<InstrumentGroupComposition>,
}

export function CompositionTKTabComponent(props: TKTabProperties) {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentSort, setCurrentSort] = useState<string>('name');
    const [currentSortDir, setCurrentSortDir] = useState<number>(0); // 0 - UP; 1 - DOWN;

    if (!props.composition) {
        return (
            <div className={"p-1"} style={{height: "70px"}}><Spinner animation="border"/></div>
        )
    }

    const pageSize = 50;
    const entries = props.composition.entries;

    window.setTimeout(function () {
        setPageCount(Math.ceil(entries.length / pageSize));
    });

    const pageChangeHandler = function (newPage: number) {
        setCurrentPage(newPage);
    }

    const get1MVola = function(i: Instrument) {
        let vola = 0;
        i.performance.forEach(p => {
            if(p && (p.period === CalculationPeriod.Month1)) {
                vola = p.vola || 0;
            }
        });
        return vola;
    }
    const getStatsValue = function(i: Instrument, period: CalculationPeriod) {
        let value = 0;
        i.stats.forEach(p => {
            if(p && (p.period === period)) {
                value = p.deltaHighPrice || 0;
            }
        });
        return value;
    }


    function InstrumentTKDataComponent(props: any) {
        const entries = props.entries;
        const sort = props.sort;
        const dir = props.dir;
        const page = props.page;
        const size = props.size;

        const sortData = entries.slice();
        sortData.sort(
            (i1: Instrument, i2: Instrument) => {
                let res = 0;
                switch (sort) {
                    case 'name': res = compareTwoValues(i1.name || "", i2.name || "", dir); break;
                    case 'sector': res = compareTwoValues(i1.group?.sector?.name || "", i2.group?.sector?.name || "", dir); break;
                    case 'value': res = compareTwoValues(i1.snapQuote?.quote?.value, i2.snapQuote?.quote?.value, dir); break;
                    case 'when': res = compareTwoValues(i1.snapQuote?.quote?.when, i2.snapQuote?.quote?.when, dir); break;
                    case 'vola': res = compareTwoValues(get1MVola(i1), get1MVola(i2), dir); break;
                    case 'rsl': res = compareTwoValues(i1.indicators?.relativeStrengthLevy?.indicator, i2.indicators?.relativeStrengthLevy?.indicator, dir); break;
                    case 'allz': res = compareTwoValues(getStatsValue(i1, CalculationPeriod.AllTime), getStatsValue(i2, CalculationPeriod.AllTime), dir); break;
                    case '52W': res = compareTwoValues(getStatsValue(i1, CalculationPeriod.Week52), getStatsValue(i2, CalculationPeriod.Week52), dir); break;
                    case '200T': res = compareTwoValues(i1.indicators?.movingAverage?.line200Day, i2.indicators?.movingAverage?.line200Day, dir); break;
                }
                return res;
            }
        )

        const pageData = sortData.slice(page * size, (page + 1) * size)

        return pageData.map(
            (current: any) => {
                const url = getAssetLink(current.group, current.exchange);
                return (
                    <tr key={current.id}>
                        <td className="text-right px-0 hide-md">
                            <SnapQuoteDelayIndicator delay={current.snapQuote?.quote?.delay}/>
                        </td>
                        <td className="text-left px-0 hide-lg">{current.wkn}</td>
                        <td className="text-left text-blue">
                            {url ? <Link to={url}>{current.name}</Link> : <>{current.name}</>}
                        </td>
                        <td className="text-left hide-lg">{current.group?.sector?.name}</td>

                        <td className="text-right font-weight-bold">{numberFormat(current.snapQuote?.quote?.value)}
                            <span className="svg-icon move-arrow">
                                {current.snapQuote?.quote?.change > 0 && <img src="/static/img/svg/icon_arrow_short_up_green.svg"></img>}
                                {current.snapQuote?.quote?.change < 0 && <img src="/static/img/svg/icon_arrow_short_down_red.svg"></img>}
                            </span>
                        </td>
                        <td className="text-right hide-lg">{quoteFormat(current.snapQuote?.quote?.when)}</td>

                        <td className="text-right hide-sm">{numberFormat(get1MVola(current))}%</td>

                        <td className={"text-right"}>
                            {numberFormat(current.indicators?.relativeStrengthIndex?.last25Days)}</td>

                        <td className={"text-right hide-sm"}>{numberFormat(getStatsValue(current, CalculationPeriod.AllTime), '%')} </td>


                        <td className={"text-right hide-sm"}>{numberFormat(getStatsValue(current, CalculationPeriod.Week52), '%')}</td>

                        <td className={"text-right hide-sm"+getTextColorByValue(current.indicators?.movingAverage?.deltaLine200Day)}>
                            {numberFormat(current.indicators?.movingAverage?.line200Day)}</td>

                        <td>
                            <ProfileInstrumentAddPopup
                                instrumentId={current.id}
                                instrumentGroupId={current.group.id}
                                name={current.name}
                                className="p-0 m-0"
                                watchlist={true} portfolio={true}>
                                <SvgImage icon="icon_plus_blue.svg" imgClass="shrink-08" width="28"/>
                            </ProfileInstrumentAddPopup>
                        </td>
                    </tr>
                )
            }
        )
    }

    const sortChangeHandler = function (sort: string) {
        if (currentSort === sort) {
            let _dir = currentSortDir + 1;
            if (_dir > 1) {
                setCurrentSortDir(0);
                setCurrentSort("");
            } else {
                setCurrentSortDir(_dir);
            }
        } else {
            setCurrentSort(sort);
        }
    }

    const TableHeaderComponent = function(props: any) {
        return (
            <thead className="thead-light">
            <tr>
                <th className={"hide-md"}>&nbsp;</th>
                <th className="text-left px-0 hide-lg" wkn-th="">
                    <span>WKN</span>
                </th>
                <th className="can-sort text-blue text-left" onClick={() => {sortChangeHandler('name')}}>Bezeichnung
                    <SortArrowComponent sortName={'name'} currentSortName={currentSort} sortDir={currentSortDir}/></th>
                <th className="can-sort text-blue text-left hide-lg" onClick={() => {sortChangeHandler('sector')}} >Branche
                    <SortArrowComponent sortName={'sector'} currentSortName={currentSort} sortDir={currentSortDir}/></th>
                <th className={"can-sort text-blue "} onClick={() => {sortChangeHandler('value')}}>Kurs
                    <SortArrowComponent sortName={'value'} currentSortName={currentSort} sortDir={currentSortDir}/></th>
                <th className="can-sort text-blue hide-lg" onClick={() => {sortChangeHandler('when')}}>Zeit
                    <SortArrowComponent sortName={'when'} currentSortName={currentSort} sortDir={currentSortDir}/></th>
                <th className="can-sort text-blue hide-sm" onClick={() => {sortChangeHandler('vola')}} >Vola. 30T.
                    <SortArrowComponent sortName={'vola'} currentSortName={currentSort} sortDir={currentSortDir}/></th>
                <th className={"can-sort text-blue "} onClick={() => {sortChangeHandler('rsl')}}>RSI
                    <SortArrowComponent sortName={'rsl'} currentSortName={currentSort} sortDir={currentSortDir}/></th>
                <th className="can-sort text-blue hide-sm" onClick={() => {sortChangeHandler('allz')}} >Allzeithoch
                    <SortArrowComponent sortName={'allz'} currentSortName={currentSort} sortDir={currentSortDir}/></th>
                <th className="can-sort text-blue hide-sm" onClick={() => {sortChangeHandler('52W')}} >52W-Hoch
                    <SortArrowComponent sortName={'52W'} currentSortName={currentSort} sortDir={currentSortDir}/></th>
                <th className="can-sort text-blue hide-sm" onClick={() => {sortChangeHandler('200T')}} >200T-Linie
                    <SortArrowComponent sortName={'200T'} currentSortName={currentSort} sortDir={currentSortDir}/></th>
                <th></th>
            </tr>
            </thead>
        )
    }

    return (
        <div className="tab-pane fade show active grid-tab">
            <div className="grid-wrapper">
                <table className="table light-table text-center custom-border last-with-border">
                    <TableHeaderComponent></TableHeaderComponent>
                    <tbody>
                    <InstrumentTKDataComponent
                        entries={entries}
                        sort={currentSort}
                        dir={currentSortDir}
                        page={currentPage}
                        size={pageSize}
                    />
                    </tbody>
                </table>
            </div>

            <nav className="margin-top-20">
                <PagerComponent pageCount={pageCount} currentPage={currentPage} onPageChange={pageChangeHandler}></PagerComponent>
            </nav>
        </div>
    )
}

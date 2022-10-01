import {PagerComponent} from "../../../common/pager/PagerComponent";
import React, {useState} from "react";
import {compareTwoValues, getAssetLink, numberFormat, numberFormatWithSign} from "../../../../utils";
import {CalculationPeriod, Instrument, InstrumentGroupComposition, Maybe} from "../../../../graphql/types";
import {SortArrowComponent} from "../../../common/sort/SortArrowComponent";
import {Spinner} from "react-bootstrap";
import {SnapQuoteDelayIndicator} from "../../../common";
import {Link} from "react-router-dom";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import SvgImage from "../../../common/image/SvgImage";

export interface PerformanceTabProperties {
    composition?: Maybe<InstrumentGroupComposition>
}

export interface CalculationPeriodLabel {
    period: CalculationPeriod,
    label: string
}

export const PERIOD_LABELS: CalculationPeriodLabel[] = [
    {period: CalculationPeriod.Yesterday, label: "Gestern"},
    {period: CalculationPeriod.Intraday, label: "Heute"},
    {period: CalculationPeriod.Week1, label: "1W"},
    {period: CalculationPeriod.Month1, label: "1M"},
    {period: CalculationPeriod.Month2, label: "2M"},
    {period: CalculationPeriod.Month3, label: "3M"},
    {period: CalculationPeriod.Month6, label: "6M"},
    {period: CalculationPeriod.Day200, label: "200D"},
    {period: CalculationPeriod.Day250, label: "250D"},
    {period: CalculationPeriod.CurrentYear, label: "LFT.Jahr"},
    {period: CalculationPeriod.Week52, label: "1J"},
    {period: CalculationPeriod.Year3, label: "3J"},
    {period: CalculationPeriod.Year5, label: "5J"},
    {period: CalculationPeriod.Year10, label: "10J"},
    {period: CalculationPeriod.AllTime, label: "Alle Zeit"},
];

const SORT_COLUMNS: string[] = ['Alle', 'Tops', 'Flops', 'Umsatz', 'Volumen'];

export function CompositionPerformanceTabComponent(props: PerformanceTabProperties) {
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

    function InstrumentPerformanceDataComponent(props: any) {
        const entries = props.entries;
        const sort = props.sort;
        const dir = props.dir;
        const page = props.page;
        const size = props.size;

        const getPerformance = function (i: Instrument, period: CalculationPeriod): number {
            let perf = 0;
            i.performance.forEach(
                (p: any) => {
                    if (p.period === period) { perf = p.performance; }
                }
            );
            return perf;
        }

        const sortData = entries.slice();
        sortData.sort(
            (i1: Instrument, i2: Instrument) => {
                let res = 0;
                switch (sort) {
                    case 'name': res = compareTwoValues(i1.name || "", i2.name || "", dir); break;
                    case 'sector': res = compareTwoValues(i1.group?.sector?.name || "", i2.group?.sector?.name || "", dir); break;
                    case 'value': res = compareTwoValues(i1.snapQuote?.quote?.value, i2.snapQuote?.quote?.value, dir); break;
                    case '1W': res = compareTwoValues(getPerformance(i1, CalculationPeriod.Week1), getPerformance(i2, CalculationPeriod.Week1), dir); break;
                    case '1M': res = compareTwoValues(getPerformance(i1, CalculationPeriod.Month1), getPerformance(i2, CalculationPeriod.Month1), dir); break;
                    case '6M': res = compareTwoValues(getPerformance(i1, CalculationPeriod.Month6), getPerformance(i2, CalculationPeriod.Month6), dir); break;
                    case '1J': res = compareTwoValues(getPerformance(i1, CalculationPeriod.Week52), getPerformance(i2, CalculationPeriod.Week52), dir); break;
                    case '3J': res = compareTwoValues(getPerformance(i1, CalculationPeriod.Year3), getPerformance(i2, CalculationPeriod.Year3), dir); break;
                }
                return res;
            }
        )
        const pageData = sortData.slice(page * size, (page + 1) * size)
        return pageData.map(
            (current: any) => {
                let _1W = 0;
                let _1M = 0;
                let _6M = 0;
                let _1J = 0;
                let _3J = 0;

                current.performance.forEach(
                    (p: any) => {
                        switch (p.period) {
                            case CalculationPeriod.Week1: _1W = p.performance; break;
                            case CalculationPeriod.Month1: _1M = p.performance; break;
                            case CalculationPeriod.Month6: _6M = p.performance; break;
                            case CalculationPeriod.Week52: _1J = p.performance; break;
                            case CalculationPeriod.Year3: _3J = p.performance; break;
                        }
                    }
                );
                const url = getAssetLink(current.group, current.exchange);
                return (
                    <tr key={current.id}>
                        <td className="text-right px-0 hide-sm">
                            <SnapQuoteDelayIndicator delay={current.snapQuote?.quote?.delay}/>
                        </td>
                        <td className="text-left px-0 hide-lg">{current.wkn}</td>
                        <td className="text-left text-blue">
                            {url ? <Link to={url}>{current.name}</Link> : <>{current.name}</>}
                        </td>
                        <td className="text-left hide-lg" branche-td="">{current.group?.sector?.name}</td>
                        <td className="text-right font-weight-bold text-nowrap">{numberFormat(current.snapQuote?.quote?.value)}

                            <span className="svg-icon move-arrow">
                                {current.snapQuote?.quote?.change > 0 && <img src="/static/img/svg/icon_arrow_short_up_green.svg"></img>}
                                {current.snapQuote?.quote?.change < 0 && <img src="/static/img/svg/icon_arrow_short_down_red.svg"></img>}
                            </span>
                        </td>
                        <td className={"text-right hide-md text-"+(_1W < 0 ? 'red':'green')}>{numberFormatWithSign( _1W)}%</td>
                        <td className={"text-right hide-md text-"+(_1M < 0 ? 'red':'green')}>{numberFormatWithSign(_1M)}%</td>
                        <td className={"text-right hide-md text-"+(_6M < 0 ? 'red':'green')}>{numberFormatWithSign(_6M)}%</td>
                        <td className={"text-right text-"+(_1J < 0 ? 'red':'green')}>{numberFormatWithSign(_1J)}%</td>
                        <td className={"text-right hide-md text-"+(_3J < 0 ? 'red':'green')}>{numberFormatWithSign(_3J)}%</td>
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

    const sortRender = function () {
        const tabs: any[] = [];
        let css = "";
        let arrowCss = "";

        const renderItem = function (item: string, index: number) {
            css = "btn btn-link fnt-size-16 font-weight-bold text-blue" + (currentSort === item ? " active" : "");
            arrowCss = "svg-icon sort-arrow direction-" + (currentSortDir === 0 ? "bottom" : "top")
            return (<button key={index} type="button" className={css} onClick={() => {
                sortChangeHandler(item)
            }}>{item}
                <span className={arrowCss}>
                    <img src="/static/img/svg/icon_arrow_long_right_dark.svg"></img>
                </span></button>)
        }

        SORT_COLUMNS.forEach((item, index) => {
            tabs.push(renderItem(item, index))
        });

        return (<> {tabs} </>);
    }

    const TableHeaderComponent = function(props: any) {
        return (
            <thead className="thead-light">
            <tr>
                <th className={"hide-sm"}>&nbsp;</th>
                <th className="text-left px-0 hide-lg" wkn-th="">
                    <span>WKN</span>
                </th>
                <th className="text-left can-sort text-blue" onClick={() => {sortChangeHandler('name')}}>Bezeichnung
                    <SortArrowComponent sortName={'name'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent>
                </th>
                <th className="text-left can-sort text-blue hide-lg" onClick={() => {sortChangeHandler('sector')}}>Branche
                    <SortArrowComponent sortName={'sector'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent>
                </th>
                <th className="can-sort text-blue" onClick={() => {sortChangeHandler('value')}}>Kurs
                    <SortArrowComponent sortName={'value'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent>
                </th>
                <th className="can-sort text-blue hide-md" onClick={() => {sortChangeHandler('1W')}}>1W
                    <SortArrowComponent sortName={'1W'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent>
                </th>
                <th className="can-sort text-blue hide-md" onClick={() => {sortChangeHandler('1M')}}>1M
                    <SortArrowComponent sortName={'1M'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent>
                </th>
                <th className="can-sort text-blue hide-md" onClick={() => {sortChangeHandler('6M')}}>6M
                    <SortArrowComponent sortName={'6M'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent>
                </th>
                <th className="can-sort text-blue" onClick={() => {sortChangeHandler('1J')}}>1J
                    <SortArrowComponent sortName={'1J'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent>
                </th>
                <th className="can-sort text-blue hide-md" onClick={() => {sortChangeHandler('3J')}}>3J
                    <SortArrowComponent sortName={'3J'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent>
                </th>
                <th></th>
            </tr>
            </thead>
        )
    }

    return (
        <div className="tab-pane fade show active grid-tab">
            <div className="grid-wrapper">
                <table className="table light-table text-center custom-border last-with-border">
                    <TableHeaderComponent sort={currentSort} dir={currentSortDir}></TableHeaderComponent>

                    <tbody>
                    <InstrumentPerformanceDataComponent
                        entries={entries}
                        sort={currentSort}
                        dir={currentSortDir}
                        page={currentPage}
                        size={pageSize}
                    ></InstrumentPerformanceDataComponent>
                    </tbody>
                </table>
            </div>

            <nav className="margin-top-20">
                <PagerComponent pageCount={pageCount} currentPage={currentPage} onPageChange={pageChangeHandler}></PagerComponent>
            </nav>
        </div>
    )
}

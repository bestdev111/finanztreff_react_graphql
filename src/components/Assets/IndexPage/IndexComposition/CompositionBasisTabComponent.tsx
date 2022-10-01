import React, {useState} from "react";
import {Instrument, InstrumentGroupComposition, Maybe} from "../../../../graphql/types";
import {Link} from "react-router-dom";
import {
    compareTwoValues, getAssetLink,
    numberFormat,
    numberFormatShort,
    numberFormatWithSign, quoteFormat,
    shortNumberFormat
} from "../../../../utils";
import {PagerComponent, SortArrowComponent} from "../../../common";
import {Spinner} from "react-bootstrap";
import { SnapQuoteDelayIndicator } from "components/common/indicators";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import SvgImage from "../../../common/image/SvgImage";

export interface BasisTabProperties {
    composition?: Maybe<InstrumentGroupComposition>
}

export function CompositionBasisTabComponent(props: BasisTabProperties) {
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
    const currency = props.composition.currency?.displayCode;
    const entries = props.composition.entries;

    window.setTimeout(function () {
        setPageCount(Math.ceil(entries.length / pageSize));
    });

    const pageChangeHandler = function (newPage: number) {
        setCurrentPage(newPage);
    }

    function InstrumentBasisDataComponent(props: any) {
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
                    case 'percentChange': res = compareTwoValues(i1.snapQuote?.quote?.percentChange, i2.snapQuote?.quote?.percentChange, dir); break;
                    case 'change': res = compareTwoValues(i1.snapQuote?.quote?.change, i2.snapQuote?.quote?.change, dir); break;
                    case 'cumulativeTurnover': res = compareTwoValues(i1.snapQuote?.cumulativeTurnover, i2.snapQuote?.cumulativeTurnover, dir); break;
                    case 'cumulativeVolume': res = compareTwoValues(i1.snapQuote?.cumulativeVolume, i2.snapQuote?.cumulativeVolume, dir); break;
                    case 'cumulativeTrades': res = compareTwoValues(i1.snapQuote?.cumulativeTrades, i2.snapQuote?.cumulativeTrades, dir); break;
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
                        <td className="text-right font-weight-bold text-nowrap">{numberFormat(current.snapQuote?.quote?.value)}
                            <span className="svg-icon move-arrow">
                                {current.snapQuote?.quote?.change > 0 && <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_up_green.svg"} alt=""/>}
                                {current.snapQuote?.quote?.change < 0 && <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_down_red.svg"} alt=""/>}
                            </span>
                        </td>
                        <td className="text-right hide-lg show-block-sm">{quoteFormat(current.snapQuote?.quote?.when)}</td>
                        <td className={"text-right hide-sm text-"+(current.snapQuote?.quote?.percentChange < 0 ? 'red':'green')}>
                            {numberFormatWithSign(current.snapQuote?.quote?.percentChange, '%')}
                        </td>
                        <td className={"text-right hide-sm text-"+(current.snapQuote?.quote?.change < 0 ? 'red':'green')}>
                            {numberFormatWithSign(current.snapQuote?.quote?.change)}</td>
                        <td className="text-right hide-md">{numberFormatShort(current.snapQuote?.cumulativeTrades)}</td>
                        <td className="text-right font-weight-bold hide-lg">{shortNumberFormat(current.snapQuote?.cumulativeTurnover)}</td>
                        <td className="text-right hide-sm">{shortNumberFormat(current.snapQuote?.cumulativeVolume)}</td>
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
                <th className="hide-md">&nbsp;</th>
                <th className="text-left px-0 hide-lg">
                    <span>WKN</span>
                </th>
                <th className="can-sort text-blue text-left" onClick={() => {sortChangeHandler('name')}}>Bezeichnung
                    <SortArrowComponent sortName={'name'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent>
                </th>
                <th className="can-sort text-blue text-left hide-lg" onClick={() => {sortChangeHandler('sector')}}>Branche
                    <SortArrowComponent sortName={'sector'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th className={"can-sort text-blue "} onClick={() => {sortChangeHandler('value')}}>Kurs
                    <SortArrowComponent sortName={'value'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th className="can-sort text-blue hide-lg show-block-sm" onClick={() => {sortChangeHandler('when')}}>Zeit
                    <SortArrowComponent sortName={'when'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th className="can-sort text-blue hide-sm" onClick={() => {sortChangeHandler('percentChange')}}>%
                    <SortArrowComponent sortName={'percentChange'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th className="can-sort text-blue hide-sm" onClick={() => {sortChangeHandler('change')}}>+/-
                    <SortArrowComponent sortName={'change'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th className="can-sort text-blue hide-md" onClick={() => {sortChangeHandler('cumulativeTrades')}}>Trades
                    <SortArrowComponent sortName={'cumulativeTrades'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th className="can-sort text-blue hide-sm" style={{width: '120px'}} onClick={() => {sortChangeHandler('cumulativeTurnover')}}>Umsatz {currency}
                    <SortArrowComponent sortName={'cumulativeTurnover'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th className="can-sort text-blue hide-lg" onClick={() => {sortChangeHandler('cumulativeVolume')}}>Umsatz
                    <SortArrowComponent sortName={'cumulativeVolume'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th></th>
            </tr>
            </thead>
        )
    }

    return (
        <div className="tab-pane fade show active grid-tab">
            <div className="grid-wrapper">
                <table className="table light-table text-center custom-border last-with-border">
                    <TableHeaderComponent />
                    <tbody>
                    <InstrumentBasisDataComponent
                        entries={entries}
                        sort={currentSort}
                        dir={currentSortDir}
                        page={currentPage}
                        size={pageSize}
                    ></InstrumentBasisDataComponent>
                    </tbody>
                </table>
            </div>

            <nav className="margin-top-20">
                <PagerComponent pageCount={pageCount} currentPage={currentPage} onPageChange={pageChangeHandler}></PagerComponent>
            </nav>
        </div>
    )
}

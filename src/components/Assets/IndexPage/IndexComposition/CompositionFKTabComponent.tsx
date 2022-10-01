import React, {useState} from "react";
import {Instrument, InstrumentGroupComposition, Maybe} from "../../../../graphql/types";
import {
    compareTwoValues,
    getAssetLink,
    getTextColorByValue,
    numberFormat,
    numberFormatWithSign, quoteFormat,
    shortNumberFormat
} from "../../../../utils";
import {Spinner} from "react-bootstrap";
import {PagerComponent, SortArrowComponent, SnapQuoteDelayIndicator} from "../../../common";
import {Link} from "react-router-dom";
import {ProfileInstrumentAddPopup} from "../../../common/modals/ProfileInstrumentAddPopup";
import SvgImage from "../../../common/image/SvgImage";

export interface FKTabProperties {
    composition?: Maybe<InstrumentGroupComposition>
}

export function CompositionFKTabComponent(props: FKTabProperties) {
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

    function InstrumentFKDataComponent(props: any) {
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
                    case 'divident': res = compareTwoValues(i1.group?.estimates?.current?.dividendYield, i2.group?.estimates?.current?.dividendYield, dir); break;
                    case 'kgv': res = compareTwoValues(i1.group?.estimates?.current?.priceToEarningsRatio, i2.group?.estimates?.current?.priceToEarningsRatio, dir); break;
                    case 'kuv': res = compareTwoValues(i1.group?.estimates?.current?.priceToSalesRatio, i2.group?.estimates?.current?.priceToSalesRatio, dir); break;
                    case 'kcv': res = compareTwoValues(i1.group?.estimates?.current?.priceToCashFlowRatio, i2.group?.estimates?.current?.priceToCashFlowRatio, dir); break;
                    case 'mk': res = compareTwoValues(i1.marketCapitalization, i2.marketCapitalization, dir); break;
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
                        <td className="text-right hide-lg">{quoteFormat(current.snapQuote?.quote?.when)}</td>
                        <td className={"text-right hide-sm "+getTextColorByValue(current.group?.estimates?.current?.dividendPerShare)}>
                            {numberFormat(current.group?.estimates?.current?.dividendYield, "%")}</td>

                        <td className={"text-right "+getTextColorByValue(current.group?.estimates?.current?.priceToEarningsRatio)}>
                            {numberFormat(current.group?.estimates?.current?.priceToEarningsRatio)}</td>

                        <td className={"text-right hide-sm "+getTextColorByValue(current.group?.estimates?.current?.priceToSalesRatio)}>
                            {numberFormat(current.group?.estimates?.current?.priceToSalesRatio)}</td>

                        <td className={"text-right hide-sm "+getTextColorByValue(current.group?.estimates?.current?.priceToCashFlowRatio)}>
                            {numberFormat(current.group?.estimates?.current?.priceToCashFlowRatio)}</td>

                        <td className="text-right hide-sm">{shortNumberFormat(current.marketCapitalization)}</td>

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

    const TableHeaderComponent = function(props: any) {
        return (
            <thead className="thead-light">
            <tr>
                <th className={"hide-md"}>&nbsp;</th>
                <th className="text-left px-0 hide-lg" wkn-th="">
                    <span>WKN</span>
                </th>
                <th className="can-sort text-blue text-left" onClick={() => {sortChangeHandler('name')}}>Bezeichnung
                    <SortArrowComponent sortName={'name'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th className="can-sort text-blue text-left hide-lg" onClick={() => {sortChangeHandler('sector')}} >Branche
                    <SortArrowComponent sortName={'sector'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th className={"can-sort text-blue "} onClick={() => {sortChangeHandler('value')}}>Kurs
                    <SortArrowComponent sortName={'value'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th className="can-sort text-blue hide-lg" onClick={() => {sortChangeHandler('when')}}>Zeit
                    <SortArrowComponent sortName={'when'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th className="can-sort text-blue hide-sm" onClick={() => {sortChangeHandler('divident')}} >Div.Rend.
                    <SortArrowComponent sortName={'divident'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th className={"can-sort text-blue "} onClick={() => {sortChangeHandler('kgv')}}>KGV
                    <SortArrowComponent sortName={'kgv'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th className="can-sort text-blue hide-sm" onClick={() => {sortChangeHandler('kuv')}}>KUV
                    <SortArrowComponent sortName={'kuv'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th className="can-sort text-blue hide-sm" onClick={() => {sortChangeHandler('kcv')}} >KCV
                    <SortArrowComponent sortName={'kcv'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th className="can-sort text-blue hide-sm" onClick={() => {sortChangeHandler('mk')}} >MK in {currency}
                    <SortArrowComponent sortName={'mk'} currentSortName={currentSort} sortDir={currentSortDir}></SortArrowComponent></th>
                <th></th>
            </tr>
            </thead>
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

    return (
        <div className="tab-pane fade show active grid-tab">
            <div className="grid-wrapper">
                <table className="table light-table text-center custom-border last-with-border">
                    <TableHeaderComponent />
                    <tbody>
                        <InstrumentFKDataComponent
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

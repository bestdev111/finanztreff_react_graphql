import { calculateChange, calculatePortfolio, calculatePortfolioErtrage, getMinDate } from "components/profile/utils";
import { Portfolio } from "graphql/types";
import {useState} from "react";
import { Container } from "react-bootstrap";
import { MainFilterRow } from "./DropdownFilters/MainFilterRow";
import { PortfoliosOverviewItems } from "./PortfoliosOverviewItems";
import "./PortfolioOverview.scss";

export function PortfoliosOverview({ portfolios, refreshTrigger, realportfolio }: PortfoliosOverviewProps) {
    const [sort, setSort] = useState<SortOption>({ sortType: "Perf. Heute %", direction: true })
    const handleSort = (value: SortOption) => setSort({ sortType: value.sortType, direction: value.direction });

    const [showMemo, setShowMemo] = useState<boolean>(false);
    const handleMemo = (value: boolean) => setShowMemo(value);

    let orderedPortfolios = getOrderedPortfolios(sort, portfolios);
    const emptyPortfolios = portfolios.filter(portfolio => !portfolio.entries || (portfolio.entries && portfolio.entries.length <= 0)) || [];

    const SORT_OPTIONS_LIST = ["Name", "Seit Auflage", "Perf. Heute %", "Gesamtwert", "Gewinn", "Anzahl Positionen"];

    return (
        <section className="main-section">
            <Container className="main-section">
                <div className="d-xl-flex d-lg-flex d-sm-block justify-content-between align-items-center mb-n2 mx-lg-0 mx-sm-2">
                    <div className="font-weight-bold d-flex font-family-roboto-slab">
                        <span className="png-icon top-move mx-1">
                            <img src="/static/img/suitcase-icon-empty.png" className="mb-n2 portfolios-section-icon" alt="" />
                        </span>
                        <h2 id="portfolios-section">Meine Portfolios</h2>
                    </div>
                    <div>
                        <MainFilterRow handleSort={handleSort} sort={sort} handleMemo={handleMemo} showMemo={showMemo} sortOptionsList={SORT_OPTIONS_LIST} />
                    </div>
                </div>
                <PortfoliosOverviewItems portfolios={orderedPortfolios} emptyPortfolios={emptyPortfolios} sort={sort} showMemo={showMemo}
                    refreshTrigger={refreshTrigger} realportfolio={realportfolio} />
            </Container>
        </section>
    );
}

interface SortOption {
    sortType: string;
    direction: boolean;
}

interface PortfoliosOverviewProps {
    portfolios: Portfolio[];
    refreshTrigger: () => void;
    realportfolio?: boolean;
}

function getOrderedPortfolios(sort: SortOption, portfolios: Portfolio[]): Portfolio[] {
    let orderedPortfolios: Portfolio[] = portfolios.filter(portfolio => portfolio.entries && portfolio.entries.length > 0);
    switch (sort.sortType) {
        case "Name": orderedPortfolios = orderedPortfolios.slice().sort(function (a, b) {
            if (a.name!.toLowerCase() > b.name!.toLowerCase()) return 1;
            else if (a.name!.toLowerCase() < b.name!.toLowerCase()) return -1;
            return 0;
        }); break;
        case "Seit Auflage": orderedPortfolios = orderedPortfolios.slice().sort(function (a, b) {
            if (getMinDate(a)! < getMinDate(b)!) return -1;
            else if (getMinDate(a)! > getMinDate(b)!) return 1;
            return 0;
        }); break;

        case "Perf. Heute %": orderedPortfolios = orderedPortfolios.slice().sort(function (a, b) {
            if (getPerformanceGesamt(a)! < getPerformanceGesamt(b)!) return -1;
            else if (getPerformanceGesamt(a)! > getPerformanceGesamt(b)!) return 1;
            return 0;
        }); break;
        case "Gesamtwert": orderedPortfolios = orderedPortfolios.slice().sort(function (a, b) {
            if (getSumme(a)! < getSumme(b)!) return -1;
            else if (getSumme(a)! > getSumme(b)!) return 1;
            return 0;
        }); break;
        case "Gewinn": orderedPortfolios = orderedPortfolios.slice().sort(function (a, b) {
            if (getTotalDiff(a) > getTotalDiff(b)) return -1;
            else if (getTotalDiff(a)! < getTotalDiff(b)!) return 1;
            return 0;
        }); break;
        case "Anzahl Positionen": orderedPortfolios = orderedPortfolios.slice().sort(function (a, b) {
            if ((a.entries?.length || 0) < (b.entries?.length || 0)) return -1;
            else if ((a.entries?.length || 0) > (b.entries?.length || 0)) return 1;
            return 0;
        }); break;
    }

    orderedPortfolios = sort.direction ? orderedPortfolios : orderedPortfolios.reverse();

    return orderedPortfolios;
}

function getSumme(portfolio: Portfolio): number {
    const [initial, yesterday, last] = calculatePortfolio(portfolio);
    const ertrage: number = calculatePortfolioErtrage(portfolio);
    const total = last + ertrage;
    return total;
}

function getTotalDiff(portfolio: Portfolio){
    const [initial, yesterday, last] = calculatePortfolio(portfolio);
    const ertrage: number = calculatePortfolioErtrage(portfolio);
    const total = last + ertrage;
    const diff = initial - total;
    return diff;
}

function getPerformanceGesamt(portfolio: Portfolio) {
    const [initial, yesterday, last] = calculatePortfolio(portfolio);
    const [diffDaily, diffDailyPct] = calculateChange(yesterday, last);
    return diffDailyPct;
}

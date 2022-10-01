import '../../Home/HotSection/HotSection.scss';
import './FindCommoditySection.scss';
import { CommodityResults } from "./CommodityResultsComponent/CommodityResults";
import { CommodityCardFilters } from "./CommoditySearchComponent/CommodityCardFilters";

export function FindCommoditySection() {

    return (
        <section className="main-section pt-0">
            <CommodityCardFilters/>
            <CommodityResults/>
        </section>
    );
}
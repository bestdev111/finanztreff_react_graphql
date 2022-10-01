import { CurrencyEntriesDropdownComponent } from "components/devisen/CurrencyPageDropdown/CurrencyEntriesDropdown";
import {useState} from "react";
import { CurrencyPerformanceChart } from './CurrencyPerformanceChart/CurrencyPerformanceChart';
import "./PerformanceChartSection.scss";
import {getInfonlineTag, guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

interface PerformanceChartSectionProps {
    title: String;
}

interface PerformanceChartState {
    idCurrency: string;
} 

export function  PerformanceChartSection(props: PerformanceChartSectionProps) {
    const [state, setState] = useState<PerformanceChartState>({
        idCurrency: "EUR",
    });

    return (
        <section className="main-section" id="performance-chart-section">
            <div>
                <div className="mx-lg-3 flex-grow-1 m-auto">
                    <h2 className="section-heading-devisen font-weight-bold performance-comparison">{props.title}</h2><CurrencyEntriesDropdownComponent name={""} isPerformanceTitle={true}
                        onSelect={(e) => {
                            trigInfonline(guessInfonlineSection(),getInfonlineTag(guessInfonlineSection(), "currency_perf_chart_drop") + '_' + e.institute?.id.toUpperCase());
                            setState({
                                ...state,
                                idCurrency: e.institute?.name.slice(0, 3).toUpperCase() ? e.institute.name.slice(0, 3).toUpperCase() : "EUR",
                            })
                        }} 
                        hasShortenedNames={true}/>
                </div>
                <CurrencyPerformanceChart trim={true} hasLegendFlags={true} idCurrency={state.idCurrency}/>
            </div>     
        </section>
    );
}

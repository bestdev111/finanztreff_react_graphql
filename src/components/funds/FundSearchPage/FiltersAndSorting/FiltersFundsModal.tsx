import { FilterWithAlphabetSort } from "./FilterWithAlphabetSort";
import { Filter } from "./FiltersFund";
import {trigInfonline} from "../../../common/InfonlineService";

export function FiltersFundsModal(props: FiltersFundsModalProps) {

    return (<>
        <div className="distribution-filter">
            <Filter
                title="Ausschüttend?"
                description={props.distribution?.option}
                onSelect={(v: any) => {
                    trigInfonline("fonds_search", "search_result");
                    props.handleDistribution((v.id || v.name) ? { option: v.name, id: v.id } : undefined)
                }}
            />
        </div>
        <div className="plans-filter">
            <Filter
                title="Sparplanfähig?"
                description={props.plans?.option}
                onSelect={(v: any) => {
                    trigInfonline("fonds_search", "search_result");
                    props.handlePlans((v.id || v.name) ? { option: v.name, id: v.id } : undefined)
                }}
            />
        </div>
        <div className="diverse-filter">
            <Filter
                title="VL-fähig?"
                description={props.diverse?.option}
                onSelect={(v: any) => {
                    trigInfonline("fonds_search", "search_result");
                    props.handleDiverse((v.id || v.name) ? { option: v.name, id: v.id } : undefined)
                }}
            />
        </div>
        <div className="alphabet-filter">
            <FilterWithAlphabetSort
                option="KGV"
                title="KGV"
                description={props.capitalHolder?.option}
                onSelect={(v: any) => {
                    trigInfonline("fonds_search", "search_result");
                    props.handleCapitalHolder((v.id || v.name) ? { option: v.name, id: v.id } : undefined)
                }}
            />
        </div>
    </>);
}

interface FiltersFundsModalProps {
    handleDistribution: (e: any) => void;
    distribution?: { id?: number, option?: string };
    handlePlans: (e: any) => void;
    plans?: { id?: number, option?: string };
    handleDiverse: (e: any) => void;
    diverse?: { id?: number, option?: string };
    handleCapitalHolder: (e: any) => void;
    capitalHolder?: { id?: number, option?: string };
}

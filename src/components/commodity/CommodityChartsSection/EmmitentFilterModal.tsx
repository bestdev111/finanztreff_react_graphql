import { FilterWithAlphabetSort } from "components/funds/FundSearchPage/FiltersAndSorting/FilterWithAlphabetSort";

export function EmmitentFilterModal(props: FiltersFundsModalProps) {

    return (<>
        <div className="alphabet-filter">
            <FilterWithAlphabetSort
                option="Emmitent"
                title="Emmitent"
                description={props.capitalHolder?.option}
                onSelect={(v: any) => {
                    props.handleCapitalHolder((v.id || v.name) ? { option: v.name, id: v.id } : undefined)
                }}
            />
        </div>
    </>);
}

interface FiltersFundsModalProps {
    handleCapitalHolder: (e: any) => void;
    capitalHolder?: { id?: number, option?: string };
}

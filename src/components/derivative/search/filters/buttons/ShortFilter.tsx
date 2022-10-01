import {Button} from "react-bootstrap";
import {DerivativeFilter} from "../../types/DerivativeSearchTypes";
import './derivativeSearchFiltersStyling.scss';

export function ShortFilter({filter, onChange}: ShortFilterProps) {
    const toggleStatus = () => {
        if(filter.callPut === "PUT") onChange({...filter, callPut: undefined});
        else onChange({...filter, callPut: "PUT"});
    }

    return (
        <Button className="put-filter-btn btn-border-gray mr-3 mt-3 d-xl-block short-filter-btn" variant=""
            onClick={()=>toggleStatus()} active={filter.callPut === "PUT"}><div className="derivative-suche-text-fix-short">Short</div></Button>
    )
}

export interface ShortFilterProps {
    filter: DerivativeFilter;
    onChange: (newValue: any) => any;
}

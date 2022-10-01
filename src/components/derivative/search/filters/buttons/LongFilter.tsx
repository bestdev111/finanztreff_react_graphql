import {Button} from "react-bootstrap";
import {DerivativeFilter} from "../../types/DerivativeSearchTypes";
import './derivativeSearchFiltersStyling.scss';

export function LongFilter({filter, onChange}: LongFilterProps) {
    const toggleStatus = () => {
        if(filter.callPut === "CALL") onChange({...filter, callPut: undefined});
        else onChange({...filter, callPut: "CALL"});
    }

    return (
        <Button className="call-filter-btn btn-border-gray mr-3 mt-3 d-xl-block long-filter-btn" variant=""
            onClick={()=>toggleStatus()} active={filter.callPut === "CALL"}><div className="derivative-suche-text-fix">Long</div></Button>
    )
}

export interface LongFilterProps {
    filter: DerivativeFilter;
    onChange: (newValue: any) => any;
}

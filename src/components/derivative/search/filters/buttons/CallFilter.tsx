import {Button} from "react-bootstrap";
import {DerivativeFilter} from "../../types/DerivativeSearchTypes";
import './derivativeSearchFiltersStyling.scss';
import {guessInfonlineSection, trigInfonline} from "../../../../common/InfonlineService";

export function CallFilter({filter, onChange}: CallFilterProps) {
    const toggleStatus = () => {
        if(filter.callPut === "CALL") onChange({...filter, callPut: undefined});
        else onChange({...filter, callPut: "CALL"});
    }

    return (
        <Button className="call-filter-btn btn-border-gray mr-3 mt-3 d-xl-block long-filter-btn" variant=""
            onClick={()=>{toggleStatus();trigInfonline(guessInfonlineSection(),'search_result')}} active={filter.callPut === "CALL"}><div className="derivative-suche-text-call">Call</div></Button>
    )
}

export interface CallFilterProps {
    filter: DerivativeFilter;
    onChange: (newValue: any) => any;
}

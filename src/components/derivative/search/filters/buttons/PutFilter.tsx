import {Button} from "react-bootstrap";
import {DerivativeFilter} from "../../types/DerivativeSearchTypes";
import './derivativeSearchFiltersStyling.scss';
import {guessInfonlineSection, trigInfonline} from "../../../../common/InfonlineService";

export function PutFilter({filter, onChange}: PutFilterProps) {
    const toggleStatus = () => {
        if(filter.callPut === "PUT") onChange({...filter, callPut: undefined});
        else onChange({...filter, callPut: "PUT"});
    }

    return (
        <Button className="put-filter-btn btn-border-gray mr-3 mt-3 d-xl-block short-filter-btn" variant=""
            onClick={()=>{toggleStatus();trigInfonline(guessInfonlineSection(),'search_result')}} active={filter.callPut === "PUT"}><div className="derivative-suche-text-call">Put</div></Button>
    )
}

export interface PutFilterProps {
    filter: DerivativeFilter;
    onChange: (newValue: any) => any;
}

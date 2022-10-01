import React, {Component} from "react";

export class CompanyEmployees extends Component<CompanyEmployeesProps, any> {
    render() {
        return (
            <>
                <div className="font-weight-bold">Aufsichtsrat</div>
                <p> { this.props.names.join(', ') } </p>
            </>
        );
    }
}

export interface CompanyEmployeesProps {
    names: string[];
}


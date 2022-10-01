import React, {Component} from "react";

export class CompanyBoardMembers extends Component<CompanyBoardMembersProps, any> {
    render() {
        return (
            <>
                <div className="font-weight-bold">Vorstand</div>
                <p className={"font-size-15px"}> { this.props.names.join(', ') } </p>
            </>
        );
    }
}

export interface CompanyBoardMembersProps {
    names: string[];
}

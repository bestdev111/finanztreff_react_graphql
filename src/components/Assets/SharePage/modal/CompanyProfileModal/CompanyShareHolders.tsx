import React, {Component} from "react";
import {CompanyShareHolderChart, CompanyShareHolderChartProps} from "../../charts/CompanyShareHolderChart";

export class CompanyShareHolders extends Component<CompanyShareHoldersProps, {}> {
    render() {
        return (
            <>
                <div className="d-flex justify-content-between">
                    <h3 className="content-wrapper-heading font-weight-bold">Aktionärsstruktur {this.props.name}</h3>
                </div>
                <div className="content">
                    <CompanyShareHolderChart shareHolders={this.props.shareHolders} height="350px"/>
                </div>
            </>
        );
    }
}

interface CompanyShareHoldersProps extends CompanyShareHolderChartProps {
    name: string;
}

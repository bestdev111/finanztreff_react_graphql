import {Component} from "react";
export class ExchangeOverviewLabelRow extends Component<ExchangeOverviewLabelRowProperties, { }> {
    render() {
        return (
            <tr className="inner-body-heading">
                <td className={"column-indicator d-sm-none d-md-block"}>&nbsp;</td>
                <td colSpan={3} className={`${this.props.headingPaddingTop && "pt-0"} inner-table-heading pl-2 pl-xl-0`}>
                    {this.props.title}
                </td>
                <td className={"d-md-none"}></td>
                <td colSpan={4} className="inner-table-heading d-none d-md-table-cell">&nbsp;</td>
                <td colSpan={7} className="inner-table-heading d-none d-xl-table-cell">&nbsp;</td>
            </tr>
        );
    }
}


export interface ExchangeOverviewLabelRowProperties {
    title: string;
    headingPaddingTop: boolean
}

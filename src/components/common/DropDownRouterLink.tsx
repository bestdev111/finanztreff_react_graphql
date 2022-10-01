import {Component} from "react";
import {Link} from "react-router-dom";

export class DropdownRouterLink extends Component<{href: string}> {
    render() {
        return <Link to={this.props.href} {...this.props}/>;
    }
}

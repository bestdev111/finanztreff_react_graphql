import React, {Component} from "react";
import {KeyValuePair} from "../../../utils";
import {Button} from "react-bootstrap";

export class DropdownButtonComponent extends Component<DropdownButtonComponentProperties, any> {
    state = {
        isListVisible: false,
        current: this.props.selected
    };

    renderItem(item: KeyValuePair, idx: number) {
        if (!item) return null;
        const key = item.key;
        const value = item.value;

        if (this.props.selected !== key)
            return (
                <Button
                    key={idx}
                    className="filter-button-menu-item"
                    onClick={() => {
                        this.setState({current: key, isListVisible: false});
                        if(this.props.onChangeEvent) {
                            this.props.onChangeEvent(value);
                        }
                    }}
                >{key}</Button>
            );
    }

    render() {
        return <>
            <div className="filter-button-wrapper">
                <div className="filter-button-group">
                    <button className="btn btn-primary filter-button-dropdown" type="button"
                            onClick={() => { this.setState({isListVisible: !this.state.isListVisible})}}>
                        <div className="drop-title">{this.props.title}</div>
                        <div className="drop-arrow">
                            {
                                this.state.isListVisible ?
                                    <span className="svg-icon can-sort direction-top font-weight-bold">
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"} className="svg-convert svg-white" alt="" style={{transform: "rotate(180deg)"}}/>
                                    </span>
                                    :
                                    <span className="svg-icon can-sort direction-bottom font-weight-bold">
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"} className="svg-convert svg-white" alt=""/>
                                    </span>
                            }
                        </div>
                        <div className="drop-selection">{this.state.current}</div>
                    </button>

                    {
                        this.state.isListVisible &&
                        <div className="filter-button-menu">
                            {
                                this.props.values.map(
                                    (item: any, idx: number) => this.renderItem(item, idx)
                                )
                            }
                        </div>
                    }
                </div>
            </div>
        </>
    }
}


export interface DropdownButtonComponentProperties {
    onChangeEvent: any,
    values: KeyValuePair[],
    title: string,
    selected: string
}

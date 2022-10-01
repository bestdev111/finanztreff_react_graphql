import React, {Component} from "react";
import {Button, Dropdown, DropdownButton, FormControl, InputGroup} from "react-bootstrap";
import {Watchlist} from "../../../../generated/graphql";
import './ProfileSelectWatchlist.scss'

export class ProfileSelectWatchList extends Component<ProfileSelectWatchListProps, ProfileSelectWatchListState> {
    render() {
        let state = {...this.state, selected: this.props.watchlistId};
        let watchlists = this.props.watchlists.slice()
            .filter(current => current.id!==state.selected && ((state?.selected && current.id === state.selected) || !state?.search || (current.name && current.name?.indexOf(state?.search) >= 0)))
            .sort((a: Watchlist, b:Watchlist) => {
                if (state.selected) {
                    if (a.id === state.selected) {
                        return -1;
                    }
                    if (b.id === state.selected) {
                        return 1;
                    }

                }
                return (a.name?.localeCompare(b?.name || "")) ? 1 : -1;
            })
            .slice(0, 20);
        return (
            <InputGroup>
                <DropdownButton title={this.props.value || "auswählen..."} className={"select-watchlist"} style={{ borderRadius: "3px"  }}>
                    <FormControl value={state?.search} onChange={control => this.setState({...state, search: control.target.value})}/>
                    <Dropdown.Divider/>
                    {watchlists.map(current =>
                    <>
                        <Dropdown.Item key={current.id} onClick={() => this.props.callback ? this.props.callback(current.id) : undefined}><b>{current.name}</b></Dropdown.Item>
                        <Dropdown.Divider  style={{ margin: "0" }}/>
                    </>
                    )}
                </DropdownButton>
            </InputGroup>
        );
    }
}

interface ProfileSelectWatchListProps {
    watchlists: Watchlist[];
    callback?: (value: number) => void;
    watchlistId?: number;
    value?: string;
}

interface ProfileSelectWatchListState{
    selected?: number;
    search? : string;
}

import { Component } from "react";
import { Dropdown, DropdownButton, FormControl, InputGroup } from "react-bootstrap";
import { Portfolio } from "../../../../../generated/graphql";
import './ProfileSelectPortfolio.scss'

export class ProfileSelectPortfolio extends Component<ProfileSelectPortfolioProps, ProfileSelectPortfolioState> {
    render() {
        let state = { ...this.state, selected: this.props.portfolioId };
        let portfolios = this.props.portfolios.slice()
            .filter(current => current.id!==state.selected && ((state?.selected && current.id === state.selected) || !state?.search || (current.name && current.name?.indexOf(state?.search) >= 0)))
            .sort((a: Portfolio, b: Portfolio) => {
                if (state.selected) {
                    if (a.id === state.selected) {
                        return -1;
                    }
                    if (b.id === state.selected) {
                        return 1;
                    }
                }
                return (a.name?.toLowerCase().localeCompare(b?.name?.toLowerCase() || "")) ? 1 : -1;
            })
            .slice(0, 20);
        return (
            <InputGroup className="">
                <DropdownButton title={this.props.value || "auswählen..."} className={"select-portfolio"} style={{ borderRadius: "3px"  }}>
                    <FormControl value={state?.search} onChange={control => this.setState({ ...state, search: control.target.value })} />
                    <Dropdown.Divider className="mb-0" />
                    {portfolios.map(current =>
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

interface ProfileSelectPortfolioProps {
    portfolios: Portfolio[];
    callback?: (value: number) => void;
    portfolioId?: number;
    value?: string;
}

interface ProfileSelectPortfolioState {
    selected?: number;
    search?: string;
}

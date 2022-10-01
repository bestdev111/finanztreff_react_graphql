import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { Component } from "react";
import { Button, InputGroup, Modal } from "react-bootstrap";
import { Instrument, InstrumentGroup } from "../../../../../generated/graphql";
import { ExchangeOverviewTable } from "../../../misc/ExchangeOverviewTable/ExchangeOverviewTable";
import './ProfileSelectInstrument.scss'

export class ProfileSelectInstrument extends Component<ProfileSelectInstrumentProps, ProfileSelectInstrumentState> {
    state = { opened: false, value: "" };
    render() {
        let callbackFn =
            (value: InstrumentSelected) => {
                this.setState({ ...this.state, opened: false, value: value.name });
                this.props.callback && this.props.callback(value);
            };

        return (
            <>
                <InputGroup className="select-instrument-trigger" onClick={() => this.setState({ ...this.state, opened: true })}>
                    <Button variant="link"
                        className="text-left"
                        style={!(this.state.value || this.props.value) ? { width: '100%', border: "2px solid #FF00FF" } : { width: '100%' }}
                        onClick={() => this.setState({ ...this.state, opened: true })}
                    >{this.state.value || this.props.value || 'auswählen ...'}</Button>
                </InputGroup>
                <Modal show={this.state.opened} size={"xl"} onHide={()=>!this.state.opened} className="modal-background modal-dialog-sky-placement">
                    <ModalHeaderMeinFinanztreff title={"Börsenplatz auswählen"} close={() => this.setState({ ...this.state, opened: false })} />
                    <Modal.Body className="bg-white" style={{ overflowX: 'hidden', height: 'auto' }}>
                        <ExchangeOverviewTable group={this.props.group} isLink={false} instruments={this.props.instruments} callback={value => {
                            let instrument = this.props.instruments.find(current => current.id && current.id === value);
                            if (instrument) {
                                callbackFn({ id: instrument.id, name: instrument.exchange.name || "" })
                            }
                        }} />
                    </Modal.Body>
                </Modal>
            </>
        );
    }

}

interface ProfileSelectInstrumentProps {
    group?: InstrumentGroup;
    instruments: Instrument[];
    value?: string;
    callback?: (id: InstrumentSelected) => void;
}

interface ProfileSelectInstrumentState {
    opened: boolean;
    value?: string;
}

export interface InstrumentSelected {
    id: number;
    name: string;
}

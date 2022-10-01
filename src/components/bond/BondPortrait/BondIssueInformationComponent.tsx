import React from "react";
import { Table } from "react-bootstrap";
import { InstrumentGroup } from "graphql/types";
import { formatDate, shortNumberFormat } from "utils";
import './BondTextDescriptionComponent.scss';

interface IssueInformationComponentProps {
    instrumentGroup: InstrumentGroup;
}

export const BondIssueInformationComponent = (props: IssueInformationComponentProps) => {
    return (
        <div className="content-wrapper"> 
            <h2 className="content-wrapper-heading font-weight-bold">Emissionsdaten</h2>
            <div className="content">
                <Table variant="dividend">
                    <tr>
                        <Table variant="dividend">
                            <tr>
                                <div className="font-weight-bold text-anleihen-custom">Emittent</div>
                            </tr>
                            <tr>
                                <div className="text-anleihen-custom">{props.instrumentGroup.bond?.issuer?.name}</div>
                            </tr>
                            <tr>
                                <button type="button" className="mb-2 mr-2 btn btn-primary override-button-colors">Weitere Anleihen dieses Emittenten</button>
                            </tr>
                        </Table>
                    </tr>
                    <tr>
                        <Table variant="dividend">
                            <tr>
                                <div className="font-weight-bold text-anleihen-custom">Emissionswährung:</div>
                            </tr>
                            <tr>
                                <div className="text-anleihen-custom">{props.instrumentGroup.bond?.nominalCurrency?.displayCode}</div>
                            </tr>
                        </Table>
                    </tr>
                    <tr>
                        <Table variant="dividend">
                            <tr>
                                <div className="font-weight-bold text-anleihen-custom">Emissionsvolumen:</div>
                            </tr>
                            <tr>
                                {
                                    props.instrumentGroup.bond?.issueSize &&
                                <div className="text-anleihen-custom">{shortNumberFormat(props.instrumentGroup.bond?.issueSize)}</div>
                                }
                                </tr>
                        </Table>
                    </tr>
                    <tr>
                        <Table variant="dividend">
                            <tr>
                                <div className="font-weight-bold text-anleihen-custom">Emissionsdatum:</div>
                            </tr>
                            <tr>
                                <div className="text-anleihen-custom">{props.instrumentGroup.bond?.issueDate && formatDate(props.instrumentGroup.bond?.issueDate) || "--"}</div>
                            </tr>
                        </Table>
                    </tr>
                    <tr>
                        <Table variant="dividend">
                            <tr>
                                <div className="font-weight-bold text-anleihen-custom">Market Maker:</div>
                            </tr>
                            <tr>
                                <div className="text-anleihen-custom">--</div>
                            </tr>
                        </Table>
                    </tr>
                    <tr>
                    <Table variant="dividend">
                            <tr>
                                <div className="font-weight-bold text-anleihen-custom">Handelszeiten:</div>
                            </tr>
                            <tr>
                                <div className="text-anleihen-custom">--</div>
                            </tr>
                        </Table>
                    </tr>
                </Table>
            </div>
        </div>
    )
}

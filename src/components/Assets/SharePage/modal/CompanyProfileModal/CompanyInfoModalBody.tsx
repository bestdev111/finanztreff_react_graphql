import React, {Component} from "react";
import {CompanyNewsContent} from "./CompanyNewsContent/CompanyNewsContent";
import {Company, InstrumentGroup} from "../../../../../generated/graphql";
import {CompanyProfileInformation} from "./CompanyProfileInformation";
import {CompanyBoardMembers} from "./CompanyBoardMembers";
import {CompanyEmployees} from "./CompanyEmployees";
import {CompanyShareHolders} from "./CompanyShareHolders";
import {CompanyContacts} from "./CompanyContacts";
import {ShareHolder} from "../../charts/CompanyShareHolderChart";

export class CompanyInformationModalBody extends Component<CompanyInformationModalBodyProps, any> {
    render() {
        let boardMembers = (this.props.company.employees || [])
            .filter(current => current != null && current.name != null && current.member === true)
            .map(current => current.name || "");
        let employees = (this.props.company.employees || [])
            .filter(current => current != null && current.name != null && current.member === false)
            .map(current => current.name || "");
        let shareHolders: ShareHolder[] = (this.props.company.shareHolders || [])
            .map(current =>{ return {name: current.name || "", percent: current.percent || 0}});
        return (
            <div className="modal-body mobile-modal-body">
                <section className="main-section">
                    <div className="container">
                        <div className="content-row">
                            <div className="row">
                                <div className="section-left-part col-xl-9 col-lg-12">
                                    <div className="content-wrapper wb-m col">
                                        <CompanyNewsContent isin={this.props.isin}/>
                                    </div>
                                    <div className="content-wrapper wb-m col">
                                        <CompanyProfileInformation text={this.props.company.profile?.text || ""} instrumentGroup={this.props.instrumentGroup}/>
                                    </div>
                                    <div className="content-wrapper wb-m col">
                                        <CompanyShareHolders name={this.props.company.name || ""} shareHolders={shareHolders}/>
                                    </div>
                                </div>
                                <div className="section-right-part col-xl col-lg-12">
                                    <div className="row row-cols-xl-1 row-cols-lg-2 row-cols-sm-1 gutter-table-16">
                                        <div className="col">
                                            <div className="content-wrapper wb-m">
                                                <div className="d-flex justify-content-between">
                                                    <h3 className="content-wrapper-heading font-weight-bold">Management/Führung</h3>
                                                </div>
                                                <div className="content">
                                                    <CompanyBoardMembers names={boardMembers}/>
                                                    <CompanyEmployees names={employees}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="content-wrapper wb-m">
                                                <CompanyContacts
                                                    address={this.props.company.profile?.address || ""}
                                                    phone={this.props.company.profile?.phone || ""}
                                                    fax={this.props.company.profile?.fax || ""}
                                                    website={this.props.company.profile?.website || ""}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export interface CompanyInformationModalBodyProps {
    company: Company;
    isin: string;
    instrumentGroup: InstrumentGroup;
}



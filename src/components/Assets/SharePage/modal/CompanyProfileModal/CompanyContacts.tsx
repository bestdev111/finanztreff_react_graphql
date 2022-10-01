import React, {Component} from "react";

export class CompanyContacts extends Component<CompanyContactsProps, any> {
    render() {
        return (
            <>
                <div className="d-flex justify-content-between">
                    <h3 className="content-wrapper-heading font-weight-bold">Adresse</h3>
                </div>
                <div className="content">
                    {
                        this.props.address &&
                        <div className="">
                            <div className="font-weight-bold">Anschrift</div>
                            <div>{ this.props.address}</div>
                        </div>
                    }
                    {
                        (this.props.phone || this.props.fax) &&
                        <div className="margin-top-25">
                            <div className="font-weight-bold">Telefon/Fax</div>
                            {this.props.phone && <div>{this.props.phone}</div>}
                            {this.props.fax && <div>{this.props.fax}</div>}
                        </div>
                    }
                    {
                        this.props.website &&
                        <div className="margin-top-25">
                            <div className="font-weight-bold">Internet</div>
                            <a target={"_blank"} rel="noreferrer" href={`//${this.props.website}`}>Zur Unternehmenshomepage</a>
                        </div>
                    }
                </div>
            </>
        );
    }
}

export interface CompanyContactsProps {
    address?: string;
    phone?: string;
    fax?: string;
    website?: string;
}

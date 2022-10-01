import React, {Component} from "react";
import {InstrumentGroup} from "../../../../../generated/graphql";
import {Container} from "react-bootstrap";

interface IndexPortraitSectionProps {
    group: InstrumentGroup;
}

export class IndexPortraitSection extends Component<IndexPortraitSectionProps> {
    render() {
        if (!this.props.group.description?.text) {
            return <></>
        }
        return (
            <section className="main-section">
                <Container>
                    <h2 className="section-heading font-weight-bold ml-n2 ml-md-0">Indexporträt</h2>
                    <div className="content-row">
                        <div className="content-wrapper d-none d-xl-block">
                            <h3 className="content-wrapper-heading font-weight-bold">{this.props.group.name}</h3>
                            <div className="content">{this.props.group.description?.text}</div>
                        </div>
                    </div>
                </Container>
            </section>
        );
    }
}

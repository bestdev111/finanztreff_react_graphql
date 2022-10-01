import React, {Component} from "react";
import {Container} from "react-bootstrap";


interface QuickLinkProps {
    count: number;
    text: string;
}

class QuickLink extends Component<QuickLinkProps, any> {
    render() {
        return <>
            <div className="col">
                <div className="news-wrapper d-flex">
                    <div className="left-side">
                        <div className="kurse-value">{this.props.count}</div>
                        <div className="kurse-info">Treffer</div>
                    </div>
                    <div className="right-side">
                        <h4 className="news-title text-blue">
                            <a href="#">{this.props.text}</a>
                        </h4>
                    </div>
                </div>
            </div>
        </>;
    }
}

export default class QuickLinksSection extends Component<any, any> {
    render() {
        return <>
            <section className="main-section quick-links-section">
                <Container>
                    <div className="content-wrapper">
                        <h3 className="content-wrapper-heading font-weight-bold">Quick Links</h3>
                        <div className="content">
                            <div className="row row-cols-xl-2 row-cols-1 small-news-row">
                                <QuickLink count={228}
                                           text="Euro Stoxx 50 - Kein Aufgeld, über 35% Puffer und 3 Jahre mind. 4% Bonus p.a.!"/>
                                <QuickLink count={177}
                                           text="Commerzbank Discount Zertifikaten: Annualisert 20% bei gleichbleibendem Kurs."/>
                                <QuickLink count={47}
                                           text="Deutsche Bank: Für mehr als 2 Jahre Chance auf zweistellige Jahresrenditen"/>
                                <QuickLink count={47}
                                           text="Einzeltitel aus DAX und Euro Stoxx 50: 20% Renditechance! (RLZ 6-9 Monate)"/>
                                <QuickLink count={47}
                                           text="Hoher Discount bei Allianz Discount Zertifikaten und trotzdem 8% Rendite p.a."/>
                                <QuickLink count={47}
                                           text="Mehr als 10 Prozent Rendite p.a. auf DAX-Unternehmen - mit über 30% Puffer!"/>
                                <QuickLink count={47}
                                           text="15% Discount über 12% Renditechance mit Daimler Discount-Zertifikaten"/>
                                <QuickLink count={47}
                                           text="Euro Stoxx 50 - Kein Aufgeld, über 35% Puffer und 3 Jahre mind. 4% Bonus p.a.!"/>
                                <QuickLink count={47}
                                           text="Euro Stoxx 50 - Kein Aufgeld, über 35% Puffer und 3 Jahre mind. 4% Bonus p.a.!"/>
                                <QuickLink count={47}
                                           text="Commerzbank Discount Zertifikaten: Annualisert 20% bei gleichbleibendem Kurs."/>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </>;
    }
}
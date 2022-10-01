import {Component} from "react";

export class PageBannerSubNavigationComponent extends Component<{}, {}> {
    render() {
        return (
            <div className="sub-navigation border-gray-dark-asset border-top-1" style={{height: 43}}>
                <div className={"mt-n1 mt-md-0"}>
                    <a href="#kurse-anchor" className="active anchor-link">Kurse &amp; Kennzahlen</a>
                    <a href="#news-analysen-anchor" className="anchor-link">News &amp; Analysen</a>
                    <a href="#kennzahlen-anchor" className="anchor-link">Kennzahlen</a>
                    <a href="#einzelwerte-anchor" className="anchor-link">Einzelwerte</a>
                    <a href="#tops-flops-anchor" className="anchor-link">Tops &amp; Flops</a>
                    <a href="#tools-anchor" className="anchor-link">Tools</a>

                </div>
            </div>
        );
    }

}

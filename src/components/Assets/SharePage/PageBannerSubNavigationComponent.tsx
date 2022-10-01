import {Component} from "react";

export class PageBannerSubNavigationComponent extends Component<{}, {}> {
    render() {
        return (
            <div className="sub-navigation">
                <a href="#kurse-borse-anchor" className="active anchor-link">Kurse &amp; Börsen</a>
                <a href="#news-analysen-anchor" className="anchor-link">News &amp; Analysen</a>
                <a href="#firmenprofil-anchor" className="anchor-link">Firmenprofil</a>
                <a href="#kennzahlen-anchor" className="anchor-link">Kennzahlen</a>
                <a href="#tools-anchor" className="anchor-link">Tools</a>
            </div>
        );
    }

}

import {Component} from "react";
import moment from "moment";
import classNames from "classnames";
import {formatPrice, quoteFormat, shortNumberFormat} from "../../../../utils";
import {QuoteInformation} from "./utils";
import { AssetGroup } from "graphql/types";

export class DailyQuoteInformation extends Component<DailyQuoteInformationProps, any> {
    render() {
        let active = this.props.info.when.startOf('date').isSame(moment(), 'date');
        return (
            <div className={classNames("day-wrapper", (active ? "active" : "") ,"text-center", this.props.classNames)}>
                <div className="week-day-heading font-weight-bold">
                    <div className="week-day">{active && "Heute, "}{this.props.info.when.format(active ? "ddd" : "dddd")}</div>
                    <div className="day-hour">{quoteFormat(this.props.info.when, ' Uhr')}</div>
                </div>
                <div className="week-day-data">
                    {this.props.info.closed ? <div className="kurs-type">Schluss Kurs</div> : <div className="kurs-type">Aktueller Kurs</div>}
                    <div className="kurs-value font-weight-bold">{formatPrice(this.props.info.lastPrice, this.props.assetGroup)} {this.props.currencyCode}</div>
                </div>
                <div className="week-day-data">
                    <div className="kurs-type">Eröffnung</div>
                    <div className="kurs-value font-weight-bold">{formatPrice(this.props.info.firstPrice, this.props.assetGroup)} {this.props.currencyCode}</div>
                </div>
                <div className="week-day-data">
                    <div className="kurs-type">Tageshoch</div>
                    <div className="kurs-value font-weight-bold">{formatPrice(this.props.info.highPrice, this.props.assetGroup)} {this.props.currencyCode}</div>
                </div>
                <div className="week-day-data">
                    <div className="kurs-type">Tagestief</div>
                    <div className="kurs-value font-weight-bold">{formatPrice(this.props.info.lowPrice, this.props.assetGroup)} {this.props.currencyCode}</div>
                </div>
                <div className="week-day-data">
                    <div className="kurs-type">Umsatz Stück</div>
                    <div className="kurs-value font-weight-bold">{shortNumberFormat(this.props.info.volume)}</div>
                </div>
            </div>
        );
    }
}

interface DailyQuoteInformationProps {
    classNames?: string;
    assetGroup?: AssetGroup
    info: QuoteInformation;
    currencyCode: string;
}


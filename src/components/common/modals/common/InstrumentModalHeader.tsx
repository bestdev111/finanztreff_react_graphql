import { Component } from "react";
import { Instrument, InstrumentGroup } from '../../../../graphql/types'
import {
    extractQuotes,
    formatAssetGroup, formatPrice,
    formatPriceWithSign,
    quoteFormat,
    sortByExchanges
} from '../../../../utils'
import classNames from "classnames";
import './InstrumentModalHeader.scss'
import {Dropdown} from "react-bootstrap";
import SvgImage from "../../image/SvgImage";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import {ShareButton} from "../../../shares/search/dropdowns/ShareCardDropdown";

export class InstrumentModalHeader extends Component<ModalsTitleProperties, { assetGroup: String }, {}>{

    state: any = {
        show: false,
    };

    render() {

        const instrument = this.props.instrument ? this.props.instrument : this.props.modalsTitle.content.filter((item: any) => item.main === true)[0] || this.props.modalsTitle.content[0];
        const { name, isin, wkn, snapQuote, currency, exchange } = instrument;
        const content = sortByExchanges(this.props.modalsTitle.content);

        if (snapQuote == null) {
            return <></>;
        }
        const assetGroup = instrument.group.assetGroup;

        let { trade, nav } = extractQuotes(snapQuote);
        return (
            <div className={classNames("row row-cols-1 font-size-15px", this.props?.className, "instrument-modal-header")}>
                <div className="col d-flex justify-content-between">
                    <div className="left-side d-flex align-items-center">
                        <span className={`asset-type ${formatAssetGroup(assetGroup).toLowerCase()}`} style={{ marginRight: '16px' }}>{formatAssetGroup(assetGroup)}</span>
                        <span className={`asset-name font-weight-bold ${formatAssetGroup(assetGroup).toLowerCase()}`}>{name}</span>
                        <span className="wkn-info">WKN: {wkn}</span>
                        <span className="isin-info">ISIN: {isin}</span>
                    </div>

                    <div className={`right-side ml-md-5px d-flex trade-info ${formatAssetGroup(assetGroup).toLowerCase()} `}>
                        {trade && trade.value ?
                            <span
                                className={`font-weight-bold ${formatAssetGroup(assetGroup) === 'Aktie' ? 'ml-sm-4 pl-sm-2' : ''} ${formatAssetGroup(assetGroup) === 'Index' ? 'ml-sm-4 pl-sm-1 ml-md-0 pl-md-0  ' : ''} `}
                                style={{ marginLeft: 0 }}>{formatPrice(trade.value,assetGroup,snapQuote?.quote?.value, currency.displayCode)}</span>
                            :
                            nav && nav.value &&
                                <span
                                    className={`font-weight-bold ${formatAssetGroup(assetGroup) === 'Aktie' ? 'ml-sm-4 pl-sm-2' : ''} ${formatAssetGroup(assetGroup) === 'Index' ? 'ml-sm-4 pl-sm-1 ml-md-0 pl-md-0  ' : ''} `}
                                    style={{ marginLeft: 0 }}>{formatPrice(nav.value,assetGroup,snapQuote?.quote?.value, currency.displayCode)} </span>
                        }
                        {trade && trade.percentChange ?
                            <span className={classNames("font-weight-bold", trade.percentChange > 0 ? "text-green" : trade.percentChange < 0 ? "text-pink" : "")}>
                                {formatPriceWithSign(trade.percentChange,this.props.instrument?.group.assetGroup,snapQuote?.quote?.value, " %")}
                            </span> :
                            nav && nav.percentChange &&
                                <span className={classNames("font-weight-bold", nav.percentChange > 0 ? "text-green" : nav.percentChange < 0 ? "text-pink" : "")}>
                                    {formatPriceWithSign(nav.percentChange,this.props.instrument?.group.assetGroup,snapQuote?.quote?.value, " %")}
                                </span>
                        }
                        {exchange.name && !this.props.isChartBanner &&
                            <span>{exchange.name}</span>
                        }
                        {exchange.name && this.props.isChartBanner && (
                                <Dropdown show={this.state.show} onToggle={() => {
                                    // @ts-ignore
                                    this.setState({show: !this.state.show});
                                }} className="dropdown-select no-after">
                                    <Dropdown.Toggle  className={"border-0 text-blue bg-white font-weight-bold pr-0"} style={{fontSize: '16px', lineHeight: '0.5'}}>
                                        <span style={{fontSize: '16px'}}>{exchange.name}</span>
                                        <SvgImage icon="icon_direction_down_blue.svg" convert={false} spanClass="pl-1 mt-n1" width="16" imgClass="" style={{paddingBottom: '1px'}}/>
                                    </Dropdown.Toggle>
                                    <DropdownMenu id={"exchange-dropdown-chart-tool"} style={{fontSize: '16px', zIndex: 99999}}>
                                            <span className="mx-auto" style={{fontSize: '16px'}}>
                                            {content.map((value: Instrument, index: number) => (
                                                    <ShareButton key={index} active={this.props.instrument?.id === value.id}
                                                         onClick={() => {
                                                             this.props.setInstrument && this.props.setInstrument(value)
                                                             // @ts-ignore
                                                             this.setState({show: false})
                                                         }} className={"text-nowrap"} value={value.exchange.name as string}
                                                    />
                                                ))}
                                        </span>
                                    </DropdownMenu>
                                </Dropdown>
                            )}
                        {trade && trade.when ?
                            <span>{quoteFormat(trade.when, ' Uhr')}</span>
                            :
                            nav && nav.when &&
                                <span>{quoteFormat(nav.when, ' Uhr')}</span>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export interface ModalsTitleProperties {
    modalsTitle: InstrumentGroup;
    className?: string | undefined;
    instrument?: Instrument;
    isChartBanner?: boolean
    setInstrument?: (val: Instrument) => void;
    show?: boolean;
}

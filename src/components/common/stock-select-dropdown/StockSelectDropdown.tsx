import {SnapQuoteDelayIndicator} from "../indicators";
import {shortNumberFormat, sortByExchanges} from "../../../utils";
import React, {useState} from "react";
import {Instrument, InstrumentGroup} from "../../../generated/graphql";

export interface StockSelectDropdownProps {
    instrumentGroup: InstrumentGroup,
    selectedInstrument: Instrument,
    mobileClass?: any,
    onChange: any,
}

export interface StockSelectDropdownState {
    menuOpen: boolean,
}

export const StockSelectDropdown = function(props: StockSelectDropdownProps) {
    let {id, exchange} = props.selectedInstrument;
    const [state, setState] = useState<StockSelectDropdownState>({
        menuOpen: false,
    });

    const getDelay = function (i: Instrument) {
        let delay = 0;
        const trades = i.snapQuote?.quotes?.filter(q => q?.type === "TRADE") || [];
        if (trades.length > 0) delay = (trades[0] ? trades[0].delay : 0) || 0;
        return delay;
    }

    const selectBorsenplatz = function (instrument: Instrument) {
        props.onChange(instrument);
    }
    let content = sortByExchanges(props.instrumentGroup.content)

    return <div className={"dropdown dropdown-select dropdown-filter no-after-pointer"}>
        <button className="btn btn-primary dropdown-toggle" type="button"
                onClick={() => setState({...state, menuOpen: !state.menuOpen})}
                // onBlur={() => window.setTimeout(() => setState({...state, menuOpen: false}), 250) }
        >
            <div className="drop-legend">Börsenplatz</div>
            <div className="drop-selection">{props.selectedInstrument?.exchange.name}</div>
            <span className="drop-arrow-image open-icon svg-icon top-move">
                                                            <img src="/static/img/svg/icon_direction_down_white.svg" className="svg-white" alt=""/>
                                                        </span>
        </button>


        <div className={"dropdown-menu" + (state.menuOpen ? " show " : " hide ") + props.mobileClass} aria-labelledby="analysenModalFilterDropSort">
            <div className="drop-header">Börsenplatz auswählen<span onClick={() => setState({...state, menuOpen: false})} className="drop-arrow-image close-icon svg-icon top-move"><svg
                xmlns="http://www.w3.org/2000/svg" id="Ebene_1" data-name="Ebene 1" width="28" height="28" viewBox="0 0 28 28"
                className="svg-convert svg-grey"><path id="Pfad_846" data-name="Pfad 846"
                                                       d="M15.11,14l4.66-4.65a.79.79,0,0,0-1.12-1.12L14,12.88,9.34,8.22a.79.79,0,0,0-1.12,0,.8.8,0,0,0,0,1.08L12.88,14,8.22,18.65a.79.79,0,0,0,1.12,1.12L14,15.11l4.65,4.66a.79.79,0,1,0,1.12-1.12Z"
                                                       fill="#383838"></path></svg></span></div>
            <div className={"d-flex mt-2 pr-3 pl-5 ml-n2 justify-content-between font-weight-bold mb-n2"}>
                <div>
                    Börse
                </div>
                <div className={""}>
                    GVolumen
                </div>
            </div>
            <div className="drop-body with-scroll">
                {
                    content.map(
                        i => <div className="body-row d-flex justify-content-between "
                                  onClick={() => {
                                      selectBorsenplatz(i)
                                      setState({...state, menuOpen: !state.menuOpen})
                                  }}>
                            <div className="stock-menu-item">
                                <SnapQuoteDelayIndicator delay={getDelay(i)} />&nbsp;
                                <span>{i.exchange.name}</span>
                            </div>
                            <div className="bors-value">{shortNumberFormat(i.snapQuote?.cumulativeVolume)}</div>
                        </div>
                    )
                }

            </div>
        </div>
    </div>
}

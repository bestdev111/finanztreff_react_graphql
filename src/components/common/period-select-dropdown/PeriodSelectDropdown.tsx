import React, {useState} from "react";
import moment, {Moment} from "moment";
import ReactDatePicker from "react-datepicker";

export interface PeriodSelectDropdownProps {
    from: Moment,
    to: Moment,
    mobileClass?: any,
    onChange: any,
}

export interface PeriodSelectDropdownState {
    menuOpen: boolean,
    tag: moment.Moment;
    fH: string;
    fM: string;
    tH: string;
    tM: string;
}

export const PeriodSelectDropdown = function (props: PeriodSelectDropdownProps) {
    const _fm = Number(props.from.format('m'));
    const _tm = Number(props.to.format('m'));

    const [state, setState] = useState<PeriodSelectDropdownState>({
        menuOpen: false,
        tag: props.from,
        fH: props.from.format('H'),
        fM: (_fm - Math.ceil(_fm % 5)).toString(),
        tH: props.to.format('H'),
        tM: (_tm - Math.ceil(_tm % 5)).toString(),
    });


    const renderHoursOptions = function () {
        const opts: any[] = [];
        for (let i = 0; i < 24; i++) {
            opts.push(<option value={i} key={i}>{('0' + i).slice(-2)}</option>);
        }
        return opts;
    }

    const renderMinutesOptions = function () {
        const opts: any[] = [];
        for (let i = 0; i < 60; i = i + 5) {
            opts.push(<option value={i} key={i}>{('0' + i).slice(-2)}</option>);
        }
        return opts;
    }

    const selectPeriod = function () {
        const from = moment(state.tag).set({hour: Number(state.fH), minute: Number(state.fM)});
        const to = moment(state.tag).set({hour: Number(state.tH), minute: Number(state.tM)});

        setState({...state, menuOpen: false});
        props.onChange(from, to);
    }

    const toggleMenu = function () {
        const _mo = !state.menuOpen;
        setState({...state, menuOpen: _mo});
    }

    const closeMenu = function () {
        const _mo = !state.menuOpen;
        setState({...state, menuOpen: _mo});
    }

    return (
        <>
            <div className="dropdown dropdown-select dropdown-filter dropdown-keep-open no-after-pointer datum-drop">
                <div className={"dropdown-filter-content"}>
                    <button className="btn btn-primary dropdown-toggle" type="button"
                            onClick={() => toggleMenu()}>
                        <div className="drop-legend">Datum und Uhrzeit</div>
                        <div className="drop-selection">{props.from.format('DD.MM.YYYY')}; {props.from.format('HH:mm')} - {props.to.format('HH:mm')}</div>
                        <span className="drop-arrow-image open-icon svg-icon top-move">
                                                        <img src="/static/img/svg/icon_direction_down_white.svg" className="svg-white" alt=""/>
                                                    </span>
                    </button>


                    <div className={"dropdown-menu" + (state.menuOpen ? " show " : " hide ") + props.mobileClass}>
                        <div className="drop-header">Datum und Uhrzeit auswählen <span className="drop-arrow-image close-icon svg-icon top-move"
                                                                                       id="buttonFilterDropDatumCancel" onClick={closeMenu}><svg
                            xmlns="http://www.w3.org/2000/svg" id="Ebene_1" data-name="Ebene 1" width="28" height="28" viewBox="0 0 28 28"
                            className="svg-convert svg-grey">
  <path id="Pfad_846" data-name="Pfad 846"
        d="M15.11,14l4.66-4.65a.79.79,0,0,0-1.12-1.12L14,12.88,9.34,8.22a.79.79,0,0,0-1.12,0,.8.8,0,0,0,0,1.08L12.88,14,8.22,18.65a.79.79,0,0,0,1.12,1.12L14,15.11l4.65,4.66a.79.79,0,1,0,1.12-1.12Z"
        fill="#383838"></path>
</svg></span></div>
                        <div className="drop-body" style={{overflow: "visible"}}>
                            <div className="filter-row">
                                <div className="filter-legend font-weight-bold">Tag</div>
                                <div className="datepicker-wrapper w-100">
                                    <ReactDatePicker calendarClassName={"w-100"}
                                                     className="datepicker datepicker-filter-modal w-100"
                                                     value={state.tag.format('DD.MM.YYYY')}
                                                     onChange={date => setState({...state, tag: moment((date as Date))})}/>
                                </div>
                            </div>
                            <div className="filter-row">
                                <div className="filter-legend font-weight-bold">Zeitraum</div>
                                <div className="timepicker-wrapper d-flex justify-content-between align-items-center">
                                    <div className="position-relative">
                                        <select className="timepicker timepicker-filter-modal" value={state.fH}
                                                onChange={v => {
                                                    setState({...state, fH: v.target.value})
                                                }}>
                                            {renderHoursOptions()}
                                        </select></div>
                                    <span>:</span>
                                    <div className="position-relative">
                                        <select className="timepicker timepicker-filter-modal" value={state.fM}
                                                onChange={v => {
                                                    setState({...state, fM: v.target.value})
                                                }}>
                                            {renderMinutesOptions()}
                                        </select>
                                    </div>
                                    <span>bis</span>
                                    <div className="position-relative">
                                        <select className="timepicker timepicker-filter-modal" value={state.tH}
                                                onChange={v => {
                                                    setState({...state, tH: v.target.value})
                                                }}>
                                            {renderHoursOptions()}
                                        </select>
                                    </div>
                                    <span>:</span>
                                    <div className="position-relative">
                                        <select className="timepicker timepicker-filter-modal" value={state.tM}
                                                onChange={v => {
                                                    setState({...state, tM: v.target.value})
                                                }}>
                                            {renderMinutesOptions()}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="drop-footer">
                            <button className="btn btn-link text-blue justify-content-end" type="button" onClick={selectPeriod}>
                                                            <span className="svg-icon top-move">
                                                                <svg xmlns="http://www.w3.org/2000/svg" id="Ebene_1" data-name="Ebene 1" width="28"
                                                                     height="28" viewBox="0 0 28 28" className="svg-convert svg-green">
                                                                    <g id="Komponente_86_1" data-name="Komponente 86 1">
                                                                        <path
                                                                            d="M12.23,21a1,1,0,0,1-.77-.38C7.21,15.12,7.18,15.06,7.14,15a1,1,0,0,1,.34-1.33,1,1,0,0,1,1.3.28c.15.21,1.85,2.41,3.35,4.35l7-11.82a1,1,0,0,1,1.34-.34,1,1,0,0,1,.34,1.32L13.07,20.52a1,1,0,0,1-.78.48Z"
                                                                            fill="#383838">

                                                                        </path>
                                                                    </g>
                                                                </svg> </span><span>Anwenden</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            {
                state.menuOpen &&
                <div style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                     onClick={toggleMenu}></div>
            }
        </>
    );
}

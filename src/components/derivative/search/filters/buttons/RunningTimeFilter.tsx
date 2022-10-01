import {Dropdown} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import Datepicker from "react-datepicker";
import {DropdownMenuHeader} from "../layout/DropdownMenuHeader";
import {DropdownMenuFooter} from "../layout/DropdownMenuFooter";
import {DropdownButton} from "../layout/DropdownButton";
import {ButtonItem} from "../layout/ButtonItem";
import {useBootstrapBreakpoint} from "../../../../../hooks/useBootstrapBreakpoint";
import {CSSTransition} from "react-transition-group";
import Moment from "moment";
import {SvgCheck} from "../../../../common/svg/svg-check";
import {SvgCancel} from "../../../../common/svg/svg-cancel";
import {DerivativeFilter} from "../../types/DerivativeSearchTypes";
import {guessInfonlineSection, trigInfonline} from "../../../../common/InfonlineService";

const stdValues: { [key: string]: { from: number | null, to: number | null, text: string }; } = {
    '-1': {
        from: null,
        to: 1,
        text: "1 Monat"
    },
    '1-3': {
        from: 1,
        to: 3,
        text: "1 - 3 Monate"
    },
    '3-6': {
        from: 3,
        to: 6,
        text: "3 - 6 Monate"
    },
    '6-12': {
        from: 6,
        to: 12,
        text: "6 - 12 Monate"
    },
    '12-': {
        from: 12,
        to: null,
        text: "> 12 Monate"
    },
};

interface RunningTimeFilterProps extends React.HTMLAttributes<HTMLDivElement> {
    currentFilter: DerivativeFilter;
    showButton?: boolean;
    showContent?: boolean;
    contentActive?: boolean;
    onClick?: () => any;
    onFilterChange?: (newFilter: DerivativeFilter) => any;
    onVisbilityChange?: (isVisible: boolean) => any;
}

export function RunningTimeFilter({currentFilter, showButton, showContent, contentActive, onClick, onFilterChange, onVisbilityChange, className}: RunningTimeFilterProps) {
    const [show, setShow] = useState(false);
    const [active, setActive] = useState<string|null>(null);
    const [datePickerActive, setDatePickerActive] = useState<string|null>(null);
    const [startDate, setStartDate] = useState<Date|null>(null)
    const [endDate, setEndDate] = useState<Date|null>(null)
    const [selectedDate, setSelectedDate] = useState<Date|null>(null)

    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });

    useEffect(() => {

        subText();
    }, [currentFilter]);

    const close = () => {
        setShow(false);
    };

    const subText = function () {
        if(isDesktop && show) return null;

        let key = (currentFilter.runningTime.from+'-'+currentFilter.runningTime.to).replace(/null/g, '');
        const fromDate = Moment.isDate(currentFilter.runningTime.from) ? Moment(currentFilter.runningTime.from).format('DD/MM/YYYY') : '';
        const toDate = Moment.isDate(currentFilter.runningTime.to) ? Moment(currentFilter.runningTime.to).format('DD/MM/YYYY') : '';
        let keyText = (fromDate+' bis '+toDate).replace(/null/g, '');

        if(fromDate + toDate === "") keyText = "";
        else {
            if(fromDate === "") keyText = "bis " + toDate;
            if(toDate === "") keyText = "von " + fromDate;
        }
        if(key === '-') key = '';

        if(stdValues[key]) {
            if(active !== key) setActive(key);
            keyText = stdValues[key].text;
        } else {
            if(active) setActive(null);
            if(startDate !== currentFilter.runningTime.from) setStartDate(currentFilter.runningTime.from);
            if(endDate !== currentFilter.runningTime.to) setEndDate(currentFilter.runningTime.to);
        };

        return keyText;
    }

    const sendFilter = (newFilter: DerivativeFilter) => {
        if(onFilterChange) onFilterChange(newFilter);
        if(onVisbilityChange) onVisbilityChange(false);
    }

    const applyFilter = (key: string|null = null) => {
        trigInfonline(guessInfonlineSection(),'search_result')
        const _active = key ? key : active;
        if(_active === "reset") {
            sendFilter({...currentFilter, runningTime: {from: null, to: null}});
        } else {
            if (!_active) {
                sendFilter({...currentFilter, runningTime: {from: startDate, to: endDate}});
            } else {
                const stdValue = stdValues[_active];
                sendFilter({...currentFilter, runningTime: {from: stdValue.from, to: stdValue.to}});
            }
        }
        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const cancelFilter = () => {
        if(isNaN(currentFilter.runningTime.from?.toString()) && isNaN(currentFilter.runningTime.to?.toString())) {
            setStartDate(currentFilter.runningTime.from);
            setEndDate(currentFilter.runningTime.to);
            setActive(null);
        } else {
            setStartDate(null);
            setEndDate(null);
            setActive(currentFilter.runningTime.from?.toString() + '-' + currentFilter.runningTime.to?.toString());
        }
        subText();
        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const resetFilter = () => {
        applyFilter('reset');
    }

    const content = (
        <>
            <div className="d-flex flex-wrap dropdown-filters">
                {
                    Object.keys(stdValues).map(key =>
                        <ButtonItem key={key} active={active === key}
                                    onClick={() => setActive(active === key ? null : key)}>
                            {stdValues[key].text}
                        </ButtonItem>
                    )
                }
            </div>
            <div className="mt-3 d-flex justify-content-between mx-1">
                <div className="d-flex mr-3">
                    <span>von</span>
                    <Datepicker
                        wrapperClassName="w-50 flex-fill pr-2"
                        className="bg-border-gray border-0 w-100 ml-2 font-size-14px flex-fill"
                        selected={(!active && Moment.isDate(startDate))  ? startDate : null}
                        onChange={(date: any) => {
                            setActive(null);
                            setStartDate(date)
                        }}
                        minDate={null}
                        maxDate={(!active && Moment.isDate(endDate)) ? endDate : null}
                        dateFormat='dd/MM/yyyy'
                        isClearable
                        placeholderText="DD/MM/YYYY"
                        showYearDropdown
                        scrollableMonthYearDropdown
                        readOnly={!isDesktop}
                        onInputClick={()=>{setSelectedDate(startDate); setDatePickerActive('start')}}
                    />
                </div>
                <div className="d-flex">
                    <span>bis</span>
                    <Datepicker
                        wrapperClassName="w-50 flex-fill pr-2"
                        className="bg-border-gray border-0 w-100 ml-2 font-size-14px flex-fill"
                        selected={(!active && Moment.isDate(endDate)) ? endDate : null}
                        onChange={(date: any) => {
                            setActive(null);
                            setEndDate(date)
                        }}
                        minDate={Moment.isDate(startDate) ? startDate : null}
                        maxDate={null}
                        dateFormat='dd/MM/yyyy'
                        isClearable
                        placeholderText="DD/MM/YYYY"
                        showYearDropdown
                        scrollableMonthYearDropdown
                        readOnly={!isDesktop}
                        onInputClick={()=>{setSelectedDate(endDate); setDatePickerActive('end')}}
                    />
                </div>
            </div>
        </>
    );

    return (
        <>
            {
                showButton &&
                <Dropdown show={show && isDesktop} className={className}>
                    <DropdownButton text="Fälligkeit" subText={(show && isDesktop) ? '' : subText()} onClick={() => {
                        if (onClick) onClick();
                        setShow(!show)
                    }} style={{minWidth: 140}} className={subText()?.trim() !== '' ? "active" : ""} />

                    <Dropdown.Menu className="p-2 dropdown-menu-content d-md-block d-none" style={{width: 330}}>
                        <DropdownMenuHeader title="Fälligkeit" close={cancelFilter}/>
                        {content}
                        <DropdownMenuFooter apply={() => applyFilter()} reset={() => resetFilter() }/>
                    </Dropdown.Menu>                </Dropdown>
            }

            {
                showContent && !isDesktop &&
                <>
                    <CSSTransition timeout={250}
                                   classNames={"carusel-modal-right"}
                                   in={(contentActive && !datePickerActive)}>
                        <div className={"container carusel-modal-right"} onClick={(event) => {event.stopPropagation();}}>

                            <div className="d-flex justify-content-between bg-white py-3 pl-3">
                                <span className="font-weight-bold roboto-heading">Fälligkeit</span>
                                <button type="button" className="btn btn-link"
                                        onClick={() => {
                                            cancelFilter();
                                        }}>schließen<SvgCancel></SvgCancel></button>
                            </div>

                            <div className="mx-auto" style={{ width: "330px" }} >
                                {content}
                            </div>


                            <div className="d-flex justify-content-end border-0 bg-white modal-footer">
                                <button type="button" className="pr-0 btn btn-link" onClick={() => applyFilter()}>
                                    <SvgCheck></SvgCheck>Einstellung übernehmen
                                </button>
                            </div>

                        </div>
                    </CSSTransition>

                    <CSSTransition timeout={150}
                                   classNames={"carusel-modal-right"}
                                   in={(contentActive && !(datePickerActive === null))}>
                        <div className={"container carusel-modal-right"} onClick={(event) => {event.stopPropagation();}}>

                            <div className="d-flex justify-content-between bg-white py-3 pl-3">
                                <span className="font-weight-bold roboto-heading">Fälligkeit</span>
                                <button type="button" className="btn btn-link"
                                        onClick={() => {
                                            setDatePickerActive(null)
                                        }}>schließen<SvgCancel></SvgCancel></button>
                            </div>

                            <div className="mx-auto text-center" style={{width: 330}}>
                                <Datepicker
                                    inline={true}
                                    wrapperClassName="w-50 flex-fill"
                                    className="bg-border-gray border-0 w-100 ml-2 font-size-14px flex-fill align-content-center "
                                    selected={selectedDate}
                                    onChange={(date: any) => {setSelectedDate(date)}}
                                    minDate ={(datePickerActive == 'start') ? null : (Moment.isDate(startDate) ? startDate : null)}
                                    dateFormat='dd/MM/yyyy'
                                    isClearable
                                    maxDate={(datePickerActive == 'end') ? new Date() : (Moment.isDate(endDate) ? endDate : new Date())}
                                    placeholderText="DD/MM/YYYY"
                                    showYearDropdown
                                    scrollableMonthYearDropdown
                                />
                            </div>


                            <div className="d-flex justify-content-end border-0 bg-white modal-footer">
                                <button type="button" className="pr-0 btn btn-link" onClick={() => {
                                    if(datePickerActive == 'start') setStartDate(selectedDate);
                                    if(datePickerActive == 'end') setEndDate(selectedDate);
                                    setActive(null);
                                    setDatePickerActive(null);
                                }}>
                                    <SvgCheck></SvgCheck>Einstellung übernehmen
                                </button>
                            </div>

                        </div>
                    </CSSTransition>
                </>
            }
        </>
    );
}

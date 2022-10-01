import {Dropdown} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {DropdownMenuHeader} from "../layout/DropdownMenuHeader";
import {DropdownMenuFooter} from "../layout/DropdownMenuFooter";
import {DropdownButton} from "../layout/DropdownButton";
import {useBootstrapBreakpoint} from "../../../../../hooks/useBootstrapBreakpoint";
import {ButtonItem} from "../layout/ButtonItem";
import {InputItem} from "../layout/InputItem";
import {CSSTransition} from "react-transition-group";
import {SvgCheck} from "../../../../common/svg/svg-check";
import {SvgCancel} from "../../../../common/svg/svg-cancel";
import {VonBisBasePeriod} from "./VonBisBasePeriod";
import {DerivativeFilter} from "../../types/DerivativeSearchTypes";
import {guessInfonlineSection, trigInfonline} from "../../../../common/InfonlineService";

const stdValues: { [key: string]: { from: number | null, to: number | null, text: string }; } = {
    '5-': {
        from: 5,
        to: null,
        text: "stark im Geld (> 5%)"
    },
    '1-5': {
        from: 1,
        to: 5,
        text: "im Geld (1% bis 5%)"
    },
    '-1-1': {
        from: -1,
        to: 1,
        text: "am Geld (-1% bis 1%)"
    },
    '-5--1': {
        from: -5,
        to: -1,
        text: "aus dem Geld (-5% bis -1%)"
    },
    '--5': {
        from: null,
        to: -5,
        text: "stark aus dem Geld (< -5%)"
    },
};

interface UnderlyingFilterProps extends React.HTMLAttributes<HTMLDivElement> {
    currentFilter: DerivativeFilter;
    showButton?: boolean;
    showContent?: boolean;
    contentActive?: boolean;
    onClick?: () => any;
    onFilterChange?: (filter: DerivativeFilter) => any;
    onVisbilityChange?: (isVisible: boolean) => any;
}


export function UnderlyingFilter({currentFilter, showButton, showContent, contentActive, onClick, onFilterChange, onVisbilityChange, className}: UnderlyingFilterProps) {
    const [show, setShow] = useState(false);
    const [base, setBase] = useState<"absolut" | "relativ">(currentFilter.basisprise?.basis);
    const [active, setActive] = useState('');
    const [from, setFrom] = useState<number | null>(currentFilter.basisprise?.period.from);
    const [to, setTo] = useState<number | null>(currentFilter.basisprise?.period.to);
    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });


    useEffect(() => {
        setFrom(currentFilter.basisprise?.period.from);
        setTo(currentFilter.basisprise?.period.from);
        setBase(currentFilter.basisprise?.basis);
        subText();
    }, [currentFilter]);


    const subText = function () {
        if (isDesktop && show) return null;

        const von = currentFilter?.basisprise?.period.from ? 'von ' + currentFilter?.basisprise?.period.from + ' ' : '';
        const bis = currentFilter?.basisprise?.period.to ? 'bis ' + currentFilter?.basisprise?.period.to : '';
        let priseText: string = von + bis + ((von + bis !== "") ? ', ' + currentFilter?.basisprise?.basis : "");

        let osWertText = '';
        const key = (currentFilter?.osWert?.from + '-' + currentFilter?.osWert?.to).replace(/null/g, '');

        if (key !== '-') {
            if (stdValues[key]) {
                if (active !== key) setActive(key);
                osWertText = stdValues[key].text;
            }
        }

        return osWertText ? osWertText : priseText;
    }

    const close = () => {
        setShow(false);
    };

    const isActiveSelected = () => {
        return active && active.length > 0 && active !== "any";
    }

    const sendFilter = (newFilter: DerivativeFilter) => {
        if (onFilterChange) onFilterChange(newFilter);
        if (onVisbilityChange) onVisbilityChange(false);
    }

    const applyFilter = (from: number | null, to: number | null, filter: string, base: "absolut" | "relativ") => {
      trigInfonline(guessInfonlineSection(),'search_result')
        sendFilter({
            ...currentFilter,
            basisprise: {
                period: isActiveSelected() ? {from: null, to: null} : {from: from, to: to},
                basis: base
            },
            osWert: isActiveSelected() ? {from: stdValues[filter]?.from, to: stdValues[filter]?.to} : {from: null, to: null}
        });
        close();
    }

    const cancelFilter = () => {
        setFrom(currentFilter.basisprise?.period.from);
        setTo(currentFilter.basisprise?.period.to);
        setBase(currentFilter.basisprise?.basis);
        subText();

        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const resetFilter = () => {
        setFrom(null);
        setTo(null);
        setBase('absolut');
        setActive('');
        applyFilter(null, null, '', 'absolut');
        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const content = (
        <>
            <div style={{position: "relative"}}>
                {
                    isActiveSelected() &&
                    <div style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: "0.5", backgroundColor: "white", display: "block"}}></div>
                }

                <VonBisBasePeriod title={'Basispreis'} currentFilter={currentFilter.basisprise}
                                  onFilterChange={(newValue) => {
                                      setFrom(newValue.period.from);
                                      setTo(newValue.period.to);
                                      setBase(newValue.basis);
                                  }}/>
            </div>


            <div className="mt-4 px-1">
                <span className="font-weight-bold px-1">OS Wert</span>
                <div className="d-flex flex-column">
                    {
                        Object.keys(stdValues).map((key) =>
                            <ButtonItem key={key} className="justify-content-center"
                                        onClick={() => {
                                            setActive((key === active) ? 'any' : key);
                                        }}
                                        active={key === active}>{stdValues[key].text}</ButtonItem>
                        )
                    }
                </div>
            </div>
        </>
    );

    return (
        <>
            {
                showButton &&
                <Dropdown show={show && isDesktop} className={className}>
                    <DropdownButton text="Basispreis / OS Wert" subText={subText()} onClick={() => {
                        if (onClick) onClick();
                        setShow(!show)
                    }} style={{minWidth: 200}} className={subText()?.trim() !== '' ? "active" : ""} />

                    <Dropdown.Menu className="p-2 dropdown-menu-content d-md-block d-none" style={{width: 330}}>
                        <DropdownMenuHeader title="Basispreis / OS Wert" close={() => cancelFilter()}/>
                        {content}
                        <DropdownMenuFooter apply={() => applyFilter(from, to, active, base)} reset={() => resetFilter()}/>
                    </Dropdown.Menu>
                </Dropdown>
            }
            {
                showContent && !isDesktop &&
                <CSSTransition timeout={250}
                               classNames={"carusel-modal-right"}
                               in={contentActive}>
                    <div className={"container carusel-modal-right"} onClick={(event) => {
                        event.stopPropagation();
                    }}>

                        <div className="d-flex justify-content-between bg-white py-3 pl-3">
                            <span className="font-weight-bold roboto-heading">Basispreis / OS Wert</span>
                            <button type="button" className="btn btn-link"
                                    onClick={() => {
                                        cancelFilter();
                                    }}>schließen<SvgCancel></SvgCancel></button>
                        </div>

                        <div className="mx-auto" style={{width: "330px"}}>
                            {content}
                        </div>


                        <div className="d-flex justify-content-end border-0 bg-white modal-footer">
                            <button type="button" className="pr-0 btn btn-link"
                                    onClick={() => applyFilter(from, to, active, base)}>
                                <SvgCheck></SvgCheck>Einstellung übernehmen
                            </button>
                        </div>

                    </div>
                </CSSTransition>
            }
        </>
    );
}

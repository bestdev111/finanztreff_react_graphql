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
import {filter} from "underscore";
import {VonBisBasePeriod} from "./VonBisBasePeriod";
import {DerivativeFilter} from "../../types/DerivativeSearchTypes";

interface ExpressAbstandBarriereFilterProps extends React.HTMLAttributes<HTMLDivElement> {
    currentFilter: DerivativeFilter;
    showButton?: boolean;
    showContent?: boolean;
    contentActive?: boolean;
    onClick?: () => any;
    onFilterChange?: (filter: DerivativeFilter) => any;
    onVisbilityChange?: (isVisible: boolean) => any;
}


export function ExpressAbstandBarriereFilter({
                              currentFilter,
                              showButton,
                              showContent,
                              contentActive,
                              onClick,
                              onFilterChange,
                              onVisbilityChange,
                              className
                          }: ExpressAbstandBarriereFilterProps) {
    const [show, setShow] = useState(false);
    const [capBase, setCapBase] = useState<"absolut" | "relativ">(currentFilter.cap.basis || 'absolut');
    const [capFrom, setCapFrom] = useState<number | null>(currentFilter.cap.period.from);
    const [capTo, setCapTo] = useState<number | null>(currentFilter.cap.period.to);
    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });

    useEffect(() => {
        setCapBase(currentFilter.cap.basis);
        setCapFrom(currentFilter.cap.period.from);
        setCapTo(currentFilter.cap.period.to);

        let _active: any = undefined;
        if (currentFilter.basisprise.period.from || currentFilter.basisprise.period.to) _active = "price";
        if (currentFilter.cap.period.from || currentFilter.cap.period.to) _active = "cap";
    }, [currentFilter]);

    const subText = function () {
        if (isDesktop && show) return null;

        const von = currentFilter?.cap?.period.from ? 'von ' + currentFilter?.cap?.period.from + ' ' : '';
        const bis = currentFilter?.cap?.period.to ? 'bis ' + currentFilter?.cap?.period.to : '';
        let capPriseText: string = von + bis + ((von + bis !== "") ? ', ' + currentFilter?.cap?.basis : "");


        return capPriseText;
    }

    const close = () => {
        setShow(false);
        if (onVisbilityChange) onVisbilityChange(false);
    };

    const applyFilter = (capFrom: number | null, capTo: number | null, capBase: 'absolut' | 'relativ') => {
        if (onFilterChange) onFilterChange({
            ...currentFilter,
            cap: {
                period: {from: capFrom, to: capTo}, basis: capBase
            }
        });
        close();
    }

    const cancelFilter = () => {
        setCapFrom(currentFilter.cap.period.from);
        setCapTo(currentFilter.cap.period.to);
        setCapBase(currentFilter.cap.basis);
        subText();

        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const resetFilter = () => {
        setCapFrom(null);
        setCapTo(null);
        setCapBase('absolut');
        applyFilter(null, null, 'absolut');
        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const content = (
        <>
            <div className="bg-white d-block">
                <VonBisBasePeriod title={''} currentFilter={currentFilter.cap}
                                  onFilterChange={(newValue) => {
                                      setCapFrom(newValue.period.from);
                                      setCapTo(newValue.period.to);
                                      setCapBase(newValue.basis);
                                  }}/>
            </div>
        </>
    );

    return (
        <>
            {
                showButton &&
                <Dropdown show={show && isDesktop} className={className}>
                    <DropdownButton text="Abstand Barriere %" subText={subText()} onClick={() => {
                        if (onClick) onClick();
                        setShow(!show)
                    }} style={{minWidth: 180}} className={subText()?.trim() !== '' ? "active" : ""} />

                    <Dropdown.Menu className="p-2 dropdown-menu-content d-md-block d-none" style={{width: 330}}>
                        <DropdownMenuHeader title="Abstand Barriere %" close={() => cancelFilter()}/>
                        {content}
                        <DropdownMenuFooter apply={() => applyFilter(capFrom, capTo, capBase)} reset={() => resetFilter()}/>
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
                            <span className="font-weight-bold roboto-heading">Abstand Barriere %</span>
                            <button type="button" className="btn btn-link"
                                    onClick={() => {
                                        cancelFilter();
                                    }}>schließen<SvgCancel></SvgCancel></button>
                        </div>

                        <div className="mx-auto">
                            {content}
                        </div>


                        <div className="d-flex justify-content-end border-0 bg-white modal-footer">
                            <button type="button" className="pr-0 btn btn-link"
                                    onClick={() => applyFilter(capFrom, capTo, capBase)}>
                                <SvgCheck></SvgCheck>Einstellung übernehmen
                            </button>
                        </div>

                    </div>
                </CSSTransition>
            }
        </>
    );
}

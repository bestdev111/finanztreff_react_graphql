import {Dropdown} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {DropdownMenuHeader} from "../layout/DropdownMenuHeader";
import {DropdownMenuFooter} from "../layout/DropdownMenuFooter";
import {DropdownButton} from "../layout/DropdownButton";
import {useBootstrapBreakpoint} from "../../../../../hooks/useBootstrapBreakpoint";
import {CSSTransition} from "react-transition-group";
import {SvgCheck} from "../../../../common/svg/svg-check";
import {SvgCancel} from "../../../../common/svg/svg-cancel";
import {VonBisBasePeriod} from "./VonBisBasePeriod";
import {DerivativeFilter, FilterVonBisBasePeriod} from "../../types/DerivativeSearchTypes";

interface PerformanceFilterProps extends React.HTMLAttributes<HTMLDivElement> {
    currentFilter: DerivativeFilter;
    showButton?: boolean;
    showContent?: boolean;
    contentActive?: boolean;
    onClick?: () => any;
    onFilterChange?: (filter: DerivativeFilter) => any;
    onVisbilityChange?: (isVisible: boolean) => any;
}


export function PerformanceFilter({
                                      currentFilter,
                                      showButton,
                                      showContent,
                                      contentActive,
                                      onClick,
                                      onFilterChange,
                                      onVisbilityChange,
                                      className
                                  }: PerformanceFilterProps) {
    const [show, setShow] = useState(false);
    const [from, setFrom] = useState<number | null>(currentFilter.performance?.from);
    const [to, setTo] = useState<number | null>(currentFilter.performance?.to);
    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });

    useEffect(() => {
        setFrom(currentFilter.performance.from);
        setTo(currentFilter.performance.to);
    }, [currentFilter]);

    const subText = function () {
        if (isDesktop && show) return null;

        let von = currentFilter?.performance?.from ? 'von ' + currentFilter?.performance?.from + ' ' : '';
        let bis = currentFilter?.performance?.to ? 'bis ' + currentFilter?.performance?.to : '';
        let obenPriseText: string = von + bis;

        return obenPriseText;
    }

    const close = () => {
        setShow(false);
        if (onVisbilityChange) onVisbilityChange(false);
    };

    const applyFilter = (from: number | null, to: number | null) => {
        if (onFilterChange) onFilterChange({
            ...currentFilter,
            performance: {from: from, to: to}
        });
        close();
    }

    const cancelFilter = () => {
        setFrom(currentFilter.performance?.from);
        setTo(currentFilter.performance?.to);
        subText();

        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const resetFilter = () => {
        setFrom(null);
        setTo(null);
        applyFilter(null, null);
        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const content = (
        <>
            <div className="bg-white d-block mb-3">
                <VonBisBasePeriod title={''}
                                  withBase={false}
                                  currentFilter={{
                                      period: {
                                          from: from,
                                          to: to,
                                      },
                                      basis: 'absolut'
                                  } as FilterVonBisBasePeriod}
                                  onFilterChange={(newValue) => {
                                      setFrom(newValue.period.from);
                                      setTo(newValue.period.to);
                                  }}/>
            </div>
        </>
    );

    return (
        <>
            {
                showButton &&
                <Dropdown show={show && isDesktop} className={className}>
                    <DropdownButton text="Performance (1M)" subText={subText()} onClick={() => {
                        if (onClick) onClick();
                        setShow(!show)
                    }} style={{minWidth: 180}} className={subText()?.trim() !== '' ? "active" : ""} />

                    <Dropdown.Menu className="p-2 dropdown-menu-content d-md-block d-none" style={{width: 330}}>
                        <DropdownMenuHeader title="Performance (1M)" close={() => cancelFilter()}/>
                        {content}
                        <DropdownMenuFooter apply={() => applyFilter(from, to)} reset={() => resetFilter()}/>
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
                            <span className="font-weight-bold roboto-heading">Performance (1M)</span>
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
                                    onClick={() => applyFilter(from, to)}>
                                <SvgCheck></SvgCheck>Einstellung übernehmen
                            </button>
                        </div>

                    </div>
                </CSSTransition>
            }
        </>
    );
}

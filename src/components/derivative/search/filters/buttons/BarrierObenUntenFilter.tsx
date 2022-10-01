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
import {DerivativeFilter} from "../../types/DerivativeSearchTypes";

interface BarrierObenUntenFilterProps extends React.HTMLAttributes<HTMLDivElement> {
    currentFilter: DerivativeFilter;
    showButton?: boolean;
    showContent?: boolean;
    contentActive?: boolean;
    onClick?: () => any;
    onFilterChange?: (filter: DerivativeFilter) => any;
    onVisbilityChange?: (isVisible: boolean) => any;
}


export function BarrierObenUntenFilter({
                                           currentFilter,
                                           showButton,
                                           showContent,
                                           contentActive,
                                           onClick,
                                           onFilterChange,
                                           onVisbilityChange,
                                           className
                                       }: BarrierObenUntenFilterProps) {
    const [show, setShow] = useState(false);
    const [obenBase, setObenBase] = useState<"absolut" | "relativ">(currentFilter.oben.basis || 'absolut');
    const [obenFrom, setObenFrom] = useState<number | null>(currentFilter.oben.period.from);
    const [obenTo, setObenTo] = useState<number | null>(currentFilter.oben.period.to);
    const [untenBase, setUntenBase] = useState<"absolut" | "relativ">(currentFilter.unten.basis || 'absolut');
    const [untenFrom, setUntenFrom] = useState<number | null>(currentFilter.unten.period.from);
    const [untenTo, setUntenTo] = useState<number | null>(currentFilter.unten.period.to);
    const [active, setActive] = useState<"oben" | "unten" | undefined>(undefined);
    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });

    useEffect(() => {
        setObenBase(currentFilter.oben.basis);
        setObenFrom(currentFilter.oben.period.from);
        setObenTo(currentFilter.oben.period.to);

        setUntenBase(currentFilter.unten.basis);
        setUntenFrom(currentFilter.unten.period.from);
        setUntenTo(currentFilter.unten.period.to);

        let _active: any = undefined;
        if (currentFilter.oben.period.from || currentFilter.oben.period.to) _active = "oben";
        if (currentFilter.unten.period.from || currentFilter.unten.period.to) _active = "unten";
        setActive(_active);

    }, [currentFilter]);

    const subText = function () {
        if (isDesktop && show) return null;

        let von = currentFilter?.oben?.period.from ? 'von ' + currentFilter?.oben?.period.from + ' ' : '';
        let bis = currentFilter?.oben?.period.to ? 'bis ' + currentFilter?.oben?.period.to : '';
        let obenPriseText: string = von + bis + ((von + bis !== "") ? ', ' + currentFilter?.oben?.basis : "");
        if (obenPriseText.length > 0) {
            obenPriseText = 'oben: ' + obenPriseText + " ";
            if (!active) setActive("oben");
        }

        von = currentFilter?.unten?.period.from ? 'von ' + currentFilter?.unten?.period.from + ' ' : '';
        bis = currentFilter?.unten?.period.to ? 'bis ' + currentFilter?.unten?.period.to : '';
        let untenPriseText: string = von + bis + ((von + bis !== "") ? ', ' + currentFilter?.unten?.basis : "");
        if (untenPriseText.length > 0) {
            untenPriseText = 'unten: ' + untenPriseText + " ";
            if (!active) setActive("unten");
        }


        return obenPriseText + untenPriseText;
    }

    const close = () => {
        setShow(false);
        if (onVisbilityChange) onVisbilityChange(false);
    };

    const applyFilter = (obenFrom: number | null, obenTo: number | null, obenBase: 'absolut' | 'relativ',
                         untenFrom: number | null, untenTo: number | null, untenBase: 'absolut' | 'relativ') => {
        if (onFilterChange) onFilterChange({
            ...currentFilter,
            oben: {
                period: {from: obenFrom, to: obenTo}, basis: obenBase
            },
            unten: {
                period: {from: untenFrom, to: untenTo}, basis: untenBase
            }
        });
        close();
    }

    const cancelFilter = () => {
        setObenFrom(currentFilter.oben.period.from);
        setObenTo(currentFilter.oben.period.to);
        setObenBase(currentFilter.oben.basis);
        setUntenFrom(currentFilter.unten.period.from);
        setUntenTo(currentFilter.unten.period.to);
        setUntenBase(currentFilter.unten.basis);
        subText();

        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const resetFilter = () => {
        setObenFrom(null);
        setObenTo(null);
        setObenBase('absolut');
        setUntenFrom(null);
        setUntenTo(null);
        setUntenBase('absolut');
        setActive("oben");
        applyFilter(null, null, 'absolut', null, null, 'absolut');
        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const content = (
        <>
            <div className="bg-white d-block mb-3" style={{opacity: active !== "unten" ? 1 : 0.5}}>
                <VonBisBasePeriod title={'Oben'} currentFilter={currentFilter.oben}
                                  onFilterChange={(newValue) => {
                                      setObenFrom(newValue.period.from);
                                      setObenTo(newValue.period.to);
                                      setObenBase(newValue.basis);

                                      setUntenFrom(null);
                                      setUntenTo(null);
                                      setUntenBase("absolut");

                                      setActive("oben");
                                  }}/>
            </div>

            <div className="bg-white d-block" style={{opacity: active !== "oben" ? 1 : 0.5}}>
                <VonBisBasePeriod title={'Unten'} currentFilter={currentFilter.unten}
                                  onFilterChange={(newValue) => {
                                      setUntenFrom(newValue.period.from);
                                      setUntenTo(newValue.period.to);
                                      setUntenBase(newValue.basis);

                                      setObenFrom(null);
                                      setObenTo(null);
                                      setObenBase("absolut");

                                      setActive("unten");
                                  }}/>
            </div>
        </>
    );

    return (
        <>
            {
                showButton &&
                <Dropdown show={show && isDesktop} className={className}>
                    <DropdownButton text="Barriere oben/unten" subText={subText()} onClick={() => {
                        if (onClick) onClick();
                        setShow(!show)
                    }} style={{minWidth: 180}} className={subText()?.trim() !== '' ? "active" : ""} />

                    <Dropdown.Menu className="p-2 dropdown-menu-content d-md-block d-none" style={{width: 330}}>
                        <DropdownMenuHeader title="Barriere oben/unten" close={() => cancelFilter()}/>
                        {content}
                        <DropdownMenuFooter apply={() => applyFilter(obenFrom, obenTo, obenBase, untenFrom, untenTo, untenBase)} reset={() => resetFilter()}/>
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
                            <span className="font-weight-bold roboto-heading">Barriere oben/unten</span>
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
                                    onClick={() => applyFilter(obenFrom, obenTo, obenBase, untenFrom, untenTo, untenBase)}>
                                <SvgCheck></SvgCheck>Einstellung übernehmen
                            </button>
                        </div>

                    </div>
                </CSSTransition>
            }
        </>
    );
}

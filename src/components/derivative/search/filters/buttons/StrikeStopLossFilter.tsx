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

interface StrikeStopLossFilterProps extends React.HTMLAttributes<HTMLDivElement> {
    currentFilter: DerivativeFilter;
    showButton?: boolean;
    showContent?: boolean;
    contentActive?: boolean;
    onClick?: () => any;
    onFilterChange?: (filter: DerivativeFilter) => any;
    onVisbilityChange?: (isVisible: boolean) => any;
}


export function StrikeStopLossFilter({
                                         currentFilter,
                                         showButton,
                                         showContent,
                                         contentActive,
                                         onClick,
                                         onFilterChange,
                                         onVisbilityChange,
                                         className
                                     }: StrikeStopLossFilterProps) {
    const [show, setShow] = useState(false);
    const [strikeBase, setStrikeBase] = useState<"absolut" | "relativ">('absolut');
    const [strikeFrom, setStrikeFrom] = useState<number | null>(null);
    const [strikeTo, setStrikeTo] = useState<number | null>(null);
    const [stopLossBase, setStopLossBase] = useState<"absolut" | "relativ">('absolut');
    const [stopLossFrom, setStopLossFrom] = useState<number | null>(null);
    const [stopLossTo, setStopLossTo] = useState<number | null>(null);
    const [active, setActive] = useState<"strike" | "stoploss" | undefined>(undefined);

    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });

    useEffect(() => {
        setStrikeBase(currentFilter.basisprise.basis);
        setStrikeFrom(currentFilter.basisprise.period.from);
        setStrikeTo(currentFilter.basisprise.period.to);

        setStopLossBase(currentFilter.stopLoss.basis);
        setStopLossFrom(currentFilter.stopLoss.period.from);
        setStopLossTo(currentFilter.stopLoss.period.to);

        let _active: any = undefined;
        if (currentFilter.basisprise.period.from || currentFilter.basisprise.period.to) _active = "strike";
        if (currentFilter.stopLoss.period.from || currentFilter.stopLoss.period.to) _active = "stoploss";
        setActive(_active);

    }, [currentFilter]);

    const subText = function () {
        if (isDesktop && show) return null;

        let von = currentFilter?.basisprise?.period.from ? 'von ' + currentFilter?.basisprise?.period.from + ' ' : '';
        let bis = currentFilter?.basisprise?.period.to ? 'bis ' + currentFilter?.basisprise?.period.to : '';
        let strikePriseText: string = von + bis + ((von + bis !== "") ? ', ' + currentFilter?.basisprise?.basis : "");
        if (strikePriseText.length > 0) {
            strikePriseText = 'strike: ' + strikePriseText + " ";
            if (!active) setActive("strike");
        }

        von = currentFilter?.stopLoss?.period.from ? 'von ' + currentFilter?.stopLoss?.period.from + ' ' : '';
        bis = currentFilter?.stopLoss?.period.to ? 'bis ' + currentFilter?.stopLoss?.period.to : '';
        let stopLossPriseText: string = von + bis + ((von + bis !== "") ? ', ' + currentFilter?.stopLoss?.basis : "");
        if (stopLossPriseText.length > 0) {
            stopLossPriseText = 'stopLoss: ' + stopLossPriseText + " ";
            if (!active) setActive("stoploss");
        }

        return active === "strike" ? strikePriseText : stopLossPriseText;
    }

    const close = () => {
        setShow(false);
        if (onVisbilityChange) onVisbilityChange(false);
    };

    const applyFilter = (strikeFrom: number | null, strikeTo: number | null, strikeBase: 'absolut' | 'relativ',
                         stopLossFrom: number | null, stopLossTo: number | null, stopLossBase: 'absolut' | 'relativ') => {
        if (onFilterChange) onFilterChange({
            ...currentFilter,
            basisprise: active === "strike" ?
                {period: {from: strikeFrom, to: strikeTo}, basis: strikeBase} :
                {period: {from: null, to: null}, basis: "absolut"},
            stopLoss: active === "stoploss" ?
                {period: {from: stopLossFrom, to: stopLossTo}, basis: stopLossBase} :
                {period: {from: null, to: null}, basis: "absolut"},
        });
        close();
    }

    const cancelFilter = () => {
        setStrikeFrom(currentFilter.basisprise.period.from);
        setStrikeTo(currentFilter.basisprise.period.to);
        setStrikeBase(currentFilter.basisprise.basis);
        setStopLossFrom(currentFilter.stopLoss.period.from);
        setStopLossTo(currentFilter.stopLoss.period.to);
        setStopLossBase(currentFilter.stopLoss.basis);
        subText();

        close();
    }

    const resetFilter = () => {
        setStrikeFrom(null);
        setStrikeTo(null);
        setStrikeBase('absolut');
        setStopLossFrom(null);
        setStopLossTo(null);
        setStopLossBase('absolut');
        setActive("strike");
        applyFilter(null, null, 'absolut', null, null, 'absolut');

        close();
    }

    const content = (
        <>
            <div className="mb-3 bg-white d-block" style={{opacity: active !== "stoploss" ? 1 : 0.5}}>
                <VonBisBasePeriod title={'Strike'} currentFilter={{period: {from: strikeFrom, to: strikeTo}, basis: strikeBase}}
                                  onFilterChange={(newValue) => {
                                      setStrikeFrom(newValue.period.from);
                                      setStrikeTo(newValue.period.to);
                                      setStrikeBase(newValue.basis);

                                      setStopLossFrom(null);
                                      setStopLossTo(null);
                                      setStopLossBase("absolut");

                                      setActive("strike");
                                  }}/>
            </div>

            <div className="bg-white d-block" style={{opacity: active !== "strike" ? 1 : 0.5}}>
                <VonBisBasePeriod title={'StopLoss'} currentFilter={{period: {from: stopLossFrom, to: stopLossTo}, basis: stopLossBase}}
                                  onFilterChange={(newValue) => {
                                      setStopLossFrom(newValue.period.from);
                                      setStopLossTo(newValue.period.to);
                                      setStopLossBase(newValue.basis);

                                      setStrikeFrom(null);
                                      setStrikeTo(null);
                                      setStrikeBase("absolut");

                                      setActive("stoploss");
                                  }}/>
            </div>
        </>
    );

    return (
        <>
            {
                showButton &&
                <Dropdown show={show && isDesktop} className={className}>
                    <DropdownButton text="Strike/Stop Loss" subText={subText()} onClick={() => {
                        if (onClick) onClick();
                        setShow(!show)
                    }} style={{minWidth: 180}} className={subText()?.trim() !== '' ? "active" : ""} />

                    <Dropdown.Menu className="p-2 dropdown-menu-content d-md-block d-none" style={{width: 330}}>
                        <DropdownMenuHeader title="Strike/Stop Loss" close={() => cancelFilter()}/>
                        {content}
                        <DropdownMenuFooter apply={() => applyFilter(strikeFrom, strikeTo, strikeBase, stopLossFrom, stopLossTo, stopLossBase)} reset={() => resetFilter()}/>
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
                            <span className="font-weight-bold roboto-heading">Barriere strike/stopLoss</span>
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
                                    onClick={() => applyFilter(strikeFrom, strikeTo, strikeBase, stopLossFrom, stopLossTo, stopLossBase)}>
                                <SvgCheck></SvgCheck>Einstellung übernehmen
                            </button>
                        </div>

                    </div>
                </CSSTransition>
            }
        </>
    );
}

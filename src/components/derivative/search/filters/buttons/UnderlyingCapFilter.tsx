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

interface CapFilterProps extends React.HTMLAttributes<HTMLDivElement> {
    currentFilter: DerivativeFilter;
    showButton?: boolean;
    showContent?: boolean;
    contentActive?: boolean;
    onClick?: () => any;
    onFilterChange?: (filter: DerivativeFilter) => any;
    onVisbilityChange?: (isVisible: boolean) => any;
}


export function CapFilter({
                              currentFilter,
                              showButton,
                              showContent,
                              contentActive,
                              onClick,
                              onFilterChange,
                              onVisbilityChange,
                              className
                          }: CapFilterProps) {
    const [show, setShow] = useState(false);
    const [priceBase, setPriceBase] = useState<"absolut" | "relativ">(currentFilter.basisprise.basis || 'absolut');
    const [priceFrom, setPriceFrom] = useState<number | null>(currentFilter.basisprise.period.from);
    const [priceTo, setPriceTo] = useState<number | null>(currentFilter.basisprise.period.to);
    const [capBase, setCapBase] = useState<"absolut" | "relativ">(currentFilter.cap.basis || 'absolut');
    const [capFrom, setCapFrom] = useState<number | null>(currentFilter.cap.period.from);
    const [capTo, setCapTo] = useState<number | null>(currentFilter.cap.period.to);
    const [active, setActive] = useState<"price" | "cap" | undefined>(undefined);
    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });

    useEffect(() => {
        setPriceBase(currentFilter.basisprise.basis);
        setPriceFrom(currentFilter.basisprise.period.from);
        setPriceTo(currentFilter.basisprise.period.to);

        setCapBase(currentFilter.cap.basis);
        setCapFrom(currentFilter.cap.period.from);
        setCapTo(currentFilter.cap.period.to);

        let _active: any = undefined;
        if (currentFilter.basisprise.period.from || currentFilter.basisprise.period.to) _active = "price";
        if (currentFilter.cap.period.from || currentFilter.cap.period.to) _active = "cap";
        setActive(_active);

    }, [currentFilter]);

    const subText = function () {
        if (isDesktop && show) return null;

        let von = currentFilter?.basisprise?.period.from ? 'von ' + currentFilter?.basisprise?.period.from + ' ' : '';
        let bis = currentFilter?.basisprise?.period.to ? 'bis ' + currentFilter?.basisprise?.period.to : '';
        let pricePriseText: string = von + bis + ((von + bis !== "") ? ', ' + currentFilter?.basisprise?.basis : "");
        if (pricePriseText.length > 0) {
            pricePriseText = 'price: ' + pricePriseText + " ";
            if (!active) setActive("price");
        }

        von = currentFilter?.cap?.period.from ? 'von ' + currentFilter?.cap?.period.from + ' ' : '';
        bis = currentFilter?.cap?.period.to ? 'bis ' + currentFilter?.cap?.period.to : '';
        let capPriseText: string = von + bis + ((von + bis !== "") ? ', ' + currentFilter?.cap?.basis : "");
        if (capPriseText.length > 0) {
            capPriseText = 'cap: ' + capPriseText + " ";
            if (!active) setActive("cap");
        }


        return pricePriseText + capPriseText;
    }

    const close = () => {
        setShow(false);
        if (onVisbilityChange) onVisbilityChange(false);
    };

    const applyFilter = (priceFrom: number | null, priceTo: number | null, priceBase: 'absolut' | 'relativ',
                         capFrom: number | null, capTo: number | null, capBase: 'absolut' | 'relativ') => {
        if (onFilterChange) onFilterChange({
            ...currentFilter,
            basisprise: {
                period: {from: priceFrom, to: priceTo}, basis: priceBase
            },
            cap: {
                period: {from: capFrom, to: capTo}, basis: capBase
            }
        });
        close();
    }

    const cancelFilter = () => {
        setPriceFrom(currentFilter.basisprise.period.from);
        setPriceTo(currentFilter.basisprise.period.to);
        setPriceBase(currentFilter.basisprise.basis);
        setCapFrom(currentFilter.cap.period.from);
        setCapTo(currentFilter.cap.period.to);
        setCapBase(currentFilter.cap.basis);
        subText();

        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const resetFilter = () => {
        setPriceFrom(null);
        setPriceTo(null);
        setPriceBase('absolut');
        setCapFrom(null);
        setCapTo(null);
        setCapBase('absolut');
        setActive("price");
        applyFilter(null, null, 'absolut', null, null, 'absolut');
        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const content = (
        <>
            <div className="bg-white d-block mb-3" style={{opacity: active !== "cap" ? 1 : 0.5}}>
                <VonBisBasePeriod title={'Basispreis'} currentFilter={currentFilter.basisprise}
                                  onFilterChange={(newValue) => {
                                      setPriceFrom(newValue.period.from);
                                      setPriceTo(newValue.period.to);
                                      setPriceBase(newValue.basis);

                                      setCapFrom(null);
                                      setCapTo(null);
                                      setCapBase("absolut");

                                      setActive("price");
                                  }}/>
            </div>

            <div className="bg-white d-block" style={{opacity: active !== "price" ? 1 : 0.5}}>
                <VonBisBasePeriod title={'Cap'} currentFilter={currentFilter.cap}
                                  onFilterChange={(newValue) => {
                                      setCapFrom(newValue.period.from);
                                      setCapTo(newValue.period.to);
                                      setCapBase(newValue.basis);

                                      setPriceFrom(null);
                                      setPriceTo(null);
                                      setPriceBase("absolut");

                                      setActive("cap");
                                  }}/>
            </div>
        </>
    );

    return (
        <>
            {
                showButton &&
                <Dropdown show={show && isDesktop} className={className}>
                    <DropdownButton text="Basispreis/cap" subText={subText()} onClick={() => {
                        if (onClick) onClick();
                        setShow(!show)
                    }} style={{minWidth: 180}} className={subText()?.trim() !== '' ? "active" : ""} />

                    <Dropdown.Menu className="p-2 dropdown-menu-content d-md-block d-none" style={{width: 330}}>
                        <DropdownMenuHeader title="Basispreis/cap" close={() => cancelFilter()}/>
                        {content}
                        <DropdownMenuFooter apply={() => applyFilter(priceFrom, priceTo, priceBase, capFrom, capTo, capBase)} reset={() => resetFilter()}/>
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
                            <span className="font-weight-bold roboto-heading">Basispreis/cap</span>
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
                                    onClick={() => applyFilter(priceFrom, priceTo, priceBase, capFrom, capTo, capBase)}>
                                <SvgCheck></SvgCheck>Einstellung übernehmen
                            </button>
                        </div>

                    </div>
                </CSSTransition>
            }
        </>
    );
}

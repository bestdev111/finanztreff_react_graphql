import {Dropdown} from "react-bootstrap";
import React, {useState} from "react";
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

interface HitSchwelleFilterProps extends React.HTMLAttributes<HTMLDivElement> {
    currentFilter: DerivativeFilter;
    showButton?: boolean;
    showContent?: boolean;
    contentActive?: boolean;
    onClick?: () => any;
    onFilterChange?: (filter: DerivativeFilter) => any;
    onVisbilityChange?: (isVisible: boolean) => any;
}


export function HitSchwelleFilter({currentFilter, showButton, showContent, contentActive, onClick, onFilterChange, onVisbilityChange, className}: HitSchwelleFilterProps) {
    const [show, setShow] = useState(false);
    const [base, setBase] = useState<"absolut" | "relativ">('absolut');
    const [active, setActive] = useState('');
    const [from, setFrom] = useState<number | null>(null);
    const [to, setTo] = useState<number | null>(null);
    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });

    const subText = function () {
        if (isDesktop && show) return null;

        const von = currentFilter?.hitSchwelle?.period.from ? 'von ' + currentFilter?.hitSchwelle?.period.from + ' ' : '';
        const bis = currentFilter?.hitSchwelle?.period.to ? 'bis ' + currentFilter?.hitSchwelle?.period.to : '';
        let priseText: string = von + bis + ((von + bis !== "") ? ', ' + currentFilter?.hitSchwelle?.basis : "");

        return priseText;
    }

    const close = () => {
        setShow(false);
        if (onVisbilityChange) onVisbilityChange(false);
    };

    const applyFilter = (from: number | null, to: number | null, filter: string) => {
        if(onFilterChange) onFilterChange({...currentFilter, hitSchwelle: {period: {from: from, to: to}, basis: 'absolut'}});
        close();
    }

    const cancelFilter = () => {
        setFrom(currentFilter.hitSchwelle.period.from);
        setTo(currentFilter.hitSchwelle.period.to);
        setBase(currentFilter.hitSchwelle.basis);
        subText();

        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const resetFilter = () => {
        setFrom(null);
        setTo(null);
        applyFilter(null, null, 'absolute');
        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const content = (
            <VonBisBasePeriod title={''} currentFilter={currentFilter.hitSchwelle}
                              onFilterChange={(newValue) => {
                                  setFrom(newValue.period.from);
                                  setTo(newValue.period.to);
                                  setBase(newValue.basis);
                              }}/>
        )
    ;

    return (
        <>
            {
                showButton &&
                <Dropdown show={show && isDesktop} className={className}>
                    <DropdownButton text="Hit-Schwelle" subText={subText()} onClick={() => {
                        if (onClick) onClick();
                        setShow(!show)
                    }} style={{minWidth: 150}}/>

                    <Dropdown.Menu className="p-2 dropdown-menu-content d-md-block d-none" style={{width: 330}}>
                        <DropdownMenuHeader title="Hit-Schwelle" close={() => cancelFilter()}/>
                        {content}
                        <DropdownMenuFooter apply={() => applyFilter(from, to, base)} reset={() => resetFilter()}/>
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
                            <span className="font-weight-bold roboto-heading">Hit-Schwelle</span>
                            <button type="button" className="btn btn-link"
                                    onClick={() => {
                                        cancelFilter();
                                    }}>schließen<SvgCancel></SvgCancel></button>
                        </div>

                        <div className="mx-auto" style={{width: "150px"}}>
                            {content}
                        </div>


                        <div className="d-flex justify-content-end border-0 bg-white modal-footer">
                            <button type="button" className="pr-0 btn btn-link"
                                    onClick={() => applyFilter(from, to, base)}>
                                <SvgCheck></SvgCheck>Einstellung übernehmen
                            </button>
                        </div>

                    </div>
                </CSSTransition>
            }
        </>
    );
}

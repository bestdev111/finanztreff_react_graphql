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

interface BonuslevelBarriereFilterProps extends React.HTMLAttributes<HTMLDivElement> {
    currentFilter: DerivativeFilter;
    showButton?: boolean;
    showContent?: boolean;
    contentActive?: boolean;
    onClick?: () => any;
    onFilterChange?: (filter: DerivativeFilter) => any;
    onVisbilityChange?: (isVisible: boolean) => any;
}


export function BonuslevelBarriereFilter({
                                           currentFilter,
                                           showButton,
                                           showContent,
                                           contentActive,
                                           onClick,
                                           onFilterChange,
                                           onVisbilityChange,
                                           className
                                       }: BonuslevelBarriereFilterProps) {
    const [show, setShow] = useState(false);
    const [bonusLevelBase, setBonusLevelBase] = useState<"absolut" | "relativ">(currentFilter.bonusLevel.basis || 'absolut');
    const [bonusLevelFrom, setBonusLevelFrom] = useState<number | null>(currentFilter.bonusLevel.period.from);
    const [bonusLevelTo, setBonusLevelTo] = useState<number | null>(currentFilter.bonusLevel.period.to);
    const [barriereBase, setBarriereBase] = useState<"absolut" | "relativ">(currentFilter.barriere.basis || 'absolut');
    const [barriereFrom, setBarriereFrom] = useState<number | null>(currentFilter.barriere.period.from);
    const [barriereTo, setBarriereTo] = useState<number | null>(currentFilter.barriere.period.to);
    const [active, setActive] = useState<"bonusLevel" | "barriere" | undefined>(undefined);
    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });

    useEffect(() => {
        setBonusLevelBase(currentFilter.bonusLevel.basis);
        setBonusLevelFrom(currentFilter.bonusLevel.period.from);
        setBonusLevelTo(currentFilter.bonusLevel.period.to);

        setBarriereBase(currentFilter.barriere.basis);
        setBarriereFrom(currentFilter.barriere.period.from);
        setBarriereTo(currentFilter.barriere.period.to);

        let _active: any = undefined;
        if (currentFilter.bonusLevel.period.from || currentFilter.bonusLevel.period.to) _active = "bonusLevel";
        if (currentFilter.barriere.period.from || currentFilter.barriere.period.to) _active = "barriere";
        setActive(_active);

    }, [currentFilter]);

    const subText = function () {
        if (isDesktop && show) return null;

        let von = currentFilter?.bonusLevel?.period.from ? 'von ' + currentFilter?.bonusLevel?.period.from + ' ' : '';
        let bis = currentFilter?.bonusLevel?.period.to ? 'bis ' + currentFilter?.bonusLevel?.period.to : '';
        let bonusLevelPriseText: string = von + bis + ((von + bis !== "") ? ', ' + currentFilter?.bonusLevel?.basis : "");
        if (bonusLevelPriseText.length > 0) {
            bonusLevelPriseText = 'Bonus level: ' + bonusLevelPriseText + " ";
            if (!active) setActive("bonusLevel");
        }

        von = currentFilter?.barriere?.period.from ? 'von ' + currentFilter?.barriere?.period.from + ' ' : '';
        bis = currentFilter?.barriere?.period.to ? 'bis ' + currentFilter?.barriere?.period.to : '';
        let barrierePriseText: string = von + bis + ((von + bis !== "") ? ', ' + currentFilter?.barriere?.basis : "");
        if (barrierePriseText.length > 0) {
            barrierePriseText = 'Barriere: ' + barrierePriseText + " ";
            if (!active) setActive("barriere");
        }


        return bonusLevelPriseText + barrierePriseText;
    }

    const close = () => {
        setShow(false);
        if (onVisbilityChange) onVisbilityChange(false);
    };

    const applyFilter = (bonusLevelFrom: number | null, bonusLevelTo: number | null, bonusLevelBase: 'absolut' | 'relativ',
                         barriereFrom: number | null, barriereTo: number | null, barriereBase: 'absolut' | 'relativ') => {
        if (onFilterChange) onFilterChange({
            ...currentFilter,
            bonusLevel: {
                period: {from: bonusLevelFrom, to: bonusLevelTo}, basis: bonusLevelBase
            },
            barriere: {
                period: {from: barriereFrom, to: barriereTo}, basis: barriereBase
            }
        });
        close();
    }

    const cancelFilter = () => {
        setBarriereFrom(currentFilter.bonusLevel.period.from);
        setBarriereTo(currentFilter.bonusLevel.period.to);
        setBarriereBase(currentFilter.bonusLevel.basis);
        setBarriereFrom(currentFilter.barriere.period.from);
        setBarriereTo(currentFilter.barriere.period.to);
        setBarriereBase(currentFilter.barriere.basis);
        subText();

        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const resetFilter = () => {
        setBarriereFrom(null);
        setBarriereTo(null);
        setBarriereBase('absolut');
        setBarriereFrom(null);
        setBarriereTo(null);
        setBarriereBase('absolut');
        setActive("bonusLevel");
        applyFilter(null, null, 'absolut', null, null, 'absolut');
        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const content = (
        <>
            <div className="bg-white d-block mb-3" style={{opacity: active !== "barriere" ? 1 : 0.5}}>
                <VonBisBasePeriod title={'Bonus Level'} currentFilter={currentFilter.bonusLevel}
                                  onFilterChange={(newValue) => {
                                      setBonusLevelFrom(newValue.period.from);
                                      setBonusLevelTo(newValue.period.to);
                                      setBonusLevelBase(newValue.basis);

                                      setBarriereFrom(null);
                                      setBarriereTo(null);
                                      setBarriereBase("absolut");

                                      setActive("bonusLevel");
                                  }}/>
            </div>

            <div className="bg-white d-block" style={{opacity: active !== "bonusLevel" ? 1 : 0.5}}>
                <VonBisBasePeriod title={'Barriere'} currentFilter={currentFilter.barriere}
                                  onFilterChange={(newValue) => {
                                      setBarriereFrom(newValue.period.from);
                                      setBarriereTo(newValue.period.to);
                                      setBarriereBase(newValue.basis);

                                      setBonusLevelFrom(null);
                                      setBonusLevelTo(null);
                                      setBonusLevelBase("absolut");

                                      setActive("barriere");
                                  }}/>
            </div>
        </>
    );

    return (
        <>
            {
                showButton &&
                <Dropdown show={show && isDesktop} className={className}>
                    <DropdownButton text="Bonus level/barriere" subText={subText()} onClick={() => {
                        if (onClick) onClick();
                        setShow(!show)
                    }} style={{minWidth: 180}} className={subText()?.trim() !== '' ? "active" : ""} />

                    <Dropdown.Menu className="p-2 dropdown-menu-content d-md-block d-none" style={{width: 330}}>
                        <DropdownMenuHeader title="Bonus level/barriere" close={() => cancelFilter()}/>
                        {content}
                        <DropdownMenuFooter apply={() => applyFilter(bonusLevelFrom, bonusLevelTo, bonusLevelBase, barriereFrom, barriereTo, barriereBase)} reset={() => resetFilter()}/>
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
                            <span className="font-weight-bold roboto-heading">Bonus level/barriere</span>
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
                                    onClick={() => applyFilter(bonusLevelFrom, bonusLevelTo, bonusLevelBase, barriereFrom, barriereTo, barriereBase)}>
                                <SvgCheck></SvgCheck>Einstellung übernehmen
                            </button>
                        </div>

                    </div>
                </CSSTransition>
            }
        </>
    );
}

import {Dropdown} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {DropdownButton} from "../layout/DropdownButton";
import {ButtonItem} from "../layout/ButtonItem";
import {useBootstrapBreakpoint} from "../../../../../hooks/useBootstrapBreakpoint";
import classNames from "classnames";
import {InputItem} from "../layout/InputItem";
import {CSSTransition} from "react-transition-group";
import {DropdownMenuHeader} from "../layout/DropdownMenuHeader";
import {DropdownMenuFooter} from "../layout/DropdownMenuFooter";
import {SvgCheck} from "../../../../common/svg/svg-check";
import {SvgCancel} from "../../../../common/svg/svg-cancel";
import {DerivativeFilter} from "../../types/DerivativeSearchTypes";

interface LeverageFilterProps extends React.HTMLAttributes<HTMLDivElement> {
    currentFilter: DerivativeFilter;
    showButton?: boolean;
    showContent?: boolean;
    contentActive?: boolean;
    onClick?: () => any;
    onVisbilityChange?: (isVisible: boolean) => any;
    onFilterChange?: (filter: DerivativeFilter) => any;
    values: string[];
    filterKey: string;
    shortTitle: string;
    fullTitle: string;
}

export function SelectFromListFilter({
                                         currentFilter,
                                         showButton,
                                         showContent,
                                         contentActive,
                                         onClick,
                                         onVisbilityChange,
                                         onFilterChange,
                                         values,
                                         filterKey,
                                         shortTitle,
                                         fullTitle,
                                         className
                                     }: LeverageFilterProps) {
    const [show, setShow] = useState(false);
    const [value, setValue] = useState<string | null>(null);
    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });

    useEffect(() => {
        // @ts-ignore
        setValue(currentFilter[filterKey]);
        subText();
    }, [currentFilter]);

    const close = () => {
        setShow(false);
        if (onVisbilityChange) onVisbilityChange(false);
    };

    const subText = () => {
        if (isDesktop && show) return null;

        // @ts-ignore
        const keyText = currentFilter[filterKey];
        return keyText;
    }

    const sendFilter = (newFilter: DerivativeFilter) => {
        if (onFilterChange) onFilterChange(newFilter);
    }

    const applyFilter = (filterValue: string | null) => {
        const newFilter = {...currentFilter};
        // @ts-ignore
        newFilter[filterKey] = filterValue;
        sendFilter({...newFilter});
        close();
    }

    const cancelFilter = () => {
        // @ts-ignore
        setValue(currentFilter[filterKey]);
        subText();
    }

    const content = (
        <>
            <div className="d-flex flex-wrap mt-2">
                {
                    values.map(key =>
                        <ButtonItem active={value === key} key={key}
                                    onClick={() => {
                                        setValue((key === value) ? null : key);
                                    }}>
                            {key}
                        </ButtonItem>
                    )
                }
            </div>
        </>);


    function resetFilter() {
        applyFilter(null);
    }

    const _subText = subText()?.trim().toLowerCase();
    const isActive = _subText  && _subText !== '' && _subText !== 'alle' && _subText !== 'beliebig'
    return (
        <>
            {
                showButton &&
                <Dropdown show={show && isDesktop} className={className}>
                    <DropdownButton text={shortTitle} subText={subText()} onClick={() => {
                        if (onClick) onClick();
                        setShow(!show)
                    }} style={{minWidth: 140}} className={isActive ? "active" : ""} />

                    <Dropdown.Menu className="p-2 dropdown-menu-content d-md-block d-none" style={{width: 330}}>
                        <DropdownMenuHeader title={fullTitle} close={close}/>
                        {content}
                        <DropdownMenuFooter apply={() => applyFilter(value)}
                                            reset={() => resetFilter()}/>
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
                            <span className="font-weight-bold roboto-heading">{shortTitle}</span>
                            <button type="button" className="btn btn-link"
                                    onClick={() => {
                                        cancelFilter();
                                    }}>
                                schließen<SvgCancel></SvgCancel>
                            </button>
                        </div>

                        <div className="mx-auto" style={{width: "330px"}}>
                            {content}
                        </div>


                        <div className="d-flex justify-content-end border-0 bg-white modal-footer">
                            <button type="button" className="pr-0 btn btn-link" onClick={() => applyFilter(value)}>
                                <SvgCheck></SvgCheck>Einstellung übernehmen
                            </button>
                        </div>

                    </div>
                </CSSTransition>
            }

        </>
    );
}

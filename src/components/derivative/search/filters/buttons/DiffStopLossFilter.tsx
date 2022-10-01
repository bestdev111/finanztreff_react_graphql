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

const stdValues: { [key: string]: { from: number | null, to: number | null, text: string }; } = {
    'any': {
        from: null,
        to: null,
        text: 'beliebig'
    },
    '-2': {
        from: null,
        to: 2,
        text: "<2%"
    },
    '-5': {
        from: null,
        to: 5,
        text: "<5%"
    },
    '-10': {
        from: null,
        to: 10,
        text: "<10%"
    },
    '-20': {
        from: null,
        to: 20,
        text: "<20%"
    },
    '-30': {
        from: null,
        to: 30,
        text: "<30%"
    },
    '-40': {
        from: null,
        to: 40,
        text: "<40%"
    },
    '40-': {
        from: 40,
        to: null,
        text: ">40%"
    },
};

interface DiffStopLossFilterProps extends React.HTMLAttributes<HTMLDivElement> {
    currentFilter: DerivativeFilter;
    showButton?: boolean;
    showContent?: boolean;
    contentActive?: boolean;
    onClick?: () => any;
    onFilterChange?: (filter: DerivativeFilter) => any;
    onVisbilityChange?: (isVisible: boolean) => any;
}

export function DiffStopLossFilter({currentFilter, showButton, showContent, contentActive, onClick, onFilterChange, onVisbilityChange, className}: DiffStopLossFilterProps) {
    const [show, setShow] = useState(false);
    const [active, setActive] = useState('any');
    const [from, setFrom] = useState<number | null>(currentFilter.diffSL.from);
    const [to, setTo] = useState<number | null>(currentFilter.diffSL.to);
    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });

    const close = () => {
        setShow(false);
        if(onVisbilityChange) onVisbilityChange(false);
    };

    useEffect(() => {
        setFrom(currentFilter.diffSL.from);
        setTo(currentFilter.diffSL.to);
        subText();
    }, [currentFilter]);

    const subText = () => {
        if(isDesktop && show) return null;

        const von = currentFilter?.diffSL?.from ? 'von ' + currentFilter?.diffSL?.from + ' ' : '';
        const bis = currentFilter?.diffSL?.to ? 'bis ' + currentFilter?.diffSL?.to : '';
        let keyText: string = von + bis;


        let key = (currentFilter.diffSL.from+'-'+currentFilter.diffSL.to).replace(/null/g, '');
        if(key === '-') key = 'any';

        if(stdValues[key]) {
            if(active !== key) setActive(key);
            keyText = stdValues[key].text;
        };

        return keyText;
    }

    const sendFilter = (newFilter: DerivativeFilter) => {
        if(onFilterChange) onFilterChange(newFilter);
        if(onVisbilityChange) onVisbilityChange(false);
    }

    const applyFilter = (filter: string) => {
        if (filter === 'custom') {
            if((!from || from == 0) && (!to || to == 0)) {
                const stdValue = stdValues['any'];
                if(active !== 'any') setActive('any');
                sendFilter({...currentFilter, diffSL: {from: stdValue.from, to: stdValue.to}});
            } else sendFilter({...currentFilter, diffSL: {from: from, to: to}});
        } else {
            const stdValue = stdValues[filter];
            setFrom(null);
            setTo(null);
            sendFilter({...currentFilter, diffSL: {from: stdValue.from, to: stdValue.to}});
        }
        close();
    }

    const cancelFilter = () => {
        setFrom(currentFilter.diffSL.from);
        setTo(currentFilter.diffSL.to);
        subText();
        if(onVisbilityChange) onVisbilityChange(false);
    }

    const content = (
        <>
            <div className="d-flex flex-wrap mt-2">
                {
                    Object.keys(stdValues).map((key: string) =>
                        <ButtonItem active={active === key} key={key}
                                    onClick={() => {
                                        setActive((key === active) ? 'any' : key);
                                        setFrom(null);
                                        setTo(null);
                                    }}>
                            {stdValues[key].text}
                        </ButtonItem>
                    )
                }
            </div>
        </>);


    return (
        <>
            {
                showButton &&
                <Dropdown show={show && isDesktop} className={className}>
                    <DropdownButton text="Diff Stop Loss" subText={subText()} onClick={() => {
                        if(onClick) onClick();
                        setShow(!show)
                    }} style={{minWidth: 140}}/>

                    <Dropdown.Menu className="p-2 dropdown-menu-content d-md-block d-none" style={{width: 330}}>
                        <DropdownMenuHeader title="Diff Stop Loss" close={close}/>
                        {content}
                        <DropdownMenuFooter apply={() => applyFilter(active)} reset={() => applyFilter('any')}/>
                    </Dropdown.Menu>
                </Dropdown>
            }

            {
                showContent && !isDesktop &&
                <CSSTransition timeout={250}
                               classNames={"carusel-modal-right"}
                               in={contentActive}>
                    <div className={"container carusel-modal-right"}  onClick={(event) => {event.stopPropagation();}}>

                        <div className="d-flex justify-content-between bg-white py-3 pl-3">
                            <span className="font-weight-bold roboto-heading">Diff Stop Loss</span>
                            <button type="button" className="btn btn-link"
                                    onClick={() => {cancelFilter();}}>
                                schließen<SvgCancel></SvgCancel>
                            </button>
                        </div>

                        <div className="mx-auto" style={{ width: "330px" }}>
                            {content}
                        </div>


                        <div className="d-flex justify-content-end border-0 bg-white modal-footer">
                            <button type="button" className="pr-0 btn btn-link" onClick={() => applyFilter(active)}>
                                <SvgCheck></SvgCheck>Einstellung übernehmen
                            </button>
                        </div>

                    </div>
                </CSSTransition>
            }

        </>
    );
}

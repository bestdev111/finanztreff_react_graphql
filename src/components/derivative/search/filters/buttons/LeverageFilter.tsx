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
import {guessInfonlineSection, trigInfonline} from "../../../../common/InfonlineService";

const stdValues: { [key: string]: { from: number | null, to: number | null, text: string }; } = {
    'any': {
        from: null,
        to: null,
        text: 'beliebig'
    },
    '-5': {
        from: null,
        to: 5,
        text: "< 5"
    },
    '5-10': {
        from: 5,
        to: 10,
        text: "5 - 10"
    },
    '10-15': {
        from: 10,
        to: 15,
        text: "10 - 15"
    },
    '15-20': {
        from: 15,
        to: 20,
        text: "15 - 20"
    },
    '20-': {
        from: 20,
        to: null,
        text: "> 20"
    },
};

interface LeverageFilterProps extends React.HTMLAttributes<HTMLDivElement> {
    currentFilter: DerivativeFilter;
    showButton?: boolean;
    showContent?: boolean;
    contentActive?: boolean;
    onClick?: () => any;
    onFilterChange?: (filter: DerivativeFilter) => any;
    onVisbilityChange?: (isVisible: boolean) => any;
}

export function LeverageFilter({currentFilter, showButton, showContent, contentActive, onClick, onFilterChange, onVisbilityChange, className}: LeverageFilterProps) {
    const [show, setShow] = useState(false);
    const [active, setActive] = useState('any');
    const [from, setFrom] = useState<number | null>(currentFilter.leverage.from);
    const [to, setTo] = useState<number | null>(currentFilter.leverage.to);
    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });

    useEffect(() => {
        setFrom(currentFilter.leverage.from);
        setTo(currentFilter.leverage.to);
        subText();
    }, [currentFilter]);

    const close = () => {
        setShow(false);
        if(onVisbilityChange) onVisbilityChange(false);
    };

    const subText = () => {
        if(isDesktop && show) return null;

        const von = currentFilter?.leverage?.from ? 'von ' + currentFilter?.leverage?.from + ' ' : '';
        const bis = currentFilter?.leverage?.to ? 'bis ' + currentFilter?.leverage?.to : '';
        let keyText: string = von + bis;


        let key = (currentFilter.leverage.from+'-'+currentFilter.leverage.to).replace(/null/g, '');
        if(key === '-') key = 'any';

        if(stdValues[key]) {
            if(active !== key) setActive(key);
            keyText = stdValues[key].text;
        } else {
            if(active !== "custom") setActive("custom");
        };

        return keyText;
    }

    const sendFilter = (newFilter: DerivativeFilter) => {
        if(onFilterChange) onFilterChange(newFilter);
        if(onVisbilityChange) onVisbilityChange(false);
    }

    const applyFilter = (filter: string) => {
    trigInfonline(guessInfonlineSection(),'search_result')
        if (filter === 'custom') {
            if((!from || from == 0) && (!to || to == 0)) {
                const stdValue = stdValues['any'];
                if(active !== 'any') setActive('any');
                sendFilter({...currentFilter, leverage: {from: stdValue.from, to: stdValue.to}});
            } else sendFilter({...currentFilter, leverage: {from: from, to: to}});
        } else {
            const stdValue = stdValues[filter];
            setFrom(null);
            setTo(null);
            sendFilter({...currentFilter, leverage: {from: stdValue.from, to: stdValue.to}});
        }
        close();
    }

    const cancelFilter = () => {
        setFrom(currentFilter.leverage.from);
        setTo(currentFilter.leverage.to);
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
            <div
                className={classNames("d-flex justify-content-center mt-3", isDesktop ? '' : 'border-top-1 border-gray-light pt-3')}>
                <div className="d-flex justify-content-end mr-2">
                    <InputItem label="von" value={active === "custom" ? from || '' : ''}
                               className="flex-fill"
                               onChange={e => {
                                   setActive('custom');
                                   setFrom(+e.target.value);
                               }}/>

                </div>
                <div className="d-flex">
                    <InputItem label="bis" value={active === "custom" ? to || '' : ''}
                               className="flex-fill"
                               onChange={e => {
                                   setActive('custom');
                                   setTo(+e.target.value);
                               }}/>
                </div>
            </div>
        </>);


    return (
        <>
            {
                showButton &&
                <Dropdown show={show && isDesktop} className={className}>
                    <DropdownButton text="Hebel" subText={subText()} onClick={() => {
                        if(onClick) onClick();
                        setShow(!show)
                    }} style={{minWidth: 140}} className={subText() !== 'beliebig' ? "active" : ""} />

                    <Dropdown.Menu className="p-2 dropdown-menu-content d-md-block d-none" style={{width: 330}}>
                        <DropdownMenuHeader title="Hebel (Omega) einstellen" close={close}/>
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
                            <span className="font-weight-bold roboto-heading">Hebel</span>
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

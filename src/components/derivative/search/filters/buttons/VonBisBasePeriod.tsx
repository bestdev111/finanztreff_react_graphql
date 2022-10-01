import React, {useEffect, useState} from "react";
import {useBootstrapBreakpoint} from "../../../../../hooks/useBootstrapBreakpoint";
import {ButtonItem} from "../layout/ButtonItem";
import {InputItem} from "../layout/InputItem";
import {FilterVonBisBasePeriod} from "../../types/DerivativeSearchTypes";

interface VonBisBasePeriodProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    withBase?: boolean;
    currentFilter: FilterVonBisBasePeriod;
    onFilterChange: (newValue: FilterVonBisBasePeriod) => any;
}


export function VonBisBasePeriod({title, withBase = true, currentFilter, onFilterChange}: VonBisBasePeriodProps) {
    const [base, setBase] = useState<"absolut" | "relativ">(currentFilter.basis);
    const [from, setFrom] = useState<number | null>(currentFilter.period.from);
    const [to, setTo] = useState<number | null>(currentFilter.period.to);
    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });

    const applyFilter = (from: number | null, to: number | null, basis: "absolut" | "relativ") => {
        onFilterChange({ period: {from: from, to: to}, basis: basis} );
    }

    useEffect(() =>{
        setFrom(currentFilter.period.from);
        setTo(currentFilter.period.to);
        setBase(currentFilter.basis);
    }, [currentFilter]);

    const content = (
        <>
            <div className="p-2 d-flex justify-content-between">
                {
                    title && title.length > 0 && <span className="font-weight-bold my-auto">{title}&nbsp;</span>
                }
                {
                    withBase &&
                    <div className="d-flex">
                        <ButtonItem active={base === 'absolut'} onClick={() => { setBase('absolut'); applyFilter(from, to, 'absolut'); }}>absolut</ButtonItem>
                        <ButtonItem active={base === 'relativ'} onClick={() => {setBase('relativ'); applyFilter(from, to, 'relativ'); }}
                                    className="mr-xl-0">relativ</ButtonItem>
                    </div>
                }
            </div>
            <div>
                <div className="d-flex justify-content-between px-2">
                    <div className="d-flex justify-content-end mr-2">
                        <InputItem className="flex-fill" label="von"
                                   value={from || ''}
                                   onChange={e => {
                                       setFrom(+e.target.value);
                                       applyFilter(+e.target.value, to, base);
                                   }}/>
                    </div>
                    <div className="d-flex">
                        <InputItem className="flex-fill" label="bis"
                                   value={to || ''}
                                   onChange={e => {
                                       setTo(+e.target.value);
                                       applyFilter(from, +e.target.value, base);
                                   }}/>
                    </div>
                </div>
            </div>
        </>
    );

    return content
}

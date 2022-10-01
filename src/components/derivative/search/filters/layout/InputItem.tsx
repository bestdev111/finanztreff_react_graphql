import React, {ChangeEvent, useEffect, useState} from "react";
import classNames from "classnames";
import {numberFormat} from "../../../../../utils";

interface InputItemProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label: string
    value?: any
}

export function InputItem(props: InputItemProps) {

    const [value, setValue] = useState<string>(props.value?.toString() || '');
    const [lastEvent, setLastEvent] = useState<ChangeEvent<HTMLInputElement>>();

    useEffect(
        () => {
            setValue(props.value?.toString() || '')
        }, [props]
    )

    return (<>
        <span>{props.label}</span>
        <input {...props} value={value}
               onChange={(e) => {
                   setValue(e.target.value)
                   setLastEvent({...e})
               }}
               onBlur={(e) => {
                   const v = parseFloat(value);
                   if (isNaN(v) && value.trim() !== '') {
                       setValue(props.value?.toString() || '')
                   } else {
                       if(!isNaN(v)) setValue(v.toString()); else setValue('');
                       if (props.onChange && lastEvent) {
                           const ev: ChangeEvent<HTMLInputElement> = lastEvent;
                           ev.target.value = value.trim();
                           props.onChange(ev);
                       }
                   }
               }}
               className={classNames("bg-border-gray border-0 pr-2 ml-2 w-50 text-right font-size-14px", props.className)}/>
    </>);
}
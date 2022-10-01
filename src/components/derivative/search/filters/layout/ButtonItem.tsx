import {Button} from "react-bootstrap";
import React from "react";
import classNames from "classnames";

interface ButtonItemProps extends React.HTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    disabled?: boolean;
}

export function ButtonItem(props: ButtonItemProps) {
    return (
        <Button {...props} onClick={props.onClick} variant={props.active ? "primary" : ''} disabled={props.disabled}
                className={classNames(props.className, 'm-1', props.active ? '' : 'bg-border-gray text-primary')}
        >
            {props.children}</Button>
    );
}

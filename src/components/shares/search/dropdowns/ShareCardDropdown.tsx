import {Button} from "react-bootstrap";
import React from "react";
import classNames from "classnames";

interface ShareButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    className?: string
    active?: any
    value: string
}

export function ShareButton(props: ShareButtonProps){

    const activeState = {
        backgroundColor: '#5B9DE1',
        color: 'white',
        borderRadius: '3px',
    }

    const inactiveState = {
        backgroundColor: '#F1F1F1',
        color: '#326eac',
        borderRadius: '3px',
    }

    return(
        <>
            <Button
                active={props.active}
                onSelect={props.onSelect}
                onClick={props.onClick}
                className={classNames(props.className, 'm-1 border-0')}
                style={props.active ? activeState : inactiveState}
            >
                {props.value}
            </Button>
        </>
    )
}

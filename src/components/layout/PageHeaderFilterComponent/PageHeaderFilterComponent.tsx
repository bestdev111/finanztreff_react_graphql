
import {ReactNode} from "react";
import classNames from "classnames";
import {PageHeaderFilterBaseComponent} from "./PageHeaderFilterBaseComponent";

interface PageHeaderFilterComponentProps {
    title: string  | ReactNode;
    description?: string | ReactNode;
    variant?: string | undefined;
    toggleVariant?: string | undefined;
    toggleIcon?: string | undefined;
    children?: ReactNode | undefined;
    className?: string | undefined;
    selectedId?: string | undefined;
    disabled?: boolean | undefined;
}

export function PageHeaderFilterComponent(props: PageHeaderFilterComponentProps) {
    return (
        <PageHeaderFilterBaseComponent
            variant={props.variant }
            toggleVariant={props.toggleVariant}
            title={props.title}
            disabled={props.disabled || false}
            className={classNames(props.className,props.description ? "active" : "")}
            toggle={
                <div className="d-flex justify-content-between">
                    <div className="button-body px-3 py-1 overflow-hidden custom-class-button">
                        <span className={classNames("d-block title", !props.description && 'single-line')}>{props.title}</span>
                        {props.description && <span className="d-block description text-truncate">{props.description}</span>}
                    </div>
                    <img src={props.toggleIcon || process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_dark.svg"} className="toggle-icon" alt="Dropdown arrow down"/>
                </div>
            }
        >
            {props.children}
        </PageHeaderFilterBaseComponent>
    )
}

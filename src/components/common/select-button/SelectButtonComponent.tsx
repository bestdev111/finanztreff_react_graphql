import React, {ReactNode, useImperativeHandle, useState} from "react";
import {Button} from "react-bootstrap";


export interface DropdownMenuOption {
    key: string,
    html?: ReactNode,
    value: any,
    interval?: string
}

export interface DropdownMenuOptionGroup {
    options: DropdownMenuOption[];
}

export interface DropdownMenuOptions {
    dropdownTitle: string,
    menuTitle: string,
    groups: DropdownMenuOptionGroup[],
    closeOnSelect: boolean,
    interval ?: string,
}

interface ViewCtrlBarProps {
    options?: DropdownMenuOptions,
    selectedOptions?: DropdownMenuOption[],
    onSelectionChanged: any,
    beforeOpen?: any
    style?: any;
    dropDownMenuCss?: string;
    autoOpen?: boolean;
}

export const SelectButtonComponent = React.forwardRef((props: ViewCtrlBarProps, ref) => {
    const [menuVisible, setMenuVisible] = useState<boolean>(false);

    if (props.autoOpen) setMenuVisible(true);

    const toggleOption = function (option: DropdownMenuOption) {
        if (props.options?.closeOnSelect) {
            sendSelected([option]);
            return;
        }
    }

    const sendSelected = function (selection: DropdownMenuOption[] | null | undefined) {
        if (selection && (selection?.length > 0)) props.onSelectionChanged(selection);
        setMenuVisible(false);
    }

    const toggleMenu = function () {
        const currentStatus = menuVisible;
        if (!menuVisible) {
            if (props.beforeOpen) {
                props.beforeOpen();
            }
        }
        setMenuVisible(!currentStatus);
    }

    const closeMenu = function () {
        setMenuVisible(false);
    }

    useImperativeHandle(ref, () => {
        return {
            closeMenu: closeMenu
        }
    });

    return (
        <>
            <div className={"dropdown dropdown-select dropdown-filter dropdown-keep-open no-after-pointer " + (menuVisible ? "z-503" : "z-501")}>
                <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" onClick={toggleMenu} style={props.style}>
                    <div className="drop-legend">{props.options?.dropdownTitle}</div>
                    <div className="drop-selection">
                        {
                            (props.selectedOptions && props.selectedOptions.length > 0) ? props.selectedOptions.map(i => i.key).join(', ') : 'none'
                        }
                    </div>
                    {
                        menuVisible ?
                            <span className="drop-arrow-image close-icon svg-icon top-move" onClick={closeMenu}>
                            <svg xmlns="http://www.w3.org/2000/svg" id="Ebene_1" data-name="Ebene 1" width="28" height="28"
                                 viewBox="0 0 28 28" className="svg-convert svg-white">
  <path id="Pfad_846" data-name="Pfad 846"
        d="M15.11,14l4.66-4.65a.79.79,0,0,0-1.12-1.12L14,12.88,9.34,8.22a.79.79,0,0,0-1.12,0,.8.8,0,0,0,0,1.08L12.88,14,8.22,18.65a.79.79,0,0,0,1.12,1.12L14,15.11l4.65,4.66a.79.79,0,1,0,1.12-1.12Z"
        fill="#383838"></path>
</svg>
                        </span>
                            :
                            <span className="drop-arrow-image open-icon svg-icon top-move">
                            <svg xmlns="http://www.w3.org/2000/svg" id="Ebene_1" data-name="Ebene 1" width="28" height="28" viewBox="0 0 28 28" className="svg-convert svg-white">
  <path id="Pfad_848" data-name="Pfad 848" d="M8.21,12.78l5,5a.75.75,0,0,0,1.06,0h0l5-5a.75.75,0,1,0-1-1.08l0,0-4.47,4.47L9.27,11.72a.75.75,0,0,0-1.06,1.06Z" fill="#383838"></path>
</svg>
                        </span>
                    }
                </button>

                {
                    menuVisible &&
                    <>
                        <div className={"dropdown-menu z-502 " + props.dropDownMenuCss}>
                            <div className="drop-header">{props.options?.menuTitle}
                                <span className="drop-arrow-image close-icon svg-icon top-move" onClick={() => setMenuVisible(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 id="Ebene_1" data-name="Ebene 1"
                                 width="28" height="28"
                                 viewBox="0 0 28 28"
                                 className="svg-convert svg-grey">
  <path id="Pfad_846" data-name="Pfad 846"
        d="M15.11,14l4.66-4.65a.79.79,0,0,0-1.12-1.12L14,12.88,9.34,8.22a.79.79,0,0,0-1.12,0,.8.8,0,0,0,0,1.08L12.88,14,8.22,18.65a.79.79,0,0,0,1.12,1.12L14,15.11l4.65,4.66a.79.79,0,1,0,1.12-1.12Z"
        fill="#383838"></path>
                            </svg>
                        </span>
                            </div>
                            <div className="drop-body">
                                {
                                    props.options?.groups.map(
                                        (g: DropdownMenuOptionGroup, index: number) =>
                                            <div className="body-row" key={index}>
                                                {
                                                    g.options.map(
                                                        (o: DropdownMenuOption, idx: number) =>
                                                            o.html ?
                                                                <div key={idx} onClick={() => toggleOption(o)}> {o.html} </div>
                                                                :
                                                                <Button variant="border-gray" key={idx}
                                                                        className={props.selectedOptions?.find(i => i.value === o.value) ? " active-filter" : ""}
                                                                        type="button"
                                                                        onClick={() => toggleOption(o)}
                                                                >
                                                                        {o.key}
                                                                </Button>
                                                    )
                                                }
                                            </div>
                                    )
                                }
                            </div>
                        </div>
                    </>
                }
            </div>
            {
                menuVisible && <div className={"screen-overlay"} onClick={closeMenu}></div>
            }
        </>
    )
})

import {Dropdown} from "react-bootstrap";
import React from "react";
import SvgImage from "../../../../common/image/SvgImage";
import classNames from "classnames";

interface DropdownButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    text: string;
    subText?: React.ReactNode;
    icon?: string;
}

export function DropdownButton({text, subText, onClick, className, icon, style}: DropdownButtonProps) {
    return (
        <Dropdown.Toggle variant="blue" className={classNames("search-filter-button border-0", className)}
                         onClick={onClick} style={style}>
            <div className="drop-fl d-flex w-100">
                {
                    icon
                    &&
                    <div className="my-auto">
                        <SvgImage spanClass="float-left" icon={icon} convert={true} imgClass="svg-white"
                                  style={{height: 30, width: 30}}/>
                    </div>
                }

                <div className="text-left text-white w-100" style={{ paddingRight: 10}}>
                    <div className="font-weight-bold w-100" style={{overflow: "hidden", textOverflow: "ellipsis", fontSize:"15px"}}>{text}</div>
                    <span className="font-size-12px w-100" style={{display: "inline-block", textOverflow: "ellipsis", width: "100%", overflow: "hidden" }}>{subText}</span>
                </div>
            </div>
            <SvgImage spanClass="open-icon" icon="icon_direction_down_white.svg" imgClass="my-auto mr-n2 ml-n3"
                      width="30"/>
            <SvgImage spanClass="close-icon" icon="icon_close_white.svg" imgClass="my-auto ml-2" width="10"/>
        </Dropdown.Toggle>
    );
}

import React from "react";

export function DropdownMenuHeader({title, close}: { title: string, close: any }) {
    return (
        <div className="border-bottom-2 border-border-gray d-flex justify-content-between">
            <span className="font-weight-bold font-size-14px">{title}</span>
            <span onClick={close} className="text-gray cursor-pointer">&#10005;</span>
        </div>
    );
}
import React from "react";
import SvgImage from "../../../../common/image/SvgImage";
import {Button} from "react-bootstrap";

export function DropdownMenuFooter({reset, apply}: { reset: any, apply: any }) {
    return (
        <div className="d-flex justify-content-between p-2 border-top-2 mt-2 border-border-gray">
            <Button variant="link" className="font-size-13px pl-0" onClick={reset}>Filter zurücksetzen</Button>
            <Button variant="link" className="font-weight-bold pr-0" onClick={apply}>
                <SvgImage icon="icon_check_hook_green.svg" convert={false}
                          spanClass="green-icon mr-0" imgClass="green-check-icon"
                          width="20"
                />
                Anwenden</Button>
        </div>
    );
}
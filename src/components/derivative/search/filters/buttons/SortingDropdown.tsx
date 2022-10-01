import {Dropdown} from "react-bootstrap";
import SvgImage from "../../../../common/image/SvgImage";
import React, {useState} from "react";
import {ButtonItem} from "../layout/ButtonItem";
import {DropdownMenuHeader} from "../layout/DropdownMenuHeader";
import {DropdownMenuFooter} from "../layout/DropdownMenuFooter";

interface SortingDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    onFilterReset: () => any,
}

export function SortingDropdown(props: SortingDropdownProps) {
    const [open, setOpen] = useState(false);
    const {onFilterReset, className} = props;
    const onFilterApply = () => {
    };
    return (
        <Dropdown show={open} className="d-inline dropdown-select no-after" alignRight={true}>
            <Dropdown.Toggle onClick={() => setOpen(!open)} className={className} variant="white">
                <SvgImage icon="icon_filter_white.svg" convert={false}
                          spanClass="mr-0" width="40"/>
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-0 border shadow border-gray">
                <div className="p-2 dropdown-menu-content" style={{minWidth: 360}}>
                    <DropdownMenuHeader title="Sortiérung" close={() => setOpen(false)}/>
                    <div className="dropdown-filter-section">
                        <ButtonItem>Name</ButtonItem>
                        <ButtonItem>Kaufdatum</ButtonItem>
                        <ButtonItem>Ertrage</ButtonItem>
                        <ButtonItem>Performance Heute</ButtonItem>
                        <ButtonItem active={true}>Performance gesamt</ButtonItem>
                    </div>
                    <DropdownMenuFooter
                        apply={() => {
                            setOpen(false);
                            onFilterApply();
                        }}
                        reset={() => {
                            setOpen(false);
                            onFilterReset();
                        }}/>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
}

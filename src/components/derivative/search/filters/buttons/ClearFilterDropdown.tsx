import {Button, Dropdown, Modal} from "react-bootstrap";
import SvgImage from "../../../../common/image/SvgImage";
import React, {useState} from "react";
import {DropdownMenuHeader} from "../layout/DropdownMenuHeader";
import {ModalHeader} from "../layout/ModalHeader";
import {useBootstrapBreakpoint} from "../../../../../hooks/useBootstrapBreakpoint";

interface ClearFilterDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    onFilterClear: () => any
}

export function ClearFilterDropdown(props: ClearFilterDropdownProps) {
    const [show, setShow] = useState(false);
    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });
    const close = () => {
        setShow(false);
    };
    const {onFilterClear, className} = props;
    return (
        <Dropdown show={show && isDesktop} className="d-inline dropdown-select no-after" alignRight={true}>
            <Dropdown.Toggle onClick={() => setShow(!show)} className={className} variant="white">
                <SvgImage icon="icon_close_dark.svg" convert={false}
                          spanClass="mr-0" width="40"/>
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-0 border shadow border-gray">
                <div className="p-2 dropdown-menu-content" style={{minWidth: 240}}>
                    <DropdownMenuHeader title="All Filter zurücksetzen?" close={() => setShow(false)}/>
                    <div className="d-flex justify-content-between p-2">
                        <Button variant="link" className="font-size-13px pl-0"
                                onClick={() => setShow(false)}>Abbrechen</Button>
                        <Button variant="link" className="font-weight-bold pr-0"
                                onClick={() => {
                                    onFilterClear();
                                    close();
                                }}>
                            <SvgImage icon="icon_check_hook_green.svg" convert={false}
                                      spanClass="green-icon mr-0" imgClass="green-check-icon"
                                      width="20"/>
                            OK</Button>
                    </div>
                </div>
            </Dropdown.Menu>
            <Modal show={show && !isDesktop} className="d-xl-none bottom modal-dialog-sky-placement" onHide={close} contentClassName="bg-white">
                <ModalHeader title="Emittent" close={close}/>
                <div className="mx-auto" style={{width: 330}}>
                    <Button variant="link" className="font-weight-bold pr-0"
                            onClick={() => {
                                onFilterClear();
                                close();
                            }}>
                        <SvgImage icon="icon_check_hook_green.svg" convert={false}
                                  spanClass="green-icon mr-0" imgClass="green-check-icon"
                                  width="20"/>
                        OK
                    </Button>
                </div>
            </Modal>
        </Dropdown>
    );


}

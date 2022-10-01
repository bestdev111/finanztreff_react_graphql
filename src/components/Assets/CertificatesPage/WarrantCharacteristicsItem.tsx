import React, {useEffect, useRef} from "react";
import {Col} from "react-bootstrap";

interface WarrantCharacteristicsItemProps {
    name: React.ReactNode;
    value: React.ReactNode;
}

export default  function WarrantCharacteristicsItem({name, value}: WarrantCharacteristicsItemProps) {
    //
    // if (!value || value === '-') {
    //     return (
    //         <Col>
    //             <div className="border border-border-gray fnt-size-14 px-1 py-1 mb-3">
    //                 <div className="text-truncate">{name}</div>
    //                 <div className="font-weight-bold">--</div>
    //             </div>
    //         </Col>
    //     )
    // }

    const itemNameRef = useRef(null);

    useEffect(() => {
        if(itemNameRef && itemNameRef.current) {
            // @ts-ignore
            itemNameRef.current.title = name;
        }
    }, [])

    return (
        <div className={"mb-sm-2 mb-3"}>
            <Col>
                <div className="border border-border-gray fnt-size-14 px-1 py-1 mb-3 ">
                    <div className="text-truncate" ref={itemNameRef}>{name}</div>
                    <div className="font-weight-bold mt-sm-n1 mt-md-0">{value}</div>
                </div>
            </Col>
        </div>
    );
}
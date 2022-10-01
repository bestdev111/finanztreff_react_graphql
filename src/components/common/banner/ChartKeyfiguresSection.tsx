import {AssetGroup, Instrument} from "../../../generated/graphql";
import React, {useEffect, useState} from "react";
import SvgImage from "../image/SvgImage";
import {Form} from "react-bootstrap";

interface ChartLowerSectionProps {
    instrument: Instrument,
    stopLossChecked: boolean,
    strikeChecked: boolean,
    underlyingChecked: boolean
    onStopLossChecked: () => void,
    onStrikeChecked: () => void,
    onUnderlyingChecked: () => void,
}

export function ChartKeyfiguresSection(props: ChartLowerSectionProps) {
    let assetGroup = props?.instrument?.group?.assetGroup;
    const [flexClass, setFlexClass] = useState<string>("")
    const {strikeChecked, stopLossChecked, onStrikeChecked, underlyingChecked, onStopLossChecked, onUnderlyingChecked} = props;

    const handleStrikeClick = () => {
        if (!underlyingChecked) {
            onUnderlyingChecked();
            onStrikeChecked();
        }
        if (underlyingChecked) {
            onStrikeChecked();
        }
    }

    const handleStopLossClick = () => {
        if (underlyingChecked && strikeChecked) {
            return onStopLossChecked();
        }
        if (!underlyingChecked) {
            onUnderlyingChecked();
            onStopLossChecked();
        }
        if (underlyingChecked) {
            onStopLossChecked();
        }
    }

    useEffect(() => {
        if (assetGroup === AssetGroup.Knock || assetGroup === AssetGroup.Warr) {
            setFlexClass("d-flex")
        } else if (assetGroup === AssetGroup.Cert) {
            setFlexClass("")
        }
    }, [assetGroup])


    function renderCheckBoxes() {
        if (assetGroup === AssetGroup.Warr || assetGroup === AssetGroup.Knock) {
            return (
                <Form.Group className="form-inline w-100">
                    <div className="d-flex mr-4 mr-xl-5" onClick={props.onUnderlyingChecked}>
                        {props.underlyingChecked ?
                            <SvgImage convert={false} icon={"icon_checkbox_checked_white.svg"} width="24"
                                      spanClass={"svg-white"} imgClass={"svg-white"}/> :
                            <SvgImage convert={false} icon={"icon_checkbox_unchecked_white.svg"}
                                      width={"24"} spanClass={"svg-white"} imgClass={"svg-white"}/>
                        }
                        <span className="pt-1 d-sm-block" style={{fontSize: "15px"}}>Basiswert</span>
                    </div>
                    <div className="d-flex ml-1" onClick={handleStrikeClick}>
                        {props.strikeChecked ?
                            <SvgImage convert={false} icon={"icon_checkbox_checked_white.svg"} width="24"
                                      spanClass={"svg-white"} imgClass={"svg-white"}/> :
                            <SvgImage convert={false} icon={"icon_checkbox_unchecked_white.svg"}
                                      width={"24"} spanClass={"svg-white"} imgClass={"svg-white"}/>
                        }
                        <span className={"pt-1"} style={{fontSize: "15px"}}>Strike</span>
                    </div>
                    {
                        assetGroup === AssetGroup.Knock ?
                            <div className="d-flex ml-5" onClick={handleStopLossClick}>
                                {props.stopLossChecked ?
                                    <SvgImage convert={false} icon={"icon_checkbox_checked_white.svg"}
                                              width="24" spanClass={"svg-white"} imgClass={"svg-white"}/> :
                                    <SvgImage convert={false} icon={"icon_checkbox_unchecked_white.svg"}
                                              width={"24"} spanClass={"svg-white"} imgClass={"svg-white"}/>
                                }
                                <span className={"pt-1"} style={{fontSize: "15px"}}>Stop Loss</span>

                            </div>
                            :
                            <></>
                    }
                </Form.Group>
            )
        } else if (assetGroup === AssetGroup.Cert) {
            return (
                <div className="d-flex mr-5" onClick={props.onUnderlyingChecked}>
                    {props.underlyingChecked ?
                        <SvgImage convert={false} icon={"icon_checkbox_checked_white.svg"} width="24"
                                  spanClass={"svg-white"} imgClass={"svg-white"}/> :
                        <SvgImage convert={false} icon={"icon_checkbox_unchecked_white.svg"}
                                  width={"24"} spanClass={"svg-white"} imgClass={"svg-white"}/>
                    }
                    <span className="pt-1" style={{fontSize: "15px"}}>Basiswert</span>
                </div>
            )
        } else {
            return (
                <></>
                // <div className={"d-xl-flex justify-content-end d-md-none"}>
                //     <InputGroup size="sm" className="search-input d-flex">
                //         <FormControl placeholder="Vergleichen mit"
                //                      aria-label="Sizing example input"
                //                      aria-describedby="inputGroup-sizing-sm"
                //                      style={{backgroundImage: "url('/static/img/svg/icon_search_white.svg')"}}
                //         />
                //     </InputGroup>
                //     <Button variant="dark">Chartanalyse</Button></div>
            )
        }
    }

    return <div className={`chart-analyse ${flexClass}`}>
        {renderCheckBoxes()}
    </div>;
}

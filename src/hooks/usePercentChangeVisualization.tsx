import {SnapQuote, useUpdateStickyInstrumentSubscription} from "../generated/graphql";
import {useContext, useEffect, useState} from "react";
import {STOCKCHANGE_TYPE, StickInstrumentsState} from "../utils";
import {ApplicationContextContext, ApplicationContextProps} from "../ApplicationContext";


interface PercentChangeVisualizationState {
    toggle: boolean;
    timeoutId: number | undefined;
    last: SnapQuote | undefined;
}

export interface PercentChangeVisualizationResult {
    value: SnapQuote | undefined;
    toggle: boolean;
}

/**
 * To make the percentage change blink , use this function . Pass instrumentId in it and this will return a class for blink effect
 * only for 500ms , the effect will be triggered on 2 consecutive +ve/-ve differences only .
 */

export function usePercentChangeVisualization(instrumentId: number | undefined): PercentChangeVisualizationResult {
    const instId = Number(instrumentId);
    const {pushActive}: ApplicationContextProps = useContext(ApplicationContextContext)!

    const {data, loading} = useUpdateStickyInstrumentSubscription({variables: {id: instId}, skip: !pushActive});
    const [state, setState] = useState<PercentChangeVisualizationState>({
        toggle: false,
        timeoutId: undefined,
        last: undefined
    })
    // function checkForUpdates() {

        // if (!state.currentValue) {
     //            setState({
     //                ...state,
     //                currentValue: data?.update?.lastPrice,
     //                updatedAt : data?.update?.quotes[0]?.when
     //            })
     //        } else {
     //            setState({
     //                ...state,
     //                previousValue: state.currentValue,
     //                currentValue: data?.update?.lastPrice,
     //            })
     //        }
     //    if (state.currentValue && state.previousValue && state.updatedAt) {
     //        let difference: number = state.previousValue - state.currentValue;
     //        let currentData = data;
     //        if (state.change) {
     //            if (difference > 0) {
     //                if (state.change === STOCKCHANGE_TYPE.POSITIVE) {
     //                        if (state?.updatedAt < currentData?.update?.quotes[0]?.when) {
     //                            setState({
     //                                ...state,
     //                                change: null,
     //                                data: currentData,
     //                                toggle: true,
     //                                updatedAt: currentData?.update?.quotes[0]?.when,
     //                            })
     //                            setTimeout(() => {
     //                                setState({...state, toggle: false})
     //                            }, 500)
     //                        }
     //                } else {
     //                    setState({...state, change: STOCKCHANGE_TYPE.POSITIVE})
     //                }
     //            }
     //            if (difference < 0) {
     //                if (state.change === STOCKCHANGE_TYPE.NEGATIVE) {
     //                        if (state?.updatedAt < currentData?.update?.quotes[0]?.when) {
     //                            setState({
     //                                ...state,
     //                                change: null,
     //                                data: currentData,
     //                                toggle: true,
     //                                updatedAt: currentData?.update?.quotes[0]?.when,
     //                            })
     //                         setTimeout(() => {
     //                                setState({...state, toggle:false})
     //                            }, 500)
     //                        }
     //                } else {
     //                    setState({...state, change: STOCKCHANGE_TYPE.NEGATIVE})
     //                }
     //            }
     //        } else {
     //            if (difference > 0) setState({...state, change: STOCKCHANGE_TYPE.POSITIVE})
     //            if (difference < 0) setState({...state, change: STOCKCHANGE_TYPE.NEGATIVE})
     //        }
     //    }
    // }

    useEffect(() => {
        if (state.timeoutId) {
            window.clearTimeout(state.timeoutId);
        }
        if (pushActive) {
            let timeoutId = window.setTimeout(() => {
                setState({...state, toggle: false})
            }, 500);
            setState({
                ...state,
                timeoutId,
                toggle: !loading,
                last: data?.update
            });
        }
    },[data?.update, pushActive])

    return {toggle: state.toggle, value: pushActive ? data?.update : state.last}
}

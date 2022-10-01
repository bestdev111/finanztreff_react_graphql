import {Dispatch, SetStateAction, useEffect, useState} from "react";

export function useDelayedState<T>(initialState: T, delay: number): [T, Dispatch<SetStateAction<T>>, T] {
    const [state, setState] = useState<T>(initialState);
    const [transitionalState, setTransitionalState] = useState<T>(initialState);

    useEffect(() => {
        const timeOutId = setTimeout(() => setState(transitionalState), delay);
        return () => clearTimeout(timeOutId);
    }, [transitionalState, delay]);

    return [state, setTransitionalState, transitionalState];
}
import { useEffect, useRef } from "react";

export const useEffectSkipFirst = (callback, dependencies) => {
    const wasChanged = useRef(false);

    useEffect(function() {
        if (wasChanged.current) {
            callback();
            return;
        }
        wasChanged.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
};
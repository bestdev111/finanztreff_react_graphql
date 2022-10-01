import {useViewport} from "./useViewport";

export interface ResponsiveMap {
    xl?: any;
    lg?: any;
    md?: any;
    sm?: any;
    xs?: any;
    default?: any;
}

export function useBootstrapBreakpoint(responsiveMap?: ResponsiveMap) {
    const {width} = useViewport();
    let breakpoint = calBreakpoint(width);
    if (responsiveMap) {
        return findVal(breakpoint, responsiveMap)
    } else {
        return {breakpoint};
    }
}


//check src/styles/theme.scss for reference
//$grid-breakpoints: (
//     xs: 0,
//     sm: 360px,
//     md: 768px,
//     lg: 768px,
//     // lg: 992px,
//     xl: 1280px,
// );

function calBreakpoint(width: number) {
    if (width >= 1280) {
        return 'xl';
    } else if (width >= 768) {
        return 'lg';
    } else if (width >= 768) {
        return 'md';
    } else if (width >= 360) {
        return 'sm';
    } else {
        return 'xs';
    }
}

const breakpointMap = {
    xs: 'default',
    sm: 'xs',
    md: 'sm',
    lg: 'md',
    xl: 'lg'
};

function isDefined(val: any) {
    return val !== undefined;
}

function findVal(breakpoint: string, responsiveMap: ResponsiveMap): any {
    if (isDefined(breakpoint)) {
        // @ts-ignore
        let value = responsiveMap[breakpoint];
        if (isDefined(value)) {
            return value;
        } else {
            // @ts-ignore
            return findVal(breakpointMap[breakpoint], responsiveMap);
        }
    }
}
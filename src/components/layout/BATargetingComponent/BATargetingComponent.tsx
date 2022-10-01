import { HTMLDOMElement } from "highcharts";
import keycloak from "keycloak";
import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

interface BATargetingComponentProps{
    pathname?: string
    children?: any
    footerRef?: React.MutableRefObject<HTMLDivElement | null>;
}

export function BATargetingComponent(props: BATargetingComponentProps){
    return(
        <>
            {props.children && props.children}
        </>
    )
}
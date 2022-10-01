import { Analysis } from "generated/graphql";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import StackGrid from "react-stack-grid";
import AnalysisItem from "./AnalysisItem";
import {useRef} from "react";

interface AnalysesGridComponentProps {
    analyses: Analysis[];
    isHomeComponent ?: boolean
}

export function AnalysesGridComponent(props: AnalysesGridComponentProps){
    const columnWidth = useBootstrapBreakpoint({
        xl: '33.33%',
        lg: '50%',
        sm: '100%'
    });

    const gridRef = useRef();
    const updateGridLayout = () => {
        // @ts-ignore
        gridRef?.current?.updateLayout();
    };

    if (props.analyses.length === 0) {
        return <h5 className= "d-flex justify-content-center mt-30px">Keine Analysen gefunden!</h5>
    }
    
    return (
        <StackGrid  monitorImagesLoaded={true} duration={0} gridRef={updateGridLayout}   columnWidth={columnWidth}>
            {props.analyses.map((value, cursor) =>
                <AnalysisItem isHomeComponent={props.isHomeComponent} key={cursor} analysis={value} instrument={value.group?.main || undefined}/>)}
        </StackGrid>

    );
}

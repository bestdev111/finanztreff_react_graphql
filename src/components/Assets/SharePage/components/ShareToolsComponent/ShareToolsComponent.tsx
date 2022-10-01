import { useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { InstrumentGroup } from "../../../../../generated/graphql";
import { AlternativesFromUnderlineComponent } from "./AltervativesFromUnderlineComponent/AlternativesFromUnderlineComponent";

export const ShareToolsComponent = (props: ShareToolsSectionProps) => {
    var pathname: string = "/";
    const usePathname = () => {
        const location = useLocation();
        if(location.pathname.split('/')[1].length > 0){
            pathname = location.pathname.split('/')[1];
        }else{
            pathname = "/"
        }
        
    }
    usePathname();
    let cadContainer = useRef<HTMLDivElement | null>(null);
    useEffect(() =>{
        if(cadContainer.current !== null){
            let elementScriptCad = document.createElement('script');
            elementScriptCad.type = 'text/javascript';
            elementScriptCad.text = `Ads_BA_AD('CAD')`;
            if(cadContainer.current !== null && cadContainer.current.hasChildNodes()){
                cadContainer.current.innerHTML = '';
            }
            if(cadContainer.current !== null && !cadContainer.current.hasChildNodes()){
                cadContainer.current.appendChild(elementScriptCad);
            }
        }
    },[cadContainer, pathname])
    return (
        <section className="main-section mb-3" id="zugehorige-produkte">
            <div className="container">
                <h2 className="section-heading font-weight-bold mb-n2 mb-md-n1 ml-n1 ml-sm-n2 ml-md-0" id="tools-anchor">Zugehörige Produkte auf {props.group.name}</h2>
                <Row>
                    <Col xl={9} sm={12} className="pr-xl-28px">
                        <AlternativesFromUnderlineComponent groupId={props.group}/>
                    </Col>

                    <Col xl={3} sm={12} className="pl-xl-0 pl-xl-1 ml-xl-n3 pr-xl-0">
                        <div className="content-wrapper banner-advert-wrapper height-100 width-300">
                                <div id='Ads_BA_CAD' ref={cadContainer}></div>
                        </div>
                    </Col>
                </Row>

            </div>
        </section>
    );
}

export interface ShareToolsSectionProps {
    group: InstrumentGroup;
}

import { useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { HeaderComponent } from './HeaderComponent/HeaderComponent';
import { FooterComponent } from './FooterComponent';
import { ContactSupportAndScrollSection } from './FeedbackAndScrollToTop/ContactSupportAndScrollSection';
import './LayoutComponent.scss'
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';
import keycloak from 'keycloak';
import {guessInfonlineSection, trigInfonline} from "../common/InfonlineService";

interface LayoutComponentProps{
    children: any
}

export function LayoutComponent(props: LayoutComponentProps){
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
        const skyContainer = useRef<HTMLDivElement | null>(null);


        useEffect(() => {
            if(skyContainer.current !== null){
                let elementScriptSky = document.createElement('script');
                elementScriptSky.type = 'text/javascript';
                elementScriptSky.text = `Ads_BA_AD('SKY');`;
                if(skyContainer.current !== null && skyContainer.current.hasChildNodes()){
                    skyContainer.current.innerHTML = '';
                }
                if(skyContainer.current !== null && !skyContainer.current.hasChildNodes() && (pathname !== 'mein-finanztreff' || keycloak.authenticated)){
                    skyContainer.current.appendChild(elementScriptSky);
                }
            }
        },[skyContainer, pathname])
        const isPc= useMediaQuery({
            query: '(min-width: 1280px)'
        });

        const isTablet = useMediaQuery({
            query: '(min-width: 768px)'
        })

        return (
            <>
                {
                ((isPc || isTablet)) ? 
                <>  
                    <Container className ="advertisment-container">
                        <div className="d-flex">  
                            <Container className={"main-wrapper"}>
                                <HeaderComponent />
                                {props.children}
                                <FooterComponent />
                            </Container>
                            <div id="skyscraper" className="sky-container-col">
                                        <div id='Ads_BA_SKY'ref={skyContainer}></div>
                            </div>
                        </div>
                    </Container>
                    <ContactSupportAndScrollSection className = "fixed-bottom skyad-placement"/>
                </>
                :
                <>
                    <Container className={"main-wrapper"}>
                        <HeaderComponent />
                        {props.children}
                        <FooterComponent />
                    </Container>
                    <ContactSupportAndScrollSection className = "fixed-bottom"/>
                </>
                }
            </>
        );
}

import { useEffect, useRef } from 'react';
import SvgImage from 'components/common/image/SvgImage';
import { Col, Row } from 'react-bootstrap';
import { ChangelogModal } from './ChangelogModa';
import './FooterComponent.scss'
import { useLocation } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { WelcomeBeta } from './WelcomeBeta';
import {trigInfonline} from "../common/InfonlineService";

export function FooterComponent() {
    let { initialized, keycloak } = useKeycloak();
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
    let footerContainer = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if(footerContainer.current !== null){
            let elementScriptFooter = document.createElement('script');
            elementScriptFooter.type = 'text/javascript';
            elementScriptFooter.text = `Ads_BA_AD('FOOT');`
            if(footerContainer.current !== null && footerContainer.current.hasChildNodes()){
                footerContainer.current.innerHTML = '';
            }
            if(footerContainer.current !== null && !footerContainer.current.hasChildNodes() && (pathname !== 'mein-finanztreff' || keycloak.authenticated)){
                footerContainer.current.appendChild(elementScriptFooter)
            }
        }
    },[footerContainer, pathname])


    return (
        <>
            <div className="ads-responsive-class-footer" style={{ textAlign: 'center' }}>
                <div id='Ads_BA_FOOT' ref={footerContainer}>
                </div>
            </div>
            <footer className="remove-margin-footer">
                <div className="inner-wrapper d-xl-flex justify-content-between d-lg-block d-md-block">
                    <Col xl={7}>
                        <Row className="fs-18px font-weight-bold roboto-heading">Rechtliche Hinweise</Row>
                        <Row className="d-xl-flex d-lg-flex d-md-flex justify-content-between d-sm-block mt-lg-3 mt-sm-4">
                            <div className='mb-sm-3'>
                                <a onClick={()=> trigInfonline("Footer", 'Impressum')} className='text-white' target={"_blank"} rel="noreferrer" href={"https://www.finanztreff.de/service/impressum/"}>
                                    Impressum
                                </a>
                            </div>
                            <div className='mb-sm-3'>
                                <a onClick={()=> trigInfonline("Footer", 'Nutzungshinweise')} className='text-white' target={"_blank"} rel="noreferrer" href={"https://www.finanztreff.de/service/nutzungshinweise/"}>
                                    Nutzungshinweise
                                </a>
                            </div>
                            <div className='mb-sm-3'>
                                <a onClick={()=> trigInfonline("Footer", 'Datenschutz')} className='text-white' target={"_blank"} rel="noreferrer" href={"https://www.finanztreff.de/service/datenschutz/"}>
                                    Datenschutz
                                </a>
                            </div>
                            <div className='mb-sm-3'>
                                <a onClick={()=> trigInfonline("Footer", 'Cookierichtlinie')} className='text-white' target={"_blank"} rel="noreferrer" href={"https://www.finanztreff.de/service/cookierichtlinie/"}>
                                    Cookie-Richtlinie
                                </a>
                            </div>
                            <div className='mb-sm-3'>
                                <a className='text-white' style={{cursor: "pointer"}} onClick={() => appendSettingsToHead()}>
                                    Datenschutzeinstellungen
                                </a>
                            </div>
                            <ChangelogModal />
                            {/* <WelcomeBeta /> */}
                        </Row>
                    </Col>
                    <Col xl={2} className='mt-xl-0 mt-lg-4 mt-md-4 mt-lg-4 mt-sm-5'>
                        <Row className="fs-18px font-weight-bold roboto-heading ml-xl-n2 ml-lg-n3 ml-md-n2 ml-sm-n3">Soziale Medien</Row>
                        <Row className="ml-unset ml-lg-n4 ml-sm-n4 align-center">
                            <Col className='px-0' xl={12} md={6} sm={12}>
                                <a target={"_blank"} rel="noreferrer" href={"https://www.twitter.com/finanztreff/"}>
                                    <SvgImage icon="icon_social_twitter_white.svg" width={"40"} />
                                </a>
                                <a target={"_blank"} rel="noreferrer" href={"https://www.instagram.com/finanztreff/"}>
                                    <SvgImage icon="icon_social_instagram_white.svg" width={"40"} />
                                </a>
                                <a target={"_blank"} rel="noreferrer" href={"https://www.facebook.com/finanztreff.de"}>
                                    <SvgImage icon="icon_social_facebook_white.svg" width={"40"} />
                                </a>
                                <a target={"_blank"} rel="noreferrer">
                                    <SvgImage icon="icon_social_xing_white.svg" width={"40"} />
                                </a>
                            </Col>
                            <Col xl={12} md={6} sm={12} className="px-md-0 px-sm-2 text-md-right text-sm-left text-white mt-md-2 mt-sm-5 mb-md-0 mb-sm-n4 d-xl-none">
                                <a target="_blank" className="text-white" href="http://alt.finanztreff.de">
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_oldversion_white.svg"}
                                        alt="" className="move-arrow-icon mr-2" width="26px" />
                                    Alte Version von finanztreff.de
                                </a>
                            </Col>
                        </Row>
                    </Col>
                </div>
                <Row className="align-items-end">
                    <Col className="version">
                        {`© ${new Date().getFullYear()} finanztreff GmbH `}<span id="appVersion"></span>
                    </Col>
                    <Col className='text-white text-right d-xl-inline d-none'>
                        <a target="_blank" className="text-white" href="http://alt.finanztreff.de">
                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_oldversion_white.svg"}
                                alt="" className="move-arrow-icon mr-2" width="26px" />
                            Alte Version von finanztreff.de
                        </a>
                    </Col>
                </Row>
            </footer>
        </>
    );
}

function appendSettingsToHead(){
    let settingsScript = document.createElement('script');
    settingsScript.type = "text/javascript";
    settingsScript.text = 'Ads_BA_privacyManager(578872)';
    document.head.appendChild(settingsScript)
}

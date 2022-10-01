import classNames from "classnames";
import { SimpleAssetSelectorComponent } from "components/layout/filter/SearchStringSelectorComponent/SimpleAssetSelectorComponent";
import { NewsComponent, NewsComponentMedium } from "components/search/NewsComponent";
import { SearchInstrumentsComponent } from "components/search/SearchInstrumentsComponent";
import { useDelayedState } from "hooks/useDelayedState";
import keycloak from "keycloak";
import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button, FormControl } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import SvgImage from "../image/SvgImage";
import {guessInfonlineSection, trigInfonline} from "../InfonlineService";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from "../TargetingService";
import "./SearchPage.scss";

export function SearchPage() {

    const location = useLocation<string>();
    useEffect(() => {
        trigInfonline('search', 'search')
    }, []
    )

    const BANNER_BUTTONS = [
        { name: "Wertpapiere", id: 0 },
        { name: "Nachrichten", id: 1 }
    ];
    const [activeSection, setActiveSection] = useState<number>(BANNER_BUTTONS[0].id);
    const [searchString, setSearchString, transitionalSearchString] = useDelayedState<string>(location.state || "", 500);
    const inputRef = useRef<HTMLInputElement>(null);



    return (
        <main className={"home-page-wrapper search-result-page"}>
            <Helmet>
                <title>finanztreff.de - Wertpapiersuche | Nachrichtensuche</title>
                <meta name="description"
                    content="Suchen und finden ✔ Sie Ihre Wertpapiere und Nachrichten ➨ auf finanztreff.de topaktuell und kostenlos!" />
                <meta name="keywords"
                    content="WKN Suche, ISIN Suche, Wertpapiere Kurse, Kurs Wertpapier, Wertpapiersuche, WKN Börse, Kurse nachbörslich" />
            </Helmet>
            <>
                <Helmet>
                    <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated),null,null,null, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
                    <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
                </Helmet>
            </>
            <div className="fader"></div>
            <Container className="bg-gray-dark py-2">
                
            <Row className="justify-content-start mb-3">
                        <Col>
                            <div style={{ marginBottom: 2 }} className="font-weight-bold d-flex ml-1 text-nowrap">
                                <SvgImage icon="icon_search_white.svg" spanClass="arrow ml-n2 pr-md-0 pr-2 ml-md-0 ml-xl-0 svg-grey mr-2"
                                    imgClass="flame-icon ml-1 ml-xl-n1 ml-md-n1" width="28" />
                                <h1 className={"font-weight-bold text-light fs-24px ml-n2 ml-md-0 ml-xl-0 page-title mb-n1 d-xl-block d-lg-block d-md-block d-sm-none"}>Allgemeine Wertpapiersuche</h1>
                                <h3 className={"font-weight-bold text-light fs-22px ml-n2 ml-md-0 ml-xl-0 page-title mb-n1 d-xl-none d-lg-none d-md-none d-sm-block"}>Allgemeine Wertpapiersuche</h3>
                            </div>
                        </Col>
                    </Row>
                <Row className="">
                    <Col lg={6} xs={12} className="mt-md-1 mt-sm-2" >
                        <FormControl placeholder="Suchbegriff eingeben" className="w-100 search-field"
                            ref={inputRef}
                            value={transitionalSearchString}
                            onChange={control => setSearchString(control?.target?.value)} />
                    </Col>
                    {BANNER_BUTTONS.map((current, index: number) =>

                        <Col lg={3} xs={6} className="text-right pl-md-0 pl-sm-3 mt-md-1 mt-sm-2 pr-md-4">
                            <Button variant="primary" key={index} className={classNames(" w-100 mb-2 share-search-buttons", index !== activeSection && "bg-gray-light border-gray-light text-dark")}
                                onClick={() => {
                                setActiveSection(current.id);
                                    trigInfonline(guessInfonlineSection(),'searchpage');
                                }}
                            >
                                {current.name}
                            </Button>
                        </Col>
                    )}
                </Row>
            </Container>
            <Container className="securities-results mt-4">
                <Row>
                    {activeSection === 0 &&
                        <Col id="instruments-search-result" style={{ overflowX: 'clip' }} xs={12} xl={12} className="result-col">
                            <h3 className="col-title">Wertpapiere</h3>
                            {
                                searchString &&
                                <SearchInstrumentsComponent searchString={searchString}
                                    closeTrigger={() => { }} />
                            }
                        </Col>
                    }
                    {
                        activeSection === 1 &&
                        <Col id="news-search-result" style={{ overflowX: 'clip' }} xs={12} xl={12} className="result-col news-col mt-md-5 mt-xl-0 mt-sm-5">
                            <h3 className="col-title">Nachrichten</h3>
                            {searchString && <NewsComponent searchString={searchString.toUpperCase()} />}
                            {searchString && <NewsComponentMedium searchString={searchString.toUpperCase()} />}
                        </Col>
                    }
                </Row>
            </Container>
        </main>
    );
}

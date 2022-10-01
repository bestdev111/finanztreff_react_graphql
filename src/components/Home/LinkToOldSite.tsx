import { Container, Row, Col } from "react-bootstrap";

export function LinkToOldSite(){
    return(
        <Container className="bg-white custom-height fs-14px">
            <Row className="align-items-center">
                <span className="bg-pink text-pink custom-height custom-width">.</span>

                <Col xs={1} className="pl-md-3 pl-sm-2 pr-0">
                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_oldversion_dark.svg"}
                        alt="" className="move-arrow-icon" width="26px" />
                </Col>
                <Col className='pl-0 ml-xl-n5 ml-lg-n2 ml-md-n2 ml-sm-3'>Unsere bisherige Version ist weiterhin unter <a target="_blank" className="font-weight-bold" href="http://alt.finanztreff.de">https://alt.finanztreff.de</a> für Sie erreichbar. Möchten Sie mehr über die neue finanztreff.de BETA erfahren?  <a target="_blank" className="font-weight-bold" href="https://alt.finanztreff.de/zukunft">Hier geht's zur Infoseite.</a>
                </Col>
            </Row>
        </Container>
    );
}

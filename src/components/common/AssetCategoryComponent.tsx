import { Col, Container, Row } from "react-bootstrap";

export function AssetCategoryComponent({ pairs }: { pairs: { name: string, value: string | undefined }[] }) {
    const PAIRS = pairs.filter(pair => !!pair.value)
    return (

        <Container className="px-2">
            <Row className="justify-content-between">
                {PAIRS.map((pair, index) =>
                    <Col xl={index===PAIRS.length-1 ? 12/(index+1) : 12/PAIRS.length} lg={index===PAIRS.length-1 ? index*6 : 6} md={12} sm={12} className="px-0" key={index}>
                        <div className="bg-white mx-2 px-2 content-wrapper py-2">
                            <div className="fs-15px">
                                {pair.name}
                            </div>
                            <div className="fs-18px font-weight-bold">
                                {pair.value}
                            </div>
                        </div>
                    </Col>
                )}
            </Row>
        </Container>
    );
}
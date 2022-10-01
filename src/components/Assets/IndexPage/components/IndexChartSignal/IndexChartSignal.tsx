import { Button, Col, Row } from "react-bootstrap";
import ChartSignalComponent from "./ChartSignalComponent";
import { useBootstrapBreakpoint } from "../../../../../hooks/useBootstrapBreakpoint";

interface IndexChartSignalProps {
    productName: string
}

export const IndexChartSignal = ({ productName }: IndexChartSignalProps) => {
    const disabledSectionWidth = useBootstrapBreakpoint({
        sm: "97.5%",
        md: "96%",
        xl: "96.7%",
        default: "97.5%"
    })

    const disabledSectionHeight = useBootstrapBreakpoint({
        xl: "82.2%",
        default: "100%"
    })
    return (
        <>
            <div className="coming-soon-component index-chart-signal">
                <span className="text-white fs-18px coming-soon-text d-flex justify-content-center">Coming soon...</span>
            </div>
            <div className={"content-wrapper bg-white px-xl-4 px-2"} style={{ boxShadow: "#00000029 0px 3px 6px" }}>
                <div className={"content py-3"}>
                    <h3 style={{ fontSize: 18, fontFamily: 'Roboto Slab' }}
                        className="content-wrapper-heading font-weight-bold mb-n1">
                        Chartsignale {productName}
                    </h3>
                    <Row>
                        <Col xl={6} md={6} sm={12} className={"pr-md-0"}>
                            <ChartSignalComponent heading={"Long"} headingColor={"bg-green"} />
                        </Col>
                        <Col xl={6} md={6} sm={12}>
                            <ChartSignalComponent heading={"Short"} headingColor={"bg-pink"} />
                        </Col>
                    </Row>
                </div>
                <div className={"d-flex justify-content-end py-3"}>
                    <Button>Alle Chartsignale...</Button>
                </div>
            </div>
        </>
    )
}

export default IndexChartSignal

import React from "react";
import {Col, Row} from "react-bootstrap";
import Product from "./Product";
import classNames from "classnames";

export const MatchingProducts = (props: React.HTMLAttributes<HTMLElement>) => {
    return (
        <>
        <div className={classNames("coming-soon-component matching-products-section", props.className)}>
            <span className="text-white fs-18px coming-soon-text d-flex justify-content-center">Coming soon...</span>
        </div>
        <div className={classNames("content-wrapper", props.className)}>
            <h3 className="content-wrapper-heading font-weight-bold">
                Passende Produkte unserer Partner
            </h3>
            <div className="content px-xl-2">
                <Row>
                    <Col xs={12} md={4} className="py-2 px-lg-1 px-xl-2 py-xl-1">
                        <Product tage={"12 Tage"} title={"Put"} headingColor="bg-pink" wknValue="123456" pieChartValue={10} pieChartColor="#ff4d7d"
                        />
                    </Col>
                    <Col xs={12} md={4} className="py-2 px-lg-1 px-xl-2 py-xl-1">
                        <Product tage={"94 Tage"} title={"Dieser Wert"} headingColor="bg-gray" wknValue="123456" pieChartValue={25} pieChartColor="#FF8D38"
                        />
                    </Col>
                    <Col xs={12} md={4} className="py-2 px-lg-1 px-xl-2 py-xl-1">
                        <Product tage={"324 Tage"} title={"Call"} headingColor="bg-green" wknValue="123456" pieChartValue={60} pieChartColor="#18C48F"
                        />
                    </Col>
                </Row>
            </div>
        </div>
        </>
    )
}

export default MatchingProducts
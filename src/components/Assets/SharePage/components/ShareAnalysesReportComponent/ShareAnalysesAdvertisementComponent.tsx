import { Query } from "generated/graphql";

export function ShareAnalysesAdvertisementComponent(props: {data: Query}) {
    return (
        <div className="row row-cols-xl-1 row-cols-lg-3 row-cols-sm-1 stock-info-wrapper-row one-at-row">

            <div className="col">
                <div
                    className="stock-info-wrapper with-bottom-border-bg positive-movement d-flex justify-content-between">
                    <div className="inner-data">
                        <div className="type-of-movement-title font-weight-bold mb-10px">
                            Steigend
                        </div>
                        <div className="font-weight-bold font-size-12px">
                            Discount-<br />Zertifikat
                        </div>
                    </div>
                    <div className="inner-data align-self-end">
                        <div className="font-size-12px">
                            WKN: <span className="font-weight-bold">LB1E7K</span>
                        </div>
                        <div className="font-size-12px">
                            Rendite p.a.: <span className="font-weight-bold">+54,84%</span>
                        </div>
                    </div>
                    <div className="inner-data text-right">
                        <img src="/static/img/ubs.png" alt="UBS" className="img-fluid mb-10px" />
                        <div className="font-size-12px">
                            Bid: <span className="font-weight-bold">50,86</span>
                        </div>
                        <div className="font-size-12px">
                            Ask: <span className="font-weight-bold">51,06</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col">
                <div
                    className="stock-info-wrapper with-bottom-border-bg constant-movement d-flex justify-content-between">
                    <div className="inner-data">
                        <div className="type-of-movement-title font-weight-bold mb-10px">
                            Gleichbleibend
                        </div>
                        <div className="font-weight-bold font-size-12px">
                            Discount-<br />Zertifikat
                        </div>
                    </div>
                    <div className="inner-data align-self-end">
                        <div className="font-size-12px">
                            WKN: <span className="font-weight-bold">LB1E7K</span>
                        </div>
                        <div className="font-size-12px">
                            Rendite p.a.: <span className="font-weight-bold">+54,84%</span>
                        </div>
                    </div>
                    <div className="inner-data text-right">
                        <img src="/static/img/ubs.png" alt="UBS" className="img-fluid mb-10px" />
                        <div className="font-size-12px">
                            Bid: <span className="font-weight-bold">50,86</span>
                        </div>
                        <div className="font-size-12px">
                            Ask: <span className="font-weight-bold">51,06</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col">
                <div
                    className="stock-info-wrapper with-bottom-border-bg negative-movement d-flex justify-content-between">
                    <div className="inner-data">
                        <div className="type-of-movement-title font-weight-bold mb-10px">
                            Fallend
                        </div>
                        <div className="font-weight-bold font-size-12px">
                            Discount-<br />Zertifikat
                        </div>
                    </div>
                    <div className="inner-data align-self-end">
                        <div className="font-size-12px">
                            WKN: <span className="font-weight-bold">LB1E7K</span>
                        </div>
                        <div className="font-size-12px">
                            Rendite p.a.: <span className="font-weight-bold">+54,84%</span>
                        </div>
                    </div>
                    <div className="inner-data text-right">
                        <img src="/static/img/ubs.png" alt="UBS" className="img-fluid mb-10px" />
                        <div className="font-size-12px">
                            Bid: <span className="font-weight-bold">50,86</span>
                        </div>
                        <div className="font-size-12px">
                            Ask: <span className="font-weight-bold">51,06</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
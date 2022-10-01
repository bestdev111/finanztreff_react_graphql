interface StockAnalysesCardProps {
    name: string;
    positiveValue: number;
    negativeValue: number;
    neutralValue: number;
}

function StockAnalysesCard({ name, negativeValue, neutralValue, positiveValue }: StockAnalysesCardProps) {
    return (
        <>
            <div className={"border-2 border-border-gray"}>
                <div className={"product-type-wrapper pb-4"}>
                    <span className={"font-weight-bold text-truncate ml-1"}>{name}</span>
                    <br />
                </div>
                <div className="bar-holder pt-3 mb-5 m-1">
                    <div
                        className="horizontal-bar-movement height-big progress justify-content-between with-floating-text">
                        <div className="progress-bar bg-green" role="progressbar" style={{ width: "60%", height: "16px" }}>
                            <div className="h-bar-pointer-floating text-green mt-n5" style={{ left: 0 }}>
                                <div className="pointer-name font-weight-bold text-left" style={{ marginBottom: "8px", marginTop: "-2px" }}>{positiveValue}</div>
                                <span className={"text-dark font-weight-bold"}>Positiv</span>
                            </div>
                        </div>
                        <div className="progress-bar bg-yellow" role="progressbar" style={{ width: "30%", height: "16px", marginRight: "1px", marginLeft: "2px" }}>
                            <div className="h-bar-pointer-floating bottom-pointer single-pointer" style={{ right: 45 }}>
                                <div className="h-bar-pointer-floating text-yellow">
                                    <div className="pointer-name font-weight-bold mt-n2 text-right">{neutralValue}
                                        <div className="pointer-name text-dark font-weight-bold" style={{ marginTop: "13px" }}>Neutral</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="progress-bar bg-pink" role="progressbar" style={{ width: "20%", height: "16px", marginLeft: "1px" }}>
                            <div className="h-bar-pointer-floating text-pink mt-n0" style={{ right: 0 }}>
                                <div className="pointer-name font-weight-bold text-right" style={{ marginBottom: "8px", marginTop: "-31px" }}>{negativeValue}</div>
                                <span className={"text-dark mt-3 font-weight-bold"}>Negativ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StockAnalysesCard

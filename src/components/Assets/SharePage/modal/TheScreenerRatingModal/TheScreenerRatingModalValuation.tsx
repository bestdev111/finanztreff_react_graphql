import SvgImage from "components/common/image/SvgImage";

export interface TheScreenerRatingModalValuationProps {
    valuationRating: number;
}

export function TheScreenerRatingModalValuation(props: TheScreenerRatingModalValuationProps) {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title d-flex justify-content-between">
                    <span className={"ml-n1"}>Preisbewertung</span>
                    <span>
                        {props.valuationRating === -2 &&
                            <>
                                <SvgImage icon="icon_arrow_short_fulldown_red.svg" imgClass="svg-red" convert={false} width="28"/>
                                <SvgImage icon="icon_star.svg" imgClass="svg-blue" convert={false} width="32"/>
                            </>
                        }
                        {
                            props.valuationRating === -1 &&
                            <>
                                <SvgImage icon="icon_arrow_short_halfdown_red.svg" imgClass="svg-red" convert={false} width="28"/>
                                <SvgImage icon="icon_star.svg" imgClass="svg-blue" convert={false} width="32"/>
                            </>
                        }
                        {
                            props.valuationRating === 0 &&
                            <>
                                <SvgImage icon="icon_arrow_short_right_grey.svg" imgClass="svg-grey" convert={false} width="28"/>
                                <SvgImage icon="icon_star.svg" imgClass="svg-blue" convert={false} width="32"/>
                            </>
                        }
                        {props.valuationRating === 1 &&
                            <>
                                <SvgImage icon="icon_arrow_short_halfup_green.svg" imgClass="svg-green" convert={false} width="28"/>
                                <SvgImage icon="icon_star_filled.svg" imgClass="svg-blue" convert={false} width="32"/>
                            </>
                        }
                        {props.valuationRating === 2 &&
                            <>
                                <SvgImage icon="icon_arrow_short_fullup_green.svg" imgClass="svg-green" convert={false} width="28"/>
                                <SvgImage icon="icon_star_filled.svg" imgClass="svg-blue" convert={false} width="32"/>
                            </>
                        }
                    </span>
                </h5>
                {
                    props.valuationRating === -2 &&
                    <>
                        <p className="card-text ml-n1"> Stark überbewertet </p>
                        <p className="card-text ml-n1"> Auf Basis des Wachstumspotentials und anderer Messwerte erscheint der Kurs
                            zur Zeit wesentlich zu hoch. </p>
                    </>
                }
                {
                    props.valuationRating === -1 &&
                    <>
                        <p className="card-text ml-n1"> Leicht überbewertet </p>
                        <p className="card-text ml-n1"> Auf Basis des Wachstumspotentials und anderer Messwerte erscheint der Kurs
                            zur Zeit leicht überhöht. </p>
                    </>
                }
                {
                    props.valuationRating === 0 &&
                    <>
                        <p className="card-text ml-n1"> Fairer Preis </p>
                        <p className="card-text ml-n1"> Auf Basis des Wachstumspotentials und anderer Messwerte erscheint der Kurs angemessen. </p>
                    </>}
                {
                    props.valuationRating === 1 &&
                    <>
                        <p className="card-text ml-n1"> Leicht unterbewertet </p>
                        <p className="card-text ml-n1"> Auf Basis des Wachstumspotentials und anderer Messwerte erscheint die
                            Aktie leicht unterbewertet. </p>
                    </>
                }
                {
                    props.valuationRating === 2 &&
                    <>
                        <p className="card-text ml-n1"> Stark unterbewertet </p>
                        <p className="card-text ml-n1"> Auf Basis des Wachstumspotentials und anderer Messwerte erscheint die
                            Aktie stark unterbewertet. </p>
                    </>
                }
            </div>
        </div>
    )
}

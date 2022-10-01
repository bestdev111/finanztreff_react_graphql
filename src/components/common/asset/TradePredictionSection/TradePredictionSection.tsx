import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import './TradePredictionSection.scss';
import { MonteCarloChart } from "./PerformanceAndTradePredictionCharts/MonteCarloChart";
import { OwnPredictionChart } from "./PerformanceAndTradePredictionCharts/OwnPredictionChart";
import { loader } from "graphql.macro";
import { useQuery } from "@apollo/client";
import { Spinner } from "react-bootstrap";
import { InstrumentGroup, Query } from "graphql/types";
import moment from "moment";
import {guessInfonlineSection, trigInfonline} from "../../InfonlineService";

export const TradePredictionSection = forwardRef((props: { instrumentId?: number, instrumentGroup: InstrumentGroup }, ref) => {
    let [state, setState] = useState({ instrumentId: props.instrumentId });

    useImperativeHandle(ref, () => ({
        changeInstrument(id: number) {
            setState({ ...state, instrumentId: id });
        }
    })
    );

    const [showWieText, setShowWieText] = useState<boolean>(false);
    const instrument = props.instrumentGroup.content.filter(current => current.id === state.instrumentId)[0] ||
        props.instrumentGroup.content.filter(current => current.main)[0];

    let { loading, data } = useQuery<Query>(
        loader('./getInstrumentChartPerformance.graphql'),
        {
            variables: {
                instrumentId: instrument?.id,
                from: moment().subtract(6, 'months').format('YYYY-MM-DD'),
                to: moment().format('YYYY-MM-DD')
            }, skip: !instrument
        }
    );

    const [activeTab, setActiveTab] = useState<'monte' | 'eigenes'>();

    useEffect(() => {
        setActiveTab(data && data.instrument && data.instrument.monteCarlo ? 'monte' : 'eigenes');
    }, [loading]);

    if (loading) {
        return (
            <div className={"p-1 text-center mt-3"} style={{ height: "70px" }}><Spinner animation="border" /></div>
        );
    }

    if (data && data.instrument && (data.instrument.monteCarlo || data?.instrument?.quoteHistory.edges.length > 0)) {
        return (
            <section className="main-section trade-prediction-section">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="content-wrapper">
                                <div className="row">
                                    <div className="section-left-part col-xl-9 col-lg-12 col-sm-12 padding-right-26 pr-lg-3">
                                        <div className="heading-with-info d-flex justify-content-between align-items-center">
                                            <div className="button-row d-flex justify-content-start">
                                                <button className={"btn d-lg-block d-sm-none" + (activeTab === "monte" ? " btn-primary" : "")} disabled={data && !data.instrument.monteCarlo}
                                                    onClick={() => {
                                                        setActiveTab('monte')
                                                        trigInfonline(guessInfonlineSection(), 'monteCarlo')
                                                    }}>
                                                    Monte Carlo Simulation (95%)
                                                </button>
                                                <button className={"btn d-lg-block d-sm-none" + (activeTab === "eigenes" ? " btn-primary" : "")}
                                                    onClick={() => {
                                                        setActiveTab('eigenes')
                                                        trigInfonline(guessInfonlineSection(), 'monteCarlo')
                                                    }}>
                                                    Eigenes Kursziel festlegen
                                                </button>
                                            </div>
                                            <div className="button-row d-flex justify-content-end">
                                                <a href={""} onClick={(e) => {
                                                    setShowWieText(true);
                                                    e.preventDefault();
                                                }}>Wie funktioniert's?</a>
                                            </div>
                                        </div>

                                        <div className="content">
                                            {!loading && data &&
                                                <div className="graph-wrapper">
                                                    {
                                                        activeTab === "monte" &&
                                                        <MonteCarloChart
                                                            instrument={data.instrument}
                                                        />
                                                    }
                                                    {
                                                        activeTab === "eigenes" && data.instrument && data.instrument.monteCarlo && data.instrument.quoteHistory &&
                                                        <OwnPredictionChart
                                                            instrument={data.instrument}
                                                        />
                                                    }
                                                </div>
                                            }
                                        </div>
                                        {
                                            showWieText &&
                                            <div className={"wie-hidden " + (showWieText ? 'show' : '')}>
                                                {/*<h2 style={{ fontSize: '20px', color: '#F700FF', fontWeight: "bold" }}>TEXT BENÖTIGT!</h2>*/}
                                                <div>
                                                    Klicken Sie auf „Eigenes Kursziel festlegen“ und verschieben Sie innerhalb des grauen Bereiches den Cursor auf den Zeitpunkt
                                                    und Kurs, den Sie vermuten. Rechts wird Ihnen dann das passende Produkt zu Ihrer Auswahl angezeigt, welches die Vorgaben des
                                                    durchschnittlichen Schlusskurses (dunkelblaue Linie) des Szenarios erfüllt.
                                                </div>
                                                <div className="button-row d-flex justify-content-end pt-4">
                                                    <a href={""} onClick={(e) => {
                                                        setShowWieText(false);
                                                        e.preventDefault();
                                                    }}>
                                                        <span>schließen</span>
                                                        <span className="close-modal-butt svg-icon">
                                                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_blue.svg"} width={"27"} alt="" className="svg-convert svg-blue" />
                                                        </span>
                                                    </a>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
    return (<></>);
})

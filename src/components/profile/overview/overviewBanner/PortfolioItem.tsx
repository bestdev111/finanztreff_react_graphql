import { useState } from 'react';
import { Mutation, Portfolio } from 'graphql/types';
import Highcharts from 'highcharts';
import { calculatePortfoliosTotal, calculateChange, PieChartColors, ertrageFilter, calculatePortfolio, calculatePortfolioErtrage } from '../../utils'
import { numberFormat, numberFormatWithSign } from 'utils/index'
import HighchartsReact from 'highcharts-react-official';
import { Button, Modal } from 'react-bootstrap';
import { ProfileItemsModal } from './ProfileItemsModal';
import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';

function mapInMaster(portfolio: Portfolio, ids: number[]) {
    return {
        "id": portfolio.id,
        "value": ids.includes(portfolio.id)
    }
}

function updateCache(cache: any, changes: any[]) {
    changes.forEach(change => {
        const id = change.id;
        const normalizedId = cache.identify({ id, __typename: 'Portfolio' });
        cache.modify({
            id: normalizedId,
            fields: {
                inMasterPortfolio(cachedValue: any) {
                    return change.value;
                },
            },
            /* broadcast: false // Include this to prevent automatic query refresh */
        });
    });
}

export function PortoflioItem(props: PortfolioItemProps) {

    // const [portfolios, setPortfolios] = useState(props.portfolios.filter(portfolio => portfolio.inMasterPortfolio));
    let portfolios = props.portfolios.filter(portfolio => portfolio.inMasterPortfolio);

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(loader('./updateMasterPortfolio.graphql'));

    function handleList(ids: number[]) {
        const changes: any[] = props.portfolios.map(portfolio => mapInMaster(portfolio, ids));

        mutation({
            variables: {
                "changes": changes
            },
            update(cache) {
                updateCache(cache, changes);
            }
        })
            .then(entry => {

            });

        const newPortfolios = props.portfolios.filter(portfolio => ids.includes(portfolio.id));
        // setPortfolios(newPortfolios);
    }

    let options = {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        colors: PieChartColors,
        chart: {
            type: 'pie',
            backgroundColor: "#383838"
        },
        title: { text: '' },
        credits: { enabled: false },
        plotOptions: {
            pie: {
                innerSize: '70%',
                size: "300px",
                dataLabels: {
                    softConnector: false,
                    connectorColor: "white",
                    connectorShape: "crookedLine",
                    crookDistance: "10%"
                },
            },

            series: {
                pointPadding: 0.4,
                borderWidth: 3,
                borderColor: "#383838",
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    style: {
                        fontSize: "13px",
                        color: "black",
                        fontFamily: "Roboto",
                        backgroundColor: "#383838",
                        textOutline: false,
                        fontWeight: "100"
                    },
                },
                events: {
                    click: function (event: any) {
                        if (event.srcElement instanceof SVGTSpanElement) {
                            return;
                        }
                        else {
                            event.point.color = event.point.color === "rgb(120 120 120)" ? PieChartColors[event.point.index] : "rgb(120 120 120)";
                            let oldList = portfolios.map(current => current.id);
                            oldList.includes((event.point as any).id) ? handleList(oldList.filter(current => current !== (event.point as any).id)) : handleList(oldList.concat((event.point as any).id));
                        }
                    }
                }
            },
        },
        tooltip: {
            headerFormat: "",
            useHtml: true,
            pointFormat: '<span style="color:{point.color};">\u25CF <span style="background-color:"rgb(56 56 56) !important""> {point.name} </span></span>',
            backgroundColor: 'rgba(0 0 0 50)',
        },
        series: [{
            name: "Portfolio",
            backgroundColor: "#383838",
            data:
                props.portfolios.filter(item => item.entries)
                    .map((item, index) => {
                        const [initial, yesterday, last] = calculatePortfolio(item);
                        const ertrage: number = calculatePortfolioErtrage(item);
                        const total = last + ertrage;
                        return ({
                            id: item.id,
                            // color: portfolios.filter(portfolio => portfolio.id === item.id).length > 0 ? PieChartColors[index] : "rgb(120 120 120)",
                            color: item.inMasterPortfolio ? PieChartColors[index] : "rgb(120 120 120)",
                            name: '<a style="color:white" href="/mein-finanztreff/portfolio/' + item.id + '">' + item.name + '(' + item.entries?.length + ')</a>',
                            y: total
                        });
                    })
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 360
                },
                chartOptions: {
                    chart: {
                        height: 200
                    },
                    plotOptions: {
                        pie: {
                            size: "160px",
                        }
                    },
                }
            }]
        }
    };

    function getColor(n: number): string {
        return (n > 0) ? "text-green" :  (n < 0) ? "text-pink" : "";
    }

    const [initial, yesterday, last] = calculatePortfoliosTotal(portfolios);
    const [diff, diffPct] = calculateChange(initial, last);
    const [diffDaily, diffDailyPct] = calculateChange(yesterday, last);

    const konto: number = portfolios
        .map(portfolio => portfolio.accountEntries ? portfolio.accountEntries
            .map(entry => entry.amount)
            .reduce(function (x: number, y: number) { return x + y }, 0) : 0
        )
        .reduce(function (x: number, y: number) { return x + y }, 0);

    const ertrage: number = portfolios
        .map(portfolio => portfolio.accountEntries ? portfolio.accountEntries
            .filter(entry => ertrageFilter(entry))
            .map(entry => entry.amount)
            .reduce(function (x: number, y: number) { return x + y }, 0) : 0
        )
        .reduce(function (x: number, y: number) { return x + y }, 0);
    const ertragePct: number = initial > 0 ? (ertrage / initial) * 100 : 0;

    const total: number = diff + ertrage;
    const totalPct: number = initial > 0 ? (total / initial) * 100 : 0;

    const [isOpen, setOpen] = useState(false);
    const handleOpen = (isOpen: boolean) => setOpen(isOpen);

    return (
        <>
            <div className="carousel-item active" slide-type="my-portfolios">
                <div className="slide-content row">
                    <div className="col">
                        <div className="row">
                            <div className="col">
                                <h1 className="slide-title text-center">
                                    Hallo {props.userName}, hier sehen Sie den Gesamtüberblick über Ihre Portfolios
                                </h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="carousel-item-left-part col-xl-6">
                                <div className="chart-wrapper" mocked-chart="pie-chart-on-dark-no-legend">
                                    <HighchartsReact highcharts={Highcharts} options={options} />
                                    <h5 className="chart-inner-title cursor-pointer" onClick={() => { handleOpen(true) }}>
                                        <div className='fs-20px font-weight-bold mb-n1'>{portfolios.length} von {props.portfolios.length} </div>
                                        <div className="fs-20px font-weight-bold">Portfolios</div>
                                        <div>Aufteilung nach</div>
                                        <div>Gesamtwert</div>
                                    </h5>
                                </div>
                            </div>
                            <div className="carousel-item-right-part col-xl-6">

                                <div className="hor-graph-wrapper">
                                    <div className="top-row">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                Gesamtwert
                                                <span className="text-gray fs-15px ml-2 cursor-pointer whole-sum" onClick={() => { handleOpen(true) }} id='portfolios-list'>({portfolios.length} von {props.portfolios.length})</span>
                                            </div>
                                            <div className="values" id="investment-sum">
                                                {numberFormat(last)} EUR
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hor-graph">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="bar-holder">
                                                    <div className="bar-legend d-flex justify-content-between mb-n2">
                                                        <div>Erträge</div>
                                                        <div className={'values ' + getColor(ertrage) + ' d-flex'}>
                                                            <span>{numberFormatWithSign(ertragePct)} %</span>
                                                            <span>{numberFormatWithSign(ertrage)} EUR</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bar-holder">
                                                    <div className="bar-legend d-flex justify-content-between">
                                                        <div>Kursgewinn</div>
                                                        <div className={'values ' + getColor(diff) + ' d-flex'}>
                                                            <span>{numberFormatWithSign(diffPct)} %</span>
                                                            <span>{numberFormatWithSign(diff)} EUR</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bar-holder big-bar">
                                                    <div className="bar-legend d-flex justify-content-between fs-18px mt-2 total">
                                                        <div>Gesamtgewinn</div>
                                                        <div className={'values ' + getColor(total) + ' d-flex'}>
                                                            <span>{numberFormatWithSign(totalPct)} %</span>
                                                            <span>{numberFormatWithSign(total)} EUR</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bottom-row d-none d-xl-block d-lg-none d-md-none d-sm-none">
                                        <div className="d-flex justify-content-between">
                                            <div>Heute</div>
                                            <div className="values">
                                                <span className={getColor(diffDailyPct)}>{numberFormatWithSign(diffDailyPct)} %</span>
                                                <span className={getColor(diffDaily)}>{numberFormatWithSign(diffDaily)} EUR</span>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div>Konto</div>
                                            <div className="konto-value">{numberFormat(konto)} EUR</div>
                                        </div>
                                    </div>

                                    <div className="bottom-row d-lg-block d-xl-none">
                                        <div className="d-flex justify-content-between">
                                            <div className="d-flex justify-content-between">
                                                <div>Konto</div>
                                                <div className="konto-value">{numberFormat(konto)} EUR</div>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <div>Heute</div>
                                                <div className="values">
                                                    <span className={getColor(diffDailyPct)}>{numberFormatWithSign(diffDailyPct, " %")} </span>
                                                    <span className={getColor(diffDaily)}>{numberFormatWithSign(diffDaily, " EUR")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="mt-2 mx-sm-auto ml-lg-auto mr-xl-3 mr-lg-2 d-flex">
                                <Button variant="primary" className="bg-gray border-dark d-flex mr-3" onClick={() => { handleOpen(true) }}>
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon-gear-white.svg"} alt="" className="options-butt-icon ml-n2 mr-2" width="18" />
                                    <span >Ansicht anpassen</span>
                                </Button>
                                <Button variant="primary" href="#portfolios-section">
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_fulldown_white.svg"} alt="" className="options-butt-icon ml-n2 my-n3" width="25" />
                                    Zu den Portfolios
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen &&
                <ProfileItemsModal inWatchlist={false} isOpen={isOpen} handleOpen={handleOpen} oldItems={portfolios} handleWatchlists={handleList} items={props.portfolios} />
            }
        </>
    );
}

interface PortfolioItemProps {
    userName: String;
    portfolios: Portfolio[];
}

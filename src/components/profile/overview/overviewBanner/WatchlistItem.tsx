import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Mutation, Watchlist, WatchlistEntry } from 'graphql/types';
import { PieChartColors } from 'components/profile/utils';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { ProfileItemsModal } from './ProfileItemsModal';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/client';
import { NewsCountComponent } from 'components/profile/common/NewsCount/NewsCountComponent';

function mapInMaster(watchlist: Watchlist, ids: number[]) {
    return {
        "id": watchlist.id,
        "value": ids.includes(watchlist.id)
    }
}

function updateCache(cache: any, changes: any[]) {
    changes.forEach(change => {
        const id = change.id;
        const normalizedId = cache.identify({ id, __typename: 'Watchlist' });
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

export function WatchlistItem(props: WatchlistItemProps) {

    // const [watchlists, setWatchlists] = useState(props.watchlists.filter(watchlist => watchlist.inMasterPortfolio));
    let watchlists = props.watchlists.filter(watchlist => watchlist.inMasterPortfolio);

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(loader('./updateMasterWatchlist.graphql'));

    function handleList(ids: number[]) {
        const changes: any[] = props.watchlists.map(watchlist => mapInMaster(watchlist, ids));
        
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

        const newWatchlists = props.watchlists.filter(watchlist => ids.includes(watchlist.id));
        // setWatchlists(newWatchlists);
    }

    let isinList : string[] = [];
    watchlists.map(watchlist => watchlist.entries?.filter(entry => entry && entry.instrument && entry.instrument.isin).map(entry => isinList.push(entry!.instrument!.isin!)));
    
    const [isOpen, setOpen] = useState(false);
    const handleOpen = (isOpen: boolean) => setOpen(isOpen);

    // [flops, no difference, tops]
    function classifyEntry(entry: WatchlistEntry): number[] {
        if (entry.snapQuote) {
            if (entry.snapQuote.lastPrice) {
                if (entry.price < entry.snapQuote.lastPrice) {
                    return [0, 0, 1];
                } else if (entry.price > entry.snapQuote.lastPrice) {
                    return [1, 0, 0];
                } else {
                    return [0, 1, 0];
                }
            }
        }
        return [0, 1, 0];
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
                //allowPointSelect: true,
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
                    useHtml: true,
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
                            let oldList = watchlists.map(current => current.id);
                            oldList.includes(event.point.id) ? handleList(oldList.filter(current => current !== event.point.id)) : handleList(oldList.concat(event.point.id));
                        }
                    }
                }
            },
        },
        tooltip: {
            headerFormat: "",
            useHtml: true,
            pointFormat: '<span style="color:{point.color}">\u25CF <span style="background-color:"rgb(56 56 56) !important""> {point.name} </span></span>',
            backgroundColor: 'rgba(0 0 0 50)'
        },
        series: [{
            name: "Watchlists",
            backgroundColor: "#383838",
            data:
                props.watchlists.filter(item => item.entries)
                    .map((item, index) => {
                        return ({
                            id: item.id,
                            // color: watchlists.filter(watchlist => watchlist.id === item.id).length > 0 ? PieChartColors[index] : "rgb(120 120 120)",
                            color: item.inMasterPortfolio ? PieChartColors[index] : "rgb(120 120 120)",
                            name: '<a style="color:white" href="/mein-finanztreff/watchlist/' + item.id + '">' + item.name + '(' + item.entries?.length + ')</a>',
                            y: item.entries && item.entries.length > 0 ? item.entries.length + 1 : 1
                        });
                    }),
            id: "mobile"
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

    const items: number = watchlists
        .map(watchlist => watchlist.entries ? watchlist.entries.length : 0)
        .reduce(function (x: number, y: number) { return x + y }, 0);

    const [flops, nodiff, tops] = watchlists
        .map(watchlist => watchlist.entries ? watchlist.entries : [])
        .map(entries => entries
            .map(entry => classifyEntry(entry))
            .reduce(function (total: number[], num: number[]) { return [total[0] + num[0], total[1] + num[1], total[2] + num[2]]; }, [0, 0, 0])
        )
        .reduce(function (total: number[], num: number[]) { return [total[0] + num[0], total[1] + num[1], total[2] + num[2]]; }, [0, 0, 0]);

    const [flopsPct, nodiffPct, topsPct] = items > 0 ? [(flops / items) * 100, (nodiff / items) * 100, (tops / items) * 100] : [0, 0, 0];

    return (
        <>
            <div className="carousel-item active" slide-type="my-watchlists">
                <div className="slide-content row pr-dn">
                    <div className="col">
                        <div className="row">
                            <div className="col">
                                <h1 className="slide-title text-center">
                                    Hallo {props.userName}, hier sehen Sie den Gesamtüberblick über Ihre Watchlisten
                                </h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="carousel-item-left-part col-xl-6">
                                <div className="chart-wrapper" mocked-chart="pie-chart-on-dark-no-legend-2">
                                    <HighchartsReact highcharts={Highcharts} options={options} />
                                    <h5 className="chart-inner-title" onClick={() => { handleOpen(true) }}>
                                        <div className='fs-20px font-weight-bold mb-n1 cursor-pointer'>{watchlists.length} von {props.watchlists.length} </div>
                                        <div className="fs-20px font-weight-bold">Watchlisten</div>
                                        <div>mit insgesamt</div>
                                        <div>{items} Werten</div>
                                    </h5>
                                </div>
                            </div>
                            <div className="carousel-item-right-part col-xl-6">

                                <div className="hor-progress-bar-wrapper">
                                    <div className="tools-hr-bar">
                                        <div className="top-info text-center">
                                            Tops und Flops in allen Watchlisten
                                            <span className="text-gray fs-15px ml-2 cursor-pointer whole-sum" onClick={() => { handleOpen(true) }}>({watchlists.length} von {props.watchlists.length})</span>
                                        </div>
                                        <div className="bar-holder">
                                            <div className="horizontal-bar-movement height-big progress justify-content-between">
                                                <div className="progress-bar bg-pink" role="progressbar" style={{ width: flopsPct + "%" }}></div>
                                                <div className="progress-bar bg-kurs-grau with-edge-margin" role="progressbar" style={{ width: nodiffPct + "%" }}></div>
                                                <div className="progress-bar bg-green" role="progressbar" style={{ width: topsPct + "%" }}></div>
                                            </div>
                                        </div>
                                        <div className="bottom-info">
                                            <div className="bg-pink">FLOPS <span>({flops})</span></div>
                                            <div className="bg-kurs-grau">Keine Änderung <span>({nodiff})</span></div>
                                            <div className="bg-green">TOPS <span>({tops})</span></div>
                                        </div>
                                    </div>

                                </div>
                                <NewsCountComponent className='news-count-component' isins={isinList}/>
                            </div>
                            <div className="mt-2 mx-sm-auto ml-lg-auto mr-xl-3 mr-lg-2 d-flex">
                                <Button variant="primary" className="bg-gray border-dark d-flex mr-3" onClick={() => { handleOpen(true) }}>
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon-gear-white.svg"} alt="" className="options-butt-icon ml-n2 mr-2" width="18" />
                                    <span >Ansicht anpassen</span>
                                </Button>
                                <Button variant="primary" href="#watchlists-section">
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_fulldown_white.svg"} alt="" className="options-butt-icon ml-n2 my-n3" width="25" />
                                    Zu den Watchlisten
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen &&
                <ProfileItemsModal inWatchlist={true} isOpen={isOpen} handleOpen={handleOpen} oldItems={watchlists} handleWatchlists={handleList} items={props.watchlists} />
            }
        </>
    );
}

interface WatchlistItemProps {
    userName: String;
    watchlists: Array<Watchlist>;
}
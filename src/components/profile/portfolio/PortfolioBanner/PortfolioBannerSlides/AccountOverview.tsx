import { AccountOverviewModal } from '../../../modals';
import { AccountEntry, Portfolio } from 'graphql/types';
import { getTextColorByValue, numberFormat, numberFormatWithSign, quoteFormat } from 'utils'
import { getAssetGroup, getColorOfAssetGroup } from 'components/profile/utils';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';
import classNames from 'classnames';

function getOptions(portfolio: Portfolio) {
    const maxValue = Math.max.apply(Math, portfolio.accountEntries!.map((current, index) => getAmount(index, portfolio))) + 1;
    const minValue = Math.min.apply(Math, portfolio.accountEntries!.map((current, index) => getAmount(index, portfolio))) - 1;
    function getAmount(currentIndex: number, portfolio: Portfolio) {
        let amount: number = 0;
        portfolio.accountEntries!.map((current, index) => {
            if (currentIndex > index)
                return amount;
            else {
                amount += current.amount;
            }
        })
        return amount;
    }
    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        chart: {
            type: 'area',
            backgroundColor: null,
            height: "220px",
            margin: [0, 0, 25, 0]
        },
        title: {
            text: '',
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            borderWidth: 1,
        },
        xAxis: {
            type: 'datetime',
            gridLineColor: 'rgba(255, 255, 255, 0.1)',
            labels: {
                rotation: 0,
                overflow: "overlay"
            },
        },
        yAxis: {
            max: maxValue,
            min: minValue,
            type: 'linear',
            startOnTick: false,
            gridLineColor: 'rgba(255, 255, 255, 0.1)',
            opposite: true,
            title: {
                text: null,
            },
            labels: {
                align: 'right',
                x: 0,
            },
        },
        plotOptions: {
            area: {
                fillOpacity: 0.5,
                marker: {
                    enabled: false
                }
            },
        },
        tooltip: {
            headerFormat: "",
            pointFormat: '<span style="color:{point.color}">\u25CF <span style="color:"black""> {point.name} <b>{point.amount} EUR </b> {point.date} </span></span>'
        },
        credits: {
            enabled: false
        },
        series: [{
            step: true,
            color: 'rgba(31, 220, 162, 1)',
            fillColor: 'rgba(31, 220, 162, 0.3)',
            negativeColor: 'rgba(255, 77, 125, 1)',
            negativeFillColor: 'rgba(255, 77, 125, 0.3)',
            data: portfolio.accountEntries?.map((current: AccountEntry, index: number) => ({
                name: "Kontostand",
                date: quoteFormat(current.entryTime),
                x: moment(current.entryTime).toDate(),
                y: getAmount(index, portfolio),
                amount: numberFormat(getAmount(index, portfolio))
            }))
                .reverse()
        }],
    }
}

export function AccountOverview(props: AccountOverviewProps) {
    const konto: number = props.portfolio.accountEntries ? props.portfolio.accountEntries
        .map(entry => entry.amount)
        .reduce(function (x: number, y: number) { return x + y }, 0) : 0;

    return (
        <Row className="mb-5 mt-2 text-white mt-xl-5">
            <Col xl={6} className="">
                <Row className="text-white fs-15-21-23 mt-2 justify-content-center mb-xl-3 mb-lg-3 mb-sm-2">
                    Kontostand aktuell <b className="ml-2">{numberFormat(konto)} EUR</b>
                </Row>
                <Row>
                    <Col className="">
                        <HighchartsReact highcharts={Highcharts} options={getOptions(props.portfolio)} />
                    </Col>
                </Row>
            </Col>
            <Col xl={6} lg={12} className="pl-5">
                <Row className="text-white fs-15-21-23 mt-2 justify-content-center mb-xl-3 mb-lg-4 mb-sm-2">
                    Letzte Kontobewegungen
                </Row>
                <Row className="w-100">
                    <Col lg={12} className="px-0 pl-xl-5 ">
                        {props.portfolio.accountEntries?.slice(0, 5).map((entry, index) => {
                            const category: string = entry.instrument?.group?.assetGroup ? entry.instrument?.group?.assetGroup : "";
                            return (
                                <Row key={index} className={classNames(index > 2 && "d-xl-flex d-none", "mb-xl-3 mb-lg-1 fs-13-15-17")}>
                                    <Col xl={3} lg={3} md={5} sm={4} className="font-weight-bold fs-13-17-17 px-0">{entry.accountTypeDescriptionEn}</Col>
                                    <Col xl={3} lg={2} md={4} sm={4} className={classNames("text-nowrap text-right pr-2", getTextColorByValue(entry.amount))}>{numberFormatWithSign(entry.amount)} EUR</Col>
                                    <Col xl={2} lg={2} md={2} sm={4} className="text-right fs-13px pt-xl-1 pt-lg-0 pt-sm-0 pr-xl-2 pr-lg-2 pr-sm-0"> {entry.entryTime && quoteFormat(entry.entryTime)}</Col>
                                    <Col xl={4} lg={5} md={5} sm={0} className="d-xl-block d-lg-block d-md-block d-sm-none">
                                        {category &&
                                            <span className="asset-type-tag mr-2 text-truncate" style={{ backgroundColor: getColorOfAssetGroup(category) }}>{getAssetGroup(category)}</span>}
                                        {entry.instrument && entry.instrument.wkn &&
                                            <span className="fs-13px d-xl-inline d-lg-none d-md-none d-sm-inline pt-1 text-truncate">WKN: {entry.instrument.wkn}</span>
                                        }
                                        {entry.securityDescription &&
                                            <span className="fs-13px  d-xl-none d-lg-inline d-md-inline d-sm-none text-nowrap pt-1">{entry.securityDescription.length > 28 ? entry.securityDescription.slice(0, 25) + "..." : entry.securityDescription}</span>
                                        }
                                    </Col>
                                </Row>
                            )
                        }
                        )}
                    </Col>
                </Row>
            </Col>
            <Col className='text-right mt-xl-1 mt-lg-3 mt-md-2 mt-sm-3'>
                <AccountOverviewModal portfolio={props.portfolio} inBanner={true} refreshTrigger={props.refreshTrigger} />
            </Col>
        </Row>
    );
}

interface AccountOverviewProps {
    portfolio: Portfolio;
    refreshTrigger: () => void;
}

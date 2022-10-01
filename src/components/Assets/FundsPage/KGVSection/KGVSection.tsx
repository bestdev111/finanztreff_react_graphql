import { useQuery } from "@apollo/client";
import { FundSearchResultInfo } from "components/funds/FundSearchPage/FundSeachResultInfo";
import { PieChartColors } from "components/profile/utils";
import { Fund, FundCompany, FundCurrency, FundRegion, FundStrategy, FundTopic, FundType, FundTypeBucket, Query } from "generated/graphql";
import { loader } from "graphql.macro";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import "./KVGSection.scss";

export function KGVSection(props: { fund: Fund }) {

    return (
        <div className="content-wrapper">
            <h2 className="content-wrapper-heading font-weight-bold">KVG</h2>
            {props.fund.company && props.fund.company.name &&
                <h3 className="content-wrapper-heading font-weight-bold">{props.fund.company.name}</h3>
            }
            {props.fund.managers && props.fund.managers.length > 0 &&
                <div className="mt-4">
                    <div className="font-weight-bold">Fondsmanager</div>
                    <div>{props.fund.managers[0].lastName}</div>
                </div>
            }
            {props.fund.advisor && props.fund.advisor.name &&
                <div className="mt-3">
                    <div className="font-weight-bold">Fondsadvisor</div>
                    <div>{props.fund.advisor.name}</div>
                    {/* <Button className="border-light bg-lighten-gray text-blue mt-2">Weitere Fonds dieses Managers...</Button> */}
                </div>
            }
            {
                props.fund.company && props.fund.company.address &&
                <div className="mt-3">
                    <div className="font-weight-bold">Adresse:</div>
                    <div>{props.fund.company.address.city}</div>
                    <div>{props.fund.company.address.street}</div>
                    <div>{props.fund.company.address.houseNo}</div>
                    <div>{props.fund.company.address.postCode}</div>
                </div>
            }
            {props.fund.company && props.fund.company.contact &&
                <div className="mt-3">
                    <div className="font-weight-bold">Kontakt: </div>
                    <div>Tel: {props.fund.company.contact.phone} </div>
                    <div>Fax: {props.fund.company.contact.fax}</div>
                    <div>E-mail-Adresse: {props.fund.company.contact.email} </div>
                    <div>Wabsite: {props.fund.company.contact.website}</div>
                </div>
            }
            {
                props.fund.company && props.fund.company.id &&
                <span>
                    <h3 className="content-wrapper-heading font-weight-bold mt-4 mb-0">Weitere Fonds der KVG</h3>
                    <DonutKGV
                        company={props.fund.company} topic={props.fund.topic || undefined}
                        type={props.fund.type || undefined} strategy={props.fund.strategy || undefined}
                        region={props.fund.region || undefined} />
                </span>
            }
        </div>
    )
}

function DonutKGV({ company }: { company: FundCompany, topic?: FundTopic, type?: FundType, strategy?: FundStrategy, region?: FundRegion, currency?: FundCurrency }) {
    const { loading, data } = useQuery<Query>(
        loader('./getFundTypeBucket.graphql'),
        { variables: { companyId: company.id } }
    );
    if (loading) return <Spinner animation="border" />;

    const fundTypeBuckets = data?.fundTypeBucket.filter(current => current && current.count && current.count > 0).map(current => { return { name: current?.fundType?.name || "", y: current && current.count || 0, id: current && current.fundType && current.fundType.id || "" } }) || [];
    return (
        <>
            {
                data && data.fundTypeBucket && data.fundTypeBucket.length > 0 ?
                    <Container style={{ maxWidth: "320px" }} className="px-0">
                        <Row>
                            <Col xs="5" className="px-0 ml-n2 kgv-donut">
                                <HighchartsReact highcharts={Highcharts} options={getOptions(fundTypeBuckets)} />
                            </Col>
                            <Col xs="7" className="px-0 mt-2">
                                {
                                    fundTypeBuckets.map((current, index) =>
                                        <Row className="align-items-center">
                                            <span className="dot mr-1" style={{ backgroundColor: PieChartColors[index], height: "10px", width: "10px" }}></span>
                                            <FundSearchResultInfo companyName={company.name || ""} criteria={{
                                                germanRiesterCapable: undefined,
                                                germanVwlCapable: undefined,
                                                savingPlanCapable: undefined,
                                                distributing: undefined,
                                                fundTopicId: undefined,
                                                fundCurrencyId: undefined,
                                                fundRegionId: undefined,
                                                fundTypeId: current ? parseInt(current.id!) || 0 : 0,
                                                fundStrategyId: undefined,
                                                fundCompanyId: company.id,
                                                srriFrom: undefined,
                                                srriTo: undefined,
                                                foundationDateFrom: undefined,
                                                foundationDateTo: undefined,
                                                keyFigures: undefined
                                            }} enabled={true} buttonChild={<span className="font-weight-bold text-nowrap fs-13px text-blue cursor-pointer"> {current.name} ({current.y}) </span>} />
                                        </Row>
                                    )
                                }
                            </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col className="text-right">
                                <FundSearchResultInfo companyName={company.name || ""} criteria={{
                                    germanRiesterCapable: undefined,
                                    germanVwlCapable: undefined,
                                    savingPlanCapable: undefined,
                                    distributing: undefined,
                                    fundTopicId: undefined,
                                    fundCurrencyId: undefined,
                                    fundRegionId: undefined,
                                    fundTypeId: undefined,
                                    fundStrategyId: undefined,
                                    fundCompanyId: company.id,
                                    srriFrom: undefined,
                                    srriTo: undefined,
                                    foundationDateFrom: undefined,
                                    foundationDateTo: undefined,
                                    keyFigures: undefined
                                }} enabled={true} buttonName="Fonds der KVG anzeigen" />
                            </Col>
                        </Row>
                    </Container>
                    :
                    <></>
            }
        </>
    );
}

function getOptions(data: { name: string, y: number }[]): any {
    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        colors: PieChartColors,
        chart: {
            type: 'pie',
            height: "130px",
            width: 120
        },
        credits: { enabled: false },
        title: {
            text: "",
        },
        legend: { enabled: false },
        plotOptions: {
            pie: {
                innerSize: '65%',
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    connectorShape: 'crookedLine',
                    connectorColor: "black",
                    color: "black",
                    format: '{point.name} ({y})'
                },
                size: "100%",
            },
            series: {
                pointPadding: 0.4,
                borderWidth: 1.5,
                borderColor: "white",
                dataLabels: {
                    enabled: false,
                },
            },
        },
        tooltip: {
            headerFormat: "",
            pointFormat: '<span style="color:{point.color}">\u25CF <span style="color:"black""> {point.name} ({point.y})</span></span>'
        },
        series: [{
            type: 'pie',
            backgroundColor: "white",
            data: data,
        }],
    };
}
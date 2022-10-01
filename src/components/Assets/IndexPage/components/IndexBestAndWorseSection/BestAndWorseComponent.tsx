import {Spinner, Table} from "react-bootstrap";
import {useQuery} from "@apollo/client";
import {loader} from "graphql.macro";
import { Link } from "react-router-dom";
import { getGridPerformanceClass, numberFormat, numberFormatWithSign } from "utils";
import { InstrumentGroup, CompositionPerformanceValue, CompositionPerformacePeriod } from "generated/graphql";

export interface BestAndWorseProps {
    group?: InstrumentGroup;
    title?: string;
}

export const BestAndWorseComponent = function (props: BestAndWorseProps) {
    const {data, loading} = useQuery(
        loader('./getInstrumentGroupCompositionCompare.graphql'),
        {
            skip: !props.group,
            variables: {groupId: props.group?.id}
        }
    );
    if (loading) {
        return (
            <section className={"main-section"}>
                <div className={"container"}>
                    <div className="content-wrapper">
                        <h3 className="content-wrapper-heading font-weight-medium">Beste und
                            schlechteste {props.group?.name} Aktien</h3>
                        <div className="content">
                            <div className={"p-1"} style={{height: "70px"}}><Spinner animation="border"/></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (data && !data.group.compositionPerformance?.periods) {
       return <></>;
    }

    const drawCell = function (v: CompositionPerformanceValue) {
        return (<div className={"stock-wrapper " + getGridPerformanceClass(v.value)} >
            <div className="asset-name text-truncate">
                <Link to={"/aktien/kurse/"+v.group?.seoTag + "/"} className={"text-decoration-none text-light"}>{v.group?.name}</Link>
            </div>
            <div className="course">{numberFormat(v.price)}</div>
            <div className="value">{numberFormatWithSign(v.value, "%")}</div>
        </div>)
    }

    const cells = new Map<string, any>();
    if(data && data.group.compositionPerformance?.periods) {
        data.group.compositionPerformance.periods.forEach(
            (p: CompositionPerformacePeriod) => {
                cells.set(p.period + "_max", p.max ? drawCell(p.max) : <></>);
                cells.set(p.period + "_min", p.min ? drawCell(p.min) : <></>);
                cells.set(p.period + "_current", p.current ? drawCell(p.current) : <></>);
            }
        )
    }

    return (
        <section className={"main-section"}>
            <div className={"container"}>
                <div className="content-wrapper">
                    <h3 className="content-wrapper-heading font-weight-medium ml-xl-0 ml-md-n2 mt-md-0 mt-sm-1 mb-sm-1 ">{props.title}</h3>
                    <div className="content">

                        <Table className="light-table text-center stock-table table-fixed-cells table-spacing-7 table-borderless d-none d-xl-table"
                               beste-schlechteste-table="">
                            <thead className="thead-light">
                            <tr>
                                <th></th>
                                <th>1 Woche</th>
                                <th>1 Monat</th>
                                <th>3 Monate</th>
                                <th>6 Monate</th>
                                <th>1 Jahr</th>
                                <th>3 Jahre</th>
                                <th>5 Jahre</th>
                            </tr>
                            </thead>
                            <tbody  className="thead-light">
                            <tr>
                                <th>Beste</th>
                                <td>{cells.get("WEEK1_max")}</td>
                                <td>{cells.get("MONTH1_max")}</td>
                                <td>{cells.get("MONTH3_max")}</td>
                                <td>{cells.get("MONTH6_max")}</td>
                                <td>{cells.get("WEEK52_max")}</td>
                                <td>{cells.get("YEAR3_max")}</td>
                                <td>{cells.get("YEAR5_max")}</td>
                            </tr>
                            <tr>
                                <th>Schlechteste</th>
                                <td>{cells.get("WEEK1_min")}</td>
                                <td>{cells.get("MONTH1_min")}</td>
                                <td>{cells.get("MONTH3_min")}</td>
                                <td>{cells.get("MONTH6_min")}</td>
                                <td>{cells.get("WEEK52_min")}</td>
                                <td>{cells.get("YEAR3_min")}</td>
                                <td>{cells.get("YEAR5_min")}</td>
                            </tr>
                            { data && data.group.compositionPerformance?.current &&
                            <tr>
                                <th>Veränd. {props.group?.name}</th>
                                <td>{cells.get("WEEK1_current")}</td>
                                <td>{cells.get("MONTH1_current")}</td>
                                <td>{cells.get("MONTH3_current")}</td>
                                <td>{cells.get("MONTH6_current")}</td>
                                <td>{cells.get("WEEK52_current")}</td>
                                <td>{cells.get("YEAR3_current")}</td>
                                <td>{cells.get("YEAR5_current")}</td>
                            </tr>
                            }
                            </tbody>
                        </Table>
                        <Table className="light-table text-center stock-table table-fixed-cells table-spacing-10 table-borderless d-xl-none"
                               beste-schlechteste-table-mobile="">
                            <thead className="thead-light">
                            <tr>
                                <th th-id="0"></th>
                                <th th-id="1">Beste</th>
                                <th th-id="2">Schlechteste</th>
                            { data && data.group.compositionPerformance?.current &&
                                <th th-id="3">Veränd. Dax®</th>
                            }
                            </tr>
                            </thead>
                            <tbody className="thead-light">

                            <tr tbody-row="1">
                                <th><span className="d-none d-md-inline">1 Woche</span> <span className="d-md-none">1W</span></th>
                                <td tbody-row-td="0">
                                    {cells.get("WEEK1_max")}
                                </td>
                                <td tbody-row-td="1">
                                    {cells.get("WEEK1_min")}
                                </td>
                            { data && data.group.compositionPerformance?.current &&
                                <td tbody-row-td="2">
                                    {cells.get("WEEK1_current")}
                                </td>
                            }
                            </tr>
                            <tr tbody-row="2">
                                <th><span className="d-none d-md-inline">1 Monat</span> <span className="d-md-none">1M</span></th>
                                <td tbody-row-td="0">
                                    {cells.get("MONTH1_max")}
                                </td>
                                <td tbody-row-td="1">
                                    {cells.get("MONTH1_min")}
                                </td>
                            { data && data.group.compositionPerformance?.current &&
                                <td tbody-row-td="2">
                                    {cells.get("MONTH1_current")}
                                </td>
                            }
                            </tr>
                            <tr tbody-row="3">
                                <th><span className="d-none d-md-inline">3 Monate</span> <span className="d-md-none">3M</span></th>
                                <td tbody-row-td="0">
                                    {cells.get("MONTH3_max")}
                                </td>
                                <td tbody-row-td="1">
                                    {cells.get("MONTH3_min")}
                                </td>
                            { data && data.group.compositionPerformance?.current &&
                                <td tbody-row-td="2">
                                    {cells.get("MONTH3_current")}
                                </td>
                            }
                            </tr>
                            <tr tbody-row="4">
                                <th><span className="d-none d-md-inline">6 Monate</span> <span className="d-md-none">6M</span></th>
                                <td tbody-row-td="0">
                                    {cells.get("MONTH6_max")}
                                </td>
                                <td tbody-row-td="1">
                                    {cells.get("MONTH6_min")}
                                </td>
                            { data && data.group.compositionPerformance?.current &&
                                <td tbody-row-td="2">
                                    {cells.get("MONTH6_current")}
                                </td>
                            }
                            </tr>
                            <tr tbody-row="5">
                                <th><span className="d-none d-md-inline">1 Jahr</span> <span className="d-md-none">1J</span></th>
                                <td tbody-row-td="0">
                                    {cells.get("WEEK52_max")}
                                </td>
                                <td tbody-row-td="1">
                                    {cells.get("WEEK52_min")}
                                </td>
                            { data && data.group.compositionPerformance?.current &&
                                <td tbody-row-td="2">
                                    {cells.get("WEEK52_current")}
                                </td>
                            }
                            </tr>
                            <tr tbody-row="6">
                                <th><span className="d-none d-md-inline">3 Jahre</span> <span className="d-md-none">3J</span></th>
                                <td tbody-row-td="0">
                                    {cells.get("YEAR3_max")}
                                </td>
                                <td tbody-row-td="1">
                                    {cells.get("YEAR3_min")}
                                </td>
                            { data && data.group.compositionPerformance?.current &&
                                <td tbody-row-td="2">
                                    {cells.get("YEAR3_current")}
                                </td>
                            }
                            </tr>
                            <tr tbody-row="1">
                                <th><span className="d-none d-md-inline">5 Johre</span> <span className="d-md-none">5W</span></th>
                                <td tbody-row-td="0">
                                    {cells.get("YEAR5_max")}
                                </td>
                                <td tbody-row-td="1">
                                    {cells.get("YEAR5_min")}
                                </td>
                            { data && data.group.compositionPerformance?.current &&
                                <td tbody-row-td="2">
                                    {cells.get("YEAR5_current")}
                                </td>
                            }
                            </tr>



                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </section>
    )

}

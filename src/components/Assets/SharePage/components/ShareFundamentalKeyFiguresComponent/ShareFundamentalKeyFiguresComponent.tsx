import { Instrument, InstrumentGroup, Query } from "../../../../../generated/graphql";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { Spinner, Table } from "react-bootstrap";
import moment from "moment";
import { numberFormat, shortNumberFormat } from "../../../../../utils";
import './ShareFundamentalKeyFiguresComponent.scss';
import { FundamentalKeyFiguresModal } from "../../modal/FundamentalKeyFiguresModal";
import { TheScreenerRatingModal } from "../../modal/TheScreenerRatingModal/TheScreenerRatingModal";
import SvgImage from "components/common/image/SvgImage";

export interface ShareFundamentalKeyFiguresComponentProps {
    instrumentGroup: InstrumentGroup;
    instrument?: Instrument;
}

export const ShareFundamentalKeyFiguresComponent = (props: ShareFundamentalKeyFiguresComponentProps) => {
    let { data, loading } = useQuery<Query>(
        loader('./getShareEstimates.graphql'),
        { variables: { groupId: props.instrumentGroup.id }, skip: !props.instrumentGroup.id }
    );

    let { data: screenerData, loading: screenerLoading } = useQuery<Query>(
        loader('./getShareTheScreenerRating.graphql'),
        { variables: { groupId: props.instrumentGroup.id }, skip: !props.instrumentGroup.id }
    );

    if (loading || screenerLoading) {
        return <div className="text-center py-2"><Spinner animation="border" /></div>;
    }

    if (!screenerData?.group?.theScreenerRating && !data?.group?.estimates) {
        return <></>;
    }

    let estimates = data?.group?.estimates;
    let periods = [estimates?.current?.year || moment().year(), estimates?.next?.year || moment().year() + 1];

    return (
        <div className="content-wrapper ml-md-n2 ml-xl-0 ">
            <h3 className="content-wrapper-heading font-weight-bold">Fundamentale Kennzahlen</h3>
            <div className="content">
                <Table variant="figures">
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th className="value">{periods[0]}e</th>
                            <th className="value">{periods[1]}e</th>
                        </tr>
                    </thead>
                    {estimates &&
                        <>
                            <tr>
                                <td> KGV </td>
                                <td> {numberFormat(estimates.current?.priceToEarningsRatio)} </td>
                                <td> {numberFormat(estimates.next?.priceToEarningsRatio)} </td>
                            </tr>
                            <tr>
                                <td> KCV </td>
                                <td> {numberFormat(estimates.current?.priceToCashFlowRatio)} </td>
                                <td> {numberFormat(estimates.next?.priceToCashFlowRatio)} </td>
                            </tr>
                            <tr>
                                <td> KUV </td>
                                <td> {numberFormat(estimates.current?.priceToSalesRatio)} </td>
                                <td> {numberFormat(estimates.next?.priceToSalesRatio)} </td>
                            </tr>
                            <tr>
                                <td> Dividende </td>
                                <td> {numberFormat(estimates.current?.dividendPerShare, ' ' + data?.group?.company?.currency?.displayCode)} </td>
                                <td> {numberFormat(estimates.next?.dividendPerShare, ' ' + data?.group?.company?.currency?.displayCode)} </td>
                            </tr>
                            <tr>
                                <td> Div. Rendite </td>
                                <td> {numberFormat(estimates.current?.dividendYield, ' %')} </td>
                                <td> {numberFormat(estimates.next?.dividendYield, ' %')} </td>
                            </tr>
                        </>
                    }
                    {screenerData?.group?.theScreenerRating &&
                        <>
                            <tr>
                                <td> Marktkap.</td>
                                <td> {shortNumberFormat(screenerData?.group?.theScreenerRating.marketCapitalisation)} </td>
                                <td> - </td>
                            </tr>
                            <tr>
                                <td> theScreener Rating </td>
                                <td>
                                    {
                                        Array(screenerData?.group?.theScreenerRating.rating)
                                            .fill(1)
                                            .map((current, index: number) => <SvgImage icon="icon_star_filled.svg" key={index} imgClass="svg-blue mr-n2" convert={false} width="27" />)
                                    }
                                </td>
                                <td> - </td>
                            </tr>
                        </>
                    }
                </Table>
                <div className="bottom-single-link">
                    {
                        screenerData?.group?.theScreenerRating && 
                        <div><TheScreenerRatingModal group={props.instrumentGroup} instrument={props.instrument} rating={screenerData?.group?.theScreenerRating} /></div>
                    }
                    {
                        estimates && <div><FundamentalKeyFiguresModal instrumentGroup={props.instrumentGroup} instrument={props.instrument} /></div>
                    }
                </div>
            </div>
        </div>
    );
}

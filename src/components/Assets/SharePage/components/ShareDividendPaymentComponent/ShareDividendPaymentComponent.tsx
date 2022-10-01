import { InstrumentGroup, Query } from "../../../../../generated/graphql";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { Spinner, Table } from "react-bootstrap";
import { formatDate, numberFormat } from "../../../../../utils";
import './ShareDividendPaymentComponent.scss';
import { trigInfonline, guessInfonlineSection } from "components/common/InfonlineService";
import { getAssetForUrl } from "components/profile/utils";
import { useParams, Link } from "react-router-dom";

interface ShareDividendPaymentComponentProps {
    instrumentGroup: InstrumentGroup;
}

export const ShareDividendPaymentComponent = (props: ShareDividendPaymentComponentProps) => {
    // const customShareCardWidth = useBootstrapBreakpoint({
    //     md:"360px",
    //     xl:"325px"
    // })
    const pathParam = useParams<{ section: string, seoTag: string }>();

    let toYear = moment().year();
    let { data, loading } = useQuery<Query>(
        loader('./getCompanyDividend.graphql'),
        { variables: { groupId: props.instrumentGroup.id, from: toYear - 6, to: toYear }, skip: !props.instrumentGroup.id || !toYear }
    )
    if (loading) {
        return <div className="text-center py-2" ><Spinner animation="border" /></div>;
    }
    if (!data?.group?.company?.dividends || data.group.company.dividends.length < 1) {
        return <></>;
    }

    return (
        // style={{width:customShareCardWidth}}
        <div className="content-wrapper">
            <h3 className="content-wrapper-heading font-weight-bold">Dividendenzahlungen</h3>
            <div className="content">
                <Table variant="dividend">
                    {data?.group?.company?.dividends.map(current =>
                        <tr>
                            <td>{formatDate(current.date)}</td>
                            <td>{numberFormat(current.value)} {data?.group?.company?.currency?.displayCode}</td>
                        </tr>
                    )}
                </Table>
                <div className="d-flex justify-content-end">
                    <Link className="text-blue mt-1" to={"/" + getAssetForUrl(props.instrumentGroup.assetGroup).toLowerCase() + "/guv/" + pathParam.seoTag + "/"} onClick={() => { trigInfonline(guessInfonlineSection(), 'guvCashflow') }}>
                        GuV &amp; Cashflow
                    </Link>
                </div>
            </div>
        </div>
    )
}

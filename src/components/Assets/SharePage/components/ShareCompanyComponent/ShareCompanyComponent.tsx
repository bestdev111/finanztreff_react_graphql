import { InstrumentGroup, Query } from "../../../../../generated/graphql";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { Spinner } from "react-bootstrap";
import { CompanyShareHolderChart, ShareHolder } from "../../charts/CompanyShareHolderChart";
import { trigInfonline, guessInfonlineSection } from "components/common/InfonlineService";
import { getAssetForUrl } from "components/profile/utils";
import { useParams, Link } from "react-router-dom";

export const ShareCompanyComponent = (props: ShareCompanyComponentProps) => {
    const pathParam = useParams<{ section: string, seoTag: string }>();

    let { loading, data } = useQuery<Query>(
        loader('./getShortCompanyInfomartion.graphql'),
        { variables: { groupId: props.group.id }, skip: !props.group.id }
    );
    if (loading) {
        return (
            <>
                <div className="text-center py-2">
                    <Spinner animation="border" />
                </div>
            </>);
    }
    if (!data?.group?.company) {
        return <></>;
    }
    let shareHolders: ShareHolder[] = (data.group.company.shareHolders || [])
        .map(current => { return { name: current.name || "", percent: current.percent || 0 } });
    return (
        <section className="main-section mb-4">
            <div className="container">
                <h2 className="section-heading font-weight-bold ml-n2 ml-md-0" id="firmeprofil-anchor">Firmenprofil</h2>
                <div className="row">
                    <div className="col">
                        <div className="content-wrapper  mt-sm-2 firm-profil">
                            {/* style={{height:customShareComponentHeight}} */}
                            <div className="row">
                                <div className="col-xl col-lg-7 left-col">
                                    <h3 className="content-wrapper-heading mt-sm-1  mt-md-n2   font-weight-bold">Informationen zum Unternehmen</h3>
                                    <div className="content mt-sm-4 pt-sm-1 pt-md-2 pt-xl-2  ">
                                        <div className="firm-name font-weight-bold mb-sm-2 pb-sm-1 pb-md-0 mb-md-n1 mt-sm-0 mt-md-n1">{data.group.company.name}</div>
                                        <p className="about-firm">
                                            {data.group.company.profile?.text}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-xl col-lg-5 right-col">
                                    <h3 className="content-wrapper-heading  font-weight-bold">Aktionärsstruktur {data.group.company.name}</h3>
                                    <div className="content">
                                        <CompanyShareHolderChart shareHolders={shareHolders} />
                                    </div>
                                </div>

                            </div>
                            <div className="bottom-multi-links no-border d-flex justify-content-end mt-xl-n3">
                                <Link className="text-blue mt-1" to={"/" + getAssetForUrl(props.group.assetGroup).toLowerCase() + "/bilanz/" + pathParam.seoTag + "/"} onClick={() => { trigInfonline(guessInfonlineSection(), 'bilanz') }}>
                                    Bilanz
                                </Link>
                                <Link className="text-blue mt-1" to={"/" + getAssetForUrl(props.group.assetGroup).toLowerCase() + "/guv/" + pathParam.seoTag + "/"} onClick={() => { trigInfonline(guessInfonlineSection(), 'guvCashflow') }}>
                                    GuV &amp; Cashflow
                                </Link>
                                <Link className="text-blue mt-1" to={"/" + getAssetForUrl(props.group.assetGroup).toLowerCase() + "/unternehmensprofil/" + pathParam.seoTag + "/"} onClick={() => trigInfonline(guessInfonlineSection(), 'unternehmensprofil')}>
                                    Unternehmensprofil
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export interface ShareCompanyComponentProps {
    group: InstrumentGroup;
    instrumentId?: number;
}

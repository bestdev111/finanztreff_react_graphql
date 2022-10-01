import { useQuery } from "@apollo/client";
import { Query } from "../../../../../../generated/graphql";
import { loader } from "graphql.macro";
import { Spinner } from "react-bootstrap";
import { NewsInstrumentInfo } from "../../../../../common/news/NewsInstrumentInfo";
import { quoteFormat } from "../../../../../../utils";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { LocationState } from "components/common/news/NewsModal/NewsModal";

export const CompanyNewsContent = (props: CompanyNewsContentProps) => {
    let { loading, data } = useQuery<Query>(
        loader('./getCompanyNews.graphql'),
        { variables: { isin: props.isin, first: 9 }, skip: !props.isin }
    );
    const location = useLocation<LocationState>();
    if (loading) {
        return <Spinner animation="border" />;
    }
    let news = ((!loading && data?.newsSearch?.edges) || []).map(current => current.node);
    
    return (
        <>
            <div className="d-flex justify-content-between">
                <h3 className="content-wrapper-heading font-weight-bold">Insidertrades
                    (Directors Dealings)</h3>
            </div>
            <div className="content">
                <div className="table-like-row legend-row d-sm-none d-md-block">
                    <div className="row">
                        <div className="col-xl-2 col-lg-2 font-weight-bold ml-md-n2">Datum</div>
                        <div className="col font-weight-bold">Meldung</div>
                    </div>
                </div>
                {
                    news.map(current => {

                        const locationState: LocationState = {
                            pathname: location.pathname, searchCriteria: { isin: [props.isin] },
                            news: current,
                        };
                        return (
                            <div className="table-like-row border-top with-legend">
                                <div className="row ml-n4 pl-1 ml-md-n3 pl-md-0">
                                    <div className="col-xl-2 col-lg-2">{quoteFormat(current.when)}</div>
                                    <div className="col">
                                        <Link className={classNames("text-decoration-none", current.feed === "NEWS_FEED" ? "text-dark" : "text-white")}
                                            to={{
                                                key: '',
                                                pathname: "/nachrichten/" + current.id + "/",
                                                state: locationState
                                            }}>
                                            <div>
                                                <a className={"font-size-15px"} href={"#"}>
                                                    {current?.headline}
                                                </a>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>)
                    }
                    )
                }

            </div>
        </>
    );
}

export interface CompanyNewsContentProps {
    isin: string;
}

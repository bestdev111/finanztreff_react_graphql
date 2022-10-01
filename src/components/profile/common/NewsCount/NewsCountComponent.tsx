import { useQuery } from "@apollo/client";
import classNames from "classnames"
import { NewsModalMeinFinanztreff } from "components/profile/modals/NewsModal/NewsModalMeinFinanztreff";
import { loader } from "graphql.macro";
import { Query } from "graphql/types";
import moment from "moment";
import { Spinner } from "react-bootstrap";
import "./NewsCountComponent.scss";

export function NewsCountComponent(props: NewsCountComponentProps) {
    const START_DATE = moment().startOf('day').format("YYYY-MM-DD");
    const END_DATE = moment().endOf('day').format("YYYY-MM-DD");

    let { loading, data } = useQuery<Query>(
        loader('./getDailyNewsCount.graphql'),
        { variables: { isins: props.isins, startDate: START_DATE, endDate: END_DATE }, skip: props.isins.length<1}
    );

    if (props.isins.length < 1) {
        return <></>;
    }

    if (!loading) {
        <div className="text-center py-2">
            <Spinner animation="border" />
        </div>
    }

    let countNews = (data?.newsIsinCount || []).reduce((a,b) => {return a + (b?.newsCount || 0)}, 0);

    return (
        <div className={classNames(props.className, "text-center" )}>
            <div className="news-count">
                <NewsModalMeinFinanztreff isins={props.isins} title={"Heute " + countNews +" neue Nachrichten"} 
                    daily={true}
                />
            </div>
            <div>zu Ihren beobachteten Werten</div>
            <div  className="news-all">
                <NewsModalMeinFinanztreff isins={props.isins} title={"Alle Nachrichten"}/>
            </div>
        </div>
    )
}

interface NewsCountComponentProps{
    className?: string;
    isins: string[];
}
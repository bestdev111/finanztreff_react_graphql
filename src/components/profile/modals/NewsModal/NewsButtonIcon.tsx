import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { loader } from "graphql.macro";
import { Query } from "graphql/types";
import moment from "moment";
import { Spinner, Button } from "react-bootstrap";

interface NewsButtonIconProps {
    className?: string;
    isins: string[];
    isOpen: boolean;
    iconWidth?: number;
    handleOpen: () => void
}

export function NewsButtonIcon(props: NewsButtonIconProps) {
    const START_DATE = moment().startOf('day');
    const END_DATE = moment().endOf('day');

    let { loading: countDailyLoading, data: countDailyData } = useQuery<Query>(
        loader('./getNewsCount.graphql'),
        { variables: { isins: props.isins, intervalStart: START_DATE, intervalEnd: END_DATE }, skip: props.isins.length < 1 }
    );

    let { loading: countLoading, data: countData } = useQuery<Query>(
        loader('./getNewsCount.graphql'),
        { variables: { isins: props.isins, intervalEnd: START_DATE }, skip: props.isins.length < 1 }
    );
    let dailyNewsCount = 0;
    let newsCount = 0;

    if (countDailyLoading || countLoading) {
        return <div className="text-center py-2" ><Spinner size={"sm"} animation="border" /></div>;
    }

    dailyNewsCount = countDailyData?.newsSearch.edges.length || 0;
    newsCount = countData?.newsSearch.edges.length || 0;
    return (

        <div className={classNames("news", props.className)}>
            <Button variant="inline" className="p-0 icon-news svg-icon" onClick={props.handleOpen} disabled={newsCount === 0}>
                {newsCount > 0 && dailyNewsCount > 0 ?
                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_news_orangedot_color.svg"} className="svg-convert" alt="" width={props.iconWidth ? props.iconWidth : 25} />
                        :
                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_news.svg"} className="svg-convert" alt="" width={props.iconWidth ? props.iconWidth : 25} />

                }
            </Button>
        </div>
    );
}
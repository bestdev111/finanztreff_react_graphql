import { useQuery } from "@apollo/client";
import SvgImage from "components/common/image/SvgImage";
import { NewsModalMeinFinanztreff } from "components/profile/modals/NewsModal/NewsModalMeinFinanztreff";
import { loader } from "graphql.macro";
import { Query } from "graphql/types";
import moment from "moment";
import { Button, Spinner } from "react-bootstrap";

export function NewsTitle({ isins }: { isins: string[] }) {
    const START_DATE = moment().startOf('day').format("YYYY-MM-DD");
    const END_DATE = moment().endOf('day').format("YYYY-MM-DD");

    let { loading, data } = useQuery<Query>(
        loader('./getDailyNewsCount.graphql'),
        { variables: { isins: isins, startDate: START_DATE, endDate: END_DATE }, skip: isins.length < 1 }
    );

    if (isins.length < 1) {
        return <></>;
    }

    if (!loading) {
        <div className="text-center py-2 pr-2">
            <Spinner animation="border" />
        </div>
    }

    let countNews = (data?.newsIsinCount || []).reduce((a, b) => { return a + (b?.newsCount || 0) }, 0);

    return (
        <div className="mx-3">
            <NewsModalMeinFinanztreff isins={isins} daily={true} disabled={countNews === 0} title={
                <>
                    <Button variant="link" className="text-decoration-none" disabled={countNews === 0}>
                        <SvgImage icon={"icon_news.svg"} convert={false} width="25" />
                        <span className="text-blue fs-36px align-middle font-weight-bold">{countNews}</span>
                    </Button>
                    <div className="mt-n1 fs-18px">
                        News Heute
                    </div>
                </>
            } />
            <div className="ml-2 mb-2 mt-2">
                <NewsModalMeinFinanztreff isins={isins} title={<span className="fs-15px text-blue">Alle News</span>} />
            </div>
        </div>

    )
}

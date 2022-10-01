import { useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { MarketCarousel } from "../../Home/MarketSection/MarketCarousel/MarketCarousel";
import { useQuery } from "@apollo/client";
import { Query } from "../../../generated/graphql";
import { GET_INSTRUMENTS_LIST } from "../../../graphql/query";
import { useBootstrapBreakpoint } from "../../../hooks/useBootstrapBreakpoint";

export const ShareOverviewMarketSection = () => {
    // let [list] = useState(markets[0].listId);
    const { data, loading } = useQuery<Query>(GET_INSTRUMENTS_LIST, { variables: { id: "hot_instruments_by_trades" } });

    const [title, setTitle] = useState("Meistgesuchte");

    const height = useBootstrapBreakpoint({
        xs: 337,
        md: 200
    });

    return (
        <>
            <div className={"d-lg-flex align-items-center px-3"}>
                <h2 className={"section-heading font-weight-bold roboto-heading my-4 text-white mt-5px ml-n4 ml-md-0 ml-xl-0"} style={{ fontSize: "24px" }}>
                    Aktien Überblick</h2>
            </div>

            <Container className={"share-overview-market-container px-2 pt-1 px-lg-3 pt-lg-3"}>
                <h2 className={"text-white font-weight-bold mb-n2"} style={{ fontSize: '20px' }}>{title}</h2>
                <div style={{ minHeight: height }} className="text-center">
                    {loading ?
                        <Spinner style={{ color: 'white' }} animation="border" />
                        : (data?.list ?
                            <MarketCarousel showAdvertisement={false}
                                list={data.list}
                                isChartColorfull={false}
                                bottomPadding={false}
                                handleTitle={setTitle}
                            />
                            :
                            <></>
                        )
                    }
                </div>
            </Container>
        </>
    )
}

export default ShareOverviewMarketSection

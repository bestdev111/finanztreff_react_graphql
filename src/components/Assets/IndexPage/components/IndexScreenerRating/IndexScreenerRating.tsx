import { useQuery } from "@apollo/client";
import { trigInfonline } from "components/common/InfonlineService";
import ShareScreenerRatingCard from "components/shares/overview/ShareScreenerRaiting/ShareScreenerRatingCard";
import { ShareScreenerRatingModal } from "components/shares/overview/ShareScreenerRaiting/ShareScreenerRatingModal";
import { loader } from "graphql.macro";
import { Query, TheScreenerRating } from "graphql/types";
import { Button, Spinner } from "react-bootstrap";

interface IndexScreenerRatingProps {
    productName: string;
    groupId: number;
    seoTag: string;
}

export const IndexScreenerRating = ({ seoTag, productName, groupId }: IndexScreenerRatingProps) => {
    const { data, loading } = useQuery<Query>(
        loader('./getScreenerRatingIndexes.graphql'), { variables: { instrumentGroupId: groupId, first: 24 } }
    );
    let screenerRatings: TheScreenerRating[] = [];
    if (loading) {
        return <div className="instrument-info-loading text-center mt-3"><Spinner animation="border" /></div>;
    }
    if (data) {
        screenerRatings = data.theScreenerRatingSearch;
        return (
            <div className={"content-wrapper bg-white ml-xl-n3 pl-3 mt-3 mt-xl-0"} style={{ boxShadow: "#00000029 0px 3px 6px" }}>
                <div className={"content pt-3 pb-2"}>
                    <h3 style={{ fontSize: 18, fontFamily: 'Roboto Slab' }} className="content-wrapper-heading font-weight-bold mb-n1">
                        theScreener Rating
                    </h3>
                    <span className={"font-size-13px pb-4"}>Neueste Up & Downgrades {productName}</span>
                    <div className={'rating-cards ml-n4 border-border-gray border-bottom-1 border-top-1 py-3'}>
                        {screenerRatings.filter(current => !!current.rating && !!current.previousRating ).slice(0, 5).map((current, index) =>
                            !!current.rating && !!current.previousRating &&
                            <ShareScreenerRatingCard name={current.group.name} showStatus={false} nameIsBold={false}
                                updatedRating={current.rating} previousRating={current.previousRating} />
                        )}
                    </div>
                    <div className={"d-flex justify-content-end py-3 mr-2 mr-xl-3"}>
                        <Button>
                            <ShareScreenerRatingModal onClickFunction={() => trigInfonline('indexPortrait', 'layer_thescreener_' + seoTag)}
                                                      instrumentGroupId={groupId}
                                                      title="Downgrades seit letzter Anpassung">Alle theScreener Ratings...</ShareScreenerRatingModal>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
    return (<></>);
}

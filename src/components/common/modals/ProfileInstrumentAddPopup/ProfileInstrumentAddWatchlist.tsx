import { useDropdownToggle } from "react-overlays";
import { Accordion, Spinner } from "react-bootstrap";
import { WatchlistInstrumentAdd } from "../../profile/WatchlistInstrumentAdd";
import SvgImage from "../../image/SvgImage";
import React from "react";
import { loader } from "graphql.macro";
import { useQuery } from "@apollo/client";
import { Query } from "graphql/types";
import { gtag, eventTime } from "components/Assets/Derivatives/components/Product";


export interface ProfileInstrumentAddWatchlistProps {
    instrumentId: number;
    instrumentGroupId: number;
    onActivate?: () => void;
    emptyText?: string;
    productIsin?: any;
    nameWkn?: any;
    hasGtag?: boolean;
}

export const ProfileInstrumentAddWatchlist = (props: ProfileInstrumentAddWatchlistProps) => {
    const [, { toggle }] = useDropdownToggle();

    const { data, loading } = useQuery<Query>(
        loader('./getProfileInstrumentAddPortfolio.graphql'),
        {
            skip: !props.instrumentId || !props.instrumentGroupId,
            variables: { id: props.instrumentId }
        }
    )
    return (
        <div className="content-row">
            <Accordion>
                <Accordion.Toggle eventKey="watchlist" as={"p"}>
                    <>
                        <span> {props.emptyText && (!data?.instrumentIncluded || data?.instrumentIncluded?.watchlists?.length === 0) ? (
                            <>
                                {props.emptyText}
                            </>
                        ) :
                            <>
                                <span>Bereits in <span className="font-weight-bold">{data?.instrumentIncluded?.watchlists.length} Watchlisten</span> beobachtet</span>
                            </>
                        }
                        </span>
                        {data && data.instrumentIncluded && data?.instrumentIncluded?.watchlists.length > 0 &&
                            <i className="drop-arrow right-float-arrow border-gray-dark mb-2" style={{ transform: "rotate(45deg)" }} />
                        }
                    </>
                </Accordion.Toggle>
                {data && data.instrumentIncluded && data?.instrumentIncluded?.watchlists.length > 0 &&
                    <Accordion.Collapse eventKey="watchlist">
                        <div className="collapse-inner">
                            {loading && <Spinner animation="border" />}
                            {!loading && data && data.instrumentIncluded?.watchlists.map(watchlist =>
                                <span className="items"><a href={"/mein-finanztreff/watchlist/" + watchlist.id}>{watchlist.name}</a></span>
                            )}
                        </div>
                    </Accordion.Collapse>
                }
            </Accordion>
            <WatchlistInstrumentAdd instrumentId={props.instrumentId} instrumentGroupId={props.instrumentGroupId} onOpen={() => {
                // @ts-ignore
                toggle(false,(e:any):void=>{});
                props.onActivate && props.onActivate();
            }}
            >
                <SvgImage icon="icon_watchlist_plus_white.svg" spanClass="top-move mt-n1" width="20"/>
                    {props.hasGtag === true && 
                    <span className="" onClick={() => {
                        return gtag('event', 'view_item', {
                                items: [{
                                    item_name: props.productIsin,
                                    item_brand: props.nameWkn,
                                    item_category: 'Monte Carlo Simulation',
                                    item_category2: 'Related Products',
                                    item_category3: 'Add to Watchlist',
                                    item_category5: eventTime(),
                                }]
                            }
                        )}
                    }> Zu Watchlist hinzufügen </span>
                    }
                    {props.hasGtag === false && 
                    <span className=""> Zu Watchlist hinzufügen </span>
                    }
            </WatchlistInstrumentAdd>
        </div>
    );
}

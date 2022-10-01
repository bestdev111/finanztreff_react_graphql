import {Spinner} from "react-bootstrap";
import React from "react";
import {gql, useQuery} from "@apollo/client";
import {Query} from "../../generated/graphql";
import {getAssetLink} from "../../utils";
import {Link} from "react-router-dom";

const MOST_SEARCHED_QUERY = gql`
    query getMostSearchedInstruments {
        list(id: "hot_instruments") {
            id
            content {
                id
                name
                group {
                    id
                    name
                    seoTag
                    assetGroup
                }
            }
        }
    }
`


export function MostSearchedComponent({closeTrigger}: { closeTrigger: () => void }) {
    const result = useQuery<Query>(MOST_SEARCHED_QUERY);
    return (
        <div className="derivate-big-card tags-card p-0 m-0 shadow-none">
            <div className="data-wrapper">
                <div className="title w-100 text-left pb-1 mt-md-5 mt-xl-0 mt-sm-5" style={{fontSize: 18}}>Meistgesuchte Begriffe</div>
                <div className="tags-wrap ml-0 justify-content-start">
                    {
                        result.loading
                            ?
                            <Spinner animation="border"/>
                            :
                            result.data?.list?.content?.map(ins =>
                                ins &&
                                <span key={ins.id} className="ml-0 mr-3">
                                    <Link onClick={() => closeTrigger()}
                                          to={getAssetLink(ins.group) || '#'}>{ins.group.name}</Link>
                                </span>
                            )
                    }
                </div>
            </div>
        </div>
    );
}
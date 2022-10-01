import {Spinner} from "react-bootstrap";
import React, {Component} from "react";
import {QueryResult} from "@apollo/client";

interface ResultCountProps {
    result: QueryResult,
    size?: 'sm',
    wrap?: boolean
}

export class ResultCount extends Component<ResultCountProps> {
    render() {
        const {result, size, wrap} = this.props;
        if (result?.loading) return <Spinner animation="border" size={size}/>;
        const hasNextPage = result?.data?.search.pageInfo?.hasNextPage;
        const count = (result?.data?.search?.edges?.length || 0) + (hasNextPage ? '+' : '');
        return wrap ? '(' + count + ')' : count;
    }
}
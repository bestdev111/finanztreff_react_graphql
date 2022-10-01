import { Button, Col, Row, Spinner, Tab, Tabs } from "react-bootstrap";
import { Component, useState } from "react";
import classNames from "classnames";
import { useQuery } from "@apollo/client";
import { InstrumentGroupSelected } from "components/common/profile/common/ProfileSelectInstrumentGroup/ProfileSelectInstrumentGroup";
import InfiniteScroll from "components/common/scroller/InfiniteScroller";
import { getAssetGroup } from "components/profile/utils";
import { AssetGroup, Instrument, Query, Quote, QuoteType } from "graphql/types";
import {formatPrice, formatPriceWithSign, getTextColorByValue, numberFormatWithSign, quoteFormat} from "utils";
import { useBootstrapBreakpoint } from "hooks/useBootstrapBreakpoint";
import { loader } from "graphql.macro";
import "./InstrumentGroupSearchEntry.scss";

export interface SearchInstrumentsPerAssetProps {
    search: SearchQueryVars;
    callback: (value?: InstrumentGroupSelected) => void;
}

const SearchResult = ({ search, callback }: SearchInstrumentsPerAssetProps) => {

    const height = useBootstrapBreakpoint({
        xl: "620px",
        lg: '650px',
        md: '500px',
        sm: '390px'
    });

    let { data, loading, fetchMore } = useQuery<Query>(loader('./getInstrumentGroupSelected.graphql'), { variables: { ...search, first: 18 } });
    if (loading) {
        return <div className="mt-5 text-center"><Spinner animation="border" /></div>
    }
    return (
        <InfiniteScroll
            style={{ overflowY: 'auto' }}
            className="search-results"
            dataLength={data?.search.edges.length || 0}
            hasMore={loading ? true : (data?.search.pageInfo?.hasNextPage || false)}
            next={() => fetchMore({ variables: { after: data?.search.pageInfo?.endCursor } })}
            loader={<div className="text-center" style={{ height: 25 }}><Spinner animation="border" size="sm" /></div>}
            height={height}
            scrollableTarget="instruments-search-result"
        >   <div className="d-xl-block d-lg-block d-md-block d-sm-none">{
            <table className=" table light-table text-center custom-border fnt-size-15 last-with-border">
                <thead className="thead-light">
                    <tr>
                        <th scope="col" className="text-left" style={{ width: 70 }}>WKN</th>
                        <th scope="col" className="text-right" style={{ width: 70 }}></th>
                        <th scope="col" className="text-left">Name</th>
                        <th scope="col" className="text-right" style={{ width: 130 }}>Kurs</th>
                        <th scope="col" className="text-right d-none d-lg-table-cell" style={{ width: 100 }}>
                            %
                        </th>
                        <th scope="col" className="text-right d-none d-lg-table-cell" style={{ width: 100 }}>
                            Zeit
                        </th>
                        <th scope="col" style={{ width: 100 }}> &nbsp; </th>
                    </tr>
                </thead>
                <tbody>
                    {data?.search?.edges?.map(ins =>
                        <ResultItem key={ins.cursor} callback={callback} instrument={ins.node} />)}
                </tbody>
            </table>
        }
            </div>
            <div className="d-xl-none d-lg-none d-md-none d-sm-block">
                {data?.search?.edges?.map(ins => <ResultItemMobile key={ins.cursor} callback={callback} instrument={ins.node} />)}
            </div>
        </InfiniteScroll>
    );
}

export interface SearchInstrumentsComponentProps {
    searchString: string;
    callback: (value?: InstrumentGroupSelected) => void;
}

interface SearchQueryVars {
    assetGroup?: [AssetGroup];
    searchString: string;
}

export const SearchInstrumentsProfileComponent = (props: SearchInstrumentsComponentProps) => {
    const [key, setKey] = useState<string>("");
    const searchVariables: SearchQueryVars = { searchString: props.searchString };
    const { data, loading } = useQuery<Query>(loader('./getInstrumentGroupSelectedCount.graphql'), { variables: { ...searchVariables, assetGroup: null } })
    if (loading) {
        return <div className="mt-5 text-center"><Spinner animation="border" /></div>
    }
    let totalCount = (!!data?.search.assetGroups && data.search.assetGroups.reduce((a, b) => a + b.count, 0)) || 0;
    if (totalCount === 0) {
        return <div className="text-center mt-5">Keine Wertpapiere gefunden</div>;
    }

    let activeAssetGroups = data?.search.assetGroups.filter(current => current.count > 0) || [];
    let activeTab = (!!key && key) || activeAssetGroups[0].assetGroup;
    return (
        <Tabs activeKey={activeTab} onSelect={(k) => k && setKey(k)} variant="tabs" className="search-securities-profile">
            {
                activeAssetGroups.map(current =>
                    <Tab eventKey={current.assetGroup} title={<span>{getAssetGroup(current.assetGroup)} ({current.count})</span>} tabClassName={classNames(current.assetGroup, 'asset-type-tag', 'mr-2', 'mt-2 mb-2 mb-xl-0', 'rounded-0 asset-tab-hover')}>
                        {activeTab === current.assetGroup && <SearchResult search={{ ...searchVariables, assetGroup: [current.assetGroup] }} callback={props.callback} />}
                    </Tab>
                )
            }
        </Tabs>
    );
}

interface InstrumentGroupSearchEntryProps {
    groupId: number;
    instrumentId: number;
    assetGroup: AssetGroup | undefined;
    name: string;
    wkn: string;
    quote?: Quote | null;
    callback: (value?: InstrumentGroupSelected) => void;
}


class InstrumentGroupSearchEntry extends Component<InstrumentGroupSearchEntryProps, {}> {
    render() {
        return (
            <tr>
                <td className="text-left pt-3">
                    <span>{this.props.wkn}</span>
                </td>
                <td className={classNames("type asset-type-text-color font-weight-bold pt-3 pr-0", this.props.assetGroup)}>
                    {this.props.assetGroup && getAssetGroup(this.props.assetGroup)}
                </td>
                <td className="text-left text-blue fs-15px text-truncate font-weight-bold pt-3 cursor-pointer"
                    onClick={() => this.props.callback ? this.props.callback({ id: this.props.groupId, name: this.props.name }) : undefined}>
                    {this.props.name.length > 28 ? (this.props.name.slice(0, 25) + "...") : this.props.name}
                </td>
                <td className="text-right font-weight-bold pt-3 text-nowrap">
                    {formatPrice(this.props.quote?.value, this.props.assetGroup)}
                    {this.props.quote?.change != null &&
                        (
                            this.props.quote.change > 0 ?
                                <span className="svg-icon move-arrow ml-1">
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_up_green.svg"} alt="" className="pb-1" />
                                </span> :
                                (this.props.quote.change < 0 ?
                                    <span className="svg-icon move-arrow ml-1">
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_down_red.svg"} alt="" className="pb-1" />
                                    </span> :
                                    <img height={28} src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_right_grey.svg"} alt="" className="mr-n2 ml-n1 my-n2" />)
                        )
                    }
                </td>
                <td className={classNames("text-right text d-none d-lg-table-cell pt-3", this.props.quote?.change ? (this.props.quote?.change >= 0 ? "text-green" : "text-red") : "")}>
                    {formatPriceWithSign(this.props.quote?.change, this.props.assetGroup,this.props.quote?.value, '%')}
                </td>
                <td className="text-right d-none d-lg-table-cell pt-3">
                    {quoteFormat(this.props.quote?.when)}
                </td>
                <td className="pt-3">
                    <Button variant="link" className="select-button p-0 pt-0" onClick={() => this.props.callback ? this.props.callback({ id: this.props.groupId, name: this.props.name }) : undefined}>
                        <span className="svg-icon">
                            <img height="20" src={process.env.PUBLIC_URL + "/static/img/svg/icon_plus_blue.svg"} alt="" className="svg-convert svg-black" />
                        </span>
                    </Button>
                </td>
            </tr>

        )
    }
}

interface ResultItemProps {
    instrument: Instrument;
    callback: (value?: InstrumentGroupSelected) => void;
    classNames?: string
}

function ResultItem(props: ResultItemProps) {
    const { name, group, wkn } = props.instrument;
    const id = props.instrument.id;
    const groupId = props.instrument.group.id;
    const assetGroup = group.assetGroup;
    const quote = props.instrument.snapQuote &&
        (props.instrument.snapQuote.quotes.find(current => current?.type === QuoteType.Trade)
            || props.instrument.snapQuote.quotes.find(current => current?.type === QuoteType.NetAssetValue));
    if (groupId && id && assetGroup && name)
        return (
            <InstrumentGroupSearchEntry groupId={groupId} instrumentId={id} assetGroup={assetGroup} wkn={wkn || ""} name={name} quote={quote && quote}
                callback={() => props.callback && groupId && props.callback({
                    id: groupId,
                    name: name
                })} />
        );
    return (<></>);
}

function ResultItemMobile(props: ResultItemProps) {
    const { name, group, wkn } = props.instrument;
    const id = props.instrument.id;
    const groupId = props.instrument.group.id;
    const assetGroup = group.assetGroup;
    const quote = props.instrument.snapQuote &&
        (props.instrument.snapQuote.quotes.find(current => current?.type === QuoteType.Trade)
            || props.instrument.snapQuote.quotes.find(current => current?.type === QuoteType.NetAssetValue));
    if (groupId && id && assetGroup && wkn && name)
        return (
            <Row className="px-3 border-top-2 border-gray-light py-2">
                <Col className="col-10">
                    <Row className="cursor-pointer text-blue font-weight-bold text-truncate"
                        onClick={() => props.callback({ id: groupId, name: name })}>
                        {name.length > 35 ? (name.slice(0, 32) + "...") : name}
                    </Row>
                    <Row>
                        <Col className="px-0">
                            {wkn}
                        </Col>
                        <Col className="px-0 text-right font-weight-bold">
                            {quote && quote.change &&
                                <>
                                    {formatPrice(quote.value, assetGroup)}
                                    {quote.change > 0 ?
                                        <span className="svg-icon move-arrow ml-1">
                                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_up_green.svg"} alt="" className="pb-1" />
                                        </span> :
                                        (quote.change < 0 ?
                                            <span className="svg-icon move-arrow ml-1">
                                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_down_red.svg"} alt="" className="pb-1" />
                                            </span> :
                                            <img height={28} src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_short_right_grey.svg"} alt="" className="mr-n2 ml-n1 my-n2" />)
                                    }
                                </>
                            }
                        </Col>
                        <Col className={classNames("px-0 text-right", getTextColorByValue(quote?.change || 0))}>
                            {formatPriceWithSign(quote?.change, props.instrument?.group?.assetGroup ,quote?.value, '%')}

                        </Col>
                        <Col className="pr-0 text-right">
                            {quoteFormat(quote?.when)}

                        </Col>
                    </Row>
                </Col>
                <Col className="col-2 align-self-center">
                    <Button variant="link" className="select-button p-0 pt-0" onClick={() => props.callback({ id: groupId, name: name })}>
                        <span className="svg-icon">
                            <img height="28" src={process.env.PUBLIC_URL + "/static/img/svg/icon_plus_blue.svg"} alt="" className="svg-convert svg-black" />
                        </span>
                    </Button>
                </Col>
            </Row>
        );
    return (<></>);
}

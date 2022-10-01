import React, {useCallback, useContext, useState} from "react";
import {Button, Card, Col, FormControl, InputGroup, Row, Spinner, Table} from "react-bootstrap";
import {PageHeaderFilterBaseComponent} from "../../PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import {AssetGroup, Query} from "../../../../generated/graphql";
import {useQuery} from "@apollo/client";
import {loader} from "graphql.macro";
import {formatAssetGroup} from "../../../../utils";
import './SimpleAssetSelectorComponent.scss'
import classNames from "classnames";
import PageHeaderFilterContext from "../../PageHeaderFilterComponent/PageHeaderFilterContext";

interface SimpleAssetSelectorAsset {
    id?: number;
    name?: string;
    wkn?: string;
    isin?: string;
    assetGroup?: AssetGroup;
}

interface SimpleAssetSelectorAssetEvent {
    asset?: SimpleAssetSelectorAsset;
}

interface SimpleAssetSelectorTableProps {
    assets: SimpleAssetSelectorAsset[];
    onSelect?: (event: SimpleAssetSelectorAssetEvent) => void;
}

function SimpleAssetSelectorTable(props: SimpleAssetSelectorTableProps) {
    let context  = useContext(PageHeaderFilterContext);

    let closeDropDown = useCallback(() => {
        if (context && context.close) {
            context.close();
        }
    }, [context]);

    if (props.assets.length < 1){
        return (
            <div className="w-100 d-flex justify-content-center">
                <span>Keine Analysen gefunden</span>
            </div>
        )
    }

    return (
        <Table variant="single-asset" className="w-100">
            {props.assets
                .map(current =>
                    <tr>
                        <td>
                            <Button variant="inline"
                                    className="text-left p-0 font-weight-bold text-color-blue w-100"
                                    onClick={() => {
                                        if (props.onSelect) {
                                            props.onSelect({asset: current});
                                        }
                                        closeDropDown();
                                    }}
                            >
                                {current.name}
                            </Button>
                        </td>
                        <td className="column-wkn d-none d-md-table-cell"><b>WKN</b> {current.wkn}</td>
                        <td className="column-isin d-none d-md-table-cell"><b>ISIN</b> {current.isin}</td>
                        <td className={classNames("column-type font-weight-bold text-color-blue",)}>
                            {formatAssetGroup(current.assetGroup)}
                        </td>
                    </tr>
                )
            }
        </Table>
    )
}

interface SimpleAssetSelectorContentComponentProps {
    assetGroup: AssetGroup;
    searchString?: string;
    onTextChange?: (text?: string) => void;
    onSelect?: (event: SimpleAssetSelectorAssetEvent) => void;
}

interface SimpleAssetSelectorContentComponentState {
    text?: string;
}

export function SimpleAssetSelectorContentComponent(props: SimpleAssetSelectorContentComponentProps) {
    let [state, setState] = useState<SimpleAssetSelectorContentComponentState>({text: props.searchString});
    let {data, loading, fetchMore} = useQuery<Query>(
        loader('./SimpleAssetSelectorComponent.graphql'),
{
            skip: !props.searchString && !state.text,
            variables: {assetGroup: props.assetGroup ? [props.assetGroup] : null, searchString: state.text || props.searchString, first: 10}
        }
    );
    let {data: defaultData, loading: defaultLoading} = useQuery<Query>(loader('./SimpleAssetSelectorDefaultList.graphql'));

    return (
        <Card className="w-100 border-0">
            <Card.Body>
                <Row className={"d-block d-xl-none"}>
                    <Col xs={12}>
                        <FormControl type="text"
                                     autoFocus
                                     value={state.text ? state.text : ''}
                                     onChange={(e: any) => {
                                         setState({text: e.target.value});
                                         if (props.onTextChange) {
                                             props.onTextChange(e.target.value);
                                         }
                                     }}/>

                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        {(loading || defaultLoading) ? <div className={"d-flex justify-content-center my-3"}>
                                <Spinner animation={"border"}/> </div>:
                            <SimpleAssetSelectorTable assets={
                                (data?.search?.edges?.map(current => current.node.group) ||
                                    defaultData?.list?.content?.map(current => current?.group))?.map(current => {
                                        return {
                                            id: current?.id || undefined,
                                            name: current?.name || undefined,
                                            wkn: current?.wkn || undefined,
                                            isin: current?.isin || undefined,
                                            assetGroup: current?.assetGroup || undefined
                                        };
                                    })
                                    || []
                                }
                              onSelect={ev => {
                                  if (props.onSelect) {
                                      props.onSelect(ev)
                                  }
                              }}
                            />
                        }
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

interface SearchStringSelectorComponentProps {
    title: string;
    onSelect?: (event: SimpleAssetSelectorAssetEvent) => void;
}

interface SearchStringSelectorComponentState {
    text?: string;
    selected: boolean;
}

export function SimpleAssetSelectorComponent(props: SearchStringSelectorComponentProps) {
    let [state, setState] = useState<SearchStringSelectorComponentState>({selected: false});
    return (
        <PageHeaderFilterBaseComponent
            title=""
            className={"simple-asset-search"}
            dropDownClassName="w-100"
            toggleClassName={classNames("btn-toggle", !state.selected ? "rounded-right" : "")}
            toggle={
                <InputGroup>
                    <FormControl type="text"
                                 className="font-weight-bold bg-transparent border-0 font-size-22px"
                                 placeholder={props.title}
                                 autoComplete="off"
                                 value={state.text ? state.text : ''}
                                 onChange={(e: any) => setState({...state, text: e.target.value})}/>
                    {!state.selected &&
                        <InputGroup.Append className="p-2 px-3 bg-transparent rounded-right">
                            <img
                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_search_dark.svg"}
                                width="33"
                                alt="search news icon"/>
                        </InputGroup.Append>
                    }
                </InputGroup>
            }
            extra={
                <>
                {state.selected &&
                        <Button variant={'light btn-action'}
                                onClick={() => {
                                    if (state.selected) {
                                        setState({...state, selected: false, text: ""});
                                        if (props.onSelect) {
                                            props.onSelect({});
                                        }
                                    }
                                }} className="svg-icon">

                            <img
                                alt="reset selection"
                                src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark.svg"}
                                width="33"/>
                        </Button>
                }
                </>
            }
        >
            <SimpleAssetSelectorContentComponent
                assetGroup={AssetGroup.Share} searchString={state.text}
                onTextChange={(text) => setState({...state, text: text})}
                onSelect={(ev) => {
                    setState({...state, selected: true, text: ev.asset?.name});
                    if (props.onSelect) {
                        props.onSelect(ev);
                    }
                }}
            />
        </PageHeaderFilterBaseComponent>
    );
}


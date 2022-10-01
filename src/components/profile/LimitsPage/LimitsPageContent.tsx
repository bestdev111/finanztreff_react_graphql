import { useMutation } from "@apollo/client";
import classNames from "classnames";
import SvgImage from "components/common/image/SvgImage";
import { SortFilter } from "components/index/FindIndexSection/filters/SortFilter";
import { LimitEntry, Mutation, UserProfile } from "generated/graphql";
import { loader } from "graphql.macro";
import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import './LimitsBanner/Limits.scss';
import { LimitsGridComponent } from "./LimitsGridComponent";
import { LimitsTableComponent } from "./LimitsTableComponent";
import { ViewOptionsDropdown } from "./ViewOptionsDropdown";

export function LimitsPageContent(props: LimitsPageContentProps) {
    let [viewMutation] = useMutation<Mutation>(loader('./updateLimitView.graphql'));
    let [orderMutation] = useMutation<Mutation>(loader('./updateLimitOrder.graphql'));

    let limitViewName: string = props.profile.limitViewType ? props.profile.limitViewType : "Kacheln";
    let limitViewOrder: string = props.profile.limitViewOrder ? props.profile.limitViewOrder : "Name";
    let limitViewOrderAsc: boolean = props.profile.limitViewOrderAsc != null ? props.profile.limitViewOrderAsc : true;

    let [state, setState] = useState<LimitsPageContentState>({
        showMemo: false,
        isUpper: undefined,
        isActive: undefined,
        limits: props.limits,
        view: limitViewName,
        sort: {
            sortType: limitViewOrder,
            direction: limitViewOrderAsc 
        } 
    });
    
    if(state.view==="Liste" && !state.sort.sortType.startsWith("Table")){
        setState({ ...state, sort: { sortType: "TableBezeichnung", direction: true } });
    }

    if(state.view==="Kacheln" && state.sort.sortType.startsWith("Table")){
        setState({ ...state, sort: { sortType: "Name", direction: true } });
    }

    const handleView = (value: { id: string, name: string }) => {
        const id = props.profile.id;
        const newValue = value.id;
        viewMutation({
            variables: {
                viewType: newValue,
            },
            update(cache) {
                const normalizedId = cache.identify({ id, __typename: 'UserProfile' });
                cache.modify({
                    id: normalizedId,
                    fields: {
                        limitViewType(cachedValue) {
                            return newValue;
                        },
                    },
                    /* broadcast: false; // Include this to prevent automatic query refresh */
                });
            }
        })
        .then(() => {

        });

        setState({ ...state, view: value.id });
    }

    let handleSort = (value: { id: string, name: string }, order: boolean) => {
        const id = props.profile.id;
        const newValue = value.id;
        const newOrderAsc = order;
        orderMutation({
            variables: {
                viewOrder: newValue,
                viewOrderAsc: newOrderAsc,

            },
            update(cache) {
                const normalizedId = cache.identify({ id, __typename: 'UserProfile' });
                cache.modify({
                    id: normalizedId,
                    fields: {
                        limitViewOrder(cachedValue) {
                            return newValue;
                        },
                        limitViewOrderAsc(cachedValue) {
                            return newOrderAsc;
                        },
                    },
                    /* broadcast: false; // Include this to prevent automatic query refresh */
                });
            }
        })
        .then(() => {

        });

        setState({ ...state, sort: { sortType: value.id, direction: order } });
    }

    const handleMemo = () => setState({ ...state, showMemo: !state.showMemo });


    return (
        <Container>
            <Row className={classNames("heading-with-info justify-content-between align-items-center", props.inModal && "d-block in-modal-info")}>
                <Col xs={2} className="mt-md-0 mt-sm-n4 ml-md-0 ml-sm-n3">
                    {props.showTitle &&
                        <div className="font-weight-bold d-flex font-family-roboto-slab ml-lg-n4 ml-xl-0">
                            <span className="svg-icon top-move mx-1">
                                <img src="/static/img/svg/icon_bell_dark.svg" className="mb-n2 limits-section-icon" alt="" />
                            </span>
                            <h2 id="limits-section">Limits</h2>
                        </div>
                    }
                </Col>
                <Col className="px-0 pr-xl-3 d-sm-none d-md-block">
                    <div className={classNames("d-flex justify-content-end align-items-center anayses-buttons buttons-in-results limits", props.inModal && "jusdtify-content-end mt-xl-2 mt-md-3 mt-sm-3 mb-n3")}>
                        {!props.inModal && state.view === "Kacheln" &&
                            <div className="d-xs-none mr-xl-3 mr-lg-2" style={{ fontFamily: "Roboto" }}>
                                <div className="filters-panel text-nowrap">
                                    <SortFilter
                                        onSelect={handleSort}
                                        options={["Name", "Gattung", "Abstand zum Limit"]}
                                        direction={state.sort.direction}
                                        description={state.sort.sortType}
                                    />
                                </div>
                            </div>
                        }

                        <Button variant={'inline-action'} className="bg-white analyse-positive-button mr-xl-4 mr-lg-4  mr-md-0 mr-sm-0" style={{ marginTop: "-14px" }}
                            onClick={handleMemo}
                        >
                            <span className="mx-md- mx-sm-n2 text-nowrap">
                                <SvgImage icon={"icon_note" + (state.showMemo ? "" : "_gray") + ".svg"} width={"27"} spanClass="py-1" />
                                <span className={classNames("pt-2 fs-14px mr-1 mt-1", state.showMemo ? "text-dark" : "text-gray")}>Notizen</span>
                            </span>
                        </Button>
                        <div className={classNames("d-flex")}>
                            <div className="pr-xl-2 pr-lg-3 filters-in-limits">
                                <Button variant={'inline'}
                                    className={classNames('analyse-positive-button', state.isUpper ? "active" : '')}
                                    onClick={() => setState({
                                        ...state,
                                        isUpper: (state.isUpper ? undefined : true),
                                        limits: (state.isUpper ? props.limits : props.limits.filter(current => current.upper))
                                    })
                                    }
                                >
                                    <span className="mx-xl-0 mx-sm-n2">Obere </span> <span className="d-xl-inline d-sm-none"> Limits</span>
                                </Button>

                                <Button variant={'inline'}
                                    className={classNames('analyse-negative-button', state.isUpper == false ? "active" : '')}
                                    onClick={() => setState({
                                        ...state,
                                        isUpper: (state.isUpper == false ? undefined : false),
                                        limits: (state.isUpper == false ? props.limits : props.limits.filter(current => current.upper == false))
                                    })
                                    }
                                >
                                    <span className="mx-xl-0 mx-sm-n2">Untere</span> <span className="d-xl-inline d-sm-none"> Limits</span>
                                </Button>
                            </div>

                            <div className={classNames("px-xl-3 px-lg-1 px-md-1 px-sm-0 filters-in-limits", props.inModal && "mr-2")}>
                                <Button className={state.isActive ? "active" : ''} variant={'inline'}
                                    onClick={() => setState({
                                        ...state, isActive: (state.isActive ? undefined : true),
                                        limits: (state.isActive ? props.limits : props.limits.filter(current => current.hitStatus == false))
                                    }
                                    )}
                                >
                                    <span className="mx-xl-0 mx-sm-n2">Aktiv</span>
                                </Button>
                                <Button className={state.isActive == false ? "active" : ''} variant={'inline'}
                                    onClick={() => setState({
                                        ...state, isActive: (state.isActive == false ? undefined : false),
                                        limits: (state.isActive == false ? props.limits : props.limits.filter(current => current.hitStatus))
                                    }
                                    )}
                                >
                                    <span className="mx-xl-0 mx-sm-n2">Getroffen</span>
                                </Button>
                            </div>
                        </div>
                        {!props.inModal &&
                            <div className="d-xs-none ml-xl-0 mr-xl-0 ml-lg-4 mr-lg-n2 " style={{ fontFamily: "Roboto" }}>
                                <div className="filters-panel text-nowrap">
                                    <ViewOptionsDropdown handleView={handleView} view={{ name: state.view, id: state.view }} />
                                </div>
                            </div>
                        }
                    </div>
                </Col>
                { !props.inModal &&
                <Col className="d-sm-block d-md-none ">
                    <Row className="">
                        <Col xs={2} className="px-0 pl-2">
                            <Button variant={'inline-action'} className="bg-white px-2"  
                                onClick={handleMemo}
                            >
                                    <SvgImage icon={"icon_note" + (state.showMemo ? "" : "_gray") + ".svg"} width={"27"} spanClass="py-1" />
                            </Button>
                        </Col>
                        <Col xs={2} className="px-0">
                            <span className="filters-panel text-nowrap">
                                <SortFilter className="small-button-icon"
                                    onSelect={handleSort} title={<span className="hide-in-modal"><SvgImage icon="icon_sort_dark.svg" width="40" />
                                    <span className="hide-in-button">Sortierung</span></span>}
                                    options={["Name", "Gattung", "Abstand zum Limit"]}
                                />
                            </span>
                            </Col>
                        <Col xs={8} className="px-0">
                            <Row className="filters-panel text-nowrap pl-5 ml-3">
                                <ViewOptionsDropdown handleView={handleView} view={{ name: state.view, id: state.view }} />
                            </Row>
                        </Col>
                    </Row>
                    <Row className="buttons-in-results limits justify-content-between mt-n1 mb-n4">
                        
                            <Col xs={6} className="px-0 pl-2 filters-in-limits">
                                <Button variant={'inline'}
                                    className={classNames('analyse-positive-button', state.isUpper ? "active" : '')}
                                    onClick={() => setState({
                                        ...state,
                                        isUpper: (state.isUpper ? undefined : true),
                                        limits: (state.isUpper ? props.limits : props.limits.filter(current => current.upper))
                                    })
                                    }
                                >
                                    <span>Obere </span> <span className="d-xl-inline d-sm-none"> Limits</span>
                                </Button>

                                <Button variant={'inline'}
                                    className={classNames('analyse-negative-button', state.isUpper == false ? "active" : '')}
                                    onClick={() => setState({
                                        ...state,
                                        isUpper: (state.isUpper == false ? undefined : false),
                                        limits: (state.isUpper == false ? props.limits : props.limits.filter(current => current.upper == false))
                                    })
                                    }
                                >
                                    <span className="">Untere</span> <span className="d-xl-inline d-sm-none"> Limits</span>
                                </Button>
                            </Col>

                            <Col xs={6} className={classNames("px-0 filters-in-limits text-right", props.inModal && "mr-n4")}>
                                <Button className={state.isActive ? "active" : ''} variant={'inline'}
                                    onClick={() => setState({
                                        ...state, isActive: (state.isActive ? undefined : true),
                                        limits: (state.isActive ? props.limits : props.limits.filter(current => current.hitStatus == false))
                                    }
                                    )}
                                >
                                    <span className="">Aktiv</span>
                                </Button>
                                <Button className={state.isActive == false ? "active" : ''} variant={'inline'}
                                    onClick={() => setState({
                                        ...state, isActive: (state.isActive == false ? undefined : false),
                                        limits: (state.isActive == false ? props.limits : props.limits.filter(current => current.hitStatus))
                                    }
                                    )}
                                >
                                    <span className="">Getroffen</span>
                                </Button>
                            </Col>
                    </Row>
                </Col>
}
            </Row>
            <ExposePageContent
                showMemo={state.showMemo}
                view={state.view}
                sort={state.sort}
                handleSort={handleSort}
                limits={props.limits}
                inModal={props.inModal}
                refetch={props.refetch}
                description={state.sort.sortType}
                direction={state.sort.direction}
                isActive={state.isActive}
                isUpper={state.isUpper} />
        </Container>
    );
}


interface LimitsPageContentState {
    showMemo: boolean;
    isUpper: boolean | any;
    isActive: boolean | any;
    limits: LimitEntry[];
    view: string;
    sort: { sortType: string, direction: boolean }
}

interface LimitsPageContentProps {
    profile: UserProfile;
    limits: LimitEntry[];
    refetch: () => void;
    inModal?: boolean;
    showTitle: boolean;
}


function ExposePageContent(props: ExposePageContentProps) {
    return (
        <div>
            {props.view === "Kacheln" &&
                <LimitsGridComponent
                    showMemo={props.showMemo}
                    limits={props.limits}
                    inModal={props.inModal}
                    refetch={props.refetch}
                    description={props.sort.sortType}
                    direction={props.sort.direction}
                    isActive={props.isActive}
                    isUpper={props.isUpper}
                />
            }
            {props.view === "Liste" &&
                <LimitsTableComponent
                    showMemo={props.showMemo}
                    sort={props.sort}
                    handleSort={props.handleSort}
                    limits={props.limits}
                    inModal={props.inModal}
                    refetch={props.refetch}
                    description={props.sort.sortType}
                    direction={props.sort.direction}
                    isActive={props.isActive}
                    isUpper={props.isUpper}
                />
            }
        </div>
    )
}

interface ExposePageContentProps {
    view: string;
    showMemo: boolean;
    sort: { sortType: string, direction: boolean }
    handleSort: (value: { id: string, name: string }, order: boolean) => void;
    limits: LimitEntry[];
    refetch: () => void;
    description?: string;
    direction?: boolean;
    inModal?: boolean;
    isUpper?: boolean;
    isActive?: boolean;
}

import { Mutation, UserProfile, Watchlist } from '../../../graphql/types';
import { useState } from 'react';
import { WatchlistViewsComponent } from './WatchlistViewsComponent';
import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';
import { Button, Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import SvgImage from 'components/common/image/SvgImage';
import { SortingDropdown } from './WatchlistExposePage/DropdownFilters/SortingDropdown';
import { ViewOptionsDropdown } from './WatchlistExposePage/DropdownFilters/ViewOptionsDropdown';

export function WatchlistContentComponent(props: WatchlistPageContentProps) {
    let [mutation] = useMutation<Mutation>(loader('./updateWatchlistView.graphql'));

    let watchlistViewName = props.watchlist.viewType === "PerformanceKacheln" || props.watchlist.viewType === "PerformanceListe" ? "Performance" : props.watchlist.viewType;

    const handleView = (e: Option) => {
        const id = props.watchlist.id;
        const newValue = e.id;
        mutation({
            variables: {
                viewType: newValue,
                watchlistId: props.watchlist.id
            },
            update(cache) {
                const normalizedId = cache.identify({ id, __typename: 'Watchlist' });
                cache.modify({
                    id: normalizedId,
                    fields: {
                        viewType(cachedValue) {
                            return newValue;
                        },
                    },
                    /* broadcast: false; // Include this to prevent automatic query refresh */
                });
            }
        })
    };

    const [showMemo, setShowMemo] = useState<boolean>(false);
    const handleMemo = (value: boolean) => setShowMemo(value);

    const location = useLocation();
    if (location.state === "scrollToTop") {
        window.scrollTo(0, 0);
        location.state = undefined;
    }

    return (
        <section className="main-section mb-3">
            <WatchlistView handleView={handleView} view={{ name: watchlistViewName || "Chart", id: props.watchlist.viewType || "Chart" }} watchlist={props.watchlist} refreshTrigger={props.refreshTrigger} profile={props.profile} handleMemo={handleMemo} showMemo={showMemo} />
        </section>
    );
}

interface WatchlistPageContentProps {
    watchlist: Watchlist;
    refreshTrigger: () => void;
    profile: UserProfile;
}

interface Option {
    name: string;
    id: string;
}

interface SortOption {
    sortType: string;
    direction: boolean;
}

function WatchlistView(props: WatchlistViewProps) {

    let [mutation] = useMutation<Mutation>(loader('./editWatchlistOrder.graphql'));
    const handleSort = (sort: SortOption) => {
        const id = props.watchlist.id;
        mutation({
            variables: {
                viewOrder: sort.sortType,
                viewOrderAsc: sort.direction,
                watchlistId: props.watchlist.id
            },
            update(cache) {
                const normalizedId = cache.identify({ id, __typename: 'Watchlist' });
                cache.modify({
                    id: normalizedId,
                    fields: {
                        viewOrder(cachedValue) {
                            return sort.sortType;
                        },
                        viewOrderAsc(cachedValue) {
                            return sort.direction;
                        },
                    },
                    /* broadcast: false; // Include this to prevent automatic query refresh */
                });
            }
        })
    };
    
    const handleSortTable = (sort: string) => {
        const id = props.watchlist.id;
        mutation({
            variables: {
                viewOrder: sort,
                viewOrderAsc: sort===props.watchlist.viewOrder ? !props.watchlist.viewOrderAsc : true,
                watchlistId: props.watchlist.id
            },
            update(cache) {
                const normalizedId = cache.identify({ id, __typename: 'Watchlist' });
                cache.modify({
                    id: normalizedId,
                    fields: {
                        viewOrder(cachedValue) {
                            return sort;
                        },
                        viewOrderAsc(cachedValue) {
                            return sort===props.watchlist.viewOrder ? !props.watchlist.viewOrderAsc : true;
                        },
                    },
                    /* broadcast: false; // Include this to prevent automatic query refresh */
                });
            }
        })
    };

    return (
        <Container className="main-section">
            <div className="d-xl-flex d-lg-flex d-sm-block justify-content-between align-items-center mb-n2 mx-lg-0 mx-sm-2">
                <div className='d-flex align-items-center justify-content-sm-between'>
                    <h2 className="fs-24px mt-2 font-weight-bold mb-sm-2 d-flex font-family-roboto-slab mr-xl-4 mr-lg-3">Einzelwerte <span className='d-none d-xl-block ml-2'> - {props.watchlist.name}</span></h2>
                </div>
                <div className='d-lg-flex justify-content-end pt-xl-2 pt-sm-0 mb-xl-0 mb-sm-n2 mx-xl-0 mr-sm-0 mt-1'>
                    <div className="d-flex justify-content-lg-between justify-content-sm-end filters-row-watchlist">
                        <Button variant={'inline-action'} className="d-flex bg-white align-middle memo-button"
                            onClick={() => props.handleMemo(!props.showMemo)}
                        >
                            <SvgImage icon={"icon_note" + (props.showMemo ? "" : "_gray") + ".svg"} width={"30"} spanClass="pt-1" />
                            <span className={classNames("pt-2 mt-1 font-weight-bold mx-1 memo-text", props.showMemo ? "text-dark" : "text-gray")}>Notizen</span>
                        </Button>
                        <div className="sort-dropdown">
                            {
                                !(props.view.id === "Erweitert" || props.view.id === "PerformanceListe" || props.view.id === "Einfach") &&
                                <SortingDropdown handleSort={handleSort} sort={{ sortType: props.watchlist.viewOrder || "Name", direction: !!props.watchlist.viewOrderAsc }} />
                            }
                        </div>
                        <div className="view-dropdown">
                            <ViewOptionsDropdown handleView={props.handleView} view={props.view} />
                        </div>
                    </div>
                </div>
            </div>
            <WatchlistViewsComponent
                profile={props.profile} 
                handleSort={handleSortTable} 
                watchlist={props.watchlist} 
                view={props.view.id} 
                sort={{ sortType: props.watchlist.viewOrder || "Name", direction: !!props.watchlist.viewOrderAsc }} 
                showMemo={props.showMemo}
                refreshTrigger={() => props.refreshTrigger && props.refreshTrigger()} 
                limits={props.profile.limits || []} />
        </Container>
    );
}



interface WatchlistViewProps {
    watchlist: Watchlist;
    handleView: (value: Option) => void;
    view: Option;
    handleMemo: (value: boolean) => void;
    showMemo: boolean;
    refreshTrigger: () => void;
    profile: UserProfile;
}
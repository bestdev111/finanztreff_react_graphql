import { useState } from 'react';
import { Button, Container } from "react-bootstrap";
import { Mutation, Portfolio, PortfolioPerformanceEntry, UserProfile } from '../../../graphql/types';
import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';
import { PortfolioViewsComponent } from './PortfolioViewsComponent';
import { calculatePortfolioEntry, calculatePortfolioEntryErtrage, calculateChange } from '../utils';
import classNames from 'classnames';
import SvgImage from 'components/common/image/SvgImage';
import { SortingDropdown } from './PortfolioExposeNewPage/DropdownFilters/SortingDropdown';
import { ViewOptionsDropdown } from './PortfolioExposeNewPage/DropdownFilters/ViewOptionsDropdown';

export const PortfolioPageContent = (props: PortfolioPageContentProps) => {
    let [mutation] = useMutation<Mutation>(loader('./updatePortfolioView.graphql'));

    let portfolioViewName = props.portfolio.viewType === "PerformanceKacheln" || props.portfolio.viewType === "PerformanceListe" ? "Performance" : props.portfolio.viewType;

    const handleView = (e: Option) => {
        const id = props.portfolio.id;
        const newValue = e.id;
        mutation({
            variables: {
                viewType: newValue,
                portfolioId: props.portfolio.id
            },
            update(cache) {
                const normalizedId = cache.identify({ id, __typename: 'Portfolio' });
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
            .then(() => {
                props.refreshTrigger()
            });
    };


    const [showMemo, setShowMemo] = useState<boolean>(false);
    const handleMemo = (value: boolean) => setShowMemo(value);

    return (
        <>
            <section className="main-section mb-4">
                <PortfolioViews refreshTrigger={props.refreshTrigger} portfolio={props.portfolio} handleView={handleView} handleMemo={handleMemo}
                    view={{ name: portfolioViewName || "Portfolio", id: props.portfolio.viewType || "Portfolio" }} showMemo={showMemo} performanceEntries={props.performanceEntries} realportfolio={props.realportfolio} profile={props.profile} />
            </section>
        </>
    );
}

function PortfolioViews(props: PortfolioViewsProps) {

    let [mutation] = useMutation<Mutation>(loader('./editPortfolioOrder.graphql'));
    const handleSort = (sort: SortOption) => {
        const id = props.portfolio.id;
        mutation({
            variables: {
                viewOrder: sort.sortType,
                viewOrderAsc: sort.direction,
                portfolioId: props.portfolio.id
            },
            update(cache) {
                const normalizedId = cache.identify({ id, __typename: 'Portfolio' });
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

    return (
        <Container className="main-section">
            <div className="d-xl-flex d-lg-flex d-sm-block justify-content-between align-items-center mb-n2 mx-lg-0 mx-sm-2">
                <div className='d-flex align-items-center justify-content-sm-between'>
                    <h2 className="fs-24px mt-2 font-weight-bold mb-sm-2 d-flex font-family-roboto-slab mr-xl-4 mr-lg-3">Einzelwerte <span className='d-none d-xl-block ml-2'> - {props.portfolio.name}</span></h2>
                    <TopFlopPortfolio portfolio={props.portfolio} />
                </div>
                <div className='d-lg-flex justify-content-end pt-xl-2 pt-sm-0 mb-xl-0 mb-sm-n2 mx-xl-0 mr-sm-0 mt-1'>
                    <div className="d-flex justify-content-lg-between justify-content-sm-end filters-row-portfolio">
                        <Button variant={'inline-action'} className="d-flex bg-white align-middle memo-button"
                            onClick={() => props.handleMemo(!props.showMemo)}
                        >
                            <SvgImage icon={"icon_note" + (props.showMemo ? "" : "_gray") + ".svg"} width={"30"} spanClass="pt-1" />
                            <span className={classNames("pt-2 mt-1 font-weight-bold mx-1 memo-text", props.showMemo ? "text-dark" : "text-gray")}>Notizen</span>
                        </Button>
                        <div className="sort-dropdown">
                            {
                                !(props.view.id === "Erweitert" || props.view.id === "PerformanceListe" || props.view.id === "Einfach") &&
                                <SortingDropdown handleSort={handleSort} sort={{ sortType: props.portfolio.viewOrder || "Name", direction: !!props.portfolio.viewOrderAsc }} />
                            }
                        </div>
                        <div className="view-dropdown">
                            <ViewOptionsDropdown handleView={props.handleView} view={props.view} />
                        </div>
                    </div>
                </div>
            </div>
            <PortfolioViewsComponent 
                profile={props.profile} 
                portfolio={props.portfolio} 
                performanceEntries={props.performanceEntries}  
                handleSort={handleSort}  
                view={props.view.id} 
                sort={{ sortType: props.portfolio.viewOrder || "Name", direction: !!props.portfolio.viewOrderAsc }} 
                showMemo={props.showMemo} 
                realportfolio={props.realportfolio}
                refreshTrigger={props.refreshTrigger} 
                limits={props.profile.limits || []} />
        </Container>
    );

}

interface PortfolioViewsProps {
    portfolio: Portfolio;
    performanceEntries: PortfolioPerformanceEntry[]
    refreshTrigger: () => void;
    realportfolio?: boolean
    handleView: (value: Option) => void;
    view: Option;
    handleMemo: (value: boolean) => void;
    showMemo: boolean;
    profile: UserProfile;

}

interface PortfolioPageContentProps {
    portfolio: Portfolio;
    performanceEntries: PortfolioPerformanceEntry[];
    refreshTrigger: () => void;
    profile: UserProfile;
    realportfolio?: boolean
}

interface Option {
    name: string;
    id: string;
}

interface SortOption {
    sortType: string;
    direction: boolean;
}

function TopFlopPortfolio({ portfolio }: TopFlopPortfolioProps) {
    let [positive, neutral, negative] = [0, 0, 0]
    if (portfolio && portfolio.entries) {
        portfolio.entries.filter(entry => entry.instrument).map(portfolioEntry => {
            const [initial, yesterday, last] = calculatePortfolioEntry(portfolioEntry);
            const ertrage: number = calculatePortfolioEntryErtrage(portfolio, portfolioEntry);
            const total: number = last + ertrage;
            const [totalDiff, totalPct] = calculateChange(initial, total);
            totalDiff > 0 ? positive++ : totalDiff < 0 ? negative++ : neutral++;
        })


        return (<div className='d-flex fs-15px'>
            <div className='text-white bg-green text-center rounded sqare-24px'>
                {positive}
            </div>
            <div className='text-white bg-gray text-center rounded mx-1  sqare-24px'>
                {neutral}
            </div>
            <div className='text-white bg-pink text-center rounded sqare-24px'>
                {negative}
            </div>
        </div>);
    }
    return (<></>);
}

interface TopFlopPortfolioProps {
    portfolio: Portfolio
}

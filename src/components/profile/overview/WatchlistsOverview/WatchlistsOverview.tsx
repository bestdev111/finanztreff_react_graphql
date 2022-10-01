import { Watchlist } from 'graphql/types';
import {useState} from 'react';
import { Container } from 'react-bootstrap';
import { WatchlistsOverviewItems } from './WatchlistsOverviewItems';
import { MainFilterRow } from '../PortfoliosOverview/DropdownFilters/MainFilterRow';


export function WatchlistsOverview({ watchlists, refreshTrigger }: WatchlistsOverviewProps) {

	const [sort, setSort] = useState<SortOption>({ sortType: "Anzahl Werte", direction: true })
	const handleSort = (value: SortOption) => setSort({ sortType: value.sortType, direction: value.direction });

	const [showMemo, setShowMemo] = useState<boolean>(false);
	const handleMemo = (value: boolean) => setShowMemo(value);

	let orderedWatchlists = getOrderedWatchlists(sort, watchlists);
	const emptyWatchlists = watchlists.filter(watchlist => !watchlist.entries || (watchlist.entries && watchlist.entries.length <= 0)) || [];


	const SORT_OPTIONS_LIST = ["Name", "Anzahl Werte", "Erstellt am..."];

	return (
		<section className="main-section">
			<Container className="main-section">
				<div className="d-xl-flex d-lg-flex d-sm-block justify-content-between align-items-center mb-n2 mx-lg-0 mx-sm-2">
					<div className="font-weight-bold d-flex font-family-roboto-slab">
						<span className="svg-icon top-move mx-1">
							<img src="/static/img/svg/icon_watchlist_dark.svg" className="mb-n2 watchlists-section-icon" alt="" />
						</span>
						<h2 id="watchlists-section">Meine Watchlisten</h2>
					</div>
					<div>
						<MainFilterRow handleSort={handleSort} sort={sort} handleMemo={handleMemo} showMemo={showMemo} sortOptionsList={SORT_OPTIONS_LIST} />
					</div>
				</div>
				<WatchlistsOverviewItems watchlists={orderedWatchlists} emptyWatchlists={emptyWatchlists} sort={sort} showMemo={showMemo}
					refreshTrigger={refreshTrigger} />
			</Container>
		</section>
	);
}


function getOrderedWatchlists(sort: SortOption, watchlists: Watchlist[]): Watchlist[] {
	let orderedWatchlists: Watchlist[] = watchlists.filter(watchlist => watchlist.entries && watchlist.entries.length > 0);
	switch (sort.sortType) {
		case "Name": orderedWatchlists = orderedWatchlists.slice().sort(function (a, b) {
			if (a.name!.toLowerCase() > b.name!.toLowerCase()) return 1;
			else if (a.name!.toLowerCase() < b.name!.toLowerCase()) return -1;
			return 0;
		}); break;
		case "Anzahl Werte": orderedWatchlists = orderedWatchlists.slice().sort(function (a, b) {
			if (a.entries?.length! > b.entries?.length!) return 1;
			else if (a.entries?.length! < b.entries?.length!) return -1;
			return 0;
		}); break;

		case "Erstellt am...": orderedWatchlists = orderedWatchlists.slice().sort(function (a: Watchlist, b: Watchlist){
			if (a.createdOn > b.createdOn) return 1;
			else if (a.createdOn < b.createdOn) return -1;
			return 0;
		}); break;
	}

	orderedWatchlists = sort.direction ? orderedWatchlists : orderedWatchlists.reverse();

	return orderedWatchlists;
}


interface WatchlistsOverviewProps {
	watchlists: Array<Watchlist>;
	refreshTrigger: () => void;
}

interface SortOption {
	sortType: string;
	direction: boolean;
}

import { useQuery } from '@apollo/client';
import SvgImage from 'components/common/image/SvgImage';
import { LimitEntry, Query } from 'generated/graphql';
import { loader } from 'graphql.macro';
import { Spinner } from 'react-bootstrap';
import { LimitsPageBanner } from './LimitsBanner/LimitsPageBanner';
import { LimitsPageContent } from './LimitsPageContent';
import {useEffect} from "react";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable, generatePVariable, generateDataArray } from 'components/common/TargetingService';
import keycloak from 'keycloak';
import { Helmet } from 'react-helmet';
import { calculatePortfoliosTotal } from '../utils';
import { numberFormat } from 'utils';

export function LimitsPage(props: LimitsPageProps) {

	let { loading, data, refetch } = useQuery<Query>(loader('./getLimits.graphql'));
	let refreshTrigger = props.refreshTrigger || refetch;

	useEffect(() => {
		trigInfonline(guessInfonlineSection(), "limits_page");
	}, [])

	if (loading) {
		return (
			<div className="text-center py-2">
				<Spinner animation="border" role="status">
					<span className="sr-only">Bitte warten...</span>
				</Spinner>
			</div>
		)
	}

	if (!data || !data.user || !data.user.profile) {
		window.location.href = '/mein-finanztreff/';
		return <></>;
	}

	const profile = data.user.profile;
	const limits = profile.limits || [];

	let price = profile?.portfolios?.filter(portfolio => portfolio.inMasterPortfolio)
	let watchlist = profile?.watchlists

	if(price){
        localStorage.setItem('pVariable',JSON.stringify(generatePVariable(numberFormat(calculatePortfoliosTotal(price)[2]), price.length)));
        localStorage.setItem('mfVariable', JSON.stringify(generateDataArray(price,watchlist)));
    }
	
	return (
		<>
			<Helmet>
				{price &&
					<script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated), null, null, null, generatePVariable(numberFormat(calculatePortfoliosTotal(price)[2]), price.length), generateDataArray(price,watchlist))) + `;`}</script>
				}
				<script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
			</Helmet>
			<LimitsPageBanner profile={profile} limits={limits} refetch={async () => await refreshTrigger()} />
			<section className="main-section mb-3">
				<LimitsPageContent profile={profile} limits={limits} refetch={async () => await refreshTrigger()} showTitle={true}/>
			</section>
		</>
	);
}

interface LimitsPageProps {
	refreshTrigger?: () => void;
}

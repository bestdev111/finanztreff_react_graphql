import {useLazyQuery, useQuery} from '@apollo/client';
import { GET_ASSET_PAGE } from "../../../graphql/query";
import { Link, useLocation, useParams } from 'react-router-dom';
import { NewsAssetPageSection, PageBannerComponent } from "../../common";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import React, { useEffect, useRef } from "react";
import { AssetGroup, Instrument, Query } from "../../../generated/graphql";
import { IndexQuoteAndExchangeSection } from "./components/IndexQuoteAndExchangeSection/IndexQuoteAndExchangeSection";
import { IndexCompositionComponent } from "./IndexComposition/IndexCompositionComponent";
import { IndexTechnicalKeyFiguresSection } from "./components/IndexTechnicalKeyFiguresSection/IndexTechnicalKeyFiguresSection";
import { LatestAnalysisSection } from "../../Home";
import { ShareToolsComponent } from "../SharePage/components/ShareToolsComponent";
import { loader } from "graphql.macro";
import { IndexPortraitSection } from "./components/IndexPortraitSection/IndexPortraitSection";
import { TradePredictionSection } from "../../common/asset/TradePredictionSection/TradePredictionSection";
import { BestAndWorseComponent } from "./components/IndexBestAndWorseSection/BestAndWorseComponent";
import { IndexScreenerRating } from "./components/IndexScreenerRating/IndexScreenerRating";
import IndexChartSignal from "./components/IndexChartSignal/IndexChartSignal";
import { guessInfonlineSection, trigInfonline } from "../../common/InfonlineService";
import { Helmet } from "react-helmet";
import { getInstrumentIdByExchnageCode, SECTIONS } from 'utils';
import { Page404 } from 'components/common/page404/Page404';
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from 'components/common/TargetingService';
import keycloak from 'keycloak';
import { getAssetForUrl } from 'components/profile/utils';
import { HorizontalNaviationBar } from 'components/common/horizontal-navigation-bar/HorizontalNaviationBar';

interface Child {
	changeInstrument: (id: number) => void;
}

export const IndexPage = () => {
	let location = useLocation();
	const pathParam = useParams<{ section: string, seoTag: string }>();
	const seoTag = pathParam.seoTag;
	const asset = useQuery<Query>(GET_ASSET_PAGE, {
		variables: { seoTag: seoTag },
	});

	let childRef = useRef<Child>();
	let childRefPred = useRef<Child>();

	const instrumentChange = (instrumentId: number) => {
		if (childRef && childRef.current) {
			childRef.current.changeInstrument(instrumentId);
		}
		if (childRefPred && childRefPred.current) {
			childRefPred.current.changeInstrument(instrumentId);
		}
	};

	const [fetchData,{ data, loading  }] = useLazyQuery<Query>(
		loader('./getIndexPage.graphql'));

	useEffect(() => {
		trigInfonline(guessInfonlineSection(), "portrait_page");
	}, [])
	useEffect(() => {
		if (asset && asset.data && asset.data.assetPage && asset.data?.assetPage.assetGroup === AssetGroup.Index) {
			fetchData({variables: {groupId: asset.data?.assetPage?.groupId}})
		}
	}, [asset])
	if (asset.loading || loading)
		return (
			<div className={"mt-4 d-flex justify-content-center"} style={{ height: "70px" }}><Spinner animation="border" /></div>
		);

	if (asset && asset.data && asset.data.assetPage && asset.data.assetPage.assetGroup !== AssetGroup.Index
		&& data && data.group && data.group.content.length > 0) {
		return (<Page404 />)
	}

	if (!SECTIONS.includes(pathParam.section)) {
		return (<Page404 />)
	}

	if (data && data.group) {
		const mainIntrument: Instrument = data.group.content.filter(current => current.main)[0];
		return (
			<div className="mb-3">
				{asset.data && data && data.group &&
					<>
						{asset.data.assetPage && asset.data.assetPage.robots && asset.data.assetPage.robots.index && asset.data.assetPage.robots.follow ?
							<Helmet>
								<title>{`${data.group?.name} - ${data.group?.wkn ? data.group?.wkn + ' - ' : ''} ${data.group?.isin} - Kurs - Chart - News`}</title>
								<meta name="description"
									content={`Überblick Index ${data.group?.name} - WKN ${data.group?.wkn}, ISIN ${data.group?.isin} - Kurse, Kennzahlen, Analysen ➨ bei finanztreff.de topaktuell und kostenlos!`} />
								<meta name="keywords"
									content={`Ausführliches Indexportrait ${data.group?.name}, WKN ${data.group?.wkn}, ISIN ${data.group?.isin} - finanztreff: Indizes weltweit, Aktienindex Deutschland, Aktienindex aktuell, Aktienindizes, Rohstoffindizes, Rentenindizes, Strategieindizes, Kennzahlen, Vergleich, Risiko, Marktberichte, Zusammensetzung, Realtime, Echtzeit`} />
							</Helmet> :
							<Helmet><meta name="Robots" content="NOINDEX,NOFOLLOW" /></Helmet>
						}
					</>
				}
				<Helmet>
					<script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated), data.group.wkn, data.group.isin, data.group.assetType?.name, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
					<script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
				</Helmet>
				<PageBannerComponent group={data.group} assetClass="Index" className={"banner-index"} assetClassName={"index"}
					/*change={(id => setState({currentInstrumentId: id}))}*/
					change={(id) => {
						trigInfonline(guessInfonlineSection(), 'borsenplatze'); instrumentChange(id)
					}}
				>
				</PageBannerComponent>
				<HorizontalNaviationBar links={[
					<Link className="text-white" onClick={() => trigInfonline(guessInfonlineSection(), 'weitere_borsenplatze')}
						to={{
							key: '',
							pathname: "/" + getAssetForUrl(data.group.assetGroup).toLowerCase() + "/kurse/" + pathParam.seoTag + "/",
							hash: '#boersen',
							state: getInstrumentIdByExchnageCode(data.group, location)
						}}>
						Börsenplätze
					</Link>,
					<Link className="text-white" onClick={() => trigInfonline(guessInfonlineSection(), 'times_sales')}
						to={{
							key: 'times',
							pathname: "/" + getAssetForUrl(data.group.assetGroup).toLowerCase() + "/kurse/" + pathParam.seoTag + "/",
							hash: '#times',
							state: getInstrumentIdByExchnageCode(data.group, location)
						}}>
						Times &amp; Sales
					</Link>,
					<Link className="text-white" onClick={() => trigInfonline(guessInfonlineSection(), 'historische_kurse')}
						to={{
							key: 'historie',
							pathname: "/" + getAssetForUrl(data.group.assetGroup).toLowerCase() + "/kurse/" + pathParam.seoTag + "/",
							hash: '#historie',
							state: getInstrumentIdByExchnageCode(data.group, location)
						}}>
						Historische Kurse
					</Link>,
					<Link className="text-white" onClick={() => trigInfonline(guessInfonlineSection(), 'kursvergleich')}
						to={{
							key: 'chart',
							pathname: "/" + getAssetForUrl(data.group.assetGroup).toLowerCase() + "/kurse/" + pathParam.seoTag + "/",
							hash: '#chart',
							state: getInstrumentIdByExchnageCode(data.group, location)
						}}>
						Kursvergleich letzte Handelstage
					</Link>,
					<>
					{data.group.compositions.length>0 &&
						<a className="text-white" href='#indexzusammensetzung'>
							Indexzusammensetzung
						</a>
					}
					</>,
					<>
					{data.group.underlying &&
						<a className="text-white" href='#zugehorige-produkte'>
							Zugehörige
						</a>
					}
					</>
				]} />
				<IndexQuoteAndExchangeSection instrumentId={getInstrumentIdByExchnageCode(data.group, location)} instrumentGroup={data.group} ref={childRef} />
				<TradePredictionSection instrumentGroup={data.group} />
				{data.group.id &&
					<IndexCompositionComponent group={data.group} showOtherIndicesButton={true} />
				}
				{mainIntrument &&
					<IndexTechnicalKeyFiguresSection instrument={mainIntrument} />
				}
				<BestAndWorseComponent group={data.group} title={" Beste und schlechteste " + data.group.name + " Aktien "} />
				{data.group.isin &&
					<NewsAssetPageSection isin={data.group.isin} groupName={data.group.name} />
				}
				{data.group.id &&
					<LatestAnalysisSection groupId={data.group.id} />
				}
				<Container className={"px-0 px-md-3 mt-3"}>
					<Row>
						<Col xl={9} md={12} sm={12}>
							<IndexChartSignal productName={data.group.name + " Einzelwerte"} />
						</Col>
						<Col xl={3} md={6}>
							<IndexScreenerRating productName={data.group.name + " Einzelwerte"}
												 seoTag={data.group.seoTag || ""}
												 groupId={data.group.id || 0} />
						</Col>
					</Row>
				</Container>
				<IndexPortraitSection group={data.group} />
				{
					data.group.underlying &&
					<ShareToolsComponent group={data.group} />
				}
			</div>
		);
	}
	return (<></>);
};

import DerivativeTopSearch from "./search/DerivativeTopSearch";
import React, {useContext, useEffect, useMemo, useState} from "react";
import DerivativeSearchTags from "./search/DerivativeSearchTags";
import DerivativeResultsSection from "./search/DerivativeResultsSection";
import {
    AssetClass,
    AssetGroup, AssetTypeGroup,
    InstrumentTopFlop,
    Query
} from "../../generated/graphql";
import DerivativeTradingIdeas from "./derivativeUnderlying/DerivativeTradingIdeas";
import DerivativeUnderlyingTagComponent from "./search/DerivativeUnderlyingTagComponent";
import {UnderlyingTags} from "./search/underlying/UnderlyingTags";
import {useQuery} from "@apollo/client";
import {GET_INSTRUMENTS_LIST, GET_MOST_SEARCHED, GET_TOP_FLOP_DAX} from "graphql/query";
import {Container, Spinner} from "react-bootstrap";
import UnderlyingTagNames from "./search/underlying/UnderlyingTagNames";
import {loader} from "graphql.macro";
import {DerivativeFilter, DerivativeSearchConfig, emptyDerivativeFilter} from "./search/types/DerivativeSearchTypes";
import {useBootstrapBreakpoint} from "../../hooks/useBootstrapBreakpoint";
import DerivativeAssetClassTagComponent from "./search/DerivativeAssetClassTagComponent";
import {Helmet} from "react-helmet";
import { trigInfonline } from "components/common/InfonlineService";
import { generateTargetingObject, guessTargetingZone, generateRoSvariable, generateLoginVariable } from "components/common/TargetingService";
import { data } from "highcharts";
import keycloak from "keycloak";


export type ActiveConfigContent = {
    activeConfig: number;
    setActiveConfig: (c: number) => void;
}
export type ConfigContextContent = {
    getSearchConfig: () => DerivativeSearchConfig;
    setSearchConfig: (c: DerivativeSearchConfig) => void;
}
export type FilterContextContent = {
    getSearchFilter: () => DerivativeFilter;
    setSearchFilter: (c: DerivativeFilter, assetTypeGroupId: string | null) => void;
}
export type DataContextContent = {
    derivativeTypeInput: any;
    derivativeIssuers: any;
    derivativeAssetClasses: any;
    derivativeAssetTypeGroups: any;
    derivativeAssetTypeTyps: any;
}

export const ActiveConfigContext = React.createContext<ActiveConfigContent>({
    activeConfig: 0, setActiveConfig: () => {
    }
} as ActiveConfigContent);

export const ConfigContext = React.createContext<ConfigContextContent>({} as ConfigContextContent);
export const FilterContext = React.createContext<FilterContextContent>({} as FilterContextContent);
export const DataContext = React.createContext<DataContextContent>({} as DataContextContent);


export function DerivativeSearch(props: any) {
    useEffect(() => {
        trigInfonline('derivatives', 'search')
    }, [])

    const q = new URLSearchParams(props.location.search);

    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });

    const [queryLoaded, setQueryLoaded] = useState(false);
    const [lastLoadedUnderlyingId, setLastLoadedUnderlyingId] = useState<any>(null);


    const {
        data: tradedData,
        loading: tradedLoading
    } = useQuery<Query>(GET_INSTRUMENTS_LIST, {variables: {id: "hot_instruments_by_trades"}});
    const {data: searchedData, loading: searchedLoading} = useQuery<Query>(GET_MOST_SEARCHED);
    const {data: topsAndFlopsData, loading: topsAndFlopsLoading} = useQuery<Query>(GET_TOP_FLOP_DAX);

    const [activeConfig, setActiveConfig] = useState<number>(0);
    const [config, setConfig] = useState<DerivativeSearchConfig>(() => ({
        assetClass: null,
        assetGroup: null,
        assetTypeGroup: null,
        underlying: null,
        selectedInstrument: null
    }));
    const [reverseConfig, setReverseConfig] = useState<DerivativeSearchConfig>(() => ({
        assetClass: null,
        assetGroup: null,
        assetTypeGroup: null,
        underlying: null,
        selectedInstrument: null
    }));

    const getSearchConfig = function (): DerivativeSearchConfig {
        return activeConfig === 0 ? config : reverseConfig
    }


    const qDerivativeTypes = useQuery<Query>(loader('./search/getDerivativeTypeInput.graphql'));
    const qIssuers = useQuery<Query>(loader('./search/getDerivativeIssuers.graphql'));
    const qAssetClasses = useQuery<Query>(loader('./search/getDerivativeAssetClasses.graphql'),
        {
            skip: !getSearchConfig().underlying?.group.id,
            variables: {
                underlyingInstrumentGroupId: getSearchConfig().underlying?.group.id
            }
        });

    const qAssetTypeGroup = useQuery<Query>(loader('./search/getDerivativeAssetTypeGroup.graphql'),
        {
            skip: !(getSearchConfig().assetClass && getSearchConfig().underlying?.group.id),
            variables: {
                underlyingInstrumentGroupId: getSearchConfig().underlying?.group.id,
                assetClassId: getSearchConfig().assetClass?.id
            }
        });

    let qAssetTypeTypPath: any;
    if (isDesktop) qAssetTypeTypPath = loader('./search/getDerivativeAssetTypeTypsDesktop.graphql');
    else qAssetTypeTypPath = loader('./search/getDerivativeAssetTypeTypsMobile.graphql');

    const qAssetTypeTyp = useQuery<Query>(qAssetTypeTypPath, {
        skip: !(
            (!isDesktop && getSearchConfig().assetClass?.id) ||
            (isDesktop && getSearchConfig().assetTypeGroup?.id && getSearchConfig().underlying?.group.id)
        ),
        variables: {
            underlyingInstrumentGroupId: getSearchConfig().underlying?.group.id,
            assetTypeGroupId: getSearchConfig().assetTypeGroup?.id,
            assetClassId: getSearchConfig().assetClass?.id
        }
    });

    const dataContext = useMemo<DataContextContent>(() => {
        return {
            derivativeTypeInput: qDerivativeTypes.data,
            derivativeIssuers: qIssuers.data,
            derivativeAssetClasses: qAssetClasses.data?.group?.derivativeAssetClassBucket,
            derivativeAssetTypeGroups:
                (qAssetTypeGroup.data?.group?.derivativeAssetTypeGroupBucket ? [...qAssetTypeGroup.data.group.derivativeAssetTypeGroupBucket].sort(
                    (g1, g2) => {
                        return g1.count > g2.count ? -1 : (g1.count < g2.count ? 1 : 0)
                    }
                ) : []),
            derivativeAssetTypeTyps: qAssetTypeTyp.data?.group?.derivativeAssetTypeBucket.filter(b => b.count > 0),
        } as DataContextContent
    }, [qDerivativeTypes.data, qIssuers.data, qAssetClasses.data, qAssetTypeGroup.data, qAssetTypeTyp.data]);


    const [filters, setFilters] = useState<Map<string, DerivativeFilter>>(() => new Map<string, DerivativeFilter>());
    const [reverseFilters, setReverseFilters] = useState<Map<string, DerivativeFilter>>(() => new Map<string, DerivativeFilter>());

    const getSearchFilter = function (): DerivativeFilter {
        const assetType: string = getSearchConfig().assetTypeGroup?.id || 'notype';
        const f: Map<string, DerivativeFilter> = activeConfig === 0 ? filters : reverseFilters;
        return f.get(assetType) || emptyDerivativeFilter();
    }

    const setSearchConfig = function (newConfig: DerivativeSearchConfig) {
        if (activeConfig === 0) setConfig({...newConfig}); else setReverseConfig({...newConfig});
    }

    const setSearchFilter = function (newFilter: DerivativeFilter, assetTypeGroupId: string | null = null) {
        const assetType: string = assetTypeGroupId || getSearchConfig().assetTypeGroup?.id || 'notype';
        const f: Map<string, DerivativeFilter> = (activeConfig === 0) ? filters : reverseFilters;
        f.set(assetType, {...newFilter});
        setFilters(new Map<string, DerivativeFilter>(f));
    }

    const clearSearchFilter = function () {
        const f: Map<string, DerivativeFilter> = (activeConfig === 0) ? filters : reverseFilters;
        f.clear();
        setFilters(new Map<string, DerivativeFilter>(f));
    }

    const [queryUnderlying, setQueryUnderlying] = useState<number | null>(null);


    useEffect(() => {
        if (props.location.search !== "") {
            const underlying = q.get('underlying');

            if (underlying && !isNaN(Number.parseInt(underlying))) {
                setQueryUnderlying(Number.parseInt(underlying));
                setLastLoadedUnderlyingId(Number.parseInt(underlying));
            }
        }
    }, []);

    useEffect(() => {
        if (props.location.state) {
            if (props.location.state.underlying) {
                if (Array.isArray(props.location.state.underlying)) {
                    var tempUnderlying = JSON.parse(JSON.stringify(props.location.state.underlying[0]));
                    Object.defineProperty(tempUnderlying, "wkn", {
                        value: props.location.state.underlying[0].group.wkn,
                        writable: true
                    })
                    Object.defineProperty(tempUnderlying, "snapQuote", {
                        value: props.location.state.underlying[0].instrument.snapQuote,
                        writable: true
                    })
                    if (tempUnderlying.name === null) {
                        tempUnderlying.name = tempUnderlying.group.name
                    }
                    tempUnderlying.id = tempUnderlying.instrument.id
                    Object.preventExtensions(tempUnderlying);
                } else {
                    tempUnderlying = JSON.parse(JSON.stringify(props.location.state.underlying));
                }
            }
            var tempAssetClass
            if (props.location.state.assetClass) {
                tempAssetClass = JSON.parse(JSON.stringify(props.location.state.assetClass));
                if (props.location.state.groupId) {
                    Object.defineProperty(tempAssetClass, "assetGroup", {
                        value: props.location.state.groupId.assetGroup,
                        writable: true
                    })
                }
            }
            var tempAssetType
            if (props.location.state.assetType) {
                tempAssetType = JSON.parse(JSON.stringify(props.location.state.assetType));
                if (dataContext.derivativeTypeInput) {
                    var tempTypes = JSON.parse(JSON.stringify(dataContext?.derivativeTypeInput.classification))
                    Object.defineProperty(tempAssetClass, "types", {
                        value: tempTypes[0].types,
                        writable: true
                    })
                }
            }
            if (props.location.state.clickedItem) {
                tempAssetClass.name = props.location.state.clickedItem.name.split(' ')[0]
                tempAssetClass.id = props.location.state.clickedItem.optionId;
                if (dataContext.derivativeTypeInput) {
                    var tempTypesClicked = JSON.parse(JSON.stringify(dataContext.derivativeTypeInput.classification))
                    switch (tempAssetClass.name) {
                        case 'Optionsscheine' :
                            tempAssetType.id = 'WARR_CLASSIC';
                            tempAssetType.name = 'Classic OS';
                            tempAssetClass.assetGroup = 'WARR';
                            tempAssetClass.types = tempTypesClicked[0].types;
                            break;
                        case 'Knock-Out' :
                            tempAssetType.id = 'KNOCK_CLASSIC';
                            tempAssetType.name = 'KO';
                            tempAssetClass.assetGroup = 'KNOCK';
                            tempAssetClass.types = tempTypesClicked[1].types;
                            break;
                        case 'Faktor' :
                            tempAssetType.id = 'CERT_FACTOR_ALL';
                            tempAssetType.name = 'Faktor';
                            tempAssetClass.assetGroup = 'CERT';
                            tempAssetClass.types = tempTypesClicked[6].types;
                            break;
                        case 'Aktienanleihe' :
                            tempAssetType.id = '550';
                            tempAssetType.name = 'Aktienanleihen - Classic';
                            tempAssetClass.assetGroup = 'CERT';
                            tempAssetClass.types = tempTypesClicked[2].types;
                            break;
                        case 'Bonus' :
                            tempAssetType.id = '591';
                            tempAssetType.name = 'Bonus-Zertifikate - Korridor';
                            tempAssetClass.assetGroup = 'CERT';
                            tempAssetClass.types = tempTypesClicked[3].types;
                            break;
                        case 'Discount' :
                            tempAssetType.id = '558';
                            tempAssetType.name = 'Classic, Protect & Protect Pro';
                            tempAssetClass.assetGroup = 'CERT';
                            tempAssetClass.types = tempTypesClicked[4].types;
                            break;
                        case 'Express' :
                            tempAssetType.id = '569';
                            tempAssetType.name = 'Express-Zertifikate - Alpha';
                            tempAssetClass.assetGroup = 'CERT';
                            tempAssetClass.types = tempTypesClicked[5].types;
                            break;
                        case 'Index / Partizipation' :
                            tempAssetType.id = '598';
                            tempAssetType.name = 'Index-/Partizipations-Zertifikate - Classic';
                            tempAssetClass.assetGroup = 'CERT';
                            tempAssetClass.types = tempTypesClicked[7].types;
                            break;
                        case 'Kapitalschutz' :
                            tempAssetType.id = '542';
                            tempAssetType.name = 'Kapitalschutz-Zertifikate - Alpha';
                            tempAssetClass.assetGroup = 'CERT';
                            tempAssetClass.types = tempTypesClicked[8].types;
                            break;
                        case 'Outperf./Sprint' :
                            tempAssetType.id = '609';
                            tempAssetType.name = 'Outperformance-Zertifikate - Capped Twin Win';
                            tempAssetClass.assetGroup = 'CERT';
                            tempAssetClass.types = tempTypesClicked[9].types;
                            break;
                        case 'Sonstige' :
                            tempAssetClass.assetGroup = 'CERT';
                            tempAssetClass.types = tempTypesClicked[10].types;
                            break;
                    }
                }

            }
            setSearchConfig({
                ...getSearchConfig(),
                underlying: tempUnderlying,
                assetTypeGroup: tempAssetType,
                assetClass: tempAssetClass
            } as DerivativeSearchConfig)
        }
    }, [])

    useEffect(() => {
        if (getSearchConfig().assetTypeGroup && props.location?.state?.issuer) {

            const f = getSearchFilter();
            if (props.location.state.clickedItem) {
                const type = props.location.state.clickedItem.optionType;
                if (type && type.toLocaleUpperCase() === 'CALL') {
                    f.callPut = 'CALL';
                }

                if (type && type.toLocaleUpperCase() === 'PUT') {
                    f.callPut = 'PUT';
                }
            }
            const issuerId = props.location.state.issuer.id;
            const issuerName = props.location.state.issuer.name

            if (issuerId && issuerName) {
                f.issuers = [{id: issuerId, name: issuerName}];
            }

            setSearchFilter(f);
        } else {
            const issuerId = q.get('issuerId');
            const issuerName = q.get('issuerName');

            if (issuerId && issuerName) {
                setSearchFilter({...getSearchFilter(), issuers: [{id: issuerId, name: issuerName}]});
            }
        }

    }, [config.assetTypeGroup, reverseConfig.assetTypeGroup]);

    function tryToSetIssuerFromQuery(type: string) {
        if (dataContext.derivativeIssuers && props.location.search !== "" && type !== '') {
            const issuerId = q.get('issuerId');
            const _i: number | null = issuerId ? parseInt(issuerId) : null;

            dataContext.derivativeIssuers.issuers.forEach(
                (i: any) => {
                    if (i.id === _i) {
                        const f = filters.get(type);
                        if (!f) {
                            setSearchFilter(emptyDerivativeFilter(null, null, null,
                                i.id, i.name));
                        }
                    }
                }
            )
        }
    }


    useEffect(() => {

        if (activeConfig === 0 && config.assetTypeGroup && props.location.search !== "") {
            // tryToSetIssuerFromQuery(config.assetType?.id || '');

            const f = getSearchFilter();

            const type = q.get('type');
            const issuerId = q.get('issuerId');
            const issuerName = q.get('issuerName');
            const from = q.get('from');
            const to = q.get('to');
            const assetGroup = q.get('assetGroup') as AssetGroup;

            if (issuerId && issuerName) {
                const _i = parseInt(issuerId);
                f.issuers = [{id: _i, name: issuerName}];
            }

            if (from) {
                const _from = parseInt(from);
                if (!isNaN(_from)) {
                    f.leverage.from = _from;
                }
            }

            if (to) {
                const _to = parseInt(to);
                if (!isNaN(_to)) {
                    f.leverage.to = _to;
                }
            }

            if (type && type.toLocaleUpperCase() === 'CALL') {
                f.callPut = 'CALL';
            }

            if (type && type.toLocaleUpperCase() === 'PUT') {
                f.callPut = 'PUT';
            }

            setSearchFilter({...f});
        }

    }, [config.assetTypeGroup]);

    useEffect(() => {
        if (dataContext.derivativeTypeInput && (props.location.search !== "")) {
            const q = new URLSearchParams(props.location.search);
            const aclass = q.get('aclass');
            const atype = q.get('atype');

            setQueryLoaded(true);
            dataContext.derivativeTypeInput.classification.forEach(
                (c: AssetClass) => {
                    if (c.name === aclass || c.id == (aclass || -1)) {
                        let cc = getSearchConfig();

                        if (!queryLoaded) cc.assetClass = c;
                        if (atype && !queryLoaded) {
                            c.typeGroups.forEach(
                                t => {
                                    if (t.id === atype) {
                                        cc.assetClass = c;
                                        cc.assetTypeGroup = t;
                                    }
                                }
                            )
                        } else {
                            if (!qAssetTypeGroup.loading) {
                                if (qAssetTypeGroup.data?.group?.derivativeAssetTypeGroupBucket && qAssetTypeGroup.data?.group?.derivativeAssetTypeGroupBucket.length > 0) {
                                    for (let i = 0; i < qAssetTypeGroup.data?.group?.derivativeAssetTypeGroupBucket.length; i++) {
                                        if (qAssetTypeGroup.data?.group?.derivativeAssetTypeGroupBucket[i].count > 0) {
                                            cc.assetTypeGroup = {
                                                    id: qAssetTypeGroup.data?.group?.derivativeAssetTypeGroupBucket[i]?.assetTypeGroup?.id,
                                                    name: qAssetTypeGroup.data?.group?.derivativeAssetTypeGroupBucket[i]?.assetTypeGroup?.name
                                                } as AssetTypeGroup
                                            };
                                            break;
                                        }
                                    }
                                }
                            }

                        setSearchConfig({...cc});
                    }
                }
            )
        }
    }, [dataContext.derivativeTypeInput])

    useEffect(() => {
        if (!getSearchConfig().assetTypeGroup) {
            if (!qAssetTypeGroup.loading) {
                if (qAssetTypeGroup.data?.group?.derivativeAssetTypeGroupBucket && qAssetTypeGroup.data?.group?.derivativeAssetTypeGroupBucket.length > 0) {
                    const bucket = [...qAssetTypeGroup.data?.group?.derivativeAssetTypeGroupBucket || []];
                    bucket.sort(
                        (b1, b2) => {
                            return b1.count > b2.count ? -1 : (b2.count > b1.count ? 1 : 0) 
                        }
                    )
                    for (let i = 0; i < bucket.length; i++) {
                        if (bucket[i].count > 0) {
                            const sc = {
                                ...getSearchConfig(),
                                assetTypeGroup: {
                                    id: bucket[i]?.assetTypeGroup?.id,
                                    name: bucket[i]?.assetTypeGroup?.name
                                } as AssetTypeGroup
                            };

                            setSearchConfig(sc);
                            break;
                        }
                    }
                }
            }
        }
    }, [qAssetTypeGroup.data])


    const queryUnderlyingData = useQuery<Query>(loader('./search/getMainInstrument.graphql'),
        {variables: {id: queryUnderlying}, skip: !queryUnderlying})


    useEffect(() => {
        if (!queryUnderlyingData.loading) {
            if (queryUnderlyingData.data) {
                getSearchConfig().underlying = queryUnderlyingData.data.group?.main;
                setQueryUnderlying(null);
                setSearchConfig(config);
            }
        }
    }, [queryUnderlyingData.data]);


    useEffect(() => {
        const searchConfig = getSearchConfig();
        if(searchConfig.underlying && activeConfig === 0) {
            if(lastLoadedUnderlyingId !== searchConfig.underlying?.group?.id) {
                setSearchConfig({...searchConfig, assetClass: null, assetGroup: null, assetTypeGroup: null});
                clearSearchFilter();
                setLastLoadedUnderlyingId(searchConfig.underlying.groupId);
            }
        }
    }, [getSearchConfig().underlying]);


    useEffect(() => {
        if(props.location.search !== '') return;


        const searchConfig = getSearchConfig();
        const searchFilter = getSearchFilter();

        if(searchConfig.underlying && searchConfig.assetClass?.id === 17) {
            if(!searchFilter.sort) {
                setSearchFilter({...emptyDerivativeFilter(), leverage: {from: 5, to: 10}, sort: {"field": "GEARING", "descending": true}})
            }
        }
        else if(searchConfig.underlying && searchConfig.assetClass?.id === 21 && searchConfig.assetTypeGroup?.id === "WARR_CLASSIC") {
            if(!searchFilter.leverage.from && !searchFilter.leverage.to) {
                setSearchFilter({...emptyDerivativeFilter(), leverage: {from: 5, to: 10}})
            }
        }
        else if(searchConfig.underlying && searchConfig.assetClass?.id === 21 && searchConfig.assetTypeGroup?.id === "WARR_DISCOUNT") {
            if(!searchFilter.sort) {
                setSearchFilter({...emptyDerivativeFilter(), sort: { "field": "CAP", "descending": true }})
            }
        }
        else if(searchConfig.underlying && searchConfig.assetClass?.id === 27) {
            if(!searchFilter.sort) {
                setSearchFilter({...emptyDerivativeFilter(), swRendite: "5%-10%", sort: { "field": "SIDEWAYS_RETURN_ANNUAL", "descending": true }})
            }
        }
        else if(searchConfig.underlying && searchConfig.assetClass?.id === 28 && searchConfig.assetTypeGroup?.id !== "CERT_BONUS_OTHER") {
            if(!searchFilter.sort) {
                setSearchFilter({...emptyDerivativeFilter(), bonusRendite: "> 5.0%", sort: { "field": "BONUS_RETURN_ANNUAL", "descending": false }})
            }
        }
        else if(searchConfig.underlying && searchConfig.assetClass?.id === 28 && searchConfig.assetTypeGroup?.id === "CERT_BONUS_OTHER") {
            if(!searchFilter.sort) {
                setSearchFilter({...emptyDerivativeFilter(), sort: { "field": "PERFORMANCE_MONTH1", "descending": false }})
            }
        }
        else if(searchConfig.underlying && searchConfig.assetClass?.id === 29) {
            if(!searchFilter.sort) {
                setSearchFilter({...emptyDerivativeFilter(), discount: ">= 5.0%", sort: { "field": "DISCOUNT_ABSOLUTE", "descending": false }})
            }
        }
        else if(searchConfig.underlying && searchConfig.assetClass?.id === 30) {
            if(!searchFilter.sort) {
                setSearchFilter({...emptyDerivativeFilter(), sort: { "field": "PERFORMANCE_MONTH1", "descending": true }})
            }
        }
        if(searchConfig.underlying && searchConfig.assetClass?.id === 31) {
            if(!searchFilter.sort) {
                setSearchFilter({...emptyDerivativeFilter(), leverage: {from: 5, to: 10}, sort: {"field": "GEARING", "descending": true}})
            }
        }
        else if(searchConfig.underlying && searchConfig.assetClass?.id === 32) {
            if(!searchFilter.sort) {
                setSearchFilter({...emptyDerivativeFilter(), sort: { "field": "PERFORMANCE_MONTH1", "descending": true }})
            }
        }
        else if(searchConfig.underlying && searchConfig.assetClass?.id === 33) {
            if(!searchFilter.sort) {
                setSearchFilter({...emptyDerivativeFilter(), sort: { "field": "PERFORMANCE_MONTH1", "descending": true }})
            }
        }
        else if(searchConfig.underlying && searchConfig.assetClass?.id === 34) {
            if(!searchFilter.sort) {
                setSearchFilter({...emptyDerivativeFilter(), sort: { "field": "PERFORMANCE_MONTH1", "descending": true }})
            }
        }


    }, [getSearchConfig().assetTypeGroup]);


    if (qDerivativeTypes.loading) return null;


    console.log('Config : ', getSearchConfig());
    console.log('Filter : ', getSearchFilter());
    console.log('Data : ', dataContext);


    return (<>
        <Helmet>
            <title>finanztreff.de - Derivatesuche | Zertifikate | Optionsscheine | Knock-Outs</title>
            <meta name="description"
                  content="Finden Sie aktuelle Kurse ✔ und alle Informationen zu Zertifikaten, Optionsscheinen, Knock-Outs, Anlageprodukten auf finanztreff.de!"/>
            <meta name="keywords"
                  content="Optionschein Suche, Knock Out Suche, Zertifikate Suche, Optionsscheine finden, KnockOut finden, Zertfikate finden, Optionsscheinfinder, Zertifikatefinder, KnockOut-Finder"/>
            <script type="text/javascript">{`var Ads_BA_DATA = ` + JSON.stringify(generateTargetingObject(guessTargetingZone(), generateRoSvariable(guessTargetingZone()), generateLoginVariable(keycloak.authenticated),null,null,null, localStorage.getItem('pVariable') ? localStorage.getItem('pVariable') : null, localStorage.getItem('mfVariable') ? localStorage.getItem('mfVariable') : null)) + `;`}</script>
            <script type="text/javascript" id="refresh-script">Ads_BA_refresh();</script>
        </Helmet>

        <ActiveConfigContext.Provider value={{activeConfig, setActiveConfig}}>
            <ConfigContext.Provider value={{getSearchConfig, setSearchConfig}}>
                <FilterContext.Provider value={{getSearchFilter, setSearchFilter}}>
                    <DataContext.Provider value={dataContext}>

                        <DerivativeTopSearch/>

                        {
                            activeConfig === 0 &&
                            <>
                                {
                                    !config.assetClass && !config.underlying &&
                                    <>
                                        <DerivativeTradingIdeas
                                            heading={"Die größten börsennotierten Unternehmen der Welt"}
                                            assetGroup={AssetGroup.Cert}
                                            count={177}
                                            description={"WASHINGTON (Dow Jones)--Die Zahl der Erstanträge auf Leistungen aus der US-Arbeitslosenversicherung hat in der Woche zum 7. März abgenommen."}
                                        />

                                        {tradedLoading ?
                                            <div className="text-center py-2"><Spinner animation="border"/></div> :
                                            <UnderlyingTags heading="Meistgesuchte Basiswerte"
                                                            data={tradedData?.list?.content}/>

                                        }
                                        {searchedLoading ?
                                            <div className="text-center py-2"><Spinner animation="border"/></div> :
                                            <UnderlyingTags heading="Meistgehandelte Basiswerte"
                                                            data={searchedData?.list?.content}/>
                                        }
                                        {topsAndFlopsLoading ?
                                            <div className="text-center py-2"><Spinner animation="border"/></div> :
                                            <>
                                                {topsAndFlopsData?.list?.content &&
                                                <Container className="pt-5 mt-n3">
                                                    <h3 className="roboto-heading ml-n2 ml-xl-0"
                                                        style={{fontSize: '18px'}}>Top & Flop
                                                        Dax</h3>
                                                    <div className="d-flex flex-wrap ml-n3 ml-xl-n2">
                                                        {(topsAndFlopsData?.list?.content[0].group.topFlop || []).map((current: InstrumentTopFlop, index: number) =>
                                                            <UnderlyingTagNames
                                                                key={index}
                                                                assetName={current.instrument.group.assetGroup || undefined}
                                                                name={current.instrument.group.name}
                                                                change={current.snapQuote?.quote?.percentChange || 0}
                                                                onTagClick={() => {
                                                                    setConfig({
                                                                        ...config,
                                                                        underlying: current.instrument
                                                                    } as DerivativeSearchConfig)
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </Container>
                                                }
                                            </>
                                        }
                                    </>
                                }

                                {
                                    !config.assetClass && config.underlying &&
                                    <div className={"pt-5 mt-n3"}>
                                        {
                                            dataContext.derivativeTypeInput.classification.map(
                                                (d: AssetClass) =>
                                                    <DerivativeUnderlyingTagComponent
                                                        key={d.id}
                                                        assetClass={d}
                                                        heading={d.name + ` auf ${config.underlying?.name || 'productName'}`}/>
                                            )
                                        }

                                    </div>
                                }

                                {
                                    config.underlying &&
                                    config.assetClass &&
                                    (dataContext.derivativeTypeInput?.classification?.length > 0) &&
                                    <>
                                        <div className={"pt-5 mt-n3"}>
                                            {
                                                config.assetGroup === AssetGroup.Cert ?
                                                    <DerivativeSearchTags
                                                        heading={`${config.assetClass?.name} Zertifikate auf ${config.underlying?.name || 'productName'}`}/>
                                                    :
                                                    <DerivativeSearchTags
                                                        heading={`${config.assetClass?.name} auf ${config.underlying?.name || 'productName'}`}/>
                                            }
                                        </div>

                                        <DerivativeResultsSection />
                                    </>
                                }

                            </>
                        }

                        {
                            activeConfig === 1 &&
                            <>

                                {
                                    !reverseConfig.assetClass &&
                                    <>
                                        {
                                            dataContext.derivativeTypeInput.classification.map(
                                                (d: AssetClass) =>
                                                    <>
                                                        <div className={"pt-5 mt-n3"}>
                                                            <DerivativeAssetClassTagComponent assetClass={d}/>
                                                        </div>
                                                        {
                                                            tradedLoading ?
                                                                <Spinner animation={"border"}/>
                                                                :
                                                                <div className={"pt-5 mt-n3"}>
                                                                    <DerivativeAssetClassTagComponent
                                                                        assetClass={d}
                                                                        tradedData={tradedData}
                                                                        tradedType={"meistgehandelte"}/>
                                                                </div>
                                                        }

                                                        {
                                                            searchedLoading ?
                                                                <Spinner animation={"border"}/>
                                                                :
                                                                <div className={"pt-5 mt-n3"}>
                                                                    <DerivativeAssetClassTagComponent
                                                                        assetClass={d}
                                                                        tradedData={searchedData}
                                                                        tradedType={"meistgesuchte"}/>
                                                                </div>
                                                        }

                                                    </>
                                            )
                                        }
                                    </>
                                }

                                {
                                    reverseConfig.assetClass && !reverseConfig.underlying &&
                                    <>
                                        <DerivativeTradingIdeas
                                            heading={"Die größten börsennotierten Unternehmen der Welt"}
                                            assetGroup={AssetGroup.Cert}
                                            count={177}
                                            description={"WASHINGTON (Dow Jones)--Die Zahl der Erstanträge auf Leistungen aus der US-Arbeitslosenversicherung hat in der Woche zum 7. März abgenommen."}
                                        />

                                        {tradedLoading ?
                                            <div className="text-center py-2"><Spinner animation="border"/></div> :
                                            <UnderlyingTags heading="Meistgesuchte Basiswerte"
                                                            data={tradedData?.list?.content}/>
                                        }
                                        {searchedLoading ?
                                            <div className="text-center py-2"><Spinner animation="border"/></div> :
                                            <UnderlyingTags heading="Meistgehandelte Basiswerte"
                                                            data={searchedData?.list?.content}/>
                                        }
                                        {topsAndFlopsLoading ?
                                            <div className="text-center py-2"><Spinner animation="border"/></div> :
                                            <>
                                                {topsAndFlopsData?.list?.content &&
                                                <Container className="pt-5 mt-n3">
                                                    <h3 className="roboto-heading ml-n2 ml-xl-0"
                                                        style={{fontSize: '18px'}}>Top & Flop
                                                        Dax</h3>
                                                    <div className="d-flex flex-wrap ml-n3 ml-xl-n2">
                                                        {(topsAndFlopsData?.list?.content[0].group.topFlop || []).map((current: InstrumentTopFlop, index: number) =>
                                                            <UnderlyingTagNames
                                                                key={index}
                                                                assetName={current.instrument.group.assetGroup || undefined}
                                                                name={current.instrument.group.name}
                                                                change={current.snapQuote?.quote?.percentChange || 0}
                                                                onTagClick={() => {
                                                                    setReverseConfig({
                                                                        ...reverseConfig,
                                                                        underlying: current.instrument
                                                                    } as DerivativeSearchConfig)
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </Container>
                                                }
                                            </>
                                        }
                                    </>

                                }

                                {
                                    reverseConfig.underlying &&
                                    reverseConfig.assetClass &&
                                    (dataContext.derivativeTypeInput?.classification?.length > 0) &&
                                    <>
                                        <div className={"pt-5 mt-n3"}>
                                            {
                                                reverseConfig.assetGroup === AssetGroup.Cert ?
                                                    <DerivativeSearchTags
                                                        heading={`${reverseConfig.assetClass?.name} Zertifikate auf ${reverseConfig.underlying?.name || 'productName'}`}/>
                                                    :
                                                    <DerivativeSearchTags
                                                        heading={`${reverseConfig.assetClass?.name} Zertifikate auf ${reverseConfig.underlying?.name || 'productName'}`}/>
                                            }
                                        </div>
                                        <FilterContext.Provider value={{getSearchFilter, setSearchFilter}}>
                                            <DerivativeResultsSection/>
                                        </FilterContext.Provider>
                                    </>
                                }
                            </>
                        }

                    </DataContext.Provider>
                </FilterContext.Provider>
            </ConfigContext.Provider>
        </ActiveConfigContext.Provider>

    </>);
}

import React, {useContext, useEffect, useState} from 'react'
import FilterTag from "./FilterTag";
import {ActiveConfigContent, ActiveConfigContext, ConfigContext, DataContext, FilterContext} from "../DerivativeSearch";
import {DerivativeFilter, DerivativeSearchConfig, emptyDerivativeFilter} from "./types/DerivativeSearchTypes";
import {AssetClass, DerivativeAssetTypeGroupBucket, Issuer, Query} from "../../../generated/graphql";
import {useQuery} from "@apollo/client";
import {gql, loader} from "graphql.macro";


export interface DerivativeTagsProps {
    assetClass: AssetClass;
}

export const DerivativeTags = ({assetClass}: DerivativeTagsProps) => {
    const {getSearchConfig, setSearchConfig} = useContext(ConfigContext);
    const {getSearchFilter, setSearchFilter} = useContext(FilterContext);

    const config = getSearchConfig ? getSearchConfig() : null;
    const filter = getSearchFilter ? getSearchFilter() : null;

    const [newFilter, setNewFilter] = useState<DerivativeFilter | null>(null);

    const qAssetTypeGroup = useQuery<Query>(loader('./getDerivativeAssetTypeGroup.graphql'),
        {
            skip: !newFilter,
            variables: {
                underlyingInstrumentGroupId: getSearchConfig().underlying?.group.id,
                assetClassId: assetClass.id
            }
        });

    useEffect(() => {
        if(qAssetTypeGroup.data && newFilter) {
            const data = [...(qAssetTypeGroup.data.group?.derivativeAssetTypeGroupBucket || [])];

            const groups = data.sort(
                (c1: DerivativeAssetTypeGroupBucket, c2: DerivativeAssetTypeGroupBucket) =>
                    c1.count > c2.count ? -1 : (c1.count < c2.count ? 1 : 0)
            );

            // @ts-ignore
            const assetType = (groups && groups.length > 0) ? groups[0].assetTypeGroup : null;

            setSearchConfig({...config, assetClass: assetClass, assetTypeGroup: assetType} as DerivativeSearchConfig);
            setSearchFilter({ ...newFilter as DerivativeFilter}, assetType?.id || null);
        }
    }, [qAssetTypeGroup.data]);


    const setHebelFilter = function (callPut: 'CALL' | 'PUT', from: number | null, to: number | null) {
        setNewFilter({
            ...filter,
            callPut: callPut,
            leverage: {from: from, to: to},
        } as DerivativeFilter);
    }

    const setOsWertFilter = function (callPut: 'CALL' | 'PUT', from: number | null, to: number | null) {
        setNewFilter({
            ...filter,
            callPut: callPut,
            osWert: {from: from, to: to}
        } as DerivativeFilter);
    }

    const setBasisPriseFilter = function (callPut: 'CALL' | 'PUT', from: number | null, to: number | null) {
        setNewFilter({
            ...filter,
            callPut: callPut,
            basisprise: {basis: "absolut", period: {from: from, to: to}}
        } as DerivativeFilter);
    }

    const setStopLossFilter = function (callPut: 'CALL' | 'PUT', from: number | null, to: number | null) {
        setNewFilter({
            ...filter,
            callPut: callPut,
            stopLoss: {basis: "absolut", period: {from: from, to: to}}
        } as DerivativeFilter);
    }

    const setRunningTimeFilter = function (callPut: 'CALL' | 'PUT', from: number | null, to: number | null) {
        setNewFilter({
            ...filter,
            callPut: callPut,
            runningTime: {from: from, to: to}
        } as DerivativeFilter);
    }

    const setIssuerFilter = function (callPut: 'CALL' | 'PUT', issuer: number) {
        setNewFilter({
            ...filter,
            callPut: callPut,
            issuers: [{id: issuer} as Issuer]
        } as DerivativeFilter);
    }

    return (
        <div className="derivative-tags-wrapper">
            <div className="d-flex flex-wrap derivate-tags mb-4">

                {
                    assetClass.name === 'Optionsscheine' &&
                    <>
                        <FilterTag tagName="Call mit Hebel 5 - 10"
                                   onClick={() => setHebelFilter('CALL', 5, 10)}/>
                        <FilterTag tagName="Call mit Hebel 10 - 15"
                                   onClick={() => setHebelFilter('CALL', 10, 15)}/>
                        <FilterTag tagName="Call mit Hebel 15 - 20"
                                   onClick={() => setHebelFilter('CALL', 15, 20)}/>
                        <FilterTag tagName="Call mit Hebel > 20"
                                   onClick={() => setHebelFilter('CALL', 20, null)}/>
                        <FilterTag tagName="Put mit Hebel 5 - 10"
                                   onClick={() => setHebelFilter('PUT', 5, 10)}/>
                        <FilterTag tagName="Put mit Hebel 10 - 15"
                                   onClick={() => setHebelFilter('PUT', 10, 15)}/>
                        <FilterTag tagName="Put mit Hebel 15 - 20"
                                   onClick={() => setHebelFilter('PUT', 15, 20)}/>
                        <FilterTag tagName="Put mit Hebel > 20"
                                   onClick={() => setHebelFilter('PUT', 20, null)}/>

                        <FilterTag tagName="Call im Geld" onClick={() => setOsWertFilter('CALL', 1, 5)}/>
                        <FilterTag tagName="Call am Geld" onClick={() => setOsWertFilter('CALL', -1, 1)}/>
                        <FilterTag tagName="Put im Geld" onClick={() => setOsWertFilter('PUT', 1, 5)}/>
                        <FilterTag tagName="Put am Geld" onClick={() => setOsWertFilter('PUT', -1, 1)}/>

                        <FilterTag tagName="Call kurzfristig (1 bis 3 M)"
                                   onClick={() => setRunningTimeFilter('CALL', 1, 3)}/>
                        <FilterTag tagName="Call mittelfristig (6 bis 12M)"
                                   onClick={() => setRunningTimeFilter('CALL', 6, 12)}/>
                        <FilterTag tagName="Call langfristig (> 12M)"
                                   onClick={() => setRunningTimeFilter('CALL', 12, null)}/>
                        <FilterTag tagName="Put kurzfristig (1 bis 3 M)"
                                   onClick={() => setRunningTimeFilter('PUT', 1, 3)}/>
                        <FilterTag tagName="Put mittelfristig (6 bis 12M)"
                                   onClick={() => setRunningTimeFilter('PUT', 6, 12)}/>
                        <FilterTag tagName="Put langfristig (> 12M)"
                                   onClick={() => setRunningTimeFilter('PUT', 21, null)}/>

                        <FilterTag tagName="Call von MS" onClick={() => setIssuerFilter('CALL', 22)}/>
                        <FilterTag tagName="Call von JP" onClick={() => setIssuerFilter('CALL', 23)}/>
                        <FilterTag tagName="Call von HSBC" onClick={() => setIssuerFilter('CALL', 52)}/>
                        <FilterTag tagName="Call von UBS" onClick={() => setIssuerFilter('CALL', 4)}/>
                        <FilterTag tagName="Call von SG" onClick={() => setIssuerFilter('CALL', 26)}/>
                        <FilterTag tagName="Put von MS" onClick={() => setIssuerFilter('PUT', 22)}/>
                        <FilterTag tagName="Put von JP" onClick={() => setIssuerFilter('PUT', 23)}/>
                        <FilterTag tagName="Put von HSBC" onClick={() => setIssuerFilter('PUT', 52)}/>
                        <FilterTag tagName="Put von UBS" onClick={() => setIssuerFilter('PUT', 4)}/>
                        <FilterTag tagName="Put von SG" onClick={() => setIssuerFilter('PUT', 26)}/>
                    </>
                }
                {
                    assetClass.name === 'Knock-Out' &&
                    <>
                        <FilterTag tagName="Long mit Hebel 5-10"
                                   onClick={() => setHebelFilter('CALL', 5, 10)}/>
                        <FilterTag tagName="Long mit Hebel 10 - 15"
                                   onClick={() => setHebelFilter('CALL', 10, 15)}/>
                        <FilterTag tagName="Long mit Hebel 15 - 20"
                                   onClick={() => setHebelFilter('CALL', 15, 20)}/>
                        <FilterTag tagName="Long mit Hebel > 20"
                                   onClick={() => setHebelFilter('CALL', 20, null)}/>
                        <FilterTag tagName="Short mit Hebel 5 - 10"
                                   onClick={() => setHebelFilter('PUT', 5, 10)}/>
                        <FilterTag tagName="Short mit Hebel 10 - 15"
                                   onClick={() => setHebelFilter('PUT', 10, 15)}/>
                        <FilterTag tagName="Short mit Hebel 15 - 20"
                                   onClick={() => setHebelFilter('PUT', 15, 20)}/>
                        <FilterTag tagName="Short mit Hebel > 20"
                                   onClick={() => setHebelFilter('PUT', 20, null)}/>

                        <FilterTag tagName="Long Strike < 5"
                                   onClick={() => setBasisPriseFilter('CALL', null, 5)}/>
                        <FilterTag tagName="Long Strike 5-10"
                                   onClick={() => setBasisPriseFilter('CALL', 5, 10)}/>
                        <FilterTag tagName="Long Strike 10 - 20"
                                   onClick={() => setBasisPriseFilter('CALL', 10, 20)}/>
                        <FilterTag tagName="Long Strike > 20"
                                   onClick={() => setBasisPriseFilter('CALL', 20, null)}/>
                        <FilterTag tagName="Short Strike < 5"
                                   onClick={() => setBasisPriseFilter('PUT', null, 5)}/>
                        <FilterTag tagName="Short Strike 5 - 10"
                                   onClick={() => setBasisPriseFilter('PUT', 5, 10)}/>
                        <FilterTag tagName="Short Strike 10 - 20"
                                   onClick={() => setBasisPriseFilter('PUT', 10, 20)}/>
                        <FilterTag tagName="Short Strike > 20"
                                   onClick={() => setBasisPriseFilter('PUT', 20, null)}/>

                        <FilterTag tagName="Long StopLoss < 5"
                                   onClick={() => setStopLossFilter('CALL', null, 5)}/>
                        <FilterTag tagName="Long StopLoss 5-10"
                                   onClick={() => setStopLossFilter('CALL', 5, 10)}/>
                        <FilterTag tagName="Long StopLoss 10 - 20"
                                   onClick={() => setStopLossFilter('CALL', 10, 20)}/>
                        <FilterTag tagName="Long StopLoss > 20"
                                   onClick={() => setStopLossFilter('CALL', 20, null)}/>
                        <FilterTag tagName="Short StopLoss < 5"
                                   onClick={() => setStopLossFilter('PUT', null, 5)}/>
                        <FilterTag tagName="Short StopLoss 5 - 10"
                                   onClick={() => setStopLossFilter('PUT', 5, 10)}/>
                        <FilterTag tagName="Short StopLoss 10 - 20"
                                   onClick={() => setStopLossFilter('PUT', 10, 20)}/>
                        <FilterTag tagName="Short StopLoss > 20"
                                   onClick={() => setStopLossFilter('PUT', 20, null)}/>

                    </>
                }


                {/*<FilterTag tagName="Put mit Fälligkeit bis 12.12.2020"/>*/}
                {/*<FilterTag tagName="Call mit Hebel > 10"/>*/}
                {/*<FilterTag tagName="Call mit Hebel 10 - 20"/>*/}
                {/*<FilterTag tagName="Put mit Fälligkeit bis 12.12.2020"/>*/}
                {/*<FilterTag tagName="Call mit Hebel > 10"/>*/}
                {/*<FilterTag tagName="Call mit Hebel 10 - 20"/>*/}
                {/*<FilterTag tagName="Put mit Fälligkeit bis 12.12.2020"/>*/}
                {/*<FilterTag tagName="Call mit Hebel > 10"/>*/}
                {/*<FilterTag tagName="Call mit Hebel 10 - 20"/>*/}
                {/*<FilterTag tagName="Put mit Fälligkeit bis 12.12.2020"/>*/}
                {/*<FilterTag tagName="Call mit Hebel > 10"/>*/}
                {/*<FilterTag tagName="Call mit Hebel 10 - 20"/>*/}
                {/*<FilterTag tagName="Put mit Fälligkeit bis 12.12.2020"/>*/}
                {/*<FilterTag tagName="Call mit Hebel > 10"/>*/}
                {/*<FilterTag tagName="Call mit Hebel 10 - 20"/>*/}
                {/*<FilterTag tagName="Put mit Fälligkeit bis 12.12.2020"/>*/}
            </div>
        </div>
    );
}

export default DerivativeTags

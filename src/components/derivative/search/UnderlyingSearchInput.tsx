import {Button, Dropdown, Modal} from "react-bootstrap";
import {UnderlyingSearch} from "../underlying/filter/UnderlyingSearch";
import SvgImage from "../../common/image/SvgImage";
import React, {useContext, useEffect, useState} from "react";
import {useBootstrapBreakpoint} from "../../../hooks/useBootstrapBreakpoint";
import classNames from "classnames";
import {AssetGroup, Instrument, Query} from "../../../generated/graphql";
import {InstrumentInfo} from "./InstrumentInfo";
import {formatAssetGroup} from "../../../utils";
import {ConfigContext, DataContext} from "../DerivativeSearch";
import './inputStyle.scss'
import {useQuery} from "@apollo/client";
import {loader} from "graphql.macro";
import {trigInfonline} from "../../common/InfonlineService";

interface UnderlyingSearchInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {

}

// export function UnderlyingSearchInput({className, onSelected, disabled, underlying, productName,
//                                           assetGroupVal, setShowSuggestedProducts,
//                                       onInstrumentLoaded}: UnderlyingSearchInputProps) {
export function UnderlyingSearchInput({className, disabled}: UnderlyingSearchInputProps) {
    const {getSearchConfig, setSearchConfig} = useContext(ConfigContext);
    const config = getSearchConfig();

    const [showSearch, setShowSearch] = useState(false);
    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });

    const [asset, setAsses] = useState<Instrument | null>(null);

    const qAssetTypeGroup = useQuery<Query>(loader('./getDerivativeAssetTypeGroup.graphql'),
        {
            skip: !asset,
            variables: {
                assetClassId: config.assetClass?.id,
                underlyingInstrumentGroupId: asset?.group?.id
            }
        });

    useEffect(() => {
        if(qAssetTypeGroup.data) {
            const groups = [...qAssetTypeGroup.data.group?.derivativeAssetTypeGroupBucket || []].sort(
                (c1, c2) => {
                    return c1.count > c2.count ? -1 : (c1.count < c2.count) ? 1 : 0;
                }
            ) || [];

            config.assetTypeGroup = groups.length > 0 ? groups[0].assetTypeGroup : null;
            config.underlying = asset;
            setSearchConfig(config);
            setAsses(null);
        }
    }, [qAssetTypeGroup.data]);


    const onAssetSelected = (asset: Instrument) => {
        trigInfonline('derivatives', 'search_basiswert_change')
        setShowSearch(false);
        if(!config.assetClass?.id) {
            config.assetTypeGroup = null;
            config.underlying = asset;
            setSearchConfig(config);
        } else {
            setAsses(asset);
        }
    }
    
    return (
        <>
            <Dropdown className={classNames("single-search search2", className)} show={isDesktop && showSearch} onClick={()=>trigInfonline('derivatives', 'underlying_tags')}
                      onToggle={() => setShowSearch(!showSearch)} id="derivative-underlying-input">
                <Dropdown.Toggle disabled={disabled} variant="light" className="drop input-button">
                    <div
                        className={classNames("drop-fl overflow-ellipsis text-left d-flex align-items-center", isDesktop ? 'w-50' : '')}>
                        {
                            config.underlying && config.underlying?.group?.assetGroup &&
                            <span
                                className={classNames('text-white px-2 text-uppercase fix-font-size-assetgrp', 'bg-' + config.underlying.group.assetGroup)}>
                                {formatAssetGroup(config.underlying.group.assetGroup)}
                            </span>
                        }
                        <span>
                            {
                                config.underlying ?
                                    <a style={{fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 20}}
                                       className="ml-2" href="#">
                                        {config.underlying?.name}</a>
                                    :
                                    <span style={{fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 20}}
                                          className="ml-2" >Basiswert</span>
                            }
                        </span>
                    </div>
                    <div className="d-flex">
                        {
                            config.underlying && isDesktop && !showSearch &&
                            <InstrumentInfo instrument={config.underlying}
                                            onInstrumentLoaded={() => {
                                            }}
                                            className="flex-column justify-content-center"/>
                        }
                        <img alt="Dropdown arrow down"
                             src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_dark.svg"}
                        />
                    </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100 p-3 dropdown-menu-right dropdown-search-filter d-xl-block d-lg-none">
                    <UnderlyingSearch onAssetSelected={onAssetSelected}/>
                </Dropdown.Menu>
                <Modal className="bottom d-xl-none pl-0 modal-dialog-sky-placement" backdrop="static" show={!isDesktop && showSearch}>
                    <Modal.Dialog className="all-white-modal filters-modal">
                        <div className="modal-content">
                            <Modal.Header>
                                <h5 className="modal-title">Basiswert auswählen</h5>
                                <Button className="close text-blue" variant="white"
                                        onClick={() => setShowSearch(false)}>
                                    <span>schließen</span>
                                    <SvgImage icon="icon_close_blue.svg"
                                              spanClass="close-modal-butt" width={"27"}/>
                                </Button>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="filter-section-modal">
                                    <UnderlyingSearch onAssetSelected={onAssetSelected}/>
                                </div>
                            </Modal.Body>
                        </div>
                    </Modal.Dialog>
                </Modal>
            </Dropdown>
            {config.underlying && !isDesktop && !showSearch &&
            <InstrumentInfo instrument={config.underlying}
                            onInstrumentLoaded={() => {
                            }}
                            className="text-white font-size-13px justify-content-start ml-3 mt-n1"/>}
        </>
    )
}

import React, {useState} from "react";
import AssetRowTitle from "../common/AssetRowTitle";
import AssetMainInfo from "./AssetMainInfo";
import AssetRowHeaderInfo from "../common/AssetRowHeaderInfo";
import {AssetOtherInfo, AssetOtherInfoSm, AssetOtherInfoXl} from "./AssetOtherInfo";
import {useBootstrapBreakpoint} from "../../../hooks/useBootstrapBreakpoint";
import {formatAssetGroup} from "../../../utils";
import {AssetGroup, InstrumentGroup} from "../../../generated/graphql";

export interface AssetMainCardProps {
    groupId: number;
    instrument: any;
    assetClassId?: number;
    assetClassName?: string;
    assetClassGroup?: AssetGroup;
    title: string;
    otherTitle: string;
    showHeaderInfo?: boolean;
    bottomInfo?: string;
    showTime?: boolean;
    type1?: string;
    type2?: string;
}

export default function AssetMainCard(props: AssetMainCardProps) {

    const cardHeight = useBootstrapBreakpoint({
        default: "257px",
        md: "383px",
        xl: "257px",
    });

    const [dataLoaded, setDataLoaded] = useState<any>(null);

    return (
        <div className="col">
            <div className="derivate-big-card" style={{height: cardHeight, minHeight: cardHeight}}>
                <div className="top" style={{height: "37px"}}>
                    <AssetRowTitle title={props.title} assetGroup={formatAssetGroup(props.instrument?.group?.assetGroup)} instrument={props.instrument}/>
                    {
                        props.showHeaderInfo &&
                        <AssetRowHeaderInfo
                            exchCode={props.instrument?.exchange?.code || ''}
                            delay={props.instrument?.exchange?.delay || 0}
                            percentChange={props.instrument?.snapQuote.quote?.percentChange || 0}
                            currencyCode={props.instrument?.currency?.displayCode || ''}
                            quoteValue={props.instrument?.snapQuote?.quote?.value}
                            when={props.instrument?.snapQuote?.quote?.when}
                        />
                    }
                </div>
                <div className="data-wrapper">
                    <AssetMainInfo bottomInfo={props.bottomInfo} showTime={props.showTime} assetClassId={props.assetClassId}
                                   type1={props.type1} type2={props.type2} homepage={true} groupId={props.groupId}
                                   onDataLoaded={(data: any) => setDataLoaded(data)}/>
                    {
                        dataLoaded &&
                        <AssetOtherInfo className="d-none d-xl-block" title={props.otherTitle}
                                        type1={props.type1 || 'call'} type2={props.type2 || 'put'} homepage={true}
                                        assetClassId={props.assetClassId} assetClassName={props.assetClassName}
                                        assetClassGroup={props.assetClassGroup}
                                        underlyingInstrumentGroupId={props.groupId}
                                        data={dataLoaded}
                        />
                    }
                </div>
            </div>
        </div>
    );
}

import React, {useState} from 'react'
import DerivativeTopSearch from "./search/DerivativeTopSearch";
import UnderlyingTags from './search/underlying/UnderlyingTags';
import {AssetGroup, AssetType, Instrument} from "../../generated/graphql";
import DerivativeTradingIdeas from "./derivativeUnderlying/DerivativeTradingIdeas";

export const DerivativeBasiswert = () => {
    const [assetClass, setAssetClass] = useState<number>();
    const [disableTypeFilter, setDisableTypeFilter] = useState<Boolean>(true);
    const [underlying, setUnderlying] = useState<Instrument>();
    const [assetGroup, setAssetGroup] = useState<AssetGroup | null | undefined>();
    const [assetTypes, setAssetTypes] = useState<AssetType[]>(() => []);
    const [disableUnderlyingFilter, setDisableUnderlyingFilter] = useState<Boolean>(true)
    const [artType, setArtType] = useState<any>();
    const [productName, setProductName] = useState<string>('');
    const [instrumentProduct, setInstrumentProduct] = useState<Instrument | undefined | any>();

    const onUnderlyingSelected = (selectedItem: Instrument) => {
        if (selectedItem) {
            setDisableTypeFilter(false)
        } else if (!selectedItem) {
            setDisableTypeFilter(true);
        }
        setUnderlying(selectedItem);
    }

    const onTypeSelected = (selectedItem: any) => {
        if (selectedItem) {
            setDisableUnderlyingFilter(false)
        } else {
            setDisableUnderlyingFilter(true)
        }
        setArtType(selectedItem)
    }

    const onClearUnderlying = (value: boolean) => {
        if (value) {
            setUnderlying(undefined);
        }
    }

    const handleAssetTypeLoad = (assetTypes: AssetType[]) => {
        if(assetTypes && assetTypes[0]) {
            setAssetTypes(assetTypes);
        }
    }

    const handleUnderlyingTagClick = (instrument: Instrument | undefined | any) => {
        setDisableTypeFilter(false)
        setProductName('Biontech');
        setInstrumentProduct(instrument)
    }

    return (
        <div>
            {/* <DerivativeTopSearch onAssetGroupChange={setAssetGroup} onUnderlyingSelected={onUnderlyingSelected}
                                 disableTypeFilter={disableTypeFilter}
                                 onAssetClassChange={setAssetClass} onAssetTypeSelection={handleAssetTypeLoad}
                                 disableButtonTypeFilter={disableUnderlyingFilter}
                                 selectedInstrument={underlying}
                                 setClearUnderlyingOnAssetGroupChange={onClearUnderlying}
                                 onTypeSelected={onTypeSelected}
                                 productName={productName}
                                 assetGroupVal={assetGroup}
                                 instrumentProduct={instrumentProduct}
                                 setShowSuggestedProducts={() => {}}
                                 setAssetName={() => {}}
             activeIndex={0} setActiveIndex={() => {}} setRevSuggestedFilters={() => {}}/>

            <DerivativeTradingIdeas
                heading={"Die größten börsennotierten Unternehmen der Welt"}
                assetGroup={AssetGroup.Cert}
                count={177}
                description={"WASHINGTON (Dow Jones)--Die Zahl der Erstanträge auf Leistungen aus der US-Arbeitslosenversicherung hat in der Woche zum 7. März abgenommen."}
            />

            <UnderlyingTags setRevSuggestedFilters={() => {}} activeIndex={0} setShowSuggestedProducts={() => {}} setInstrument={handleUnderlyingTagClick} setName={handleUnderlyingTagClick} setAssetGroup={setAssetGroup} heading="Meistgesuchte Basiswerte" />
            <UnderlyingTags setRevSuggestedFilters={() => {}} activeIndex={0}  setShowSuggestedProducts={() => {}} setInstrument={handleUnderlyingTagClick} setName={handleUnderlyingTagClick} setAssetGroup={setAssetGroup} heading="Meistbehandelte Basiswerte"/>
            <UnderlyingTags setRevSuggestedFilters={() => {}} activeIndex={0}  setShowSuggestedProducts={() => {}} setInstrument={handleUnderlyingTagClick} setName={handleUnderlyingTagClick} setAssetGroup={setAssetGroup} heading="Top & Flop Dax "/>
         */}
         </div>
    )
}

export default DerivativeBasiswert

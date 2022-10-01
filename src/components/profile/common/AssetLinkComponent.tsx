import { Link } from "react-router-dom";
import {Instrument} from 'graphql/types';
import { getFinanztreffAssetLink } from 'utils';
import { eventTime, gtag } from "components/Assets/Derivatives/components/Product";

interface AssetLinkSimpleProps {
    title?: string,
    name: string;
    exchangeCode: string| undefined;
    seoTag: string | undefined;
    assetGroup: string | undefined;
    className?: string | undefined,
    size?: number;
    productIsin?: any;
    nameWkn?: any;
}

export function AssetLinkComponentSimple(props: AssetLinkSimpleProps) {
    const size = props.size;
    const initialName = props.title ? props.title : props.name;
    const name: string = size && (size > 2) && (initialName.length > size) ? initialName.substr(0, size - 2) + "..." : initialName;
    if (props.assetGroup && props.seoTag && props.exchangeCode) {
        return (
            <Link title={initialName}
                to={getFinanztreffAssetLink(props.assetGroup, props.seoTag, props.exchangeCode)}
                className={props.className}
            >{name}</Link>
        );
    }
    else if(props.assetGroup && props.seoTag) {
        return (
            <Link title={initialName}
                to={getFinanztreffAssetLink(props.assetGroup, props.seoTag)}
                className={props.className}
                onClick={() => {
                    return gtag('event', 'view_item', {
                        items: [{
                            item_name: props.productIsin,
                            item_brand: props.nameWkn,
                            item_category: 'Monte Carlo Simulation',
                            item_category2: 'Related Products',
                            item_category3: 'Go to Product',
                            item_category5: eventTime(),
                        }]
                    });
                }}
            >{name}</Link>
        );
    }
    return (<span title={initialName} className={props.className || ""} style={{cursor: "default"}}>{name}</span>);
}

interface AssetLinkProps {
    instrument: Instrument | undefined | null;
    title?: string,
    className?: string,
    size?: number;
    productIsin?: any;
    nameWkn?: any;
}

export function AssetLinkComponent({title, className, size, instrument, productIsin, nameWkn}: AssetLinkProps) {
    if (!instrument) {
        return (<></>)
    }
    return AssetLinkComponentSimple({
        title,
        className,
        size,
        productIsin,
        nameWkn,
        name: instrument.name || "",
        exchangeCode: instrument.exchange?.code || undefined,
        seoTag: instrument.group?.seoTag || undefined,
        assetGroup: instrument.group?.assetGroup || undefined,
    });
}

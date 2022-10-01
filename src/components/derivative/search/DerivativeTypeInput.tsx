import {Dropdown, Modal} from "react-bootstrap";
import {ButtonItem} from "./filters/layout/ButtonItem";
import React, {useContext, useEffect, useState} from "react";
import classNames from "classnames";
import {useBootstrapBreakpoint} from "../../../hooks/useBootstrapBreakpoint";
import {ModalHeader} from "./filters/layout/ModalHeader";
import {useQuery} from "@apollo/client";
import {AssetClass, AssetGroup, AssetType, AssetTypeGroup, Instrument, Query} from "../../../generated/graphql";
import {loader} from "graphql.macro";
import {ActiveConfigContext, ConfigContext, DataContext} from "../DerivativeSearch";
import {trigInfonline} from "../../common/InfonlineService";

interface DerivativeTypeInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
}

export function DerivativeTypeInput({disabled, className}: DerivativeTypeInputProps) {
    const {activeConfig, setActiveConfig} = useContext(ActiveConfigContext);
    const {getSearchConfig, setSearchConfig} = useContext(ConfigContext);
    const config = getSearchConfig();
    const data = useContext(DataContext);

    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });

    const [show, setShow] = useState(false);
    const close = () => {
        setShow(false);
    };

    const typeInputFontSize = useBootstrapBreakpoint({
        xl: 21,
        md: 16,
        sm: 16
    })

    const [assetClass, setAssetClass] = useState<AssetClass | null>(null);

    const qAssetTypeGroup = useQuery<Query>(loader('./getDerivativeAssetTypeGroup.graphql'),
        {
            skip: !assetClass,
            variables: {
                underlyingInstrumentGroupId: getSearchConfig().underlying?.group.id,
                assetClassId: assetClass?.id
            }
        });

    useEffect(() => {
        if (qAssetTypeGroup.data) {
            const groups = [...qAssetTypeGroup.data.group?.derivativeAssetTypeGroupBucket || []].sort(
                (c1, c2) => {
                    return c1.count > c2.count ? -1 : (c1.count < c2.count) ? 1 : 0;
                }
            ) || [];

            config.assetClass = assetClass;
            config.assetTypeGroup = groups.length > 0 ? groups[0].assetTypeGroup : null;
            setSearchConfig(config);
            setAssetClass(null);
        }
    }, [qAssetTypeGroup.data])

    const onSelectAssetGroup = (value: AssetClass) => {
        return () => {
            trigInfonline('derivatives', 'search_dropdown')
            setShow(false)

            if (!getSearchConfig().underlying?.group.id) {
                config.assetClass = {...value};
                config.assetGroup = null;
                setSearchConfig(config);
            }
            else {
                setAssetClass(value);
            }
        };
    }

    const hasItems = function (id: number) {
        if (activeConfig === 1) return true;

        if (data.derivativeAssetClasses) {
            for (let i = 0; i < data.derivativeAssetClasses.length; i++) {
                if (data.derivativeAssetClasses[i].assetClass.id == id && data.derivativeAssetClasses[i].count > 0) return true;
            }
        }
        return false;
    }

    const content = (
        <>
            <div>
                <div className="drop-inn2-sug pb-3">
                    <h3 style={{fontSize: '18px'}} className="font-weight-bold">Hebelprodukte</h3>
                    <div className="drop-inn2-fl">
                        {data?.derivativeTypeInput?.classification.map((value: any) => (
                            value.leveraged &&
                            <ButtonItem key={value.id} active={config.assetClass?.name === `${value.name}`}
                                        disabled={!hasItems(value.id)}
                                        onClick={onSelectAssetGroup(value)}
                            >
                                {value.name}
                            </ButtonItem>
                        ))}
                    </div>
                </div>
                <Dropdown.Divider/>
                <div className="drop-inn2-sug pt-3">
                    <h3 style={{fontSize: '18px'}} className="font-weight-bold">Anlageprodukte</h3>
                    <div className="drop-inn2-fl">
                        {data?.derivativeTypeInput?.classification.map((value: any) => (
                            !value.leveraged &&
                            <ButtonItem key={value.id} active={config.assetClass?.name === `${value.name}`}
                                        disabled={!hasItems(value.id)}
                                        onClick={onSelectAssetGroup(value)}
                            >
                                {value.name}
                            </ButtonItem>
                        ))}
                    </div>
                </div>
            </div>

        </>
    )

    return (
        <>
            <Dropdown show={show && isDesktop} className={classNames("single-search search2 w-100", className)}
                      onToggle={() => setShow(!show)} id="derivative-type-input">
                <Dropdown.Toggle variant="light" disabled={disabled} className="drop input-button">
                    <div className="drop-fl overflow-ellipsis">
                        <a className="font-weight-bold roboto-heading" style={{fontSize: 20}}>Derivative-Art
                            und Typ</a>
                        <br/>
                        <span className="float-left">{config.assetClass?.name}</span>
                    </div>
                    <img alt="Dropdown arrow down"
                         src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_dark.svg"}
                    />
                </Dropdown.Toggle>
                <Dropdown.Menu className="p-2 dropdown-menu-content " style={{width: 330}}>
                    {content}
                </Dropdown.Menu>
                <Modal show={show && !isDesktop} className="bottom modal-dialog-sky-placement" onHide={close} contentClassName="bg-white">
                    <ModalHeader title="Derivative-Art & Typ" close={close}/>
                    <div className="mx-auto pb-4" style={{width: 330}}>
                        {content}
                    </div>
                </Modal>
            </Dropdown>
        </>
    );
}
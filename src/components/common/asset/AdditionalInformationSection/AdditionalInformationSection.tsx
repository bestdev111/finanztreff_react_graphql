import { ExchangeOverview, PriceComparison, TimesAndSales } from "../../modals";
import {Instrument, InstrumentGroup} from "../../../../generated/graphql";
import classNames from "classnames";
import { QuoteHistory } from "../../modals/QuoteHistory";
import { trigInfonline, guessInfonlineSection } from "components/common/InfonlineService";
import { getAssetForUrl } from "components/profile/utils";
import { Link, useParams } from "react-router-dom";
import ChartToolModal from "components/common/banner/ChartToolModal";
import {useState} from "react";

export interface AdditionalInformationSectionProps {
    instrumentGroup: InstrumentGroup;
    className?: string;
    hidePriceComparison?: boolean;
    instrumentId?: number
}

export function AdditionalInformationSection(props: AdditionalInformationSectionProps) {
    const pathParam = useParams<{ section: string, seoTag: string }>();
    return (
        <div className={classNames("content-wrapper pb-1 pb-xl-3", props.className)}>
            <h3 className="content-wrapper-heading font-weight-bold">Erweiterte Informationen</h3>
            <div className="content mt-n3 pt-1 mt-xl-0 pt-xl-0">
                <div className="d-flex flex-wrap">
                    <Link className="text-white bg-primary fs-14px rounded mb-2 mr-2" style={{ padding: "5px 16px" }} onClick={() => trigInfonline(guessInfonlineSection(), 'weitere_borsenplatze')}
                        to={{
                            key: '',
                            pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup).toLowerCase() + "/kurse/" + pathParam.seoTag + "/",
                            hash: '#boersen',
                            state: props.instrumentId
                        }}>
                        Weitere Börsenplätze
                    </Link>
                    <Link className="text-white bg-primary fs-14px rounded mb-2 mr-2" style={{ padding: "5px 16px" }} onClick={() => trigInfonline(guessInfonlineSection(), 'times_sales')}
                        to={{
                            key: 'times',
                            pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup).toLowerCase() + "/kurse/" + pathParam.seoTag + "/",
                            hash: '#times',
                            state: props.instrumentId
                        }}>
                        Times &amp; Sales
                    </Link>
                    <Link className="text-white bg-primary fs-14px rounded mb-2 mr-2" style={{ padding: "5px 16px" }} onClick={() => trigInfonline(guessInfonlineSection(), 'historische_kurse')}
                        to={{
                            key: 'historie',
                            pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup).toLowerCase() + "/kurse/" + pathParam.seoTag + "/",
                            hash: '#historie',
                            state: props.instrumentId
                        }}>
                        Historische Kurse
                    </Link>
                    {!props.hidePriceComparison &&
                        <Link className="text-white bg-primary fs-14px rounded mb-2 mr-2" style={{ padding: "5px 16px" }} onClick={() => trigInfonline(guessInfonlineSection(), 'kursvergleich')}
                            to={{
                                key: 'chart',
                                pathname: "/" + getAssetForUrl(props.instrumentGroup.assetGroup).toLowerCase() + "/kurse/" + pathParam.seoTag + "/",
                                hash: '#chart',
                                state: props.instrumentId
                            }}>
                            Kursvergleich letzte Handelstage
                        </Link>
                    }

                </div>
            </div>
        </div>
    )
}

export function AdditionalInformationSectionModals(props: AdditionalInformationSectionProps) {
    const [instrument, setInstrument] = useState<Instrument | undefined>();
    const [toggleChartOptions, setToggleChartOptions] = useState<boolean>(true);
    function updateInstrument (value: Instrument) {
        setInstrument(value)
    }

    return (
        <>
            {props.instrumentId && <ChartToolModal setToggleChartOptions={setToggleChartOptions} toggleChartOptions={toggleChartOptions} instrument={instrument} setInstrument={updateInstrument} instrumentId={props.instrumentId} instrumentGroup={props.instrumentGroup}/>}
            <ExchangeOverview instrumentGroup={props.instrumentGroup} />
            <TimesAndSales instrumentGroup={props.instrumentGroup} />
            <QuoteHistory instrumentGroup={props.instrumentGroup} />
            {!props.hidePriceComparison &&
                <PriceComparison instrumentGroup={props.instrumentGroup} />
            }
        </>
    )
}

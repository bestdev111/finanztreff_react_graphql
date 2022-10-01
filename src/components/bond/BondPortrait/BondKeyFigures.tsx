import { Instrument, InstrumentGroup } from "generated/graphql";
import { Table } from "react-bootstrap";
import { numberFormatDecimals } from "utils";
import {forwardRef, useImperativeHandle, useState} from "react";
import {RangeChartDonut} from "../../common/charts/RangeChartDonut/RangeChartDonut";
import {BOND_INVERSE_PALETTE} from "../utils";

export const BondKeyFigures = forwardRef((props: BondKeyFiguresProps, ref) => {
    let [state, setState] = useState<{ instrument: Instrument }>({instrument: props.instruments.find(current => current.id === props.instrumentId) || props.instruments[0]});
    useImperativeHandle(ref, () => ({
            changeInstrument(id: number) {
                setState({
                    ...state,
                    instrument: props.instruments.find(current => current.id == id) || props.instruments[0]
                });
            }
        })
    );

    return (
        <>
            <div className="content-wrapper">
                <h2 className="content-wrapper-heading font-weight-bold">Kennzahlen</h2>
                <div className="content">
                    <RangeChartDonut value={state.instrument.derivativeKeyFigures?.ismaYield || 0}/>
                    <h3 className="content-wrapper-heading font-weight-bold text-center">Rendite (nach ISMA) End of
                        Day:</h3>
                    <RangeChartDonut
                        value={state.instrument.derivativeKeyFigures?.accruedInterest || 0}
                        palette={BOND_INVERSE_PALETTE}
                    />
                    <h3 className="content-wrapper-heading font-weight-bold text-center">Stückzins *</h3>
                    <BondKeyFiguresContent instrument={state.instrument} instrumentGroup={props.instrumentGroup}/>
                </div>
            </div>
        </>
    )
});

interface BondKeyFiguresProps {
    instrumentId: number;
    instruments: Instrument[];
    instrumentGroup: InstrumentGroup
}

export function BondKeyFiguresContent(props: { instrument: Instrument, instrumentGroup: InstrumentGroup }) {
    return (
        <>
             <div className="content">
                 <Table variant="dividend">
                 <tr>
                     <td>Rendite (nach ISMA) End of Day:</td>
                     <td><div className="font-weight-bold text-anleihen-custom">{numberFormatDecimals(props.instrument.derivativeKeyFigures?.ismaYield, 2,2,"%")}</div></td>
                 </tr>
                 <tr>
                     <td>Stückzins*</td>
                     <td><div className="font-weight-bold text-anleihen-custom">{numberFormatDecimals(props.instrument.derivativeKeyFigures?.accruedInterest, 2, 2,'%')}</div></td>
                 </tr>
                 <tr>
                     <td>Duration</td>
                     <td><div className="font-weight-bold text-anleihen-custom">{numberFormatDecimals(props.instrument.derivativeKeyFigures?.duration, 2,2)}</div></td>
                 </tr>
                 <tr>
                     <td>Modified Duration</td>
                     <td><div className="font-weight-bold text-anleihen-custom">{numberFormatDecimals(props.instrument.derivativeKeyFigures?.modifiedDuration, 2,2)}</div></td>
                 </tr>
                 <tr>
                     <td>Spread absolut</td>
                     <td><div className="font-weight-bold text-anleihen-custom">{numberFormatDecimals(props.instrument.derivativeKeyFigures?.spread, 2,2)}</div></td>
                 </tr>
                 <tr>
                     <td>Spread relativ</td>
                     <td><div className="font-weight-bold text-anleihen-custom">{numberFormatDecimals(props.instrument.derivativeKeyFigures?.spreadRelative, 2,2, '%')}</div></td>
                 </tr>
                 <tr>
                     <td>Kaufpreis inkl. Stückzins</td>
                     <td><div className="font-weight-bold text-anleihen-custom">{numberFormatDecimals(props.instrument.derivativeKeyFigures?.dirtyPrice, 2,2)}</div></td>
                 </tr>
                 </Table>
                 <div className="text-below-table"> * Für die Berchenung der Stückzinsen werden 360 Tage herangezogen.</div>
                 </div>
        </>
    );
}

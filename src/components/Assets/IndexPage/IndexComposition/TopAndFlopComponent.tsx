import {InstrumentGroupComposition} from "../../../../generated/graphql";
import {Component} from "react";

interface CompositionTopAndFlopStatistics {
    positive?: number;
    negative?: number;
    neutral?: number;
}

function calculateStats(composition: InstrumentGroupComposition | undefined): CompositionTopAndFlopStatistics {
    if (!composition || !composition.entries) return {};

    let tops = 0, flops = 0, same = 0;
    let n: number = 0;

    composition.entries.forEach(
        e => {
            n = e.snapQuote?.quote?.percentChange || 0;
            if (n > 0) tops++
            else if (n < 0) flops++
            else same++;
        }
    );

    return {negative: flops, positive: tops, neutral: same};
}

export interface TopAndFlopComponentProps {
    composition?: InstrumentGroupComposition
}

export class TopAndFlopComponent extends Component<TopAndFlopComponentProps> {
    render() {
        let stats = calculateStats(this.props.composition);
        return(
            <div className="font-weight-bold fnt-size-16 topAndFlop">
                <span className="text-green padding-5 top-span">{stats.positive || '-'} </span>
                |
                <span className="padding-5 neutral-span">{stats.neutral || '-'} </span>
                |
                <span className="text-pink padding-5 flop-span">{stats.negative || '-'} </span>
            </div>
        );
    }
}

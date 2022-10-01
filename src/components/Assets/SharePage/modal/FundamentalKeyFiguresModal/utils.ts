import {FundamentalKeyFigures} from "../../../../../generated/graphql";
import {EstimateChartSeriesEntry} from "../../../../common/charts";

export function createSeries(data: FundamentalKeyFigures[], field: string, suffix: string = ''): EstimateChartSeriesEntry[] {
    return data
        .filter(current => current.hasOwnProperty(field))
        .sort((a:FundamentalKeyFigures, b:FundamentalKeyFigures) => (a.year || 0) - (b.year || 0))
        .map(current => {
            // @ts-ignore
            return {x: current.year + suffix || "", y: (current.hasOwnProperty(field) ?  current[field] : null) as number} as EstimateChartSeriesEntry;
        })
        .filter(current => !!current.x && !!current.y);
}

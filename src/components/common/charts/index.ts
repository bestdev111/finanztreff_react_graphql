export * from './KeyFigureChart/KeyFigureChart';

export interface EstimateChartSeriesEntry {
    x: string;
    y: number;
}
export interface EstimateChartSeries {
    name: string;
    points: EstimateChartSeriesEntry[];
    color?: string;
}

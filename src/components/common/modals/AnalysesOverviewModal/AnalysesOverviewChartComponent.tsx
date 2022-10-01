import { ProgressBar } from "react-bootstrap";

export function AnalysesOverviewChartComponent({ positive, neutral, negative }: AnalysesOverviewChartComponentProps) {
    const percent = 100 / ((neutral || 0) + (positive || 0) + (negative || 0));
    return (
        <>
            <div className="content-wrapper d-flex justify-content-end pb-2">
                <ProgressBar className="mt-4 w-100 px-sm-1" style={{ maxWidth: "600px" }}>
                    {negative != 0 && <ProgressBar variant="pink" now={(percent * (negative || 0))}
                        label={
                            <span className="mb-4 position-absolute font-weight-bold fs-15px pb-3 pl-3" style={{ color: "#383838" }}>
                                Negative
                                <span className="text-red"> {negative}</span>
                            </span>} />
                    }
                    {neutral != 0 && <ProgressBar variant="yellow" now={(percent * (neutral || 0))}
                        label={
                            <span className="mb-4 position-absolute font-weight-bold fs-15px pb-3 pl-3" style={{ color: "#383838" }}>
                                Neutral
                                <span style={{ color: "#ffc300" }}> {neutral}</span>
                            </span>}>
                    </ProgressBar>
                    }
                    {positive != 0 && <ProgressBar variant="green" now={(percent * (positive || 0))}
                        label={
                            <span className="mb-4 position-absolute font-weight-bold fs-15px pb-3 pl-3" style={{ color: "#383838" }}>
                                Positive
                                <span className="text-green"> {positive}</span>
                            </span>}>
                    </ProgressBar>
                    }
                </ProgressBar>
            </div>
        </>
    );
}

interface AnalysesOverviewChartComponentProps {
    positive: number;
    neutral: number;
    negative: number;
}
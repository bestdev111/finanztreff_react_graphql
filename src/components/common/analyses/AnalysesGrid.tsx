import {Analysis, AnalysisRecommendation} from "../../../generated/graphql";
import {Component} from "react";
import classNames from "classnames";
import {Link} from "react-router-dom";
import {formatDate, getFinanztreffAssetLink, numberFormat} from "../../../utils";
import {Col} from "react-bootstrap";

interface AnalysisItemRecommendationProps {
    recommendation?: AnalysisRecommendation;
}

export class AnalysisItemRecommendation extends Component<AnalysisItemRecommendationProps> {
    render() {
        switch (this.props.recommendation) {
            case AnalysisRecommendation.Positive:
                return (
                    <div className="type-box text-white text-uppercase font-weight-bold">Positive</div>
                );
            case AnalysisRecommendation.Negative:
                return (
                    <div className="type-box text-white text-uppercase font-weight-bold">Negativ</div>
                );
            default:
                return (
                    <div className="type-box text-white text-uppercase font-weight-bold">Neutral</div>
                );
        }
    }
}

interface AnalysisItemProps {
    analysis: Analysis;
}

class AnalysisItem extends Component<AnalysisItemProps> {
    render() {
        return (
            <div className={
                classNames(
                    "analyse-stock-box border border-border-gray",
                    (this.props.analysis.recommendation && (
                            this.props.analysis.recommendation === 'POSITIVE' ? 'positive-analyse' :
                                (this.props.analysis.recommendation === 'NEGATIVE' ? 'negative-analyse' : 'neutral-analyse')
                        )
                    )
                )}>
                <div className="top bg-border-gray line-height-1 d-flex justify-content-between">
                    <div className="p-5px">
                        {this.props.analysis.group && this.props.analysis.group?.name &&
                        (this.props.analysis.group?.assetGroup && this.props.analysis.group?.seoTag ?
                                <Link
                                    to={getFinanztreffAssetLink(this.props.analysis.group.assetGroup, this.props.analysis.group.seoTag)}
                                    className="font-weight-bold text-dark">
                                    {this.props.analysis.group.name}
                                </Link> :
                                <div className="font-weight-bold">
                                    {this.props.analysis.group.name}
                                </div>
                        )
                        }
                        <div className="font-size-13px">
                            <span>{formatDate(this.props.analysis.date)} | Analyst: {this.props.analysis.institute?.id}</span>
                        </div>
                    </div>
                    <AnalysisItemRecommendation recommendation={this.props.analysis.recommendation || undefined}/>
                </div>
                <div className="bottom">
                    <>
                        <div className="bar-holder">
                            <div className="bar-asset-info font-size-13px">
                                    <span className={"p-5px"}>Letztes Kursziel ({this.props.analysis.timeFrame} M)</span>
                                    <span className="float-right">{numberFormat(!!this.props.analysis.targetPrice && this.props.analysis.targetPrice > 0 ? this.props.analysis.targetPrice : undefined)} {this.props.analysis.currency?.displayCode}&nbsp;</span>
                            </div>
                        </div>
                    </>
                </div>
            </div>
        );
    }
}

interface AnalysesGridComponentProps {
    analyses: Analysis[];
}

export class AnalysesGridComponent extends Component<AnalysesGridComponentProps> {
    render() {
        return (
            <div className="row gutter-16 row-cols-xl-4 row-cols-lg-2 row-cols-sm-1">
                {this.props.analyses
                    .map((current: Analysis, index: number) =>
                        <Col key={index}>
                            <AnalysisItem analysis={current}/>
                        </Col>
                    )
                }
            </div>
        );
    }
}

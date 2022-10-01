import React, {ReactNode} from "react";
import {Card, Col} from "react-bootstrap";
import {tableHeaderType} from "../../shares/search/tables/shareTableHeaders";
import {ShareSortField} from "../../../generated/graphql";
import "./BaseSearchCard.scss";
import {guessInfonlineSection, trigInfonline} from "../InfonlineService";

export interface BaseCardInfoComponent<Criteria, CriteriaDetails = void> {
    criteria: Criteria;
    enabled: boolean;
    children?: ReactNode;
    className?: string;
    details?: CriteriaDetails | null;
    shareTableHeaders?: tableHeaderType[]
    cardResult?: any
    shareSort?: ShareSortField
}

export interface BaseCardProps<Criteria, CriteriaDetails> {
    criteria: Criteria;
    enabled: boolean;
    infoComponent: (props: BaseCardInfoComponent<Criteria, CriteriaDetails>) => JSX.Element;
    children: React.ReactElement | React.ReactNode | React.ReactNodeArray;
    assetInfo?: React.ReactElement;
    tags?: string[]
    details?: CriteriaDetails | null;
    shareTableHeaders?: tableHeaderType[]
    cardResult?: any
    shareSort?: ShareSortField
    setTags?: (val: string) => void
}

export function BaseSearchCard<Criteria, CriteriaDetails = void>({criteria, enabled, infoComponent, details, shareTableHeaders, cardResult, shareSort, setTags, ...props}: BaseCardProps<Criteria, CriteriaDetails>){
    let InfoComponent = infoComponent;

    return (
        <Col xl={3} lg={6} md={6} sm={12} className="p-md-2 py-sm-2 px-sm-0">
            <Card className="base-search-card p-2 rounded-0">
                <Card.Body className="d-flex flex-wrap flex-grow-inherit p-0">
                    {props.children}
                </Card.Body>
                <Card.Footer className="borderless bg-white shadow-none inline-height-1 p-0">
                    <div className="text-gray fs-11px">
                        {(props.tags || []).map(item => <span onClick={() => {
                            if (setTags) {
                                trigInfonline("sharessearch", "search_result")
                                setTags(item);
                            }
                            else return;
                        }} className="mr-1">{item}</span>)}
                    </div>
                    <div className="d-flex justify-content-between">
                        <InfoComponent shareSort={shareSort ? shareSort : undefined} cardResult={cardResult ? cardResult : null} shareTableHeaders={shareTableHeaders ? shareTableHeaders : []}
                                    className="rounded-0" criteria={criteria} enabled={enabled} details={details || null}>
                            {props.children}
                        </InfoComponent>
                        {props.assetInfo}
                    </div>
                </Card.Footer>
            </Card>
        </Col>
    )
}


export interface SearchCardClassification {
    enabled?: boolean;
    tags?: string[];
    assetInfo?: string;
}

export interface BaseSearchCardProps { }

export type SearchCard<T extends BaseSearchCardProps = BaseSearchCardProps> = ((props: T) => JSX.Element) & SearchCardClassification;


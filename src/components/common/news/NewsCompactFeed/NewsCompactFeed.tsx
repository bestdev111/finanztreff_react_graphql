import {Component} from "react";
import {News} from "../../../../generated/graphql";
import {NewsInstrumentInfo} from "../NewsInstrumentInfo";
import {getAssetLink} from "../../../../utils";
import {Button} from "react-bootstrap";
import {NewsModal} from "../NewsModal/NewsModal";

export class NewsCompactFeedItem extends Component<NewsCompactFeedItemProperties, {}> {
    render() {
        let { headline, instruments } = this.props.item;
        let [first] = instruments || [];
        return (
            <div className="news-wrapper">
            </div>
        );
    }
}

export interface NewsCompactFeedItemProperties {
    item: News;
}

export class NewsCompactFeed extends Component<NewsCompactFeedProperties, any> {
    onMoreClick() {
        if (this.props.onClickMore) {
            this.props.onClickMore();
        }
    }
    render() {
        return (
            <div className="content-wrapper">
                <div className="content">
                    <div className="small-news-row">
                        {this.props.news
                            && this.props.news.map(item => <NewsCompactFeedItem key={item.id} item={item}/>)
                        }
                    </div>
                </div>
                <div className="button-row d-flex justify-content-end">
                    {this.props.more
                        && <Button variant="primary"
                                   disabled={this.props.moreLoading}
                                   onClick={() => this.props.moreLoading ? null : this.onMoreClick()}>
                                        {this.props.moreLoading ? 'Bitte warten...' : 'weitere Nachrichten...'}
                            </Button>
                    }
                </div>
            </div>
        );
    }
}

export interface NewsCompactFeedProperties {
    news: News[];
    more: boolean;
    moreLoading?: boolean;
    onClickMore?: () => void;
}

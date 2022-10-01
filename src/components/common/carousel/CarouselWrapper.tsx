import {Children, cloneElement, Component} from "react";
import classNames from "classnames";

function wrapCarousel(list: any[], controlClass?: string) {
    if (list.length < 2) {
        return <>{list[0]}</>;
    }
    let [controls, inner, indicators] = [...list];
    let [prevIndicator, nextIndicator] = Children.toArray(
        Children.map(indicators.props.children, child =>
            cloneElement(
                child,
                {className: "carousel-slide-control-wrapper " + child.props.className.replace("-control-", "-slide-control-")},
                child.props.children
            )
        )
    );
    return <>
        {inner}
        <div className={classNames("carousel-controls", controlClass)}>
            {prevIndicator}
            {controls}
            {nextIndicator}
        </div>
    </>
}

interface ICarousel {
    className: string;
    controlclass?: string;
}

export class CarouselWrapper extends Component<ICarousel> {
    render() {
        let props = {...this.props};
        return (
            <div {...props}>
                {wrapCarousel(Children.toArray(this.props.children), this.props.controlclass)}
            </div>
        );
    }
}

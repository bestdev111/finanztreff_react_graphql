import React, {Component, ReactSVGElement, useEffect, useState} from "react";
import classNames from "classnames";

interface SvgImageProps extends React.HTMLAttributes<HTMLImageElement> {
    icon: string;
    imgClass?: string;
    spanClass?: string;
    width?: string;
    childBeforeImage?: boolean;
    convert?: boolean
}

interface SvgImageState {
    svg?: ReactSVGElement;
}

export default class SvgImage extends Component<SvgImageProps, SvgImageState> {
    baseUrl: string;

    constructor(props: SvgImageProps) {
        super(props);
        this.state = {};
        this.baseUrl = process.env.PUBLIC_URL + "/static/img/svg/";
    }

    render() {
        return (<>
            <span className={classNames(this.props.spanClass, 'svg-icon')} onClick={this.props.onClick}>
                {this.props.childBeforeImage && this.props.children}
                {this.props.convert ?
                    <Svg url={this.baseUrl + this.props.icon} {...getHtmlElementAttr(this.props)}
                         className={classNames(this.props.imgClass, 'svg-convert')}/> :
                    (<img src={this.baseUrl + this.props.icon} alt="" {...getHtmlElementAttr(this.props)}
                          className={this.props.imgClass}/>)
                }
                {!this.props.childBeforeImage && this.props.children}
            </span>
        </>);
    }
}

function getAttributes(el: SVGSVGElement): object {
    const attrs = {};
    let attributeNames = el.getAttributeNames();
    attributeNames.forEach((name: string) => {
        // @ts-ignore
        attrs[name] = el.getAttribute(name);
    });
    return attrs;
}

function Svg(props: any) {
    let [svgBody, setSvgBody] = useState('');
    let [svgAttrs, setSvgAttrs] = useState();
    let [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const imgAttrs = {...props};
        delete imgAttrs.url;
        fetch(props.url).then(t => t.text()).then(e => {
            const svg = (new DOMParser()).parseFromString(e, "image/svg+xml").querySelector("svg");
            if (svg) {
                setSvgBody(svg.innerHTML);
                setSvgAttrs({...getAttributes(svg), ...imgAttrs});
            } else {
                setSvgBody('');
                setSvgAttrs({...imgAttrs});
            }
            setLoaded(true);
        });
    }, [props]);
    return (<>
        {loaded && <svg {...svgAttrs} dangerouslySetInnerHTML={{__html: svgBody}}/>}
    </>);
}

function getHtmlElementAttr(props: any): any {
    const attrs = {...props};
    delete attrs.icon;
    delete attrs.imgClass;
    delete attrs.spanClass;
    delete attrs.childBeforeImage;
    delete attrs.convert;
    delete attrs.children;
    return attrs;
}
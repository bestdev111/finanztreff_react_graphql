import React from "react";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";

export default function AssetTagsWrapper(props: any) {
    const tagId = new Map<string, string>(
        [
            ['DAX', '1361'],
            ['Xiaomi', '1205'],
            ['Moderna', '2906'],
            ['Tui', '3010'],
            ['Siemens', '799'],
            ['Pfizer', '1575'],
            // ['Curevac', '1361'],
            ['Alibaba', '21345'],
            ['Bayer', '1301'],
            ['Byd', '26520'],
            ['Tesla', '2872'],
            ['Sap', '969'],
            ['Lufthansa', '586'],
            ['Amazon', '1602'],
            ['Nel', '2979']
        ]
    );

    const Tag = function ({tag, link}: any) {
        const _link = (link || '/hebelprodukte/suche?aclass=Optionsscheine');
        return tagId.has(tag) ? <span><a href={link + '&underlying=' + tagId.get(tag)}>{tag}</a></span> : null
    }

    return (<>
        <div className="data-wrapper">
            <div className="title">Weitere interessante Basiswerte</div>
            <div className="tags-wrap">
                {
                    props.tags.map((tag: string) => <Tag key={tag} tag={tag} link={props.jetztHref} />)
                }
            </div>
            <div className="button-row justify-content-center align-items-center d-flex">
                <span className="font-weight-bold pr-4">Immer noch nichts dabei?</span>
                <Link to={props.jetztHref}><Button>{props.findMoreText}</Button></Link>
            </div>
        </div>
    </>);
}


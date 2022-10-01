import classNames from "classnames";

export interface PagerParameters {
    pageCount: number,
    currentPage: number,
    onPageChange: any
}

export function PagerComponent(props: PagerParameters) {
    const items = [];
    let itemCss = "";

    if(props.pageCount < 2) return null;

    for(let i = 0; i < props.pageCount; i++) {
        itemCss = "page-item" + (i === props.currentPage ? " active" : "");
        items.push(
            <li key={i} className={itemCss} onClick={()=>{props.onPageChange(i)}}>
                <a href="#index-composition" className={classNames("page-link", i === props.currentPage && "text-white")}>{(i+1)}<span className="sr-only">(current)</span></a>
            </li>
        );
    }

    return (
        <ul className="pagination pagination-sm margin-bottom-8 justify-content-center pagination-circle no-border">
            {items}
        </ul>
    )
}

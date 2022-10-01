import classNames from "classnames";
import SvgImage from "components/common/image/SvgImage";
import { Button } from "react-bootstrap";
import { PortfoliosSortingDropdown } from "./PortfoliosSortingDropdown";

export function MainFilterRow(props: MainFilterRowProps) {

    return (
        <>
            <div className="d-flex justify-content-lg-between justify-content-sm-end filters-row-portfolio">
                <Button variant={'inline-action'} className="d-flex bg-white align-middle memo-button"
                    onClick={() => props.handleMemo(!props.showMemo)}
                >
                    <SvgImage icon={"icon_note" + (props.showMemo ? "" : "_gray") + ".svg"} width={"30"} spanClass="pt-1" />
                    <span className={classNames("pt-2 mt-1 font-weight-bold mx-1 memo-text", props.showMemo ? "text-dark" : "text-gray")}>Notizen</span>
                </Button>
                <div className="sort-dropdown">
                        <PortfoliosSortingDropdown handleSort={props.handleSort} sort={props.sort} sortOptionsList={props.sortOptionsList}/>
                </div>
            </div>
        </>
    );
}

interface MainFilterRowProps {
    handleSort: (value: SortOption) => void;
    sort: SortOption;
    handleMemo: (value: boolean) => void;
    showMemo: boolean;
    sortOptionsList: string[];
}

interface SortOption {
    sortType: string;
    direction: boolean;
}

interface Option {
    name: string;
    id: string;
}
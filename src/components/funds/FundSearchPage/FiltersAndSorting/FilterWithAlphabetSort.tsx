import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { usePageHeaderFilterState } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { loader } from "graphql.macro";
import { FundCompany, Query } from "graphql/types";
import { useCallback, useContext, useState } from "react";
import { Button, Card, FormControl, Spinner, } from "react-bootstrap";
import { debounce } from "underscore";

interface FilterWithAlphabetSortProps {
    className?: string;
    title: string;
    onSelect?: (type: TypeSelectEvent) => void;
    buttonOptions: FundCompany[];
    option?: string;
    optionId?: number;
}

interface TypeSelectEvent {
    id: number;
    name: string;
}

interface FilterWithAlphabetSortState {
    selected: string;
}

function Filter({ className, title, buttonOptions, onSelect, option, optionId }: FilterWithAlphabetSortProps) {
    let [state, setState] = usePageHeaderFilterState<FilterWithAlphabetSortState>({ selected: "Alle" });
    let context = useContext(PageHeaderFilterContext);
    if (option && optionId && onSelect) {
        onSelect({ id: optionId, name: option })
    }

    let closeAction = useCallback(() => {
        if (context) {
            context.close();
        }
    }, [context]);

    let options = [...buttonOptions]
    options = options.sort(function (a, b) {
        if (!a.name || !b.name)
            return 0;
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
    });


    let [selectedLeter, setLeter] = useState<string | undefined>(undefined);
    let [searchString, setSearchString] = useState<string>("");

    if(searchString!=="")
        options = options.filter(current => current.name?.toLowerCase().includes(searchString.toLowerCase()))


    return (
        <Card className={classNames(className, "options-filter px-3 pt-1 border-0")}>
            <Card.Header className="bg-white pb-0 pt-1 px-0 d-flex justify-content-between d-none d-xl-flex d-sm-none d-md-none d-lg-none">
                <h6 className="font-weight-bold pt-2">{title}</h6>
                <span className="close-modal-butt svg-icon mt-1 mr-n1 cursor-pointer" onClick={() => closeAction()}>
                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark.svg"} alt="" className="svg-convert svg-blue" />
                </span>
            </Card.Header>
            <Card.Body className="mt-sm-n4">
                <div className="d-flex d-lg-flex d-md-flex d-sm-none justify-content-center justify-content-xl-start px-0">
                    <div className="alphabet mr-3 d-none d-xl-block">
                        {
                            ALPHABET.map((leter, index) =>
                                <div key={index} style={{ lineHeight: "1" }}>
                                    <Button variant={'inline-inverse'} href={"#" + leter.name} disabled={options.filter(option => option.name && option.name.slice(0, 1).toUpperCase() === leter.name).length == 0}
                                        className={classNames("btn letter", selectedLeter === leter.name && "active")} onClick={() => selectedLeter === leter.id ? setLeter(undefined) : setLeter(leter.id)}>
                                        {leter.name}
                                    </Button>
                                </div>
                            )
                        }
                    </div >
                    <div className="d-flex flex-wrap button-container ml-xl-n3" >
                        <FormControl autoFocus className="ergebnise-filter mb-2 mx-auto" placeholder="Ergebnisse"
                            onChange={
                                debounce(
                                    (e: any) => setSearchString(e.target.value), 500)}
                        />
                        <div className="options-capital-holder mx-auto">
                                        <Button key={-1} variant={'inline-action'} id={"A"} onClick={() => {
                                            setState({ ...state, selected: "" })
                                            if (onSelect) {
                                                onSelect({ id: -1, name: "" });
                                            }
                                            closeAction();
                                        }} className={classNames("border-top text-left w-100 font-weight-bold text-dark text-truncate ml-n2 py-2", state.selected ==="Alle" ? 'text-blue' : '')}>
                                            Alle
                                        </Button>
                            {
                                options.map((current) =>
                                    current && current.name &&
                                    <>
                                        <Button key={current.id} variant={'inline-action'} id={current.name.slice(0, 1).toUpperCase()} onClick={() => {
                                            setState({ ...state, selected: current.name || "" })
                                            if (onSelect) {
                                                onSelect({ id: current.id, name: current.name || "" });
                                            }
                                            closeAction();
                                        }} className={classNames("border-top text-left w-100 font-weight-bold text-dark text-truncate ml-n2 py-2", state.selected === current.name ? 'text-blue' : '')}>
                                            {current.name}
                                        </Button>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="d-none d-lg-none d- d-sm-block justify-content-center px-0 alphabet-filter-mobile">
                    <FormControl autoFocus className="ergebnise-filter mb-2" placeholder="Ergebnisse"
                        onChange={
                            debounce(
                                (e: any) => setSearchString(e.target.value), 500)} />
                    <div className="d-flex">
                        <div className="alphabet-mobile">
                            {
                                ALPHABET.map(leter =>
                                    <div className="letter-wrapper">
                                        <Button variant={'inline-action'} href={"#" + leter.name} disabled={options.filter(option => (option.name || "").slice(0, 1).toUpperCase() === leter.name).length == 0}
                                            className={classNames("btn letter", selectedLeter === leter.name && "text-blue")} onClick={() => selectedLeter === leter.id ? setLeter(undefined) : setLeter(leter.id)}>
                                            {leter.name}
                                        </Button>
                                    </div>
                                )
                            }
                        </div>
                        <div className="list-options-mobile">
                            {
                                options.sort().map((current, index) =>
                                    current.name &&
                                    <>
                                        <Button variant={'inline-action'} id={current.name.slice(0, 1).toUpperCase()} onClick={() => {
                                            setState({ ...state, selected: current.name || "" })
                                            if (onSelect) {
                                                onSelect({ id: current.id, name: current.name || "" });
                                            }
                                            closeAction();
                                        }} className={classNames("border-top text-left w-100 font-weight-bold text-dark text-truncate ml-n2 py-2", state.selected === current.name ? 'text-blue' : '')}>
                                            {current.name}
                                        </Button>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

interface FilterState {
    description: string;
}


export function FilterWithAlphabetSort(props: FilterProps) {
    let [state, setState] = useState<FilterState>({ description: props.description || 'Alle' });

    let { loading, data } = useQuery<Query>(loader('./getFundCompanies.graphql'));
    if (loading) {
        return (
            <div style={{ height: '70px' }}>
                <Spinner animation={"border"} variant={'sm'} />
            </div>
        )
    }

    return (
        <PageHeaderFilterComponent
            variant={"dropdown-panel"}
            toggleVariant={"panel-button"}
            toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"}
            title={props.title}
            description={state.description}>
            <Filter
                title={props.title}
                onSelect={(ev: TypeSelectEvent) => {
                    if (props.onSelect) {
                        props.onSelect(ev);
                    }
                    setState({ description: ev.name });
                }}
                buttonOptions={data?.fundCompanies || []}
            />
        </PageHeaderFilterComponent>
    );
}

interface FilterProps {
    title: string;
    onSelect: (e: TypeSelectEvent) => void;
    option?: string;
    description?: string;
    optionId?: number;
}


const ALPHABET = [
    { id: "A", name: "A" },
    { id: "B", name: "B" },
    { id: "C", name: "C" },
    { id: "D", name: "D" },
    { id: "E", name: "E" },
    { id: "F", name: "F" },
    { id: "G", name: "G" },
    { id: "H", name: "H" },
    { id: "I", name: "I" },
    { id: "J", name: "J" },
    { id: "K", name: "K" },
    { id: "L", name: "L" },
    { id: "M", name: "M" },
    { id: "N", name: "N" },
    { id: "O", name: "O" },
    { id: "P", name: "P" },
    { id: "Q", name: "Q" },
    { id: "R", name: "R" },
    { id: "S", name: "S" },
    { id: "T", name: "T" },
    { id: "U", name: "U" },
    { id: "V", name: "V" },
    { id: "W", name: "W" },
    { id: "X", name: "X" },
    { id: "Y", name: "Y" },
    { id: "Z", name: "Z" },
]

import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import React, { ReactNode, useCallback, useContext, useState } from "react";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { Button, Card} from "react-bootstrap";
import classNames from "classnames";
import { usePageHeaderFilterState } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import "./CurrencyEntriesDropdown.scss";

interface Institute {
    id: string;
    name: string;
}

interface InstituteSelectorContentComponentState {
    institute?: Institute;
}

interface InstituteSelectEvent {
    institute?: Institute;
}

interface CurrencyEntriesDropdownProps {
    currentId?: string;
    hasAllButton?: boolean;
    hasShortNames?: boolean;
    onSelect?: (ev: InstituteSelectEvent) => void;
}

function CurrencyEntriesDropdown(props: CurrencyEntriesDropdownProps) {
    let [state, setState] = usePageHeaderFilterState<InstituteSelectorContentComponentState>({});
    let context = useContext(PageHeaderFilterContext);

    // Method ready for backend Call
    // let {data, loading} = useQuery<Query>(loader('./getCurrencyEntries.graphql'));

    let closeDropDown = useCallback(() => {
        if (context && context.close) {
            context.close();
        }
    }, [context]);

    return (
        <Card className={"border-0 institute-selector"}>
            <Card.Body className="border-0 p-0 d-flex justify-content-center">
                <div className="card-body-wrapper overflow-auto" style={{ height: '300px' }}>
                    {
                        props.hasAllButton === true &&
                        <Button variant='inline-action'
                            className={classNames("text-left w-100 font-weight-bold py-1", !state.institute ? 'active' : '')}
                            key={'All'}
                            onClick={() => {
                                setState({ ...state, institute: undefined });
                                if (props.onSelect) {
                                    props.onSelect({ institute: undefined});
                                }
                                closeDropDown();
                            }}
                        >Alle... </Button>
                    }
                    {
                        drpdwnData?.map(current =>
                            <>
                                <hr className={"m-0"} />
                                <Button variant='inline-action'
                                    key={current.id}
                                    className={classNames("text-left w-100 py-2 font-weight-bold", state.institute?.name === current.name ? 'active' : '')}
                                    onClick={() => {
                                        let institute: Institute = { id: current.id || "", name: current.name || "" };
                                        setState({ ...state, institute: institute });
                                        if (props.onSelect) {
                                            props.onSelect({ institute: institute });
                                        }
                                        closeDropDown();
                                    }}
                                >{props.hasShortNames ? current.name.slice(0,-5) : current.name }</Button>
                            </>
                        )}
                </div>
            </Card.Body>
        </Card>
    );
}

interface InstituteSelectorComponentProps {
    name?: string;
    onSelect?: (ev: InstituteSelectEvent) => void;
    isPerformanceTitle?: boolean;
    hasAllButton?: boolean;
    hasShortenedNames?: boolean;
    description?: any;
    toggleVariant?: any;
}

interface InstituteSelectorComponentState {
    description?: string | ReactNode;
    currencyId?: string | ReactNode;
    
}

export function CurrencyEntriesDropdownComponent(props: InstituteSelectorComponentProps) {
    let [state, setState] = useState<InstituteSelectorComponentState>({});
    if (state.description == null) {
        if(props.description !== null){
            switch(props.description){
                case 'EUR' : state.description = 'EUR (Euro) zu...'; break;
                case 'USD' : state.description = 'USD (US Dollar) zu...'; break;
                case 'JPY' : state.description = 'JPY (Japanische Yen) zu...'; break;
                case 'GBP' : state.description = 'GBP (Pfund Sterling) zu...'; break;
                case 'CHF' : state.description = 'CHF (Scheizer Franken) zu...'; break;
                case 'HKD' : state.description = 'HKD (Hong Kong Dollar) zu...'; break;
                case 'RUB' : state.description = 'RUB (Russischer Rubel) zu...'; break;
                case 'CNY' : state.description = 'CNY (Yuan Renminbi) zu...'; break;
                case 'AUD' : state.description = 'AUD (Australischer Dollar) zu...'; break;
                case 'CAD' : state.description = 'CAD (Kanadisher Dollar) zu...'; break;
                case 'NZD' : state.description = 'NZD (Neuseeland-Dollar) zu...'; break;
                case 'DKK' : state.description = 'DKK (Dänische Krone) zu...'; break;
                case 'ZAR' : state.description = 'ZAR (Sudafrikanischer Rand) zu...'; break;
                case 'HUF' : state.description = 'HUF (Ungarishche Forint) zu...'; break;
                case 'TWD' : state.description = 'TWD (Neuer Taiwan-Dollar) zu...'; break;
                case 'SGD' : state.description = 'SGD (Singapur Dollar) zu...'; break;
                case 'SEK' : state.description = 'SEK (Schwedische Krone) zu...'; break;
                case 'NOK' : state.description = 'NOK (Norwegische Krone) zu...'; break;
                case 'KWD' : state.description = 'KWD (Kuwaitischer Dinar) zu...'; break;
                default : state.description = "Alle..."
            }
        }else{
        state.description = "Alle...";
        }
        if (props.isPerformanceTitle === true) {
                state.description = "EUR (Euro)";
        }
    }

    return (
        <PageHeaderFilterComponent title={props.name || ""} description={state.description} toggleVariant={props.toggleVariant ? props.toggleVariant : "devisen-dropdown"} toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_blue.svg"}>
            {
                <CurrencyEntriesDropdown
                hasShortNames={props.hasShortenedNames}
                hasAllButton={props.hasAllButton}
                onSelect={(ev) => {
                    if (props.onSelect) {
                        props.onSelect(ev);
                    }
                    if (ev.institute) {
                        setState({ description: (<span className="">{props.hasShortenedNames ? ev.institute.name.slice(0,-5) : ev.institute.name}</span>) })
                    } else {
                        setState({ description: undefined });
                    }
                }}
            />
            }
        </PageHeaderFilterComponent>
    );
}

const drpdwnData = [
    {
        id: "eur",
        name: "EUR (Euro) zu...",
        currencyId: 2485104,
    },
    {
        id: "usd",
        name: "USD (US Dollar) zu...",
        currencyId: 2485104,
    },
    {
        id: "jpy",
        name: "JPY (Japanische Yen) zu...",
        currencyId: 2485104,
    },
    {
        id: "gbp",
        name: "GBP (Pfund Sterling) zu...",
        currencyId: 2485104,
    },
    {
        id: "chf",
        name: "CHF (Scheizer Franken) zu...",
        currencyId: 2485104,
    },
    {
        id: "hkd",
        name: "HKD (Hong Kong Dollar) zu...",
        currencyId: 2485104,
    },
    // {
    //     id: "rub",
    //     name: "RUB (Russischer Rubel) zu...",
    //     currencyId: 2485104,
    // },
    {
        id: "cny",
        name: "CNY (Yuan Renminbi) zu...",
        currencyId: 2485104,
    },
    {
        id: "aud",
        name: "AUD (Australischer Dollar) zu...",
        currencyId: 2485104,
    },
    {
        id: "cad",
        name: "CAD (Kanadisher Dollar) zu...",
        currencyId: 2485104,
    },
    {
        id: "nzd",
        name: "NZD (Neuseeland-Dollar) zu...",
        currencyId: 2485104,
    },
    {
        id: "dkk",
        name: "DKK (Dänische Krone) zu...",
        currencyId: 2485104,
    },
    // {
    //     id: "zar",
    //     name: "ZAR (Sudafrikanischer Rand) zu...",
    //     currencyId: 2485104,
    // },
    {
        id: "huf",
        name: "HUF (Ungarishche Forint) zu...",
        currencyId: 2485104,
    },
    {
        id: "twd",
        name: "TWD (Neuer Taiwan-Dollar) zu...",
        currencyId: 2485104,
    },
    {
        id: "sgd",
        name: "SGD (Singapur Dollar) zu...",
        currencyId: 2485104,
    },
    {
        id: "sek",
        name: "SEK (Schwedische Krone) zu...",
        currencyId: 2485104,
    },
    {
        id: "nok",
        name: "NOK (Norwegische Krone) zu...",
        currencyId: 2485104,
    },
    {
        id: "kwd",
        name: "KWD (Kuwaitischer Dinar) zu...",
        currencyId: 2485104,
    },
]

import {PageHeaderFilterComponent} from "../../layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import React, {useCallback, useContext} from "react";
import PageHeaderFilterContext from "../../layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import {Button, Card} from "react-bootstrap";
import classNames from "classnames";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";


interface OptionSelectorComponentProps<T, V> {
    title: string;
    subtitle?: string | undefined;
    variant?: string | undefined;
    toggleVariant?: string;
    toggleIcon?: string | undefined;
    description?: string | undefined;
    options: Option<T, V>[];
    disabled?: boolean;
    onSelect?: (ev: OptionSelectEvent<T, V>) => void;
    selected: T | null;
}

export function OptionSelectorComponent<T = string, V = void>(props: OptionSelectorComponentProps<T, V>) {
    let selected = props.options.find(current => current.id == props.selected);
    return (
        <PageHeaderFilterComponent title={props.title} description={selected?.name || props.description || 'Auswählen'}
                                   variant={props.variant || "range-selector"}
                                   toggleVariant={props.toggleVariant}
                                   disabled={props.disabled}
                                   toggleIcon={props.toggleIcon}
        >
            <OptionSelectorContentComponent<T, V>
                options={props.options}
                title={props.subtitle}
                selected={props.selected}
                onChange={(ev: OptionSelectEvent<T, V>) => {
                    if (props.onSelect) {
                        props.onSelect(ev);
                    }
                }}/>
        </PageHeaderFilterComponent>
    )
}

export interface Option<T, V> {
    id: T;
    name: string;
    value: V | null;
}

export interface OptionSelectEvent<T, V> {
    selected?: Option<T, V>;
}

interface PeriodSelectorContentProps<T, V>{
    title?: string | undefined;
    options?: Option<T, V>[] | undefined;
    selected: T | null;
    onChange?: (ev: OptionSelectEvent<T, V>) => void | undefined;
}

function OptionSelectorContentComponent<T, V>(props: PeriodSelectorContentProps<T, V>) {
    let context  = useContext(PageHeaderFilterContext);

    let closeDropDown = useCallback(() => {
        if (context && context.close) {
            context.close();
        }
    }, [context]);

    return (
        <Card className="period-selector border-0 justify-content-center">
            {
                props.title &&
                    <Card.Header className="bg-white pb-0 pt-1 mx-2 d-flex justify-content-between d-none d-xl-flex d-sm-none d-md-none d-lg-none">
                        <h6 className="font-weight-bold pt-2">{props.title}</h6>
                        <span className="close-modal-butt svg-icon mt-1 mr-n1 cursor-pointer" onClick={() => closeDropDown()}>
                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark.svg"} alt="" className="svg-convert svg-blue" />
                        </span>
                    </Card.Header>
            }
            <Card.Body className="px-3 py-2 d-flex justify-content-center">
                <div className="card-body-wrapper">
                    <div className="d-flex flex-wrap">
                        { props.options && props.options.map((option: Option<T, V>, index: number) => (
                            <Button
                                onClick={() => {
                                    trigInfonline(guessInfonlineSection(), "search_result");
                                   props.onChange && props.onChange({selected: option});
                                    closeDropDown();
                                }}
                                key={index} variant={'inline-inverse'}
                                className={classNames('', props.selected && props.selected === option.id ? "active" : "")}
                            >{ option.name }</Button>
                        ))}
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}

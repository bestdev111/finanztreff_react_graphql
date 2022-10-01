import {PageHeaderFilterComponent} from "../../layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import React, {useCallback, useContext} from "react";
import PageHeaderFilterContext from "../../layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import {Button, Card, Col, Row} from "react-bootstrap";
import classNames from "classnames";
import {usePageHeaderFilterState} from "../../layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import './RangeSelectorComponent.scss';
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

interface ManualInputProps<T> {
    label?: string;
    value: T | undefined;
    onChange: (value: T | undefined) => void;
}

interface RangeSelectorComponentProps<T> {
    title: string;
    subtitle?: string | undefined;
    variant?: string | undefined;
    toggleVariant?: string;
    toggleIcon?: string | undefined;
    description?: string | undefined;
    ranges?: Range<T>[] | undefined;
    format?: (value: RangeSelected<T> | null) => string;
    disabled?: boolean;
    onSelect?: (ev: RangeSelected<T>) => void;
    input: (props: ManualInputProps<T>) => JSX.Element;
    value?: RangeSelected<T>;
}

export function RangeSelectorComponent<T = number>(props: RangeSelectorComponentProps<T>) {
    const descriptionFormat = props.format || defaultDescriptionFormat(props.description || 'auswählen');

    return (
        <PageHeaderFilterComponent title={props.title} description={descriptionFormat(props.value || null) || props.description || 'Auswählen'}
                                   variant={props.variant || "range-selector"}
                                   toggleVariant={props.toggleVariant}
                                   disabled={props.disabled}
                                   toggleIcon={props.toggleIcon}
        >
            <PeriodSelectorContentComponent<T>
                ranges={props.ranges}
                title={props.subtitle}
                input={props.input}
                onSelect={(ev) => {
                    if (props.onSelect) {
                        props.onSelect({...ev});
                    }
                }}
                value={props.value || (props.ranges && props.ranges[0]) || {}}
            />
        </PageHeaderFilterComponent>
    )
}

function defaultDescriptionFormat<T>(defaultText: string): ((value: RangeSelected<T> | null) => string) {
    return (value) => {
        if (!!value) {
            if (!!value.selected) {
                return value.selected.name;
            }
            if (value.from !== undefined && value.to !== undefined) {
                return `${value.from} - ${value.to}`;
            }
            if (value.from !== undefined) {
                return `> ${value.from}`;
            }
            if (value.to !== undefined) {
                return `< ${value.to}`;
            }
        }
        return defaultText;
    }
}

export interface Range<T> {
    name: string;
    from?: T;
    to?:  T;
}

interface PeriodSelectorContentComponentState<T> {
    selected?: Range<T>;
    from?: T;
    to?: T;
    lastEvent: RangeSelected<T>;
}

export interface RangeSelected<T> {
    selected?: Range<T>;
    from?: T;
    to?: T;
}

interface PeriodSelectorContentProps<T>{
    title?: string | undefined;
    ranges?: Range<T>[] | undefined;
    onSelect?: (ev: RangeSelected<T>) => void | undefined;
    input: (props: ManualInputProps<T>) => JSX.Element;
    value: RangeSelected<T>;
}

function PeriodSelectorContentComponent<T>({input: Input,...props}: PeriodSelectorContentProps<T>) {
    let [state, setState] = usePageHeaderFilterState<PeriodSelectorContentComponentState<T>>({...props.value, lastEvent: {}});
    let context  = useContext(PageHeaderFilterContext);

    let closeDropDown = useCallback(() => {
        if (context && context.close) {
            context.close();
        }
    }, [context]);

    return (
        <Card className="period-selector py-2 border-0 justify-content-center">
            <Card.Body className="px-3 py-2 d-flex justify-content-center">
                <div className="card-body-wrapper">
                    <div className="d-flex flex-wrap">
                        { props.ranges && props.ranges.map((range: Range<T>, index: number) => (
                            <Button
                                onClick={() => {
                                    trigInfonline(guessInfonlineSection(), "search_result")
                                    setState({
                                        ...state,
                                        selected: range,
                                        from: range.from,
                                        to: range.to
                                    })
                                }}
                                key={index} variant={'inline-inverse'}
                                className={classNames('', state.selected && state.selected === range ? "active" : "")}
                            >{ range.name }</Button>
                        ))}
                    </div>
                    <div className="datepicker">
                        <Row>
                            <Col xs={6} className={"p-0 pl-3"}>
                                <Input
                                    label="von"
                                    value={state.from !== undefined ? state.from : undefined}
                                    onChange={value => {setState({...state, selected: undefined, from: value})}}/>
                            </Col>
                            <Col xs={6} className={"p-0 pr-3"}>
                                <Input
                                    label="bis"
                                    value={state.to !== undefined ? state.to : undefined}
                                   onChange={value => {setState({...state, selected: undefined, to: value})}}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
            </Card.Body>
            <div className="d-flex justify-content-between border-top pt-2 pb-2 pb-lg-0 mx-0 mx-lg-3">
                <Button variant={'inline-action'} onClick={() => {
                    let event: RangeSelected<T> = {selected: undefined, from: undefined, to: undefined};
                    if (props.onSelect) {
                        props.onSelect({...event});
                        setState({...state, lastEvent: event});
                    }
                    setState({
                        ...state,
                        selected: undefined,
                        from: undefined,
                        to: undefined,
                        lastEvent: event
                    });
                    closeDropDown();
                }}>Filter zurücksetzen</Button>
                <Button variant={'inline-action'}  onClick={() => {
                    let event: RangeSelected<T> = {selected: state.selected, from: state.from, to: state.to};
                    if (props.onSelect) {
                        props.onSelect({...event});
                        setState({...state, lastEvent: event});
                    }
                    setState({
                        ...state,
                        lastEvent: event
                    });
                    closeDropDown();
                }}>
                    <img className="check_icon mr-1" src={process.env.PUBLIC_URL + "/static/img/svg/icon_check_hook_green.svg"}
                         width="12" alt="Green check icon"/>
                    Anwenden
                </Button>
            </div>
        </Card>
    )
}

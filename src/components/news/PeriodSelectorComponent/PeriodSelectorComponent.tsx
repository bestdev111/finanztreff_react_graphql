import moment from "moment";
import {PageHeaderFilterComponent} from "../../layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import React, {useCallback, useContext, useState} from "react";
import PageHeaderFilterContext from "../../layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import {Button, Card, Col, Row} from "react-bootstrap";
import classNames from "classnames";
import {usePageHeaderFilterState} from "../../layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import {DatePickerInput} from "../../common/DatePickerInput/DatePickerInput";
import './PeriodSelectorComponent.scss';
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

export interface PredefinedPeriod {
    name: string;
    startDate: () => moment.Moment;
    endDate:  () => moment.Moment;
}

const DEFAULT_PERIODS: PredefinedPeriod[] = [
    {
        name: 'Heute',
        startDate: () => {
            return moment().local(true).startOf('date')
        },
        endDate: () => {
            return moment().local(true).endOf('date')
        }
    },
    {
        name: 'Gestern',
        startDate: () => {
            return moment().local(true).subtract(1, 'days').startOf('day')
        },
        endDate: () => {
            return moment().local(true).subtract(1, 'days').endOf('day')
        }
    },
    {
        name: 'vor 3-7 Tagen',
        startDate: () => {
            return moment().local(true).subtract(7, 'days').startOf('day')
        },
        endDate: () => {
            return moment().local(true).subtract(3, 'days').endOf('day')
        }
    },
    {
        name: '6-12 Monate',
        startDate: () => {
            return moment().local().subtract(12, 'months').startOf('day')
        },
        endDate: () => {
            return moment().local().subtract(6, 'months').endOf('day')
        }
    },
];

interface PeriodSelectorContentComponentState {
    predefinedPeriod?: PredefinedPeriod;
    startDate?: moment.Moment;
    endDate?: moment.Moment;
    lastEvent: PeriodSelectEvent;
}

export interface PeriodSelectEvent {
    predefinedPeriod?: PredefinedPeriod;
    startDate?: moment.Moment;
    endDate?: moment.Moment;
}

interface PeriodSelectorContentProps {
    title?: string | undefined;
    periods?: PredefinedPeriod[] | undefined;
    onSelect?: (ev: PeriodSelectEvent) => void | undefined;
}

function PeriodSelectorContentComponent(props: PeriodSelectorContentProps) {
    let [state, setState] = usePageHeaderFilterState<PeriodSelectorContentComponentState>({lastEvent: {}});
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
                        { (props.periods || DEFAULT_PERIODS).map((period: PredefinedPeriod, index: number) => (
                            <Button
                                onClick={() => {
                                    trigInfonline(guessInfonlineSection(), "news_search");
                                    setState({
                                        ...state,
                                        predefinedPeriod: period,
                                        startDate: moment(period.startDate()),
                                        endDate: moment(period.endDate())
                                    })
                                }}
                                key={index} variant={'inline-inverse'}
                                className={classNames('', state.predefinedPeriod && state.predefinedPeriod === period ? "active" : "")}
                            >{ period.name }</Button>
                        ))}
                    </div>
                    <div className="datepicker">
                        <Row>
                            <Col xs={6} className={"p-0 pl-3"}>
                                <DatePickerInput
                                    label='von'
                                    value={state.startDate ? state.startDate : undefined}
                                    onChange={date => {setState({...state, predefinedPeriod: undefined, startDate: moment(date)})}}
                                    format='DD/MM/YYYY'
                                />
                            </Col>
                            <Col xs={6} className={"p-0 pr-3"}>
                                <DatePickerInput
                                    label='bis'
                                    value={state.endDate ? state.endDate : undefined}
                                    onChange={date => {setState({...state, predefinedPeriod: undefined, endDate: moment(date)})}}
                                    format='DD/MM/YYYY'
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
            </Card.Body>
            <div className="d-flex justify-content-between border-top pt-2 pb-2 pb-lg-0 mx-0 mx-lg-3">
                <Button variant={'inline-action'} onClick={() => {
                    let event: PeriodSelectEvent = {predefinedPeriod: undefined, startDate: undefined, endDate: undefined};
                    if (props.onSelect) {
                        props.onSelect(Object.assign({}, event));
                        setState({...state, lastEvent: event});
                    }
                    setState({
                        ...state,
                        predefinedPeriod: undefined,
                        startDate: undefined,
                        endDate: undefined,
                        lastEvent: event
                    });
                    closeDropDown();
                }}>Filter zurücksetzen</Button>
                <Button variant={'inline-action'}  onClick={() => {
                    let event: PeriodSelectEvent = {predefinedPeriod: state.predefinedPeriod, startDate: state.startDate, endDate: state.endDate};
                    if (props.onSelect) {
                        props.onSelect(Object.assign({}, event));
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

interface PeriodSelectorComponentState {
    description?: string;
}

function calculationPeriodDescription(defaultText: string, period?: PredefinedPeriod, startDate?: moment.Moment, endDate?: moment.Moment) {
    if (!period && !startDate && !endDate) {
        return defaultText || 'Zeitraum auswählen';
    }
    return period ? period.name :
        (startDate ? startDate.format("DD/MM/YYYY") : '')
        + (endDate && endDate ? ' - ' : '')
        + (endDate ? endDate.format("DD/MM/YYYY") : '');
}

interface PeriodSelectorComponentProps {
    title?: string | undefined;
    subtitle?: string | undefined;
    variant?: string | undefined;
    toggleVariant?: string;
    toggleIcon?: string | undefined;
    description?: string | undefined;
    periods?: PredefinedPeriod[] | undefined;
    onSelect?: (ev: PeriodSelectEvent) => void;
}

export function PeriodSelectorComponent(props: PeriodSelectorComponentProps) {
    let [state, setState] = useState<PeriodSelectorComponentState>({})
    return (
        <PageHeaderFilterComponent title={props.title || "Zeitraum"} description={state?.description || props.description || 'Zeitraum auswählen'}
                                   variant={props.variant || "period-selector"}
                                   toggleVariant={props.toggleVariant}
                                   toggleIcon={props.toggleIcon}
        >
            <PeriodSelectorContentComponent
                periods={props.periods}
                title={props.subtitle}
                onSelect={(ev) => {
                    trigInfonline(guessInfonlineSection(), "news_search");
                setState({ description: calculationPeriodDescription(props.description || 'Zeitraum auswählen', ev.predefinedPeriod, ev.startDate, ev.endDate) });
                if (props.onSelect) {
                    props.onSelect(ev);
                }
            }}/>
        </PageHeaderFilterComponent>
    );
}

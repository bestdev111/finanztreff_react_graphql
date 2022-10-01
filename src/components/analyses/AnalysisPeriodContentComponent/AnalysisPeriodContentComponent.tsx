import moment from "moment";
import {PageHeaderFilterComponent} from "../../layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import React, {ReactNode, useCallback, useContext, useState} from "react";
import PageHeaderFilterContext from "../../layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import {Button, Card, Form} from "react-bootstrap";
import classNames from "classnames";
import {DatePickerInput} from "../../common/DatePickerInput/DatePickerInput";
import {usePageHeaderFilterState} from "../../layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";

interface AnalysisPeriodContentComponentState {
    type?: 'from' | 'to';
    fromPredefinedPeriod?: AnalysePeriod;
    toPredefinedPeriod?: AnalysePeriod;
    from?: moment.Moment;
    to?: moment.Moment;
}

interface AnalysePeriod {
    name: string;
    from: () => moment.Moment | null;
    to: () => moment.Moment | null;
}

export interface AnalysePeriodSelectEvent {
    type?: 'from' | 'to';
    date?: moment.Moment;
}


const FROM_PERIODS: AnalysePeriod[] = [
    {name: 'Heute', from: () => moment().startOf('day'), to: () => moment().endOf('day')},
    {name: 'vor 1 Woche', from: () => moment().subtract(1, 'week').startOf('day'), to: () => moment().endOf('day')},
    {name: 'vor 1 Monat', from: () => moment().subtract(1, 'month').startOf('day'), to: () => moment().endOf('day')},
    {name: 'vor 3 Monate', from: () => moment().subtract(3, 'month').startOf('day'), to: () => moment().endOf('day')},
    {name: 'vor 6 Monate', from: () => moment().subtract(6, 'month').startOf('day'), to: () => moment().endOf('day')},
    {name: 'vor 12 Monate', from: () => moment().subtract(12, 'month').startOf('day'), to: () => moment().endOf('day')},
];


const TO_PERIODS: AnalysePeriod[] = [
    {name: 'Heute', from: () => moment().endOf('day'), to: () => moment().endOf('day')},
    {name: 'in 1 Woche', from: () => moment().endOf('day'), to: () => moment().add(1, 'week').endOf('day')},
    {name: 'in 1 Monat', from: () => moment().endOf('day'), to: () => moment().add(1, 'month').endOf('day')},
    {name: 'in 3 Monate', from: () => moment().endOf('day'), to: () => moment().add(3, 'month').endOf('day')},
    {name: 'in 6 Monate', from: () => moment().endOf('day'), to: () => moment().add(6, 'month').endOf('day')},
    {name: 'in 12 Monate', from: () => moment().endOf('day'), to: () => moment().add(12, 'month').endOf('day')}
];

interface AnalysisPeriodContentComponentProps {
    onSelect?: (ev: AnalysePeriodSelectEvent) => void;
}

function calculateDateDifference(point: moment.Moment): string {
    let days = moment(point).diff(moment(), 'day');
    if (days === 1) {
        return "1 Tag";
    }
    return days + " Tagen";
}

function AnalysisPeriodContentComponent(props: AnalysisPeriodContentComponentProps) {
    let [state, setState] = usePageHeaderFilterState<AnalysisPeriodContentComponentState>({type: 'from'});
    let context  = useContext(PageHeaderFilterContext);

    let closeDropDown = useCallback(() => {
        if (context && context.close) {
            context.close();
        }
    }, [context]);

    return (
        <Card className={"border-0 analysis-period-content"}>
            <Card.Body className="d-flex justify-content-center">
                <div className="card-body-wrapper">
                    <Form.Group className="m-0 p-0 font-weight-bold">
                        <Form.Check name="type" label="Ab wann?" type="radio" className="mr-3" inline
                                    onClick={() => setState({...state, type: 'from'})}
                                    checked={state.type === 'from'} onChange={() => setState({...state, type: 'from'})}/>
                        <Form.Check name="type" label="Bis wann?" type="radio" inline
                                    onClick={() => setState({...state, type: 'to'})}
                                    checked={state.type === 'to'} onChange={() => setState({...state, type: 'to'})}/>
                    </Form.Group>
                    <hr className="my-2"/>
                    <div className="period-section pt-2">
                        {state.type === 'from' &&
                        <div className="w-100">
                            <b>Wann wurde die Analyse erstellt?</b>
                            <div className="d-flex flex-wrap">
                                {FROM_PERIODS.map((period: AnalysePeriod, index: number) => (
                                    <Button
                                        onClick={() => {
                                            setState({
                                                ...state,
                                                fromPredefinedPeriod: period,
                                                from: moment(period.from()),
                                                to: moment(period.to())
                                            })
                                        }}
                                        key={index} variant={'inline-inverse'}
                                        className={classNames('mr-1', state?.fromPredefinedPeriod && state?.fromPredefinedPeriod === period ? "active" : "")}
                                    >{period.name}</Button>
                                ))}
                            </div>
                        </div>
                        }
                        {state.type === 'to' &&
                        <div className="w-100">
                            <b>Wann läuft die Analyse aus?</b>
                            <div className="d-flex flex-wrap">
                                {
                                    TO_PERIODS.map((period: AnalysePeriod, index: number) =>
                                        <Button
                                            onClick={() => {
                                                setState({
                                                    ...state,
                                                    toPredefinedPeriod: period,
                                                    from: moment(period.from()),
                                                    to: moment(period.to())
                                                })
                                            }}
                                            key={index} variant={'inline-inverse'}
                                            className={
                                                classNames('mr-1', state?.toPredefinedPeriod && state?.toPredefinedPeriod === period ? "active" : "")
                                            }
                                        >{period.name}</Button>
                                    )
                                }
                            </div>
                        </div>
                        }
                    </div>
                    <hr className="my-2"/>
                    <div className="d-flex flex-nowrap">
                        <DatePickerInput
                            label="Eigens Datum"
                            format="DD/MM/YYYY"
                            onChange={value => {
                                if (state.type === 'from') {
                                    setState({...state, from: value, fromPredefinedPeriod: undefined});
                                } else {
                                    setState({...state, to: value, toPredefinedPeriod: undefined});
                                }
                            }}
                            minDate={state.type === 'to' ? moment() : undefined}
                            value={state.type === 'from' ? state.from : state.to}
                        />
                    </div>
                </div>
            </Card.Body>
            <Card.Footer className={"bg-transparent b"}>
                {state.type === 'to' && state.to &&
                <div className={"note"}>
                    Analysen, die in <b>{calculateDateDifference(state.to)}</b> auslaufen
                </div>
                }
                <div className="d-flex justify-content-between py-2 pb-lg-0 mx-0">
                    <Button variant={'inline-action'} onClick={() => {
                        if (props.onSelect) {
                            props.onSelect({});
                        }
                        setState({
                            ...state,
                            type: 'from',
                            fromPredefinedPeriod: undefined,
                            toPredefinedPeriod: undefined,
                            from: undefined,
                            to: undefined
                        });
                        closeDropDown();
                    }}>Filter zurücksetzen</Button>
                    <Button variant={'inline-action'}
                            onClick={() => {
                                if (props.onSelect) {
                                    if (!state.type) {
                                        props.onSelect({});
                                    }
                                    if (state.type === 'from') {
                                        props.onSelect({type: "from", date: state.from});
                                    }
                                    if (state.type === 'to') {
                                        props.onSelect({type: "to", date: state.to});
                                    }
                                }
                                closeDropDown();
                            }}
                    >
                        <img className="check_icon mr-1" src={process.env.PUBLIC_URL + "/static/img/svg/icon_check_hook_green.svg"}
                             width="12" alt="Green check icon"/>
                        Anwenden
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    );
}

interface AnalysisPeriodComponentState {
    description: ReactNode | string;
}

interface AnalysisPeriodComponentProps {
    onSelect?: (ev: AnalysePeriodSelectEvent) => void;
}

export function AnalysisPeriodComponent(props: AnalysisPeriodComponentProps) {
    let [state, setState] = useState<AnalysisPeriodComponentState>({description: ''});

    return (
        <PageHeaderFilterComponent title={"Zeitraum"} description={state.description}>
            <AnalysisPeriodContentComponent
                onSelect={(ev: AnalysePeriodSelectEvent) => {
                    if (props.onSelect) {
                        props.onSelect(ev);
                    }
                    if (!ev.type || !ev.date) {
                        setState({description: ''});
                    } else {
                        switch(ev.type) {
                            case 'from':
                                setState({description: (<>ab {ev.date.format('DD.MM.YYYY')}</>)});
                                break;
                            case 'to':
                                setState({description: (<>Läuft in <b>{calculateDateDifference(ev.date)}</b> aus</>)});
                                break;
                        }
                    }
                }}
            />
        </PageHeaderFilterComponent>
    );
}


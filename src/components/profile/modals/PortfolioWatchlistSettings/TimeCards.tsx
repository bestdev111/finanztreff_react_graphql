import classNames from "classnames";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { useContext, useCallback } from "react";
import { Card, Button } from "react-bootstrap";

export function CardMinutes(props: CardMinutesProps) {
    let context = useContext(PageHeaderFilterContext);

    let closeAction = useCallback(() => {
        if (context && context.close) {
            context.close();
        }
    }, [context]);

    return (
        <Card className={classNames("mr-auto ml-auto borderless shadow-none align-items-center")}>
            <Card.Body className="d-flex justify-content-center p-0" style={{ width: "170px" }}>
                <div className="button-container align-self-center">
                    {
                        Array.from({ length: 12 }).map((_, index) =>
                            <Button variant={'inline-inverse'} onClick={() => {
                                props.handleMinutes(index * 5);
                                closeAction()
                            }} className={classNames("btn m-1 p-1 px-2 f", props.minutes === index * 5 && "active")}>
                                {formatTime(index * 5)}
                            </Button>
                        )
                    }
                </div>
            </Card.Body>
        </Card>
    )
}

interface CardMinutesProps {
    handleMinutes: (value: number) => void;
    minutes: number;
}

export function CardHours(props: CardHoursProps) {
    let context = useContext(PageHeaderFilterContext);

    let closeAction = useCallback(() => {
        if (context && context.close) {
            context.close();
        }
    }, [context]);

    return (
        <Card className={classNames("mr-auto ml-auto borderless shadow-none align-items-center")}>
            <Card.Body className="d-flex justify-content-center p-0" style={{ width: "252px" }}>
                <div className="button-container align-self-center">
                    {
                        Array.from({ length: 24 }).map((_, index) =>
                            <Button variant={'inline-inverse'} onClick={() => {
                                props.handleHours(index);
                                closeAction();
                            }} className={classNames("btn m-1 p-1 px-2", props.hours === index && "active")}>
                                {formatTime(index)}
                            </Button>
                        )
                    }
                </div>
            </Card.Body>
        </Card>
    )
}

interface CardHoursProps {
    handleHours: (value: number) => void;
    hours: number;
}

function formatTime(value: number) {
    return value > 9 ? value.toString() : ("0" + value);
}
import classNames from "classnames";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { useCallback, useContext, useState } from "react";
import { Button, Card } from "react-bootstrap";

export function BoundaryDropdownContent({ onSelect, selected }: BoundaryDropdownProps) {
    let context = useContext(PageHeaderFilterContext);

    let closeAction = useCallback(() => {
        if (context) {
            context.close();
        }
    }, [context]);
    return (
        <Card className={classNames("mr-auto ml-auto borderless shadow-none align-items-center card-percent-menu")}>
            <Card.Body className="d-flex justify-content-center p-1">
                <div className="align-self-center">
                    {
                        OPTIONS.map(percent =>
                            <Button variant={'inline-inverse'} onClick={() => {
                                onSelect(percent);
                                closeAction();
                            }} className={classNames("btn m-1 p-0 button-in-menu text-nowrap", selected === percent && "active")}>
                                {percent}%
                            </Button>
                        )
                    }
                </div>
            </Card.Body>
        </Card>
    );
}

interface BoundaryDropdownProps {
    onSelect: (value: number) => void;
    selected: number;
}

export function BoundaryDropdown(props: BoundaryDropdownProps) {
    let [state, setState] = useState<number>(props.selected);

    return (
        <PageHeaderFilterComponent
            variant={"inline-inverse"}
            toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_dark.svg"}
            title={
                <>
                    <span className="d-none d-in-card">
                        Portfolio-Alert, <br />Grenze festlegen
                    </span>
                    <span className="percent">
                        {state}%
                    </span>
                </>
            }
            toggleVariant={"inline-blue-dropdown"}>
            <BoundaryDropdownContent
                onSelect={(value: number) => {
                    if (props.onSelect) {
                        props.onSelect(value);
                    }
                    setState(value);
                }}
                selected={state}
            />
        </PageHeaderFilterComponent>
    );
}

const OPTIONS: number[] = [2, 4, 6, 8, 10, 15, 20, 25];
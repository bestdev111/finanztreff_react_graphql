import classNames from "classnames";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { useContext, useCallback } from "react";
import { Card, Button } from "react-bootstrap";


export function PeriodDropdownContent({ activeId, options, onSelect }: FilterProps) {
    let context = useContext(PageHeaderFilterContext);

    let closeAction = useCallback(() => {
        if (context) {
            context.close();
        }
    }, [context]);

    return (
        <Card className={classNames(" border-0")}>
            <Card.Body className="px-0">
                <div className="d-flex flex-wrap button-container">
                    {
                        options.map(current =>
                            <Button key={current.id}
                                variant={'inline-inverse text-truncate'}
                                onClick={() => {
                                    if (onSelect) {
                                        onSelect(current.id);
                                    }
                                    closeAction();
                                }}
                                className={classNames("m-1", activeId === current.id && "active")}
                            >
                                {current.name}
                            </Button>
                        )
                    }
                </div>
            </Card.Body>
        </Card>
    );
}

interface FilterProps {
    activeId: number;
    onSelect: (e: number) => void;
    options: { name: string, id: number }[];
}

export function PeriodDropdown(props: FilterProps) {

    const currentActive =
        (props.activeId && props.options.find(current => current.id === props.activeId)) || props.options[0];

    return (
        <PageHeaderFilterComponent title={currentActive.name}
            variant={"dropdown-plane-text white"}
            toggleVariant={"dropdown-plane-text white"}
            toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_white.svg"}
            className="text-white">
            <PeriodDropdownContent
                onSelect={(ev: number) => {
                    if (props.onSelect) {
                        props.onSelect(ev);
                    }
                }}
                activeId={props.activeId}
                options={props.options}
            />
        </PageHeaderFilterComponent>
    );
}

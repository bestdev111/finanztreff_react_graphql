import classNames from "classnames";
import SvgImage from "components/common/image/SvgImage";
import { usePageHeaderFilterState } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterBaseComponent";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import React, { useCallback, useContext, useState } from "react";
import { Button, Card } from "react-bootstrap";

interface DropdownInButtonContentProps {
    options: string[];
    onSelect: (e: any) => void;
    selected: string;
    className?: string;
}

interface DropdownInButtonContentState {
    selected: string;
}

export function DropdownInButtonContent({ options, onSelect, selected, className }: DropdownInButtonContentProps) {
    let [state, setState] = usePageHeaderFilterState<DropdownInButtonContentState>({ selected: selected });
    let context = useContext(PageHeaderFilterContext);

    let closeAction = useCallback(() => {
        if (context) {
            context.close();
        }
    }, [context]);
    return (
        <Card className={classNames("mr-auto ml-auto borderless shadow-none filter-commodity", className)}>
            <Card.Header className="bg-white pb-0 pt-1 px-0 d-flex justify-content-end">
                <SvgImage icon="icon_close_blue.svg" spanClass="close-modal-butt" width={"27"}/>
            </Card.Header>
            <Card.Body className="d-flex justify-content-center px-0">
                <div className="button-container align-self-center">
                    {
                        options.map(current =>
                            <Button variant={'inline-inverse'} onClick={() => {
                                setState({ ...state, selected: current })
                                if (onSelect) {
                                    onSelect(current);
                                }
                                closeAction();
                            }} className={state.selected === current ? "btn active m-1" : "btn m-1"}>
                                {current}
                            </Button>
                        )
                    }
                </div>
            </Card.Body>
        </Card>
    );
}

interface DropdownInButtonProps {
    onSelect: (e: any) => void;
    selected: string;
    options: string[];
    className?: string;
}

export function DropdownInButton(props: DropdownInButtonProps) {
    let [state, setState] = useState({ description: props.selected });

    return (
        <PageHeaderFilterComponent
            variant={""}
            toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_dark.svg"}
            title={state.description}
            toggleVariant={"inline-blue-dropdown"}>
            <DropdownInButtonContent
                onSelect={(ev: any) => {
                    if (props.onSelect) {
                        props.onSelect(ev);
                    }
                    setState({ description: ev });
                }}
                selected={state.description}
                options={props.options}
                className={props.className}
            />
        </PageHeaderFilterComponent>
    );
}
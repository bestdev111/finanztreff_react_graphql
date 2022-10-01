import {PageHeaderFilterComponent} from "../../PageHeaderFilterComponent/PageHeaderFilterComponent";
import {Button, Card} from "react-bootstrap";
import classNames from "classnames";
import {ReactNode, useCallback, useContext, useState} from "react";
import PageHeaderFilterContext from "../../PageHeaderFilterComponent/PageHeaderFilterContext";

export interface FilterOptionSelectorButtonProps<T> {
    name?: string;
    option: Option<T> | null;
    selected: boolean;
    onSelect?: (value: Option<T> | null) => void;
    prefix?: ReactNode;
    suffix?: ReactNode;
}

export function FilterOptionSelectorButton<T>({name, selected, option, onSelect, prefix, suffix}: FilterOptionSelectorButtonProps<T>) {
    return (
        <Button onClick={() => onSelect && onSelect(option)} variant={'inline-contrast'}
                className={classNames('mr-1', selected ? "active" : undefined)}
        >{prefix} {name || !option?.name ? name : option.name} {suffix}</Button>
    )
}

interface MultiSectionFilterOptionSelectorComponentBodyProps<T> {
    name: string;
    options: {[key: string]: Option<T>[]};
    onSelect?: (value: {value: Option<T> | null, section: string} ) => void;
    buttonComponent?: (props: FilterOptionSelectorButtonProps<T>) => JSX.Element;
    selected?: Option<T> | null;
    hideTitles?: boolean;
    hideAllButton?: boolean;
}

function MultiSectionFilterOptionSelectorComponentBody<T>({options, selected, onSelect, buttonComponent, ...props}: MultiSectionFilterOptionSelectorComponentBodyProps<T>) {
    const ButtonComponent = buttonComponent ? buttonComponent : FilterOptionSelectorButton;
    let context = useContext(PageHeaderFilterContext);
    let closeDropDown = useCallback(() => {
        if (context && context.close) {
            context.close();
        }
    }, [context]);

    const updateSelected = (value: Option<T> | null, section: string = "default") => {
        if (onSelect) {
            onSelect({value, section});
        }
        closeDropDown();
    }

    return (
        <Card className={"border-0 institute-selector"}>
            <Card.Body className="border-0 p-0 d-flex justify-content-center">
                <div className="card-body-wrapper overflow-auto m-2">
                    {!props.hideAllButton &&
                        <ButtonComponent
                            name={"Alle"}
                            option={null}
                            selected={!selected}
                            onSelect={() => updateSelected(null)}
                        />
                    }
                    <div className="d-flex flex-wrap fund-banner-search">
                    {Object.keys(options).map(key =>
                        <>
                            {!props.hideTitles  && <h3 className={"font-weight-bold font-size-22px w-100"}>{key}</h3>}
                            {
                                (options as any)[key].map((option: Option<T>, index: number) =>
                                    <ButtonComponent
                                        key={index}
                                        option={option}
                                        selected={selected && option.id === selected.id || false}
                                        onSelect={() => updateSelected(option, key)}
                                    />
                                )
                            }
                        </>
                    )}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

interface MultiSectionFilterOptionSelectorComponentProps<T> {
    name: string;
    options: {[key: string]: Option<T>[]};
    onSelect?: (value: {value: Option<T> | null, section: string}) => void;
    buttonComponent?: (props: FilterOptionSelectorButtonProps<T>) => JSX.Element;
    selected?: string | null;
    selectedSection?: string;
    hideTitles?: boolean;
    hideAllButton?: boolean;
    hasDescription?: boolean;
    disabled?: boolean;
}

function getSelectedSection<T>(options: {[key:string]: Option<T>[]}, selectedSection: string | null): Option<T>[]{
    if (!selectedSection) {
        return Object.entries(options)
            .reduce((prev, [, value]) => {return [...prev, ...value]}, [] as Option<T>[]);
    }
    if (options.hasOwnProperty(selectedSection)) {
        return options[selectedSection];
    }
    return [];
}

export function MultiSectionFilterOptionSelectorComponent<T = void>({hasDescription, onSelect, selectedSection, selected, disabled,...props}: MultiSectionFilterOptionSelectorComponentProps<T>) {
    let [item, setItem] = useState<{option: Option<T> | null, section: string}>({option: null, section: "default"});

    let selectedOption = item.option;
    if (selected !== undefined) {
        selectedOption = getSelectedSection(props.options, selectedSection || null).find(current => current.id == selected) || null;
    }

    return (
        <PageHeaderFilterComponent title={hasDescription ? props.name : (selectedOption?.name || props.name)} description={hasDescription ? selectedOption?.name : undefined}  disabled={disabled}>
            <MultiSectionFilterOptionSelectorComponentBody
                {...props}
                onSelect={({value, section}) => {
                    setItem({option: value, section: section});
                    onSelect && onSelect({value, section});
                }}
                selected={selectedOption}
            />
        </PageHeaderFilterComponent>
    );
}

export interface Option<T> {
    id: string;
    name: string | ReactNode;
    value?: T;
}

export type SimpleOption = Option<void>;

export type NumberOption = Option<number>;


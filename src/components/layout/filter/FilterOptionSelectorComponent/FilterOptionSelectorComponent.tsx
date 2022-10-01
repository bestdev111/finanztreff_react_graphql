import {
    MultiSectionFilterOptionSelectorComponent, FilterOptionSelectorButtonProps, Option
} from "./MultiSectionFilterOptionSelectorComponent";


interface FilterOptionSelectorComponentProps<T> {
    name: string;
    options: Option<T>[];
    onSelect?: (value: Option<T> | null) => void;
    buttonComponent?: (props: FilterOptionSelectorButtonProps<T>) => JSX.Element;
    selected?: string | null;
}

const DEFAULT_SECTION_NAME: string = "default";

export function FilterOptionSelectorComponent<T = void>({options, onSelect, ...props}: FilterOptionSelectorComponentProps<T>) {
    return (
        <MultiSectionFilterOptionSelectorComponent<T>
            {...props}
            onSelect={({value, section}) => {
                onSelect && onSelect(value);
            }}
            options={{"default": options}}
            selectedSection={DEFAULT_SECTION_NAME}
            hideTitles={true}
        />
    )
}

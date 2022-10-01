import classNames from "classnames";
import { PageHeaderFilterComponent } from "components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent";
import PageHeaderFilterContext from "components/layout/PageHeaderFilterComponent/PageHeaderFilterContext";
import { useCallback, useContext, useState } from "react";
import { Button, Card, FormControl } from "react-bootstrap";
import { debounce } from "underscore";
import './IndexSelectorComponent.scss';
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

interface IndexSelectorComponentContentProps<T extends Option> {
    className?: string;
    title: string | null;
    onSelect?: (type: OptionSelectEvent<T>) => void;
    options: T[];
    selected: string | null;
}

interface OptionSelectEvent<T> {
    selected: T | null;
}

interface IndexOptionItem<T> {
    option: T | null;
    name: string;
    letter: string;
}

function IndexSelectorComponentContent<T extends Option>({ className, title, onSelect, selected, ...props }: IndexSelectorComponentContentProps<T>) {
    let context = useContext(PageHeaderFilterContext);
    let [selectedLetter, setLetter] = useState<string | null>(null);
    let [searchString, setSearchString] = useState<string | null>(null);

    let closeAction = useCallback(() => {
        if (context) {
            context.close();
        }
    }, [context]);

    let options: IndexOptionItem<T>[] = [
        ...((!searchString && [{option: null, name: "Alle", letter: "A"}]) || []),
        ...([...props.options]
            .filter(current => !!current.id )
            .map(current => ({...current, nameUppercase: current.name.toUpperCase()}))
            .sort(function (a, b) {
                if (!a.nameUppercase || !b.nameUppercase)
                    return 0;
                if (a.nameUppercase < b.nameUppercase) { return -1; }
                if (a.nameUppercase > b.nameUppercase) { return 1; }
                return 0;
            }))
            .filter(current => !searchString || current.nameUppercase.includes(searchString))
            .map(current => ({
                option: current, name: current.name,
                letter: ((letter) => ALPHABET.find(current => current.letters.indexOf(letter) >= 0)?.id || "digits")(current.name.toUpperCase()[0])
            }))
    ];

    const letterMap = options.reduce((map, current) => {
        let value = map.get(current.letter) || 0;
        map.set(current.letter, value + 1);
        return map;
    }, new Map<string, number>())

    return (
        <Card className={classNames(className, "options-filter px-3 pt-1 border-0")}>
            {title &&
                <Card.Header
                    className="bg-white pb-0 pt-1 px-0 d-flex justify-content-between d-none d-xl-flex d-sm-none d-md-none d-lg-none">
                    <h6 className="font-weight-bold pt-2">{title}</h6>
                    <span className="close-modal-butt svg-icon mt-1 mr-n1 cursor-pointer" onClick={() => closeAction()}>
                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark.svg"} alt=""
                             className="svg-convert svg-blue"/>
                    </span>
                </Card.Header>
            }
            <div className="pt-2 pl-1">
                <FormControl autoFocus
                             className="input-filter mb-2 d-inline-block d-md-none"
                             placeholder="Ergebnisse"
                             onChange={debounce((e:any) => setSearchString((!!e.target.value && e.target.value.toUpperCase()) || null), 500)} />
                <div className="d-flex text-center justify-content-xl-start px-0">
                    <div className="d-flex flex-column justify-content-start alphabet-index mr-2 mb-2">
                        {
                            ALPHABET.map((letter, index) => (
                                    <Button key={index} variant={'inline-inverse btn-index-letter p-0 px-1 m-0'} href={"#letter-anchor-" + (Array.isArray(letter.id) ? letter.id[0] : letter.id)}
                                            disabled={!letterMap.get(letter.id)}
                                            className={classNames(selectedLetter === letter.name && "active")}
                                            onClick={() => selectedLetter === letter.id ? setLetter(null) : setLetter(Array.isArray(letter) ? letter[0] : letter)}
                                    >
                                        {letter.name}
                                    </Button>
                                )
                            )
                        }
                    </div >
                    <div className="d-flex flex-wrap button-container" >
                        <FormControl autoFocus
                                     className="input-filter mb-2 mx-auto d-none d-md-inline-block"
                                     placeholder="Ergebnisse"
                                     onChange={debounce((e:any) => setSearchString((!!e.target.value && e.target.value.toUpperCase()) || null), 500)} />
                        <div className="index-items-wrapper flex-grow-1">
                            {
                                options.map((current, index, arr) =>
                                    current && current.name &&
                                    <>
                                        <Button key={index} variant={'inline-action'}
                                                id={(index > 0 && arr[index-1].letter !== current.letter && "letter-anchor-" + current.letter) || undefined}
                                                onClick={() => {
                                            if (onSelect) {
                                                onSelect({ selected: current.option });
                                            }
                                            closeAction();
                                        }} className={
                                            classNames(
                                                "border-top text-left w-100 font-weight-bold text-dark text-truncate ml-n2 py-2",
                                                (!selected && !current.option) || selected === current.option?.id ? 'text-blue' : ''
                                            )
                                        }>
                                            {current.name}
                                        </Button>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

interface IndexSelectorComponentProps<T extends Option> {
    title: string;
    subtitle?: string;
    variant?: string | undefined;
    toggleVariant?: string;
    toggleIcon?: string | undefined;
    onSelect: (e: OptionSelectEvent<T>) => void;
    description?: string;
    optionId?: number;
    options: T[];
    disabled?: boolean;
    selected?: string | null;
}


export interface Option {
    id: string;
    name: string;
}

export function IndexSelectorComponent<T extends Option = Option>({options, selected, ...props}: IndexSelectorComponentProps<T>) {
    let description = options.find(current => current.id === selected)?.name || props.description || undefined;
    return (
        <PageHeaderFilterComponent title={!!props.description ? props.title : (description || props.title)}
                                   description={!!props.description ? description : props.description}
                                   variant={props.variant}
                                   toggleVariant={props.toggleVariant}
                                   disabled={props.disabled}
                                   toggleIcon={props.toggleIcon}>
            <IndexSelectorComponentContent<T>
                title={props.subtitle || null}
                selected={selected || null}
                onSelect={(ev: OptionSelectEvent<T>) => {
                    trigInfonline(guessInfonlineSection(), "search_result")
                    if (props.onSelect) {
                        props.onSelect(ev);
                    }
                }}
                options={
                    options.sort(function (a, b) {
                        if (!a.name || !b.name)
                            return 0;
                        if (a.name < b.name) { return -1; }
                        if (a.name > b.name) { return 1; }
                        return 0;
                    })
            }
            />
        </PageHeaderFilterComponent>
    );
}

const ALPHABET: {id: string, letters: string[], name: string }[] = [
    { id: "digits", letters: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], name: "0-9"},
    { id: "A", letters: ["A"], name: "A" },
    { id: "B", letters: ["B"], name: "B" },
    { id: "C", letters: ["C"], name: "C" },
    { id: "D",  letters:["D"], name: "D" },
    { id: "E",  letters: ["E"], name: "E" },
    { id: "F",  letters: ["F"], name: "F" },
    { id: "G",  letters: ["G"], name: "G" },
    { id: "H",  letters: ["H"], name: "H" },
    { id: "I",  letters: ["I"], name: "I" },
    { id: "J",  letters: ["J"], name: "J" },
    { id: "K",  letters: ["K"], name: "K" },
    { id: "L",  letters: ["L"], name: "L" },
    { id: "M",  letters: ["M"], name: "M" },
    { id: "N",  letters: ["N"], name: "N" },
    { id: "O",  letters: ["O"], name: "O" },
    { id: "P",  letters: ["P"], name: "P" },
    { id: "Q",  letters: ["Q"], name: "Q" },
    { id: "R",  letters: ["R"], name: "R" },
    { id: "S",  letters: ["S"], name: "S" },
    { id: "T",  letters: ["T"], name: "T" },
    { id: "U", letters: ["U"], name: "U" },
    { id: "V", letters: ["V"], name: "V" },
    { id: "W", letters: ["W"], name: "W" },
    { id: "X", letters: ["X"], name: "X" },
    { id: "Y", letters: ["Y"], name: "Y" },
    { id: "Z", letters: ["Z"], name: "Z" },
    { id: "a-umlaut", letters: ["Ä"], name: "Ä" },
    { id: "o-umalut", letters: ["Ö"], name: "Ö" },
    { id: "u-umlaut", letters: ["Ü"], name: "Ü" },
]

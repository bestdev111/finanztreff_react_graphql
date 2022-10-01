import {Button, FormControl, InputGroup} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {NewsTopic} from "../../../../generated/graphql";
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

interface TextFilterComponentProps {
    icon?: string;
    title?: string;
    onSelect: (event: any) => void;
    label: string | undefined
    searchTopic: NewsTopic | undefined
}

export function TextFilterComponent(props: TextFilterComponentProps) {

const [searchString, setSearchString] =  useState<string | undefined>('');

    function showSearchString(){
        if(searchString){
            return searchString;
        }
        else{
            return '';
        }
    }

    function handleSearch(){
        if (props.label !== "") {
            props.onSelect({text: props.label})
        } else{
            props.onSelect({text: searchString})
        }
    }

    useEffect(() => {
        handleSearch()
    }, [props.label])

    useEffect(() => {
        setSearchString(props.label)
    }, [props.label])

    function handleNewsSearch () {
        trigInfonline(guessInfonlineSection(), "news_search");
        handleSearch()
        props.onSelect({text: searchString})
    }

    return (
        <InputGroup>
            <FormControl type="text"
                         className="news-main-search"
                         placeholder={props.title}
                         autoComplete="off"
                         value={showSearchString()}
                         onKeyPress={(e: any) => {
                             if (e.key === "Enter") {
                                 handleNewsSearch()
                             }
                         }}
                         onChange={(e: any) => {
                             setSearchString(e?.target?.value);
                             trigInfonline(guessInfonlineSection(), "news_search");
                         }}
            />
            <InputGroup.Append>
                <Button variant={'inline'} onClick={handleNewsSearch} className="svg-icon news-search-icon">
                    <img
                        src={props.icon ? props.icon : process.env.PUBLIC_URL + "/static/img/svg/icon_search_dark.svg"}
                        width="33"
                        alt="search news icon"/>
                </Button>
            </InputGroup.Append>
        </InputGroup>
    );
}

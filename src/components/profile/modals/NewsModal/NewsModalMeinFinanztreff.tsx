import {ReactNode, useEffect, useState} from 'react';
import './NewsModal.scss';
import { NewsModalContent } from './NewsModalContent';
import { NewsButtonIcon } from './NewsButtonIcon';
import classNames from 'classnames';
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

export function NewsModalMeinFinanztreff(props: NewsModalProps) {
    const [isOpen, setOpen] = useState(false);
    useEffect(() => {
        if (isOpen) {
            trigInfonline(guessInfonlineSection(), "news_modal_mf");
        }
    }, [isOpen])

    return (
        <>
            {props.title ?
                <div className={classNames("news", !props.disabled && "cursor-pointer")} onClick={() => !props.disabled && setOpen(true)}>
                    {props.title}
                </div>
                :
                <NewsButtonIcon isins={props.isins} className={props.className} isOpen={isOpen} handleOpen={() => setOpen(true)} iconWidth={props.iconWidth} />
            }
            {isOpen &&
                <NewsModalContent isOpen={isOpen} close={() => setOpen(false)} isins={props.isins} daily={props.daily} />
            }
        </>
    );
}

interface NewsModalProps {
    isins: string[];
    iconWidth?: number;
    title?: string | ReactNode;
    daily?: boolean;
    className?: string;
    disabled?: boolean;
}

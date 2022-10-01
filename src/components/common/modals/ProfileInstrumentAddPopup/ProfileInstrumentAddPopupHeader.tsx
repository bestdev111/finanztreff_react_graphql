import { useDropdownToggle } from "react-overlays";
import SvgImage from "../../image/SvgImage";

export const ProfileInstrumentAddPopupHeader = (props: ProfileInstrumentAddPopupHeaderProps) => {
    const [, { toggle }] = useDropdownToggle();
    return (
        <div className="title">
            <h4>Hinzufügen zu {props.title}</h4>
            <button className="btn" aria-label="Close" onClick={(isClicked) => toggle(false, isClicked)}>
                <SvgImage spanClass="mt-n1" width={"27"} icon="icon_close_blue.svg"/>
            </button>
        </div>
    );
}

export interface ProfileInstrumentAddPopupHeaderProps {
    title: string
}
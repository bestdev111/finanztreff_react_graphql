import { useState } from "react";
import { Collapse, Container } from "react-bootstrap";
import SvgImage from "../../common/image/SvgImage";
import DerivativeTag from "./DerivativeTag";
import './inputStyle.scss'

interface DerivativeSearchTagsProps {
    heading: string
}

export const DerivativeSearchTags = (props: DerivativeSearchTagsProps) => {
    const [openTagsArea, setOpenTagsArea] = useState(false)

    return null;

    return (
        <>
        <hr className="dashed-line-get-more"></hr>
            <div className="d-flex justify-content-center align-items-center mb-3 cursor-default" id="load-more-dropdown-btn">
                
                <a className="text-blue" onClick={() => setOpenTagsArea(!openTagsArea)}>
                    <span className="text-grey">
                        Vorschläge anzeigen
                        <SvgImage icon="icon_direction_down_dark.svg" convert={true} imgClass="svg-blue"
                            spanClass="svg-grey" />
                    </span>
                </a>
            </div>
            <Collapse in={openTagsArea}>
                <Container>
                    <div className="coming-soon-component derivativ-search-tags">
                        <span className="text-white fs-18px coming-soon-text d-flex justify-content-center">Coming soon...</span>
                    </div>
                    <div id="derivative-search-tags">
                        <h3 className="roboto-heading ml-2" style={{ fontSize: '18px' }}>{props.heading}</h3>
                        {/*<DerivativeTag />*/}
                    </div>
                </Container>
            </Collapse>
        </>
    )
}
export default DerivativeSearchTags

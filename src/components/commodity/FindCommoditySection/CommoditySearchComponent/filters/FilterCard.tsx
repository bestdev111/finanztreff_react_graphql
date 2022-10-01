import {ReactElement} from "react";
import { Card } from "react-bootstrap";


interface FilterCardProps {
    title?: string;
    children?: ReactElement;
}

export function FilterCard(props: FilterCardProps) {
    return (
        <Card className="commodity-card-filter m-2">
            <Card.Body className="p-3">
                {props.children}
            </Card.Body>
            <FooterInfoFilterButton resultsNumber={0} assetType="rohstoff"/>
        </Card>
    );
}

interface FooterInfoFilterButtonProps{
    resultsNumber?: number;
    assetType?: string;
}

export function FooterInfoFilterButton({resultsNumber, assetType}: FooterInfoFilterButtonProps){
    return(
        <Card.Footer className="d-flex justify-content-between borderless bg-white shadow-none inline-height-1">
            <div className="fs-14px text-white bg-primary px-2">
                <span className="font-weight-bold">{resultsNumber}</span> Treffer anzeigen
            </div>
            <div className={"text-white asset-type-tag " + assetType}>
                {assetType?.toUpperCase()}
            </div>
        </Card.Footer>
    );
}
import classNames from "classnames";
import React, {useContext} from "react";
import { Container } from "react-bootstrap";
import DerivativeTag from "./DerivativeTag";
import {ConfigContext, FilterContext} from "../DerivativeSearch";
import {AssetClass} from "../../../generated/graphql";

interface DerivativeUnderlyingTagComponentProps {
    heading: string;
    assetClass: AssetClass;
}

export const DerivativeUnderlyingTagComponent = ({ heading, assetClass }: DerivativeUnderlyingTagComponentProps) => {
    if(assetClass.name === 'Optionsscheine' || assetClass.name === 'Knock-Out')
    return (
        <Container>
            <div id="derivative-search-tags">
                <h3 className="roboto-heading ml-2" style={{ fontSize: '18px' }}>{heading}</h3>
                <DerivativeTag assetClass={assetClass} />
            </div>
        </Container>
    )

    return null;
}

export default DerivativeUnderlyingTagComponent

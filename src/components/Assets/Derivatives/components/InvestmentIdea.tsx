import React from 'react'
import classNames from "classnames";
import { InstrumentGroup } from 'graphql/types';

interface InvestmentIdeaProps extends React.HTMLAttributes<HTMLElement> {
    instrumentGroup: InstrumentGroup
}

const InvestmentIdea = (props: InvestmentIdeaProps) => {
    return props.instrumentGroup && props.instrumentGroup.description && props.instrumentGroup.description.text ?
        (
            <>
                <div className={classNames("content-wrapper", props.className)}>
                    <h2 className="content-wrapper-heading font-weight-bold">
                        Anlageidee
                    </h2>
                    <div className="content">
                        <div className="text-justify">
                            {props.instrumentGroup.description.text}
                        </div>
                    </div>
                </div>
            </>
        )
        :
        <></>
}

export default InvestmentIdea

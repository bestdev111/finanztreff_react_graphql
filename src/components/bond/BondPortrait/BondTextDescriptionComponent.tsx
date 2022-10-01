import React from 'react'
import classNames from "classnames";
import './BondTextDescriptionComponent.scss'
import { InstrumentGroup } from 'graphql/types';
import { quoteFormat, shortNumberFormat } from 'utils';

interface InvestmentIdeaProps extends React.HTMLAttributes<HTMLElement> {
    instrumentGroup: InstrumentGroup;
}

export const BondTextDescriptionComponent = (props: InvestmentIdeaProps) => {
    return (
        <>
            <div className={classNames("content-wrapper", props.className)} id="anlageidee">
                <h2 className="content-wrapper-heading font-weight-bold">
                    Anlageidee
                </h2>
                <div className="content">
                {
                (props.instrumentGroup.bond?.issueSize && props.instrumentGroup.bond?.maturityDate)
                    ?
                    <div className="text-justify text-bond-custom">
                    Die Anleihe {props.instrumentGroup.name} ist eine {props.instrumentGroup.bond?.type?.name}. Sie notiert an den Börsen mit der WKN {props.instrumentGroup.wkn} bzw. ISIN {props.instrumentGroup.isin}. Mit einem Kupon/Zins von {props.instrumentGroup.bond?.interestLoan}% wird die Anleihe verzinst. {/* Die Verzinsung erfolgt halbjährlich.  */}Der nächste Zinstermin ist am {quoteFormat(props.instrumentGroup.bond?.firstTradingDate)}. Die Anleihe hat eine Laufzeit bis {props.instrumentGroup.bond?.maturityDate.split("-").reverse().join("-").replaceAll("-",".")}. {props.instrumentGroup.bond?.issuer?.name} ist der Emittent der Anleihe. Das Emissionsvolumen betrug bis zu {shortNumberFormat(props.instrumentGroup.bond?.issueSize)} Die Emissionswährung lautet {props.instrumentGroup.bond?.nominalCurrency?.name}.
                    </div>
                    :
                    <div className="text-justify text-bond-custom">
                    Die Anleihe {props.instrumentGroup.name} ist eine {props.instrumentGroup.bond?.type?.name}. Sie notiert an den Börsen mit der WKN {props.instrumentGroup.wkn} bzw. ISIN {props.instrumentGroup.isin}. Mit einem Kupon/Zins von {props.instrumentGroup.bond?.interestLoan}% wird die Anleihe verzinst. {/* Die Verzinsung erfolgt halbjährlich. */}Der nächste Zinstermin ist am {quoteFormat(props.instrumentGroup.bond?.firstTradingDate)}. Die Anleihe hat keine Laufzeit. {props.instrumentGroup.bond?.issuer?.name} ist der Emittent der Anleihe. Das Emissionsvolumen betrug bis zu {shortNumberFormat(props.instrumentGroup.bond?.issueSize)} Die Emissionswährung lautet {props.instrumentGroup.bond?.nominalCurrency?.name}.
                    </div>
                }
                </div>
            </div>
        </>
    )
}

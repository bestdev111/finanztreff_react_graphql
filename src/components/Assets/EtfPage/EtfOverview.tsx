export function EtfInvestmentConcept(props: {concept: string}) {
    return (
        <div className="content-wrapper col" id="anlageidee">
            <h2 className="content-wrapper-heading font-weight-medium">Anlageidee</h2>
            <div className="content d-flex justify-content-between position-relative">{props.concept}</div>
        </div>
    );
}

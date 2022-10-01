import classNames from "classnames";
import { FindIndexModal } from "components/index/FindIndexSection/FindIndexModal";
import { Row } from "react-bootstrap";

export function CommodityIndicesSection(props: CommodityIndicesSectionProps){
    return(
        
        <section className={classNames("main-section pt-0", props.className)}>
            <div>
                { !props.insideTitle && <h2 className="section-heading font-weight-bold performance-comparison">Rohstoff-Indizes</h2> }
                <div className="content-wrapper">
                    { props.insideTitle && <h3 className="content-wrapper-heading font-weight-bold">Rohstoff-Indizes</h3>}
                    <Row className="flex-gap justify-content-2-between px-2">
                        <FindIndexModal buttonName="Solactive Indizes" showCardFooter={false} className="p-sm-1"/>
                        <FindIndexModal buttonName="JPMCCI Indizes" showCardFooter={false} className="p-sm-1"/>
                        <FindIndexModal buttonName="Sonstige Rohstoff Indizes" showCardFooter={false} className="p-sm-1"/>
                    </Row>
                </div>
            </div>
        </section>
    );
}

interface CommodityIndicesSectionProps{
    className?: string;
    insideTitle?: boolean;
}
import { InstrumentGroupFundTranche } from "generated/graphql";
import moment from "moment";
import { Col } from "react-bootstrap";
import { shortNumberFormat, quoteFormat } from "utils";

export function KeyFiguresSection(props: { fundTranche: InstrumentGroupFundTranche }) {
    let years = props.fundTranche.foundationDate && moment().diff(moment(props.fundTranche.foundationDate), 'years') || "-";
    return (
        <>
            <div className="content-wrapper col">
                <div className="content">
                    <div className="row row-cols-xl-5 row-cols-lg-4 row-cols-sm-2 gutter-10 gutter-tablet-8">
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Sparplanfähig?</div>
                                <div className="font-weight-bold">
                                    {props.fundTranche.savingPlanCapable !== null ?
                                        props.fundTranche.savingPlanCapable === true ?
                                            "Ja" : "Nein" : "-"}
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">VL-fähig?</div>
                                <div className="font-weight-bold">
                                    {props.fundTranche.germanVwlCapable !== null ?
                                        props.fundTranche.germanVwlCapable === true ?
                                            "Ja" : "Nein" : "-"}
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Riesterfähig?</div>
                                <div className="font-weight-bold">{
                                    props.fundTranche.germanRiesterCapable !== null ?
                                        props.fundTranche.germanVwlCapable === true ?
                                            "Ja" : "Nein" : "-"}</div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Ausschüttungsart</div>
                                <div className="font-weight-bold">
                                    {props.fundTranche.distributing !== null ?
                                        props.fundTranche.distributing === true ?
                                            "ausschüttend" : "thesaurierend" : "-"}</div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Ausschüttungsinterval</div>
                                <div className="font-weight-bold">{
                                    props.fundTranche.distributionFrequency && props.fundTranche.distributionFrequency.name ?
                                        props.fundTranche.distributionFrequency.name : "-"}</div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Fondswährung</div>
                                <div className="font-weight-bold">{
                                    props.fundTranche.currency && props.fundTranche.currency.name ?
                                        props.fundTranche.currency.name : "-"}</div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Fondsalter</div>
                                <div className="font-weight-bold">{years} {years === 1 ? "Jahr" : "Jahre"}</div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Auflage</div>
                                <div className="font-weight-bold">
                                    {
                                        props.fundTranche.foundationDate ?
                                            quoteFormat(props.fundTranche.foundationDate) : "-"
                                    }
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Volumen AK</div>
                                <div className="font-weight-bold">{
                                    props.fundTranche.investmentVolume && props.fundTranche.investmentVolume.value ?
                                        shortNumberFormat(props.fundTranche.investmentVolume.value) : "-"
                                }</div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Ertragverwendung</div>
                                <div className="font-weight-bold">
                                    {
                                        props.fundTranche.distributionFrequency && props.fundTranche.distributionFrequency.month ?
                                            <>
                                                {props.fundTranche.distributing ? "ausschüttend" : "thesaurierend"}  {12 / props.fundTranche.distributionFrequency?.month} x
                                            </>
                                            :
                                            <>
                                                -
                                            </>
                                    }
                                </div>
                            </div>
                        </Col>
                    </div>
                </div>
            </div>
        </>
    );
}
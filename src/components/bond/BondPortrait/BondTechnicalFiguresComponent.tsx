import { InstrumentGroup } from "graphql/types";
import { Col } from "react-bootstrap";
import {shortNumberFormat, quoteFormat, formatDate} from "utils";

export function BondTechnicalFiguresComponent(props: {instrumentGroup: InstrumentGroup} ) {
    return (
        <>
            <div className="content-wrapper col">
                <div className="content">
                    <div className="row row-cols-xl-5 row-cols-lg-4 row-cols-sm-2 gutter-10 gutter-tablet-8">
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Notierung</div>
                                <div className="text-truncate">‎</div>
                                <div className="font-weight-bold">
                                    {props.instrumentGroup.content[0].currency.name}
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Kupon (Zins)</div>
                                <div className="text-truncate">‎</div>
                                <div className="font-weight-bold">
                                    {props.instrumentGroup.bond?.interestLoan}%
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Zinstermin</div>
                                <div className="text-truncate">‎</div>
                                <div className="font-weight-bold">
                                    {quoteFormat(props.instrumentGroup.bond?.firstTradingDate)}
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Nächster Zinstermin</div>
                                <div className="text-truncate">‎</div>
                                <div className="font-weight-bold">
                                    --
                                    {/*{current.split("-").reverse().join("-").replaceAll("-",".")}*/}
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Zinstermin Periode</div>
                                <div className="text-truncate">‎</div>
                                <div className="font-weight-bold">
                                    -
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Laufzeit</div>
                                <div className="text-truncate">‎</div>
                                <div className="font-weight-bold">
                                    {formatDate(props.instrumentGroup.bond?.maturityDate)}
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Kurstyp</div>
                                <div className="text-truncate">‎</div>
                                <div className="font-weight-bold">
                                    -
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Kleinste handlebare</div>
                                <div className="text-truncate">Einheit</div>
                                <div className="font-weight-bold">
                                    {shortNumberFormat(props.instrumentGroup.bond?.minAmountTradableLot)}
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Nachrang</div>
                                <div className="text-truncate">‎</div>
                                <div className="font-weight-bold">
                                    {props.instrumentGroup.bond?.subordinatedDebt === false ?  "nein" : "ja"}
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="border border-border-gray fnt-size-14 px-1 py-1 margin-bottom-20">
                                <div className="text-truncate">Kündigungsrecht</div>
                                <div className="text-truncate">Emittent</div>
                                <div className="font-weight-bold">
                                    --
                                </div>
                            </div>
                        </Col>
                    </div>
                </div>
            </div>
        </>
    );
}

import {Instrument, InstrumentGroup} from "../../../../../generated/graphql";
import {TechnicalCompanyKeyFigures} from "../../common/TechnicalCompanyKeyFigures";
import {TechnicalKeyFiguresModal} from "../../modal/TechnicalKeyFiguresModal";

interface ShareTechnicalFiguresComponentProps {
    instrumentGroup: InstrumentGroup;
    instrument?: Instrument;
}

export function ShareTechnicalFiguresComponent(props: ShareTechnicalFiguresComponentProps) {

    const instrument = props.instrument ? props.instrument : props.instrumentGroup.content.filter(current => current.main===true)[0] || props.instrumentGroup.content[0];

    if (!instrument) {
        return(<></>);
    }

    const {stats, indicators, performance} = instrument;
    const currencyCode = instrument.currency.displayCode || "";
    const exchange = instrument.exchange?.code ? ' (' + instrument.exchange.code + ')' : '';
    
    if(!indicators && stats.length===0 && performance.length===0){
        return(<></>);
    }

    return (
        <div className="content-wrapper col" >
            <div className=" d-sm-block d-md-flex justify-content-between pb-xl-1 pb-md-3">
                <h3 className="content-wrapper-heading mt-sm-1 mt-md-n1 w-75 mb-sm-5 mb-md-2 mb-xl-2 font-weight-bold ">Technische Kennzahlen {exchange}</h3>
                <div className="d-none d-xl-block w-50 ml-xl-1 pl-xl-1 mr-xl-5"/>
                {/* <div className=" d-flex flex-wrap mr-md-n5 mr-xl-0 fnt-size-13 mb-sm-3 w-100 pb-sm-3 pb-md-0 mb-md-0 text-kurs-grau">
                    <span className="padding-right-5 ">Zeitpunkt der Berechnung:</span>
                    <div className="w-100 d-block d-md-none"></div>
                    <span className="padding-right-5 "><span>05.08.20 - 09:20:35</span>,</span>
                    <span className="padding-right-5">Ask:</span>
                    <span>14,28 EUR</span>
                </div> */}
            </div>
            <div className="content">
                <TechnicalCompanyKeyFigures
                    indicators={indicators || undefined}
                    yearStats={stats.find(current => current.period === 'WEEK52') || undefined}
                    allTime={stats.find(current => current.period === 'ALL_TIME') || undefined}
                    vola30={performance.find(current => current.period === 'MONTH1')?.vola || undefined}
                    currencyCode={currencyCode}
                />
            </div>
            <div className="d-flex justify-content-end position-absolute mb-sm-1 pb-sm-2 mr-sm-n2 " style={{bottom:"0px",right:"0px" ,  }}>
                <TechnicalKeyFiguresModal instrument={instrument} instrumentGroup={props.instrumentGroup}/>
            </div>
        </div>
    );
}

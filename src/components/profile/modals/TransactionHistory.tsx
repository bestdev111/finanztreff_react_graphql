import { AccountEntry, Portfolio, PortfolioPerformanceEntry } from 'graphql/types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import {useEffect, useState} from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getFinanztreffAssetLink, numberFormat, REALDATE_FORMAT } from 'utils';
import { getAssetGroup, getColorOfAssetGroup, makeTransactionEntries, transactionHistoryChartOptions } from '../utils';
import { ModalHeaderMeinFinanztreff } from './ModalHeaderMeinFinanztreff';
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

// Transaktionshistorie
export function TransactionHistory(props: TransactionHistoryProps) {

    const accountEntries = props.portfolio?.accountEntries?.filter(current =>
        current.accountTypeDescriptionEn === "Wertpapierkauf" ||
        current.accountTypeDescriptionEn === "Wertpapierverkauf" ||
        current.accountTypeDescriptionEn === "Tileverkauf" ||
        current.accountTypeDescriptionEn === "Zukauf") || [];
    const lastIndex = accountEntries.length;

    let [state, setState] = useState<TransactionHistoryState>({
        isOpen: false,
        entries: accountEntries,
        index: lastIndex > 6 ? 6 : lastIndex
    });


    const startDate: string = accountEntries[state.index - 1] ? REALDATE_FORMAT(accountEntries[state.index - 1].entryTime) : "";
    const endDate: string = accountEntries != null && accountEntries != [] && accountEntries[0] != undefined ? REALDATE_FORMAT(accountEntries[0].entryTime) : "";
    let performanceEntriesWithMarkers = makeTransactionEntries(props.portfolio, props.performanceEntries);

    Highcharts.setOptions({
        lang: {
            numericSymbols: []
        }
    });

    useEffect(() => {
        if (state.isOpen) {
            trigInfonline(guessInfonlineSection(), "transaction_history");
        }
    }, [state.isOpen])

    let nameModal = "Transaktionshistorie " + (window.innerWidth > 360 ? (" - " + props.portfolio.name) : "");
    function close(){
        setState({ ...state, isOpen: false, index: lastIndex > 6 ? 6 : lastIndex });
    }

    return (
        <>
            {props.inBanner ?
                <button className="btn btn-primary" onClick={() => setState({ ...state, isOpen: true })}>
                    zur Transaktions-Historie...
                </button>
                :
                <button className="btn btn-primary pr-dn" onClick={() => setState({ ...state, isOpen: true })}>
                    Transaktionshistorie
                </button>
            }
            <Modal show={state.isOpen} onHide={() => setState({ ...state, isOpen: false })} className="modal modal-dialog-sky-placement" aria-labelledby="transactionHistoryModal" aria-hidden="true">
                <div className="modal-content account-transaction-modal bg-white">
                    <ModalHeaderMeinFinanztreff title={nameModal} close={close}/>
                    <div className="modal-body modal-body-sm mobile-modal-body">
                        <section className="main-section">
                            <div className="container">
                                <div className="content-row">
                                    <div className="chart-wrapper pt-4">
                                        {accountEntries.length > 0 &&
                                            <HighchartsReact style={{ height: "180px" }} highcharts={Highcharts} options={transactionHistoryChartOptions(performanceEntriesWithMarkers, "240px", "transparent", "transparent")} />
                                        }
                                    </div>
                                    <div className="data-rows">
                                        <h5>Transaktionen {startDate} bis {endDate}</h5>
                                        <div className="table-in-transaction-and-account-modal">
                                            <Table>
                                                <tbody>
                                                    {accountEntries.map((entry, index) => {
                                                        const color = entry.amount >= 0 ? "text-green" : "text-pink";
                                                        const category: string = entry.instrument?.group?.assetGroup ? entry.instrument.group.assetGroup : "";
                                                        const seoTag: string = entry.instrument?.group?.seoTag ? entry.instrument.group.seoTag : "";
                                                        const price: number = entry.quantity ? Math.abs(entry.amount / entry.quantity) : 0;
                                                        let name: string = "";
                                                        let nameMobile: string = "";

                                                        if (entry && entry.securityDescription) {
                                                            name = entry?.securityDescription?.length > 15 ? entry?.securityDescription.substr(0, 12) + "..." : entry?.securityDescription;
                                                            nameMobile = entry?.securityDescription?.length > 38 ? entry?.securityDescription.substr(0, 35) + "..." : entry?.securityDescription;
                                                        }
                                                        if(index<=state.index)
                                                        return (
                                                            <>
                                                                <tr className="d-none d-xl-table-row" key={index}>
                                                                    <th scope="col" className="text-left">{entry.accountTypeDescriptionEn}</th>
                                                                    <th className={'value-td text-right ' + color}>{numberFormat(entry.amount)} EUR</th>
                                                                    <td className="text-right">{REALDATE_FORMAT(entry.entryTime)}</td>
                                                                    <td className="text-right">
                                                                        {category && <span className="asset-type-tag" style={{ backgroundColor: getColorOfAssetGroup(category) }}>{getAssetGroup(category)}</span>}
                                                                    </td>
                                                                    <td className="pl-0">
                                                                        {entry.securityDescription && <span className="name font-weight-bold">
                                                                            {entry.instrument && category && seoTag ?
                                                                                <Link to={getFinanztreffAssetLink(category, seoTag)}>
                                                                                    {name}
                                                                                </Link>
                                                                                :
                                                                                <>{name}</>
                                                                            } </span>}
                                                                        {entry.instrument?.wkn && <span>({entry.instrument?.wkn})</span>}
                                                                    </td>
                                                                    <td className="text-right">
                                                                        {entry.quantity &&
                                                                            <>
                                                                                <b> {entry.quantity} Stück </b>
                                                                                zu je <b> {numberFormat(price)} EUR</b>
                                                                            </>
                                                                        }
                                                                    </td>
                                                                </tr>

                                                                <tr className="d-none d-xl-none d-md-table-row">
                                                                    <th scope="col" className="align-middle p-2" rowSpan={2}>{entry.accountTypeDescriptionEn}</th>
                                                                    <th className={'value-td pb-0 ' + color}>{numberFormat(entry.amount)} EUR</th>
                                                                    <td className="text-right pb-0">{REALDATE_FORMAT(entry.entryTime)}</td>
                                                                </tr>
                                                                <tr className="d-none d-xl-none d-md-table-row">
                                                                    <td className="pt-0" style={{ borderTop: "none" }}>
                                                                        {category &&
                                                                            <span className="asset-type-tag" style={{ backgroundColor: getColorOfAssetGroup(category) }}>
                                                                                {getAssetGroup(category)}
                                                                            </span>
                                                                        }
                                                                        {entry.securityDescription &&
                                                                            <span className="name font-weight-bold pl-1">
                                                                                {entry.instrument && category && seoTag ?
                                                                                    <Link to={getFinanztreffAssetLink(category, seoTag)}>
                                                                                        {name}
                                                                                    </Link>
                                                                                    :
                                                                                    <>{name}</>
                                                                                }
                                                                            </span>
                                                                        }
                                                                        {entry.instrument?.wkn && <span>({entry.instrument?.wkn})</span>}
                                                                    </td>
                                                                    <td className="text-right pt-0" style={{ borderTop: "none" }}>
                                                                        {entry.quantity &&
                                                                            <>
                                                                                <b> {entry.quantity} Stück </b> zu je
                                                                                <b> {numberFormat(price)} EUR</b>
                                                                            </>
                                                                        }
                                                                    </td>
                                                                </tr>

                                                                <tr className="d-none d-lg-none d-md-none d-sm-table-row p-0" style={{ fontSize: "15px" }}>
                                                                    <th scope="col" className="p-0 pt-2 pb-1">{entry.accountTypeDescriptionEn}</th>
                                                                    <th className={'text-right value-td pt-2 pb-1 ' + color} style={{ whiteSpace: "nowrap" }}>{numberFormat(entry.amount)} EUR</th>
                                                                    {/* <td className="text-right pt-2 pb-1" style={{fontSize:"12px"}}>{REALDATE_FORMAT(entry.entryTime)}</td> */}
                                                                </tr>
                                                                <tr className="d-none d-lg-none d-md-none d-sm-table-row p-0" style={{ fontSize: "12px" }}>
                                                                    <td className="p-0" style={{ borderTop: "none" }} colSpan={3}>
                                                                        {category && <span style={{ color: getColorOfAssetGroup(category), fontWeight: "bold" }}>{getAssetGroup(category).toUpperCase()} </span>}
                                                                        {entry.securityDescription && <span className="name font-weight-bold">
                                                                            {entry.instrument && category && seoTag ?
                                                                                <Link to={getFinanztreffAssetLink(category, seoTag)}>
                                                                                    {name}
                                                                                </Link>
                                                                                :
                                                                                <>{nameMobile}</>
                                                                            }
                                                                        </span>}
                                                                        {entry.instrument?.wkn && <span>({entry.instrument?.wkn})</span>}
                                                                    </td>
                                                                </tr>
                                                                <tr className="d-none d-lg-none d-md-none d-sm-table-row p-0" style={{ fontSize: "12px" }}>
                                                                    <td className="p-0  pb-1" style={{ borderTop: "none" }} colSpan={3}>
                                                                        {entry.quantity &&
                                                                            <>
                                                                                <b> {entry.quantity} Stück </b>
                                                                                zu je <b>{numberFormat(price)} EUR am {REALDATE_FORMAT(entry.entryTime)}</b>
                                                                            </>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )
                                                    }
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                    <Button className="d-block ml-auto my-2 mt-4" disabled={state.index >= lastIndex} onClick={() =>
                                        setState({ ...state, index: lastIndex >= state.index + 5 ? state.index + 5 : lastIndex })}>mehr aus der Transaktionshistorie...</Button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </Modal>
        </>
    );
}

interface TransactionHistoryState {
    isOpen: boolean
    entries: AccountEntry[]
    index: number
}
interface TransactionHistoryProps {
    inBanner: boolean;
    portfolio: Portfolio;
    performanceEntries: PortfolioPerformanceEntry[];
}

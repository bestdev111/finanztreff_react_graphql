
import classNames from 'classnames';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { ReactNode, useEffect, useState } from 'react';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Portfolio, AccountEntry, Query, AssetGroup } from '../../../graphql/types';
import { getFinanztreffAssetLink, numberFormat, numberFormatWithSign, quoteFormat, REALDATE_FORMAT } from '../../../utils';
import { getColorOfAssetGroup, getAssetGroup, calculatePortfolioErtrage, calculatePortfolio, calculateChange } from '../utils';
import { AccountDeposit, AccountWithdrawal, ExposeDepositModalBody } from './accountBalance';
import { ModalHeaderMeinFinanztreff } from './ModalHeaderMeinFinanztreff';
import { guessInfonlineSection, trigInfonline } from "../../common/InfonlineService";
import { useQuery } from '@apollo/client';
import SvgImage from 'components/common/image/SvgImage';
import { loader } from 'graphql.macro';
import { FilterDropdownItem, OptionItem } from 'components/common/SearchCard/FilterDropdownItem';
import "./AccountOverviewModal.scss";
import { DividendEditModal } from './MainSettingsModals/AccountEntry/DividendEditModal';

const unique = (value: any, index: number, self: any) => {
    return self.indexOf(value) === index
}

export function AccountOverviewModal(props: AccountOverviewModalProps) {

    const YEAR_OPTIONS = (props.portfolio.accountEntries || []).map(current => (moment(current.entryTime ).format("YYYY"))).filter(unique).map(current => {
        return { id: current, name: current }
    }).concat({ id: "Alle", name: "Alle" });

    let [state, setState] = useState<AccountOverviewModalState>({ isOpen: false, isNoteShown: false, selectedYear: YEAR_OPTIONS[0].id ? YEAR_OPTIONS[0].id : "Alle" });

    const entries = state.selectedYear === "Alle" ?
        props.portfolio.accountEntries || []
        : props.portfolio.accountEntries?.filter(current => moment(current.entryTime).format("YYYY") === state.selectedYear) || [];

    const konto: number = props.portfolio.accountEntries ? props.portfolio.accountEntries
        .map(entry => entry.amount)
        .reduce(function (x: number, y: number) { return x + y }, 0) : 0;

    const [initial, yesterday, last] = calculatePortfolio(props.portfolio);

    const ertrage: number = calculatePortfolioErtrage(props.portfolio);
    const total = last + ertrage;
    const [diff, diffPct] = calculateChange(initial, total);
    const color = (diff > 0) ? "text-green" : (diff < 0) ? "text-red" : "";
    Highcharts.setOptions({
        lang: {
            numericSymbols: []
        }
    });

    useEffect(() => {
        if (state.isOpen) {
            trigInfonline(guessInfonlineSection(), "account_modal")
        }
    }, [state.isOpen])

    function close() {
        setState({ ...state, isOpen: false });
    }

    return (
        <>
            {props.children ?
                <span onClick={() => setState({ ...state, isOpen: true })}>
                    {props.children}
                </span>
                :
                props.inOverview ?
                    <button className="btn btn-border-gray text-blue px-xl-3 px-lg-2 px-md-1 px-sm-1" onClick={() => setState({ ...state, isOpen: true })}>
                        <span className={classNames("text-nowrap", Math.abs(konto) > 99999 && "fs-13px pt-1")}>
                            <span className={classNames("d-none d-xl-inline mr-1", Math.abs(konto) > 99999 && "fs-13px pt-1")}>
                                Zum
                            </span>
                            Konto </span>
                        <span className="additional-info">({numberFormat(konto)}
                            <span className="fs-11px ml-1">EUR</span>)</span>
                    </button>
                    :
                    <button className="btn btn-primary pr-dn" onClick={() => setState({ ...state, isOpen: true })}>
                        {props.inBanner ? "zum Konto..." : "Konto"}
                    </button>
            }

            <Modal show={state.isOpen} onHide={() => setState({ ...state, isOpen: false })} className="modal modal-dialog-sky-placement" aria-labelledby="accountOverviewModal" aria-hidden="true">
                <ModalHeaderMeinFinanztreff title={<><span className='d-md-inline d-sm-none'>Konto - {props.portfolio.name}</span><span className="d-md-none d-sm-inline fs-13px">Konto - {props.portfolio.name}</span></>} close={close} />
                <Container className="bg-white px-xl-3 px-md-2 px-sm-1">
                    <Row className="mb-1 d-md-flex d-sm-none">
                        <Col xs={12} className="line-height-1">
                            <span className="fs-18px mr-3">Kontostand aktuell:</span>
                            <span className="fs-18px font-weight-bold mr-3">{numberFormat(konto, " EUR")}</span>
                            <span className='account-overview-modal-plus-minus-buttons mr-3'>
                                <AccountDeposit portfolio={props.portfolio} onComplete={props.refreshTrigger} innerModal={true}>
                                    <span className="text-white">+</span>
                                </AccountDeposit>
                                <span style={{ marginLeft: "6px" }}>
                                    <AccountWithdrawal customWidth={"21px"} portfolio={props.portfolio} onComplete={props.refreshTrigger} />
                                </span>
                            </span>
                            <span className={classNames(color, "fs-18px font-weight-bold mr-3 d-none d-xl-inline")}>{numberFormatWithSign(diff, " EUR")}</span>
                            <span className={classNames(color, "fs-18px font-weight-bold d-none d-xl-inline")}>{numberFormatWithSign(diffPct, " %")}</span>
                        </Col>
                        <Col className="d-xl-none line-height-1">
                            <span className={classNames(color, "fs-18px font-weight-bold mr-3")}>{numberFormatWithSign(diff, " EUR")}</span>
                            <span className={classNames(color, "fs-18px font-weight-bold")}>{numberFormatWithSign(diffPct, " %")}</span>
                        </Col>
                    </Row>
                    <Row className="mb-1 d-md-none d-sm-flex justify-content-between  align-items-center">
                        <Col xs={7}>
                            <Row className="fs-18px mr-3 px-3">Kontostand aktuell:</Row>
                            <Row className="fs-18px font-weight-bold px-3">{numberFormat(konto, " EUR")}</Row>
                            <Row className="px-3">
                                <span className={classNames(color, "fs-18px font-weight-bold mr-3")}>{numberFormatWithSign(diff, " EUR")}</span>
                                <span className={classNames(color, "fs-18px font-weight-bold")}>{numberFormatWithSign(diffPct, " %")}</span>
                            </Row>
                        </Col>
                        <Col xs={5} className="text-right account-overview-modal-plus-minus-buttons">
                            <AccountDeposit portfolio={props.portfolio} onComplete={props.refreshTrigger} innerModal={true}>
                                <span className="text-white">+</span>
                            </AccountDeposit>
                            <span style={{ marginLeft: "6px" }}>
                                <AccountWithdrawal customWidth={"21px"} portfolio={props.portfolio} onComplete={props.refreshTrigger} />
                            </span>
                        </Col>
                    </Row>
                    <Row className="chart-wrapper pb-1">
                        <Col className="px-md-2 px-sm-3">
                            <HighchartsReact style={{ height: "180px" }} highcharts={Highcharts} options={getOptions(props.portfolio)} />
                        </Col>
                    </Row>
                </Container>
                <Container className="bg-white px-xl-3 px-md-2 px-sm-1">
                    <Row className="justify-content-between mb-2">
                        <Col md={8} xs={12}>
                            <Row className="align-items-center px-3 roboto-heading">
                                <h5 className="font-weight-bold mb-0 fs-20px">Kontobewegungen
                                </h5>
                                <span className="account-overview-modal-dropdown-years ml-2">
                                    <FilterDropdownItem
                                        onSelect={(value: OptionItem) => {
                                            // let currentEntriesList = props.portfolio.accountEntries?.filter(current => current.entryTime.slice(0, 4) === value.id)
                                            setState({ ...state, selectedYear: value.id });
                                        }}
                                        options={YEAR_OPTIONS}
                                        activeId={state.selectedYear == "" ? "" + moment().year.toString() : "" + state.selectedYear}
                                    />
                                </span>
                            </Row>
                            <Row className='px-3'>
                                <div className="fs-15px">Hinweis: Wertpapierkäufe und -verkäufe sind nicht editierbar.</div>
                            </Row>
                        </Col>
                        <Col md={4} xs={12} className="text-right">
                            <Button variant={"inline"} className="text-nowrap bg-gray-light py-0 mt-2 rounded" onClick={() => setState({ ...state, isNoteShown: !state.isNoteShown })}>
                                <SvgImage icon={"icon_note" + (state.isNoteShown ? "" : "_gray") + ".svg"} width={"24"} spanClass="py-1" />
                                <span className={classNames("pt-2 fs-14px mr-1 mt-1 font-weight-bold", state.isNoteShown ? "text-dark" : "text-gray")}>Notizen</span>
                            </Button>
                        </Col>
                    </Row>
                </Container>
                <Container className="bg-white pb-2 px-xl-3 px-md-2 px-sm-1">
                    <Container>
                        {entries.map((entry, index) => {

                            const LABEL_DIVIDEND: string = entry.accountTypeDescriptionEn === "Dividenden" ?
                                (entry.instrument?.group.assetGroup == AssetGroup.Fund || entry.instrument?.group.assetGroup == AssetGroup.Etf) ? "Ausschüttung" :
                                    entry.instrument?.group.assetGroup == AssetGroup.Bond ? "Zinsen" :
                                        entry.accountTypeDescriptionEn || "" : entry.accountTypeDescriptionEn || "";
                            const color = entry.amount > 0 ? "text-green" : entry.amount < 0 && "text-pink";
                            const category: string = entry.instrument?.group?.assetGroup ? entry.instrument?.group?.assetGroup : "";
                            const seoTag: string = entry.instrument?.group?.seoTag ? entry.instrument.group.seoTag : "";
                            const date: string = quoteFormat(entry.entryTime);
                            const price: number = entry.quantity && (entry.accountTypeDescriptionEn === "Wertpapierverkauf" || entry.accountTypeDescriptionEn === "Wertpapierkauf") ? Math.abs(entry.amount / entry.quantity) : 0;
                            let name: string = "";
                            const ENABLED_EDIT: boolean = !props.portfolio.real && !(entry.accountTypeDescriptionEn === "Wertpapierverkauf" || entry.accountTypeDescriptionEn === "Wertpapierkauf" || entry.accountTypeId === 12);
                            if (entry && entry.securityDescription) {
                                name = entry?.securityDescription?.length > 15 ? entry?.securityDescription.substr(0, 12) + "..." : entry?.securityDescription;
                            }
                            return (
                                <>
                                    <Row key={index} className="py-2 border-border-gray border-top fs-15px d-xl-flex d-sm-none">
                                        <Col xs={1} className="pl-0">
                                            {date}
                                        </Col>
                                        <Col xs={2} className="px-0">
                                            <b>{LABEL_DIVIDEND}</b>
                                        </Col>
                                        <Col xs={9} className="pr-n3">
                                            <Row className="justify-content-between">
                                                <Col xs={5}>
                                                    <span className="font-weight-bold mr-3" style={{ color: getColorOfAssetGroup(category) }}>{getAssetGroup(category).toUpperCase()}</span>
                                                    <span>
                                                        {entry.securityDescription &&
                                                            <span className="name font-weight-bold text-nowrap mr-3">
                                                                {entry.instrument && category && seoTag ?
                                                                    <Link to={getFinanztreffAssetLink(category, seoTag)}>
                                                                        {name}
                                                                    </Link>
                                                                    :
                                                                    <>{name}</>
                                                                }
                                                            </span>
                                                        }
                                                    </span>
                                                    <span>
                                                        {entry.instrument?.wkn && <span>({entry.instrument?.wkn})</span>}
                                                    </span>
                                                </Col>
                                                <Col xs={3} className="text-right">
                                                    {entry.quantity && (entry.accountTypeDescriptionEn === "Wertpapierkauf" || entry.accountTypeDescriptionEn === "Wertpapierverkauf") &&
                                                        <>
                                                            <b> {entry.quantity} Stück </b>
                                                            zu je <b> {numberFormat(price)} EUR</b>
                                                        </>
                                                    }
                                                </Col>
                                                <Col xs={3} className={'text-right pr-0 ' + color}>
                                                    {entry.amount === 0 ?
                                                        <>
                                                            <b> {numberFormatWithSign(entry.amount)} EUR</b>
                                                        </>
                                                        :
                                                        !!entry.amount &&
                                                        <>
                                                            <b> {numberFormatWithSign(entry.amount)} EUR</b>
                                                        </>
                                                    }
                                                </Col>
                                                <span className={classNames("text-right px-0 ml-1", !ENABLED_EDIT && "ml-4 pl-1")}>
                                                    {entry.accountTypeId === 12 ?
                                                        <span className="ml-n4">
                                                            <DividendEditModal portfolio={props.portfolio} entry={entry} onComplete={props.refreshTrigger} >
                                                                <SvgImage icon={"icon_menu_horizontal_blue.svg"} spanClass="cursor-pointer" convert={false} width="27" />
                                                            </DividendEditModal>
                                                        </span>
                                                        :
                                                        ENABLED_EDIT && <AccountEdit onComplete={props.refreshTrigger} accountEntry={entry} portfolio={props.portfolio} />}
                                                </span>
                                            </Row>
                                            {entry.memo && state.isNoteShown &&
                                                <Row>
                                                    <Col className="text-wrap">
                                                        <SvgImage icon={"icon_note" + (state.isNoteShown ? "" : "_gray") + ".svg"} width={"24"} spanClass="py-1 mr-2" /><i>{entry.memo}</i>
                                                    </Col>
                                                </Row>
                                            }
                                        </Col>
                                    </Row>

                                    <Row className="py-2 border-border-gray border-top fs-15px d-sm-none d-md-flex d-xl-none">
                                        <Col xs={1} className="pl-0 pr-5">
                                            {date}
                                        </Col>
                                        <Col xs={10} className="pl-5 pr-0">
                                            <Row className='justify-content-between'>
                                                <Col>
                                                    <b>{entry.accountTypeDescriptionEn}</b>
                                                </Col>
                                                <Col className={'text-right pr-0 ' + color}>
                                                    {entry.amount === 0 ?
                                                        <>
                                                            <b> {numberFormatWithSign(entry.amount)} EUR</b>
                                                        </>
                                                        :
                                                        !!entry.amount &&
                                                        <>
                                                            <b> {numberFormatWithSign(entry.amount)} EUR</b>
                                                        </>
                                                    }
                                                </Col>
                                            </Row>
                                            <Row className='justify-content-between'>
                                                <Col>
                                                    <span className="font-weight-bold mr-3" style={{ color: getColorOfAssetGroup(category) }}>{getAssetGroup(category).toUpperCase()}</span>
                                                    <span>
                                                        {entry.securityDescription &&
                                                            <span className="font-weight-bold text-nowrap mr-3">
                                                                {entry.instrument && category && seoTag ?
                                                                    <Link to={getFinanztreffAssetLink(category, seoTag)}>
                                                                        {entry?.securityDescription}
                                                                    </Link>
                                                                    :
                                                                    <>{entry?.securityDescription}</>
                                                                }
                                                            </span>
                                                        }
                                                    </span>
                                                    <span>
                                                        {entry.instrument?.wkn && <span>({entry.instrument?.wkn})</span>}
                                                    </span>
                                                </Col>
                                                <Col className="text-right pr-0">
                                                    {entry.quantity && (entry.accountTypeDescriptionEn === "Wertpapierkauf" || entry.accountTypeDescriptionEn === "Wertpapierverkauf") &&
                                                        <>
                                                            <b> {entry.quantity} Stück </b>
                                                            zu je <b> {numberFormat(price)} EUR</b>
                                                        </>
                                                    }
                                                </Col>
                                            </Row>
                                            {entry.memo && state.isNoteShown &&
                                                <Row>
                                                    <Col className="text-wrap">
                                                        <SvgImage icon={"icon_note" + (state.isNoteShown ? "" : "_gray") + ".svg"} width={"24"} spanClass="py-1 mr-2" /><i>{entry.memo}</i>
                                                    </Col>
                                                </Row>
                                            }
                                        </Col>
                                        <Col xs={1} className="pr-1 pl-0 text-right">
                                            {ENABLED_EDIT && <AccountEdit onComplete={props.refreshTrigger} accountEntry={entry} portfolio={props.portfolio} />}
                                            {entry.accountTypeId === 12 &&
                                                <DividendEditModal portfolio={props.portfolio} entry={entry} onComplete={props.refreshTrigger} >
                                                    <SvgImage icon={"icon_menu_horizontal_blue.svg"} spanClass="cursor-pointer" convert={false} width="27" />
                                                </DividendEditModal>
                                            }
                                        </Col>
                                    </Row>

                                    <Row className="py-2 border-border-gray border-top fs-15px d-sm-flex d-md-none">
                                        <Col className="px-0">
                                            <Row className="">
                                                <Col>
                                                    <b>{entry.accountTypeDescriptionEn}</b>
                                                </Col>
                                                <Col className={'text-right pr-0 ' + color}>
                                                    {entry.amount &&
                                                        <>
                                                            <b> {numberFormatWithSign(entry.amount)} EUR</b>
                                                        </>
                                                    }
                                                </Col>

                                                <Col xs={2} className="pl-0 text-right">
                                                    {ENABLED_EDIT && <AccountEdit onComplete={props.refreshTrigger} accountEntry={entry} portfolio={props.portfolio} />}
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 line-height-1">
                                                <Col>
                                                    {date}
                                                </Col>
                                            </Row>
                                            <Row className="fs-12px">
                                                <Col>
                                                    <span className="font-weight-bold mr-3" style={{ color: getColorOfAssetGroup(category) }}>{getAssetGroup(category).toUpperCase()}</span>
                                                    <span>
                                                        {entry.securityDescription &&
                                                            <span className="name font-weight-bold text-nowrap mr-3">
                                                                {entry.instrument && category && seoTag ?
                                                                    <Link to={getFinanztreffAssetLink(category, seoTag)}>
                                                                        {entry?.securityDescription}
                                                                    </Link>
                                                                    :
                                                                    <>{entry?.securityDescription}</>
                                                                }
                                                            </span>
                                                        }
                                                    </span>
                                                    <span>
                                                        {entry.instrument?.wkn && <span>({entry.instrument?.wkn})</span>}
                                                    </span>
                                                </Col>
                                            </Row>
                                            <Row className="fs-12px">
                                                <Col>
                                                    {entry.quantity && (entry.accountTypeDescriptionEn === "Wertpapierkauf" || entry.accountTypeDescriptionEn === "Wertpapierverkauf") &&
                                                        <>
                                                            <b> {entry.quantity} Stück </b>
                                                            zu je <b> {numberFormat(price)} EUR</b>
                                                        </>
                                                    }
                                                </Col>
                                            </Row>
                                            {entry.memo && state.isNoteShown &&
                                                <Row className="mt-2">
                                                    <Col className="text-wrap fs-12px">
                                                        <SvgImage icon={"icon_note" + (state.isNoteShown ? "" : "_gray") + ".svg"} width={"24"} spanClass="py-1 mr-2" /><i>{entry.memo}</i>
                                                    </Col>
                                                </Row>
                                            }
                                        </Col>
                                    </Row>
                                </>
                            )
                        })}
                    </Container>
                </Container>
            </Modal>
        </>
    );
}

export function AccountEdit(props: AccountEditProps) {

    let [open, setOpen] = useState<boolean>(false);

    let { data, loading } = useQuery<Query>(loader('./getOperationTypes.graphql'));

    useEffect(() => {
        if (open) {
            trigInfonline(guessInfonlineSection(), "deposit_modal")
        }
    }, [open])

    return (
        <>
            <SvgImage icon={"icon_menu_horizontal_blue.svg"} convert={false} width="27" spanClass="cursor-pointer" onClick={() => setOpen(true)} />
            {open && data && data.accountOperationTypes && <ExposeDepositModalBody onComplete={props.onComplete} accountEntry={props.accountEntry} accountOperationTypes={data.accountOperationTypes} handleClose={() => setOpen(false)} addToKonto={true} portfolio={props.portfolio} />}
        </>
    );

}

interface AccountEditProps {
    onComplete: () => void;
    portfolio: Portfolio;
    addToKonto?: boolean;
    accountEntry: AccountEntry
}

interface AccountOverviewModalState {
    isOpen: boolean;
    // entries: AccountEntry[];
    isNoteShown: boolean;
    selectedYear: string;
}
interface AccountOverviewModalProps {
    inBanner: boolean;
    portfolio: Portfolio;
    refreshTrigger: () => void;
    inOverview?: boolean;
    isDeleteButtonShown?: boolean
    children?: ReactNode
}

function getOptions(portfolio: Portfolio): Highcharts.Options {
    const maxValue = Math.max.apply(Math, portfolio.accountEntries!.map((current, index) => getAmount(index, portfolio))) + 1;
    const minValue = Math.min.apply(Math, portfolio.accountEntries!.map((current, index) => getAmount(index, portfolio))) - 1;
    function getAmount(currentIndex: number, portfolio: Portfolio) {
        let amount: number = 0;
        portfolio.accountEntries!.map((current, index) => {
            if (currentIndex > index)
                return amount;
            else {
                return amount += current.amount;
            }
        })
        return amount;
    }

    let options: any = [{
        step: true,
        fillOpacity: 0.05,
        dataGrouping: {
            smoothed: true
        },
        lineWidth: 1,
        marker: {
            enabled: false
        },
        color: 'rgba(31, 220, 162, 1)',
        fillColor: 'rgba(31, 220, 162, 0.3)',
        negativeColor: 'rgba(255, 77, 125, 1)',
        negativeFillColor: 'rgba(255, 77, 125, 0.3)',
        data: portfolio.accountEntries?.map((current: AccountEntry, index) => ({
            name: "Kontostand",
            date: REALDATE_FORMAT(current.entryTime),
            x: moment(current.entryTime).toDate(),
            y: getAmount(index, portfolio),
            amount: numberFormat(getAmount(index, portfolio))
        }))
            .reverse()
        // .concat({name:"", date: REALDATE_FORMAT(portfolio.accountEntries[0].entryTime), x: portfolio.accountEntries[0].entryTime.X, y: 0})
    }];
    return {
        stockTools: {
            gui: {
                enabled: false
            }
        },
        chart: {
            type: 'area',
            height: '180px'
        },
        title: {
            text: ''
        },
        navigator: {
            enabled: true,
        },
        legend: {
            enabled: false,
        },
        xAxis: {
            labels: {
                step: 2,
                style: {
                    color: "#383838",
                },
                formatter: function (): string {
                    return moment(this.value).format("MMMM YYYY");
                }
            },
        },
        yAxis: {
            opposite: true,
            title: {
                text: null
            },
            max: maxValue,
            min: minValue,
            labels: {
                align: 'right',
                x: 0,
            },
        },
        plotOptions: {
            area: {
                fillOpacity: 0.5,
                marker: {
                    enabled: false
                }
            },
        },
        tooltip: {
            headerFormat: "",
            pointFormat: '<span style="color:{point.color}">\u25CF <span style="color:"black""> {point.name} <b>{point.amount} EUR </span></span>'
        },
        credits: {
            enabled: false
        },
        series: options,
    }
}

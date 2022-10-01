import classNames from 'classnames';
import SvgImage from 'components/common/image/SvgImage';
import { AssetLinkComponent } from 'components/profile/common/AssetLinkComponent';
import { getAssetGroup, getColorOfAssetGroup } from 'components/profile/utils';
import { ReactNode, useState } from 'react';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import { numberFormat, quoteFormat } from 'utils';
import { AssetGroup, Portfolio, UploadFileRecord, UploadFileResponse } from "../../../../generated/graphql";
import { ConfirmModal } from '../MainSettingsModals/ConfirmModal';
import { ModalHeaderMeinFinanztreff } from '../ModalHeaderMeinFinanztreff';
import { UploadPDFFile } from './UploadPDFFile';

interface TransactionImportModalState {
    isOpen: boolean
    isDoneOpen: boolean,
    choosenPdf?: UploadFileResponse,
    allFiles?: UploadFileResponse[],
    successful: boolean
}

interface TransactionImportModalProps {
    onComplete?: () => void;
    portfolio: Portfolio
    children?: ReactNode;
    childClassName?: string;
}

export function TransactionImportModal(props: TransactionImportModalProps) {

    let [state, setState] = useState<TransactionImportModalState>({ isOpen: false, isDoneOpen: false, allFiles: undefined, choosenPdf: undefined, successful: true });
    const broker = "Deutsche Bank";

    const handleUploadFiles = (successful: boolean, files: UploadFileResponse[] | undefined) => { setState({ ...state, allFiles: files, successful: successful }); };
    const handleClose = () => setState({ ...state, isOpen: false, successful: true, allFiles: undefined });
    const handleChoosePdf = (value: UploadFileResponse) => setState({ ...state, choosenPdf: value })
    const startProcessAgain = () => { setState({ ...state, allFiles: undefined, successful: true }) };

    return (
        <>
            {props.children ?
                <div className={classNames("cursor-pointer mt-1", props.childClassName)} onClick={() => setState({ ...state, isOpen: true })}>{props.children}</div>
                :
                <Button variant="primary" className="bg-orange border-orange" onClick={() => setState({ ...state, isOpen: true })}>
                    <SvgImage icon={"icon_import_portfolioitem_white.svg"} convert={false} width="27" spanClass='pr-2 ml-n2 my-n2' />
                    <span className="line-height-1">Order-PDFs importieren</span>
                </Button>
            }
            <Modal show={state.isOpen} onHide={() => setState({ ...state, isOpen: false })} size="lg" className="fade modal-dialog-sky-placement">
                <ModalHeaderMeinFinanztreff close={handleClose} title={<><span className='d-none d-md-inline'>Wertpapier-</span>Transaktionen importieren</>} />

                {!state.allFiles ?
                    <Modal.Body className="pb-0">
                        <div className={classNames("bg-white mx-xl-n3 mx-lg-n2 mx-md-n2 mx-sm-n3 px-xl-3 px-lg-2 px-md-2 px-sm-3 pb-4", state.allFiles && "mb-4")} style={{ boxShadow: "0px 3px 6px #00000029" }}>
                            <Row className="px-xl-0 px-2">
                                <Col className="py-2 px-xl-3 px-2 font-weight-bold fs-15px border-bottom-2 border-top-2 border-gray-light">
                                    <span className="text-orange">Real Portfolio</span>
                                    <span> - {broker} - "{props.portfolio.name}"</span>
                                </Col>
                            </Row>
                            <>
                                <Row className="fs-15px py-5">
                                    <Col className="">
                                        <b>Hier können Sie Ihre Orderaufträge verschiedener Broker automatisch einlesen lassen.</b> <br />
                                        Es ist möglich bis zu 10 PDF-Dokumente in einem Import-Vorgang hochzuladen. Bitte achten Sie auf die richtige
                                        Reihenfolge von Käufen und Verkäufen um Fehlermeldungen zu vermeiden.
                                    </Col>
                                </Row>
                                <Row className="fs-18px pb-3">
                                    <Col className="font-weight-bold">
                                        Neues Pdf-Dokument hochladen
                                    </Col>
                                </Row>
                                <Row className="fs-15px pb-3">
                                    <Col xs={12} className="px-3 pdf-transaction-field">
                                        <UploadPDFFile handleUploadFiles={handleUploadFiles} portfolioId={props.portfolio.id} />
                                    </Col>
                                </Row>
                            </>
                        </div>
                    </Modal.Body>
                    :
                    !state.allFiles ?
                        <MoreThanTenFilesUpload broker={broker} portfolio={props.portfolio} startProcessAgain={startProcessAgain} close={handleClose} />
                        :
                        state.allFiles.filter(current => current.result.responseMessage === "Success").length === 0 ?
                            <NotSuccessfulUpload failCount={state.allFiles.length} broker={broker} portfolio={props.portfolio} startProcessAgain={startProcessAgain} close={handleClose} />
                            :
                            !state.choosenPdf ?
                                <ChooseDepot broker={broker} portfolio={props.portfolio} chooseInstruments={handleChoosePdf} files={state.allFiles} />
                                :
                                <ChooseInstrument broker={broker} portfolio={props.portfolio} close={handleClose} choosenPdf={state.choosenPdf} />

                }
            </Modal>
        </>
    );
}

interface UploadInstrumentCardState {
    memo?: string;
    checked: boolean;
}

function MoreThanTenFilesUpload({ broker, portfolio, startProcessAgain, close }: any) {
    return (
        <Modal.Body className="pb-0">
            <div className={classNames("bg-white mx-xl-n3 mx-lg-n2 mx-md-n2 mx-sm-n3 px-xl-3 px-lg-2 px-md-2 px-sm-3 pb-4")} style={{ boxShadow: "0px 3px 6px #00000029" }}>
                <Row className="px-xl-0 px-2">
                    <Col className="py-2 px-xl-3 px-2 font-weight-bold fs-15px border-bottom-2 border-top-2 border-gray-light">
                        <span className="text-orange">Real Portfolio</span>
                        <span> - {broker} - "{portfolio.name}"</span>
                    </Col>
                </Row>
                <Row className="mx-0 bg-pink mb-4 mt-5">
                    <Col md={1} xs={2} className="pl-2 mr-0 pr-0 my-auto">
                        <SvgImage icon={"icon_exclamation_mark_white.svg"} convert={false} width="27" spanClass='' />
                    </Col>
                    <Col md={11} xs={10} className='py-1 fs-15px text-white pl-0 ml-n3 font-weight-bold'>
                        Sie können maximal 10 Dokumente gleichzeitig hochladen. Bitte starten Sie den Prozess erneut und achten Sie auf die Anzahl der ausgewählten Dokumente.                    </Col>
                </Row>
                <Row>
                    <Col className="text-right">
                        <Button variant={"primary"} onClick={close} className="mr-2">Schließen</Button>
                        <Button variant={"primary"} onClick={startProcessAgain}>PDF Import erneut starten</Button>
                    </Col>
                </Row>
            </div>
        </Modal.Body>
    )
}

function NotSuccessfulUpload({ failCount, broker, portfolio, startProcessAgain, close }: any) {
    return (
        <Modal.Body>
            <div className={classNames("bg-white mx-xl-n3 mx-lg-n2 mx-md-n2 mx-sm-n3 px-xl-3 px-lg-2 px-md-2 px-sm-3 pb-3")} style={{ boxShadow: "0px 3px 6px #00000029" }}>
                <Row className="px-xl-0 px-2">
                    <Col className="py-2 px-xl-3 px-2 font-weight-bold fs-15px border-bottom-2 border-top-2 border-gray-light">
                        <span className="text-orange">Real Portfolio</span>
                        <span> - {broker} - "{portfolio.name}"</span>
                    </Col>
                </Row>
                <Row className="mx-0 bg-pink my-4">
                    <Col md={1} xs={2} className="pl-2 mr-0 pr-0 my-auto">
                        <SvgImage icon={"icon_exclamation_mark_white.svg"} convert={false} width="27" spanClass='' />
                    </Col>
                    <Col md={11} xs={10} className='py-1 fs-15px text-white pl-0 ml-n3'>
                        <b>Es konnten keine Dokumente erfolgreich importiert werden.</b> Um weitere Dokumente hinzuzufügen, können Sie diesen Prozess beliebig oft erneut aufrufen.
                    </Col>
                </Row>

            </div>
            <div className="bg-gray-light mx-xl-n3 mx-lg-n2 mx-md-n2 mx-sm-n3 px-xl-3 px-lg-2 px-md-2 px-sm-3 mb-4 mt-4">
                <Row className="mb-4">
                    <Col className="text-right">
                        <Button variant={"primary"} onClick={close} className="mr-2">Schließen</Button>
                        <Button variant={"primary"} onClick={startProcessAgain}>PDF Import erneut starten</Button>
                    </Col>
                </Row>
                <Row className='fs-15px font-weight-bold text-white pt-4'>
                    <Col className="mx-3 bg-pink" style={{ padding: "6px" }}>
                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_error_small_white.svg"} width="24" alt="" className="mt-n1" />
                        <span>{failCount} Dateien konnten nicht importiert werden</span>
                    </Col>
                </Row>
                <Row className=''>
                    {UNSUCCESSFULL_UPLOADS.map((current, index) =>
                        <Col xs={12} key={index} className="mt-3">
                            <div className="fs-15px font-weight-bold text-break">
                                {current.name}
                            </div>
                            <div className="fs-15px">
                                {current.errorMsg}
                            </div>
                        </Col>
                    )}
                </Row>
                <Row className=''>
                    <Col xs={12} className="my-3 fs-13px">
                        Beim Einlesen einiger Dokumente sind Fehler aufgetreten.
                        Möglicherweise haben wir Ihren Broker noch nicht im System oder es
                        gab Formatänderungen bei Ihrem Broker. Wenn Sie uns bei der Lösung dieses
                        Problems unterstützen möchten, wenden Sie sich bitte an <u>ccc@finanztreff.de</u>
                    </Col>
                </Row>
            </div>
        </Modal.Body>
    )
}

interface ChooseDepotProps {
    broker: string,
    portfolio: Portfolio,
    chooseInstruments: (value: UploadFileResponse) => void,
    files: UploadFileResponse[]
}

function ChooseDepot({ broker, portfolio, chooseInstruments, files }: ChooseDepotProps) {
    return (
        <Modal.Body className="pb-0">
            <div className={classNames("bg-white mx-xl-n3 mx-lg-n2 mx-md-n2 mx-sm-n3 px-xl-3 px-lg-2 px-md-2 px-sm-3 pb-4")} style={{ boxShadow: "0px 3px 6px #00000029" }}>
                <Row className="px-xl-0 px-2">
                    <Col className="py-2 px-xl-3 px-2 font-weight-bold fs-15px border-bottom-2 border-top-2 border-gray-light">
                        <span className="text-orange">Real Portfolio</span>
                        <span> - {broker} - "{portfolio.name}"</span>
                    </Col>
                </Row>
                <Row className="mx-0 bg-pink mt-5 mb-3">
                    <Col md={1} xs={2} className="pl-2 mr-0 pr-0 my-auto">
                        <SvgImage icon={"icon_exclamation_mark_white.svg"} convert={false} width="27" spanClass='' />
                    </Col>
                    <Col md={11} xs={10} className='py-1 fs-15px font-weight-bold text-white pl-0 ml-n3'>
                        In den hochgeladenen Dokumenten sind unterschiedliche Depotnummern vorhanden.<br /> Welches Depot möchten Sie mit diesem Real-Portfolio verknüpfen?
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    {
                        files.map((current, index) =>
                            <Col lg="2" xs="4" key={index} className='py-1 fs-15px font-weight-bold text-white'>
                                <Button onClick={() => chooseInstruments(current)}
                                    key={index} variant="primary" className=" bg-gray-light border-gray-light text-blue">{current.data?.accountNumber}</Button>
                            </Col>
                        )
                    }
                </Row>
            </div>
        </Modal.Body>
    )
}

interface ChooseInstrumentProps {
    broker: string,
    portfolio: Portfolio,
    close: () => void,
    choosenPdf: UploadFileResponse
}


function ChooseInstrument({ broker, portfolio, close, choosenPdf }: ChooseInstrumentProps) {

    let [isDoneOpen, setDoneOpen] = useState<boolean>(false);
    // let [choosenTransactions, setChoosenTransactions] = useState<UploadFileRecord & {memo?: string}[] | undefined>();
    // const handleSelectCard : (value: UploadFileRecord & {memo?: string} ) => {
    //     choosenTransactions?.filter(current => current)
    // };
    return (
        <>
            <Modal.Body className="pb-0">
                <div className={classNames("bg-white mx-xl-n3 mx-lg-n2 mx-md-n2 mx-sm-n3 px-xl-3 px-lg-2 px-md-2 px-sm-3 pb-4 mb-4")} style={{ boxShadow: "0px 3px 6px #00000029" }}>
                    <Row className="px-xl-0 px-2">
                        <Col className="py-2 px-xl-3 px-2 font-weight-bold fs-15px border-bottom-2 border-top-2 border-gray-light">
                            <span className="text-orange">Real Portfolio</span>
                            <span> - {broker} - "{portfolio.name}"</span>
                        </Col>
                    </Row>
                    <Row className="fs-15px py-3 mt-2">
                        <Col className="">
                            <b>Bitte wählen Sie die Transaktionen aus, die Sie hinzufügen möchten.</b> <br />
                            Sie können den Importprozess später jederzeit neu starten um weitere Dokumente hinzuzufügen.
                        </Col>
                    </Row>
                </div>
                <div className="bg-gray-light mx-xl-n3 mx-lg-n2 mx-md-n2 mx-sm-n3 px-xl-3 px-lg-2 px-md-2 px-sm-3 mb-4">

                    <Row className='fs-18px font-weight-bold'>
                        <Col>Transactiocionen zum Hinzufügen auswählen (- von)</Col>
                    </Row>
                    <Row className='px-2'>
                        {/* {
                            CARDS.map((card, index) =>
                                <Col lg={6} xs={12} key={index} className="p-2">
                                    <UploadInstrumentCard card={card} />
                                </Col>

                            )
                        } */}
                        <Col lg={6} xs={12} key={-1} className="p-2">
                            {choosenPdf.data && <UploadInstrumentCard card={choosenPdf.data} />}
                        </Col>
                    </Row>
                    <Row className='pt-2 pb-5'>
                        <Col className="text-right">
                            <Button variant="primary" onClick={() => setDoneOpen(true)}>
                                Ausgewählte Transaktionen importieren
                            </Button>
                        </Col>

                    </Row>
                    <Row className='fs-15px font-weight-bold text-white pt-4'>
                        <Col className="mx-3 bg-pink" style={{ padding: "6px" }}>
                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_error_small_white.svg"} width="24" alt="" className="mt-n1" />
                            <span>{choosenPdf.result.responseMessage !== "Success"} Dateien konnten nicht importiert werden</span>
                        </Col>
                    </Row>
                    <Row className=''>
                        {
                            UNSUCCESSFULL_UPLOADS.map((current, index) =>
                                <Col xs={12} key={index} className="mt-3">
                                    <div className="fs-15px font-weight-bold text-break">
                                        {current.name}
                                    </div>
                                    <div className="fs-15px">
                                        {current.errorMsg}
                                    </div>
                                </Col>
                            )
                        }
                    </Row>
                    <Row className=''>
                        <Col xs={12} className="my-3 fs-13px">
                            Beim Einlesen einiger Dokumente sind Fehler aufgetreten.
                            Möglicherweise haben wir Ihren Broker noch nicht im System oder es
                            gab Formatänderungen bei Ihrem Broker. Wenn Sie uns bei der Lösung dieses
                            Problems unterstützen möchten, wenden Sie sich bitte an <u>ccc@finanztreff.de</u>
                        </Col>
                    </Row>
                </div>


            </Modal.Body>
            {isDoneOpen &&
                <ConfirmModal title={""}
                    buttonName="Fertig"
                    text={<Container className="px-0 pb-2">
                        <Row className="my-3">
                            <Col className="text-center pr-0">
                                <SvgImage icon="icon_check_hook_green.svg" convert={false} width="53" />
                                <span className="font-weight-bold mt-3 fs-18px roboto-heading text-nowrap">PDF Import abgeschlossen</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='text-center'>
                                <b>6 Dokumente wurden erfolgreich importiert.</b><br /> Für weitere PDF-Importe können Sie den Prozess erneut starten.                            </Col>
                        </Row>
                    </Container>}
                    handleClose={() => { setDoneOpen(false); close(); }} isOpen={isDoneOpen} />
            }
        </>)
}

function UploadInstrumentCard({ card }: { card: UploadFileRecord }) {
    const [state, setState] = useState<UploadInstrumentCardState>({ memo: "", checked: false });

    return (<>
        <Container className="px-md-3 px-2" style={{ boxShadow: "0px 3px 6px #00000029" }}>
            <Row>
                <Col className="bg-white">
                    <Container className="p-2">
                        <Row className="fs-12px mb-1">
                            <span className="bg-green text-white" style={{ padding: "1px 7px" }}>{getOperationType(card.operationType).toUpperCase()}</span>
                        </Row>
                        <Row className="fs-15px mb-1 text-blue">
                            <AssetLinkComponent instrument={card.instrument} />
                        </Row>
                        <Row className="fs-13px mb-2">
                            <span className="mr-3 font-weight-bold" style={{ color: getColorOfAssetGroup(card.instrument?.group?.assetGroup || "") }}>
                                {getAssetGroup(card.instrument?.group?.assetGroup).toUpperCase()}
                            </span>
                            <span className="mr-3">
                                {card.instrument?.wkn}
                            </span>
                            <span>
                                {card.instrument?.isin}
                            </span>
                        </Row>
                        <Row className="fs-13px mb-3">
                            <span>
                                {getOperationType(card.operationType)} am <b>{quoteFormat(card.entryTime)}</b>; <b>{numberFormat(card.quantity)} Stück </b> zu <b>{card.price} {card.currencyCode} </b> an <b>{card.instrument?.exchange.name};</b> <b>Summe {numberFormat(card.price * card.quantity * card.currencyPrice)} EUR; Transaktionskosten {numberFormat(card.charges)} EUR</b>
                            </span>
                        </Row>
                        <Row className="">
                            <Col xs={1} className="svg-icon px-0">
                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_note.svg"} width="28" alt="" className="" />
                            </Col>
                            <Col xs={11} className="pl-2 pr-0">
                                <input className=" w-100 font-italic textarea-wrapper bg-gray-light border-0 rounded" maxLength={250} value={state.memo?.toString()} placeholder={state.memo?.toString() || "Notiz eingeben..."}
                                    onChange={control => setState({ ...state, memo: control.target.value })}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Col>
                <Col className="bg-gray-light px-0 text-center" style={{ flex: "0 0 41px" }} onClick={() => { setState({ ...state, checked: !state.checked }) }}>
                    {state.checked ?
                        <img src="/static/img/svg/icon_checkbox_checked_dark.svg" height="30" alt="" className="mt-1" />
                        :
                        <img src="/static/img/svg/icon_checkbox_unchecked_dark.svg" height="30" alt="" className="mt-1" />
                    }
                </Col>
            </Row>
        </Container>
    </>)
}

interface InstrumentCardsUpload {
    type: string
    assetGroup: string
    name: string
    wkn: string
    isin: string
    date: string
    quantity: number
    price: number
    priceCurrency: string
    exchangeName: string
    sum: number
    transactionCost: number
    memo?: string

}

interface UnsuccessfulUploads {
    name: string;
    errorMsg: string;
}

function getOperationType(value: string) {
    if (value === "BUY") {
        return "Kauf"
    }
    return "Verkauf"
}

const UNSUCCESSFULL_UPLOADS: UnsuccessfulUploads[] = [{
    name: "Direkt_Depot_8019351969_Abrechnung_Kauf_IE00B4L5YC18_Order_244588496_001_20220302.pdf",
    errorMsg: "Depotnummer stimmt nicht überein."
}, {
    name: "Direkt_Depot_8019351969_Abrechnung_Kauf_IE00B4L5YC18_Order_244588496_001_20220302.pdf",
    errorMsg: "Broker stimmt nicht überein"
}, {
    name: "Direkt_Depot_8019351969_Abrechnung_Kauf_IE00B4L5YC18_Order_244588496_001_20220302.pdf",
    errorMsg: "Unbekanntes Datei Format"
}, {
    name: "Direkt_Depot_8019351969_Abrechnung_Kauf_IE00B4L5YC18_Order_244588496_001_20220302.pdf",
    errorMsg: "Nicht genug Bestand für diesen Verkauf gefunden. Stellen Sie sicher dass Sie Ihre Dokumente in der richtigen Reihenfolge importieren."
}, {
    name: "Direkt_Depot_8019351969_Abrechnung_Kauf_IE00B4L5YC18_Order_244588496_001_20220302.pdf",
    errorMsg: "Transaktion in diesem Portfolio bereits vorhanden."
}];

const CARDS: InstrumentCardsUpload[] = [{
    type: "KAUF",
    assetGroup: AssetGroup.Knock,
    name: "iShsIII-MSCI EM U.ETF USD(Acc) Registered Shs Acc. USD o.N.",
    wkn: "A1EWWW",
    isin: "IE00B4L5YC18",
    date: "01.03.2022, 09:04:08 Uhr",
    quantity: 0.42173,
    price: 35.568,
    priceCurrency: "EUR",
    exchangeName: "Xetra",
    sum: 15.25,
    transactionCost: 3.54,
    memo: ""
}, {
    type: "KAUF",
    assetGroup: AssetGroup.Share,
    name: "iShsIII-MSCI EM U.ETF USD(Acc) Registered Shs Acc. USD o.N.",
    wkn: "A1EWWW",
    isin: "IE00B4L5YC18",
    date: "01.03.2022, 09:04:08 Uhr",
    quantity: 0.42173,
    price: 35.568,
    priceCurrency: "EUR",
    exchangeName: "Xetra",
    sum: 15.25,
    transactionCost: 3.54,
    memo: ""
}, {
    type: "KAUF",
    assetGroup: AssetGroup.Index,
    name: "iShsIII-MSCI EM U.ETF USD(Acc) Registered Shs Acc. USD o.N.",
    wkn: "A1EWWW",
    isin: "IE00B4L5YC18",
    date: "01.03.2022, 09:04:08 Uhr",
    quantity: 0.42173,
    price: 35.568,
    priceCurrency: "EUR",
    exchangeName: "Xetra",
    sum: 15.25,
    transactionCost: 3.54,
    memo: ""
}, {
    type: "VERKAUF",
    assetGroup: AssetGroup.Comm,
    name: "iShsIII-MSCI EM U.ETF USD(Acc) Registered Shs Acc. USD o.N.",
    wkn: "A1EWWW",
    isin: "IE00B4L5YC18",
    date: "01.03.2022, 09:04:08 Uhr",
    quantity: 0.42173,
    price: 35.568,
    priceCurrency: "EUR",
    exchangeName: "Xetra",
    sum: 15.25,
    transactionCost: 3.54,
    memo: ""
}, {
    type: "DIVIDENDE",
    assetGroup: AssetGroup.Fut,
    name: "iShsIII-MSCI EM U.ETF USD(Acc) Registered Shs Acc. USD o.N.",
    wkn: "A1EWWW",
    isin: "IE00B4L5YC18",
    date: "01.03.2022, 09:04:08 Uhr",
    quantity: 0.42173,
    price: 35.568,
    priceCurrency: "EUR",
    exchangeName: "Xetra",
    sum: 15.25,
    transactionCost: 3.54,
    memo: ""
}, {
    type: "KAUF",
    assetGroup: AssetGroup.Comm,
    name: "iShsIII-MSCI EM U.ETF USD(Acc) Registered Shs Acc. USD o.N.",
    wkn: "A1EWWW",
    isin: "IE00B4L5YC18",
    date: "01.03.2022, 09:04:08 Uhr",
    quantity: 0.42173,
    price: 35.568,
    priceCurrency: "EUR",
    exchangeName: "Xetra",
    sum: 15.25,
    transactionCost: 3.54,
    memo: ""
}]

{/* <span>Verkauf am {card.date}; {card.quantity} Stück zu {card.price} {card.priceCurrency} an {card.exchangeName}; Summe {card.sum} EUR; Transaktionskosten {card.transactionCost} EUR</span> */ }
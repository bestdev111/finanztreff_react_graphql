import { ProfileImportProcess } from 'components/profile/modals/profile-import/ProfileImportProcess';
import { useState } from 'react';

export function ImportAfterBanner() {
    const [state, setState] = useState<ImportAfterBannerState>({ isOpen: true });

    return (
        <main>
            {state.isOpen &&
                <>
                    <section className="main-section pt-0 d-flex d-sm-none d-lg-flex">
                        <div className="" style={{ width: "8px", backgroundColor: "#FF6600" }}></div>
                        <div className="container" style={{ backgroundColor: "white", boxShadow: "#00000029 0px 3px 6px", padding: "16px" }}>
                            <div className="d-flex justify-content-between">
                                <h2 className="section-heading font-weight-bold pl-0">Kennen wir uns?</h2>
                                <span className="close-modal-butt svg-icon d-flex" onClick={() => setState({ isOpen: false })} style={{ cursor: "pointer" }}>
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark.svg"} alt="" className="svg-convert svg-blue" />
                                </span>
                            </div>
                            <div className="row pl-0">
                                <div className="col" >
                                    <p className="font-weight-bold mt-2 mb-0">
                                        Sie sind bereits Nutzer des "alten" finanztreff?
                                    </p>
                                    <p className="mt-0 text-nowrap" style={{ maxWidth: "750px" }} >
                                        Im nächsten Schritt können Sie Ihre bestehenden Portfolios, Watchlisten und Limits importieren.
                                    </p>
                                </div>
                                <div className="col text-center my-2">
                                    <ProfileImportProcess>
                                        <img src="/static/img/svg/icon_liveportfolio_white_dark.svg" className="mx-2 my-2" alt="" /> finanztreff.de Portfolios importieren
                                    </ProfileImportProcess>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="main-section pt-0 d-flex d-lg-none d-sm-flex">
                        <div className="" style={{ width: "16px", backgroundColor: "#FF6600" }}></div>
                        <div className="container" style={{ backgroundColor: "white", boxShadow: "#00000029 0px 3px 6px", padding: "16px" }}>
                            <div className="d-flex justify-content-between">
                                <h5 className="section-heading font-weight-bold pl-0" style={{ fontSize: "16px" }}>Kennen wir uns?</h5>
                                <span className="close-modal-butt svg-icon d-flex" onClick={() => setState({ isOpen: false })} style={{ cursor: "pointer" }}>
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_dark.svg"} alt="" className="svg-convert svg-blue" />
                                </span>
                            </div>
                            <div className="row pl-0">
                                <div className="col" style={{ fontSize: "13px" }} >
                                    <p className="font-weight-bold mt-2 mb-0">
                                        Sie sind bereits Nutzer des "alten" finanztreff?
                                    </p>
                                    <p className="mt-0" style={{ maxWidth: "750px" }} >
                                        Im nächsten Schritt können Sie Ihre bestehenden Portfolios, Watchlisten und Limits importieren.
                                    </p>
                                </div>

                            </div>
                            <div className="row text-center pl-3">
                                <ProfileImportProcess>
                                    <img src="/static/img/svg/icon_liveportfolio_white_dark.svg" className="px-2" style={{ marginTop: "-4px", marginRight: "-10px" }} alt="" /> finanztreff.de Portfolios importieren
                                </ProfileImportProcess>
                            </div>
                        </div>
                    </section>
                </>
            }
        </main>
    );
}

interface ImportAfterBannerState {
    isOpen: boolean;
}



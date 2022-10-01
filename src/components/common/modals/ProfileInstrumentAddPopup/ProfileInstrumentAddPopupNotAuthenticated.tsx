import { Button } from "react-bootstrap";

export function ProfileInstrumentAddPopupNotAuthenticated(props: ProfileInstrumentAddPopupNotAuthenticatedProps) {
    return (
        <>
            <div className="content-row text-normal" style={{ lineHeight: "1.5", fontWeight: 400}}>
                <p className="text-pink mb-0">
                    Die finanztreff.de {props.text} steht nur angemeldeten Nutzern zur Verfügung.
                </p>
                <p className="fnt-size-13 mb-2">
                    Entdecken Sie diese und viele weitere nützliche Funktionen zur Beobachtung und Analyse Ihrer Wertpapiere im Bereich "Mein finanztreff"
                </p>
            </div>
            <div className="content-row">
                <div className="d-flex justify-content-between padding-bottom-8">
                    {props.onLogin &&
                        <div className="text-center">
                            <div className="fnt-size-12 pb-1">Bereits Nutzer?</div>
                            <Button className="btn-border-gray border-border-gray text-blue" onClick={() => props.onLogin && props.onLogin()}>Login</Button>
                        </div>
                    }
                    {props.onRegister &&
                        <div className="text-center">
                            <div className="fnt-size-12 pb-1">Neu hier?</div>
                            <Button className="btn btn-primary" onClick={() => props.onRegister && props.onRegister()}>Kostenlos registrieren</Button>
                        </div>
                    }
                </div>
            </div>
        </>
    );

}

export interface ProfileInstrumentAddPopupNotAuthenticatedProps {
    text: string;
    onLogin?: () => void;
    onRegister?: () => void;

}
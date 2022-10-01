import { ReactNode, useState } from 'react';
import { ProfileImportSynchronisation } from './';
import { ImportProgress } from './ImportProgress';
import { PortfolioImportAuthentication } from './PortfolioImportAuthentication'

export function ProfileImportProcess(props: ProfileImportProcessProps) {
    const [state, setState] = useState<ProfileImportProcessState>({
        step: 0,
        username: "",
        password: "",
        skip: true
    });

    const handleOpenInnerModal = (value: boolean) => setState({ ...state });
    const handleOpen = (value: boolean) => setState({ ...state, username: "", password: "" });

    const handleStep1 = (u: string, p: string) => {
        setState({ ...state, step: 2, username: u, password: p })
    };
    const handleStep2 = () => {
        setState({ ...state, step: 3 })
    };

    return (
        <>
            <button className="btn btn-primary px-2" onClick={() => setState({ ...state, step: 1 })}>
                {props.children}
            </button>
            { state.step == 1 &&
                <PortfolioImportAuthentication handleClose={handleStep1} handleAbort={() => setState({ ...state, step: 0})} isOpen={true} />
            }
            { state.step == 2 && state.username !== "" && state.password !== "" &&
                <ProfileImportSynchronisation isOpen={true}
                    username={state.username} password={state.password}
                    handleOuterModalOpen={handleOpen} handleOpen={handleOpenInnerModal} handleClose={handleStep2}/>
            }
            { state.step == 3 &&
                <ImportProgress isOpen={true} />
            }
        </>
    );
}

interface ProfileImportProcessProps {
    children: ReactNode
}

interface ProfileImportProcessState {
    step: number;
    username: string;
    password: string;
    skip: boolean
}
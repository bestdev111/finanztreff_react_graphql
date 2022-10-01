import { useQuery } from "@apollo/client";
import SvgImage from "components/common/image/SvgImage";
import { loader } from "graphql.macro";
import { Portfolio, Query } from "graphql/types";
import {ReactNode, useEffect, useState} from "react";
import { Button } from 'react-bootstrap';
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";
import { ExposeDepositModalBody } from "./AccountDeposit";

export function AccountWithdrawal(props: AccountWithdrawalProps) {

    let [open, setOpen] = useState<boolean>(false);

    let { data, loading } = useQuery<Query>(loader('./getOperationTypes.graphql'));

    useEffect(() => {
        if (open) {
            trigInfonline(guessInfonlineSection(), "withdraw_modal")
        }
    }, [open])

    return (
        <>
            <Button variant="pink" className="pl-n3" style={{width: props.customWidth ? props.customWidth : "29px"}} onClick={() => setOpen(true)}>
                <SvgImage icon="icon_minus_white.svg" spanClass="ml-n1" width="8" />
            </Button>
            {open && data && data.accountOperationTypes && <ExposeDepositModalBody onComplete={props.onComplete} accountOperationTypes={data.accountOperationTypes} handleClose={() => setOpen(false)} addToKonto={false} portfolio={props.portfolio} />}
        </>
    );

}
interface AccountWithdrawalProps {
    customWidth?: string;
    portfolio: Portfolio;
    onComplete: () => void;
    innerModal?: boolean;
    children?: ReactNode;
}

import {BondIssuer, CurrencyBucket} from "graphql/types";
import React from "react";
import {BondTypeOption} from "../utils";

export type BondSearchContextProps = {
    bondTypes: BondTypeOption[];
    bondIssuers: BondIssuer[];
    bondNominalCurrencies: CurrencyBucket[];
    bondTradingCurrencies: CurrencyBucket[];
}

const BondSearchContext = React.createContext<BondSearchContextProps | null>(null);

export default BondSearchContext;

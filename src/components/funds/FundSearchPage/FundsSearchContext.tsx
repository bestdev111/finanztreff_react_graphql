import { FundCurrency, FundRegion, FundStrategy, FundTopic } from "graphql/types";
import React from "react";
import {FundTypeOption} from "../utils";

export type FundsSearchContextProps = {
    fundTypes: FundTypeOption[];
    fundStrategies: FundStrategy[];
    fundTopics: FundTopic[];
    fundRegions: FundRegion[];
    fundCurrencies: FundCurrency[]
}

const FundsSearchContext = React.createContext<FundsSearchContextProps | null>(null);

export default FundsSearchContext;

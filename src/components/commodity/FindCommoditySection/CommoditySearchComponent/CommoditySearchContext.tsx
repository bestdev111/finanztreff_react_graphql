import {
    EtfAllocation,
    EtfIssuer, EtfPosition,
    EtfRegion,
    EtfReplication,
    EtfSector,
    EtfStrategy
} from "graphql/types";
import React from "react";
import { EtfTypeOption } from "components/etf/utils";
// import {EtfTypeOption} from "../utils";

export type CommoditySearchContextProps = {
}

const CommoditySearchContext = React.createContext<CommoditySearchContextProps | null>(null);

export default CommoditySearchContext;
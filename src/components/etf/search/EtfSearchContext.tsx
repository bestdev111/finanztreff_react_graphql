import {
    EtfAllocation,
    EtfIssuer, EtfPosition,
    EtfRegion,
    EtfReplication,
    EtfSector,
    EtfStrategy
} from "graphql/types";
import React from "react";
import {EtfTypeOption} from "../utils";

export type EtfSearchContextProps = {
    etfTypes: EtfTypeOption[];
    etfAllocations: EtfAllocation[];
    etfPositions: EtfPosition[];
    etfRegions: EtfRegion[];
    etfStrategies: EtfStrategy[];
    etfSectors: EtfSector[];
    etfReplications: EtfReplication[];
    etfIssuers: EtfIssuer[];
}

const EtfSearchContext = React.createContext<EtfSearchContextProps | null>(null);

export default EtfSearchContext;

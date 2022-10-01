import { trigInfonline, guessInfonlineSection } from "components/common/InfonlineService";
import { getAssetForUrl } from "components/profile/utils";
import { InstrumentGroup } from "graphql/types";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

export function CompanyProfileInformation(props: CompanyProfileInformationProps) {
    const pathParam = useParams<{ section: string, seoTag: string }>();

    return (
        <>
            <div className="d-flex justify-content-between">
                <h3 className="content-wrapper-heading font-weight-bold">Unternehmensprofil</h3>
            </div>
            <div className="content font-size-15px">
                <p> {props.text} </p>
                <div className="bottom-multi-links no-border d-flex justify-content-end">
                    <Link className="text-blue mt-1" to={"/" + getAssetForUrl(props.instrumentGroup.assetGroup).toLowerCase() + "/bilanz/" + pathParam.seoTag + "/"} onClick={() => { trigInfonline(guessInfonlineSection(), 'bilanz') }}>
                        Bilanz
                    </Link>
                    <Link className="text-blue ml-2 mt-1" to={"/" + getAssetForUrl(props.instrumentGroup.assetGroup).toLowerCase() + "/guv/" + pathParam.seoTag + "/"} onClick={() => { trigInfonline(guessInfonlineSection(), 'guvCashflow') }}>
                        GuV &amp; Cashflow
                    </Link>
                </div>
            </div>
        </>
    )
}

export interface CompanyProfileInformationProps {
    text: string;
    instrumentGroup: InstrumentGroup;
}

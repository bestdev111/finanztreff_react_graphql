import SvgImage from "components/common/image/SvgImage";
import { FundDocument } from "generated/graphql";
import { quoteFormat } from "utils";

export function FundDocumentsForDownload(props: { documents: FundDocument[] }) {
    if (props.documents.length > 0) {
        return (
            <div className="content-wrapper">
                <h2 className="border-bottom-4 border-gray-light content-wrapper-heading font-weight-bold pb-3">Fondsdokumente zum Download</h2>
                {props.documents.map(document => {
                    if (document.url && document.type && document.type.name)
                        return (
                            <div className="border-bottom-1 border-border-gray pb-2 d-flex justify-content-between">
                                <div>
                                    {document.creationDate &&
                                        <div className="">{quoteFormat(document.creationDate)}</div>
                                    }
                                    <div className=" font-weight-bold">{document.type.name}</div>
                                </div>
                                <a className="my-auto" href={document.url} target="_blank" rel="noreferrer">
                                    <SvgImage icon="icon_file_pdf_blue.svg" width="28" />
                                </a>
                            </div>
                        );
                    else {
                        return (<></>);
                    }
                })
                }
            </div>
        );
    }

    return (<></>);
}

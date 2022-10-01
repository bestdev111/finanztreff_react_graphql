import { useMutation } from "@apollo/client";
import { UPLOAD_FILE } from "components/profile/query";
import { Mutation } from "generated/graphql";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { forkJoin, Subject, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export function UploadPDFFile(props: { portfolioId: number, handleUploadFiles: (successful: boolean, files: Array<any> | undefined) => void }) {
    const [loading, setLoading] = useState<boolean>(false);
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'application/pdf',
        // maxFiles: 10,
        onDrop: (event: any[]) => {
            if (!!event && event.length < 10) {

                let observables =
                    event.map(file => {
                        let subject = new Subject<string>();
                        let reader = new FileReader();
                        reader.readAsBinaryString(file);
                        reader.onload = () => {
                            subject.next(btoa(reader.result as string || ""))
                            subject.complete();
                        };
                        return subject.asObservable()
                            .pipe(
                                mergeMap(item => from(runUpload(item)))
                            );
                    })
                setLoading(true);
                forkJoin([...observables])
                    .subscribe(array => {
                        setLoading(false);
                        props.handleUploadFiles(false, array.map(current => current.data?.uploadFile));
                    })
            }
            else {
                props.handleUploadFiles(false, undefined);
            }
        }
    });

    let [importProfile, { loading: mutationLoading }] = useMutation<Mutation>(UPLOAD_FILE);
    let runUpload = (file: string) => {
        return importProfile({
            variables:
            {
                portfolioId: props.portfolioId,
                fileContent: file,
                fileName: "blank"
            }
        })
    }

    return (
        <>
            <div {...getRootProps({ className: 'dropzone w-100 border-2 border-gray-lighten text-center py-5' })} style={{ border: "dotted" }}>
                {loading ?
                    <div style={{ height: "20px" }}><Spinner animation="border" /></div>
                    :
                    <>
                        <input type="file" {...getInputProps()} />
                        <span>
                            Dateien hier herziehen oder <span className="border-bottom-1 border-blue text-blue">hier klicken</span> zum hochladen
                        </span>
                    </>
                }
            </div>
        </>
    );
}
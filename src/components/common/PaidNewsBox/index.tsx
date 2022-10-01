import React from 'react';
import './index.scss'
import {useBootstrapBreakpoint} from "../../../hooks/useBootstrapBreakpoint";


export function PaidNewsBox() {
   const containerWidth = useBootstrapBreakpoint({
       xl: '410px',
       md: '365px',
       sm: '360px'
   })
    return (
        <>
            <div className={'paid-news-container  pl-md-2 px-xl-0 pl-xl-2 pt-2'} style={{width:containerWidth}}>
                <div className={'news-stories-area container-wrapper'}>
                    <iframe frameBorder="0"
                            className={'frameRef'}
                            allowFullScreen
                            src={'https://media.newstool.de/publishers/template/2f1d3c973e62435ebb49119dab7a26ad/html/'}
                            height={'100%'}
                            width={'100%'}
                            style={{overflow: 'hidden'}}
                    ></iframe>
                </div>
            </div>
        </>
    )

}

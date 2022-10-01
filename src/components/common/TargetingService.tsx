import { getDataForAssetAllocationPieCharts } from "components/profile/utils";
import { Portfolio, Watchlist } from "graphql/types";
import { data } from "highcharts";
import { stringify } from "querystring";

export function guessTargetingZone(){
    const currentPath = window.location.pathname
    if (currentPath.startsWith('/aktien/suche')) return 'aktien';
    if (currentPath.startsWith('/aktien/kurse/')) return 'aktien';
    if (currentPath.startsWith('/aktien')) return 'aktien';
    if (currentPath.startsWith('/fonds/suche/')) return "fonds";
    if (currentPath.startsWith('/fonds/kurse/')) return 'fonds';
    if (currentPath.startsWith('/hebelprodukte/')) return 'derivatives';
    if (currentPath.startsWith('/hebelprodukte/suche/')) return 'derivatives-suche';
    if (currentPath.startsWith('/hebelprodukte/kurse/')) return 'hebelprodukte';
    if (currentPath.startsWith('/zertifikate/kurse/')) return 'zertifikate';
    if (currentPath.startsWith('/optionsschein/kurse/')) return 'optionsschein';
    if (currentPath.startsWith('/indizes/kurse/')) return "indizes";
    if (currentPath.startsWith('/indizes')) return 'indizes';
    if (currentPath.startsWith('/anleihen/suche')) return "anleihen";
    if (currentPath.startsWith('/anleihen/kurse/')) return "anleihen";
    if (currentPath.startsWith("/news")) return "news";
    if (currentPath.startsWith('/analysen')) return "analysen";
    if (currentPath.startsWith('/etf/kurse/')) return "etf"
    if (currentPath.startsWith('/etf/suche/')) return "etf";
    if (currentPath.startsWith('/devisen/kurse/')) return "devisen"
    if (currentPath.startsWith('/devisen')) return "devisen";
    if (currentPath.startsWith('/rohstoffe/kurse/')) return "rohstoffe";
    if (currentPath.startsWith('/rohstoffe')) return "rohstoffe";
    if (currentPath.startsWith('/mein-finanztreff/portfolio/')) return "portfolio";
    if (currentPath.startsWith('/mein-finanztreff/watchlisten/')) return "watchlisten";
    if (currentPath.startsWith('/mein-finanztreff/limits')) return "limits";
    if (currentPath.startsWith('/mein-finanztreff/')) return "mein-finanztreff";
    return 'homepage';
}

export function generateRoSvariable(targetingZone: string){
    switch(targetingZone){
        case 'aktien' :  return 1;
        case 'fonds' : return 1;
        case 'derivatives' : return 1;
        case 'indizes' : return 1;
        case 'anleihen' : return 1;
        case 'news' : return 1;
        case 'analysen' : return 1;
        case 'etf' : return 1;
        case 'devisen' : return 1;
        case 'rohstoffe' : return 1;
        case 'mein-finanztreff' : return 1;
        case 'portfolio' : return 1;
        case 'watchlisten' : return 1;
        case 'limits' : return 1;
        default : return 1;
    }
}

export function generateLoginVariable(userLoggedIn: boolean | undefined){
    let userLoggedInVariable:number = 0;
    if(userLoggedIn && userLoggedIn !== undefined && userLoggedIn === true){
        userLoggedInVariable = 10;
    }else{
        userLoggedInVariable = 0;
    }
    return userLoggedInVariable;
}

export function generatePVariable(investmentSum: any, portfolioCounter: number){
    let secondVariable, pValue
    investmentSum = parseInt(investmentSum.replaceAll(',',''))
    if(portfolioCounter === 0) { secondVariable = 0 }
            if(investmentSum > 0 && investmentSum < 2500) { secondVariable = 0 }
            if(investmentSum > 2500 && investmentSum < 5000) { secondVariable = 1 }
            if(investmentSum > 5000 && investmentSum < 12500) { secondVariable = 2 }
            if(investmentSum > 12500 && investmentSum < 25000) { secondVariable = 3 }
            if(investmentSum > 25000 && investmentSum < 50000) { secondVariable = 4 }
            if(investmentSum > 50000 && investmentSum < 100000) { secondVariable = 5 }
            if(investmentSum > 100000 && investmentSum < 250000) { secondVariable = 6 }
            if(investmentSum > 250000) { secondVariable = 7 }
            pValue = [
                ...(investmentSum <= 0 || portfolioCounter === 0) ? ['n'] : ['p'],
                ...(investmentSum > 0) ? [secondVariable] : [],
            ]
            return pValue
}

export function generateDataArray(dataArray: any, watchlistDataArray: any){
    let typeArray :any[] = []
    dataArray.map((portfolio: Portfolio,i:number) => {
        getDataForAssetAllocationPieCharts("Gattung", portfolio.entries, portfolio).map((items: { color: string, name: string, y: number }[],index:number) => {
            typeArray = [...typeArray, items]
        })
    })
    let typArray: any[] = []
    typeArray.map((item: {color: string, name: string, y: number}) => {
        typArray = [...typArray,item.name]
    })
    let watchArray: any[] = []
    watchlistDataArray.map((watchlist: Watchlist, i:number) => {
        getDataForAssetAllocationPieCharts("Gattung", watchlist.entries).map((items: { color: string, name: string, y: number}[], index:number) => {
            watchArray = [...watchArray, items]
        })
    })
    let watchlistArray: any[] = []
    watchArray.map((item: { color: string, name: string, y: number }) => {
        watchlistArray = [...watchlistArray, item.name]
    })
    let mfDataArray: any[] = []
        typArray.map((item) => {
            if(item === 'Aktien' && !mfDataArray.includes('p_SHARE')){
                mfDataArray.push('p_SHARE')
            }
            if(item === 'ETF' && !mfDataArray.includes('p_ETF')){
                mfDataArray.push('p_ETF')
            }
            if(item === 'ETN' && !mfDataArray.includes('p_ETN')){
                mfDataArray.push('p_ETN')
            }
            if(item === 'Zertifikate' && !mfDataArray.includes('p_CERT')){
                mfDataArray.push('p_CERT')
            }
            if(item === 'Indizes' && !mfDataArray.includes('p_INDEX')){
                mfDataArray.push('p_INDEX')
            }
            if(item === 'Rohstoffe' && !mfDataArray.includes('p_COMM')){
                mfDataArray.push('p_COMM')
            }
            if(item === 'Fonds' && !mfDataArray.includes('p_FUND')){
                mfDataArray.push('p_FUND')
            }
            if(item === 'ETC' && !mfDataArray.includes('p_ETC')){
                mfDataArray.push('p_ETC')
            }
            if(item === 'Anleihen' && !mfDataArray.includes('p_BOND')){
                mfDataArray.push('p_BOND')
            }
            if(item === 'KO' && !mfDataArray.includes('p_KNOCK')){
                mfDataArray.push('p_KNOCK')
            }
            if(item === 'Devisen' && !mfDataArray.includes('p_CROSS')){
                mfDataArray.push('p_CROSS')
            }
            if(item === 'OS' && !mfDataArray.includes('p_WARR')){
                mfDataArray.push('p_WARR')
            }
        })
        watchlistArray.map((item) => {
            if(item === 'Aktien' && !mfDataArray.includes('w_SHARE')){
                mfDataArray.push('w_SHARE')
            }
            if(item === 'ETC' && !mfDataArray.includes('w_ETC')){
                mfDataArray.push('w_ETC')
            }
            if(item === 'ETF' && !mfDataArray.includes('w_ETF')){
                mfDataArray.push('w_ETF')
            }
            if(item === 'ETC' && !mfDataArray.includes('w_ETN')){
                mfDataArray.push('w_ETN')
            }
            if(item === 'Fonds' && !mfDataArray.includes('w_FUND')){
                mfDataArray.push('w_FUND')
            }
            if(item === 'Future' && !mfDataArray.includes('w_SHARE')){
                mfDataArray.push('w_SHARE')
            }
            if(item === 'Geldmarktsatz' && !mfDataArray.includes('w_FUND_MONEY_MARKET')){
                mfDataArray.push('w_FUND_MONEY_MARKET')
            }
            if(item === 'Immobilie' && !mfDataArray.includes('w_FUND_REAL_ESTATE')){
                mfDataArray.push('w_FUND_REAL_ESTATE')
            }
            if(item === 'Index' && !mfDataArray.includes('w_INDEX')){
                mfDataArray.push('w_INDEX')
            }
            if(item === 'KO' && !mfDataArray.includes('w_KNOCK')){
                mfDataArray.push('w_KNOCK')
            }
            if(item === 'Option' && !mfDataArray.includes('w_WARR')){
                mfDataArray.push('w_WARR')
            }
            if(item === 'OS' && !mfDataArray.includes('w_WARR')){
                mfDataArray.push('w_WARR')
            }
            if(item === 'Sonstige' && !mfDataArray.includes('w_CERT_OTHER')){
                mfDataArray.push('w_CERT_OTHER')
            }
            if(item === 'Währung' && !mfDataArray.includes('w_CROSS')){
                mfDataArray.push('w_CROSS')
            }
            if(item === 'Zertifikat' && !mfDataArray.includes('w_CERT')){
                mfDataArray.push('w_CERT')
            }
            if(item === 'Zinspapier' && !mfDataArray.includes('w_BOND')){
                mfDataArray.push('w_BOND')
            }
            if(item === 'Rohstoff' && !mfDataArray.includes('w_COMM')){
                mfDataArray.push('w_COMM')
            }
            // if(watchlistTypesListArray[i].innerHTML === 'Konjunkturdaten' && !mfDataArrayWatchlist.includes('w_FUND_REAL_ESTATE')){
            //     mfDataArrayWatchlist.push('w_FUND_REAL_ESTATE')
            // }
            // if(watchlistTypesListArray[i].innerHTML === 'MultiAsset' && !mfDataArrayWatchlist.includes('w_FUND_REAL_ESTATE')){
            //     mfDataArrayWatchlist.push('w_FUND_REAL_ESTATE')
            // }
        })
    return mfDataArray
}

export function generateTargetingObject(targetingZoneVariable: string, runOnSiteVariable: number, userLoggedInVariable: number, wknVariable?: any, isinVariable?: any, typeVariable?: any, pValue?: any, mfDataArray?: any){
    if(typeof pValue === 'string'){
        pValue = JSON.parse(pValue)
    }
    if(typeof mfDataArray === 'string'){
        mfDataArray = JSON.parse(mfDataArray);
    }
    let targetingObject = {
        ...(targetingZoneVariable) && {zone: targetingZoneVariable ? targetingZoneVariable : null},
        ...(runOnSiteVariable) && {ros: runOnSiteVariable ? runOnSiteVariable : null},
        ...(wknVariable) && {wkn: wknVariable ? wknVariable : null},
        ...(isinVariable) && {isin: isinVariable ? isinVariable : null},
        ...(typeVariable) && {typ: typeVariable ? typeVariable.toUpperCase() : null},
        ...{mf_login: userLoggedInVariable ? userLoggedInVariable : 0},
        ...(pValue) && {mf_pValue: pValue ? pValue : [null, null]},
        ...(mfDataArray) && {mf_data: mfDataArray ? mfDataArray : [null]}

    };
    return targetingObject
}
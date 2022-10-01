import { gql } from '@apollo/client'

const Instrument = {
    fragments: {
        fields: gql`
            fragment InstrumentFields on Instrument {
                id
                isin
                wkn
                name
                group {
                    id
                    assetGroup
                    seoTag
                    sector{
                        name
                    }
                    refCountry {
                        name
                    }
                }
                performance(period:[INTRADAY, WEEK1, MONTH1, MONTH6, WEEK52, YEAR3, YEAR5, YEAR10]) {
                    period
                    performance
                    vola
                    averagePrice
                }
                rangeCharts {
                    intraday {
                    min
                    max
                    current
                    threshold
                    }
                    year {
                    min
                    max
                    current
                    threshold
                    }
                }
                currency {
                    displayCode
                }
                exchange {
                    name
                    code
                }
                country {
                    name
                }
            }
        `
    }
};

const SnapQuote = {
    fragments: {
        fields: gql`
            fragment SnapQuoteFields on SnapQuote {
                instrumentId
                delay
                firstPrice
                lastPrice
                lowPrice
                highPrice
                yesterdayPrice
                cumulativeTurnover
                cumulativeVolume
                cumulativeTrades
                quotes {
                    type
                    value
                    percentChange
                    change
                    size
                    delay
                    when
                }
            }
        `
    }

};

const PortfolioEntry = {
    fragments: {
        fields: gql`
            fragment PortfolioEntryFields on PortfolioEntry {
                id
                name
                instrumentId
                instrumentGroupId
                quantity
                price
                buyCharges
                buyCurrencyPrice
                previousCurrencyPrice
                currentCurrencyPrice
                entryTime
                memo
                currencyCode
                nominalValue
                nominalCurrency
                instrument {
                    ...InstrumentFields
                }
                snapQuote {
                    ...SnapQuoteFields
                }
                intradayPrices {
                    data {
                        value
                    }
                }
            }
            ${Instrument.fragments.fields}
            ${SnapQuote.fragments.fields}
        `
    }
};

const WatchlistEntry = {
    fragments: {
        fields: gql`
            fragment WatchlistEntryFields on WatchlistEntry {
                id
                name
                price
                entryTime
                memo
                instrument {
                    ...InstrumentFields
                }
                snapQuote {
                    ...SnapQuoteFields
                }
            }
            ${Instrument.fragments.fields}
            ${SnapQuote.fragments.fields}
        `
    }
};

const AccountEntry = {
    fragments: {
        fields: gql`
            fragment AccountEntryFields on AccountEntry {
                id
                accountTypeId
                accountTypeDescriptionEn
                instrumentId
                portfolioEntryId
                instrument {
                    wkn
                    securityCategoryId
                    seoTag
                    group {
                        assetGroup
                        seoTag
                    }
                }           
                amount
                quantity
                memo
                securityDescription
                entryTime
            }
        `
    }
}

const Portfolio = {
    fragments: {
        fields: gql`
            fragment PortfolioFields on Portfolio {
                id
                real
                broker
                name
                inMasterPortfolio
                viewType
                viewOrder
                viewOrderAsc
                wd1
                wd2
                wd3
                wd4
                wd5
                wd6
                wd7
                eom
                wdTime
                memo
                portfolioAlert
                portfolioLowerLimit
                portfolioUpperLimit
                positionAlert
                positionLowerLimit
                positionUpperLimit
                entries {
                    ...PortfolioEntryFields
                }
                accountEntries {
                    ...AccountEntryFields
                }    
                performanceEntries {
                    value
                    date
                }
            }
            ${PortfolioEntry.fragments.fields}
            ${AccountEntry.fragments.fields}
        `
    }
}

const Watchlist = {
    fragments: {
        fields: gql`
            fragment WatchlistFields on Watchlist {
                id
                name
                inMasterPortfolio
                viewType
                viewOrder
                viewOrderAsc
                createdOn
                wd1
                wd2
                wd3
                wd4
                wd5
                wd6
                wd7
                eom
                wdTime
                memo
                entries {
                    ...WatchlistEntryFields
                }
            }
            ${WatchlistEntry.fragments.fields}
        `
    }
}

const Limit = {
    fragments: {
        fields: gql`
            fragment LimitEntryFields on LimitEntry {
                id
                instrumentId
                instrument {
                    id
                    isin
                    wkn
                    group {
                        id
                        seoTag
                        assetGroup
                    }
                    tickerSymbol
                    name
                    snapQuote {
                        lastChange
                        lastPrice
                        instrumentId
                        quotes {
                            value
                            change
                            percentChange
                            when
                            delay
                        }
                    }
                    currency {
                        displayCode
                        alphaCode
                    }
                    exchange {
                        id
                        name
                        code
                        openingTime
                        closingTime
                    }
                }
                trailing
                upper
                percent
                quoteType
                initialValue
                initialTime
                limitValue
                effectiveLimitValue
                hitValue
                hitStatus
                hitTime
                smsNotification
                mailNotification
                memo
            }
        `
    }
}

const DefaultServiceResponse = {
    fragments: {
        fields: gql`
            fragment DefaultServiceResponseFields on DefaultServiceResponse {
                id
                responseCode
                responseMessage
            }
        `
    }
}

export const GET_USER_PROFILE_COUNT = gql`
    query getProfileCount {
        user {
            username
            profile {
                id
                portfolios {
                    id
                }
                watchlists {
                    id
                }
                limits {
                    id
                }
            }
        }
    }
`;

export const GET_USER_PROFILE = gql`
    query getProfile {
        user {
            username
            profile {
                id
                portfolioViewType
                watchlistViewType
                limitViewType
                limitViewOrder
                limitViewOrderAsc
                portfolios {
                    ...PortfolioFields
                }
                watchlists {
                    ...WatchlistFields
                }
                limits {
                    ...LimitEntryFields
                }
            }
        }
    }
    ${Portfolio.fragments.fields}
    ${Watchlist.fragments.fields}
    ${Limit.fragments.fields}
`;

export const FETCH_USER_PROFILE_OVERVIEW = gql`
    query FetchProfileOverview($userName: String!, $password: String!) {
        fetchProfileOverview(userName: $userName, password: $password) {
            result {
                id
                responseCode
                responseMessage
            }
            data {
                portfolios {
                    id
                    name
                }
                watchlists {
                    id
                    name
                }
            }
        }
    }
`;

export const GET_USER_WATCHLISTS = gql`
    query getProfile {
        user {
            username
            profile {
                watchlistViewType
                watchlists {
                    ...WatchlistFields
                }
            }
        }
    }
    ${Watchlist.fragments.fields}
`;

export const GET_USER_PORTFOLIO = gql`
    query getPortfolio($portfolioId: Int!) {
        user {
            username
            profile {
                portfolioViewType
                portfolio (id: $portfolioId) {
                    ...PortfolioFields
                }
            }
        }
    }
    ${Portfolio.fragments.fields}
`;

export const CREATE_USER_WATCHLIST = gql`
    mutation AddNewWatchlist($name: String!) {
        createNewWatchlist(name: $name) {
            ...WatchlistFields
        }
    }
    ${Watchlist.fragments.fields}
`;

export const UPDATE_USER_WATCHLIST = gql`
    mutation UpdateWatchlist($entry: WatchlistUpdateRequest!) {
        updateWatchlist(entry: $entry) {
            ...WatchlistFields
        }
    }
    ${Watchlist.fragments.fields}
`;

export const RENAME_USER_WATCHLIST = gql`
    mutation RenameWatchlist($watchlistId: Long!, $newName: String!) {
        renameWatchlist(watchlistId: $watchlistId, newName: $newName) {
            ...WatchlistFields
        }
    }
    ${Watchlist.fragments.fields}
`;

export const DELETE_USER_WATCHLIST = gql`
    mutation DeleteWatchlist($watchlistId: Long!) {
        deleteWatchlist(watchlistId: $watchlistId) {
            ...DefaultServiceResponseFields
        }
    }
    ${DefaultServiceResponse.fragments.fields}
`;

export const CREATE_USER_PORTFOLIO = gql`
    mutation AddNewPortfolio($name: String!, $real: Boolean) {
        createNewPortfolio(name: $name, real: $real) {
            ...PortfolioFields
        }
    }
    ${Portfolio.fragments.fields}
`;

export const RENAME_USER_PORTFOLIO = gql`
    mutation RenamePortfolio($portfolioId: Long!, $newName: String!) {
        renamePortfolio(portfolioId: $portfolioId, newName: $newName) {
            ...PortfolioFields
        }
    }
    ${Portfolio.fragments.fields}
`;

export const UPDATE_USER_PORTFOLIO = gql`
    mutation UpdatePortfolio($entry: PortfolioUpdateRequest!) {
        updatePortfolio(entry: $entry) {
            ...PortfolioFields
        }
    }
    ${Portfolio.fragments.fields}
`;

export const UPDATE_USER_PORTFOLIO_ALERT = gql`
    mutation UpdatePortfolioAlert($entry: PortfolioAlertRequest!) {
        updatePortfolioAlert(entry: $entry) {
            ...PortfolioFields
        }
    }
    ${Portfolio.fragments.fields}
`;


export const CREATE_PORTFOLIO_ENTRY = gql`
    mutation createPortfolioEntry($portfolioId: Long!, $instrumentId: Long!, $price:Float!, $quantity:Float!, $charges: Float!, $entryTime: OffsetDateTime!, $memo:String, $currencyCode: String) {
        createPortfolioEntry(entry:{
            portfolioId: $portfolioId, instrumentId:$instrumentId, price:$price, quantity:$quantity, charges: $charges, entryTime: $entryTime, memo: $memo, currencyCode: $currencyCode
        }) {
            id
            name
            price
            quantity
            memo
        }
    }
`;

export const DELETE_USER_PORTFOLIO = gql`
    mutation DeletePortfolio($portfolioId: Long!) {
        deletePortfolio(portfolioId: $portfolioId) {
            ...DefaultServiceResponseFields
        }
    }
    ${DefaultServiceResponse.fragments.fields}
`;

export const PORTFOLIO_ENTRY_EDIT = gql`
    mutation EditPortfolioEntry($entry: EditPortfolioEntryRequest!) {
        editPortfolioEntry(entry: $entry) {
            ...PortfolioEntryFields
        }
    }
    ${PortfolioEntry.fragments.fields}
`;

export const PORTFOLIO_ENTRY_COPY = gql`
    mutation copyPortfolioEntry($fromPortfolioId: Long!, $portfolioEntryId: Long!, $toPortfolioId: Long!) {
        copyPortfolioEntry(fromPortfolioId: $fromPortfolioId, portfolioEntryId: $portfolioEntryId, toPortfolioId: $toPortfolioId) {
            ...PortfolioEntryFields
        }
    }
    ${PortfolioEntry.fragments.fields}
`;

export const PORTFOLIO_ENTRY_MOVE = gql`
    mutation movePortfolioEntry($fromPortfolioId: Long!, $portfolioEntryId: Long!, $toPortfolioId: Long!) {
        movePortfolioEntry(fromPortfolioId: $fromPortfolioId, portfolioEntryId: $portfolioEntryId, toPortfolioId: $toPortfolioId) {
            ...PortfolioEntryFields
        }
    }
    ${PortfolioEntry.fragments.fields}
`;

export const PORTFOLIO_DIVIDEND = gql`
    mutation AccountDividend($portfolioId: Long!, $portfolioEntryId: Long!, $amount: Float!, $entryTime: OffsetDateTime!, $currencyCode: String, $memo:String,) {
        accountDividend(entry: {portfolioId: $portfolioId, portfolioEntryId: $portfolioEntryId, amount: $amount, entryTime: $entryTime, currencyCode: $currencyCode, memo: $memo}) {
            ...AccountEntryFields
        }
    }
    ${AccountEntry.fragments.fields}
`;

export const EDIT_ACCOUNT_ENTRY = gql`
    mutation EditAccountEntry($portfolioId: Long!, $accountEntryId: Long!, $entry: AccountEntryInput!) {
        editAccountEntry(portfolioId: $portfolioId, accountEntryId: $accountEntryId, entry: $entry) {
            ...AccountEntryFields
        }
    }
    ${AccountEntry.fragments.fields}
`;

export const ADD_ACCOUNT_ENTRY = gql`
    mutation AddAccountEntry($portfolioId: Long!, $entry: AccountEntryInput!) {
        addAccountEntry(portfolioId: $portfolioId, entry: $entry) { 
            ...AccountEntryFields
        }
    }
    ${AccountEntry.fragments.fields}
`;

export const DELETE_ACCOUNT_ENTRY = gql`
    mutation DeleteAccountEntry($portfolioId: Long!, $accountEntryId: Long!) {
        deleteAccountEntry(portfolioId: $portfolioId, accountEntryId: $accountEntryId) {
            ...DefaultServiceResponseFields
        }
    }
    ${DefaultServiceResponse.fragments.fields}
`;

export const PORTFOLIO_ENTRY_DELETE = gql`
    mutation DeletePortfolioEntry($portfolioId: Long!, $portfolioEntryId: Long!) {
        deletePortfolioEntry(portfolioId: $portfolioId, portfolioEntryId: $portfolioEntryId) {
            ...DefaultServiceResponseFields
        }
    }
    ${DefaultServiceResponse.fragments.fields}
`;


export const PORTFOLIO_ENTRY_REMOVE = gql`
    mutation RemovePortfolioEntry($portfolioId: Long!, $portfolioEntryId: Long!, $amount: Float!, $date: OffsetDateTime!) {
        removePortfolioEntry(portfolioId: $portfolioId, portfolioEntryId: $portfolioEntryId, amount: $amount, date: $date ) {
            ...DefaultServiceResponseFields
        }
    }
    ${DefaultServiceResponse.fragments.fields}
`;

export const PORTFOLIO_ENTRY_SPLIT = gql`
    mutation SplitPortfolioEntry($entry: SplitPortfolioEntryRequest!) {
        splitPortfolioEntry(entry: $entry) {
            ...PortfolioEntryFields            
        }
    }
    ${PortfolioEntry.fragments.fields}
`;

export const WATCHLIST_ENTRY_EDIT = gql`
    mutation EditWatchlistEntry($entry: EditWatchlistEntryRequest!) {
        editWatchlistEntry(entry: $entry) {
            ...WatchlistEntryFields
        }
    }
    ${WatchlistEntry.fragments.fields}
`;

export const WATCHLIST_ENTRY_DELETE = gql`
    mutation DeleteWatchlistEntry($watchlistId: Long!, $watchlistEntryId: Long!) {
        deleteWatchlistEntry(watchlistId: $watchlistId, watchlistEntryId: $watchlistEntryId) {
            ...DefaultServiceResponseFields
        }
    }
    ${DefaultServiceResponse.fragments.fields}
`;

export const WATCHLIST_ENTRY_COPY = gql`
    mutation copyWatchlistEntry($fromWatchlistId: Long!, $watchlistEntryId: Long!, $toWatchlistId: Long!) {
        copyWatchlistEntry(fromWatchlistId: $fromWatchlistId, watchlistEntryId: $watchlistEntryId, toWatchlistId: $toWatchlistId) {
            ...WatchlistEntryFields
        }
    }
    ${WatchlistEntry.fragments.fields}
`;

export const WATCHLIST_ENTRY_MOVE = gql`
    mutation moveWatchlistEntry($fromWatchlistId: Long!, $watchlistEntryId: Long!, $toWatchlistId: Long!) {
        moveWatchlistEntry(fromWatchlistId: $fromWatchlistId, watchlistEntryId: $watchlistEntryId, toWatchlistId: $toWatchlistId) {
            ...WatchlistEntryFields
        }
    }
    ${WatchlistEntry.fragments.fields}
`;

export const CREATE_LIMIT_ENTRY = gql`
    mutation addLimit($entry: LimitEntryRequest!) {
        addLimit(entry: $entry) {
            ...LimitEntryFields
        }
    }
    ${Limit.fragments.fields}
`;

export const LIMIT_ENTRY_DELETE = gql`
    mutation deleteLimit($limitId: Long!) {
        deleteLimit(limitId: $limitId) {
            ...DefaultServiceResponseFields
        }
    }
    ${DefaultServiceResponse.fragments.fields}
`;

export const LIMIT_ENTRY_EDIT = gql`
    mutation editLimit($limitId: Long!, $entry: LimitEntryRequest!) {
        editLimit(limitId: $limitId, entry: $entry) {
            ...LimitEntryFields
        }
    }
    ${Limit.fragments.fields}
`;

export const IMPORT_PROFILE = gql`
    mutation ImportProfile($userName: String!, $password: String!, $portfolioFilter: [Long]!, $watchlistFilter:[Long]!, $includeLimits: Boolean!) {
        importProfile(userName: $userName, password: $password, portfolioFilter: $portfolioFilter, watchlistFilter: $watchlistFilter, includeLimits: $includeLimits) {
            ...DefaultServiceResponseFields
        }
    }
    ${DefaultServiceResponse.fragments.fields}
`;

export const UPLOAD_FILE = gql`
    mutation UploadFile($portfolioId: Long!, $fileContent: String!, $fileName: String) {
        uploadFile(portfolioId: $portfolioId, fileContent: $fileContent, fileName: $fileName){
            result {
                id
                responseCode
                responseMessage
            }
            data {
                id
                operationType
                accountNumber
                instrumentId
                instrument {
                    id
                    isin
                    wkn
                    name
                    seoTag
                    currency {
                        displayCode
                    }
                    exchange {
                        name
                        code
                    }
                    group{
                        assetGroup
                        seoTag
                    }
                    securityCategoryId
                    country {
                        name
                    }
                }
                quantity
                price
                charges
                currencyPrice
                entryTime
                currencyCode
            }
        }
    }
`;

export const IMPORT_PROFILE_CHECK = gql`
    query CheckProfile {
        checkProfile {
            ...DefaultServiceResponseFields
        }
    }
    ${DefaultServiceResponse.fragments.fields}
`;

export const GET_CURRENCY_PAIRS = gql`
    query CurrencyPairs($baseCode: String!) {
        currencyPairs(baseCode: $baseCode) {
            baseCurrency {
                id
                alphaCode
                name
            }
            quoteCurrency {
                id
                alphaCode
                name
            }
            group {
                id
            }
        }
    }
`;

export const GET_CURRENCY_QUOTE = gql`
    query CurrencyQuote($baseCode: String!, $quoteCode: String!) {
        currencyQuote(baseCode: $baseCode, quoteCode: $quoteCode) {
            instrumentId
            lastPrice
        }
    }
`;

export const GET_CURRENCY_HISTORY_QUOTE = gql`
    query CurrencyHistory($baseCode: String!, $quoteCode: String!, $time: OffsetDateTime!) {
        currencyHistory(baseCode: $baseCode, quoteCode: $quoteCode, time: $time) {
            lastPrice
        }
    }
`;


export const GET_PORTFOLIO_PERFORMANCE = gql`
    query PortfolioPerformance($id: Int!) {
        portfolioPerformance(id: $id) {
            value
            date
        }
    }
`;

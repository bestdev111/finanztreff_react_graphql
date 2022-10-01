import { gql } from '@apollo/client'

export const GET_HOME_LIST_INSTRUMENTS = gql`
    query getHomeListInstruments($listId: String!) {
        list(id: $listId) {
            id
            content {
                id
                name
                group {
                    id
                    name
                    seoTag
                    assetGroup
                }
                currency {
                    displayCode
                }
                exchange {
                    code
                }
                snapQuote {
                    lastChange
                    lowPrice
                    highPrice
                    instrumentId
                    quote(type:TRADE) {
                        value
                        percentChange
                    }
                }
                chart(scope: INTRADAY) {
                    id
                    series {
                    label
                    type
                    data {
                        value
                        when
                    }
                    }
                    threshold {
                    type
                    value
                    }
                }
            }
        }
    }
`

const ListResponse = {
    fragments: {
        fields: gql`
            fragment ListResponseFields on List {
                id
                content {
                    id
                    name
                    wkn
                    isin
                    keyFigures{
                        gearing
                        maxAnnualReturn
                    }
                    group {
                        id
                        name
                        seoTag
                        assetGroup
                        issuer {
                            name
                        }
                        derivative{
                            optionType
                        }
                        underlyings{
                            name
                            group{
                                seoTag
                                assetGroup
                            }
                            exchange{
                                name
                                code
                            }
                        }
                        underlying
                        assetClass{
                            name
                        }
                    }
                    chart(scope: INTRADAY) {
                        id
                        series {
                        label
                        type
                        data {
                            value
                            when
                        }
                        }
                        threshold {
                        type
                        value
                        }
                    }
                    currency {
                        displayCode
                    }
                    exchange {
                        code
                        delay
                    }
                    snapQuote {
                        lastChange
                        instrumentId
                        lowPrice
                        highPrice
                        cumulativeTrades
                        cumulativeTurnover
                        cumulativeVolume
                        quote(type:TRADE) {
                            delay
                            value
                            percentChange
                            change
                            when
                        }
                    }
                }
            }
        `
    }
}

export const GET_TOP_FLOP_DAX = gql`query {
    list(id:"dax") {
        id
        name
        content {
            group {
                id
                topFlop(limit: 10) {
                    instrument {
                        id
                        name
                        wkn
                        isin
                        group {
                            assetGroup
                            id
                            name
                            underlying
                            seoTag
                        }
                        currency {
                            displayCode
                        }
                        exchange {
                            delay
                            code
                        }
                    }
                    snapQuote {
                        lastChange
                        instrumentId
                        quote(type:TRADE) {
                            delay
                            value
                            percentChange
                            change
                            when
                        }
                    }
                }
            }
        }
    }
}`

export const GET_MOST_SEARCHED = gql`query {
    list(id: "most_searched_by_share") {
        id
        name
        content {
            id
            name
            wkn
            isin
            group {
                assetGroup
                id
                name
                underlying
            }
            currency {
                displayCode
            }
            exchange {
                code
                delay
            }
            snapQuote {
                lastChange
                instrumentId
                quote(type: TRADE) {
                    delay
                    value
                    percentChange
                    change
                    when
                }
            }
        }
    }
}`

export const GET_MOST_SEARCHED_BY_SHARE = gql`
    query getMostSearchedByShare {
        list(id: "most_searched_by_share") {
            ...ListResponseFields
        }
    }
    ${ListResponse.fragments.fields}
`

export const GET_MOST_SEARCHED_BY_WARR = gql`
    query getMostSearchedByWarr {
        list(id: "most_searched_by_warr") {
            ...ListResponseFields
        }
    }
    ${ListResponse.fragments.fields}
`

export const GET_MOST_SEARCHED_BY_CERT = gql`
    query getMostSearchedByCert {
        list(id: "most_searched_by_cert") {
            ...ListResponseFields
        }
    }
    ${ListResponse.fragments.fields}
`

export const GET_MOST_SEARCHED_BY_KNOCK = gql`
    query getMostSearchedByKnock {
        list(id: "most_searched_by_knock") {
            ...ListResponseFields
        }
    }
    ${ListResponse.fragments.fields}
`

export const GET_MOST_TRADED_BY_WARR = gql`
    query getMostTradedByWarr {
        list(id: "most_traded_by_warr") {
            ...ListResponseFields
        }
    }
    ${ListResponse.fragments.fields}
`

export const GET_MOST_TRADED_BY_KNOCK = gql`
    query getMostTradedByKnock {
        list(id: "most_traded_by_knock") {
            ...ListResponseFields
        }
    }
    ${ListResponse.fragments.fields}
`

export const GET_MOST_TRADED_BY_CERT = gql`
    query getMostTradedByCert {
        list(id: "most_traded_by_cert") {
            ...ListResponseFields
        }
    }
    ${ListResponse.fragments.fields}
`

export const GET_INSTRUMENTS_LIST = gql`
    query getInstrumentsList($id: String!) {
        list(id: $id) {
            ...ListResponseFields
        }
    }
    ${ListResponse.fragments.fields}
`

export const GET_ASSET_PAGE = gql`
    query getAssetPage($seoTag: String!) {
        assetPage(seoTag: $seoTag) {
            name
            assetGroup
            groupId
            robots {
                index
                follow
            }
        }
    }`

export const GET_INDEX_COMPOSITIONS = gql`
    query getIndexCompositions($groupId: Int!) {
        group(id: $groupId) {
            id
            name
            assetGroup
            compositions {
                id
                name
                delay
                exchange {
                    code
                    delay
                }
            }
        }
    }
`

export const GET_INDEX_COMPOSITION = gql`
    query getIndexComposition($groupId: Int!, $compositionId: Int!, $chartScope : ChartScope!) {
        group(id: $groupId) {
            id
            name
            assetGroup
            composition(compositionId:$compositionId) {
                id
                name
                currency {
                    displayCode
                }
                exchange {
                    code
                }
                entries {
                    id
                    name
                    wkn
                    marketCapitalization
                    currency {
                        displayCode
                    }
                    exchange {
                        code
                    }
                    group {
                        id
                        name
                        sector {
                            name
                        }
                        assetGroup
                        seoTag
                        estimates {
                            current {
                                priceToSalesRatio #KUV
                                priceToCashFlowRatio #KCV
                                priceToEarningsRatio # KGV
                                dividendYield
                            }
                        }
                    }
                    chart(scope: $chartScope) {
                        id
                        series {
                        label
                        type
                        data {
                            value
                            when
                        }
                        }
                        threshold {
                        type
                        value
                        }
                    }
                    snapQuote {
                        lastChange
                        instrumentId
                        cumulativeTurnover
                        cumulativeVolume
                        cumulativeTrades
                        quote(type:TRADE) {
                            delay
                            value
                            change
                            percentChange
                            when
                        }
                    }
                    performance(period:[WEEK1, MONTH1, MONTH6, WEEK52, YEAR3]) {
                        averagePrice
                        performance
                        period
                        vola
                    }
                    stats(periods:[WEEK1, MONTH1, MONTH6, WEEK52, YEAR3, ALL_TIME]) {
                        lowPrice
                        highPrice
                        deltaHighPrice
                        period
                    }
                    indicators {
                        movingAverage {
                            deltaLine200Day
                            line200Day
                        }
                        relativeStrengthIndex {
                            last25Days
                        }
                    }
                }
            }
        }
    }`

export const GET_STICKY_INSTRUMENTS = gql`
    query getStickyInstruments {
        list(id: "sticky_instruments") {
            id
            content {
                id
                exchange {
                    name 
                    code
                }
                group {
                    id
                    name
                    seoTag
                    assetGroup
                }
                snapQuote {
                    lastChange
                    instrumentId
                    quotes {
                        type
                        value
                        percentChange
                    }
                }
            }
        }
    }
`

export const GET_BEST_WARRANT = gql`
    query bestWarrantRnd($underlyingIsin: String!, $pctChange: Float!, $months: Long!) {
        bestWarrantRnd(underlyingIsin: $underlyingIsin, pctChange: $pctChange, months: $months)
        {
            issuerGroupId
            issuerName
            instrument {
                id
                isin
                wkn
                name
                seoTag
                currencyId
                countryId
                country {
                    name
                }
                snapQuote {
                    lastChange
                    instrumentId
                    quotes{
                        type
                        change
                        percentChange
                        value
                        when
                        size
                    }
                }
                keyFigures {
                    gearing
                }
                sectorId
                currency {
                    name
                }
                exchangeId
                exchange {
                    name
                }
                securityCategoryId
                tickerSymbol
                sector {
                    name
                }
                group {
                    id
                    seoTag
                    assetGroup
                    derivative {
                        optionType
                        issueDate
                        maturityDate
                    }
                    underlyings {
                        strike
                        currency {
                            displayCode
                        }
                    }
                    issuer {
                        id
                        name
                        partner
                    }
                }
                firstTradingDay
                lastTradingDay
            }
            
        }
    }
`

import { ResultCardMobileVersion } from "components/funds/FundSearchPage/ResultCards/ResultCardMobileVersion";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import InfiniteScroll from "components/common/scroller/InfiniteScroller";
import { EmmitentFilterModal } from './EmmitentFilterModal';
import { CommodityResultCard } from "./CommodityResultCard";

interface FundResultsProps {
    topic?: number | null;
    type?: number | null,
    region?: number | null,
    strategy?: number | null,
    currency?: number | null,
}

export function CommodityResultsModal(props: FundResultsProps) {
    const [state, setFilter] = useState<FiltersFundsModalState>({ distribution: undefined, plans: undefined, diverse: undefined, capitalHolder: undefined });

    let data = {
        searchFund: {
            edges: [
                {
                    cursor: "SToxMzg1NTg3MQ==",
                    node: {
                      id: 13855871,
                      isin: 'LU0794517200',
                      wkn: "A1J2RS",
                      main: false,
                      name: "Alpina Fund SICAV Sprott-Alpina Gold Equity UCITS Fund A (USD)",
                      groupId: 2510605,
                        currencyId: 195,
                        exchangeId: 342,
                        currency: {
                        id: 195
                        },
                      countryId: 189,
                      quoteHistory: {},
                      timeAndSales: {},
                      group: {
                        id: 2510605,
                        assetGroup: "FUND",
                        seoTag: "LU0794517200",
                        fundTranche: {
                          main: true,
                          germanVwlCapable: false,
                          distributing: true,
                          currency: {
                            name: "US-Dollar",
                            displayCode: "USD"
                          },
                          totalExpenseRatio: 2.01,
                          investmentVolume: {
                            date: "2022-01-14",
                            value: 409185.3
                          },
                          foundationDate: "2012-08-09",
                          srri: {
                            value: 7
                          }
                        },
                        assetType: {
                          name: "Aktien weltweit Werkstoffe"
                        },
                        fund: {
                          id: 6986,
                          region: null,
                          topic: {
                            name: "Werkstoffe"
                          },
                          currency: null,
                          type: {
                            name: "Aktienfonds"
                          },
                          strategy: null,
                          company: {
                            name: "Falcon Fund Management (Luxembourg) S.A."
                          }
                        }
                      },
                      exchange: {
                        id: 342,
                        name: "Schweiz"
                      },
                      snapQuote: {
                        quotes: []
                      },
                      performance: [
                        {
                            performance: 11.748,
                            deltaAveragePrice: -29.284976958525345
                        }
                      ],
                      stats: [
                        {
                            period: "WEEK52",
                            deltaHighPrice: -10.092165898617518
                          }
                      ]
                    }
                  },
                  {
                    cursor: "SToxMzg1NTg3MQ==",
                    node: {
                      id: 13855871,
                      isin: 'LU0794517200',
                      wkn: "A1J2RS",
                      main: false,
                      name: "Alpina Fund SICAV Sprott-Alpina Gold Equity UCITS Fund A (USD)",
                      groupId: 2510605,
                        currencyId: 195,
                        exchangeId: 342,
                        currency: {
                        id: 195
                        },
                      countryId: 189,
                      quoteHistory: {},
                      timeAndSales: {},
                      group: {
                        id: 2510605,
                        assetGroup: "FUND",
                        seoTag: "LU0794517200",
                        fundTranche: {
                          main: true,
                          germanVwlCapable: false,
                          distributing: true,
                          currency: {
                            name: "US-Dollar",
                            displayCode: "USD"
                          },
                          totalExpenseRatio: 3.01,
                          investmentVolume: {
                            date: "2022-01-14",
                            value: 321595.3
                          },
                          foundationDate: "2012-08-09",
                          srri: {
                            value: 7
                          }
                        },
                        assetType: {
                          name: "Aktien weltweit Werkstoffe"
                        },
                        fund: {
                          id: 6986,
                          region: null,
                          topic: {
                            name: "Werkstoffe"
                          },
                          currency: null,
                          type: {
                            name: "Aktienfonds"
                          },
                          strategy: null,
                          company: {
                            name: "Falcon Fund Management (Luxembourg) S.A."
                          }
                        }
                      },
                      exchange: {
                        id: 342,
                        name: "Schweiz"
                      },
                      snapQuote: {
                        quotes: []
                      },
                      performance: [],
                      stats: []
                    }
                  },
                  {
                    cursor: "SToxMzg1NTg3MQ==",
                    node: {
                      id: 13855871,
                      isin: 'LU0794517200',
                      wkn: "A1J2RS",
                      main: false,
                      name: "Alpina Fund SICAV Sprott-Alpina Gold Equity UCITS Fund A (USD)",
                      groupId: 2510605,
                        currencyId: 195,
                        exchangeId: 342,
                        currency: {
                        id: 195
                        },
                      countryId: 189,
                      quoteHistory: {},
                      timeAndSales: {},
                      group: {
                        id: 2510605,
                        assetGroup: "FUND",
                        seoTag: "LU0794517200",
                        fundTranche: {
                          main: true,
                          germanVwlCapable: false,
                          distributing: true,
                          currency: {
                            name: "US-Dollar",
                            displayCode: "USD"
                          },
                          totalExpenseRatio: -0.91,
                          investmentVolume: {
                            date: "2022-01-14",
                            value: 864915.3
                          },
                          foundationDate: "2012-08-09",
                          srri: {
                            value: 7
                          }
                        },
                        assetType: {
                          name: "Aktien weltweit Werkstoffe"
                        },
                        fund: {
                          id: 6986,
                          region: null,
                          topic: {
                            name: "Werkstoffe"
                          },
                          currency: null,
                          type: {
                            name: "Aktienfonds"
                          },
                          strategy: null,
                          company: {
                            name: "Falcon Fund Management (Luxembourg) S.A."
                          }
                        }
                      },
                      exchange: {
                        id: 342,
                        name: "Schweiz"
                      },
                      snapQuote: {
                        quotes: []
                      },
                      performance: [],
                      stats: []
                    }
                  }
            ],
            pageInfo: {
                endCursor: "SToxMjUwMzEyNg==",
                hasNextPage: true,
                hasPreviousPage: false,
                startCursor: "SToxMzg1NTg3MQ=="
            },
            count: 257
        }
    }

    function handleCapitalHolder(capitalHolder: { option?: string, optionId?: number }) {
        setFilter({ ...state, capitalHolder: capitalHolder })
    }

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between mt-xl-2 mt-lg-0 mt-md-2 mt-sm-n4">
                <h5 className="d-none d-xl-flex font-weight-bold my-auto"> {data?.searchFund.count} Ergebnisse </h5>
                <div className="d-flex">
                    <div className="d-none d-xl-flex d-md-flex d-sm-flex filters-funds mr-3">
                        <EmmitentFilterModal handleCapitalHolder={handleCapitalHolder} capitalHolder={state.capitalHolder}/>
                    </div>
                </div>
            </div>
            <InfiniteScroll
                style={{ overflowY: 'auto' }}
                className=""
                dataLength={data?.searchFund.edges.length || 0}
                hasMore={false}
                next={() => {}}
                loader={<div className="text-center" style={{ height: 25 }}><Spinner animation="border" size="sm" /></div>}
                height={500}
                scrollableTarget="instruments-search-result"
            >
                {
                    data?.searchFund.edges.map((fund, index) => {
                        return (<ResultCard fund={fund} key={index} />)
                    })
                }
            </InfiniteScroll>
        </div>
    )
}

export function ResultCard(props: { fund?: any }) {
    return (
        <>
            <CommodityResultCard fund={props.fund?.node} />
            <ResultCardMobileVersion fund={props.fund?.node} />
        </>
    );
}

interface FiltersFundsModalState {
    distribution?: {
        option?: string;
        id?: number;
    },
    plans?: {
        option?: string;
        id?: number;
    },
    diverse?: {
        option?: string;
        id?: number;
    },
    capitalHolder?: {
        option?: string;
        id?: number;
    },
}

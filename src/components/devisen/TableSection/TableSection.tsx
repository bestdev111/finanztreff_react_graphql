import classNames from "classnames";
import { loader } from "graphql.macro";
import { useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { RealtimeCrossratesTableMemoised } from "./RealtimeCrossratesTable";
import { CorrelationsTable } from "./CorrelationsTable";
import "./TableSection.scss";
import { arrayOfCellId, mockData } from "./GetCorrelationPairData";
import { columns, correlationMockData, correlationColumns } from "./TableData"
import { numberFormatDecimals } from "utils";
import { useQuery } from "@apollo/client/react/hooks/useQuery";
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";


interface TableSectionProps {
    test?: string
}

export function TableSection(props: TableSectionProps) {
    const [clickedId, setClickedId] = useState(0);

    const isMobile = useMediaQuery({
        query: '(max-width: 767px)'
    })
    var buttons =
        [
            {
                id: 0,
                name: 'Realtime-Matrix',
                disabled: false,
                ivwCode: "realtime_crossrates"
            },
            {
                id: 1,
                name: 'Korellationen',
                disabled: true,
                ivwCode: "Korellationen"
            },
        ]
        var mockData = GetCorrelationPairData().mockData1;
        var isLoading = GetCorrelationPairData().loading;

        function crossratesHandler (i: number, current: string) {
            setClickedId(i);
            trigInfonline(guessInfonlineSection(), current);
        }

    return (
        <section className="main-section" id="devisen-table-section">
            <Container>
                <div className="d-flex justify-content-between">
                    <h2 className="section-heading font-weight-bold">
                        Crossrates
                    </h2>
                    <div className="sub-navigation justify-content-between">
                        {
                            buttons.map((current, i) =>
                                <Button
                                    variant="link"
                                    key={current.id}
                                    name={current.name}
                                    className={classNames("fnt-size-16 font-weight-bold text-blue", clickedId === current.id ? 'active-table-button' : '')}
                                    onClick={() => crossratesHandler(i, current.ivwCode)}
                                    disabled={current.disabled}
                                >
                                    {isMobile === true && current.id === 0 ? current.name.slice(0, 8) : current.name}
                                </Button>
                            )
                        }
                    </div>
                </div>
                {
                    clickedId === 0 &&
                    <div className="main-section content-wrapper">
                        {
                            isLoading ? <><Spinner animation="border" /></> : <RealtimeCrossratesTableMemoised data={mockData} columns={columns}/>
                            
                        }
                    </div>
                }
                {
                    clickedId === 1 &&
                    <div className="main-section content-wrapper">
                        <CorrelationsTable data={correlationMockData} columns={correlationColumns} />
                    </div>
                }
            </Container>
        </section>
    );
}

export function GetCorrelationPairData() {
    var mockData1 = mockData.slice()
    const { data, loading } = useQuery(
        loader('./getCurrencyMatrix.graphql'),
        {
            variables: { id: "currency_matrix"},
            skip: (mockData1[9].zar !== '')
        }
    );
    function filterItems(items:any, searchVal:any) {
        return items.filter((item:any) => Object.values(item).includes(searchVal));
    }
    if(data){
        var copiedData = JSON.parse(JSON.stringify(data?.list.content))
        mockData1[0].eur = "-";
        mockData1[0].usd = (arrayOfCellId[1] > 0 && !!filterItems(copiedData, arrayOfCellId[1])[0] && !!filterItems(copiedData, arrayOfCellId[1])[0].snapQuote && filterItems(copiedData, arrayOfCellId[1])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[1])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[0].jpy = (arrayOfCellId[2] > 0 && !!filterItems(copiedData, arrayOfCellId[2])[0] && !!filterItems(copiedData, arrayOfCellId[2])[0].snapQuote && filterItems(copiedData, arrayOfCellId[2])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[2])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[0].gbp = (arrayOfCellId[3] > 0 && !!filterItems(copiedData, arrayOfCellId[3])[0] && !!filterItems(copiedData, arrayOfCellId[3])[0].snapQuote && filterItems(copiedData, arrayOfCellId[3])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[3])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[0].chf = (arrayOfCellId[4] > 0 && !!filterItems(copiedData, arrayOfCellId[4])[0] && !!filterItems(copiedData, arrayOfCellId[4])[0].snapQuote && filterItems(copiedData, arrayOfCellId[4])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[4])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[0].aud = (arrayOfCellId[5] > 0 && !!filterItems(copiedData, arrayOfCellId[5])[0] && !!filterItems(copiedData, arrayOfCellId[5])[0].snapQuote && filterItems(copiedData, arrayOfCellId[5])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[5])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[0].hkd = (arrayOfCellId[6] > 0 && !!filterItems(copiedData, arrayOfCellId[6])[0] && !!filterItems(copiedData, arrayOfCellId[6])[0].snapQuote && filterItems(copiedData, arrayOfCellId[6])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[6])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[0].rub = (arrayOfCellId[7] > 0 && !!filterItems(copiedData, arrayOfCellId[7])[0] && !!filterItems(copiedData, arrayOfCellId[7])[0].snapQuote && filterItems(copiedData, arrayOfCellId[7])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[7])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[0].zar = (arrayOfCellId[8] > 0 && !!filterItems(copiedData, arrayOfCellId[8])[0] && !!filterItems(copiedData, arrayOfCellId[8])[0].snapQuote && filterItems(copiedData, arrayOfCellId[8])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[8])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[0].cny = (arrayOfCellId[9] > 0 && !!filterItems(copiedData, arrayOfCellId[9])[0] && !!filterItems(copiedData, arrayOfCellId[9])[0].snapQuote && filterItems(copiedData, arrayOfCellId[9])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[9])[0].snapQuote.lastPrice || 0,5) : '--';
  
        mockData1[1].eur = (arrayOfCellId[10] > 0 && !!filterItems(copiedData, arrayOfCellId[10])[0] && !!filterItems(copiedData, arrayOfCellId[10])[0].snapQuote && filterItems(copiedData, arrayOfCellId[10])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[10])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[1].usd = "-";
        mockData1[1].jpy = (arrayOfCellId[12] > 0 && !!filterItems(copiedData, arrayOfCellId[12])[0] && !!filterItems(copiedData, arrayOfCellId[12])[0].snapQuote && filterItems(copiedData, arrayOfCellId[12])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[12])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[1].gbp = (arrayOfCellId[13] > 0 && !!filterItems(copiedData, arrayOfCellId[13])[0] && !!filterItems(copiedData, arrayOfCellId[13])[0].snapQuote && filterItems(copiedData, arrayOfCellId[13])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[13])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[1].chf = (arrayOfCellId[14] > 0 && !!filterItems(copiedData, arrayOfCellId[14])[0] && !!filterItems(copiedData, arrayOfCellId[14])[0].snapQuote &&filterItems(copiedData, arrayOfCellId[14])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[14])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[1].aud = (arrayOfCellId[15] > 0 && !!filterItems(copiedData, arrayOfCellId[15])[0] && !!filterItems(copiedData, arrayOfCellId[15])[0].snapQuote && filterItems(copiedData, arrayOfCellId[15])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[15])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[1].hkd = (arrayOfCellId[16] > 0 && !!filterItems(copiedData, arrayOfCellId[16])[0] && !!filterItems(copiedData, arrayOfCellId[16])[0].snapQuote && filterItems(copiedData, arrayOfCellId[16])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[16])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[1].rub = (arrayOfCellId[17] > 0 && !!filterItems(copiedData, arrayOfCellId[17])[0] && !!filterItems(copiedData, arrayOfCellId[17])[0].snapQuote && filterItems(copiedData, arrayOfCellId[17])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[17])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[1].zar = (arrayOfCellId[18] > 0 && !!filterItems(copiedData, arrayOfCellId[18])[0] && !!filterItems(copiedData, arrayOfCellId[18])[0].snapQuote && filterItems(copiedData, arrayOfCellId[18])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[18])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[1].cny = (arrayOfCellId[19] > 0 && !!filterItems(copiedData, arrayOfCellId[19])[0] && !!filterItems(copiedData, arrayOfCellId[19])[0].snapQuote && filterItems(copiedData, arrayOfCellId[19])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[19])[0].snapQuote.lastPrice || 0,5) : '--';
  
        mockData1[2].eur = (arrayOfCellId[20] > 0 && !!filterItems(copiedData, arrayOfCellId[20])[0] && !!filterItems(copiedData, arrayOfCellId[20])[0].snapQuote && filterItems(copiedData, arrayOfCellId[20])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[20])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[2].usd = (arrayOfCellId[21] > 0 && !!filterItems(copiedData, arrayOfCellId[21])[0] && !!filterItems(copiedData, arrayOfCellId[21])[0].snapQuote && filterItems(copiedData, arrayOfCellId[21])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[21])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[2].jpy = "-";
        mockData1[2].gbp = (arrayOfCellId[23] > 0 && !!filterItems(copiedData, arrayOfCellId[23])[0] && !!filterItems(copiedData, arrayOfCellId[23])[0].snapQuote && filterItems(copiedData, arrayOfCellId[23])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[23])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[2].chf = (arrayOfCellId[24] > 0 && !!filterItems(copiedData, arrayOfCellId[24])[0] && !!filterItems(copiedData, arrayOfCellId[24])[0].snapQuote && filterItems(copiedData, arrayOfCellId[24])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[24])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[2].aud = (arrayOfCellId[25] > 0 && !!filterItems(copiedData, arrayOfCellId[25])[0] && !!filterItems(copiedData, arrayOfCellId[25])[0].snapQuote && filterItems(copiedData, arrayOfCellId[25])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[25])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[2].hkd = (arrayOfCellId[26] > 0 && !!filterItems(copiedData, arrayOfCellId[26])[0] && !!filterItems(copiedData, arrayOfCellId[26])[0].snapQuote && filterItems(copiedData, arrayOfCellId[26])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[26])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[2].rub = (arrayOfCellId[27] > 0 && !!filterItems(copiedData, arrayOfCellId[27])[0] && !!filterItems(copiedData, arrayOfCellId[27])[0].snapQuote && filterItems(copiedData, arrayOfCellId[27])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[27])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[2].zar = (arrayOfCellId[28] > 0 && !!filterItems(copiedData, arrayOfCellId[28])[0] && !!filterItems(copiedData, arrayOfCellId[28])[0].snapQuote && filterItems(copiedData, arrayOfCellId[28])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[28])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[2].cny = (arrayOfCellId[29] > 0 && !!filterItems(copiedData, arrayOfCellId[29])[0] && !!filterItems(copiedData, arrayOfCellId[29])[0].snapQuote && filterItems(copiedData, arrayOfCellId[29])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[29])[0].snapQuote.lastPrice || 0,5) : '--';
  
        mockData1[3].eur = (arrayOfCellId[30] > 0 && !!filterItems(copiedData, arrayOfCellId[30])[0] && !!filterItems(copiedData, arrayOfCellId[30])[0].snapQuote && filterItems(copiedData, arrayOfCellId[30])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[30])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[3].usd = (arrayOfCellId[31] > 0 && !!filterItems(copiedData, arrayOfCellId[31])[0] && !!filterItems(copiedData, arrayOfCellId[31])[0].snapQuote && filterItems(copiedData, arrayOfCellId[31])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[31])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[3].jpy = (arrayOfCellId[32] > 0 && !!filterItems(copiedData, arrayOfCellId[32])[0] && !!filterItems(copiedData, arrayOfCellId[32])[0].snapQuote && filterItems(copiedData, arrayOfCellId[32])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[32])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[3].gbp = "-";
        mockData1[3].chf = (arrayOfCellId[34] > 0 && !!filterItems(copiedData, arrayOfCellId[34])[0] && !!filterItems(copiedData, arrayOfCellId[34])[0].snapQuote && filterItems(copiedData, arrayOfCellId[34])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[34])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[3].aud = (arrayOfCellId[35] > 0 && !!filterItems(copiedData, arrayOfCellId[35])[0] && !!filterItems(copiedData, arrayOfCellId[35])[0].snapQuote && filterItems(copiedData, arrayOfCellId[35])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[35])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[3].hkd = (arrayOfCellId[36] > 0 && !!filterItems(copiedData, arrayOfCellId[36])[0] && !!filterItems(copiedData, arrayOfCellId[36])[0].snapQuote && filterItems(copiedData, arrayOfCellId[36])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[36])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[3].rub = (arrayOfCellId[37] > 0 && !!filterItems(copiedData, arrayOfCellId[37])[0] && !!filterItems(copiedData, arrayOfCellId[37])[0].snapQuote && filterItems(copiedData, arrayOfCellId[37])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[37])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[3].zar = (arrayOfCellId[38] > 0 && !!filterItems(copiedData, arrayOfCellId[38])[0] && !!filterItems(copiedData, arrayOfCellId[38])[0].snapQuote && filterItems(copiedData, arrayOfCellId[38])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[38])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[3].cny = (arrayOfCellId[39] > 0 && !!filterItems(copiedData, arrayOfCellId[39])[0] && !!filterItems(copiedData, arrayOfCellId[39])[0].snapQuote && filterItems(copiedData, arrayOfCellId[39])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[39])[0].snapQuote.lastPrice || 0,5) : '--';
  
        mockData1[4].eur = (arrayOfCellId[40] > 0 && !!filterItems(copiedData, arrayOfCellId[40])[0] && !!filterItems(copiedData, arrayOfCellId[40])[0].snapQuote && filterItems(copiedData, arrayOfCellId[40])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[40])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[4].usd = (arrayOfCellId[41] > 0 && !!filterItems(copiedData, arrayOfCellId[41])[0] && !!filterItems(copiedData, arrayOfCellId[41])[0].snapQuote && filterItems(copiedData, arrayOfCellId[41])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[41])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[4].jpy = (arrayOfCellId[42] > 0 && !!filterItems(copiedData, arrayOfCellId[42])[0] && !!filterItems(copiedData, arrayOfCellId[42])[0].snapQuote && filterItems(copiedData, arrayOfCellId[42])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[42])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[4].gbp = (arrayOfCellId[43] > 0 && !!filterItems(copiedData, arrayOfCellId[43])[0] && !!filterItems(copiedData, arrayOfCellId[43])[0].snapQuote && filterItems(copiedData, arrayOfCellId[43])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[43])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[4].chf = "-";
        mockData1[4].aud = (arrayOfCellId[45] > 0 && !!filterItems(copiedData, arrayOfCellId[45])[0] && !!filterItems(copiedData, arrayOfCellId[45])[0].snapQuote && filterItems(copiedData, arrayOfCellId[45])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[45])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[4].hkd = (arrayOfCellId[46] > 0 && !!filterItems(copiedData, arrayOfCellId[46])[0] && !!filterItems(copiedData, arrayOfCellId[46])[0].snapQuote && filterItems(copiedData, arrayOfCellId[46])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[46])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[4].rub = (arrayOfCellId[47] > 0 && !!filterItems(copiedData, arrayOfCellId[47])[0] && !!filterItems(copiedData, arrayOfCellId[47])[0].snapQuote && filterItems(copiedData, arrayOfCellId[47])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[47])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[4].zar = (arrayOfCellId[48] > 0 && !!filterItems(copiedData, arrayOfCellId[48])[0] && !!filterItems(copiedData, arrayOfCellId[48])[0].snapQuote && filterItems(copiedData, arrayOfCellId[48])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[48])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[4].cny = (arrayOfCellId[49] > 0 && !!filterItems(copiedData, arrayOfCellId[49])[0] && !!filterItems(copiedData, arrayOfCellId[49])[0].snapQuote && filterItems(copiedData, arrayOfCellId[49])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[49])[0].snapQuote.lastPrice || 0,5) : '--';
  
        mockData1[5].eur = (arrayOfCellId[50] > 0 && !!filterItems(copiedData, arrayOfCellId[50])[0] && !!filterItems(copiedData, arrayOfCellId[50])[0].snapQuote && filterItems(copiedData, arrayOfCellId[50])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[50])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[5].usd = (arrayOfCellId[51] > 0 && !!filterItems(copiedData, arrayOfCellId[51])[0] && !!filterItems(copiedData, arrayOfCellId[51])[0].snapQuote && filterItems(copiedData, arrayOfCellId[51])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[51])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[5].jpy = (arrayOfCellId[52] > 0 && !!filterItems(copiedData, arrayOfCellId[52])[0] && !!filterItems(copiedData, arrayOfCellId[52])[0].snapQuote && filterItems(copiedData, arrayOfCellId[52])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[52])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[5].gbp = (arrayOfCellId[53] > 0 && !!filterItems(copiedData, arrayOfCellId[53])[0] && !!filterItems(copiedData, arrayOfCellId[53])[0].snapQuote && filterItems(copiedData, arrayOfCellId[53])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[53])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[5].chf = (arrayOfCellId[54] > 0 && !!filterItems(copiedData, arrayOfCellId[54])[0] && !!filterItems(copiedData, arrayOfCellId[54])[0].snapQuote && filterItems(copiedData, arrayOfCellId[54])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[54])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[5].aud = "-";
        mockData1[5].hkd = (arrayOfCellId[56] > 0 && !!filterItems(copiedData, arrayOfCellId[56])[0] && !!filterItems(copiedData, arrayOfCellId[56])[0].snapQuote && filterItems(copiedData, arrayOfCellId[56])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[56])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[5].rub = (arrayOfCellId[57] > 0 && !!filterItems(copiedData, arrayOfCellId[57])[0] && !!filterItems(copiedData, arrayOfCellId[57])[0].snapQuote && filterItems(copiedData, arrayOfCellId[57])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[57])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[5].zar = (arrayOfCellId[58] > 0 && !!filterItems(copiedData, arrayOfCellId[58])[0] && !!filterItems(copiedData, arrayOfCellId[58])[0].snapQuote && filterItems(copiedData, arrayOfCellId[58])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[58])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[5].cny = (arrayOfCellId[59] > 0 && !!filterItems(copiedData, arrayOfCellId[59])[0] && !!filterItems(copiedData, arrayOfCellId[59])[0].snapQuote && filterItems(copiedData, arrayOfCellId[59])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[59])[0].snapQuote.lastPrice || 0,5) : '--';
  
        mockData1[6].eur = (arrayOfCellId[60] > 0 && !!filterItems(copiedData, arrayOfCellId[60])[0] && !!filterItems(copiedData, arrayOfCellId[60])[0].snapQuote && filterItems(copiedData, arrayOfCellId[60])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[60])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[6].usd = (arrayOfCellId[61] > 0 && !!filterItems(copiedData, arrayOfCellId[61])[0] && !!filterItems(copiedData, arrayOfCellId[61])[0].snapQuote && filterItems(copiedData, arrayOfCellId[61])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[61])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[6].jpy = (arrayOfCellId[62] > 0 && !!filterItems(copiedData, arrayOfCellId[62])[0] && !!filterItems(copiedData, arrayOfCellId[62])[0].snapQuote && filterItems(copiedData, arrayOfCellId[62])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[62])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[6].gbp = (arrayOfCellId[63] > 0 && !!filterItems(copiedData, arrayOfCellId[63])[0] && !!filterItems(copiedData, arrayOfCellId[63])[0].snapQuote && filterItems(copiedData, arrayOfCellId[63])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[63])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[6].chf = (arrayOfCellId[64] > 0 && !!filterItems(copiedData, arrayOfCellId[64])[0] && !!filterItems(copiedData, arrayOfCellId[64])[0].snapQuote && filterItems(copiedData, arrayOfCellId[64])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[64])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[6].aud = (arrayOfCellId[65] > 0 && !!filterItems(copiedData, arrayOfCellId[65])[0] && !!filterItems(copiedData, arrayOfCellId[65])[0].snapQuote && filterItems(copiedData, arrayOfCellId[65])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[65])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[6].hkd = "-";
        mockData1[6].rub = (arrayOfCellId[67] > 0 && !!filterItems(copiedData, arrayOfCellId[67])[0] && !!filterItems(copiedData, arrayOfCellId[67])[0].snapQuote && filterItems(copiedData, arrayOfCellId[67])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[67])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[6].zar = (arrayOfCellId[68] > 0 && !!filterItems(copiedData, arrayOfCellId[68])[0] && !!filterItems(copiedData, arrayOfCellId[68])[0].snapQuote && filterItems(copiedData, arrayOfCellId[68])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[68])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[6].cny = (arrayOfCellId[69] > 0 && !!filterItems(copiedData, arrayOfCellId[69])[0] && !!filterItems(copiedData, arrayOfCellId[69])[0].snapQuote && filterItems(copiedData, arrayOfCellId[69])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[69])[0].snapQuote.lastPrice || 0,5) : '--';
  
        mockData1[7].eur = (arrayOfCellId[70] > 0 && !!filterItems(copiedData, arrayOfCellId[70])[0] && !!filterItems(copiedData, arrayOfCellId[70])[0].snapQuote && filterItems(copiedData, arrayOfCellId[70])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[70])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[7].usd = (arrayOfCellId[71] > 0 && !!filterItems(copiedData, arrayOfCellId[71])[0] && !!filterItems(copiedData, arrayOfCellId[71])[0].snapQuote && filterItems(copiedData, arrayOfCellId[71])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[71])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[7].jpy = (arrayOfCellId[72] > 0 && !!filterItems(copiedData, arrayOfCellId[72])[0] && !!filterItems(copiedData, arrayOfCellId[72])[0].snapQuote && filterItems(copiedData, arrayOfCellId[72])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[72])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[7].gbp = (arrayOfCellId[73] > 0 && !!filterItems(copiedData, arrayOfCellId[73])[0] && !!filterItems(copiedData, arrayOfCellId[73])[0].snapQuote && filterItems(copiedData, arrayOfCellId[73])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[73])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[7].chf = (arrayOfCellId[74] > 0 && !!filterItems(copiedData, arrayOfCellId[74])[0] && !!filterItems(copiedData, arrayOfCellId[74])[0].snapQuote && filterItems(copiedData, arrayOfCellId[74])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[74])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[7].aud = (arrayOfCellId[75] > 0 && !!filterItems(copiedData, arrayOfCellId[75])[0] && !!filterItems(copiedData, arrayOfCellId[75])[0].snapQuote && filterItems(copiedData, arrayOfCellId[75])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[75])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[7].hkd = (arrayOfCellId[76] > 0 && !!filterItems(copiedData, arrayOfCellId[76])[0] && !!filterItems(copiedData, arrayOfCellId[76])[0].snapQuote && filterItems(copiedData, arrayOfCellId[76])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[76])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[7].rub = "-";
        mockData1[7].zar = (arrayOfCellId[78] > 0 && !!filterItems(copiedData, arrayOfCellId[78])[0] && !!filterItems(copiedData, arrayOfCellId[78])[0].snapQuote && filterItems(copiedData, arrayOfCellId[78])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[78])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[7].cny = (arrayOfCellId[79] > 0 && !!filterItems(copiedData, arrayOfCellId[79])[0] && !!filterItems(copiedData, arrayOfCellId[79])[0].snapQuote && filterItems(copiedData, arrayOfCellId[79])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[79])[0].snapQuote.lastPrice || 0,5) : '--';
  
        mockData1[8].eur = (arrayOfCellId[80] > 0 && !!filterItems(copiedData, arrayOfCellId[80])[0] && !!filterItems(copiedData, arrayOfCellId[80])[0].snapQuote && filterItems(copiedData, arrayOfCellId[80])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[80])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[8].usd = (arrayOfCellId[81] > 0 && !!filterItems(copiedData, arrayOfCellId[81])[0] && !!filterItems(copiedData, arrayOfCellId[81])[0].snapQuote && filterItems(copiedData, arrayOfCellId[81])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[81])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[8].jpy = (arrayOfCellId[82] > 0 && !!filterItems(copiedData, arrayOfCellId[82])[0] && !!filterItems(copiedData, arrayOfCellId[82])[0].snapQuote && filterItems(copiedData, arrayOfCellId[82])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[82])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[8].gbp = (arrayOfCellId[83] > 0 && !!filterItems(copiedData, arrayOfCellId[83])[0] && !!filterItems(copiedData, arrayOfCellId[83])[0].snapQuote && filterItems(copiedData, arrayOfCellId[83])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[83])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[8].chf = (arrayOfCellId[84] > 0 && !!filterItems(copiedData, arrayOfCellId[84])[0] && !!filterItems(copiedData, arrayOfCellId[84])[0].snapQuote && filterItems(copiedData, arrayOfCellId[84])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[84])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[8].aud = (arrayOfCellId[85] > 0 && !!filterItems(copiedData, arrayOfCellId[85])[0] && !!filterItems(copiedData, arrayOfCellId[85])[0].snapQuote && filterItems(copiedData, arrayOfCellId[85])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[85])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[8].hkd = (arrayOfCellId[86] > 0 && !!filterItems(copiedData, arrayOfCellId[86])[0] && !!filterItems(copiedData, arrayOfCellId[86])[0].snapQuote && filterItems(copiedData, arrayOfCellId[86])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[86])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[8].rub = (arrayOfCellId[87] > 0 && !!filterItems(copiedData, arrayOfCellId[87])[0] && !!filterItems(copiedData, arrayOfCellId[87])[0].snapQuote && filterItems(copiedData, arrayOfCellId[87])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[87])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[8].zar = "-";
        mockData1[8].cny = (arrayOfCellId[89] > 0 && !!filterItems(copiedData, arrayOfCellId[89])[0] && !!filterItems(copiedData, arrayOfCellId[89])[0].snapQuote && filterItems(copiedData, arrayOfCellId[89])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[89])[0].snapQuote.lastPrice || 0,5) : '--';
  
        mockData1[9].eur = (arrayOfCellId[90] > 0 && !!filterItems(copiedData, arrayOfCellId[90])[0] && !!filterItems(copiedData, arrayOfCellId[90])[0].snapQuote && filterItems(copiedData, arrayOfCellId[90])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[90])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[9].usd = (arrayOfCellId[91] > 0 && !!filterItems(copiedData, arrayOfCellId[91])[0] && !!filterItems(copiedData, arrayOfCellId[91])[0].snapQuote && filterItems(copiedData, arrayOfCellId[91])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[91])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[9].jpy = (arrayOfCellId[92] > 0 && !!filterItems(copiedData, arrayOfCellId[92])[0] && !!filterItems(copiedData, arrayOfCellId[92])[0].snapQuote && filterItems(copiedData, arrayOfCellId[92])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[92])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[9].gbp = (arrayOfCellId[93] > 0 && !!filterItems(copiedData, arrayOfCellId[93])[0] && !!filterItems(copiedData, arrayOfCellId[93])[0].snapQuote && filterItems(copiedData, arrayOfCellId[93])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[93])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[9].chf = (arrayOfCellId[94] > 0 && !!filterItems(copiedData, arrayOfCellId[94])[0] && !!filterItems(copiedData, arrayOfCellId[94])[0].snapQuote && filterItems(copiedData, arrayOfCellId[94])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[94])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[9].aud = (arrayOfCellId[95] > 0 && !!filterItems(copiedData, arrayOfCellId[95])[0] && !!filterItems(copiedData, arrayOfCellId[95])[0].snapQuote && filterItems(copiedData, arrayOfCellId[95])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[95])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[9].hkd = (arrayOfCellId[96] > 0 && !!filterItems(copiedData, arrayOfCellId[96])[0] && !!filterItems(copiedData, arrayOfCellId[96])[0].snapQuote && filterItems(copiedData, arrayOfCellId[96])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[96])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[9].rub = (arrayOfCellId[97] > 0 && !!filterItems(copiedData, arrayOfCellId[97])[0] && !!filterItems(copiedData, arrayOfCellId[97])[0].snapQuote && filterItems(copiedData, arrayOfCellId[97])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[97])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[9].zar = (arrayOfCellId[98] > 0 && !!filterItems(copiedData, arrayOfCellId[98])[0] && !!filterItems(copiedData, arrayOfCellId[98])[0].snapQuote && filterItems(copiedData, arrayOfCellId[98])[0].snapQuote) ? numberFormatDecimals(filterItems(copiedData, arrayOfCellId[98])[0].snapQuote.lastPrice || 0,5) : '--';
        mockData1[9].cny = "-";
    }
    
    return {
        mockData1,
        loading
    }
  }

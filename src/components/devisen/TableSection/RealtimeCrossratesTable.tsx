import { useBlockLayout, useTable } from 'react-table';
import { useSticky } from 'react-table-sticky';
import './RealtimeCrossratesTable.scss';
import { useState } from 'react';
import classNames from 'classnames';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { PerformanceSection } from 'components/common/asset/PerformanceSection/PerformanceSection';
import { useMediaQuery } from 'react-responsive';
import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { arrayOfCellId } from './GetCorrelationPairData';
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";

interface RealtimeCrossratesTableProps{
  columns: any,
  data: any,
}

function RealtimeCrossratesTable(props: RealtimeCrossratesTableProps) {
  const data = props.data;
  const columns = props.columns;
  const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow
        } = useTable({
            columns, data
        },
        useSticky,
        useBlockLayout
        );

  const [currentRow, setCurrentRow] = useState('0');
  const [currentColumn, setCurrentColumn] = useState('usd');
  const [currentId, setCurrentId] = useState('0usd')

  const toggleClass = (variable1: string, variable2: string) => {
      setCurrentRow(variable1);
      setCurrentColumn(variable2);
  };

const { data: data1, loading } = useQuery(
  loader('./getPerformanceInstrumentDevisen.graphql'),
  {
      variables: { instrumentId: GetCurrencyPairId(currentId) }
  }
);

const isMobile = useMediaQuery({
  query: '(max-width: 767px)'
})

  return (
    <>
    <div className="scrollable-table" id="realtime-table">
      <table {...getTableProps()} className="text-center">
        <thead className="thead-style">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="width-rows">
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className="header-cell-styling">
                  {column.id.length > 3 ? <></> : <img src={process.env.PUBLIC_URL + "/static/img/svg/flags/" + column.id.toLowerCase() + ".svg"} alt="" className="svg-convert svg-blue table-flags-style" width="24px" height="16px"/>}
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={i} className="width-rows">
                {row.cells.map((cell,j) => {
                  if ( j === 0 ) {
                    return <th className="first-col-style" key={j}><img src={process.env.PUBLIC_URL + "/static/img/svg/flags/" + cell.value.toLowerCase() + ".svg"} alt="" className="svg-convert svg-blue table-flags-style" width="24px" height="16px"></img>{cell.render("Cell")}</th>
                  }
                  else{
                  return (
                    <td {...cell.getCellProps()}
                    key={j}
                    className={classNames("cell-styling", row.id === currentRow && cell.column.id === currentColumn ? 'active-cell-devisen' : '')}
                    onClick={
                      ()=> {  trigInfonline(guessInfonlineSection(), "corssrates")
                          setCurrentId(cell.getCellProps().key.toString().slice(5,6) + cell.getCellProps().key.toString().slice(7,10));toggleClass(row.id,cell.column.id);}}>
                        
                      {cell.render("Cell")}
                    </td>
                  );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    {
                            loading ? <Spinner animation="border" /> : isMobile === true ? <PerformanceSection className="py-4" instrument={data1.instrument} /> : <PerformanceSection className="py-4 px-4" instrument={data1.instrument} />
    }
    </>
  )
}

export const RealtimeCrossratesTableMemoised = React.memo(RealtimeCrossratesTable)

export function GetCurrencyPairId(input: string){
  switch(input){
      case '0eur' : return null
      case '0usd' : return arrayOfCellId[1]
      case '0jpy' : return arrayOfCellId[2]
      case '0gbp' : return arrayOfCellId[3]
      case '0chf' : return arrayOfCellId[4]
      case '0aud' : return arrayOfCellId[5]
      case '0hkd' : return arrayOfCellId[6]
      case '0rub' : return arrayOfCellId[7]
      case '0zar' : return arrayOfCellId[8]
      case '0cny' : return arrayOfCellId[9]

      case '1eur' : return arrayOfCellId[10]
      case '1usd' : return null
      case '1jpy' : return arrayOfCellId[12]
      case '1gbp' : return arrayOfCellId[13]
      case '1chf' : return arrayOfCellId[14]
      case '1aud' : return arrayOfCellId[15]
      case '1hkd' : return arrayOfCellId[16]
      case '1rub' : return arrayOfCellId[17]
      case '1zar' : return arrayOfCellId[18]
      case '1cny' : return arrayOfCellId[19]

      case '2eur' : return arrayOfCellId[20]
      case '2usd' : return arrayOfCellId[21]
      case '2jpy' : return null
      case '2gbp' : return arrayOfCellId[23]
      case '2chf' : return arrayOfCellId[24]
      case '2aud' : return arrayOfCellId[25]
      case '2hkd' : return arrayOfCellId[26]
      case '2rub' : return arrayOfCellId[27]
      case '2zar' : return arrayOfCellId[28]
      case '2cny' : return arrayOfCellId[29]

      case '3eur' : return arrayOfCellId[30]
      case '3usd' : return arrayOfCellId[31]
      case '3jpy' : return arrayOfCellId[32]
      case '3gbp' : return null
      case '3chf' : return arrayOfCellId[34]
      case '3aud' : return arrayOfCellId[35]
      case '3hkd' : return arrayOfCellId[36]
      case '3rub' : return arrayOfCellId[37]
      case '3zar' : return arrayOfCellId[38]
      case '3cny' : return arrayOfCellId[39]

      case '4eur' : return arrayOfCellId[40]
      case '4usd' : return arrayOfCellId[41]
      case '4jpy' : return arrayOfCellId[42]
      case '4gbp' : return arrayOfCellId[43]
      case '4chf' : return null
      case '4aud' : return arrayOfCellId[45]
      case '4hkd' : return arrayOfCellId[46]
      case '4rub' : return arrayOfCellId[47]
      case '4zar' : return arrayOfCellId[48]
      case '4cny' : return arrayOfCellId[49]

      case '5eur' : return arrayOfCellId[50]
      case '5usd' : return arrayOfCellId[51]
      case '5jpy' : return arrayOfCellId[52]
      case '5gbp' : return arrayOfCellId[53]
      case '5chf' : return arrayOfCellId[54]
      case '5aud' : return null
      case '5hkd' : return arrayOfCellId[56]
      case '5rub' : return arrayOfCellId[57]
      case '5zar' : return arrayOfCellId[58]
      case '5cny' : return arrayOfCellId[59]

      case '6eur' : return arrayOfCellId[60]
      case '6usd' : return arrayOfCellId[61]
      case '6jpy' : return arrayOfCellId[62]
      case '6gbp' : return arrayOfCellId[63]
      case '6chf' : return arrayOfCellId[64]
      case '6aud' : return arrayOfCellId[65]
      case '6hkd' : return null
      case '6rub' : return arrayOfCellId[67]
      case '6zar' : return arrayOfCellId[68]
      case '6cny' : return arrayOfCellId[69]

      case '7eur' : return arrayOfCellId[70]
      case '7usd' : return arrayOfCellId[71]
      case '7jpy' : return arrayOfCellId[72]
      case '7gbp' : return arrayOfCellId[73]
      case '7chf' : return arrayOfCellId[74]
      case '7aud' : return arrayOfCellId[75]
      case '7hkd' : return arrayOfCellId[76]
      case '7rub' : return null
      case '7zar' : return arrayOfCellId[78]
      case '7cny' : return arrayOfCellId[79]

      case '8eur' : return arrayOfCellId[80]
      case '8usd' : return arrayOfCellId[81]
      case '8jpy' : return arrayOfCellId[82]
      case '8gbp' : return arrayOfCellId[83]
      case '8chf' : return arrayOfCellId[84]
      case '8aud' : return arrayOfCellId[85]
      case '8hkd' : return arrayOfCellId[86]
      case '8rub' : return arrayOfCellId[87]
      case '8zar' : return null
      case '8cny' : return arrayOfCellId[89]

      case '9eur' : return arrayOfCellId[90]
      case '9usd' : return arrayOfCellId[91]
      case '9jpy' : return arrayOfCellId[92]
      case '9gbp' : return arrayOfCellId[93]
      case '9chf' : return arrayOfCellId[94]
      case '9aud' : return arrayOfCellId[95]
      case '9hkd' : return arrayOfCellId[96]
      case '9rub' : return arrayOfCellId[97]
      case '9zar' : return arrayOfCellId[98]
      case '9cny' : return null

      default : return arrayOfCellId[1]
  }
}

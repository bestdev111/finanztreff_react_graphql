import { useBlockLayout, useTable } from 'react-table';
import { LoneSchemaDefinitionRule } from "graphql";
import { getGridPerformanceClass } from 'utils';
import { useSticky } from 'react-table-sticky';
import './CorrelationsTable.scss';
import classNames from 'classnames';

export function CorrelationsTable({ columns, data }: { columns: any, data: any }) {
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

    return (
        <div className="scrollable-table" id="correlation-table">
            <table {...getTableProps()} className="text-center">
                <thead className="thead-style">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} className="width-rows">
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} className="header-cell-styling">
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
                                {row.cells.map((cell, j) => {
                                    if (j === 0) {
                                        return <th className="first-col-style" key={j}>{cell.render("Cell")}</th>
                                    }
                                    else if (j > 0 && cell.value === '-') {
                                        return (
                                            <td {...cell.getCellProps()} key={j} className="cell-styling">
                                                {cell.render("Cell")}
                                            </td>
                                        );
                                    }
                                    else if (j > 0 && cell.value !== '-') {
                                        return (
                                            // <td {...cell.getCellProps()} key={j} className="cell-styling">
                                            <td {...cell.getCellProps()} key={j} className={classNames("cell-styling", getGridPerformanceClass(parseFloat(cell.value)))}>
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
    )
}


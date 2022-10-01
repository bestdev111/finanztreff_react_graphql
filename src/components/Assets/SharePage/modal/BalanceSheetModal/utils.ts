import {Company, CompanyStatement} from "../../../../../generated/graphql";
import {BalanceMetadata} from "./BalanceSheetTable";

export function createBalanceMetadata(company: Company): BalanceMetadata {
    return {
        day: company.fiscal?.day || 1,
        month: company.fiscal?.month || 1,
        accounting: company.accountingStandard || "N/A",
        currency: company.currency?.name || ""
    }
}

export function mapStatementToBalanceSheetEntry(statements: CompanyStatement[]): StatementRow {
    let data: {[key: number]: number} = {};
    statements.forEach(current => {
        if (current && !!current.year && !Number.isNaN(current.value)) {
            // @ts-ignore
            data[current.year] = current.value;
        }
    })
    return {
        name: statements[0].name || "",
        important: statements[0].important || false,
        data: data
    };
}

export function createStatementRows(statements: CompanyStatement[]): StatementRow[] {
    let grouped: {[key: string]: CompanyStatement[]} = statements.reduce(
        (result: {[key: string]: CompanyStatement[]}, item: CompanyStatement) => {
            let key = item.name || "";
            return {
                ...result,
                [key]: [
                    ...(result[key] || []),
                    item,
                ],
            };
        },
        {},
    );

    let list = [];
    for (let key in grouped) {
        let value = grouped[key];
        list.push(mapStatementToBalanceSheetEntry(value));
    }
    return alignBalanceSheets(list);
}

function alignBalanceSheets(list: StatementRow[]): StatementRow[] {
    return list;
}

export interface StatementRow {
    name: string;
    important: boolean;
    data: {[year: number]: number};
}


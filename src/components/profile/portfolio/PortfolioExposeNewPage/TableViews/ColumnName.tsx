import { useMutation } from "@apollo/client";
import classNames from "classnames";
import { loader } from "graphql.macro";
import { Portfolio, Mutation } from "graphql/types";
import { Col } from "react-bootstrap";

export function ColumnName({ size, name, className, portfolio }: { size?: number, name: string, className?: string, portfolio: Portfolio }) {

    let [mutation] = useMutation<Mutation>(loader('./editPortfolioOrder.graphql'));
    const handleSort = (sort: SortOption) => {
        const id = portfolio.id;
        mutation({
            variables: {
                viewOrder: sort.sortType,
                viewOrderAsc: sort.direction,
                portfolioId: portfolio.id
            },
            update(cache) {
                const normalizedId = cache.identify({ id, __typename: 'Portfolio' });
                cache.modify({
                    id: normalizedId,
                    fields: {
                        viewOrder(cachedValue) {
                            return sort.sortType;
                        },
                        viewOrderAsc(cachedValue) {
                            return sort.direction;
                        },
                    },
                    /* broadcast: false; // Include this to prevent automatic query refresh */
                });
            }
        })
    };

    return (
        <Col xs={size} className={classNames("text-blue fs-15px text-nowrap", className)}>
            <span className="cursor-pointer" onClick={() => handleSort({ sortType: "Table" + name, direction: portfolio.viewOrder === "Table" + name ? !portfolio.viewOrderAsc : true })}>
                <>{name}
                    {portfolio.viewOrder === "Table" + name && <img src="/static/img/svg/icon_arrow_short_fullup_blue.svg" width={20} className="svg-convert img-dropdown" style={!portfolio.viewOrderAsc ? { transform: "rotate(180deg)" } : {}} />}
                </>
            </span>
        </Col>
    )
}

interface SortOption {
    sortType: string;
    direction: boolean;
}

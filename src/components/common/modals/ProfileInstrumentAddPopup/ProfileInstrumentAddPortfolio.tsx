import { useDropdownToggle } from "react-overlays";
import { Accordion, Spinner } from "react-bootstrap";
import { PortfolioInstrumentAdd } from "../../profile";
import SvgImage from "../../image/SvgImage";
import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { Portfolio, Query } from "graphql/types";
import { PurchaseButton } from "./PurchaseSalesComponent/PurchaseButton";
import { SalesButton } from "./PurchaseSalesComponent/SalesButton";
import { TransactionImportModal } from "components/profile/modals/TransactionImportModal/TransactionImportModal";
import {guessInfonlineSection, trigInfonline} from "../../InfonlineService";
import { gtag, eventTime } from "components/Assets/Derivatives/components/Product";
import {SyntheticEvent} from "react";

export interface ProfileInstrumentAddPortfolioProps {
    instrumentId: number;
    instrumentGroupId: number;
    onActivate?: () => void;
    emptyText?: string;
    productIsin?: any;
    nameWkn?: any;
    hasGtag?: boolean;
}

export const ProfileInstrumentAddPortfolio = (props: ProfileInstrumentAddPortfolioProps) => {
    const [, { toggle }] = useDropdownToggle();

    const { data, loading } = useQuery<Query>(
        loader('./getProfileInstrumentAddPortfolio.graphql'),
        { variables: { id: props.instrumentId } }
    )
    return (
        <div className="content-row">
            <Accordion>
                <Accordion.Toggle eventKey="portfolio" as={"p"}>
                    {
                        <span> {props.emptyText && (!data?.instrumentIncluded || data?.instrumentIncluded?.portfolios?.length === 0) ? (
                            <>
                                {props.emptyText}
                            </>
                        ) :
                            <>
                                <span>Bereits in <span className="font-weight-bold">{data?.instrumentIncluded?.portfolios.length} Portfolios</span> aufgenommen</span>
                            </>
                        }
                        </span>
                    }
                    {data && data.instrumentIncluded && data?.instrumentIncluded?.portfolios.length > 0 &&
                        <i className="drop-arrow right-float-arrow border-gray-dark mb-2" style={{ transform: "rotate(45deg)" }} />
                    }
                </Accordion.Toggle>
                {data && data.instrumentIncluded && data?.instrumentIncluded?.portfolios.length > 0 &&
                    <Accordion.Collapse eventKey="portfolio">
                        <div className="collapse-inner">
                            {loading && <div className="text-center py-2"><Spinner animation="border" /></div>}
                            {!loading && data && data.instrumentIncluded?.portfolios.map(portfolio => <>
                            {portfolio.real ?
                            <span className="items">
                                <TransactionImportModal portfolio={portfolio as Portfolio} childClassName="mt-n1 pt-1">
                                <span className="d-flex align-items-center text-white">
                                <a className="text-orange" href={"/mein-finanztreff/portfolio/" + portfolio.id}>{portfolio.name}</a>

                                        <SvgImage icon="icon_import_portfolioitem_orange.svg" spanClass="pl-1" width="20" />
                                        </span>
                                </TransactionImportModal>
                            </span> 
                            :
                                <span className="items"><a href={"/mein-finanztreff/portfolio/" + portfolio.id}>{portfolio.name}</a>
                                    <PurchaseButton instrumentId={props.instrumentId} portfolioId={portfolio.id} />
                                    <SalesButton instrumentId={props.instrumentId} portfolioId={portfolio.id} />
                                </span>
                            }
                            </>
                            )}
                        </div>
                    </Accordion.Collapse>
                }
            </Accordion>
            <PortfolioInstrumentAdd className="py-1" instrumentId={props.instrumentId} instrumentGroupId={props.instrumentGroupId} onOpen={() => {
               // @ts-ignore
                toggle && toggle(false,(e:any):void=>{});
                props.onActivate && props.onActivate();
            }}
            >
                <SvgImage icon="icon_portfolio_plus_white.svg" spanClass="top-move" width="19"/>
                    {props.hasGtag === true && 
                    <span className="" onClick={() => {
                        return gtag('event', 'view_item', {
                        items: [{
                            item_name: props.productIsin,
                            item_brand: props.nameWkn,
                            item_category: 'Monte Carlo Simulation',
                            item_category2: 'Related Products',
                            item_category3: 'Add to Portfolio',
                            item_category5: eventTime(),
                        }]
                    }
                )}
                }> Zu Portfolio hinzufügen </span>
                }
                {props.hasGtag === false && 
                <span className=""> Zu Portfolio hinzufügen </span>
            }
            </PortfolioInstrumentAdd>
        </div>
    );

}

import { useQuery } from "@apollo/client";
import Product from "components/Assets/Derivatives/components/Product";
import { Instrument, Query, DerivativeOptionType, QuoteType } from "generated/graphql";
import { GET_BEST_WARRANT } from "graphql/query";
import moment from "moment";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

function getPercentChange(startValue: number, expectedValue: any): number {
    if (startValue && expectedValue && startValue !== 0) {
        let value: number = (expectedValue - startValue) / startValue;
        return Math.round(value * 100);
    }
    return 0;
}

export function BestWarrantCard(props: BestWarrantCardProps) {

    const quoteHistoryEdges = props.instrument.quoteHistory.edges || [];
    let startValue = quoteHistoryEdges.length>0 && quoteHistoryEdges[quoteHistoryEdges.length - 1].node?.lastPrice || 1;

    const [expectedValue, setExpectedValue] = useState(props.expectedValue);

    useEffect(() => {
        props.onMountExpectedValue([expectedValue, setExpectedValue]);
    }, [props.onMountExpectedValue, expectedValue]);

    const [period, setPeriod] = useState(0);

    useEffect(() => {
        props.onMountPeriod([period, setPeriod]);
    }, [props.onMountPeriod]);


    let { data, loading } = useQuery<Query>(
        GET_BEST_WARRANT,
        {
            variables: {
                underlyingIsin: props.instrument?.isin, pctChange: getPercentChange(startValue, expectedValue),
                months: period !== 0 ? period : props.period
            }, skip: !props.instrument
        }
    );

    if (loading) {
        return (<Spinner className="mx-auto" animation="border"></Spinner>);
    }

    if (data && data.bestWarrantRnd && data.bestWarrantRnd.instrument) {
        let derivativeType = data.bestWarrantRnd.instrument && data.bestWarrantRnd.instrument.group && data.bestWarrantRnd.instrument.group.derivative && data.bestWarrantRnd.instrument.group.derivative.optionType === DerivativeOptionType.Call ? "Call" : "Put";
        let askQuote = data.bestWarrantRnd.instrument && data.bestWarrantRnd.instrument.snapQuote && data.bestWarrantRnd.instrument.snapQuote.quotes.filter(quote => quote?.type === QuoteType.Ask)[0];
        let bidQuote = data.bestWarrantRnd.instrument && data.bestWarrantRnd.instrument.snapQuote && data.bestWarrantRnd.instrument.snapQuote.quotes.filter(quote => quote?.type === QuoteType.Bid)[0];
        let underlying = data.bestWarrantRnd.instrument?.group.underlyings && data.bestWarrantRnd.instrument?.group.underlyings[0];
        let maturityDate = moment(data.bestWarrantRnd.instrument?.group?.derivative?.maturityDate);
        let dueTo = maturityDate.diff(moment(), 'd') + 1;
        let startDate = data.bestWarrantRnd.instrument?.group?.derivative?.issueDate;
        let start = Math.abs(moment(startDate).diff(moment(), 'd') + 1);
        let pieChartValue = dueTo / (start + dueTo) * 100;

        return (
            <Product tage={dueTo + (dueTo === 1 ? " Tag" : " Tage")}
                issuer={data.bestWarrantRnd.instrument?.group.issuer}
                title={derivativeType} headingColor={derivativeType === "Call" ? "bg-green" : "bg-pink"}
                gearing={data.bestWarrantRnd.instrument?.keyFigures?.gearing || 0}
                bidQuote={bidQuote || undefined}
                askQuote={askQuote || undefined}
                strike={underlying && underlying.strike || 0} strikeCurrency={underlying && underlying.currency?.displayCode || ""}
                wknValue={data.bestWarrantRnd.instrument?.wkn || ""} pieChartValue={pieChartValue} pieChartColor={derivativeType === "Call" ? "#18C48F" : "#ff4d7d"}
                instrument={data.bestWarrantRnd.instrument}
            />
        );
    }

    return (<div className="font-weight-bold text-pink text-truncate">Kein passendes Produkt gefunden!</div>);
}

interface BestWarrantCardProps {
    instrument: Instrument,
    expectedValue: number,
    period: number,
    onMountExpectedValue: any,
    onMountPeriod: any;
}
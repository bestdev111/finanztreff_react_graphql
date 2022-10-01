import { Issuer } from 'generated/graphql';

export function PartnerLogo(props: { className?: string, issuer?: Issuer, svgColor?: string }) {

    let issuerId: number = props.issuer?.id || 0;

    if (props.issuer?.partner || LOGOMAP[issuerId] !== undefined)
        return (
            <img src={process.env.PUBLIC_URL + "/static/img/svg/issuer-logos/emi_logo_" +
                LOGOMAP[issuerId].name + "_" + (props.svgColor ? props.svgColor : "color") + ".svg"}
                alt={props.issuer?.name || ""} width={LOGOMAP[issuerId].width} />
        )
    else
        return (<span className="fs-18px font-weight-bold">{props.issuer?.name}</span>);

}

const LOGOMAP: { [key: number]: { name: string, width: number } } = {
    46: { name: "bnp", width: 110 },
    30: { name: "citi", width: 40 },
    4: { name: "ubs", width: 58 },
    22: { name: "morganstanley", width: 120 },
    26: { name: "socgen", width: 90 },
    3: { name: "vontobel", width: 80 },
    8: { name: "dzbank", width: 90 },
    52: { name: "hsbc", width: 80 },
    23: { name: "jpm", width: 85 }
};
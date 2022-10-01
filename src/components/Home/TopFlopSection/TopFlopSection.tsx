import { useQuery } from "@apollo/client";
import { Instrument, Query } from "../../../generated/graphql";
import { loader } from "graphql.macro";
import { Button, Container, Spinner } from "react-bootstrap";
import { useState } from "react";
import { TopFlopGroup } from "./TopFlopGroup";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { getFinanztreffAssetLink, switchTopsFlopsIVW } from "../../../utils";
import { SelectBottomBox } from "../../common/select/SelectBottomBox/SelectBottomBox";
import { guessInfonlineSection, trigInfonline } from "../../common/InfonlineService";

export const TopFlopSection = (props: { className?: string, isHomePage?: boolean , showOtherTopsAndFlops?: boolean, instruments?: Instrument[] }) => {
	let { data, loading } = useQuery<Query>(loader('./getTopFlopTab.graphql'),{skip: !!props.instruments});

	if (loading) {
		return <div className="text-center py-2"><Spinner animation="border" /></div>
	}

	if (data && data.list && data.list.content) {

		return (
			<section className={classNames("main-section", props.className)}>
				<Container>
					<TopFlopContent list={props.instruments ? props.instruments : data?.list?.content} isHomePage={props.isHomePage} />
				</Container>
			</section>
		);
	}
	return <></>;
}

export function TopFlopContent(props: { list: Instrument[], isHomePage?: boolean}) {
	const [activeInstrument, setActiveInstrument] = useState<Instrument>(props.list[0]);
	return (<>

		<div className="d-flex justify-content-between">
			<h2 className="section-heading font-weight-bold">Tops &amp; Flops</h2>
			<SelectBottomBox
				className="d-xl-none"
				defaultValue={activeInstrument}
				title="Top &amp; Flops"
				onSelect={(value => setActiveInstrument(value))}
				options={
					props.list.map(current => {
						return {
							value: current,
							name: current?.group?.name
						}
					})
				}
			/>
		</div>
		<div className="content-wrapper">
			<div className="sub-navigation justify-content-between mb-4 d-none d-xl-block">
				<div className="nav-wrapper nav d-block">
					{props.list.map(current =>
						<Button variant="link" key={current?.isin}
							onClick={() => { setActiveInstrument(current); trigInfonline(guessInfonlineSection(), switchTopsFlopsIVW(current.group.seoTag)) }}
							className={classNames("fnt-size-16 font-weight-bold text-blue", activeInstrument.id === current?.id ? 'active' : '')}>
							{current?.group?.name}
						</Button>
					)
					}
				</div>
			</div>

			<div className="content">
				<TopFlopGroup groupId={activeInstrument.group.id || 0} instrumentId={activeInstrument.id} isHomePage={props.isHomePage} />
				<div className="button-row d-flex justify-content-end margin-top-30">
					{activeInstrument.group.assetGroup && activeInstrument.group.seoTag &&
						<NavLink
							to={getFinanztreffAssetLink(activeInstrument.group.assetGroup, activeInstrument.group?.seoTag)}>
							<Button variant="primary" className={"mr-2"}>{activeInstrument.group.name} Einzelwerte</Button>
						</NavLink>
					}
					{/* { props.showOtherTopsAndFlops &&
							<button className="btn btn-primary">Weitere Tops &amp; Flops...</button>
							} */}
				</div>
			</div>
		</div>
	</>);
}

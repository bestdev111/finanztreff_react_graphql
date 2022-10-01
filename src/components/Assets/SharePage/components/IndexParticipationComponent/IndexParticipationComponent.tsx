import { AssetLinkComponent } from "components/profile/common/AssetLinkComponent";
import { InstrumentGroup } from "generated/graphql";
import './IndexParticipationComponent.scss'

interface IndexParticipationComponentProps {
    instrumentGroup: InstrumentGroup;
}

export const IndexParticipationComponent = (props: IndexParticipationComponentProps) => {
    return (
        <div className="content-wrapper">
            <h3 className="content-wrapper-heading font-weight-bold">Indexzugehörigkeit</h3>
            <div className="content index-participation-scroll">
                {
                    props.instrumentGroup.indexParticipation.map(current =>
                        <span className="mr-3">
                            <AssetLinkComponent instrument={current.main} />
                        </span>
                    )
                }
            </div>
        </div>
    )
}

import { LimitsPageContent } from "components/profile/LimitsPage/LimitsPageContent";
import { LimitEntry, UserProfile } from "graphql/types";
import { Link } from "react-router-dom";

export function LimitsOverview(props: LimitsOverviewProps) {
    return (

        <section className="main-section">
            <LimitsPageContent profile={props.profile} limits={props.limits} refetch={props.refreshTrigger} showTitle={true}/>
            <div className="text-center my-4">
                <Link className="btn btn-primary text-white text-decoration-none" to={"/mein-finanztreff/limits"}>
                    Alle Limits
                </Link>
            </div>
        </section>
    );
}

interface LimitsOverviewProps {
    refreshTrigger: () => void;
    profile: UserProfile;
    limits: LimitEntry[];
}

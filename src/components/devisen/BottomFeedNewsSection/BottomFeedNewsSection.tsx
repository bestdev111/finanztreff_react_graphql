import { Container } from "react-bootstrap";
import { BottomFeed } from "components";

interface BottomFeedNewsSectionProps {
    test?: string
}

export function BottomFeedNewsSection(props: BottomFeedNewsSectionProps) {
    return (
        <section className="main-section news-overview">
            <Container className="px-0 px-md-2">
                <h2 className="section-heading font-weight-bold ml-0 ml-md-2">
                    Devisen Nachrichten
                </h2>
                <BottomFeed />
            </Container>
        </section>
    );
}
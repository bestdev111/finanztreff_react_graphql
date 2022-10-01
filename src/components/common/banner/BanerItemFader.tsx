import React, {createRef} from "react";

export class BannerItemFader extends React.Component<any> {
    fader = createRef<HTMLDivElement>();

    showFader() {
        if(this.fader && this.fader.current) {
            this.fader.current.style.opacity = '1';
            this.fader.current.style.transition = 'none';
            this.fader.current.style.pointerEvents = 'auto';
        }
    }

    hideFader() {
        if(this.fader.current) {
            this.fader.current.style.opacity = '0';
            this.fader.current.style.transition = 'opacity 1.5s ease-in-out';
            this.fader.current.style.pointerEvents = 'none';
        }
    }

    render() {
        if(!this.props.visible) {
            setTimeout(() => { this.hideFader() }, 1000);
        } else {
            this.showFader();
        }

        return (
            <>
                <div className="slide-info-fader flex-column align-items-center" ref={this.fader}>
                    <div>Börsenplatz</div>
                    <div className="platz-name">{this.props.exchange} in {this.props.currency}</div>
                </div>
            </>
        );
    }
}

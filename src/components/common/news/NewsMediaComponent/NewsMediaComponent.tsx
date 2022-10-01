import {News, NewsMedia, NewsStream} from "../../../../generated/graphql";
import {SizeMe, SizeMeProps} from "react-sizeme";
import React, {useRef} from "react";
import videojs, { VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.css';

export interface NewsMediaComponentProps {
    className?: string;
    medias: NewsMedia[];
    news: News,
    inModal: boolean
    streams: NewsStream[]
}

function getImageSource(medias: NewsMedia[], width: number): NewsMedia | null {
    if (medias.length < 2) {
        return (medias.length > 0 && medias[0]) || null;
    }
    let suitableMedias = medias.slice()
        .sort((a:NewsMedia, b:NewsMedia) => (b?.width || 0) - (a?.width || 0))
        .filter(news => (news.width || 0) > width);

    return (suitableMedias.length > 0 && suitableMedias[0]) || medias[0] ;
}

export function NewsMediaContainer(props: NewsMediaComponentProps & SizeMeProps) {
    const isVideoExposed: boolean = (props.news.feed === "VIDEO_FEED");
    let width = props.size.width || 0;
    let media = getImageSource(props.medias.filter(current => !!current.source), width);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const playerRef = useRef<VideoJsPlayer | null>(null);

    React.useEffect(() => {
        let posterLink : any;
        if (!playerRef.current) {
            posterLink = props.medias[0].source;
            const videoElement = videoRef.current;
            if (videoElement == null) return;
            playerRef.current = videojs(videoElement, {
            poster : posterLink
            },() => {
                console.log("player is ready");
            });
        }
    }, [playerRef, videoRef, props.streams]);

    React.useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef, props.streams]);

    if (props.streams.length>0 && props.inModal) {
        return (
            <div key={props.streams && props.streams.length>0 && props.streams[0].source || 1}>
                <div data-vjs-player>
                    <video preload="auto" ref={videoRef} className="video-js vjs-tech" tabIndex={-1} autoSave="false" data-setup='{"fluid": true}' autoPlay role="application" width="100%" height="100%" controls>
                        {
                            props.streams && props.streams.length>0
                                && props.streams.map(current =>
                                current && current.source && current.mimeType &&
                                    <source src={current.source} autoSave={"false"} type={current.mimeType==="video/mp4" ? 'application/dash+xml': current.mimeType}/> //current.mimeType==="video/mp4" ? 'application/dash+xml': current.mimeType
                            )
                        }
                    </video>
                </div>
            </div>
        )
    }
    if (!media || !media.source) {
        return <></>;
    }
    if (media.height && media.width) {
        return (
            <>
                <div className={props.className}
                    style={
                        {
                            backgroundPosition: '25% center',
                            backgroundSize: 'cover',
                            backgroundImage: 'url(' + media.source + ')',
                            backgroundColor:'#ffffff'
                            // aspectRatio:'16/9',
                        }
                    }
                >
                </div>
                {isVideoExposed && !props.inModal &&
                    <div className="triangle-right"></div>
                }
            </>
        );
    }
    return (
        <>
            <div className={props.className}>
                <div className={"img-fluid big-img"} style={{
                    backgroundPosition: '25% center',
                    backgroundSize: 'cover',
                    backgroundImage: 'url(' + media.source + '?w=1080' + ')',
                    aspectRatio: '16/9',
                    backgroundColor:'#ffffff'
                }}>
                </div>
                {/*<img src={media.source + '?w=1080'} alt={media.caption || ""} className="img-fluid big-img" style={{  height: 'auto'}}/>*/}
            </div>
            {isVideoExposed && !props.inModal &&
                <div className="triangle-right"></div>
            }
        </>
    )
}

export const NewsMediaComponent = ({className, medias, news, inModal, streams}: NewsMediaComponentProps) => {
    if (medias.length < 1 ) {
        return <></>;
    }
    return (
        <SizeMe>
            {props => <NewsMediaContainer news={news} {...props} medias={medias} className={className} inModal={inModal} streams={streams}/>}
        </SizeMe>
    );
}

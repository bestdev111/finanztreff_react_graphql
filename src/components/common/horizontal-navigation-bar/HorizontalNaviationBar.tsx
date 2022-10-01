import { useEffect, useRef, useState } from "react";
import "./HorizontalNaviationBar.scss";

export interface HorizontalNaviationBarProps {
    links: Array<any>;
}

export function HorizontalNaviationBar({ links }: HorizontalNaviationBarProps) {

    let scrl = useRef(null);
    const [scrollX, setscrollX] = useState(0);
    const [scrolEnd, setscrolEnd] = useState(false);

    
    //Slide click
    const slide = (shift: any) => {
        if (scrl && scrl.current && shift) {
            // @ts-ignore
            scrl.current.scrollLeft += shift;
            setscrollX(scrollX + shift);

            if (
                // @ts-ignore
                Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <=
                // @ts-ignore
                scrl.current.offsetWidth
            ) {
                setscrolEnd(true);
            } else {
                setscrolEnd(false);
            }
        }
    };


    const scrollCheck = () => {
        if (scrl.current) {
            // @ts-ignore
            setscrollX(scrl.current.scrollLeft);

            // @ts-ignore
            if (
                // @ts-ignore
                Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <= scrl.current.offsetWidth
            ) {
                setscrolEnd(true);
            } else {
                setscrolEnd(false);
            }
        }
    };

    useEffect(scrollCheck,[scrl]);

    return (
        <div id="horizontal-navigation-bar">
        <div className="horizontal-navbar gradient">
            {scrollX !== 0 && (
                <button
                    className="prev left-arrow-bg"
                    onClick={() => slide(-200)}
                >
                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_left_white.svg"} alt=""  className="" />
                </button>
            )}
            <ul ref={scrl} onScroll={scrollCheck} className="ul-nav-bar">
                {links.map((d, i) => <li className="mx-2" key={i}>{d}</li>) }
            </ul>
            {!scrolEnd && (
                <button
                    className="next right-arrow-bg"
                    onClick={() => slide(+200)}
                >
                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_right_white.svg"} alt="" />
                </button>
            )}
        </div>
        </div>

    );
}
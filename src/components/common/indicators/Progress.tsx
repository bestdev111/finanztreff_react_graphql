import * as React from 'react';

const VIEW_BOX_WIDTH = 100;
const VIEW_BOX_HEIGHT = 100;
const VIEW_BOX_HEIGHT_HALF = 50;
const VIEW_BOX_CENTER_X = 50;
const VIEW_BOX_CENTER_Y = 50;

class CircularProgressbar extends React.Component<CircularProgressbarProps> {
    static defaultProps: CircularProgressbarDefaultProps = {
        background: false,
        backgroundPadding: 0,
        circleRatio: 1,
        classes: {
            root: 'CircularProgressbar',
            trail: 'CircularProgressbar-trail',
            path: 'CircularProgressbar-path',
            text: 'CircularProgressbar-text',
            background: 'CircularProgressbar-background',
        },
        counterClockwise: false,
        className: '',
        maxValue: 100,
        minValue: 0,
        strokeWidth: 8,
        styles: {
            root: {},
            trail: {
                stroke: '#f1f1f1'
            },
            path: {
                stroke: '#000'
            },
            text: {},
            background: {},
        },
        text: '',
    };

    getBackgroundPadding() {
        if (!this.props.background) {
            // Don't add padding if not displaying background
            return 0;
        }
        return this.props.backgroundPadding;
    }

    getPathRadius() {
        // The radius of the path is defined to be in the middle, so in order for the path to
        // fit perfectly inside the 100x100 viewBox, need to subtract half the strokeWidth
        return VIEW_BOX_HEIGHT_HALF - this.props.strokeWidth / 2 - this.getBackgroundPadding();
    }

    // Ratio of path length to trail length, as a value between 0 and 1
    getPathRatio() {
        const {value, minValue, maxValue} = this.props;
        const boundedValue = Math.min(Math.max(value, minValue), maxValue);
        return (boundedValue - minValue) / (maxValue - minValue);
    }

    render() {
        const {
            circleRatio,
            className,
            classes,
            counterClockwise,
            styles,
            strokeWidth,
            text,
        } = this.props;

        const pathRadius = this.getPathRadius();
        const pathRatio = this.getPathRatio();

        return (
            <svg
                className={`${classes.root} ${className}`}
                style={styles.root}
                viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
                data-test-id="CircularProgressbar"
            >
                {this.props.background ? (
                    <circle
                        className={classes.background}
                        style={styles.background}
                        cx={VIEW_BOX_CENTER_X}
                        cy={VIEW_BOX_CENTER_Y}
                        r={VIEW_BOX_HEIGHT_HALF}
                    />
                ) : null}

                <Path
                    className={classes.trail}
                    counterClockwise={counterClockwise}
                    dashRatio={circleRatio}
                    pathRadius={pathRadius}
                    strokeWidth={strokeWidth}
                    style={styles.trail}
                />

                <Path
                    className={classes.path}
                    counterClockwise={counterClockwise}
                    dashRatio={pathRatio * circleRatio}
                    pathRadius={pathRadius}
                    strokeWidth={strokeWidth}
                    style={styles.path}
                />

                {text ? (
                    <text
                        className={classes.text}
                        style={styles.text}
                        x={VIEW_BOX_CENTER_X}
                        y={VIEW_BOX_CENTER_Y}
                    >
                        {text}
                    </text>
                ) : null}
            </svg>
        );
    }
}

export default CircularProgressbar;

function Path({
                  className,
                  counterClockwise,
                  dashRatio,
                  pathRadius,
                  strokeWidth,
                  style,
              }: {
    className?: string;
    counterClockwise: boolean;
    dashRatio: number;
    pathRadius: number;
    strokeWidth: number;
    style?: object;
}) {
    return (
        <path
            className={className}
            style={Object.assign({}, style, getDashStyle({pathRadius, dashRatio, counterClockwise}))}
            d={getPathDescription({
                pathRadius,
                counterClockwise,
            })}
            strokeWidth={strokeWidth}
            fillOpacity={0}
        />
    );
}

// SVG path description specifies how the path should be drawn
function getPathDescription({
                                pathRadius,
                                counterClockwise,
                            }: {
    pathRadius: number;
    counterClockwise: boolean;
}) {
    const radius = pathRadius;
    const rotation = counterClockwise ? 1 : 0;

    // Move to center of canvas
    // Relative move to top canvas
    // Relative arc to bottom of canvas
    // Relative arc to top of canvas
    return `
      M ${VIEW_BOX_CENTER_X},${VIEW_BOX_CENTER_Y}
      m 0,-${radius}
      a ${radius},${radius} ${rotation} 1 1 0,${2 * radius}
      a ${radius},${radius} ${rotation} 1 1 0,-${2 * radius}
    `;
}

function getDashStyle({
                          counterClockwise,
                          dashRatio,
                          pathRadius,
                      }: {
    counterClockwise: boolean;
    dashRatio: number;
    pathRadius: number;
}) {
    const diameter = Math.PI * 2 * pathRadius;
    const gapLength = (1 - dashRatio) * diameter;

    return {
        // Have dash be full diameter, and gap be full diameter
        strokeDasharray: `${diameter}px ${diameter}px`,
        // Shift dash backward by gapLength, so gap starts appearing at correct distance
        strokeDashoffset: `${counterClockwise ? -gapLength : gapLength}px`,
    };
}


type CircularProgressbarStyles = {
    root?: React.CSSProperties;
    trail?: React.CSSProperties;
    path?: React.CSSProperties;
    text?: React.CSSProperties;
    background?: React.CSSProperties;
};

type CircularProgressbarDefaultProps = {
    background: boolean;
    backgroundPadding: number;
    circleRatio: number;
    classes: {
        root: string;
        trail: string;
        path: string;
        text: string;
        background: string;
    };
    className: string;
    counterClockwise: boolean;
    maxValue: number;
    minValue: number;
    strokeWidth: number;
    styles: CircularProgressbarStyles;
    text: string;
};

// These are used for any CircularProgressbar wrapper components that can safely
// ignore default props.
type CircularProgressbarProps = CircularProgressbarDefaultProps & {
    value: number;
};
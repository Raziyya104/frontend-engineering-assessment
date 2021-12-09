import { Chord, Ribbon } from '@visx/chord';
import { LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { scaleOrdinal } from '@visx/scale';
import { Arc } from '@visx/shape';
import React from 'react';

const pink = '#ff2fab';
const orange = '#ffc62e';
const purple = '#dc04ff';
const purple2 = '#7324ff';
const red = '#d04376';
const green = '#52f091';
const blue = '#04a6ff';
const lime = '#00ddc6';

function descending(a: number, b: number): number {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

const color = scaleOrdinal<number, string>({
    domain: [0, 1, 2, 3],
    range: [
        'url(#gpinkorange)',
        'url(#gpurplered)',
        'url(#gpurplegreen)',
        'url(#gbluelime)',
    ],
});

export type TopicChordProps = {
    dataMatrix: number[][];
    width: number;
    height: number;
    centerSize?: number;
};

const TopicChord = ({
    dataMatrix,
    width,
    height,
    centerSize = 20,
}: TopicChordProps) => {
    const outerRadius = Math.min(width, height) * 0.5 - (centerSize + 10);
    const innerRadius = outerRadius - centerSize;

    return width < 10 ? null : (
        <div className="TopicChord">
            <svg width={width} height={height}>
                <LinearGradient
                    id="gpinkorange"
                    from={pink}
                    to={orange}
                    vertical={false}
                />
                <LinearGradient
                    id="gpurplered"
                    from={purple}
                    to={red}
                    vertical={false}
                />
                <LinearGradient
                    id="gpurplegreen"
                    from={purple2}
                    to={green}
                    vertical={false}
                />
                <LinearGradient
                    id="gbluelime"
                    from={blue}
                    to={lime}
                    vertical={false}
                />
                <Group top={height / 2} left={width / 2}>
                    <Chord
                        matrix={dataMatrix}
                        padAngle={0.05}
                        sortSubgroups={descending}
                    >
                        {({ chords }) => (
                            <g>
                                {chords.groups.map((group, i) => (
                                    <Arc
                                        key={`key-${i}`}
                                        data={group}
                                        innerRadius={innerRadius}
                                        outerRadius={outerRadius}
                                        fill={color(i)}
                                    />
                                ))}
                                {chords.map((chord, i) => {
                                    return (
                                        <Ribbon
                                            key={`ribbon-${i}`}
                                            chord={chord}
                                            radius={innerRadius}
                                            fill={color(chord.target.index)}
                                            fillOpacity={0.75}
                                        />
                                    );
                                })}
                            </g>
                        )}
                    </Chord>
                </Group>
            </svg>
        </div>
    );
};

export default TopicChord;

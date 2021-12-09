import { AxisBottom } from '@visx/axis';
import { localPoint } from '@visx/event';
import { Grid } from '@visx/grid';
import { Group } from '@visx/group';
import { LegendOrdinal } from '@visx/legend';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { BarStack } from '@visx/shape';
import { SeriesPoint } from '@visx/shape/lib/types';
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { timeFormat, timeParse } from 'd3-time-format';
import React from 'react';

type TooltipData = {
    bar: SeriesPoint<Record<string, any>>;
    key: string;
    index: number;
    height: number;
    width: number;
    x: number;
    y: number;
    color: string;
};

export type BarStackProps = {
    data: Record<string, any>[];
    width: number;
    height: number;
    margin?: { top: number; right: number; bottom: number; left: number };
};

const purple1 = '#6c5efb';
const purple2 = '#c998ff';
export const purple3 = '#a44afe';
export const background = '#ffffff';
const defaultMargin = { top: 40, right: 0, bottom: 0, left: 0 };
const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: 'rgba(0,0,0,0.9)',
    color: 'white',
};

const parseDate = timeParse('%m %Y');
const format = timeFormat('%b %Y');
const formatDate = (date: string) => format(parseDate(date) as Date);

// accessors
const getDate = (d: any) => d.date;

let tooltipTimeout: number;

const TopicBar = ({
    data,
    width,
    height,
    margin = defaultMargin,
}: BarStackProps) => {
    const keys = Object.keys(data[0]).filter((d) => d !== 'date');

    const totals = data.reduce<number[]>((allTotals, currentDate) => {
        const total = keys.reduce((dailyTotal, k) => {
            dailyTotal += Number(currentDate[k]);
            return dailyTotal;
        }, 0);
        allTotals.push(total);
        return allTotals;
    }, [] as number[]);

    // scales
    const dateScale = scaleBand<string>({
        domain: data.map(getDate),
        padding: 0.2,
    });
    const scale = scaleLinear<number>({
        domain: [0, Math.max(...totals)],
        nice: true,
    });
    const colorScale = scaleOrdinal<string, string>({
        domain: keys,
        range: [purple1, purple2, purple3],
    });

    const {
        tooltipOpen,
        tooltipLeft,
        tooltipTop,
        tooltipData,
        hideTooltip,
        showTooltip,
    } = useTooltip<TooltipData>();

    const { containerRef, TooltipInPortal } = useTooltipInPortal({
        // TooltipInPortal is rendered in a separate child of <body /> and positioned
        // with page coordinates which should be updated on scroll. consider using
        // Tooltip or TooltipWithBounds if you don't need to render inside a Portal
        scroll: true,
    });

    if (width < 10) return null;
    // bounds
    const xMax = width;
    const yMax = height - margin.top - 100;

    dateScale.rangeRound([0, xMax]);
    scale.range([yMax, 0]);

    return width < 10 ? null : (
        <div style={{ position: 'relative' }}>
            <svg ref={containerRef} width={width} height={height}>
                <rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill={background}
                    rx={14}
                />
                <Grid
                    top={margin.top}
                    left={margin.left}
                    xScale={dateScale}
                    yScale={scale}
                    width={xMax}
                    height={yMax}
                    stroke="black"
                    strokeOpacity={0.1}
                    xOffset={dateScale.bandwidth() / 2}
                />
                <Group top={margin.top}>
                    <BarStack<Record<string, any>, string>
                        data={data}
                        keys={keys}
                        x={getDate}
                        xScale={dateScale}
                        yScale={scale}
                        color={colorScale}
                    >
                        {(barStacks) =>
                            barStacks.map((barStack) =>
                                barStack.bars.map((bar) => (
                                    <rect
                                        key={`bar-stack-${barStack.index}-${bar.index}`}
                                        x={bar.x}
                                        y={bar.y}
                                        height={bar.height}
                                        width={bar.width}
                                        fill={bar.color}
                                        onMouseLeave={() => {
                                            tooltipTimeout = window.setTimeout(
                                                () => {
                                                    hideTooltip();
                                                },
                                                300
                                            );
                                        }}
                                        onMouseMove={(event) => {
                                            if (tooltipTimeout)
                                                clearTimeout(tooltipTimeout);
                                            // TooltipInPortal expects coordinates to be relative to containerRef
                                            // localPoint returns coordinates relative to the nearest SVG, which
                                            // is what containerRef is set to in this example.
                                            const eventSvgCoords =
                                                localPoint(event);
                                            const left = bar.x + bar.width / 2;
                                            showTooltip({
                                                tooltipData: bar,
                                                tooltipTop: eventSvgCoords?.y,
                                                tooltipLeft: left,
                                            });
                                        }}
                                    />
                                ))
                            )
                        }
                    </BarStack>
                </Group>
                <AxisBottom
                    top={yMax + margin.top}
                    scale={dateScale}
                    tickFormat={formatDate}
                    stroke={purple3}
                    tickStroke={purple3}
                    tickLabelProps={() => ({
                        fill: purple3,
                        fontSize: 11,
                        textAnchor: 'middle',
                    })}
                />
            </svg>
            <div
                style={{
                    position: 'absolute',
                    top: margin.top / 2 - 10,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '14px',
                }}
            >
                <LegendOrdinal
                    scale={colorScale}
                    direction="row"
                    labelMargin="0 15px 0 0"
                />
            </div>

            {tooltipOpen && tooltipData && (
                <TooltipInPortal
                    top={tooltipTop}
                    left={tooltipLeft}
                    style={tooltipStyles}
                >
                    <div style={{ color: colorScale(tooltipData.key) }}>
                        <strong>{tooltipData.key}</strong>
                    </div>
                    <div>{tooltipData.bar.data[tooltipData.key]}℉</div>
                    <div>
                        <small>
                            {formatDate(getDate(tooltipData.bar.data))}
                        </small>
                    </div>
                </TooltipInPortal>
            )}
        </div>
    );
};

export default TopicBar;

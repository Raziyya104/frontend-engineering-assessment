import { scaleLog } from '@visx/scale';
import { Text } from '@visx/text';
import { Wordcloud } from '@visx/wordcloud';

interface BodyWordCloudProps {
    width: number;
    height: number;
    rawWords: string;
}

export interface WordData {
    text: string;
    value: number;
}

const colors = ['#143059', '#2F6B9A', '#82a6c2'];

function wordFreq(text: string): WordData[] {
    const words: string[] = text.replace(/\./g, '').split(/\s/);
    const freqMap: Record<string, number> = {};

    for (const w of words) {
        if (!freqMap[w]) freqMap[w] = 0;
        freqMap[w] += 1;
    }
    return Object.keys(freqMap).map((word) => ({
        text: word,
        value: freqMap[word],
    }));
}

function fontScale(words: WordData[]) {
    return scaleLog({
        domain: [
            Math.min(...words.map((w) => w.value)),
            Math.max(...words.map((w) => w.value)),
        ],
        range: [10, 100],
    });
}

const fixedValueGenerator = () => 0.5;

const BodyWordCloud = ({ width, height, rawWords }: BodyWordCloudProps) => {
    const words = wordFreq(rawWords);

    const fontSizeSetter = (datum: WordData) => fontScale(words)(datum.value);

    return (
        <div className="wordcloud">
            <Wordcloud
                words={words}
                width={width}
                height={height}
                fontSize={fontSizeSetter}
                font={'Impact'}
                padding={2}
                spiral={'rectangular'}
                rotate={0}
                random={fixedValueGenerator}
            >
                {(cloudWords) =>
                    cloudWords.map((w, i) => (
                        <Text
                            key={w.text}
                            fill={colors[i % colors.length]}
                            textAnchor={'middle'}
                            transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                            fontSize={w.size}
                            fontFamily={w.font}
                        >
                            {w.text}
                        </Text>
                    ))
                }
            </Wordcloud>
        </div>
    );
};

export default BodyWordCloud;

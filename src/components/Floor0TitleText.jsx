import React from 'react';
import { runsFromItem, runTextStyle } from '../data/floor0TitleStyle';

// 0F の本・章のタイトルを、部分ごとのフォント・大きさ（titleRuns）どおりに表示する。
// 全体のフォント・大きさと改行（white-space: pre-line）は、親要素の style で当てる。
// item: 本・章のデータ（title / titleRuns）。item がなければ fallback の文字をそのまま出す
export function Floor0TitleText({ item, fallback = '' }) {
    const runs = item ? runsFromItem(item) : [];
    if (runs.length === 0) return fallback;
    return runs.map((run, i) => (
        <span key={i} style={runTextStyle(run)}>{run.text}</span>
    ));
}

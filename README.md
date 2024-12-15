# LLMに2択問題を解かせて真似できるか見る

## 使い方

denoで動かせます。
.env.copyを.envにcopyして、geminiのapi-keyを書き込んでください。

## 各コード

### 準備

- questions.json
- results.json
- divide.ts

divide.tsよってquestions.jsonとresults.jsonを分割したデータがq-and-aに書き込まれています。
questions.jsonとresults.jsonは人力 + LLMで作っています。

### LLMによる解答

- answer.ts

LLM（Gemini 1.5 flash/pro）によって与えられた2択とその回答から、新たな2択をどう選ぶかを見ます。

### 分析

- analyze.ts
- analyze.json

簡易的な分析です。confidenceに従って期待値と分散（標準偏差）を見ます。
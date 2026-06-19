// "AI in 5 minutes" — a gentle on-ramp for someone who has never touched AI.
// Rendered with the app's Markdown component.
export const INTRO = {
  en: `# AI in 5 minutes

New to AI? Start here. This is everything you need before the modules — no jargon left undefined.

## What a model actually does

A **large language model (LLM)** is software that generates text by predicting the next piece of text, over and over. It learned patterns from a huge amount of writing. Crucially, it does **not** "look things up" and it has **never seen your data** — your codebase, your tickets, your wiki. If you ask about them with no extra information, it will produce a confident guess. A confident wrong guess is called a **hallucination**.

## Why "tokens" keep coming up

Models don't read letters or words — they read **tokens** (small chunks of text). Two things are measured in tokens:

- **Limits** — a model can only hold so many tokens at once (its **context window**).
- **Cost** — you pay per token, so longer prompts and longer answers cost more.

## The three ways to make it more useful

1. **Prompting** — write clear instructions (a good **prompt**). This alone decides most of the quality.
2. **RAG** — fetch your real documents at question time and put them in the prompt, so the answer is grounded in *your* data instead of memory.
3. **Tools / agents** — let the model call real functions (look up an order, run a test) so it can *act*, not just talk.

## Two things that make AI different to work with

- It can be wrong or unsafe, so you add **guardrails** (checks on inputs and outputs) and keep **PII** (personal data) out of public tools.
- Its output is **non-deterministic** — the same prompt can give different answers — so you don't test it once; you measure quality against examples (an **eval**).

## How to use this course

Each module teaches one idea in plain language, with a worked example, a short quiz (you'll see *why* each answer is right), and a hands-on exercise. Stuck on a word? Open the **Glossary**. That's it — pick a module and start.`,

  tr: `# 5 dakikada AI

AI'a yeni mi başlıyorsun? Buradan başla. Modüllerden önce ihtiyacın olan her şey burada — tanımsız bir terim bırakmadan.

## Bir model gerçekte ne yapar

**Büyük dil modeli (LLM)**, metni tekrar tekrar bir sonraki parçayı tahmin ederek üreten bir yazılımdır. Devasa miktarda yazıdan örüntüler öğrendi. Önemlisi: bir şeyi "arayıp bulmaz" ve **senin verini hiç görmedi** — kod tabanını, taleplerini, wiki'ni. Ek bilgi vermeden bunları sorarsan, kendinden emin bir tahmin üretir. Kendinden emin yanlış tahmine **hallucination** denir.

## "Token" neden hep karşına çıkıyor

Modeller harf veya kelime değil, **token** (küçük metin parçaları) okur. İki şey token'la ölçülür:

- **Limitler** — bir model aynı anda yalnızca belli sayıda token tutabilir (**context window**).
- **Maliyet** — token başına ödersin, yani uzun prompt'lar ve uzun cevaplar daha pahalıdır.

## Onu daha kullanışlı yapmanın üç yolu

1. **Prompting** — net talimatlar yaz (iyi bir **prompt**). Kalitenin çoğunu tek başına bu belirler.
2. **RAG** — soru anında gerçek belgelerini getirip prompt'a koy; böylece cevap hafızadan değil *senin* veriden beslenir.
3. **Tool / agent** — modelin gerçek fonksiyonları çağırmasına izin ver (sipariş sorgula, test çalıştır); böylece sadece konuşmaz, *eylem* yapar.

## AI ile çalışmayı farklı kılan iki şey

- Yanlış veya güvensiz olabilir, bu yüzden **guardrail** (girdi/çıktı kontrolleri) eklersin ve **PII** (kişisel veri) public araçlardan uzak tutarsın.
- Çıktısı **non-deterministik**'tir — aynı prompt farklı cevap verebilir — bu yüzden bir kez test etmezsin; kaliteyi örneklere karşı ölçersin (**eval**).

## Bu eğitimi nasıl kullanırsın

Her modül bir fikri sade dille öğretir; çözümlü örnek, kısa bir quiz (her cevabın *neden* doğru olduğunu görürsün) ve uygulamalı bir alıştırma içerir. Bir kelimede takıldın mı? **Sözlük**'ü aç. Hepsi bu — bir modül seç ve başla.`,
};

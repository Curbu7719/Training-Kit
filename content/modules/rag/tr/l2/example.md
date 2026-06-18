# İşlenmiş Örnek: Yanlış Bir Kod Tabanı Yanıtını Teşhis Etmek

**SDLC aşaması: Bakım.** Bir kod tabanı Soru-Cevap asistanı, birkaç servis içeren bir monorepo üzerinde RAG çalıştırıyor. Bir geliştirici sorar: *"`billing` servisinin HTTP istemcisindeki varsayılan istek timeout'u nedir?"* Asistan *"5 saniye"* diye yanıtlar — ama billing'in gerçek varsayılanı *30 saniye*'dir; 5 saniyelik değer `payments` servisine aittir. Yanıt yanlıştır ve yanlış dosyayı alıntılar. Bir mühendis bunu aşama aşama şöyle teşhis eder.

**Adım 1 — Retrieval'ı incele.** Gerçekten retrieve edilen top-k chunk'ı loglarlar. En yakın chunk `payments/http_client.py`'dir ("timeout = 5"); `billing/http_client.py` chunk'ı 8. sırada, k=5 kesim noktasının altında yer alır. Yani doğru dosya prompt'a hiç ulaşmadı. Bu bir **retrieval başarısızlığıdır** — model yanlış bağlamdan sadık bir şekilde yanıtladı.

**Adım 2 — Kök nedeni bul.** İki sorun birleşir:
- **Metadata filtreleme yok.** Sorgu servise göre kısıtlamadı, bu yüzden `billing` ve `payments` chunk'ları serbestçe yarıştı; anlamsal olarak neredeyse aynılar ("HTTP istemci varsayılan timeout").
- **Saf anlamsal arama.** Tam token "billing", cümlenin genel anlamına karşı çok az ağırlık taşıdı.

**Adım 3 — Düzeltmeleri uygula.**
- `service = billing` üzerinde bir **metadata filtresi** ekleyin; böylece yalnızca billing chunk'ları aday olur.
- **Hybrid search** ekleyin; böylece literal terim "billing" doğru chunk'ı öne çıkarır.
- Aday kümesini **re-rank** edin; böylece en tam-konuya-uygun billing chunk'ı top birkaç arasına gelir.

**Adım 4 — Yeniden test et.** Artık `billing/http_client.py` 1. sırada retrieve ediliyor. Model şöyle yanıtlar: *"30 saniye (Kaynak: `billing/http_client.py`)."*

**Ders.** Bir kod tabanı yanıtı yanlış olduğunda, modeli suçlamadan önce *"doğru dosya hiç retrieve edildi mi?"* diye sorun. Çoğu düzeltme generation prompt'unda değil, retrieval'da yaşar — filtreleme, hybrid search, re-ranking, chunk'lama. Ve *yanlış servise* işaret eden bir alıntı, generation'ın değil retrieval'ın bozulduğunun ipucudur.

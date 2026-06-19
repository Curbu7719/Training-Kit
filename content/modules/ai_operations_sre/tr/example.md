# İşlenmiş Örnek: Bir AI Destek Asistanını Nöbete (On-Call) Almak

**AI destek asistanınız** canlıda. Ürün içinde, yardım merkezi makalelerinize dayanarak
(bir RAG pipeline'ı) müşteri sorularını yanıtlıyor. Geliştirmesi bitti; şimdi onu
**işletmeniz** gerekiyor. İşte bir ekip onu üretim için nasıl ayağa kaldırır ve ilk
olayından nasıl sağ çıkar.

## Adım 1 — Altın sinyalleri enstrümante et

Her şeyden önce, her asistan çağrısı bir **trace** yayar: kullanıcı sorusu, getirilen
makaleler, son yanıt, input/output **token'ları**, **TTFT** ve toplam **latency** ve her
**guardrail**'in geçip geçmediği. Ekip bu trace'lerden tek bir on-call panosu (dashboard)
oluşturur:

| Sinyal | Neyi izlerler | Neden |
|---|---|---|
| p95 TTFT | < 1.5 s | Kullanıcının gerçekten hissettiği bekleme |
| Hata / timeout oranı | < 1% | Sağlayıcı 5xx, 429'lar, kendi timeout'ları |
| Yanıt başına maliyet | ~$0.004, trendli | Faturadan önce bir kaçağı yakalar |
| Reddetme oranı | kararlı baz çizgi | Bir sıçrama, bir prompt/politika kırılması demektir |
| Dayanaklılık (örneklenmiş) | > 0.9 | Sessiz kalite kaymasını yakalar |

## Adım 2 — Sinyalleri SLO'lara ve alarmlara dönüştür

Kimsenin izlemediği bir pano işe yaramaz, bu yüzden ekip **SLO'lar** belirler ve tek
olaylara değil, *trend ihlallerine* alarm verir:

- **Erişilebilirlik (availability) SLO'su:** Yanıtların %99.5'i hatasız döner → hata oranı
  5 dakika boyunca %2'yi aşarsa on-call'a page (çağrı) gönder.
- **Latency SLO'su:** p95 TTFT < 1.5 s → 10 dakika boyunca ihlal edilirse uyar.
- **Maliyet guardrail'i:** günlük baz çizginin 1.5×'inde bir **bütçe alarmı** ve günlük
  harcama 3×'e ulaşırsa özelliği önbellekteki/fallback bir yanıta çeviren bir **katı tavan
  (hard cap)**.

Önemlisi, tek bir dayanaksız yanıt için page göndermezler — output'lar deterministik
değildir, bu yüzden tek bir kötü örnek gürültüdür. Birçok istek genelinde *dayanaklılık
oranı* düştüğünde alarm verirler.

## Adım 3 — İlk olay

Üç hafta sonra, akşam 9'da, on-call telefonu titrer: **hata oranı %14'e, p95 TTFT 9 s'ye
fırladı.** Pano, sağlayıcının 429'lar ve timeout'lar döndürdüğünü gösteriyor — kodları
değil, sağlayıcı tarafında bir yavaşlama.

"Sağlayıcı azaldı (degraded)" için **runbook** zaten yazılı:

1. **Kapsamı doğrula** — birincil sağlayıcı; ikincil sağlıklı.
2. **Failover yap** — `assistant_provider` feature flag'ini ikincil sağlayıcıya çevir. Model
   bir **provider abstraction (sağlayıcı soyutlaması)** arkasında oturduğu için yeniden dağıtım
   gerekmez; trafik saniyeler içinde kayar.
3. **Zarif bir şekilde azalt (degrade gracefully)** — birkaç saniyelik örtüşme için, hata veren
   istekler sert bir hata yerine "Bir sorun yaşıyorum — işte en üst yardım makaleleri" yanıtına
   geri çekilir (fallback).
4. **İletişim kur** — durum kanalına gönderi yap; postmortem için başlangıç zamanını not et.

Hata oranı iki dakika içinde tekrar %1'in altına düşer. Hiçbir müşteri bir hata sayfası
görmedi; küçük bir dilim biraz daha yavaş ya da fallback bir yanıt gördü.

## Adım 4 — Döngüyü kapat

Ertesi sabah, bir **suçlamasız (blameless) postmortem**: tetikleyici (birincil sağlayıcının
bölgesel yavaşlaması), neyin işe yaradığı (alarm çaldı, failover flag'i çalıştı) ve bir
iyileştirme (bir insanı beklemek yerine, hata oranı 2 dakika boyunca > %10 olduğunda otomatik
bir failover ekle). Bunu dosyalar ve yola devam ederler.

**Çıkarılan ders.** Bunların hiçbiri daha akıllı bir modelle ilgili değildi. Özellik ayakta
kaldı çünkü **gözlemlendi** (alarm gerçek bir sinyalde çaldı), **güvenilirdi** (failover bir
flag'in arkasında önceden bağlanmıştı), **maliyet-korumalıydı** (bir tavan hazır bekliyordu) ve
**işletildi** (bir runbook, sabahın 2'sindeki bir telaşı iki dakikalık bir flag değişikliğine
dönüştürdü). Bir AI özelliği geliştirmek ile onu işletmek arasındaki fark işte budur.

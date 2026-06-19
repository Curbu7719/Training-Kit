# Üretimde AI İşletmek (SRE ve Ops)

Bir AI özelliği geliştirmek onu "demoda çalışır" hale getirir. Onu **işletmek** ise, siz
izlemezken sabahın 2'sinde çalışmaya devam etmesini sağlayan her şeydir — ve bir LLM
özelliği, normal bir servisin başarısız olmadığı şekillerde başarısız olur. Model,
**kontrol etmediğiniz uzak bir bağımlılıktır** ve sizin tek bir satır kodunuz bile
değişmeden yavaşlayabilir, pahalanabilir ya da sessizce *kötüleşebilir*. Bu modül,
on-call (nöbet) bakış açısıdır: bir AI özelliğini nasıl izlersiniz, güvenilir tutarsınız,
faturasını makul tutarsınız ve bozulduğunda nasıl müdahale edersiniz.

**Çalışan bir örnek.** Ekibiniz bir **AI destek asistanı** yayına aldı — ürününüzün
içinde, canlı, 7/24, müşteri sorularını yanıtlayan, retrieval destekli (getirme tabanlı)
bir özellik. Her testi geçti ve demoda kusursuz görünüyordu. Şimdi *üretimde* ve işletmesi
sizin sorumluluğunuzda. Aynı disiplinler yayına alınmış herhangi bir AI özelliği için
geçerlidir (ürün içi bir özetleyici, bir agent, bir CI inceleyici): gerçek trafik ona
çarptığı anda, onu bir servis gibi işletirsiniz.

## Bir AI özelliğini işletmenin dört temel direği

**1. Gözlemlenebilirlik (observability) — göremediğinizi düzeltemezsiniz.** Normal bir istek
bir durum kodu ve bir süre loglar. Bir AI isteği daha fazlasına ihtiyaç duyar, çünkü
"200 OK" yine de yanlış, dayanaksız (ungrounded) ya da güvensiz bir yanıt olabilir. Her
çağrı için bir **trace** (iz) yakalayın: girdi, getirilen context, son output, **token
sayıları** (input + output), **latency** (gecikme) ve **guardrail (koruma) sonuçları**.
Bunlardan bir **LLM özelliğinin altın sinyallerini (golden signals)** izlersiniz:

- **Latency** — özellikle **time-to-first-token (TTFT, ilk token'a kadar geçen süre)** ve toplam sürenin **p95**'i, yalnızca ortalama değil.
- **Hata / timeout oranı** — sağlayıcı 5xx, rate-limit (429) ve kendi timeout'larınız.
- **İstek başına maliyet** — token × fiyat, zaman içinde trend olarak.
- **Reddetme (refusal) oranı** — modelin ne sıklıkta yanıt vermeyi reddettiği; ani bir sıçrama bir prompt veya politika sorununa işaret eder.
- **Kalite sinyalleri** — dayanaklılık (groundedness), kullanıcı thumbs-down (beğenmeme), düzenlemeler — kalite bir üretim metriğidir, yalnızca yayın öncesi bir metrik değil.

**2. Güvenilirlik (reliability) — bağımlılığın başarısız olacağına göre tasarlayın.**
Sağlayıcılar timeout verir, rate-limit uygular ve zaman zaman çöp döndürür. Güvenilir
işletmek, bir **degraded mode (azaltılmış/bozulmuş mod)** zaten devrede demektir: ikincil
bir sağlayıcıya ya da önbellekteki bir yanıta **fallback (geri çekilme)**, her çağrıda
**timeout'lar** ve **backoff'lu retry'lar (geri çekilmeli yeniden denemeler)** (sınırlı,
çünkü retry'lar para ve latency ekler). Amaç, bir sağlayıcı aksaklığının bir kesinti değil,
biraz daha kötü bir yanıt haline gelmesidir.

**3. Maliyet yönetişimi (FinOps) — fatura bir üretim sinyalidir.** LLM harcaması trafikle
ölçeklenir ve tek bir kötü değişiklikten fırlayabilir. İşletmek; **bütçe alarmları**,
kaçak maliyet için bir **katı harcama tavanı (hard spend cap)** ya da **kill-switch**, ve
*hangi* özelliğin veya ekibin harcadığını bilmenizi sağlayan **atıf (attribution)** demektir.
Yalnızca finans ekibinizin bir ay sonra gördüğü bir maliyet grafiği, gözlemlenebilirlik
değildir.

**4. Olay müdahalesi (incident response) — ihtiyaç duymadan önce bir planınız olsun.**
Bir "AI olayı" farklı görünür: bir sağlayıcı kesintisi, bir **kalite regresyonu** (bir model
veya prompt değişikliğinden sonra yanıtlar kötüleşti), bir **maliyet kaçağı (cost runaway)**,
ya da vahşi ortamda bir guardrail atlatması. Her biri için bir **runbook** istersiniz ve her
şeyden önce **hızlı bir rollback (geri alma)** — ve prompt'ları ve model seçimlerini **feature
flag'lerin arkasında** yayına aldığınız için, rollback acil bir yeniden dağıtım (redeploy)
değil, bir *config değişikliğidir*.

## AI ops'unu farklı kılan iki şey

- **Determinizm yokluğu (non-determinism).** Aynı girdi farklı output üretebilir, bu yüzden
  tek bir kötü yanıt mutlaka bir olay değildir — tek bir örneğe değil, **oranlara ve
  trendlere** alarm verirsiniz.
- **Sessiz regresyonlar.** Bir sağlayıcı bir modeli değiştirebilir, ya da bir prompt düzenlemesi
  CI'yı geçebilir ama yine de gerçek yanıtları kötüleştirebilir. Birim testleri bunu yakalamaz;
  **çevrimiçi (online) kalite izleme** yakalar.

## Her rol bunu nasıl kullanır

- **Developer/Mühendis:** Tracing ve altın sinyalleri enstrümante eder, timeout'ları, retry'ları,
  fallback'i ve bir kill-switch'i bağlar ve anlık rollback için prompt/model değişikliklerini
  flag'lerin arkasına koyar.
- **İş Analisti:** Hangi kalite ve maliyet sinyallerinin iş etkisini yansıttığını ve hangi bütçe
  eşiklerinin alarm vermesi gerektiğini tanımlar.
- **PM/Ürün Sahibi:** SLO'lara ve harcama tavanına sahip çıkar ve sağlayıcı başarısız olduğunda
  kabul edilebilir azaltılmış (degraded) deneyime karar verir.
- **QA ve Mimar:** Gözlemlenebilirliği ve alarmları, failover (yük devretme) yollarını ve olay
  runbook'larını tasarlar ve bunları üretimde ihtiyaç duyulmadan önce başarısızlık altında
  doğrular.

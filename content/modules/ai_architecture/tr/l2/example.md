# Çözümlü Örnek: Bir Model Yükseltmesini Sağlamlaştırmak ve Yayınlamak

Yerleşik bir destek asistanı, bir orkestrasyon katmanı üzerinden "Model A" üzerinde çalışıyor.
Ekip, bir kalite regresyonu veya bir kesinti riski almadan daha yeni, daha ucuz bir "Model
B"ye yükseltmek istiyor. L1 mimarisi yerinde; şimdi onu sağlamlaştırıyorlar.

**Adım 1 — Sağlayıcıyı gerçekten takas edilebilir kıl.** Orkestratör zaten dahili bir
`answer()` arayüzünü çağırıyor, ama Model A'nın SDK ayrıntıları birkaç yere sızmış. Bunu
temizleyip arayüzün tekdüze bir sonuç (metin, token kullanımı, normalize edilmiş hata türü)
döndürmesini sağlıyorlar. Artık A veya B'yi seçmek tek bir config değeri.

**Adım 2 — Çağrının etrafına güvenilirlik ekle.** `answer()`'ı şunlarla sarıyorlar:

- bir **timeout** (kullanıcıyı askıda bırakmak yerine hızlı başarısız ol),
- geçici hatalarda **backoff'lu retry**, maliyet/latency'yi sınırlamak için en fazla 2
  denemeyle,
- tekrarlanan başarısızlıklardan sonra kısa bir süre için sağlayıcıyı çağırmayı durduran ve
  **degraded** bir "lütfen kısa süre sonra tekrar deneyin" mesajı sunan bir **circuit
  breaker**.

**Adım 3 — Herhangi bir kullanıcı Model B'yi görmeden önce çevrimdışı değerlendir.** Bilinen
doğru yanıtlara sahip 200 gerçek sorudan oluşan sabit bir **eval setini** her iki modelden
geçirir ve temellendirmeyi (yanıt getirilen bir pasaja atıfta bulunuyor mu?), reddetme
oranını ve maliyeti karşılaştırırlar. Model B, ~%40 daha düşük maliyetle kaliteyi eşliyor —
ama zaman zaman atıfları düşürdüğünü fark ediyorlar, bu yüzden atıfsız yanıtları reddetmek
için **output guardrail'ini** sıkılaştırıyorlar.

**Adım 4 — Shadow çalıştırması.** Bir hafta boyunca her canlı istek hâlâ Model A'ya gidiyor
(kullanıcı A'nın yanıtını görüyor), ama bir kopya Model B'ye gönderilip loglanıyor. Logları
karşılaştırmak, B'nin yalnızca eval setinde değil, gerçek trafikte de iyi davrandığını
doğruluyor.

**Adım 5 — Bir flag'in arkasında kademeli yayılım.** Trafiğin **%5'ini** Model B'ye
yönlendirmek için bir feature flag'i çeviriyorlar, gözlemlenebilirlik panolarını
(temellendirme, latency, hata oranı) izliyorlar, ardından %25, %50 ve nihayet %100'e
genişliyorlar. Herhangi bir adımdaki bir regresyon tek satırlık bir **rollback'tir**: flag'i
Model A'ya geri çevir.

**Bu neden işe yarar.** Her riskli değişiklik geri alınabilir ve gözlemlenebilirdir. Sağlayıcı
soyutlaması takası bir config değişikliği yaptı; güvenilirlik desenleri sağlayıcı
başarısızlıklarını kapsadı; çevrimdışı eval artı bir shadow çalıştırması kalite sorunlarını
kullanıcılardan önce yakaladı; ve flag'li, kademeli yayılım, anlık bir rollback yoluyla etki
yarıçapını küçük tuttu.

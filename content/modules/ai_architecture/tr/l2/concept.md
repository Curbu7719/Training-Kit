# AI Sistem Mimarisi ve Dağıtımı — Daha Derine

L1, referans mimarisini (client → orkestrasyon → model sağlayıcı, artı vector store,
araçlar, guardrail'ler, gözlemlenebilirlik) ve kesişen kaygıları tanıttı. L2, daha zor
tasarım kararlarına odaklanır: bu parçaların nasıl başarısız olduğu, onları nasıl güvenilir
kıldığınız ve onları nasıl güvenle yayınladığınız.

**Pratikte sağlayıcı soyutlaması.** Modeli dahili bir arayüzün arkasına koymak yalnızca
düzenli kod meselesi değildir — **fallback'leri**, **routing'i** ve **çok sağlayıcılı**
stratejileri mümkün kılan şey budur. Olgun bir soyutlama, kararlı bir dahili sözleşme
(input, output, token kullanımı, hata türleri) sunar ve sağlayıcıya özgü ayrıntıları gizler,
böylece birincil bir sağlayıcı ikincil bir sağlayıcıya devredilebilir ya da kolay istekler
daha ucuz bir modele yönlendirilebilir; hepsi özellik koduna dokunmadan.

**Güvenilirlik desenleri.** Sağlayıcı API'leri zaman aşımına uğrayan, rate-limit uygulayan
ve zaman zaman hatalı biçimlendirilmiş output döndüren uzak servislerdir. Buna göre tasarım
yapın: her çağrıda **timeout'lar**, geçici hatalar için **backoff'lu retry'lar**, başarısız
bir sağlayıcının kademeli yayılmasını önleyen **circuit breaker'lar** ve sert bir hata yerine
bir **degraded mod** (bir yedek model, cache'lenmiş bir yanıt veya zarif bir mesaj). Retry'lar
maliyet ve latency ile etkileşir, bu yüzden onları sınırlayın.

**Bir pipeline olarak guardrail'ler.** Guardrail'ler en iyi tek bir kontrol olarak değil,
aşamalar olarak görülür: *input* guardrail'leri (izin verilmeyen veya enjeksiyon tarzı
istekleri engelle, PII'yi sağlayıcıya ulaşmadan önce sıyır veya maskele) ve *output*
guardrail'leri (formatı doğrula, yanıtın getirilen kaynaklara temellendiğini kontrol et,
sızdırılmış PII veya güvensiz içeriği tara). Başarısız bir guardrail'i bir istisna değil,
kendi işlenmesi olan birinci sınıf bir sonuç olarak ele alın.

**Veri yönetişimi ve gizlilik.** Sınırınızdan sağlayıcıya hangi verinin çıktığına bilinçli
karar verin. Prompt'lardaki PII'yi en aza indirin ve maskeleyin, veri yerleşimi (data
residency) ve saklama kurallarına uyun ve sağlayıcının verilerinizi loglayıp loglayamayacağını
veya üzerinde eğitim yapıp yapamayacağını bilin. Mimari, PII akışını açık ve denetlenebilir
kılmalıdır — bu genellikle bir keyfilik değil, bir lansman engelleyicisidir.

**Altyapı olarak değerlendirme ve gözlemlenebilirlik.** Ölçemediğinizi iyileştiremezsiniz.
Her isteği uçtan uca izleyin (getirilen context, prompt, model output'u, token'lar, latency,
guardrail sonuçları) ve değişiklikleri yayınlamadan önce bir **çevrimdışı eval seti**
çalıştırın. Çevrimiçi olarak yalnızca uptime değil, kalite sinyallerini (temellendirme,
reddetme oranı, kullanıcı geri bildirimi) izleyin.

**Dağıtım ve yayılım desenleri.** Prompt ve model değişikliklerini kod değişiklikleri gibi
ele alın. **Feature flag'lerin** arkasında yayınlayın, **kademeli** olarak yayın yapın
(dahili kullanıcılar → küçük bir kohort → tümü) ve **canary** veya **shadow** çalıştırmaları
düşünün (trafiğin bir kopyasını yeni bir modele gönderin ve geçmeden önce çevrimdışı
karşılaştırın). Her zaman hızlı bir geri alma (rollback) tutun — önceki modele veya prompt'a
bir config dönüşü — çünkü LLM davranışı bir birim testinin yakalamayacağı ince biçimlerde
geriye gidebilir.

## Her rol bunu nasıl kullanır

- **Developer/Mühendis:** Sağlayıcı soyutlamasını timeout'lar, retry'lar ve fallback'lerle
  kurar; input/output guardrail aşamalarını ve uçtan uca izlemeyi uygular.
- **İş Analisti:** Lansmanı kapılayan PII/veri akışını ve yönetişim gereksinimlerini
  belgeler ve işin önemsediği kalite sinyallerini tanımlar.
- **PM/Ürün Sahibi:** Canary/shadow karşılaştırmalarıyla flag'li, kademeli yayılımları ve
  model veya prompt değişiklikleri için açık bir geri alma planı planlar.
- **QA ve Mimar:** Güvenilirliği (circuit breaker'lar, degraded modlar) tasarlar, çevrimdışı
  eval setini sürdürür ve başarısızlık altında failover ve guardrail davranışını doğrular.

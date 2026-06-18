# İpuçları ve Alternatif İfadeler — L2

**Temel fikirlerin alternatif ifadeleri**

- "Sağlayıcı soyutlaması, fallback'leri, routing'i ve çok sağlayıcılı failover'ı mümkün kılan
  şeydir — model, sabitlenmiş kod değil, bir config seçimi haline gelir."
- "Güvenilirliği umut değil, tasarım olarak ele alın: her sağlayıcı çağrısı için timeout'lar,
  backoff'lu sınırlı retry'lar, circuit breaker'lar ve bir degraded mod."
- "Prompt ve model değişikliklerini kod gibi yayınlayın: flag'lerin arkasında, kademeli
  olarak, önce çevrimdışı eval ve shadow çalıştırmalarıyla ve her zaman hızlı bir rollback'le."

**İpucu yığını**

- **H1 (dürtme):** Herhangi bir değişiklik için iki soru sorun — *bu nasıl başarısız olur?*
  ve *bunu nasıl hızlıca geri alırım?* Güvenilirlik ve rollback mimarinin parçasıdır, sonradan
  düşünülecek şeyler değil.
- **H2 (yapı):** Kaygıları ayırın: sağlayıcı soyutlaması (takas edilebilirlik), güvenilirlik
  (timeout/retry/circuit-breaker/degraded mod), guardrail'ler (input ve output aşamaları),
  yönetişim (sınırınızdan hangi PII çıkıyor) ve yayılım (flag'ler, kademeli, canary/shadow,
  rollback). Güçlü bir tasarım her birinin nerede yaşadığını adlandırır.
- **H3 (çözümlü yol):** Bir modeli güvenle yükseltmek için: onu arayüzün arkasında takas
  edilebilir kıl, çağrıyı güvenilirlik desenleriyle sağlamlaştır, yeni modeli bir çevrimdışı
  eval setinde değerlendir, canlı trafiğe karşı shadow et, ardından bir flag'in arkasında
  anlık bir rollback ile kademeli olarak yayınla. Her adım değişikliği gözlemlenebilir ve
  geri alınabilir kılar.

**Kısa SSS**

- **Neden yeni modeli bir kerede herkese dağıtmıyoruz?** LLM davranışı birim testlerinin
  kaçırdığı ince biçimlerde geriye gidebilir. Eval ve shadow çalıştırmalarıyla kademeli,
  flag'li yayılım, yalnızca kullanıcıların küçük bir kısmı maruz kalırken regresyonları
  yakalar ve rollback anlıktır.
- **Bir shadow çalıştırması nedir?** Canlı trafiğin bir kopyasını, yanıtları loglanan ama
  kullanıcılara gösterilmeyen yeni bir modele göndermek, böylece geçmeden önce gerçek dünya
  davranışını karşılaştırabilirsiniz.
- **Input'a karşı output guardrail'lerine ne ait?** Input guardrail'leri izin verilmeyen veya
  enjeksiyon tarzı istekleri engeller ve PII'yi sağlayıcıya ulaşmadan önce maskeler; output
  guardrail'leri formatı doğrular, getirilen kaynaklardaki temellendirmeyi kontrol eder ve
  sızdırılmış PII veya güvensiz içeriği tarar.
- **Retry'ları neden sınırlayalım?** Sınırsız retry'lar maliyeti ve latency'yi katlar ve
  zaten zorlanan bir sağlayıcıyı dövebilir. Denemeleri sınırlayın ve bir circuit breaker ile
  bir degraded fallback ile eşleştirin.

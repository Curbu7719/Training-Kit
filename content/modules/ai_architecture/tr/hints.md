# İpuçları ve Alternatif İfadeler

**Temel fikrin alternatif ifadeleri**

- "Bir LLM uygulaması, model artı onun etrafında prompt'lar kuran, context getiren, araçlar
  çağıran ve guardrail'leri uygulayan bir orkestrasyon katmanıdır."
- "Model sağlayıcıyı, sisteminizin sabitlenmiş bir çekirdeği değil, bir soyutlamanın
  arkasındaki takas edilebilir bir bağımlılık olarak ele alın."
- "Kesişen kaygılar — sırlar, PII/yönetişim, güvenilirlik/fallback'ler, izleme, maliyet
  kontrolleri — tek bir bileşene değil, tüm sisteme uygulanır."

**İpucu yığını**

- **H1 (dürtme):** *Bu sorumluluk nereye ait?* diye sorun. Sırları, iş kurallarını veya
  kararları içeren her şey sunucu tarafında orkestrasyon katmanına aittir — asla client'a
  değil.
- **H2 (yapı):** Bir isteği kutular boyunca izleyin: client → orkestrasyon → (retrieval /
  guardrail'ler / araçlar) → model → (output guardrail) → geri. Her kutu için neyin sahibi
  olduğunu ve neyin sahibi *olmaması* gerektiğini sorun.
- **H3 (çözümlü yol):** Sırlar ve mantık orkestrasyona gider; temellendirme vector store
  üzerinden geçer; gerçek dünya eylemleri araçlar üzerinden geçer; güvenlik kontrolleri
  guardrail'lere gider; görünürlük gözlemlenebilirliğe gider. Modeli, takas edilebilmesi ve
  başarısız olduğunda ona bir fallback verilebilmesi için bir soyutlamanın arkasında tutun.

**Kısa SSS**

- **Modeli neden doğrudan client'tan çağırmıyoruz?** Client API anahtarını tutmak zorunda
  kalırdı (bir güvenlik riski) ve prompt'lar, guardrail'ler, loglama ve maliyet üzerindeki
  merkezi kontrolü kaybederdiniz. Orkestrasyon katmanı tüm bunlara sahip çıkmak için vardır.
- **Vector store aslında ne yapar?** Belgelerinizin embedding'lerini saklar, böylece
  uygulama bir soruyla en alakalı pasajları getirip modele besleyebilir — yanıtları modelin
  belleği yerine gerçek veriye temellendirir.
- **Bu bağlamda bir fallback nedir?** Sağlayıcı başarısız olduğunda veya yavaş olduğunda
  planlanmış bir yanıt — yeniden dene, bir yedek modele yönlendir veya zarif bir mesaj
  döndür — böylece bir sağlayıcı kesintisi tüm özelliği çökertmesin.
- **Model sağlayıcıyı neden soyutlayalım?** Böylece uygulamayı yeniden yazmak yerine
  yapılandırmayı değiştirerek sağlayıcıları takas edebilir, routing ekleyebilir veya kolay
  görevler için daha ucuz bir model çalıştırabilirsiniz.

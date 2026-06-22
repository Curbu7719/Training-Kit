# AI Sistem Mimarisi ve Dağıtımı

Kullanışlı bir AI özelliği neredeyse hiçbir zaman "sadece model" değildir. Modelin
etrafında, ham bir metin-tahmin motorunu güvenilir bir ürüne dönüştüren bir dizi bileşen
bulunur. Bir **referans mimarisi**, her sorumluluğun nerede yaşadığı hakkında akıl
yürütmenize yardımcı olur.

**Çekirdek yol.** Çoğu LLM uygulaması aynı akışı izler:

- **Client** — isteği yakalayan ve sonucu gösteren kullanıcıya dönük uygulama (web, mobil
  veya başka bir servis).
- **Uygulama / orkestrasyon katmanı** — özelliğin sunucu tarafındaki "beyni". Prompt'u
  kurar, hangi modelin çağrılacağına karar verir, herhangi bir çok adımlı mantığı yürütür ve
  kuralları uygular. Uygulamanızın kendi kodu burada yaşar; asla client'ta durmamalıdır.
- **Model sağlayıcı** — bir API üzerinden çağrılan LLM'in kendisi. Değiştirilebilirdir: iyi
  bir tasarım onu sabitlenmiş bir çekirdek değil, takas edilebilir bir bağımlılık olarak ele
  alır.

**Destekleyici bileşenler.** O yolun etrafına yaygın olarak şunları eklersiniz:

- **Vector store** — yanıtları temellendirmek için uygulamanın ilgili context'i
  getirebilmesi için belgelerinizin embedding'lerini tutar (retrieval-augmented generation).
- **Araçlar / fonksiyonlar** — modelin yalnızca metin üretmek yerine gerçek eylemleri
  (bir siparişi arama, bir hesaplama yapma, harici bir API'yi çağırma) tetiklemesini sağlar.
- **Guardrail'ler** — güvensiz, konu dışı veya hatalı biçimlendirilmiş içeriği modele veya
  kullanıcıya ulaşmadan engelleyen input ve output kontrolleri.
- **Değerlendirme ve gözlemlenebilirlik** — sistemin ne yaptığını ve iyi yapıp yapmadığını
  görebilmeniz için loglama, izleme (tracing) ve kalite kontrolleri.

**Bir analoji.** Bir çağrı merkezini düşünün. Müşteri (client), dosyalama sisteminde
(vector store) bir şeyler arayan, diğer departmanları arayabilen (araçlar), uyumluluk
kurallarıyla bir senaryoyu izleyen (guardrail'ler) ve kalite için kaydedilip incelenen
(gözlemlenebilirlik) bir ön büroyla (orkestrasyon) konuşur. Yanıt veren asıl "temsilci",
değiştirilebilir bir personel üyesidir (model).

**Kesişen kaygılar.** Bunlar tek bir kutuya değil, tüm sisteme uygulanır: sırları ve API
anahtarlarını sunucu tarafında tutmak; PII için gizlilik ve veri yönetişimi; sağlayıcı
başarısız olduğunda güvenilirlik ve **fallback'ler**; modelleri takas edebilmeniz için
**sağlayıcı soyutlaması**; izleme ve loglama; ve maliyet kontrolleri. **Dağıtım ve
yayılım** normal yazılım pratiğini izler — flag'lerin arkasında yayınlayın, kademeli olarak
yayın yapın ve değerlendirme metriklerini izleyin.

## Her rol bunu nasıl kullanır

- **Enterprise Architect:** Güvenilirlik (fallback'ler, sağlayıcı takas edilebilirliği) için tasarım yapar ve üretimde regresyonları yakalamak için gözlemlenebilirlik ve değerlendirmenin yerinde olmasını sağlar.
- **Developer:** Orkestrasyon katmanını uygular, retrieval, araçları ve guardrail'leri bağlar ve modelin takas edilebilmesi için onu bir soyutlamanın arkasında tutar.
- **Security Engineer:** PII'nin mimari boyunca nereye aktığını ve lansman öncesi hangi adımların veri yönetişimi kontrolleri gerektirdiğini haritalar.
- **Project Manager:** Özelliğin risk düzeyinin hangi guardrail ve fallback'leri gerektirdiğine karar verir ve yayılımı planlar.
- **DevOps Engineer:** Flag'li, kademeli yayılımı ve metrikleri izleyen gözetimi yürütür.

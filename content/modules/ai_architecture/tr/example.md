# Çözümlü Örnek: Bir Dahili Politika Asistanını Mimarlamak

Bir şirket, çalışanların İK ve BT politikaları hakkındaki sorularını ilgili politika
belgesine atıfta bulunarak yanıtlayan dahili bir asistan istiyor. Ekip kod yazmadan önce
mimariyi taslaklıyor.

**Tasarladıkları istek akışı.**

1. **Client** — dahili portaldaki bir sohbet kutusu. Yalnızca soruyu yakalar ve yanıtı
   render eder; hiçbir API anahtarı tutmaz ve hiçbir iş mantığı çalıştırmaz.
2. **Uygulama / orkestrasyon katmanı** — sunucu tarafındaki bir servis soruyu alır. Önemli
   olan her şey burada gerçekleşir.
3. **Retrieval (vector store)** — orkestratör soruyu embed eder ve bir politika belgeleri
   vector store'unu arar, en alakalı 3 pasajı çeker.
4. **Guardrail (input)** — devam etmeden önce sorunun yasak bir şey isteyip istemediğini
   (örneğin başka bir çalışanın maaşı) kontrol eder.
5. **Model sağlayıcı** — orkestratör, getirilen pasajları artı soruyu içeren bir prompt kurar
   ve LLM'i çağırır, ona *yalnızca* sağlanan pasajlardan yanıt vermesi ve onlara atıfta
   bulunması talimatını verir.
6. **Guardrail (output)** — yanıtı döndürmeden önce gerçek bir getirilen pasaja atıfta
   bulunduğunu ve bariz bir PII sızıntısı içermediğini doğrular.
7. **Gözlemlenebilirlik** — tüm alışveriş (soru, getirilen belgeler, model yanıtı, latency,
   token'lar) değerlendirme için loglanır.

**Temel kararlar ve nedenleri.**

- **Sırlar sunucu tarafında kalır.** Model API anahtarı orkestrasyon katmanının ortamında
  yaşar, asla tarayıcıda değil, böylece client kodundan çalınamaz.
- **Model bir soyutlamanın arkasındadır.** Orkestratör dahili bir `answer()` arayüzünü
  çağırır, böylece sağlayıcıları takas etmek veya daha sonra daha ucuz bir modele
  yönlendirmek bir yeniden yazma değil, bir config değişikliğidir.
- **Retrieval yoluyla temellendirme** halüsinasyonu azaltır: model kendi belleğinden değil
  gerçek politika metninden yanıt verir ve atıflar yanıtları doğrulanabilir kılar.
- **Fallback.** Sağlayıcı çağrısı başarısız olursa, orkestratör bir kez yeniden dener,
  ardından çökmek yerine zarif bir "lütfen kısa süre sonra tekrar deneyin" mesajı döndürür.

**Yayılım.** Önce BT ekibine bir özellik flag'inin arkasında yayınlarlar, yanlış veya
atıfsız yanıtlar için değerlendirme loglarını izlerler, ardından kalite tutunca şirket
geneline yayarlar.

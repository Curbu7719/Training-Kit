# İpuçları ve Alternatif İfadeler — L2

**Temel fikirlerin alternatif ifadeleri**

- "Streaming latency'si iki sayıdır: ilk-yoruma-kadar-süre ve ondan sonraki token'ların
  hızı — toplam süre kabaca TTFT artı output token'ları bölü token hızıdır."
- "Bir cascade önce ucuz bir modelle triyaj yapar ve yalnızca bir kontrol başarısız
  olduğunda riskli değişiklikleri pahalı bir modele yükseltir, böylece yüksek fiyatı
  PR'lerin zor azınlığında ödersiniz."
- "Tek bir model çağrısını değil, PR başına tüm pipeline'ı — diff özeti, kod getirme, yorum
  taslaklama ve retry'lar — bütçeleyin."

**İpucu yığını**

- **H1 (dürtme):** Bir kaldıracın latency veya maliyet denkleminin hangi *terimine*
  gerçekten dokunduğunu sorun. Streaming, merge kapısında algılanan TTFT'yi değiştirir; daha
  kısa output, üretim süresini ve output maliyetini değiştirir; bir cascade, birçok PR
  genelinde *ortalama* maliyeti değiştirir.
- **H2 (yapı):** Bir cascade için, harmanlanmış maliyeti şöyle yazın: (ucuz triyaj edilen
  oran × ucuz maliyet) + (yükseltilen oran × [ucuz maliyet + pahalı maliyet]). Yükseltilen
  fonksiyonlar *her iki* çağrı için de öder. Latency için, etkileşimli yolları (merge kapısı
  — TTFT/toplam optimize edin) toplu yollardan (gecelik toplu işler — throughput optimize
  edin) ayırın.
- **H3 (çözümlü yol):** Küçük bir model değişen fonksiyonların %80'ini triyaj eder ve %20'si
  yükselirse, %20 oranının sabit kalması için yeterince ucuz *ve* doğru olmalıdır. Test
  gereken fonksiyonları atlarsa güven kaybedersiniz; bir özellik sprint'inde yükseltme
  tırmanırsa tasarrufu kaybedersiniz. Eşiği geçmiş PR'ler üzerinde ayarlayın ve kaymayı
  (drift) izleyin.

**Kısa SSS**

- **Batching neden tek tek CI çağrılarını yavaşlatabilir?** Batching ve yüksek eşzamanlılık
  throughput'u artırır, ama istekler kuyruğa girebilir ve bekleme ekleyebilir. Gecelik toplu
  işler için harika, etkileşimli bir merge-kapısı kontrolü için riskli.
- **Prefix caching ne zaman değer?** Büyük bir prompt ön eki (kodlama standartları, az
  örnekli inceleme örnekleri, paylaşılan repo context'i) birçok PR genelinde tekrarlandığında
  — her seferinde tam input fiyatı yerine onu yeniden işlemek için düşük bir oran ödersiniz.
- **Bir cascade her zaman para tasarrufu sağlar mı?** Yalnızca çoğu PR gerçekten kolay
  olduğunda. Yükseltme yüksekse — yeniden düzenleme ağırlıklı bir sprint — çoğu fonksiyonda
  iki çağrı için ödersiniz ve doğrudan büyük modele gitmekten daha pahalıya gelebilirsiniz.
- **Sürpriz bir CI faturasının en yaygın nedeni nedir?** Sınırsız veya beklenmedik biçimde
  uzun bir inceleme ya da PR başına sessizce birçok çağrıya (artı retry'lar) yayılan bir
  kontrol. Her ikisi de PR başına token ve çağrı sayısı loglaması olmadan görünmezdir.

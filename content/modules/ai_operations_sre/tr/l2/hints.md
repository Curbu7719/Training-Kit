# İpuçları ve Alternatif İfadeler

**Temel fikrin alternatif ifadeleri**

- "Ölçekte olayları doğaçlamayı bırakır ve sınıflandırırsın — sağlayıcı kesintisi, kalite
  regresyonu, maliyet kaçağı, güvenlik atlatması — her biri bir runbook'la, ve her üretim
  başarısızlığı, çevrimdışı paketin bir sonraki sefere yakalaması için yeni bir eval vakası olur."
- "Model kontrol etmediğin bir bağımlılıktır: deprecate edilir ve davranışı değişir, bu yüzden
  sürümleri sabitlersin, prompt'ları sürümlenmiş artefakt olarak ele alırsın ve shadow → canary →
  flag'li yayına alma ile, rollback hazırken migrate edersin."
- "Ölçekte FinOps; maliyeti özellik ve tenant bazında atfetmek, yalnızca sabit eşiklere değil
  anomalilere (trendden sapma) alarm vermek ve bir tavanı aşmanın azaltma mı yoksa sert başarısızlık
  mı olması gerektiğine her özellik için karar vermek demektir."

**İpucu yığını**

- **H1 (dürtme):** *Zaman içinde ve hacimde* neyin değiştiğini düşün: model deprecate edilir,
  harcama ekipler arasına yayılır ve her trace'i tutamazsın. Cevap genellikle tek seferlik bir
  düzeltme değil, bilinçli bir süreçtir.
- **H2 (yapı):** Bir model değişikliği için güvenli yol her zaman shadow (çevrimdışı + trafik
  kopyasını karşılaştır) → canary (küçük kohort, çevrimiçi monitörleri izle) → flag-değişikliği
  rollback'i ile tam yayına almadır. Maliyet için, atfı (kim harcadı) kontrolden (yumuşak vs katı
  tavan) ayır.
- **H3 (işlenmiş yol):** Zorunlu bir deprecation: yeni sürümün uyacağını umma — onu eval setine ve
  gerçek trafiğe karşı shadow yap, kaliteyi/maliyeti/latency'yi karşılaştır, regresyonları düzelt
  (örneğin daha laf kalabalığı bir output'u sınırla), %5'te canary yap, ardından geri çevirebileceğin
  bir flag'in arkasında yayına al.

**Kısa SSS**

- **Neden modeli yalnızca değiştirmek yerine shadow yapıyoruz?** Aynı prompt yeni bir sürümde farklı
  davranabilir ve bir kalite düşüşü sessizdir. Shadow, herhangi bir kullanıcı görmeden önce yeni
  sürümü gerçek girdilerde karşılaştırır, böylece umutla değil kanıtla migrate edersin.
- **Zaten bir katı tavanım varsa neden anomali tespiti?** Tavan felaketi durdurur; anomali alarmı,
  düzeltmesi ucuzken — tavandan çok önce — bir *yavaş tırmanışı* ya da erken bir sıçramayı yakalar.
  Farklı başarısızlık hızlarını kapsarlar.
- **Her olay neden bir eval vakası olur?** Çünkü bir birim testi deterministik olmayan bir
  regresyonu yakalamaz. Her üretim başarısızlığını bir çevrimdışı eval vakasına dönüştürmek,
  regresyon paketinin dişlenmesini ve aynı bug'ın sessizce geri dönememesini sağlar.
- **Tavanda azalt mı yoksa sert başarısızlık mı — hangisi doğru?** Özelliğe bağlıdır. Kritik,
  kullanıcıya dönük bir asistan kullanılabilir kalmak için azaltmalıdır (daha ucuz model ya da
  önbellek); kritik olmayan bir arka plan işi, maliyeti kesin olarak sınırlamak için sert başarısız
  olabilir.

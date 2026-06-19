# AI'ı Ölçekte İşletmek — Olay Müdahalesi, FinOps ve Yaşam Döngüsü

L1, bir AI özelliğini çalıştırmanın dört temel direğini kapsadı: gözlemlenebilirlik,
güvenilirlik, maliyet yönetişimi ve olay müdahalesi; bunları üretimdeki bir AI destek asistanı
etrafında çerçeveledi. L2 ise bu direklerin gerçek ölçekte ve zaman içinde neye dönüştüğüdür —
tek bir özellik ayda milyonlarca çağrıya hizmet ettiğinde, maliyetler ekipler arasına yayıldığında
ve altındaki model **siz farkında olmadan değiştiğinde**.

**Olay taksonomisi ve runbook'lar.** Ölçekte doğaçlamayı bırakır ve sınıflandırırsınız. AI
olayları, her biri kendi runbook'una ve önem derecesine (severity) sahip tanınabilir sınıflara
ayrılır:

- **Sağlayıcı kesintisi / rate-limit** — 5xx, 429'lar, timeout'lar. Runbook: ikincil sağlayıcıya
  failover yap, yük at (shed load), durumu ilet.
- **Kalite regresyonu** — bir model veya prompt değişikliğinden sonra yanıtlar kötüleşti. Runbook:
  flag'i rollback yap, ardından neyin değiştiğini bulmak için çevrimdışı (offline) eval setine karşı
  diff al.
- **Maliyet kaçağı (cost runaway)** — harcama bir döngüden, sınırsız bir output'tan ya da bir trafik
  dalgasından fırlar. Runbook: katı tavan ya da kill-switch devreye girer; kaçak çağrıyı
  maliyet-özellik-bazında dökümde bul.
- **Güvenlik / guardrail atlatması** — vahşi ortamda prompt injection, bir PII sızıntısı, güvensiz
  bir yanıt. Runbook: guardrail'i sıkılaştır ya da fail-closed (kapalı başarısız) yap, trace'i
  koru, blast radius'u (etki yarıçapı) değerlendir.

Her olay bir **suçlamasız (blameless) postmortem** ile biter ve — AI'a özgü kıvrım — her üretim
başarısızlığı, çevrimdışı paketin bunu bir sonraki sefere yakalayabilmesi için **yeni bir eval
vakası** haline gelir. Bu, değerlendirmeye (evaluation) geri bağlanan operasyonel döngüdür:
olaylar regresyon setini büyütür.

**Ölçeklenen gözlemlenebilirlik.** Milyonlarca çağrıyla her tam trace'i sonsuza dek tutamazsınız.
Ayrıntılı trace'leri **örnekleyin (sample)** (ve hatalar ile düşük kaliteli output'lar için
trace'leri her zaman saklayın), **toplamları (aggregates)** daha uzun süre tutun ve trace'leri
**ilişkilendirilebilir (correlatable)** kılın — bir müşteri şikâyeti, belirli bir request id'sine,
onun getirilen context'ine ve kullanılan tam prompt ile model sürümüne eşlenmelidir. Çevrimiçi
**kalite monitörleri** (dayanaklılık, reddetme-oranı kayması, thumbs-down) sürekli çalışır, çünkü
sessiz bir kalite regresyonu latency ya da hata oranında hiç görünmez.

**Ölçekte FinOps.** Birçok ekip harcamayı paylaştığında tek bir bütçe alarmı yeterli değildir:

- **Atıf (attribution)** — maliyeti özellik ve tenant (kiracı) bazında etiketle ki *kimin* ve
  *neyin* harcadığını bilesin.
- **Anomali tespiti** — yavaş bir tırmanışı yakalamak için yalnızca sabit bir eşiğe değil, trendden
  sapmaya alarm ver.
- **Yumuşak vs katı tavanlar** — yumuşak tavan uyarır ve kısar (throttle); katı tavan azaltır (daha
  ucuz model, önbellek) ya da durdurur. Tavanı aşmanın **azaltma mı yoksa başarısızlık mı** olması
  gerektiğine her özellik için karar ver.
- **Kapasite modeli** — sağlayıcı kotaları sonludur (dakika başına token, dakika başına istek);
  provisioned/reserved (tahsis edilmiş/ayrılmış) throughput, esnekliği garantili kapasite ve fiyatla
  takas eder.

**Model ve prompt yaşam döngüsü.** Kontrol etmediğiniz bağımlılık değişecektir. Sağlayıcılar model
sürümlerini **deprecate** eder (kullanımdan kaldırır) ve bir son tarihte bir migration'ı (geçiş)
zorunlu kılar; aynı prompt yeni bir sürümde farklı davranabilir. Onu bilinçli olarak işletin:

- **Sürüm sabitleme (version pinning) ve yeniden üretilebilirlik** — model sürümünü sabitle ki
  davranış sessizce kaymasın ve hangi sürümün hangi output'u ürettiğini trace'te kaydet.
- **Sürümlenmiş artefakt olarak prompt'lar** — prompt'lar sürüm kontrolünde ya da bir registry'de
  yaşar, bir konsolda canlı düzenlenmek yerine kod gibi incelenir ve yayına alınır.
- **Güvenli yükseltmeler** — bir modeli migrate ederken, yeni sürümü çevrimdışı eval setine ve
  üretim trafiğinin bir kopyasına karşı **shadow** (gölge) çalıştır, kaliteyi/maliyeti/latency'yi
  karşılaştır, ardından tam dağıtımdan önce küçük bir kohort'a **canary** yap — tüm süre boyunca bir
  flag-değişikliği rollback'i hazır beklerken.

**Yük altında rate limit'ler ve kapasite.** Zirvede sağlayıcı limitlerine çarparsın. 429'ları
**backoff ve bir kuyruk (queue)** ile ele al, sistem çökmeden önce **yük at (shed load)** (düşük
öncelikli çağrıları düşür ya da ertele) ve erişilebilirlik SLO'un herhangi tek bir sağlayıcının
garantilediğinden yüksek olduğunda **çok bölgeli (multi-region) ya da çok sağlayıcılı
(multi-provider)** seçeneği değerlendir.

## Her rol bunu nasıl kullanır

- **Developer/Mühendis:** Örneklenmiş tracing'i, maliyet atıf etiketlerini, backoff/kuyruğu ve
  yük-atmayı, sürüm sabitlemeyi ve model yükseltmeleri için shadow/canary yolunu uygular.
- **İş Analisti:** Maliyet atıf boyutlarını ve anomali eşiklerini ve hangi çevrimiçi kalite
  sinyallerinin iş değerine eşlendiğini tanımlar.
- **PM/Ürün Sahibi:** Her özellik için azalt-vs-başarısız politikasına, çok sağlayıcılı maliyeti
  haklı çıkaran erişilebilirlik SLO'suna karar verir ve bir deprecation'ın zorladığı migration
  takvimini kabul eder.
- **QA ve Mimar:** Olay taksonomisini ve runbook'ları, postmortem-to-eval-case (postmortem'i eval
  vakasına çevirme) döngüsünü ve shadow/canary harness'ını tasarlar ve failover ile yük-atmayı
  gerçek başarısızlık altında doğrular.

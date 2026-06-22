# Maliyet, Latency ve Performans — Daha Derine

L1'de temel ilişkileri öğrendiniz: maliyet ≈ token × token başına fiyat (input ve output
ayrı fiyatlandırılır), başlıca latency etkenleri, optimizasyon kaldıraçları ve
kalite/maliyet/latency üçgeni; hepsi CI'daki bir AI kontrolü çerçevesinde. L2 bunu, AI araç
gereci gerçek ekip ölçeğinde çalıştığında — ayda binlerce commit, build ve inceleme
genelinde — verdiğiniz metrik ve kararlara keskinleştirir.

**Latency bir değil, iki sayıdır.** Streaming sistemleri **time-to-first-token (TTFT)** ile
— ilk inceleme yorumu görünene kadar geçen süre — ve ondan sonraki **token'lar arası
latency** (veya saniyedeki token sayısı) ile ölçülür. Toplam ≈ TTFT + (output token'ları ÷
saniyedeki token). Streaming, geliştiricinin geri bildirimi hızlı görmesi için düşük bir
TTFT ortaya çıkarır; incelemeyi kısaltmak ikinci terimi azaltır. Bir kontrol harika bir
TTFT'ye sahip olabilir ama düşük bir token hızında 2.000 token düzyazı yayarsa yine de yavaş
hissettirebilir.

**Caching tek bir şeyden fazlasıdır.** *Prefix caching*, kararlı bir prompt ön ekinin —
kodlama standartları, az örnekli (few-shot) inceleme örnekleri, paylaşılan repo context'i —
işlenmesini düşük bir input oranında yeniden kullanır; bu ön ek her PR'de tekrarlandığı için
yüksek değerlidir. *Response caching*, aynı diff yeniden incelendiğinde (bir yeniden
çalıştırma, gerçek bir değişiklik olmayan bir rebase) modeli tamamen atlar. Bunlar bir araya
gelir: yapabildiğiniz yerde response-cache, kalanı prefix-cache yapın.

**Routing ve cascade'ler.** Sabit bir küçük-büyük ayrımının ötesinde, bir **cascade** önce
ucuz bir model çalıştırır ve yalnızca bir güven veya doğrulama kontrolü başarısız olduğunda
daha büyük bir modele yükseltir — örneğin küçük bir model tek satırlık bir config
değişikliğini halleder, ama riskli, çok dosyalı bir yeniden düzenleme yükseltilir. Çoğu PR
kolay olduğunda, büyük model fiyatını yalnızca zor azınlıkta ödersiniz, *ortalama* maliyeti
düşürürken kalitenin önemli olduğu yerde korursunuz.

**Throughput'a karşı latency.** Gecelik toplu işler (tüm kod tabanını yeniden tarama, birçok
dosyada test taslağı oluşturma), kuyruğa girmeyi kabul ederek batching ve eşzamanlılık
yoluyla **throughput** için optimize eder. Etkileşimli merge-kapısı kontrolü latency için
optimize eder. Aynı model her ikisine de farklı ayarlarla hizmet verir.

**Toplam maliyet tek bir çağrıdan fazlasıdır.** Bir PR'yi incelemek birkaç LLM çağrısına
yayılabilir — diff'i özetle, ilgili kodu getir, yorum taslakla, artı bir zaman aşımında bir
retry. *PR başına tüm pipeline'ı* bütçeleyin, tek bir çağrıyı değil; retry'lar ve çok adımlı
zincirler yaygın bir sürpriz CI harcaması kaynağıdır.

**Ayarlamadan önce ölçmek.** Input token'larını, output token'larını, TTFT'yi, toplam
latency'yi ve PR başına çağrıları, kontrol ve modele göre ayrıştırarak izleyin. Çoğu "AI
araç gereci faturası patladı" sorunu, yalnızca ölçtüğünüzde görünür olan bir kontrolden
çıkmış veya sınırsız bir incelemeye dayanır.

## Her rol bunu nasıl kullanır

- **Developer:** TTFT'yi, token hızını ve PR başına çağrı sayılarını loglar; prefix caching, response caching ve cascade'leri uygular ve kontrolü en yoğunda kuyruğa girme için yük testine tabi tutar.
- **Infrastructure Engineer:** Etkileşimli merge kapısı ile gecelik toplu işler için ayrı SLO'lar belirler, cascade/retry davranışını en yoğun yük altında test eder ve gözlemlenebilirliğin bir fan-out'taki her çağrıyı kapsamasını sağlar.
- **Project Manager:** PR başına tüm pipeline üzerinde (retry'lar ve çok adımlı çağrılar dahil) bir maliyet modeli kurar, geliştiricilerin gerçekten hissettiği latency hedeflerini belirler ve hangi kontrollerin bir cascade ya da daha büyük modeli hak ettiğine karar verir.
- **Enterprise Architect:** Fan-out genelinde cascade/cache mimarisini tasarlar.

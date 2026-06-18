# Çalışılmış Örnek: Hacim Büyürken Bir Belge-Çıkarma Özelliğini Yeniden Temin Etmek

**Aşama: ilk temin etme kararını aşan bir özellik.** Bir fintech ürünü, yüklenen faturalardan
alanları (tutarlar, tarihler, satıcı adları) çıkarıyor. Bir yıl önce, düşük hacimde, ekip ince
bir soyutlamanın arkasında **barındırılan bir LLM API'si çağırdı**. Bu doğru L1 kararıydı:
yayınlaması hızlı, ön maliyeti düşük ve AI belirsiz, çeşitli belge düzenlerine gerçekten uydu.

**Ne değişti.** Hacim ayda 2.000'den 900.000 faturaya yükseldi. Şimdi üç baskı çarpışıyor:

- **Gerçek hacimde maliyet.** Önemsiz olan çağrı başına fiyat şimdi en büyük kalem — etiket
  fiyatı değil, açık bir TCO problemi.
- **Doğruluk ihtiyacı yükseldi.** Finans artık düşük riskli faturaları otomatik kaydediyor,
  dolayısıyla tolere edilebilir hata oranı düştü. Bir zamanlar bir insan denetleyiciyle
  soğurdukları non-determinizm şimdi daha sıkı kontrol gerektiriyor.
- **Lock-in yüzeye çıktı.** Prompt'ları ve çıktı şeması bir sağlayıcının kaprislerine ayarlı.

**L2 merceğiyle yeniden karar.** Özelliği ayrıştırıyorlar: çoğu fatura, deterministik bir
ayrıştırıcının kesin, ucuz ve test edilebilir olduğu birkaç **bilinen şablonu** izliyor — bu
yüzden onları **koda** yönlendiriyor, AI yüzeyini yalnızca gerçekten yeni düzenlere
daraltıyorlar. Bu kalan için seçenekleri **TCO** üzerinden karşılaştırıyorlar: genel bir API
(yükselen maliyet), şimdi biriktirdikleri bir yıllık etiketli çıkarımlar üzerinde daha küçük
bir modeli **fine-tune** etmek (daha düşük çağrı başına maliyet, daha iyi doğruluk, ama eğitim
ve barındırma yükü) ve bir uzman **buy**.

**Karar.** Belirsiz kalan için daha küçük bir modeli **fine-tune** ediyorlar ve API'nin bir
yedek olarak kalması için **soyutlama katmanını** koruyorlar. İlk günden bir soyutlama ve
taşınabilir eval'lara sahip oldukları için switching cost düşük ve hamle geri alınabilir.

**Ders.** Temin etme bir kez karar verilmez. AI yüzeyini daraltmak, gerçek hacimde fiyatlamak
ve bir soyutlama ile çıkış planı tutmak, ekibin API'den fine-tune'a bir yeniden yazma olmadan
yeniden temin etmesini sağlıyor — tam da L2'nin konusu olan geri alınabilirlik.

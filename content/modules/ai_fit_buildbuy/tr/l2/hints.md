# İpuçları — AI Uygunluğu & Build vs Buy (L2)

## Temel fikrin alternatif ifadeleri

- Uygunluk bir spektrumdur: özelliği ayrıştırın, her kesin adımı deterministik koda itin ve
  sistemi ucuz, test edilebilir ve değiştirilebilir tutmak için modeli indirgenemez belirsiz
  çekirdeğe ayırın.
- Temin etmeye gerçek hacimde total cost of ownership üzerinden karar verin — entegrasyon,
  eval'lar, izleme, personel — ve vendor lock-in ile switching cost'ları, bir soyutlama
  katmanı ve yürütülebilir bir çıkış planıyla azaltılan birinci sınıf konular olarak görün.
- Temin etme geri alınabilir, bir kerelik bir karar değil: hacim, doğruluk ihtiyaçları ve veri
  değiştikçe yeniden karar verin; bu yüzden AI yüzeyini minimize etmek ve taşınabilirliği
  korumak ilk günden önemlidir.

## İpucu yığını

- **H1 (dürtme):** Özelliği tek büyük bir "AI" bloğu olarak görmeyin. Hangi adımlar
  deterministik koda ait kesin aramalar veya formüllerdir ve hangi tek adım indirgenemez
  şekilde belirsizdir?
- **H2 (yapısal):** Seçenekleri *gerçek hacimde* TCO üzerinden karşılaştırın — çağrı başına
  fiyat değil — ve her seçeneğin sizi neye bağladığını sorun. Bir soyutlama katmanı artı
  taşınabilir prompt'lar/eval'lar, kararı geri alınabilir tutan şeydir.
- **H3 (yanıta yakın):** Etiketli veri biriktirdikten ve hacim, API maliyetini en büyük kalem
  yaptıktan sonra, **belirsiz kalanı mevcut soyutlamanın arkasında fine-tune etmek** switching
  cost'u düşük tutarken maliyeti düşürür ve doğruluğu yükseltir.

## SSS

**S: Zaten API-çağırma'yı seçtik. Temin etme çözülmüş müdür?**
Hayır. Temin etme geri alınabilirdir ve hacim, doğruluk ihtiyaçları ve mevcut veri değiştikçe
yeniden ele alınmalıdır. L2 noktası, AI yüzeyini küçük ve entegrasyonu taşınabilir tutarak
yeniden temin etmenin (örn. API'den fine-tune'a) bir yeniden yazma yerine ucuz olmasını sağlamaktır.

**S: Ucuz bir API'yi pahalı bir buy'a karşı adil nasıl karşılaştırırım?**
Etiket fiyatı üzerinden değil, total cost of ownership üzerinden. Her tarafa entegrasyon,
değerlendirme, izleme, yeniden eğitim ve personeli ekleyin — ve API'yi *gerçek* hacminizde
fiyatlayın; orada minik bir çağrı başına maliyet baskın gelebilir.

**S: Fine-tune, genel bir API çağırmayı ne zaman geçer?**
Genel bir model yakın ama yeterince doğru değilken, etiketli veri biriktirdiyseniz ve hacminiz,
fine-tune edilmiş bir modelin daha düşük çağrı başına maliyetinin eğitim ve barındırma yükünü
geçmesini sağladığında.

**S: Lock-in'in beni tuzağa düşürmesini nasıl önlerim?**
Sağlayıcıyı bir soyutlama katmanının arkasına koyun, prompt'ları ve değerlendirmeleri
taşınabilir tutun ve gerçekten yürütebileceğiniz bir çıkış planı yazın. O zaman her seçenek —
buy, fine-tune, build, değiştirme — düşük switching cost ile açık kalır.

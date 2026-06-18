# İpuçları — AI Uygunluğu & Build vs Buy

## Temel fikrin alternatif ifadeleri

- Sırayla iki soru: önce *AI bu probleme uyuyor mu* (belirsiz/yargı işi) yoksa *kesin ve
  bilinir mi* (deterministik kod); ancak ondan sonra, *bunu nasıl temin ederim* — build, buy,
  fine-tune mı yoksa bir API mi çağırırım.
- AI non-deterministik'tir ve çağrı başına maliyetlidir, bu yüzden onu "muhtemelen doğru"
  hiçten iyi olduğunda ve değişkenliği tolere edebildiğinizde benimsersiniz — bir arama veya
  formülün kesin yanıtı ücretsiz verdiği yerde değil.
- Temin etme, API-çağırma'dan (hızlı, ön maliyet ucuz) şirket-içi-build'e (yalnızca AI sizin
  farklılaştırıcınızsa) uzanan bir spektrumdur ve gerçek karşılaştırma TCO ve vendor lock-in'dir,
  etiket fiyatı değil.

## İpucu yığını

- **H1 (dürtme):** Kuralın *kesin ve bilinir* olup olmadığını sorun. Onu bir formül veya arama
  tablosu olarak yazabiliyorsanız, deterministik kod non-deterministik bir modeli geçer — daha
  ucuz, test edilebilir, her seferinde aynı yanıt.
- **H2 (yapısal):** İki kararı ayırın. Önce uygunluk (iş belirsiz ve dil/yargı biçimli mi?),
  sonra temin etme (build vs buy vs fine-tune vs API) ve temin etmeyi yalnızca çağrı başına
  fiyata göre değil, total cost of ownership ve switching cost'lara göre yargılayın.
- **H3 (yanıta yakın):** AI sizin farklılaştırıcınız *değilken* ve etiketli veriniz yokken,
  **bir soyutlama katmanının arkasında barındırılan bir API çağırarak** başlayın — hızlı
  yayınlanır, lock-in'i düşük tutar ve fine-tune/buy/build'i sonrası için açık bırakır.

## SSS

**S: AI güçlü — neden her şey için kullanmayalım?**
Çünkü non-deterministik'tir, çağrı başına maliyetlidir ve test etmek zordur. Kesin, bilinir
kurallar için (vergi, doğrulama, yönlendirme) deterministik kod daha ucuz, daha hızlıdır ve
her seferinde aynı yanıtı verir. AI'yı yalnızca belirsiz, yargı veya dil biçimli iş için kullanın.

**S: Fine-tune ile API-çağırma arasındaki fark nedir?**
Bir API çağırmak, genel barındırılan bir modeli bir prompt'la olduğu gibi kullanır — en düşük
ön çaba. Fine-tune etmek, alanınızın dilini veya kategorilerini öğrenmesi için bir modeli
etiketli verinizle daha fazla eğitir. Genel bir model *yakın* ama tam değilken ve veriye
sahipken fine-tune edin.

**S: Vendor lock-in nedir ve onu nasıl sınırlarım?**
Lock-in, tescilli biçimlerin, prompt'ların veya API'lerin sağlayıcı değiştirmeyi pahalı
yapmasıdır (yüksek switching cost). Onu, AI'yı dahili bir **soyutlama katmanının** arkasına
koyarak sınırlayın; böylece ürününüzü yeniden yazmadan alttaki sağlayıcıyı değiştirebilirsiniz.

**S: TCO nedir ve neden çağrı başına fiyatı geçer?**
Total cost of ownership; entegrasyon, değerlendirme, izleme ve bakımı içerir — yalnızca API
çağrısı başına fiyatı değil. "Ucuz" bir seçenek, onu güvenilir şekilde işletmek için
mühendisliği ekledikten sonra yüksek TCO'ya sahip olabilir.

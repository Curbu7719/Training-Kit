# İpuçları ve Alternatif İfadeler

**Temel fikrin alternatif ifadeleri**

- "Tek bir 'AI' yok — tipe (temel/talimata göre eğitilmiş/akıl yürüten), boyuta, fiyata ve hıza göre
  farklılaşan bir model filosu var ve mühendislik işi doğru olanı her göreve eşlemektir."
- "Model seçiminin ötesinde, çıktı denetimlerini bilinçli ayarla — maksimum çıktı uzunluğunu sınırla
  ve durdurma dizileri kullan ki yanıt doğru uzunlukta olsun ve temiz bitsin."
- "Görevi güvenilir yapan en küçük modeli seç ve yalnızca zor ya da belirsiz durumları daha güçlü bir
  modele yönlendir — bu yönlendirme, bir araç zinciri genelinde maliyet ve gecikme üzerindeki en büyük
  kaldıraçtır."

**İpucu yığını**

- **H1 (dürtme):** Her çağrı noktasının gerçekten aynı beyne ihtiyacı var mı diye sor. Kod tamamlama,
  PR incelemesi ve zor bir tasarım sorusunun maliyet, gecikme ve zorluk profilleri çok farklıdır.
- **H2 (yapı):** Görev başına iki karar — *hangi model* (akıl yürüten/hızlı, küçük/büyük) ve *hangi
  çıktı denetimleri* (maksimum uzunluk, durdurma dizileri). Sonra tek bir enine karar: büyük modeli
  her yerde çalıştırmak yerine zor durumları yukarı yönlendir.
- **H3 (işlenmiş yol):** Tamamlama → küçük hızlı model, sınırlı çıktı, blok sonunda durdurma. PR
  incelemesi → orta model, büyük diff'leri yükselt. Tasarım yardımcısı → akıl yürüten model. Akıl
  yürüten modeli tamamlamaya, minik modeli zor tasarım problemine koşma.

**Kısa SSS**

- **En büyük model her zaman en güvenlisi değil mi?** Hayır. Daha az halüsinasyon görür ama yine
  gerçek uydurur, daha yavaş ve çok daha pahalıdır — rutin, yüksek hacimli görevlerde israftır.
  Yeteneği ihtiyaca eşle.
- **Tekrarlanabilir çıktı gerekiyorsa?** Çıktı çalıştırmadan çalıştırmaya değişebilir, bu yüzden tam
  dizeye göre doğrulama yapma. Katı bir biçim (örn. JSON) iste ve doğrula; sabit bir dize yerine
  özellikleri test et.
- **Akıl yürüten model ne zaman değer?** Gerçekten zor, çok adımlı problemlerde — çetrefilli bir hata,
  bir tasarım dengesi. Kod tamamlama veya basit çıkarım için yalnızca maliyet ve gecikme ekler.
- **Neden her yere tek güçlü model yerine yönlendirme?** Çünkü çağrıların çoğu rutindir; ucuz bir
  model onları halleder ve yalnızca zor durumları yükseltmek, kaliteyi önemli yerde kaybetmeden
  maliyet ve gecikmeyi düşürür.

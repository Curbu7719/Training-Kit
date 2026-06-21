# İpuçları ve Alternatif İfadeler

**Temel fikrin alternatif ifadeleri**

- "Tek bir 'AI' yok — tipe (base vs instruction-tuned vs reasoning), boyuta, fiyata ve hıza göre
  farklılaşan bir model filosu var ve mühendislik işi doğru olanı her göreve eşlemektir."
- "Aynı model, decoding kontrollerine göre farklı davranır: tekrarlanabilir kod ve çıkarım için
  düşük temperature, beyin fırtınası için daha yüksek; max-token ve stop sequence'leri kasıtlı ayarla."
- "Görevi güvenilir yapan en küçük modeli seç ve yalnızca zor veya düşük-güvenli vakaları daha güçlü
  bir modele route et — bu route, bir toolchain genelinde maliyet ve gecikme üzerindeki en büyük kaldıraçtır."

**İpucu yığını**

- **H1 (dürtme):** Her çağrı noktasının gerçekten aynı beyne ihtiyacı var mı diye sor. Autocomplete,
  PR incelemesi ve zor bir tasarım sorusunun maliyet, gecikme ve zorluk profilleri çok farklıdır.
- **H2 (yapı):** Görev başına iki karar — *hangi model* (reasoning vs hızlı, küçük vs büyük) ve
  *hangi ayarlar* (temperature, max-token, stop). Sonra tek bir enine karar: büyük modeli her yerde
  çalıştırmak yerine zor vakaları yukarı route et.
- **H3 (işlenmiş yol):** Tamamlama → küçük hızlı model, düşük temp, blok sonunda stop. PR incelemesi
  → orta model, büyük diff'leri yükselt. Tasarım yardımcısı → reasoning model. Reasoning modeli
  tamamlamaya, minik modeli zor tasarım problemine koşma.

**Kısa SSS**

- **En büyük model her zaman en güvenlisi değil mi?** Hayır. Daha az halüsinasyon görür ama yine
  gerçek uydurur, daha yavaş ve çok daha pahalıdır — rutin, yüksek-hacimli görevlerde israftır.
  Yeteneği ihtiyaca eşle.
- **Temperature gerçekte neyi değiştirir?** Sampling'in ne kadar odaklı vs çeşitli olduğunu. Düşük,
  tekrarlanabilir odaklı çıktı verir (kod için istediğin); yüksek, yaratıcı çeşitlilik verir (beyin fırtınası).
- **Temperature 0 onu deterministik yapar mı?** Yaklaştırır ama çalıştırmadan çalıştırmaya birebir
  aynı garanti değildir; bu yüzden testleri tam string yerine varyasyona dayanacak şekilde tasarla.
- **Reasoning model ne zaman değer?** Gerçekten zor, çok-adımlı problemlerde — çetrefilli bir bug,
  bir tasarım dengesi. Autocomplete veya basit çıkarım için yalnızca maliyet ve gecikme ekler.

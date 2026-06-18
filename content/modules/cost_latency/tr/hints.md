# İpuçları ve Alternatif İfadeler

**Temel fikrin alternatif ifadeleri**

- "Maliyet kabaca token çarpı fiyattır — ve input ile output token'ları ayrı
  fiyatlandırılır, output (inceleme yorumları) genellikle input'tan (diff) daha pahalıdır."
- "Latency bekleme süresidir; model boyutu, ne kadar metin ürettiği, ağ atlamaları ve CI
  pipeline'ındaki ek adımlar — dosya getirme, linter'lar, çok adımlı zincirler — tarafından
  belirlenir."
- "Kalite, maliyet ve latency bir üçgen oluşturur: AI kontrolünün daha fazla hata
  yakalamasını sağlamak genellikle onu daha yavaş veya daha pahalı yapar, bu yüzden
  bunları her kontrol için dengelersiniz."

**İpucu yığını**

- **H1 (dürtme):** *Neyin ücretini ödediğinizi* ve *PR kontrolünü neyin beklettiğini*
  düşünün. Bunlar aynı şey değildir ve bir kaldıraç ikisine de yardımcı olabilir ya da
  birini diğerine takas edebilir.
- **H2 (yapı):** İki sayıyı ayırın. Maliyet için input token'larını (diff + context)
  output token'larından (yorumlar) ayırın. Latency için bir incelemenin geçtiği her adımı
  — context getirme, model çağrısı, herhangi bir araç çağrısı — ve hangisinin en çok token
  ürettiğini listeleyin.
- **H3 (çözümlü yol):** Output token'ları token başına daha pahalıdır ve daha uzun sürer,
  bu yüzden inceleme uzunluğunu sınırlamak hem maliyete *hem de* latency'e yardımcı olur.
  Context'i kırpmak (tüm dosyalar değil, değişen parçalar) esas olarak maliyete yardımcı
  olur. Streaming yalnızca algılanan latency'e yardımcı olur. Küçük bir diff'i daha küçük
  bir modele yönlendirmek ikisine de yardımcı olur.

**Kısa SSS**

- **Streaming incelemeyi daha mı ucuz yoksa gerçekten daha mı hızlı yapar?** Hiçbiri —
  toplam token ve toplam süre aynıdır. Yalnızca yorumlar yazıldıkça göstererek *algılanan*
  hızı iyileştirir, böylece geliştirici boş bir kontrole bakıp kalmaz.
- **Output neden genellikle input'tan daha pahalıdır?** Her token'ı üretmek tam bir ileri
  geçiş (forward pass) gerektirir; input ise paralel olarak daha verimli işlenir ve
  sağlayıcılar bu farkı fiyatlandırır.
- **Her PR en büyük modele mi gitmeli?** Hayır. En büyük model daha fazlasını yakalar ama
  daha pahalıdır ve daha yavaştır. Rutin diff'leri güvenilir biçimde inceleyen en küçük
  modeli kullanın ve yalnızca büyük veya sürüm PR'lerini daha büyük bir modele yönlendirin.
- **Bir CI asistanı için tek en yüksek etkili kaldıraç nedir?** Genellikle context'i
  değişen parçalara kırpmak ve output uzunluğunu sınırlamak — birlikte, baskın maliyeti ve
  geliştiricilerin merge kapısında hissettiği beklemeyi kısarlar.

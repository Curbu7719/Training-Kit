# İpuçları & Alternatif İfadeler

## Temel fikrin alternatif ifadeleri

- **Tek cümleyle:** Bir LLM bir sonraki token'ı tahmin eden bir makinedir — tekrar tekrar metnin en akla yatkın sonraki parçasını tahmin eder ve bu tek mekanizma, kodu otomatik tamamlamaktan bir tasarımı incelemeye kadar her şeyi çalıştırır.
- **Başka bir açıdan:** Eğitim, örüntüleri bir kez donmuş ağırlıklara işler; çıkarım, IDE'niz, CI işiniz ya da sohbet aracınız modeli her çağırdığında bu donmuş ağırlıkları kullanır. Yalnızca çıkarımla etkileşim kurarsınız.
- **Denge çerçevesi:** Bir SDLC görevi için model seçmek üç ayarı dengelemektir — yetenek, maliyet ve gecikme. Beceri, işi yine de yapan *en küçük* modeli kullanmak (commit mesajları, PR başlıkları) ve en büyüğü zorlu işler için (tasarım incelemesi, karmaşık refactor'lar) saklamaktır.

## Kademeli ipucu yığını

- **H1:** Modeli "cevapları bilen" biri gibi düşünmeyin. Metni sürdüren bir şey olarak düşünün. Sorun: bu prompt'tan — bu diff'ten, bu gereksinimden, bu test taslağından — sonra gelmesi en olası şey nedir?
- **H2:** Özelliği gerçek dünyadaki sonucuyla eşleştirin. Bir özellik *modelin emin olamayacağı şey* hakkındaysa (yeni bir framework sürümü, olgusal gerçeklik), çıkarım *risk ve doğrulama* hakkındadır. Bir özellik *çıktının nasıl değiştiği* hakkındaysa, çıkarım *tekrarlanabilirlik ve temperature* hakkındadır.
- **H3:** Model seçimi sorularında, her SDLC gereksinimini bir ayara eşleyin: "yüksek hacimde ucuz" (commit mesajları) → daha küçük model; "her çalıştırmada aynı" (yapılandırılmış çıktı) → düşük temperature; "zorlu çok adımlı akıl yürütme" (mimari inceleme, çetrefilli refactor) → daha büyük model. Gereksinimi karşılayan en hafif seçeneği seçin.

## SSS

**S: Daha yüksek bir temperature modeli kod incelemesinde daha mı iyi yapar?**
C: Hayır. Temperature yalnızca örneklemenin ne kadar çeşitli ya da odaklı olduğunu kontrol eder. Düşük temperature daha tekrarlanabilir; yüksek daha çeşitlidir. Hiçbiri bilgi ya da akıl yürütme yeteneği eklemez — zorlu inceleme için daha sıcak değil, daha yetenekli bir model seçin.

**S: Eğitim zaten gerçekleştiyse, model neden güncel olmayan bir API öneriyor?**
C: Bilgi kesim tarihi yüzünden. Donmuş ağırlıklar yalnızca eğitim tarihine kadarki veriyi yansıtır. Daha yeni bir framework sürümü kullanmak için, o bilgiyi (dokümanlar, sürüm) prompt'ta sağlayın — model bunu kendi başına bilmez.

**S: Aynı prompt CI işime neden iki farklı commit mesajı verebilir?**
C: LLM'ler varsayılan olarak belirsizdir; örnekleme varyasyon getirir. Temperature'ı düşürmek bunu azaltır, ama gerçekten kararlı bir davranış için, tam dize eşleşmesine bağlı olmayan adımlar ve testler de tasarlayın.

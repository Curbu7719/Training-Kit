# İşlenmiş Örnek: CI'a AI İncelemeci Ekle ama Vergiye Dönüşmesin

Her PR'a satır içi yorum bırakan bir AI kod incelemecisi istiyorsun — elle yakalamaktan bıktığın ufak hataları yakalardı. Ama düşünmeden bağlarsan günde onlarca kez çalışır, CI faturası her sprint tırmanır ve herkes merge'den önce 30 saniye bekler. İşte maliyet ve gecikme düşüncesi, yardımı vergiye dönüşmekten nasıl korur.

**Kaldırdığı angarya: her diff'i didiklemek.** Aynı stil ve uç-durum kaçaklarını işaretlemekten bıktın. *Neden AI?* Hep-açık bir incelemeci bu çileyi her PR'da yapar, böylece sen virgülü değil tasarımı incelersin — ama yalnızca kimsenin korkmayacağı kadar ucuz ve hızlıysa.

**Maliyet: token başına, iki kez ödersin.** Tüm diff'i *artı* binlerce satır çevre dosyayı gönder, hepsini ödersin — ve **çıktı, girdiden daha pahalı fiyatlanır**. *Kaldıraç:* yalnızca diff'i ve dokunduğu birkaç dosyayı gönder ve bir deneme değil, "yalnızca en önemli sorunlar" iste. Kırpılan çıktı, faturayı girdiyi kırpmaktan daha çok düşürür.

**Gecikme: insanlar merge için bekler.** 30 saniye akıl yürüten büyük bir model merge'i bloke eder. *Kaldıraç:* rutin PR'ları daha hızlı, küçük bir modele yönlendir ve büyüğü korkutucu refactor'lara sakla. *Bu gününü neden kolaylaştırır?* Kontrol saniyede biter, böylece incelemeci seninle merge arasında durmak yerine seni hızlandırır.

**Hile yapamayacağın üçgen.** Kalite, maliyet ve gecikme birbiriyle takas edilir — üçünü birden maksimuma çıkaramazsın. *Adını koymak neden işe yarar?* Bilerek karar verirsin: "her PR'da yeterince iyi ve hızlı, yalnızca yükseltildiğinde derin ve yavaş" — bir yazım düzeltmesine maksimum kalite ödemek yerine.

**Özet:** her commit'te çalışan bir AI adımı, maliyet ve gecikmeyle yaşar ya da ölür. Girdiyi kırp, çıktıyı sınırla, modeli PR'a eşle — incelemeci, gelecek sprint söküp atacağın bir vergi değil, koruyacağın bir yardım olsun.

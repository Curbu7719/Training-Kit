# İşlenmiş Örnek: AI Yüzeyini Küçült ve Kararı Geri Alınabilir Tut

Bir özelliğe AI'ın uyduğuna karar verdin — ama "AI kullan" tek bir karar değil, birkaçıdır ve yanlışını geri sarmak pahalıdır. Derinlikte hamle, AI yüzeyini olabildiğince küçültmek ve tedarik kararını geri alınabilir tutmaktır. İşte bu, her şeyi hem daha ucuz inşa edilir hem de yaşaması daha kolay kılar.

**Karar vermeden önce parçala.** Çoğu "AI özelliği" çoğunlukla deterministiktir, *tek bir* gerçekten belirsiz adımla. Bir belge çıkarıcı şunlardır: dosyayı doğrula (kod), müşteriyi bul (kod) ve *dağınık serbest-metin alanını anla* (AI). *Bu gününü neden kolaylaştırır?* Yapabildiğin her şeyi düz koda it — test edilebilir, her seferinde aynı cevap — ve modeli yalnızca indirgenemez belirsiz çekirdeğe yönelt. AI yüzeyi ne kadar darsa, tüm sistem o kadar ucuz ve test edilebilir.

**Üç eksene birlikte karar ver, içgüdüyle değil.** Gereken doğruluk, katlanabileceğin belirsizlik ve gerçek hacimde maliyet — *birlikte* tartılır. *Neden?* Bir iş, doğrulukta harika bir AI uyumu, hacmindeki çağrı-başı maliyette berbat olabilir; tek eksene bakmak diğerini gizler.

**Geri alınabilir tut.** Tek bir tedarikçiye kaynak yapmak yerine, kendi arayüzünün arkasından bir API çağırırsın. *AI'ı neden böyle kullan?* Hacim büyüyüp bir API çağrısı pahalılaştığında ya da bir fine-tune kâra geçmeye başladığında, özelliği yeniden yazmadan kaynağı değiştirirsin — karar, verin, hacmin ve doğruluk ihtiyacın büyüdükçe değiştirilebilir kalır.

**Bir takvimde yeniden karar ver.** Pilot hacminde "doğru" tedarik kararı çoğu zaman ölçekte yanlıştır. *Bu seni neden kurtarır?* Geçen çeyreğe uyan bir seçime hapsolmak yerine onu bilerek yeniden gözden geçirirsin.

**Özet:** derinlikte uygunluk evet/hayır değildir ve tedarik sonsuza dek değildir. AI'ı belirsiz çekirdeğe küçült, doğruluk + değişkenlik + maliyete birlikte karar ver ve kaynağı takas edilebilir tut — böylece AI özelliği hem daha ucuz inşa edilir *hem de* fikrini değiştirmen ucuz olur.

# İşlenmiş Örnek: Her Disiplini AI Kodunun Gerçekten Kırıldığı Yere Koy

Vibe-coding döngüsünü oturttun — ama derinlikte disiplinler bir ritüel değil, her biri AI üretimi kodun *belirli* bir başarısızlık biçimine karşı bir savunmadır. Başarısızlık biçimlerini bilmek, hareketleri taklit etmek yerine her korumayı bilerek yerleştirmeni sağlayan şeydir. İşte bu, sessiz hasar olmadan hızı korur.

**Sessiz yanlış kod.** Çalışır, bir değer döndürür ve düpedüz yanlıştır — bir-eksik (off-by-one), tersine çevrilmiş koşul. Hiçbir şey çökmez, o yüzden "çalışıyor" sana hiçbir şey söylemez. *Koruma:* yalnızca hata yokluğunu değil, *davranışı* doğrulayan testler. *Bu gününü neden kolaylaştırır?* Hata gelecek hafta production'da değil, şimdi takımda yüzeye çıkar — bir bakışın yakalayamadığını yakalarsın.

**Makul ama bozuk.** Çıktı kendinden emin, deyimsel kod gibi okunur ve göz gezdirmeyi geçer, ama bir null'ı, bir uç durumu ya da eşzamanlılığı yanlış ele alır. Akıcılığı *tam da* tuzaktır. *Koruma:* diff'i, spec'inin uç durumlarını aklında tutarak gerçekten oku. *AI'ı neden böyle kullan?* Çünkü AI doğru *görünmekte* ne kadar iyileşirse, gerçek değerin onun doğru *olup olmadığını* kontrol etmek olur.

**Kapsam kayması ve sessiz sürüklenme.** Bir değişiklik istersin, AI yardımseverce üç şeyi yeniden yazar. *Koruma:* küçük diff'ler, her seferinde tek değişiklik; böylece tam olarak neyin değiştiğini görürsün. *Bu neden önemli?* Büyük, "yardımsever" bir blob, bir şeyi bozan o tek satırı gizler — küçük adımlar hasarı görünür tutar.

**Döngüye girince direksiyonu al.** AI yakınsamayan varyasyonlar üretmeyi sürdürdüğünde, prompt'lamayı bırakır ve çetrefilli kısmı kendin yazarsın. *Neden?* Takılmış bir modeli yeniden prompt'lamak zaman ve token yakar; döngüyü erken fark etmek, hızlının bir sarmala dönmesini engelleyen şeydir.

**Özet:** derinlikte her disiplin bir başarısızlık biçimine karşılık gelir — sessiz-yanlış için testler, makul-ama-bozuk için okumak, sürüklenme için küçük adımlar, döngüler için direksiyonu almak. Onları bilerek yerleştir, AI seni hem hızlı tutsun *hem de* kodu arkasında durabileceğin bir şey olarak korusun.

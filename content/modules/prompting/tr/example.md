# İşlenmiş Örnek: Daha İyi Bir Brief Yazıp İlk Seferde Doğruyu Al

AI'a "bu fonksiyon için birkaç test yaz" dersin ve yeniden yazman gereken üç sıradan mutlu-yol testi alırsın. Sorun modelde değildi — brief'teydi. İşte prompt'a ayıracağın birkaç dakika seni o yeniden yazmaktan nasıl kurtarır.

**Angarya: belirsiz istek, işe yaramaz çıktı.** "Birkaç test yaz" modele hedef göstermez, o da tahmin eder. Şöyle değiştirirsin: "Boş liste, tek eleman ve taşma durumlarını kapsa; pytest kullan; test başına tek assertion." *Neden AI?* Aynı model, ama artık elinle yazacağın tam o durumları yazar — sıkıcı testleri *de* unutacağın testleri *de* aldın.

**Kaldıraç: kuralları bir kez, en üstte koy.** Kalıcı şeyleri **sistem mesajına** koyarsın — "Testleri bizim framework'ümüzle yazarsın ve asla olmayan API uydurmazsın" — ve **kullanıcı mesajını** o anki istek için saklarsın. *Neden?* Sistem kuralı her istekte geçerli kalır, böylece kodlama standartlarını her prompt'a yeniden yazmayı bırakırsın.

**Kısayol: anlatma, göster.** Test adlandırma tarzını bir paragrafla açıklamak yerine bir örnek test yapıştırırsın. *Neden AI?* İyi bir örnek ("few-shot") ev tarzını üç cümlenin asla beceremeyeceği kadar iyi öğretir — model kendi desenini uydurmak yerine seninkini kopyalar.

**Artefaktı sarmala.** Fonksiyonu üçlü tırnak içine alırsın ki model neyin *talimat* neyin *işlenecek şey* olduğunu bilsin — artık prompt metnini "düzeltmez".

**Kontrol sende kalsın.** İlk prompt bir taslaktır, tıpkı testler geçmeden önceki kod gibi. Birkaç girdide çalıştır, nerede yanıldığını gör, ifadeyi sıkılaştır — sihirli bir söz bekleme.

**Özet:** cevabın kalitesi brief'in kalitesini izler. Üç dakika belirgin olmaya harca, AI'ın tahminini yeniden yazmaya harcayacağın yirmi dakikadan kurtul.

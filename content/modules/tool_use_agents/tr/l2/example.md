# İşlenmiş Örnek: Kendi Kendine Koşan Agent'ı Güvenilir Tut

Hata düzelten agent'ın demoda çalışır, sonra production'da yirmi iterasyon boyunca aynı başarısız aracı çağırır. Otonomi fikri yanlış olduğu için değil, kenarlarda başarısız olur. İşte birkaç tasarım kararı onu doğru, ucuz ve hata ayıklanabilir tutar; böylece onu gerçekten çalışır halde bırakabilirsin.

**Asıl kaldıraç araç tasarımıdır.** Ham bir `500` döndüren araç modele hiçbir şey öğretmez; `{"error":"order_not_found","retryable":false}` döndüren ise akıllıca karar vermesini sağlar. *Bu gününü neden kolaylaştırır?* Agent belirsiz sonuçlarda çırpınmayı bırakır — dar, iyi adlandırılmış ve net hatalı araçlar, tahmin etmek yerine doğru bir sonraki adımı seçmesini sağlar.

**Sayaçtan öte döngü kontrolü.** Maksimum-iterasyon sınırı en kötü durumu durdurur, ama **ilerlememe** de saptarsın — aynı araç, aynı argümanlar, iki kez — ve geçici hataları (geri çekilmeyle yeniden dene) kalıcı olanlardan (dur ve raporla) ayırırsın. *Neden uğraşmalı?* Yoksa döngü "dönmekte" başarılı olur ve her boşa giden çağrıyı ödersin.

**Her adımı araç sonucuna dayandır.** Her adım bir öncekinin üzerine kurulduğundan, bir hatalı okuma yayılır. Modele kendi hafızasına değil, gerçek araç çıktısına göre doğrulama yaptırırsın. *Agent'ı neden böyle kullan?* Bu, erken bir hatayı bozuk bir PR'a büyüten agent ile kendini düzelten agent arasındaki farktır.

**Koşu başına daha az harca.** Bağımsız araç çağrılarını paralel çalıştırırsın, rutin alt-adımlar için küçük bir model kullanırsın ve büyük modeli planlamaya saklarsın. *Neden?* Her iterasyon bir model + araç çağrısı daha demektir — bu seçimler yeteneği kesmeden faturayı keser.

**Hata ayıklanabilir yap.** Her iterasyonun planını, talep edilen aracı, argümanlarını ve gözlemi loglarsın. *Bu seni neden kurtarır?* Bir koşu ters gittiğinde, körlemesine yeniden çalıştırmak yerine onu adım adım izleyebilirsin.

**Özet:** güvenilir otonomi bir prompt değil, bir mühendislik işidir. Yorumlanabilir araçlar, gerçek döngü kontrolü, dayandırma (grounding) ve iterasyon-başına loglar, agent'a her adımı izlemeyi bırakacak kadar güvenmeni sağlayan şeydir.

# Vibe Coding'i Doğru Yapmak

**Vibe coding**, yazılımı *bir AI asistanına kodu yazdırarak* inşa etmek ve sonra onu çalışan bir
sonuca doğru yönlendirmek demektir. İyi yapıldığında hızlı ve güçlü bir üretim yöntemidir.
Dikkatsizce yapıldığında — AI ne üretirse "doğru görünüyor" diye kabul etmek — kimsenin
anlamadığı bir kod, gizli hatalar ve kontrolden çıkan bir kod tabanı üretir. Fark araçta değildir;
araca yön verirken getirdiğiniz **disiplindedir**.

**Niyetten başlayın, yalnızca vibe'dan değil.** Prompt yazmadan önce ne istediğinizi bilin:
davranış, girdiler ve çıktılar, kenar durumları. Açık, küçük bir spec ("bir kullanıcının son 10
siparişini sayfalanmış olarak döndüren bir endpoint ekle") hem AI'a bir hedef verir hem de *size*
sonucu kontrol etmenin bir yolunu verir. "Daha iyi yap" hiçbirini vermez.

**Küçük, review edilebilir adımlarla çalışın.** Her seferinde tek bir değişiklik isteyin,
çalıştırın, sonra bir sonrakini isteyin. Küçük diff'leri okumak kolay, test etmek kolay ve geri
almak kolaydır. Devasa bir üretilmiş blok bunların hiçbiri değildir.

**Kabul etmeden önce çıktıyı her zaman okuyun ve anlayın.** Bu temel kuraldır: *anlamadığınız kodu
asla göndermeyin.* Üretilen bir fonksiyonun ne yaptığını açıklayamıyorsanız, onu bakımını
yapamaz, debug edemez veya ona güvenemezsiniz. Diff'i okumak isteğe bağlı bir cila değildir — işin
ta kendisidir.

**Test'leri ve version control'ü güvenlik ağınız olarak kullanın.** Çalışan durumları sık sık
commit edin. Bir regresyonun hemen ortaya çıkması için test'leri çalıştırın (veya ürettirin). Merge
etmeden önce diff'i review edin. Bunlar hızlı hareket etmenizi sağlar *çünkü* hatalar yakalanır ve
geri alınabilir.

**Sır'ları ve hassas veriyi prompt'lardan uzak tutun** ve AI'ın yazdığının güvenliğini kontrol
edin — dikkat etmezseniz seve seve SQL injection, eksik yetki kontrolleri veya gömülü anahtarlar
üretir.

**Direksiyonu ne zaman alacağınızı bilin.** Döngü şudur: **prompt → çalıştır → doğrula → düzelt**.
AI dönmeye, tahmin etmeye veya var olmayan API'ler uydurmaya başladığında, prompt yazmayı bırakın
ve kendiniz düzeltin. Bu süreç boyunca **mimari tutarlılığı** koruyun: kod tabanının ekipten
kimsenin akıl yürütemeyeceği bir şeye dönüşmesine izin vermeyin.

## Her rol bunu nasıl kullanır

- **Developer:** prompt → çalıştır → doğrula → düzelt döngüsünü küçük diff'lerle yürütür, üretilen her satırı okur ve çalışan durumları commit eder; böylece anlamadığı hiçbir şey main'e ulaşmaz.
- **Tester:** AI tarafından yazılan kodu test edilene kadar güvenilmez sayar ve makul-ama-bozuk çıktıya karşı gerçek assertion'larla korur.
- **Project Manager:** "Hızlı"nın hâlâ review edilmiş ve test edilmiş demek olduğu — vibe üzerine gönderilmiş okunmamış AI çıktısı değil — beklentisini koyar ve doğrulama adımı için zaman korur.
- **Solution Designer:** Bulanık bir isteği, iyi bir prompt ve kontrol edilebilir bir sonuç yapan açık niyete ve kabul kriterlerine çevirir.
- **Enterprise Architect:** AI destekli kod büyürken sistemi mimari olarak tutarlı tutar; böylece kimsenin akıl yürütemeyeceği bir şeye sapmaz.

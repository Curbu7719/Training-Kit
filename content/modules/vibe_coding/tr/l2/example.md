# İşlenmiş Örnek: İyi Okunan Makul-ama-Bozuk Bir Diff

**Görev.** Raj bir indirim hesaplayıcısını vibe-code ediyor: bir sepete yüzdelik indirim uygula
ama toplamın asla sıfırın altına düşmesine izin verme. Bunun için prompt yazıyor ve temiz,
kendinden emin bir fonksiyon geri alıyor.

**Diff harika görünüyor.** İyi adlandırılmış, bir yorumu var, bir `discountPercent` parametresini
ele alıyor ve `total - (total * discountPercent / 100)` döndürüyor. Kıdemli bir mühendisin
yazdığı bir şey gibi okunuyor. Raj'ın dikkatsiz içgüdüsü onu kabul etmek — *çalışıyor* ve *doğru
görünüyor*. Bu içgüdü tam da **makul-ama-bozuk** tuzağıdır: akıcılık doğruluk değildir.

**Spec'e karşı okumak.** Raj bunun yerine diff'i niyetini akılda tutarak okuyor — *"asla sıfırın
altına düşme."* Fonksiyonun sonucu asla clamp etmediğini ve `discountPercent`'in hiçbir sınır
kontrolü olmadan doğrudan bir istekten alındığını fark ediyor. Yani `150`'lik bir `discountPercent`
*negatif* bir toplam döndürüyor ve spec'inden gelen "asla sıfırın altına düşme" kuralı sessizce
ihlal ediliyor. Hiçbir şey çökmedi; yalnızca "hata yok"u kontrol eden bir test geçmiş olurdu. Bu,
makul-ama-bozuk çıktının içinde gizlenen **sessiz yanlış koddur**.

**Onu sınırlamak.** Raj davranışı doğrulayan bir test yazıyor — `discount(100, 150)` `-50` değil
`0` olmalı — ve başarısız olduğunu izleyerek hatayı doğruluyor. Sonucu clamp etmek ve girdi
aralığını doğrulamak için küçük bir düzeltme prompt'u yazıyor, yeni diff'i **okuyor**, test'i
geçene kadar **çalıştırıyor** ve **commit** ediyor. Daha sonra AI'ın ayrıca ilgisiz bir fiyatlama
modülünü refactor etmeye çalıştığını (**kapsam kayması**) fark ettiğinde, o kısmı reddedip diff'i
tek amaçlı tutuyor.

**Ders.** Buradaki her hata ona yönelik bir disiplin tarafından yakalandı: okuma makul-ama-bozuk
mantığı yakaladı, davranışsal bir test sessiz yanlış sonucu yakaladı ve küçük-diff alışkanlığı
kapsam kaymasını yakaladı. "Çalışıyor ve doğru görünüyor" üçünü de gönderirdi.

# İşlenmiş Örnek: Sadece Soruyu Değil, Tüm Hatayı Bir Agent'a Ver

Sıradan bir chatbot `cart.py`'deki hata veren testi *nasıl* düzelteceğini söyleyebilir. Bir **agent** ise onu gerçekten düzeltebilir — testleri çalıştırır, hatayı okur, dosyayı düzenler, yeniden çalıştırır, yeşil olana dek tekrarlar. İşte fark ve modelin (sınırlar içinde) *eyleme geçmesine* izin vermek öğleden sonranı neden kurtarır.

**Tek çağrı mı, agent mı?** "Bu PR'ı özetle" için tek çağrı yeter. Ama "hata veren testi düzelt", birbirine bağımlı adımlar ister — son test koşusunu görmeden bir sonraki düzenlemeyi bilemezsin. *Neden burada agent?* Planla → eyleme geç → gözlemle döngüsünü senin yerine çalıştırır; çıktıyı sohbete on kez kopyalayıp yapıştırmak yerine.

**Klavyeye dokunmadan nasıl eyleme geçer.** Model kendi başına bir şey çalıştıramaz; bir araç *talep eder* — "`run_tests`'i `path=tests/` ile çağır" — ve senin kodun gerçek komutu çalıştırıp sonucu geri besler. *Bu gününü neden kolaylaştırır?* Birkaç aracı bir kez tanımlarsın (testleri çalıştır, kodu ara, yamayı uygula) ve agent bunları sadece bu hata için değil, gelecekteki her hata için birbirine zincirler.

**Sınırlamanın nedeni.** Otonomi iki ucu keskin bıçaktır: sonsuza dek düzenleyip yeniden test ederek dönebilir ya da yıkıcı bir komut çağırabilir. *Evet demeni sağlayan guardrail'lar:* tüm gece dönememesi için bir maksimum-iterasyon limiti ve push ya da delete'ten önce bir insan-onay kapısı. *Peki o zaman neden agent?* Çünkü sınırlı otonomi sıkıcı %90'ı yapar — çalıştır/oku/düzenle çilesini — ve yalnızca yargı gereken anlarda sana sormak için durur.

**Kontrol sende kalsın.** Onu düşük riskli bir hatada başlat, bir tam döngüyü izle ve kendi kendine durduğunu doğrula. Otonomiye, sınırların tuttuğunu *gördükten sonra* güven.

**Özet:** öğüt istiyorsan tek çağrıya uzan; işin *bitmesini* istiyorsan agent'a. Ona doğru araçları ve sağlam sınırları ver, çok adımlı bir çileyi gözetlediğin tek bir isteğe çevirsin.

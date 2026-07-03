# Çözümlü Örnek: Tek Özellik, İki Araç

Bir destek ekibi yeni bir ekran istiyor. Bir temsilci müşteri e-postasını açınca uygulama
şunları yapmalı:

1. Temsilcinin göndermeden önce düzenleyebileceği bir **yanıt taslağı** yaz.
2. Müşterinin **kesin güncel bakiyesini** göster.
3. E-postayı bir kategoriyle **etiketle** (Faturalama, Teknik, İptal, Diğer) ki doğru kuyruğa
   yönlensin.

Refleks "bunu AI ile yapalım" oluyor. Bunun yerine her parçayı üç sorudan geçirelim.

**Parça 1 — Yanıt taslağı.** *Kuralı yazabilir miyim?* Hayır — her e-posta farklı ve yanıt
serbest-metin dil. *Bulanık dil/yargı mı?* Evet. *Yanılırsa ne olur?* Bir insan göndermeden
düzenliyor, yani "muhtemelen doğru" yeterli. → **AI.** Tam da modelin iyi olduğu açık-uçlu dil
işi.

**Parça 2 — Kesin bakiye.** *Kuralı yazabilir miyim?* Evet — veritabanındaki tek bir sayı.
*Yanılırsa ne olur?* Yanlış bakiye kabul edilemez; kesin ve her seferinde aynı olmalı. →
**Deterministik**: bir veritabanı sorgusu. *Neden AI değil?* Bir modelden kesin rakam istemek
klasik tuzak — daha yavaş, para harcar ve bir sorgunun asla yanılmadığı yerde kendinden emin
yanılabilir.

**Parça 3 — E-postayı etiketle.** *Kuralı yazabilir miyim?* Güvenilir biçimde hayır — ifade
değişir ve sade bir anahtar-kelime kuralı "hesabımı kapatmak istiyorum"u iptal olarak kaçırır.
*Bulanık dil mi?* Evet. *Yanılırsa ne olur?* Yanlış kuyruğa gider, can sıkar ama telafi
edilebilir — ve kategori seti **sabit ve bilinen**. → **Hibrit**: AI dağınık metni sınıflandırır,
kod cevabın dört izinli etiketten biri olduğunu doğrular (değilse "Diğer"e düşer). AI dili okur;
bir kural geçerli, yönlendirilebilir bir kategori garanti eder.

**Ortaya çıkan tasarım.** "Bir AI özelliği" değil, "bir kurallar özelliği" de değil — bir
karışım: bakiye için deterministik sorgu, yanıt için AI, etiket için AI-artı-doğrulayıcı. Her
parça kendine uyan aracı kullanıyor.

**Çıkarım.** Bütün bir özelliğe "AI" ya da "otomasyon" deme — bunu **görev bazında** karar ver.
Her parçayı geçir: *kuralı yazabilir miyim (otomasyon), bulanık dil/yargı mı (AI) ve yanılırsa
ne olur (genelde hibrit — AI önerir, kod kontrol eder ve kesin kısımları yapar)*. Hem hesap
makinesinin işini yapan kararsız bir modelden hem de dili okumaya çalışan kırılgan kural
yığınından böyle kaçınırsın.

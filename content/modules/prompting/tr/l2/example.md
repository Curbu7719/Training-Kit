# İşlenmiş Örnek: Başka Yazılımın Güvenebileceği Bir Prompt Yap

Prompt'un bir spec'i, alt sistemlerin otomatik okuduğu bir test planına çevirir. Demoda çalıştı, production'da bozuldu — çünkü demo düzyazıya tahammül eder, production bir sözleşme ister. İşte ileri seviye desenler onu nasıl güvenilir kılar ve bu emek neden değer.

**Few-shot'u iyi yapmak.** Üç neredeyse-aynı mutlu-yol örneği yapıştırmazsın; kolay durumu *ve* zorları yapıştırırsın — boş girdi, tuhaf bir uç durum. *Neden?* Örnekler *spec'in kendisidir* — yalnızca mutlu yolları göster, model ilk tuhaf girdide bozulur. Çeşitli örnekler, asıl başarısız olduğu yerde güvenilirlik kazandırır.

**Katı bir çıktı sözleşmesi.** "Bir test planı" istemeyi bırakır, sınırlayıcılarla sarılmış, adlandırılmış bir JSON şeması istersin: "yalnızca bunu döndür". *Peki neden AI?* Çünkü artık alt katman kod, düzyazıyı regex'lemek yerine sonuca güvenebilir — ve kullanmadan önce JSON'u **doğrularsın**, hatalı bir planı göndermek yerine onararak ya da reddederek.

**Önce akıl yürüt, sonra yalnızca cevabı döndür.** Çetrefilli bir spec için modelin adım adım akıl yürütmesine izin verirsin — ama yalnızca nihai yapılandırılmış planı döndürmesini söylersin. *Neden?* Akıl yürütme cevabı iyileştirir; alt katman araç ise düşünme metniyle boğulur. Kaliteyi dağınıklık olmadan alırsın.

**Prompt'a kod gibi davran.** Onu satır içinde değil, versiyon kontrolünde tutarsın. *Baştan neden AI?* Çünkü başka yazılımın bağımlı olduğu bir prompt *yazılımdır* — değiştiğinde bir diff, bir inceleme ve geri alabilme istersin, tıpkı diğer production değişiklikleri gibi.

**Özet:** demodan production'a sıçrama daha zekice bir prompt değildir — çeşitli örnekler, doğrulanmış bir çıktı sözleşmesi ve versiyonlamadır. Gerçek araçları AI çıktısına yöneltip ona güvenmeni sağlayan budur.

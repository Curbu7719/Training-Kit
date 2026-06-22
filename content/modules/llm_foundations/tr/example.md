# İşlenmiş Örnek: Günün Sıkıcı Kısımlarını AI'a Bırak

Normal bir iş gününün küçük, tekrarlayan angaryalarını düşün — doğru modeli seçmek bunları sessizce ortadan kaldırır, böylece zamanın gerçekten sana ihtiyaç duyan işe gider.

**Angarya: commit mesajı yazmak.** Her push'ta durup diff'i tek satırlık derli toplu bir mesaja özetlersin — günde onlarca kez. Küçük, hızlı, ucuz bir model bunu saniyede yazar: tutarlı ifade, düşünme yok, fark edilmeyecek kadar küçük maliyet. *Neden AI?* Senin için saf angarya, model için önemsiz — o dakikaları her gün geri alırsın.

**Angarya: uç durumları düşünmek.** Bir tarih ayrıştırıcıyı göndermeden önce artık yılları, saat dilimlerini, boş dizeleri… hepsini hatırlaman gerekir. Orta seviye bir model bunları saniyede sıralar ve senin unutacaklarını yakalar. *Neden AI?* Hafızadan yapmaktan daha hızlı ve daha kapsamlı — hangi vakaların önemli olduğuna yine sen karar verirsin.

**Zor olan: tasarım kontrolü.** Bir servis bölünmesinin gizli bağımlılık saklayıp saklamadığından emin değilsin. İnceleme toplantısından *önce* en güçlü modele "bunu deş" dersin. *Neden AI?* 30 saniyede ciddi bir ikinci görüş, sorunu production'da bulmaktan iyidir — ve pahalı model burada değer, çünkü riskler yüksek ve nadiren sorarsın.

**Kontrol sende kalsın diye püf nokta.** Model bir keresinde var olmayan bir metot önerdi (**halüsinasyon**) ve en yeni framework sürümünü bilmiyor (**bilgi kesim tarihi**). Bu yüzden çıktısını kutsal değil, kontrol edeceğin bir taslak olarak görürsün.

**Özet:** modeli angaryaya göre eşle — günlük işler için ucuz ve hızlı, gerçekten zor karar için büyüğü. AI yerini, sıkıcı kısımlarda sana zaman, zor kısımlarda ikinci bir beyin vererek hak eder.

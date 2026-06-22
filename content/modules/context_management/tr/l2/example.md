# İşlenmiş Örnek: Stratejiyi Seç, Başarısızlık Biçimini Kabul Et

Günlerce sürecek, AI destekli bir migration yürütüyorsun. Tek bir numara işi context window içinde tutmaz — o yüzden her birinin seni nasıl ısırabileceğini bilerek birkaçını birleştirirsin. İşte bu, kendi işini sessizce bozulmak yerine akar tutar.

**Yakın diyalog: kayan pencere (sliding window).** Yalnızca son birkaç turu canlı tutarsın. *Neden?* Ucuzdur ve şu an önemli olan yakın gidiş-geliştir. *Kabul ettiğin tuzak:* tasarım gereği unutkandır — ilk gün koyduğun bir kural pencereden kayar. O yüzden o kuralı pencerenin tutacağına güvenmek yerine sabit bir gerçek olarak **sabitlersin (pin)**.

**Eski geçmiş: yürüyen özet.** Dünkü kararları kısa bir özete sıkıştırırsın. *Neden AI?* Özeti saniyede yazar ve her şeyi tekrar yapıştırmadan kararları ileri taşırsın. *Tuzak:* özetler kayıplıdır, özetin özeti ise sapar — o yüzden tanımlayıcıları ve kabul kriterlerini asla başka kelimelerle değil, birebir korursun.

**Kod tabanı: retrieval.** Her adımın ihtiyaç duyduğu dosyaları çekersin. *Neden?* Yüzlerce çağrı boyunca pencereyi yalın tutar. *Tuzak:* artık riskin retrieval kalitesidir — bayat bir indeks geçen haftanın kodunu getirir ve AI zaten değişmiş bir dosyayı "düzeltir". O yüzden her oturumdan önce yeniden indekslersin.

**Yerleşim önemli.** Kritik spec'i prompt'un ortasına gömmek yerine **başına ya da sonuna** koyarsın, çünkü modeller uzun bağlamın ortasına daha az güvenilir biçimde dikkat eder — ve dolmaya yakın bir girdinin çıktıyı aç bırakmaması için pay ayırırsın.

**Özet:** derinlikte beceri "güvenli" bir teknik bulmak değildir — öyle bir teknik yok. Stratejiyi içeriğe eşlemek ve bilinen başarısızlık biçimini bilerek yönetmektir; böylece uzun, AI destekli bir iş bir kısıtı sessizce kaybetmek yerine doğru kalır.

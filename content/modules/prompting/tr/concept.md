# Prompt Mühendisliği: Bir Modelin İzleyebileceği Talimatlar Yazmak

Bir **prompt**, bir dil modeline çıktısını yönlendirmek için verdiğiniz metindir. Model yalnızca gönderdiğiniz kelimeleri gördüğü için — deponuzu, görev takip sisteminizi veya niyetinizi okuyamaz — bu kelimelerin kalitesi büyük ölçüde cevabın kalitesini belirler. Prompt mühendisliği; modelin yazılım yaşam döngüsü boyunca istediğiniz şekilde davranması için açık, yapılandırılmış ve test edilebilir prompt'lar yazma pratiğidir.

**Bir benzetme:** ekibe yeni katılmış, çok yetenekli bir müteahhidi bilgilendirdiğinizi düşünün. Onlara hedefi, kısıtlamaları, geri istediğiniz biçimi ve bir iki örnek verirseniz *o zaman* mükemmel kod yazar, keskin kullanıcı hikayeleri hazırlar ve uç durumları bulurlar. Bunlardan birini atlarsanız tahmin ederler — bazen iyi, çoğu zaman değil. İyi bir prompt, iyi bir brifingtir.

**Bir prompt'taki roller.** Çoğu sistem, bir **system/developer mesajını** bir **user mesajından** ayırır. System mesajı kalıcı kuralları ve kişiliği belirler — "Sen testleri projenin framework'üyle yazan ve asla API uydurmayan kıdemli bir mühendissin." User mesajı belirli isteği taşır — "Bu fonksiyon için birim testleri üret." System mesajı daha yüksek önceliğe sahiptir ve turlar arasında kalıcıdır; bu yüzden politikayı, kodlama standartlarını ve rolü oraya koyun.

**Yapı yardımcı olur.** Modeller iyi düzenlenmiş prompt'ları daha güvenilir şekilde izler:

- **Sınırlayıcılar (delimiters)** — kodu, hikayeyi veya spesifikasyonu işaretlerle (üçlü ters tırnak, XML tarzı etiketler) sarın ki model *talimatlarınızı* *işlenecek artefakttan* ayırsın.
- **Bölümler ve sıralama** — önce rolü, sonra bağlamı/kodu, sonra görevi, sonra varsa örnekleri, en sonda çıktı biçimini belirtin. En önemli talimatı kaybolmayacağı yere koyun.
- **Spesifik olun** — "Boş liste, tek öğe ve taşma durumlarını kapsa; pytest kullan" ifadesi "biraz test yaz" ifadesinden iyidir.

**Few-shot örnekleri.** Bir veya daha fazla girdi→çıktı örneği göstermek ("few-shot"), modele ev tarzınızı — test adlandırmanızı, hikaye biçiminizi — anlatmaktan çok daha iyi öğretir. Basit, belirsizliği olmayan görevler için zero-shot yeterlidir.

**Çıktı biçimini kontrol etmek.** Sonucu downstream araçlar veya ekip arkadaşları kullanacaksa açıkça unified diff, tek bir test dosyası, Gherkin senaryoları veya JSON isteyin.

**Yineleme (iterasyon).** İlk prompt bir taslaktır. Onu çeşitli girdilerde çalıştırın, nerede başarısız olduğunu bulun ve iyileştirin — sihirli formüller söylemek gibi değil, kodu başarısız testlere karşı revize etmek gibi.

## Her rol bunu nasıl kullanır

- **Geliştirici/Mühendis:** Test framework'ünü ve kodlama standartlarını sabitleyen bir system mesajı yazar, ardından modele birim testleri veya bir diff olarak refactor ürettirip modelin ilk başta yanlış yaptığı durumlara karşı yineler.
- **İş Analisti:** Bir paydaş isteğini, belirsiz bir parafrazlamadan çok gerçek iş kuralını kodlayarak, açık kabul kriterleri olan bir kullanıcı hikayesine dönüştüren bir prompt yapılandırır.
- **PM/Ürün Sahibi:** İstenen kapsamı, tonu ve çıktı biçimini (ör. önceliklendirilmiş bir backlog tablosu) baştan tanımlar; özellik kalitesini yalnızca model seçiminin değil, prompt kalitesinin de yönlendirdiğini fark eder.
- **QA/Test Uzmanı & Mimar:** Sabit bir bölüm şablonuyla bir spesifikasyondan test planı taslağı hazırlayan bir prompt kurar; system/user ayrımını ve sınırlayıcıları, prompt'lar ekip genelinde yeniden kullanılabilir ve güvenli kalacak şekilde tasarlar.

# İşlenmiş Örnek: AI Asistanıyla Güvenli Bir Saat

Sıradan bir sabah ve AI asistanına birkaç kez başvuruyorsun. İşte birkaç küçük alışkanlık her kullanımı nasıl hem güvenli hem yararlı tutuyor.

**Uzun bir e-posta dizisini özetle.** 40 mesajlık bir diziyi yapıştırıp temel kararları istiyorsun. *Güvenli hamle:* dizide bir müşterinin adı ve sipariş detayları var, o yüzden rastgele bir chatbot değil **onaylı platformu** kullanıyorsun ve iletmeden önce özeti gerçek mesajlarla karşılaştırıyorsun — çünkü bir özet bir kararı sessizce düşürebilir ya da uydurabilir. *Neden AI?* 20 dakikalık okumayı kurtarır; sen 2 dakikalık kontrolü tutarsın.

**Bir politika sorusu sor.** "İade süremiz ne kadar?" AI kendinden emin biçimde "30 gün" diyor. *Güvenli hamle:* bunu bir **taslak** olarak görüp gerçek politika sayfasını kontrol ediyorsun — model güncel politikandan değil, eski eğitim verisinden tahmin yürütüyor olabilir. Aslında 14 günmüş. O kontrol, müşteriye yanlış bir şey söylemekten seni kurtardı.

**Durum güncellemesi taslakla.** Notlarından haftalık güncellemeni yazmasını istiyorsun. *Güvenli hamle:* notlarında PII ve secret yok, o yüzden göndermek sorun değil; taslağı okuyup paylaşmadan önce abartılı tek satırı düzeltiyorsun. Paylaştığın şey senin sorumluluğunda.

**Bir ticket AI'ı ele geçirmeye çalışıyor.** Bir hata kaydını özetlerken AI birden bir iç config dosyasını dışarı e-postayla göndermeyi öneriyor. *Güvenli hamle:* duruyorsun — o talimat senden değil, *ticket metninden* geldi (**prompt injection**). Üzerine işlem yapmıyor ve işaretliyorsun.

**Özet:** AI'ı güvenle kullanmak ekstra iş değildir — birkaç alışkanlıktır. Onaylı araç, hassas veri yok, cevapları taslak gör, önemli olanı doğrula ve içeriğe gizlenmiş talimatlara göre asla işlem yapma. Hızı alırsın, olayı atlarsın.

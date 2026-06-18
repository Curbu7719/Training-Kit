# Derinlemesine Vibe Coding: Hata Modları ve Onları Sınırlayan Disiplinler

L1'de disiplinli döngüyü öğrendiniz — açık niyet, küçük adımlar, her diff'i okumak, güvenlik ağı
olarak test'ler ve version control, AI döngüye girdiğinde direksiyonu almak. L2'de soru *iyi
uygulamaların ne olduğundan* *neden var olduklarına* kayar: her disiplin, AI tarafından üretilen
kodun belirli, tekrar eden bir hata moduna karşı bir savunmadır. Hata modlarını bilmek, disiplinleri
ritüel olarak değil bilinçli olarak yerleştirmenizi sağlayan şeydir.

**Temel hata modları.**

- **Sessiz yanlış kod.** Kod çalışır, bir değer döndürür ve basitçe yanlıştır — bir-eksik, ters
  koşul, yanlış varsayılan. Hiçbir şey çökmez, yani "çalışıyor" size hiçbir şey söylemez. *Sınırlayan:*
  hata yokluğunu değil davranışı doğrulayan test'ler.
- **Makul-ama-bozuk.** Çıktı, idiomatic, kendinden emin bir kod gibi okunur ve bir bakışta geçer,
  ama bir kenar durumu, bir null veya eşzamanlılığı yanlış ele alır. Akıcılığının ta kendisi
  tuzaktır. *Sınırlayan:* diff'i, spec'inizdeki kenar durumlarını akılda tutarak gerçekten okumak.
- **Halüsinasyon API'ler.** AI var olmayan metotlar, parametreler veya kütüphaneler uydurur ya da
  gerçek bir API'yi yanlış imzayla kullanır. *Sınırlayan:* onu çalıştırmak ve döngüyü tanıyıp var
  olmayan bir API'yi var etmeye çalışmak yerine direksiyonu almak.
- **Kapsam kayması.** Bir endpoint istediniz; diff ayrıca "yardımsever bir şekilde" ilgisiz
  modülleri refactor etti, varsayılanları değiştirdi veya bağımlılıklar ekledi. *Sınırlayan:* küçük,
  tek amaçlı prompt'lar ve isteği aşan diff'leri reddetmek.
- **Aşınan anlayış.** En yavaş, en tehlikeli hata: yeterince okunmamış çıktı kabul edin ve kimse
  sistemin nasıl çalıştığını açıklayamaz, yani kimse debug, güvenli kılamaz veya genişletemez.
  *Sınırlayan:* pazarlık edilemez kural — anlamadığınız kodu asla göndermeyin — ve bir zihinsel model
  tutmak.

**Bir kontrol listesi değil, bir sistem olarak disiplinler.** Disiplinler katmanlı savunmalar gibi
birleşir, her biri bir öncekinin kaçırdığını yakalar. Açık bir **spec**, okuma ve teste bir hedef
verir. **Küçük diff'ler** okumayı uygulanabilir kılar ve kapsam kaymasını izole eder. **Okuma**, bir
test'in kapsamayabileceği makul-ama-bozuk mantığı yakalar. **Test'ler** iyi okunan sessiz yanlış
kodu yakalar. **Version control** her adımı geri alınabilir ve review edilebilir kılar. **İnsan
review geçitleri** doğrulanmamış çıktıyı sınırda durdurur. Birini düşürün ve sınırladığı hata
doğrudan geçer.

**Bir zihinsel model tutmak.** En derin disiplin, AI içine yazarken sistemin doğru bir modelini
kendi kafanızda tutmaktır. Mimari tutarlılığı mümkün kılan budur: sapan bir diff'i ancak hâlâ
bütünü anlıyorsanız reddedebilir, doğru soyutlamayı adlandırabilir veya bir güvenlik açığını fark
edebilirsiniz. Bu modeli aşındıran hız, bir şey bozulduğunda faiziyle ödeyeceğiniz bir borca karşı
borçlanmaktır.

## Her rol bunu nasıl kullanır

- **Geliştirici/Mühendis:** Her disiplini sınırladığı hata moduna eşler, makul-ama-bozuk mantık için
  okur, halüsinasyon API'leri ortaya çıkarmak için çalıştırır ve sistemi tutarlı tutan zihinsel
  modeli korur.
- **İş Analisti:** Niyeti, "sessiz yanlış kod"un karşı yakalanacağı bir davranışsal spec'i olacak
  kadar kesin yazar ve AI'ın yanlış ele alma olasılığı yüksek kenar durumları işaretler.
- **PM/Ürün Sahibi:** Aşınan anlayışı bedava hız değil biriken risk olarak tanır ve okunmamış
  çıktıyı ödüllendirmek yerine review ve test adımları için bütçe ayırır.
- **QA/Tester & Mimar:** Sessiz yanlış kodu yakalamak için davranışı doğrulayan test'ler tasarlar,
  makul-ama-bozuk kenar durumlarını red-team eder, kapsam kaymasını izler ve mimari tutarlılığı
  sapmaya karşı korur.

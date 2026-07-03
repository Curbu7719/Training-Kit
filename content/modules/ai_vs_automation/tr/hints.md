# İpuçları — AI mı, Otomasyon mu?

## Ana fikrin farklı ifadeleri

- Sırayla üç soru sor: *kuralı yazabilir miyim ve sabit kalır mı* (→ otomasyon), *dağınık dil
  ya da yargı mı* (→ AI), ve *yanılırsa ne olur* (→ genelde AI'ın önerip kodun kontrol ettiği
  bir hibrit).
- Deterministik kod her seferinde aynı cevabı verir; ucuz, hızlı, test edilebilir ve
  denetlenebilir — ama yalnızca yazabildiğin kurallar için. AI belirsizliği ve dili kaldırır ama
  çağrı başına maliyeti vardır, daha yavaştır, non-deterministiktir ve kendinden emin yanılabilir.
- Gerçek sistemlerin çoğu hibrittir: AI bulanık kısmı yapar, deterministik kod biçimi doğrular
  (format, aralık, izinli kategori) ve kesin olanı yapar (gerçek toplam ya da bakiye).

## İpucu yığını

- **H1 (dürtme):** Her görev için önce kuralın *kesin ve bilinen* olup olmadığını sor. Formül,
  lookup ya da format kontrolü olarak yazabiliyorsan deterministik kod modeli yener — daha ucuz,
  anlık ve her seferinde aynı cevap.
- **H2 (yapısal):** Kesin rakamlar (bakiye, toplam) ve kesin kurallar (vergi, format doğrulama,
  sabit tabloyla yönlendirme) **asla** AI işi değildir. Serbest metin, çeşitli belgeler,
  özetleme ve yargı AI'a uyar — çoğunlukla bir kod kontrolüyle birlikte.
- **H3 (cevaba yakın):** Bir görevin bir kısmı bulanık dil, bir kısmı kesin olmalıysa böl: dil
  için AI, kesin kısım için deterministik kod ve AI çıktısını güvenli biçimde tutan bir
  doğrulayıcı. Bu bölme hibrit cevabıdır.

## SSS

**S: AI güçlü — neden her şeyde kullanmayalım?**
Çünkü non-deterministiktir, çağrı başına para harcar, daha yavaştır ve kodun asla yanılmadığı
şeylerde yanılabilir. Kesin, bilinen kurallarda (vergi, doğrulama, yönlendirme, sıralama, kesin
rakamlar) deterministik otomasyon daha ucuz, hızlı ve tekrarlanabilirdir. AI'ı yalnızca bulanık,
dil ya da yargı biçimli iş için kullan.

**S: Bir şeyin "kural" mı yoksa "bulanık" mı olduğunu nasıl anlarım?**
Bir meslektaşın her seferinde aynı şekilde uygulayacağı adımlar ya da formül olarak yazabiliyorsan
kuraldır → otomatikleştir. İki dikkatli kişi makul biçimde farklı ifade ya da yargıda
bulunabiliyorsa (özet, dağınık metin sınıflandırması, taslak) bulanıktır → AI, genelde bir
kontrolle.

**S: "Agent-washing" nedir?**
Sade, sabit otomasyonu modern dursun diye "AI agent" gibi göstermek. Planlı bir rapor ya da
sabit bir veri hattının adımları sabittir — o otomasyondur ve modele sarmak yalnızca maliyet,
gecikme ve non-determinizm ekler.

**S: Hibrit ne zaman doğru cevaptır?**
Neredeyse her AI çıktısının kesin ya da güvenli olması gereken bir şeyi beslediği zaman. AI
dağınık girdiyi ele alsın, sonra deterministik kod sonucu doğrulasın (geçerli format, aralıkta
sayı, izinli kategori) ve kesin işlemi yapsın. AI önerir; kod karar verir.

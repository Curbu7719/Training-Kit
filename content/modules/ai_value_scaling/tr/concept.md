# AI Değeri ve Ölçeklendirme

**AI değeri**, bir AI sisteminin ürettiği ölçülebilir iş sonucudur — AI kullanması gerçeği
değil. **Ölçeklendirme**, umut vadeden bir AI pilot'unu alıp onu tüm organizasyona güvenilir
biçimde hizmet eden bir şeye dönüştüren disiplinli yoldur. İkisi ayrılmaz: bir pilot gerçek
değeri kanıtladığı *için* ölçeklendirirsiniz ve hiç ölçeklendirip ölçeklendirmeyeceğinizi
*bilmek için* değeri ölçersiniz.

**Gerçek değer ve vanity metrikleri.** Bir vanity metriği etkileyici görünür ama bir iş
sonucuna bağlanmaz — "bu ay çalıştırılan 10.000 prompt" veya "model %92 doğru." Gerçek bir
değer metriği para, zaman, risk veya kaliteye bağlanır: analist başına tasarruf edilen saat,
insan olmadan çözülen destek talepleri, azaltılan hata oranı, etkilenen gelir. Daima sorun:
bu sayı iki katına çıksa, iş daha mı iyi olurdu? Değilse, bu bir vanity metriğidir.

**Pilot → production → ölçeklendirme yolu.** AI çalışması aşamalardan geçer:

- **Pilot** — net bir başarı metriği ve gerçek bir kullanıcı grubu olan küçük, süreyle
  sınırlı bir test.
- **Production** — pilot, destek ve sahipleri olan güvenilir, izlenen bir sisteme dönüşür.
- **Ölçeklendirme** — değer kanıtlandığında onu daha fazla kullanıcıya, ekibe veya kullanım
  senaryosuna genişletirsiniz.

**Ölçeklendirme ya da durdurma kararı.** Bir pilot bir deneydir ve birçoğu durdurulmalıdır.
Değer metriği önceden anlaşılmış bir eşiği geçtiğinde, adoption gerçek olduğunda ve maliyetler
sürdürülebilir olduğunda ölçeklendirin. Değer kanıtlanmadığında, çabaya rağmen adoption düşük
olduğunda veya çalıştırma maliyeti faydayı aştığında **durdurun**. Zayıf bir pilot'u durdurmak
bir başarısızlık değil, bir başarıdır — daha iyi bahisler için bütçe serbest bırakır.

**Değişim yönetimi ve adoption.** Kimsenin kullanmadığı teknoloji sıfır değer yaratır.
Adoption; eğitime, güvene, net iş akışlarına ve insanlara AI'ın onları tehdit etmek yerine
yardım ettiğini göstermeye bağlıdır. Yalnızca erişilebilirliği değil, adoption'ı (aktif
kullanıcılar, tekrar kullanım) ölçün.

**AI olgunluğu.** Organizasyonlar gelişigüzel deneylerden, tekrarlanabilir pilotlara, yönetişimli
production sistemlerine ve AI'ın çekirdek operasyonlara dokunduğu noktaya doğru ilerler.
Olgunluk yalnızca modellerle değil, süreç ve insanlarla ilgilidir.

## Her rol bunu nasıl kullanır

- **Portfolio Manager:** Ölçeklendir-ya-da-durdur kararının ve bütçe yeniden tahsisinin sahibidir; liderliğe raporlarken gerçek değeri vanity metriklerinden ayırır.
- **Project Manager:** Başarı metriğini ve eşiği baştan tanımlar, pilotu yürütür ve insanların sistemi gerçekten kullanması için adoption ve değişim yönetimi planını sahiplenir.
- **Developer:** Sistemi gerçek değer metrikleri (kazanılan zaman, hata oranı) ve adoption ölçülecek şekilde donatır ve yalnızca değer kanıtlandığında ölçeklenecek biçimde inşa eder.
- **Enterprise Architect:** Sistemin production için yeterince güvenilir olduğunu doğrular ve kullanım büyüdükçe maliyet ve kalite çökmeyecek biçimde tasarlar.

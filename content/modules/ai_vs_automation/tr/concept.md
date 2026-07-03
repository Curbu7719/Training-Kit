# AI mı, Otomasyon mu? Doğru Aracı Seçmek

Elinin altında AI olunca refleks her işe bir model koşmak oluyor. Ama ilk soru *nasıl* AI
kullanacağın değil — **kullanmalı mısın**, yoksa sade **otomasyon** işi daha iyi mi yapar?
Bunu yanlış yapmak modern yazılımın en sık ve en pahalı hatalarından biri: on satır sabit
kodun bedavaya kusursuz yaptığı işi yapan yavaş, kararsız, maliyetli bir model — ya da tam
tersi, yalnızca bir modelin okuyabileceği dağınık dili binlerce elle-yazılmış kuralla çözmeye
çalışmak.

İki tanım. **Deterministik otomasyon** (yani "kurallar" ya da "geleneksel kod") sabit adımlar
izleyen ve aynı girdi için **her seferinde aynı cevabı** veren koddur — bir formül, bir lookup
tablosu, bir **regex** (bilinen bir biçimdeki metni eşleyen desen), bir veritabanı sorgusu.
Buradaki **AI** ise **non-deterministik** bir modeldir (genelde bir LLM) — aynı girdi biraz
farklı çıktı verebilir — ve kesin kuralla değil, örüntüyle çalışır.

**Sırayla üç soru.** Her görev için sor:

1. **Kuralı yazabilir miyim ve sabit kalır mı?** Mantık kesin, bilinen ve sabitse — vergi
   hesabı, format kontrolü, lookup ile yönlendirme — **deterministik otomasyon** kullan. Daha
   ucuz, hızlı, test edilebilir, denetlenebilir ve güvenilir.
2. **Dağınık dil, algı ya da yargı mı?** Girdi serbest metin, çeşitli belgeler ya da görselse;
   ya da iş özetleme, taslak yazma veya bulanık girdiyi sınıflandırmaysa — **AI** kullan;
   "muhtemelen doğru, sonra kontrol edilir" hiç yoktan iyidir.
3. **Yanılırsa ne olur?** Yanlış cevap maliyetliyse ya da kesin olmalıysa, AI'ı deterministik
   kontrollerle sar — cevap genelde **hibrit**tir: AI bulanık kısmı yapar, kod doğrular ve kesin
   olan her şeyi yapar.

**Bir bakışta deterministik vs AI.** Deterministik kod her seferinde aynı cevabı verir; ucuz,
hızlı, test edilebilir ve denetlenebilir — ama yalnızca kural olarak yazabildiğin şeyi yapar.
AI belirsizliği, dili ve açık-uçlu işi kaldırır — ama çağrı başına maliyeti vardır, daha
yavaştır, non-deterministiktir ve **kendinden emin bir şekilde yanılabilir**, o yüzden çıktısı
kontrol ister. AI seçmek bazen yanılan akıllı bir asistan tutmak gibidir; otomasyon seçmek
hesap makinesi kullanmak gibi. Vergi için hesap makinesini, "şu 500 yorumu oku ve ana temaları
söyle" için asistanı istersin.

**Asıl cevap genelde hibrit.** İyi sistemlerin çoğu "AI" ya da "otomasyon" değil — ikisi
birden. AI önerir; deterministik kod biçimi kontrol eder (geçerli format, aralıkta sayı, izinli
kategori) ve kesin olanı yapar (gerçek bakiye, gerçek toplam). Örnek: uygulama müşteriye AI ile
bir yanıt taslağı yazar, ama müşterinin **kesin** hesap bakiyesini bir veritabanı sorgusuyla
getirir — asla modelden değil. Aynı ekran, iki araç, her biri yerinde.

**Sık düşülen tuzaklar.**

- **Kesin kural için model kullanmak** — LLM'e toplama yaptırmak, liste sıralatmak ya da sabit
  indirim uygulatmak. Daha yavaş, para harcar ve kodun asla yanılmadığı yerde yanılabilir.
- **Sade otomasyonu "agent" gibi göstermek (agent-washing)** — planlı bir raporu ya da sabit bir
  veri hattını modern dursun diye "AI agent" diye sarmak. Adımlar sabitse, o otomasyondur.
- **Dili elle kodlamak** — serbest-metin bir isteğin her ifadesini anahtar-kelime kurallarıyla
  yakalamaya çalışmak. AI tam da orada işe yarar.
- **Maliyet ve güvenilirliği unutmak** — AI ne bedava ne anlık. Onu gerçekten esnekliğinin
  gerektiği yere sakla.

## Her rol bunu nasıl kullanır

- **Portföy / Proje Yöneticisi:** "AI kullanalım" isteklerini sorgular — bu gerçekten bulanık
  dil/yargı işi mi, yoksa daha ucuza ve güvenilir otomatikleştirebileceğimiz bir kural mı?
- **Kurumsal Mimar:** Sınırı tasarımda çizer — kesin mantık için deterministik servisler, yalnız
  belirsizliğin olduğu yerde AI, etrafında kontrollerle (hibrit).
- **Geliştirici:** Sade kodun modeli yendiği yeri fark eder ve her AI çıktısının etrafına
  deterministik doğrulama koyar.
- **Test Uzmanı / DevOps:** Deterministik kısımları kesin test eder; AI kısımlarını olasılıksal
  ele alır (aralık, eşik, guardrail), tek çalıştırmada geç/kaldı değil.
- **Yönetişim:** Deterministik kararların denetlenebilir ve tekrarlanabilir olduğunu; AI
  kararlarının loglama, gözden geçirme ve önemli yerde insan gerektirdiğini not eder.

> Bu, *uygunluk* sorusunun küçük hali. AI'ın uygun olduğuna karar verdiğinde, **AI Fit &
> Build vs Buy** modülü onu nasıl temin edeceğini anlatır — API çağır, satın al, fine-tune, ya
> da kendin geliştir.

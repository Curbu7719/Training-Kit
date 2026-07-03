# Çözümlü Örnek: Fatura-Alım Hattı Tasarlamak

Finans ayda binlerce tedarikçi faturasını, onlarca farklı düzende PDF olarak alıyor. Her
faturanın **numara, tarih ve toplamını** otomatik yakalayıp ödeme için kaydetmek istiyorlar.
Biri "faturaları okuyup ödeyen bir AI agent" öneriyor. Bunun yerine düzgün tasarlayalım — her
adımda AI mı deterministik mi kararını vererek.

**Adım 1 — Alanları oku.** Düzenler çok değişken, sabit bir şablon ayrıştırıcı baş edemez. Bu
gerçek anlamda çeşitli-girdi-üzerinde-algı işi. → **AI** numara, tarih ve toplamı çıkarır. *Ama*
ham çıktıya güvenmiyoruz.

**Adım 2 — Doğrula (çıkar-sonra-doğrula).** Deterministik kod şimdi AI çıktısını kontrol eder:
fatura numarası beklenen formata uyuyor mu, tarih gerçek ve gelecekte değil mi, toplam pozitif
bir tutar mı ve varsa satır kalemleriyle tutuyor mu. Başarısız olan **insana işaretlenir**,
kaydedilmez. → AI etrafında **deterministik** guardrail.

**Adım 3 — Maliyeti kıs (önce-deterministik).** Birçok tedarikçi *sabit* bir şablon gönderir.
Onlar için bir kural alanları bedava ve anlık ayrıştırır; yalnızca bilinmeyen düzenler modele
düşer. Ayda binlerce faturada, her birini AI'a göndermek gereksiz bir fatura olurdu — bu yüzden
ucuz kesin yol önce, AI sonra çalışır. → **Önce-deterministik, AI-yedek.**

**Adım 4 — Ödemeye karar ver (öner-sonra-geçit).** Para ödemek yüksek riskli, o yüzden AI asla
bir ödeme tetiklemez. Bir kural geçit tutar: bilinen bir tedarikçiden, tüm doğrulamaları yeşil,
küçük eşik altı faturalar otomatik kaydedilir; gerisi insan onayını bekler. → **AI önerir; bir
kural ve bir insan karar verir.**

**Adım 5 — Her yarıyı doğru test et.** Deterministik doğrulayıcılar kesin birim testi alır (bu
bozuk numara reddedilmeli, bu gelecek tarih işaretlenmeli). AI çıkarıcı, doğru alanları bilinen
birkaç yüz gerçek faturadan oluşan bir **değerlendirme seti** alır; çıkarım doğruluğunu ve
doğrulayıcı geçme oranını ölçer, model ya da prompt değişince yeniden çalıştırırız.

**Sonuç.** "Faturaları ödeyen bir AI agent" değil — AI'ın yalnızca kendi yapabildiğini yaptığı
(çeşitli düzenleri okumak), deterministik kodun kesin ve güvenli her şeyi yaptığı (doğrula, ucuz
trafiği yönlendir, ödemeleri geçitle) ve her yarının kendine uyan biçimde test edildiği bir hat.

**Çıkarım.** İyi bir hibrit kasıtlıdır: desenleri adlandır (çıkar-sonra-doğrula,
önce-deterministik, öner-sonra-geçit), AI/deterministik sınırını kesinlik ve maliyetin gerektirdiği
yere koy ve kesin kısımları kesin, AI kısımlarını değerlendirme seti ve eşikle test et.

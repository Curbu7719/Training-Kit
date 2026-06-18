# İpuçları — AI Risk ve Governance

## Temel fikrin alternatif ifadeleri

- AI governance, bir kuruluşun AI'yi bilinçli kullanma biçimidir: her riski bir sahiple eşleyen
  politikalar, onay geçitleri, insan gözetimi, audit günlükleme ve bir AI kullanım kaydı.
- AI benimsemenin riskleri kategorilerdir (gizlilik/PII, IP ve lisanslama, compliance, güvenlik
  ve sızıntı, güvenilirlik, bias) — governance her birini tek bir genel kuralla değil, belirli
  bir kontrolle yanıtlar.
- Governance riski ortadan kaldırmaz; riski görünür kılar, sahiplik atar ve AI kullanımının
  yasa, sözleşme ve işletmenin risk iştahı içinde kalması için bir kayıt tutar.

## İpucu yığını

- **H1 (dürtme):** Her risk için "bunu kim sahipleniyor ve hangi kontrol onu yanıtlıyor?" diye
  sorun. Adı konmuş kontrolü olmayan bir risk, asıl açıktır.
- **H2 (yapısal):** Kontrolleri çalıştıkları yere göre sıralayın: *kullanımdan önce* (kabul
  edilebilir kullanım politikası, risk katmanlama, onay geçidi), *kullanım sırasında* (PII
  redaksiyonu, insan gözetimi) ve *kullanımdan sonra* (audit günlüğü, güncel tutulan AI kullanım
  kaydı).
- **H3 (cevaba yakın):** Gizlilik/PII redaksiyon ve politikayla; IP ve lisanslama satıcı
  sözleşmesiyle (eğitim hakları, çıktı sahipliği); sızıntı erişim kapsamlandırmayla; bias ve
  güvenilirlik test ve insan gözetimiyle; hesap verebilirlik audit günlükleme ve kullanım
  kaydıyla eşleşir.

## SSS

**S: Kabul edilebilir kullanım politikası kendi başına yeterli değil mi?**
Hayır. Bir politika niyeti belirtir, ama onay geçitleri, redaksiyon, günlükleme ve bir kullanım
kaydı olmadan hiçbir şey onu uygulamaz veya kaydetmez. Governance, politika artı onu gerçek
kılan kontrollerdir.

**S: IP riski ile gizlilik riski arasındaki fark nedir?**
Gizlilik/PII riski, kişisel verinin sızması veya hukuka aykırı işlenmesiyle ilgilidir. IP ve
lisanslama riski haklarla ilgilidir: eğitim verisinin lisanslı olup olmadığı, çıktının ihlal
edip etmediği ve modelin ürettiğinin **sahibinin kim olduğu** — genellikle satıcı sözleşmesinde
çözülür.

**S: Neden bir AI kullanım kaydı tutulur?**
Çünkü göremediğinizi yönetemezsiniz. Kayıt, AI'nin nerede, kim tarafından, hangi veri ve risk
katmanıyla kullanıldığını envanterler, böylece hiçbir kullanım görünmeden çalışmaz ve
denetimlerin bir başlangıç noktası olur.

**S: Governance her çıktıyı bir insanın kontrol etmesi anlamına mı gelir?**
Hayır. İnsan gözetimi risk katmanına göre uygulanır — yüksek etkili, müşteriye dönük veya
düzenlemeye tabi kullanımlar insan-döngüde inceleme ve onay geçitleri alır; düşük riskli dahili
kullanımlar bunlara ihtiyaç duymayabilir.

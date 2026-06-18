# SDLC'de AI'ın Güvenliği ve Gizliliği

Yazılım işine bir AI asistanı kattığınızda, gönderdiğiniz her prompt **kontrolünüzden çıkan
veri** haline gelir. Model sağlayıcı, yapıştırdığınız her şeyi — kaynak kodu, stack trace'ler,
müşteri kayıtları — alır ve planınız aksini söylemediği sürece bunu **saklayabilir** (data
retention), **log'layabilir** veya hatta gelecekteki modelleri **eğitmek** için kullanabilir.
Buradaki güvenlik ve gizlilik, ne gönderdiğinizi, nereye gittiğini ve hassas veriyi asla
ulaşmaması gereken yerlerden uzak tutmayı bilmekle ilgilidir.

**PII ve hassas veri.** Kişisel veri (isimler, e-postalar, sağlık veya ödeme kayıtları) ve
tescilli kaynak kodu, kazara en sık sızdırılan iki şeydir. Bir üretim veritabanı satırını veya
gerçek bir müşteri talebini bir chatbot'a yapıştırmak, o veriyi sınırlar ötesine (bir **data
residency** sorunu) ve bir tedarikçinin log'larına taşıyabilir. Çözüm **minimizasyon**dur:
gereken en az veriyi gönderin ve prompt makinenizden ayrılmadan önce PII ve secret'ları
**redaction** ile temizleyin.

**Prompt ve veri sızıntıları.** Hassas bağlam birkaç şekilde sızar: bir belgede gizlenmiş bir
**prompt injection**, modeli veriyi dışarı sızdırması için kandırır; bir geliştirici bir API
anahtarını veya parolayı doğrudan bir prompt'a yapıştırır; hassas çıktı herkesin okuyabileceği
**log'lara** yazılır; veya bir model eğitim verisini ezberler (memorisation) ve onu tekrarlar.
Çok kiracılı (multi-tenant) sistemlerde, zayıf izolasyon bir müşterinin verisini başkasının
oturumuna sızdırabilir.

**Shadow AI.** En büyük günlük risk, onaylanmamış araçlardır — geliştiricilerin kod veya
veriyi, hiçbir kurumsal anlaşması, zero-retention ayarı veya politikası olmayan rastgele
tüketici chatbot'larına yapıştırması. AI'ı yasaklamak bunu yalnızca yeraltına iter. Onu gün
ışığına çıkarın: **onaylı araçlar** (sanctioned tools), net bir politika ve neyin izinli olup
olmadığı konusunda eğitim sunun.

**SDLC genelinde pratik önlemler.** Veriyi sınıflandırın ki insanlar neyin hassas olduğunu
bilsin; göndermeden önce redaction yapın ve secret'lar için tarayın; bir **onaylı araç listesi**
kullanın; **no-train / zero-retention** ayarlarını açın; prompt'ları ve AI çıktısını düz
log'lardan uzak tutun; ve AI çıktısı üretime ulaşmadan önce **inceleme geçitleri** (review
gates) ekleyin.

## Her rol bunu nasıl kullanır

- **Geliştirici/Mühendis:** Prompt göndermeden önce PII ve secret'ları redact eder, yalnızca
  zero-retention etkin onaylı araçları kullanır ve prompt'ları ile model çıktısını paylaşılan
  log'lardan uzak tutar.
- **İş Analisti:** Hangi verinin hassas veya regüle olduğunu sınıflandırır, böylece redaction
  ve residency kuralları doğrudan uyumluluk yükümlülüklerine eşlenir.
- **PM/Ürün Sahibi:** Onaylı araç listesine ve politikaya sahip çıkar, hangi AI araçlarının
  onaylı olduğuna ve gönderimden önce nerede insan inceleme geçitlerinin gerektiğine karar verir.
- **QA/Test Uzmanı & Mimar:** Veri sızıntıları ve prompt injection için test eder; hassas veri
  asla kaçmasın diye tenant izolasyonu, log hijyeni ve no-train veri akışları tasarlar.

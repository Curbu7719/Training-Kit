# Derinlemesine Güvenlik ve Gizlilik: SDLC Genelinde AI Veri Akışlarını Yönetmek

L1'de bir modele prompt gönderdiğinizde kontrolünüzden ne çıktığını, üç risk ailesini (hassas
veri, sızıntılar, shadow AI) ve günlük önlemleri öğrendiniz. L2'de soru *risklerin ne olduğundan*
*AI veri akışlarını bir sistem olarak nasıl yönettiğinize* kayar — çünkü denetçiler, saldırganlar
ve düzenleyiciler, bir geliştiricinin klavyesi ile bir tedarikçinin eğitim seti arasındaki her
boşluğu yoklayacaktır.

**Her şeyi veri sınıflandırması yönlendirir.** Etiketlemediğiniz şeyi koruyamazsınız. Olgun
ekipler veriyi etiketler — public, internal, confidential, regüle (PII/PHI/PCI) — ve **AI
kullanım kurallarını her katmana** bağlar: public parçacıklar herhangi bir onaylı araca
gidebilir; confidential kod bir zero-retention kurumsal araç gerektirir; regüle veri redact
edilir veya hiç gönderilmez. Sınıflandırma, "dikkatli ol"u uygulanabilir bir politikaya
dönüştürür.

**Retention, residency ve eğitim sözleşme şartlarıdır, his değil.** "Zero-retention" ve
"no-train" varsayılmamalı, anlaşmada ve API yapılandırmasında doğrulanmalıdır. Prompt'ların
nerede işlendiğini (**data residency**), ne kadar saklandığını, bir eğitim setine girip
girmediğini ve alt işleyicilerin (sub-processors) bunları görüp görmediğini kontrol edin. *Aynı*
ürünün bir tüketici ücretsiz katmanı ile bir kurumsal katmanı zıt cevaplara sahip olabilir.

**Sızıntı yüzeyleri aşağı akışta çoğalır.** Prompt yalnızca ilk yüzeydir. Hassas veri ayrıca
şunlar yoluyla sızar: **log'lar** (gözlemlenebilirlik araçlarına yazılan prompt'lar ve
tamamlamalar), **cache'ler**, confidential metnin embedding'lerini tutan **vector store'lar**,
getirilen içeriği bir dışarı sızdırma talimatına dönüştüren **prompt injection**, model
**memorisation**'ı ve zayıf izolasyonun bir kiracının verisini başkasının oturumunda yüzeye
çıkardığı **multi-tenant** sızıntısı. Her yüzeyin kendi kontrolü gerekir; prompt'u redact etmek
sızdıran bir log için hiçbir şey yapmaz.

**Karşı tasarlanacak başarısızlık modları.**

- **Redaction tiyatrosu:** yapılandırılmamış PII'yi kaçıran ve sahte güven veren bir regex.
- **Yeraltına itilen shadow AI:** onaylı bir alternatifi olmayan topyekûn yasak, böylece kullanım
  daha kötü araçlarla ve log olmadan görünmez şekilde devam eder.
- **Log/gözlemlenebilirlik sızıntısı:** prompt'ların ve çıktıların, daha geniş bir kitlenin — veya
  bir ihlalin — okuyabileceği bir log yığınına akması.
- **Tenant izolasyon boşluğu:** paylaşılan bağlam veya embedding'lerin bir müşterinin verisinin
  başka birine ulaşmasına izin vermesi.

**Programı zaman içinde işletmek.** Yönetişim süreklidir: onaylı araç listesini tutun, şartlar
değiştiğinde tedarikçi şartlarını denetleyin, ağ ve harcama sinyalleri yoluyla shadow AI'ı
izleyin, prompt'ları ve çıktıları secret'lar için tarayın ve prompt injection ile tenant
izolasyonunu red-team edin. AI etkileşimlerini (redaction ile) log'layın, böylece kötüye kullanım
kendisi yeni bir sızıntı yüzeyi olmadan tespit edilebilir.

## Her rol bunu nasıl kullanır

- **Geliştirici/Mühendis:** Sınıflandırmayı prompt anında uygular, redaction ve secret taramayı
  araçlara entegre eder ve prompt'lar/çıktıların düz log'lardan ve paylaşılan cache'lerden
  dışlandığından emin olur.
- **İş Analisti:** Her veri sınıfını düzenleyici yükümlülüğüne (residency, retention sınırları,
  rıza) eşler ve hangi sınıfların hangi araç katmanına ulaşabileceğini tanımlar.
- **PM/Ürün Sahibi:** Tedarikçi durum tespitine ve onaylı araç listesine sahip çıkar, geliştirici
  hızını retention/residency riskine karşı dengeler ve inceleme geçitlerinin nerede zorunlu
  olduğuna karar verir.
- **QA/Test Uzmanı & Mimar:** Prompt injection'ı, log sızıntısını ve multi-tenant izolasyonunu
  red-team eder; no-train/zero-retention iddialarının uçtan uca geçerli olduğunu doğrular; bunu
  kanıtlayan denetlenebilir log'lamayı tasarlar.

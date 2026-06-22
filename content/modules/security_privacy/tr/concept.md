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
olmadığı konusunda eğitim sunun. Tam da bu yüzden her rol için tek bir **kurum içi AI Agent platformu** açıyoruz: no-train ve günlükleme yerleşik, onaylı tek bir çalışma yeri — böylece gölge-AI riski olmadan AI’ın yardımını alırsınız.

**SDLC genelinde pratik önlemler.** Veriyi sınıflandırın ki insanlar neyin hassas olduğunu
bilsin; göndermeden önce redaction yapın ve secret'lar için tarayın; bir **onaylı araç listesi**
kullanın; **no-train / zero-retention** ayarlarını açın; prompt'ları ve AI çıktısını düz
log'lardan uzak tutun; ve AI çıktısı üretime ulaşmadan önce **inceleme geçitleri** (review
gates) ekleyin.

## Her rol bunu nasıl kullanır

- **Security Engineer:** Prompt göndermeden önce PII ve secret'ları redact eder, veri sızıntıları ve prompt injection için test eder ve prompt'ları ile model çıktısını paylaşılan log'lardan uzak tutar.
- **Developer:** Yalnızca zero-retention etkin onaylı araçları kullanır ve redaction/secret taramayı iş akışına bağlar.
- **Governance:** Hangi verinin hassas veya regüle olduğunu sınıflandırır, onaylı araç listesine ve politikaya sahip çıkar ve hangi araçların onaylı olduğuna ve nerede inceleme geçidi gerektiğine karar verir.
- **Enterprise Architect:** Hassas veri asla kaçmasın diye tenant izolasyonu, log hijyeni ve no-train veri akışları tasarlar.

# Uygulamalı Örnek: Müşteri E-postalarıyla Dolu Bir Üretim Stack Trace'i

**Aşama: üretimde hata ayıklama (debugging).** Bir geliştirici, Maya, nöbettedir. Bir checkout
servisi 500 hataları veriyor ve hata izleyici uzun bir Java stack trace'i gösteriyor. Hızlı
yardım almak için, tüm trace'i evde kullandığı bir tüketici AI chatbot'una — hiçbir şirket
anlaşması ve retention kontrolü olmayan birine — yapıştırmak üzeredir.

**Trace'in gerçekte içerdiği şey.** Yukarı kaydırınca, stack trace başarısız olan isteğin
payload'ını içeriyor: üç gerçek **müşteri e-posta adresi**, **tam bir fatura adresi** ve —
log'lanmış bir config nesnesine gömülü — canlı bir **ödeme ağ geçidi API anahtarı**. Bunu
yapıştırmak, kişisel veriyi ve bir üretim secret'ını, ücretsiz katman şartları altında
**prompt'ları saklayan ve eğitim için kullanabilen** harici bir sağlayıcıya gönderir. Müşteri
verisi ayrıca başka bir bölgedeki sunuculara inebilir ve şirketin **data residency**
taahhüdünü ihlal edebilir.

**Daha güvenli yol.** Maya durur ve minimizasyon uygular:

- **Önce redaction.** Üç e-postayı `user1@example.com` ile değiştirir, fatura adresini bir
  yer tutucuyla değiştirir ve API anahtarını tamamen kaldırır. Bu değerlerin hiçbiri bir
  null-pointer exception'ı teşhis etmek için gerekli değildir.
- **Onaylı bir araç kullan.** Kişisel chatbot'u yerine, **zero-retention** ve **no-train**
  garantisiyle bir kurumsal anlaşma altında çalışan şirketin onaylı AI asistanını kullanır.
- **Log'lardan uzak tut.** API anahtarının en başta hiç log'lanmaması gerektiğini not eder ve
  secret'ları log çıktısından temizlemek için bir ticket açar.

**Sonuç.** Maya aynı hata ayıklama yardımını alır — modelin yalnızca exception türüne ve satır
numaralarına ihtiyacı vardı — tek bir müşterinin PII'sini veya bir üretim kimlik bilgisini
sızdırmadan. Önemli olan düzeltme model değildi; **göndermemeyi seçtiği şeydi**.

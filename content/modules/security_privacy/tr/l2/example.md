# Uygulamalı Örnek: Redaction'dan Sağ Çıkan Sızıntı

**Aşama: bir AI destek-asistanı özelliği geliştirmek.** Bir ekip, ilgili ticket'ları bir **vector
store**'dan getirip bir modele besleyerek destek sorularını yanıtlayan dahili bir asistan
yayınlar. Gizlilik çalışmalarıyla gurur duyuyorlar: bir temsilcinin yazdığı her prompt,
sağlayıcıya ulaşmadan önce e-postaları ve kredi kartı numaralarını çıkaran bir **redaction**
filtresinden geçirilir. Müşteri PII'sinin kontrol altında olduğuna inanıyorlar. Değil.

**Sızıntı 1 — vector store.** Getirme özelliğini oluşturmak için, **tüm ticket geçmişini** ham ve
redact edilmemiş halde bir vector veritabanına embed ettiler. Embedding'ler gerçek müşteri
isimlerini, adreslerini ve hesap ayrıntılarını kodlar. Yazılan prompt'u redact etmek hiçbir şey
yapmaz: hassas veri yukarı akışta alındı ve artık store'u sorgulayabilen herkes tarafından
getirilebilir — izolasyon zayıfsa tenant sınırı boyunca dahi.

**Sızıntı 2 — log'lar.** Hata ayıklama için ekip, her tam prompt'u *ve* model tamamlamasını
paylaşılan gözlemlenebilirlik platformlarına log'lar. Redaction filtresi temsilcinin yazdığı şeyde
çalışır, ancak **getirilen ticket metni** — vector store'dan çekilen redact edilmemiş PII —
redaction'dan *sonra* prompt'a eklenir ve doğrudan log'lara, geniş bir dahili kitle tarafından
okunabilir şekilde akar.

**Sızıntı 3 — tedarikçi şartları.** Zero-retention varsaydılar. Sözleşme aslında sağlayıcıya
"kötüye kullanım izleme" için 30 günlük bir retention penceresi tanıyor ve işleme, data-residency
taahhütlerini ihlal eden bir bölgede gerçekleşiyor. Kimse anlaşmayı doğrulamadı.

**Düzeltme.**

- **Alımda (ingestion) sınıflandırın ve redact edin**, yalnızca prompt'ta değil — PII'yi vector
  store'a girmeden önce minimize edin ve embedding'leri tenant başına izole edin.
- **Prompt'ları ve tamamlamaları düz log'lardan dışlayın** veya log'lamadan önce *birleştirilmiş*
  prompt'u (getirilen bağlam dahil) redact edin.
- **Sözleşmeyi doğrulayın**: zero-retention'ı, residency'yi ve no-train'i yazılı olarak ve API
  yapılandırmasında onaylayın.

**Çıkarılan ders.** Gizlilik yalnızca klavyede değil, verinin aktığı her yerde yaşar. Vector
store, log'lar ve sözleşme sızdırırken prompt'u redact etmek **redaction tiyatrosudur** — her
yüzeyin kendi kontrolü gerekir.

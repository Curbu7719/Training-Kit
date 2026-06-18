# İpuçları — Güvenlik ve Gizlilik (L2)

## Temel fikrin alternatif ifadeleri

- AI gizliliğini yönetmek, her veri akışını bir geliştiricinin klavyesinden bir tedarikçinin
  eğitim setine kadar izlemek, kontrolleri veri sınıflandırmasına bağlamak ve retention,
  residency ile no-train'i varsayım yerine sözleşme şartı olarak doğrulamak demektir.
- Gizlilik verinin aktığı her yerde yaşar — prompt'lar, log'lar, cache'ler, vector store'lar,
  multi-tenant bağlam — bu yüzden yalnızca yazılan prompt'u redact etmek, diğer yüzeyler sızdırırsa
  "redaction tiyatrosu"dur.
- Olgun programlar veriyi sınıflandırır, AI kullanım kurallarını her katmana bağlar, tedarikçi
  şartlarını doğrular, her sızıntı yüzeyini kontrol eder ve sürekli izleme ile red-teaming yürütür.

## İpucu yığını

- **H1 (dürtme):** Yazılan prompt nadiren hassas verinin gittiği tek yerdir. Başka nereye akar —
  ne embed edilir, cache'lenir, log'lanır veya tenant'lar arasında paylaşılır?
- **H2 (yapısal):** Yüzeyleri ayırın: alım (vector store / embedding'ler), birleştirilmiş prompt
  (redaction'dan *sonra* eklenen getirilen bağlam), log'lar/gözlemlenebilirlik yığını ve tedarikçi
  sözleşmesi (retention, residency, eğitim). Her birinin kendi kontrolü gerekir.
- **H3 (cevaba yakın):** Vector store ham PII tutarken, log'lar birleştirilmiş prompt'u
  yakalarken ve sözleşme 30 günlük retention'a izin verirken yazılan prompt'u redact etmek
  redaction tiyatrosudur. Alımda sınıflandırın ve redact edin, birleştirilmiş prompt'ları düz
  log'lardan dışlayın ve sözleşmeyi doğrulayın.

## SSS

**S: Her prompt'u redact ediyoruz. PII kontrol altında değil mi?**
Yalnızca prompt tek akışsa. Bir vector store'daki embedding'ler, redaction'dan sonra eklenen
getirilen bağlam ve log'lara kopyalanan prompt'lar, hepsi ham PII'yi sızdırabilen ayrı yüzeylerdir.

**S: Veri sınıflandırması neden önce gelir?**
Çünkü ifade edemediğiniz bir kuralı uygulayamazsınız. Veriyi etiketlemek (public, confidential,
regüle), muhakemeye güvenmek yerine her katmana belirli AI kullanım kurallarını bağlamanıza izin
verir.

**S: Bir "zero-retention" iddiasına gerçekte nasıl güvenirim?**
Bunu imzalı anlaşmada ve API yapılandırmasında doğrulayın, residency için işleme bölgesini kontrol
edin ve alt işleyicileri ile herhangi bir kötüye kullanım izleme retention penceresini onaylayın.
Aynı ürünün ücretsiz ve kurumsal katmanları çoğu zaman farklıdır.

**S: Multi-tenant veri sızıntısı nedir?**
Zayıf izolasyonun bir müşterinin verisinin — paylaşılan bağlam, cache'ler veya embedding'ler
yoluyla — başka bir müşterinin oturumunda yüzeye çıkmasına izin vermesi. Tenant kapsamlı izolasyon
ve tenant başına store'lar bunu önler.

# İpuçları — Güvenlik ve Gizlilik

## Temel fikrin alternatif ifadeleri

- Bir AI sağlayıcısına gönderdiğiniz her prompt, kontrolünüzden çıkan veridir — güvenlik ve
  gizlilik, ne gönderdiğinizi, nereye gittiğini, saklanıp saklanmadığını veya eğitimde
  kullanılıp kullanılmadığını bilmek ve PII'yi, secret'ları ve tescilli kodu bunun dışında
  tutmakla ilgilidir.
- Üç büyük risk: hassas veriyi (PII, kaynak kodu) bir sağlayıcıya göndermek, sızıntılar (prompt
  injection, yapıştırılan secret'lar, log'lar, memorisation) ve shadow AI (onaylanmamış araçlar).
- Önlemler pratik SDLC alışkanlıklarıdır: veriyi sınıflandırın, göndermeden önce redact edin ve
  tarayın, zero-retention/no-train ile onaylı araçlar kullanın, AI metnini log'lardan uzak tutun
  ve çıktı gönderilmeden önce inceleme geçitleri ekleyin.

## İpucu yığını

- **H1 (dürtme):** Yapıştırmadan önce sorun: bu metnin *içinde* gerçekte ne var? Bir stack
  trace, bir log veya bir veritabanı satırı çoğu zaman göndermeyi istemediğiniz e-postalar,
  adresler veya bir API anahtarı taşır.
- **H2 (yapısal):** Sorunu ayırın: *ne gönderdiğiniz* (PII ve secret'ları minimize edin ve
  redact edin), *nereye gittiği* (onaylı araç, zero-retention, data residency) ve *ne ürettiği*
  (çıktıyı düz log'lardan uzak tutun; gönderilmeden önce inceleyin).
- **H3 (cevaba yakın):** Düzeltme nadiren modeldir — **göndermemeyi** seçtiğiniz şeydir. Prompt
  göndermeden önce redact edin, rastgele bir chatbot yerine onaylı bir zero-retention aracı
  kullanın ve secret'ların veya PII'nin asla bir tedarikçinin log'larına ya da eğitim setine
  ulaşmasına izin vermeyin.

## SSS

**S: AI'ın verdiği cevap doğruysa, ne yapıştırdığım neden önemli?**
Çünkü prompt'un kendisi sızıntıdır. PII veya bir secret makinenizden çıktığında, cevaptan
bağımsız olarak saklanabilir, log'lanabilir, eğitim için kullanılabilir veya başka bir bölgede
depolanabilir.

**S: "Shadow AI" nedir?**
Geliştiricilerin veya ekiplerin onaylanmamış AI araçları kullanması — kod veya veriyi, hiçbir
kurumsal anlaşması, retention kontrolü ve politikası olmayan tüketici chatbot'larına
yapıştırması. AI'ı yasaklamak onu gizler; onaylı araçlar sunmak onu gün ışığına çıkarır.

**S: Zero-retention / no-train gerçekte ne anlama gelir?**
Sağlayıcının, işledikten sonra prompt'larınızı saklamadığı ve gelecekteki modelleri eğitmek
için kullanmadığı sözleşmesel veya yapılandırma ayarı. Herhangi bir iş verisini bir modele
göndermek için temel şarttır.

**S: Hızlı bir hata ayıklama sorusu için redaction aşırıya kaçmak değil mi?**
Hayır — redaction ucuzdur ve veri genellikle gerekli değildir. Bir exception türü ve satır
numaraları hatayı teşhis eder; müşterinin e-postası ve API anahtarı riskten başka bir şey katmaz.

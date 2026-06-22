# AI'ı Güvenle Kullanmak — Herkes İçin

AI'ı iyi kullanmak için onu inşa etmen gerekmez. Çoğumuz günlük işte şirketin AI araçlarını ve agent'larını *kullanacağız* — taslak yazmak, özetlemek, yanıtlamak, daha hızlı karar vermek. Bu modül, o yardımı bir güvenlik, gizlilik veya kalite sorunu yaratmadan almanı sağlayan kısa, ortak alışkanlıklar kümesidir. Kod gerekmez.

**1. AI kendinden emin biçimde yanılabilir.** Model olası metni tahmin eder; gerçeği "bilmez". Doğru görünen ama olmayan bir olgu, politika, sayı veya kaynak uydurabilir (**halüsinasyon**) ve yalnızca eğitim tarihine kadarını bilir (**bilgi kesim tarihi**). Bu yüzden her cevabı son söz değil, **kontrol edilecek bir taslak** olarak gör. Üzerine işlem yaptığın an o senindir — AI'ın değil.

**2. Gönderdiğin şey elinden çıkar.** Bir prompt'a yapıştırdığın her şey araca gider. Sır'ları, parolaları, müşteri kişisel verisini (**PII** — bir kişiyi tanımlayan veri) veya gizli kodu onaylanmamış bir araca asla yapıştırma. **Şirketin onaylı AI platformunu** kullan, gereken en az veriyi gönder ve önce hassas ayrıntıları çıkar. Kendine sor: "Bu, bir tedarikçinin loglarında belirse rahat olur muyum?" Olmazsan, yapıştırma.

**3. Önem kazanmadan doğrula.** Düşük riskli yardımda (kaba taslak, beyin fırtınası) hızlı bir göz yeterli. Yayına giden, karar veren veya müşteriye ulaşan her şey için **AI çıktısını güvenilir bir kaynakla karşılaştır** ve bir insanın onaylamasını sağla. Kontrol miktarını riske göre ayarla.

**4. Dış içerik gizli talimat taşıyabilir.** AI bir belgeyi, e-postayı veya talebi (ticket) özetlerken, o metin onu ele geçirmeye çalışan gizli talimatlar içerebilir (**prompt injection**). Senin yazmadığın bir içerikten gelen bir sonuca göre işlem yaparken dikkatli ol — eylemin gerçekten senin istediğin bir eylem olduğunu doğrula.

**5. Ne zaman yükselteceğini bil.** Yüksek riskli, regüle veya geri alınması zor kararlar (para, işe alım, hukuk, production, kişisel veri) tek başına bir AI'ı değil, insan yargısını ve doğru onayları gerektirir. Şüphedeysen güvenliğe veya governance'a sor.

## Her rol bunu nasıl kullanır

- **Herkes:** AI çıktısını doğrulanacak bir taslak olarak görür, hassas veriyi prompt'lardan uzak tutar ve yalnızca onaylı platformu kullanır.
- **Project Manager:** AI'ın taslakladığı planları, güncellemeleri ve story'leri karar olarak paylaşmadan önce gerçek olgularla karşılaştırır.
- **Portfolio Manager:** Analizi hızlandırmak için AI kullanır ama sayıları ve iddiaları bir bütçeyi ya da yol haritasını beslemeden önce doğrular.
- **Governance:** Kuralları koyar ve örnekler — onaylı araçlar, hangi verinin gönderilebileceği ve ne zaman insan onayı gerektiği.
- **Designer:** AI taslaklarını ve içeriğini bir başlangıç noktası olarak görür; bir kullanıcıya ulaşmadan önce olguları ve tonu kontrol eder.
- **Release Manager:** AI'ın önerdiği bir değişikliğin, normal insan incelemesi ve onayı olmadan yayına çıkmasına asla izin vermez.

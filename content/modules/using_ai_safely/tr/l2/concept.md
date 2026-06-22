# AI'ı İyi Kullanmak: Doğrula, Yargıla, Yükselt

L1'de temel alışkanlıkları öğrendin: AI kendinden emin yanılabilir, gönderdiğin şey elinden çıkar, önem kazanmadan doğrula, gizli talimatlara dikkat et ve yüksek riskli kararları yükselt. L2'de yargıyı keskinleştiriyoruz — *ne kadar* kontrol edeceğin, yanlış bir cevabı *nasıl* yakalayacağın ve *neyi* güvenle girebileceğin.

**Doğrulamayı riske göre ayarla.** Her şey aynı kontrolü gerektirmez. Tek kullanımlık bir beyin fırtınası neredeyse hiç gerektirmez. Bir yönetim sunumundaki sayı, müşteriye dönük bir cevap ya da bir eylemi tetikleyen her şey güvenilir bir kaynakla gerçek bir kontrol ister — geri alınamaz veya regüle kararlar için ise ikinci bir insan. Önce riski belirle, sonra kontrolü seç.

**Yanlış cevabın belirtilerini yakala.** Halüsinasyonlar çoğu zaman gerçekten *daha* kendinden emin ve spesifik görünür: kaynağı olmayan, kulağa kesin gelen bir istatistik, uydurma bir atıf veya bağlantı, var olmayan bir API ya da politika, veya modelin bilgi kesim tarihinden sonrasına ait detaylar. Eminlik doğruluk değildir. Önemliyse ve bir kaynağa izini süremiyorsan, doğrulanmamış kabul et.

**Yapıştırdığını sınıflandır.** Bir şey göndermeden önce hangi katman olduğunu sor: **public** (gönderilebilir), **internal** (yalnızca onaylı platform), **confidential / regulated** — PII, secret'lar, müşteri verisi, sağlık veya finansal kayıtlar (maskele ya da gönderme). Etiket eylemi belirler, böylece o anın telaşında karar vermek zorunda kalmazsın.

**Asıl ince risk dolaylı talimatlardır.** "Sadece belgeyi özetledi" ile "üzerine işlem yapmak güvenli" aynı şey değildir. AI senin çektiğin bir içeriği okuduğunda — bir ticket, bir web sayfası, bir PDF, bir e-posta — o içerik AI'ın senin talimatınmış gibi izlediği talimatlar taşıyabilir. AI'ın dış içerikten yola çıkarak önerdiği her *eylemi*, gerçekten istediğini doğrulayana dek şüpheli gör.

**Sorumlu kal; bilerek yükselt.** AI'ın yardımının ürettiği şeyden insan sorumlu kalır. Bir incelemede "AI öyle dedi" bir savunma değildir. Yükseltme yolunu bil: bir iş para, insanlar, hukuki risk, production veya regüle veriye dokunduğunda, AI'ın karar vermesine izin vermek yerine doğru sahibi (güvenlik, governance, yöneticin) devreye al.

## Her rol bunu nasıl kullanır

- **Herkes:** Kontrolü riske göre ölçekler, kendinden-emin-ama-yanlış çıktıyı tanır ve yapıştırmadan önce veriyi sınıflandırır.
- **Project Manager:** Bir kararı besleyen AI iddialarını doğrular ve kapsam, maliyet veya riske dokunan her şeyi taslağa göre işlem yapmak yerine yükseltir.
- **Portfolio Manager:** AI'ın verdiği sayıların izini, bir bütçeyi ya da yol haritasını şekillendirmeden önce bir kaynağa kadar sürer.
- **Governance:** Veri katmanlarını ve yükseltme yollarını tanımlar ve yüksek riskli AI kullanımının insan onayı taşıdığını denetler.
- **Release Manager:** İnsan incelemesi ve onayını kapı olarak tutar; AI önerilerini girdi olarak görür, asla karar olarak değil.

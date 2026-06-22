# AI Risk ve Governance

AI benimsemek değer yaratır, ancak bir kuruluşun para, güven veya yasal konum kaybetmesi için
yeni yollar da açar. **AI governance**, bir kuruluşun AI'yi bilinçli biçimde — yasalar,
sözleşmeler ve işletmenin kabul etmeye razı olduğu risk sınırları içinde — kullanması için
yerine koyduğu politikalar, kontroller ve gözetim bütünüdür. Governance ekipleri yavaşlatmakla
ilgili değildir; riskleri görünür kılmak ve her birine bir sahip atamakla ilgilidir.

**Başlıca riskler.** Bunları, her biri kendisini yanıtlayan bir kontrole sahip kategoriler
olarak düşünün:

- **Veri gizliliği / PII.** Personel, müşteri adlarını, sağlık verilerini veya başka kişisel
  verileri, onları saklayabilecek ya da üzerinde eğitim yapabilecek bir araca yapıştırır ve
  gizlilik yasasını (örn. GDPR/KVKK) ihlal eder.
- **IP ve lisanslama.** Eğitim verisi hakları ve çıktı sahipliği belirsizdir. Modelin
  döndürdüğü kod veya metin lisanslı materyale benzeyebilir ve sözleşmeniz **çıktının
  sahibinin kim olduğunu** ya da verinizin yeniden kullanılıp kullanılamayacağını açıkça
  belirtmeyebilir.
- **Düzenleyici compliance.** Sektör kuralları (finans, sağlık, işe alım) açıklanabilir,
  denetlenebilir kararlar gerektirebilir — kara kutu bir model sizi uyumsuz duruma düşürebilir.
- **Güvenlik ve veri sızıntısı.** Harici bir servise gönderilen gizli strateji, kaynak kodu
  veya kimlik bilgileri sızabilir, günlüklenebilir veya bir ihlalde açığa çıkabilir.
- **Güvenilirlik.** Modeller halüsinasyon görür ve deterministik değildir, bu yüzden
  kontrol edilmeyen bir çıktı kendinden emin biçimde yanlış olabilir.
- **Bias ve responsible AI.** Modeller eğitim verisindeki bias'ı yeniden üretebilir; yasal ve
  itibari bedel taşıyan adaletsiz ya da ayrımcı sonuçlar doğurabilir.

**Governance kontrolleri.** Riskler ortadan kaldırılmaz, katmanlı kontrollerle yönetilir:

- **Kabul edilebilir kullanım politikası** — AI'nin hangi veri ve görevler için
  kullanılabileceğine dair yazılı kurallar.
- **Onay geçitleri** — yüksek etkili veya müşteriye dönük AI kullanımından önce onay.
- **İnsan gözetimi** — bir kişi, üzerinde işlem yapılmadan önce AI çıktısını inceler
  (insan-döngüde).
- **Audit ve günlükleme** — hesap verebilirlik için prompt'ların, çıktıların ve kararların
  bir kaydı.
- **AI kullanım kaydı (register)** — AI'nin nerede, kim tarafından, hangi veri ve risk
  katmanıyla kullanıldığının envanteri, böylece hiçbir şey görünmeden çalışmaz.

Hiçbir tek kontrol her riski kapsamaz; governance her riski onu sahiplenen kontrolle eşler ve
teknoloji ile kurallar evrildikçe bütünü gözden geçirir.

## Her rol bunu nasıl kullanır

- **Governance:** Kabul edilebilir kullanım politikasının ve AI kullanım kaydının sahibidir, risk katmanlarını belirler ve hangi kullanımların yayına çıkmadan önce onay geçidi ya da insan gözetimi gerektirdiğine karar verir.
- **Security Engineer:** Teknik kontrolleri uygular — erişim kapsamlandırma, PII redaksiyonu, secret yönetimi — ve gizli veriyle kimlik bilgilerini harici araçların dışında tutar.
- **Project Manager:** Projedeki her AI kullanımını dokunduğu veriye ve geçerli düzenlemelere eşler ve governance kapılarını proje riski olarak takip eder.
- **Developer:** Günlükleme, erişim kapsamlandırma ve redaksiyonu sisteme bağlar; böylece politika kodda gerçekten uygulanır.
- **Enterprise Architect:** Audit izini ve gözetim noktalarını tasarlar; böylece AI kararları açıklanabilir ve hesap verebilir kalır.

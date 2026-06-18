# Derinlemesine AI Risk ve Governance: Bir Governance Programını İşletmek

L1'de AI risk kategorilerini ve onları yanıtlayan kontrolleri öğrendiniz. L2'de soru, *hangi
kontrollerin var olduğundan* *governance'ı bir program olarak nasıl işlettiğinize* kayar —
birçok AI kullanımı arasında ölçeklenen, denetçileri tatmin eden ve düzenleme ile teknoloji
ilerledikçe uyum sağlayan bir program.

**Tek bir kural değil, risk katmanlama.** Her AI kullanımını aynı şekilde yönetmek, ya düşük
riskli denemeleri aşırı engeller ya da yüksek riskli olanları yetersiz korur. Olgun programlar
her kullanımı **katmanlar**: dahili bir beyin fırtınası yardımcısı düşük katmandır ve az
geçitlemeye ihtiyaç duyar; müşteriye dönük veya düzenlemeye tabi kararlar (kredi, işe alım,
sağlık) veren bir araç yüksek katmandır ve onay geçitleri, insan gözetimi, bias testi ve bir
audit izi gerektirir. **AI kullanım kaydı** katmanı kaydeder, böylece kontrol yoğunluğu maruz
kalmayla eşleşir.

**Trade-off üçgeni.** Her governance kararı üç rakip iyiyi dengeler: **risk azaltma** (veriyi
koru, uyumlu kal, zararı önle), **benimseme hızı** (ekipleri süreçte boğma — ağır geçitleme,
personelin araçları kayıt dışı kullandığı "gölge AI"ya yol açar) ve **maliyet** (her inceleme,
günlük ve sözleşme müzakeresinin bir bedeli vardır). Governance, bu trade-off'u *açıkça ve
katman başına* yapma, sonra yeniden gözden geçirme eylemidir.

**Zor sahiplik soruları nerede yaşar.** Gerçek programlarda iki konu tekrar eder:

- **IP ve lisanslama.** Model çıktısının sahibinin kim olduğu sözleşmeye ve yargı alanına
  bağlıdır; bazı çıktılar hiç telif hakkına tabi olmayabilir ve eğitim verisi hakları tartışmalı
  olabilir. Kontrol, müzakere edilmiş bir sözleşme artı hangi aracın hangi ürünü ürettiğinin bir
  kaydıdır.
- **Hesap verebilirlik.** AI etkili bir karar itiraz edildiğinde, *kimin, hangi temelde ve hangi
  gözetimle karar verdiğini* göstermeniz gerekir. Bu yüzden audit günlükleme ve insan-döngüde
  kaydı yüksek katmanlı kullanımlar için isteğe bağlı değildir.

**Karşı tasarım yapılacak başarısızlık biçimleri.**

- **Gölge AI:** personelin onu atladığı kadar ağır governance, böylece riskli kullanım
  kaydedilmeden olur — kayıt eskir ve maruz kalma görünmez hale gelir.
- **Lastik-damga gözetim:** bir insanın gerçek bir inceleme olmadan çıktıyı "incelemesi", böylece
  insan-döngüde kontrolü yalnızca kâğıt üzerinde var olur.
- **Tek seferlik geçit olarak governance:** bir aracı lansmanda onaylamak ama satıcı, veri ya da
  yasa değiştikçe onu asla yeniden kontrol etmemek.

**Zaman içinde işletmek.** Bir governance programı süreklidir: yeni AI kullanımlarını izleyin,
kaydı güncel tutun, kullanımlar değiştikçe yeniden katmanlayın, düzenleyici güncellemeleri (EU
AI Act, sektör kuralları, GDPR/KVKK) takip edin ve olaylarla atlatılan tehlikeleri politikaya
geri besleyin. Amaç, her AI kullanımının görünür, sahiplenilmiş ve riskine orantılı olduğu yaşayan
bir sistemdir.

## Her rol bunu nasıl kullanır

- **Geliştirici/Mühendis:** Governance'ı ölçekte uygulanabilir kılan kontrolleri kurar —
  redaksiyon, erişim kapsamlandırma, kurcalama-belirgin audit günlükleri — ve yeni AI
  kullanımlarını gölgeye gitmek yerine otomatik olarak kayıtta görünecek şekilde enstrümante eder.
- **İş Analisti:** Risk-katmanlama ölçütlerini tanımlar, her kullanımı geçerli düzenlemeye eşler
  ve kullanımlar evrildikçe kaydı ile risk sınıflandırmalarını güncel tutar.
- **PM/Ürün Sahibi:** Katman başına risk-hız-maliyet trade-off'unun sahibidir, onay geçitlerinin
  ve insan gözetiminin nerede gerekçeli olduğuna karar verir ve sahiplenilmiş yolu geçici çözümden
  daha hızlı yaparak gölge AI'yı önler.
- **QA & Mimar:** Bias ve sızıntı için red-team yapar, gözetimin lastik-damga yerine gerçek
  olduğunu doğrular ve AI etkili kararların itiraz altında açıklanabilir ve savunulabilir kalması
  için audit izini tasarlar.

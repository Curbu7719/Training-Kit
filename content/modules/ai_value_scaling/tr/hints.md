# İpuçları — AI Değeri ve Ölçeklendirme

## Temel fikrin alternatif ifadeleri

- AI değeri, sistemin ürettiği iş sonucudur (zaman, para, risk, kalite) — AI kullanması gerçeği
  değil; ölçeklendirme ise kanıtlanmış bir pilottan geniş kullanıma giden disiplinli yoldur.
- Gerçek bir değer metriği bir iş sonucuna bağlanır; bir vanity metriği (çalıştırılan
  prompt'lar, ham doğruluk) iyi görünür ama bağlanmaz. Daima sorun: bu sayı iki katına çıksa,
  iş daha mı iyi olurdu?
- Yaşam döngüsü pilot → production → ölçeklendirmedir ve ölçeklendir-ya-da-durdur kararı önceden
  anlaşılmış bir değer eşiğine, gerçek adoption'a ve sürdürülebilir maliyete dayanır — zayıf bir
  pilot'u durdurmak bir kazançtır.

## İpucu yığını

- **H1 (dürtme):** "Etkileyici görünür"ü "işi ileri taşır"dan ayırın. Üretilen taslaklar
  birincisidir; temsilcilerin gerçekten kabul ettiği, tasarruf edilen işlem süresi ikincisidir.
- **H2 (yapısal):** Yaşam döngüsünü amaca göre sıralayın: başarı metriği olan küçük, süreyle
  sınırlı bir test (pilot), sonra izlenen, sahipli bir sistem (production), sonra daha fazla
  kullanıcıya/senaryoya genişletme (ölçeklendirme). Ölçeklendir ya da durdur kararını pilot ile
  production *arasında* verin.
- **H3 (cevaba yakın):** Yalnızca değer metriği önceden anlaşılmış eşiğini geçtiğinde, adoption
  gerçek olduğunda ve maliyet sürdürülebilir olduğunda ölçeklendirin. Bunlar başarısız olursa,
  pilot'u durdurmak bütçe serbest bırakır — bu bir başarısızlık değil, başarılı bir sonuçtur.

## SSS

**S: Yüksek model doğruluğu değerin kanıtı değil midir?**
Hayır. Doğruluk, bir sonuca bağlanmadıkça bir vanity metriğidir. Kimsenin kullanmadığı veya hiç
zaman tasarrufu sağlamayan %99 doğru bir model sıfır iş değeri üretir. Modeli değil, sonucu
ölçün.

**S: Bir pilot'u durdurmak neden iyi bir sonuç olsun?**
Çünkü bir pilot bir deneydir. Değeri kanıtlamamış birini durdurmak, gerçekten işe yarayan
bahisler için bütçe ve dikkat serbest bırakır. Çoğu pilot mezun olmamalı — ucuza önce pilot
yapmanın amacı budur.

**S: İnşa ettik ve çalışıyor — neden kimse değer almıyor?**
Muhtemelen bir adoption boşluğu. Kimsenin kullanmadığı teknoloji sıfır değer yaratır. Değişim
yönetimi — eğitim, güven, net iş akışları — çalışan bir sistemi gerçekleşmiş değere dönüştüren
şeydir. Yalnızca erişilebilirliği değil, aktif ve tekrar eden kullanıcıları ölçün.

**S: Bir pilot ne zaman ölçeklendirmeye hazırdır?**
Değer metriği, pilottan *önce* anlaştığınız eşiği geçtiğinde, adoption gerçek olduğunda ve daha
yüksek hacimde çalıştırma maliyeti sağladığı faydanın altında kaldığında.

# İpuçları — AI Risk ve Governance (L2)

## Temel fikrin alternatif ifadeleri

- Governance'ı tek seferlik bir lansman geçidi olarak değil, sürekli bir program olarak işletin:
  her AI kullanımını katmanlayın, kontrol yoğunluğunu katmana eşleyin ve model, veri ya da yasa
  değiştiğinde yeniden inceleyin.
- Her governance kararı risk azaltma, benimseme hızı ve maliyet arasında trade-off yapar — çok
  ağır geçitlerseniz "gölge AI" (kaydedilmeyen kullanım) elde edersiniz; çok az geçitlerseniz
  yüksek katmanlı risk sızar.
- Yüksek katmanlı, düzenlemeye tabi kullanımlar için hesap verebilirlik, audit günlükleme ve
  gerçek bir insan-döngüde kaydına dayanır, böylece itiraz edilen bir karar kimin, hangi temelde
  ve hangi gözetimle karar verdiğini gösterebilir.

## İpucu yığını

- **H1 (dürtme):** Kontrolün tek seferlik mi yoksa sürekli mi olduğunu sorun. Asla yeniden
  kontrol edilmeyen bir onay, lansmandan beri değişmiş riski sessizce kapsar.
- **H2 (yapısal):** Başarısızlığı yaşadığı yere göre sıralayın — eski bir katman (değişimde
  yeniden katmanla), eski bir bias testi (zamanla), lastik-damga gözetim (nokta-denetle) veya
  gölge AI (sahiplenilmiş yolu geçici çözümden daha hızlı yap).
- **H3 (cevaba yakın):** Yüksek katmanlı bir kullanım lansmandan sonra kaydığında (yeni model
  sürümü, yeni veri alanları), kök-neden düzeltmesi sürekli governance'tır: yeniden-inceleme
  tetikleyicileri, yinelenen bias testi ve güncel tutulan bir kayıt — her kararın açıklanabilir
  kalması için audit günlüklemeyle.

## SSS

**S: AI kullanımlarını hepsini aynı yönetmek yerine neden katmanlamalı?**
Tekdüze governance, düşük riskli denemeleri aşırı engeller ve yüksek riskli olanları yetersiz
korur. Katmanlama, kontrol yoğunluğunu (onay geçitleri, gözetim, bias testi) kayıtta kaydedilen
gerçek maruz kalmaya eşler.

**S: "Gölge AI" nedir ve neden önemlidir?**
Personelin onaysız AI araçlarını kayıt dışı kullanmasıdır, genellikle resmi governance çok yavaş
olduğu için. Kayıt eskir ve gerçek risk görünmez hale gelir, bu yüzden düzeltme sahiplenilmiş yolu
yalnızca daha katı değil, daha hızlı yapmaktır.

**S: Bir AI modelinin çıktısının sahibi kimdir?**
Sözleşmeye ve yargı alanına bağlıdır; bazı çıktılar hiç telif hakkına tabi olmayabilir. Bu yüzden
çıktı sahipliği ve eğitim hakları, hangi aracın hangi ürünü ürettiğinin bir kaydıyla birlikte
müzakere edilmiş bir satıcı sözleşmesinde çözülür.

**S: Bir AI aracını lansmanda onaylamak yeterli mi?**
Hayır. Satıcılar modelleri günceller, ekipler veri alanları ekler ve düzenlemeler değişir.
Governance bu değişikliklerde yeniden tetiklenmelidir — aksi halde dünün onayı bugünün incelenmemiş
riskini kapsar.

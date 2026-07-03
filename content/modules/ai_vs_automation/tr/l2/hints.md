# İpuçları — Bölmeyi Tasarlamak (L2)

## Ana fikrin farklı ifadeleri

- AI/deterministik bölme bir tasarım kararıdır. Deseni adlandır: çıkar-sonra-doğrula,
  sınıflandır-sonra-yönlendir, önce-deterministik / AI-yedek, ya da öner-sonra-geçit.
- Ölçekte seçim aynı zamanda operasyon seçimidir: her AI çağrısı para harcar ve gecikme ekler,
  o yüzden işi kesin yola it ve modeli gerçekten gereken girdilere sakla.
- İki yarıyı farklı test et: deterministik kısımlar kesin testlerle, AI kısımları değerlendirme
  seti ve eşikle — non-deterministik bir adımda asla tek kesin test değil.

## İpucu yığını

- **H1 (dürtme):** Girdilerin çoğu bilinen bir desene uyup yalnızca bir kısmı dağınıksa, önce
  ucuz kesin yolu çalıştır ve geri kalan için AI'a düş. Sonra AI'ın döndürdüğü her şeyi doğrula.
- **H2 (yapısal):** "Cevabı kim üretir" ile "kim ona göre eyleme geçebilir"i ayır. AI bir taslak
  üretebilir; kesin ya da yüksek riskli her eylemi bir kural ya da bir insan geçitlemeli.
- **H3 (cevaba yakın):** Önce-deterministik, yüksek hacimli trafiğin %95'ini ücretli AI
  çağrısından uzak tutar; AI dağınık %5'i ele alır; bir doğrulayıcı her sonucu kesin ve
  tekrarlanabilir kılar. Bu kombinasyon hem en ucuz hem en güvenlidir.

## SSS

**S: Her şeyi AI'a göndermek daha basit ve tutarlı değil mi?**
Yazması daha basit ama daha ucuz, hızlı ya da güvenli değil. Yüksek hacimde çağrı başına maliyet
ve gecikme birikir ve yine de kesin çıktıları doğrulaman gerekir. Doğrulamalı, önce-deterministik
bir tasarım genelde hem daha ucuz hem daha güvenilirdir.

**S: Bir AI sınıflandırıcıyı sabit bir etiket seti içinde nasıl tutarım?**
Prompt'u/çıktıyı izinli setle sınırla, dönen etiketi kodda o sete karşı doğrula ve cevap
set-dışı ya da düşük-güven olduğunda güvenli bir varsayılana ("Diğer", "insan gerekli") düş.

**S: AI adımını neden her şey gibi birim-test etmeyeyim?**
Çünkü aynı girdi farklı çıktı verebilir; kesin bir birim testi kararsız olur. Temsili bir
değerlendirme seti üzerinde bir oran ölç (doğruluk ya da çıktının doğrulayıcılarını ne sıklıkta
geçtiği) bir eşiğe karşı ve model ya da prompt değişince yeniden çalıştır.

**S: İnsan döngüde nerede kalmalı?**
Yanlış cevabın maliyetli ya da geri döndürülmesi zor olduğu her yerde — ödemeler, müşteriye dönük
kararlar, düzenlemeye tabi her şey. AI taslak yazsın, bir kural ön-filtrelesin, ama yüksek riskli
yolda insan onayını tut.

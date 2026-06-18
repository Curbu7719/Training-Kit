# Çözümlü Örnek: CI'da Bir AI Test Üreticisi için Bir Cascade

Bir ekip, pipeline'larında bir **AI test üreticisi** çalıştırır: her pull request'te değişen
fonksiyonlar için birim testleri önerir. Hacim, organizasyon genelinde **ayda 500.000 değişen
fonksiyon incelemesi**dir. İlk tasarım her fonksiyonu büyük bir modele gönderir.

**Tümü-büyük temel (fonksiyon başına).** Input ~300 token (fonksiyon artı bir prompt),
output ~10 token — herhangi bir test taslaklanmadan önce hızlı bir "test gerekiyor / zaten
kapsanmış" triyaj etiketi. Milyon input başına 5$ ve milyon output başına 15$ ile:

`(300 × 5$ + 10 × 15$) ÷ 1.000.000 = 0,00150$ + 0,00015$ = 0,00165$`

Aylık: `500.000 × 0,00165$ = 825$`. TTFT ortalama ~600 ms — arka plandaki bir CI adımı için
gayet iyi, ama ekip maliyeti kısmak istiyor.

**Bir cascade tasarlamak.** **Milyon input başına 0,30$** ve **milyon output başına 1,20$**
fiyatlı küçük bir model ekliyorlar; bir güven kontrolüyle: küçük modelin triyaj etiketi bir
güven eşiğini geçerse, kabul et; yoksa fonksiyonu büyük modele yükselt.

Bir örneklem üzerinde ölçüldüğünde, küçük model değişen fonksiyonların **%80'ini** (basit
getter'lar, yeniden adlandırmalar, biçimlendirme) güvenle ve doğru biçimde triyaj eder;
kalan **%20** — gerçekten yeni mantık — yükseltilir.

**Küçük modelde fonksiyon başına maliyet:**
`(300 × 0,30$ + 10 × 1,20$) ÷ 1.000.000 = 0,00009$ + 0,000012$ ≈ 0,000102$`

**Fonksiyon başına harmanlanmış maliyet:**
- %80 yalnızca küçük: `0,80 × 0,000102$ = 0,0000816$`
- %20 küçük **ardından** büyük (her iki çağrı): `0,20 × (0,000102$ + 0,00165$) = 0,00035$`
- Toplam ≈ **fonksiyon başına 0,00043$**

Aylık: `500.000 × 0,00043$ ≈ 215$` — **825$'dan** düşüş, kabaca **%74 tasarruf**, gerçek
mantığın zor %20'sindeki kalite korunurken çünkü onlar yine de büyük modele ulaşır.

**Ekibin kontrol ettiği denge noktaları.**

- **Latency:** yükseltilen fonksiyonlar artık *iki* çağrı yapar, kuyruk (tail) latency'lerini
  artırır. Test üretimi asenkron bir CI adımı olduğundan bu kabul edilebilir; etkileşimli bir
  merge-kapısı incelemesi için olmayabilir.
- **Eşik ayarı:** güven çıtasını çok düşük ayarlayın, küçük model test gereken fonksiyonları
  atlar (kalite düşer); çok yüksek ayarlayın, çok fazlası yükselir (tasarruf azalır). Bunu,
  geçmiş PR'lerden etiketlenmiş bir doğrulama kümesine karşı ayarlarlar.
- **Gözlemlenebilirlik:** yükseltme oranını ve katman başına doğruluğu loglarlar, çünkü kod
  karışımı kayarsa — diyelim bolca yeni mantık içeren bir özellik sprint'i — 80/20 ayrımı ve
  tüm maliyet modeli değişir.

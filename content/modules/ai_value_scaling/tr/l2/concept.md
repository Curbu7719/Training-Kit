# Derinlemesine AI Değeri ve Ölçeklendirme: Business Case Oluşturma

L1'de gerçek değeri vanity metriklerinden ayırmayı ve bir yeteneği pilot → production →
ölçeklendirme yaşam döngüsünden geçirip geçitte ölçeklendir ya da durdur kararı vermeyi
öğrendiniz. L2'de soru *hangi aşama*dan *savunulabilir bir business case nasıl oluşturulur ve
ölçeklendirme bir disiplin olarak nasıl işletilir*e kayar — çünkü AI bir demo'nun ötesine
geçtiği an bütçeler, adoption eğrileri ve birim ekonomisi incelenecektir.

**Business case bir sayı değil, bir karşılaştırmadır.** Güvenilir bir case bir **baseline**
(bugünkü maliyet, zaman veya hata oranı), AI'ın ürettiği **beklenen delta** ve onu sunmanın
**toplam maliyetini** — inşa, çalıştırma (inference ve altyapı) ve çoğunlukla göz ardı edilen
gözetim, inceleme ve değişim yönetimi maliyeti — belirtir. Değer, delta eksi bu toplam
maliyettir. On analist-saati tasarruf eden ama haftada sekiz saat insan incelemesi gerektiren
bir aracın case'i, manşetinin önerdiğinden çok daha incedir.

**Öncü ve ardıl göstergeler.** Ardıl metrikler (etkilenen gelir, azaltılan maliyet) değeri
kanıtlar ama geç gelir. Öncü göstergeler — adoption derinliği, taslak kabul oranı, yeni bir
kullanıcı için ilk-değere-süre — ardıl metriğin gerçekleşip gerçekleşmeyeceğini öngörür, böylece
bir dağıtım tıkanmadan önce müdahale edebilirsiniz. Olgun bir program her ikisini de izler ve
ölçeklendir-ya-da-durdur geçidini erken okuyabildiği öncü göstergelere bağlar.

**Ölçekte birim ekonomisi.** Bir pilot'un ekonomisi kullanım büyüdükçe tersine dönebilir:
istek başına inference maliyeti, destek yükü ve uç durum işleme hepsi faydadan daha hızlı
artabilir. Ölçeklendirmeden önce **değer birimi başına maliyeti** (örn. çözülen talep başına
maliyet) modelleyin ve hacim katlandıkça faydanın altında kaldığını doğrulayın — aksi takdirde
ölçeklendirme değer yaratmak yerine yok eder.

**Tasarlarken karşı korunulacak başarısızlık modları.**

- **Pilot araf'ı:** baştan hiçbir geçit veya eşik anlaşılmadığı için asla mezun olmayan veya
  durdurulmayan sonsuz pilotlar — çaba, karar olmadan tükenir.
- **Vanity güdümlü ölçeklendirme:** bir iş sonucuna hiç bağlanmamış, etkileyici görünen kullanım
  sayıları üzerine ölçeklendirme, böylece maliyet büyürken değer büyümez.
- **Ölçekte adoption çöküşü:** sekiz istekli pilot kullanıcısı için işe yarayan bir araç, eğitim,
  güven ve iş akışı uyumu teknolojiyle birlikte ölçeklenmediği için 400 kişide başarısız olur.

**Portföyü işletme.** AI girişimlerini bir portföy olarak ele alın: çok sayıda ucuz pilot, açık
durdurma kriterleri ve durdurulan bahislerden kanıtlanmış olanlara yeniden tahsis edilen bütçe.
Organizasyonel **olgunluğu** izleyin — gelişigüzel deneylerden yönetişimli, ölçülen,
çekirdek-operasyonel AI'a — çünkü değer üzerindeki kısıt genellikle model değil, süreç ve
insanlardır.

## Her rol bunu nasıl kullanır

- **Portfolio Manager:** Portföyü yürütür — pilot araf'ından kaçınmak için durdurma kriterlerini uygular, durdurulan bahislerden bütçeyi yeniden tahsis eder ve yalnızca pilotta değil ölçekte adoption'a sahiptir.
- **Project Manager:** Gözetim ve değişim yönetimi maliyeti dahil baseline-ve-delta-eksi-toplam-maliyet case'ini oluşturur ve ölçeklendir-ya-da-durdur geçidine bağlı öncü göstergeleri tanımlar.
- **Developer:** Öncü göstergeleri ve birim başına maliyeti donatır; böylece business case sürekli ölçülür ve birim ekonomisi hacim büyüdükçe geçerli kalan sistemler kurar.
- **Enterprise Architect:** Kalitenin ve değer birimi başına maliyetin ölçeklendirmeden sağ çıktığını doğrular ve taahhütten önce vanity güdümlü ölçeklendirmeye karşı case'i red-team eder.

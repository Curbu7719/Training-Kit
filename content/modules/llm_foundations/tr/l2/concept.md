# Modelleri Seçmek ve Kontrol Etmek

L1, bir LLM'in ne olduğunu anlattı — bir sonraki-token tahmincisi. L2 ise her iş için *doğru*
modeli seçmen ve nasıl üreteceğini kontrol etmen için gereken pratik bilgidir. AI güdümlü bir
SDLC'de "AI"ı değil, farklı güçlü yanları, hızları, fiyatları ve kontrolleri olan bir **model
filosunu** kullanırsın; onları görevlere eşlemek bir mühendislik kararıdır.

**Çalışan bir örnek.** Geliştirme toolchain'in birkaç yerde model çağırır: IDE'de satır-içi kod
tamamlama, otomatik bir PR inceleyici, dokümanların üzerinde bir sohbet asistanı ve ara sıra "bu
tasarımı iyi düşün" yardımcısı. Dördünü de aynı model gibi ele almak; yavaş, pahalı ve tutarsız
olmanın yoludur.

## Model tipleri — sadece boyut değil

- **Base vs instruction-tuned.** Bir base model yalnızca metni sürdürür; instruction-tuned
  ("chat") model talimatları izlemek üzere eğitilmiştir — neredeyse her zaman istediğin budur.
- **Reasoning (akıl yürüten) modeller.** Bazı modeller cevap vermeden önce fazladan "düşünme"
  hesaplaması yapar. Zor, çok-adımlı problemlerde (çetrefilli bug'lar, tasarım dengeleri) daha
  güçlüdür ama daha yavaş ve pahalıdır — autocomplete için lükstür.
- **Küçük vs büyük.** Küçük/hızlı/ucuz, rutin ve iyi-tanımlı görevleri halleder; büyük/yetenekli/
  yavaş, maliyetini yalnızca gerçekten zor işte hak eder.
- **Açık vs proprietary, ve multimodal.** Açık-ağırlıklı (open-weight) modeller kendi ortamında
  çalışabilir (veri-ikametgâhı kontrolü); multimodal modeller girdi olarak görsel de (ekran
  görüntüsü, diyagram) alır.

## Decoding kontrolleri — çıktıyı şekillendirmek

Aynı model, sampling ayarlarına göre çok farklı davranır:

- **Temperature / top-p** — düşük = odaklı ve tekrarlanabilir (kod, çıkarım); yüksek = çeşitli ve
  yaratıcı (beyin fırtınası). Çoğu SDLC görevi için düşük istersin.
- **Max output token** — uzunluğu ve maliyeti sınırlar; varsayılan değil, kasıtlı ayarla.
- **Stop sequence'ler** — modele nerede duracağını söyler (örn. bir kod bloğunun sonu).
- **Seed** (desteklendiğinde) — testler için tekrarlanabilirliği artırır, gerçi tam garanti değildir.

## Determinizm bir ayardır, varsayılan değil

Temperature 0'da bile çıktının çalıştırmadan çalıştırmaya birebir aynı olacağı garanti değildir.
Aşağı-akış kodu ve testleri **varyasyona dayanacak** şekilde tasarla — tam string değil, özellikleri
puanla. Bu doğrudan Evaluation modülüne bağlanır.

## Modeli göreve eşle — ve route et

**Görevi güvenilir şekilde yapan en küçük modeli** seç, sonra **route et**: yüksek-hacimli rutin
yolda ucuz bir model, yalnızca zor veya düşük-güvenli vakaları daha güçlü bir modele yükselt. Tüm
bir toolchain genelinde maliyet ve gecikme üzerindeki en büyük kaldıraç budur.

## Limitler büyük boyutlarda kaybolmaz

Daha büyük bir model daha az halüsinasyon görür ama yine de kendinden emin şekilde gerçek uydurur,
yine bir bilgi-kesim tarihi vardır ve yine daha pahalı, daha yavaştır. "En büyük modeli kullan" bir
strateji değildir; yeteneği ihtiyaca eşlemek stratejidir.

## Her rol bunu nasıl kullanır

- **Developer/Mühendis:** Görev başına temperature / max-token / stop ayarlar, tamamlama için küçük
  bir model, zor debugging için bir reasoning model seçer ve route'u bağlar.
- **İş Analisti:** Hangi görevlerin varyasyona dayandığını (beyin fırtınası) hangilerinin düşük-
  temperature tekrarlanabilirlik gerektirdiğini (çıkarım) bilir ve gereksinimleri ona göre şekillendirir.
- **PM/Ürün Sahibi:** Özellik başına yetenek vs maliyet vs gecikmeyi tartar ve her yere tek pahalı
  model yerine route'a bütçe ayırır.
- **QA/Tester ve Mimar:** Non-determinizm altında test eder, model seçimini bir eval setine karşı
  doğrular ve route ile provider abstraction'ı modeller değiştirilebilir kalacak şekilde tasarlar.

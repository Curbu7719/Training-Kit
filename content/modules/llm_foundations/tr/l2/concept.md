# Modelleri Seçmek ve Kontrol Etmek

L1, bir LLM'in ne olduğunu anlattı — bir sonraki token'ı tahmin eden bir program. L2 ise her iş için
*doğru* modeli seçmen ve nasıl üreteceğini denetlemen için gereken pratik bilgidir. AI güdümlü bir
SDLC'de "AI"yı değil, farklı güçlü yanları, hızları, fiyatları ve ayarları olan bir **model
filosunu** kullanırsın; onları görevlere eşlemek bir mühendislik kararıdır.

**Bir örnek.** Geliştirme araç zincirin birkaç yerde model çağırır: IDE'de satır içi kod tamamlama,
otomatik bir PR inceleyici, dokümanlar üzerinde bir sohbet asistanı ve ara sıra "bu tasarımı iyi
düşün" yardımcısı. Dördünü de aynı model gibi ele almak; yavaş, pahalı ve tutarsız olmanın yoludur.

## Model tipleri — yalnızca boyut değil

- **Temel (base) ve talimata göre eğitilmiş (instruction-tuned).** Temel model yalnızca metni
  sürdürür; talimata göre eğitilmiş ("chat") model ise talimatları izlemek üzere eğitilmiştir —
  neredeyse her zaman istediğin budur.
- **Akıl yürüten (reasoning) modeller.** Bazı modeller cevap vermeden önce fazladan "düşünür". Zor,
  çok adımlı problemlerde (çetrefilli hatalar, tasarım dengeleri) daha güçlüdür ama daha yavaş ve
  pahalıdır — basit kod tamamlama için fazla kaçar.
- **Küçük ve büyük.** Küçük/hızlı/ucuz model rutin ve iyi tanımlı işleri görür; büyük/yetenekli/yavaş
  model maliyetini yalnızca gerçekten zor işte hak eder.
- **Açık ve kapalı, bir de çok kipli (multimodal).** Açık ağırlıklı (open-weight) modeller kendi
  ortamında çalışabilir (veri ikametgâhı denetimi); çok kipli modeller girdi olarak görsel de (ekran
  görüntüsü, diyagram) alır.

## Üretim ayarları — çıktıyı şekillendirmek

Aynı model, örnekleme ayarlarına göre çok farklı davranır:

- **Temperature / top-p** — düşük = odaklı ve tekrarlanabilir (kod, bilgi çıkarımı); yüksek = çeşitli
  ve yaratıcı (beyin fırtınası). Çoğu SDLC işi için düşük istersin.
- **Maksimum çıktı uzunluğu (max output token)** — uzunluğu ve maliyeti sınırlar; varsayılana
  bırakma, bilinçli ayarla.
- **Durdurma dizileri (stop sequence)** — modele nerede duracağını söyler (örn. bir kod bloğunun sonu).
- **Seed** (destekleniyorsa) — testlerde tekrarlanabilirliği artırır, gerçi tam garanti değildir.

## Belirlilik bir ayardır, varsayılan değil

Temperature 0'da bile çıktının çalıştırmadan çalıştırmaya birebir aynı olacağı garanti değildir.
Sonraki adımdaki kodu ve testleri **değişime dayanacak** biçimde tasarla — tam metni değil,
özellikleri puanla. Bu doğrudan Değerlendirme (Evaluation) modülüne bağlanır.

## Modeli göreve eşle — ve yönlendir

**Görevi güvenilir biçimde yapan en küçük modeli** seç, sonra **yönlendir**: yüksek hacimli rutin
yolda ucuz bir model çalışsın, yalnızca zor ya da belirsiz durumları daha güçlü bir modele yükselt.
Bir araç zinciri genelinde maliyet ve gecikme üzerindeki en büyük kaldıraç budur.

## Sınırlar büyük boyutta yok olmaz

Daha büyük bir model daha az halüsinasyon görür ama yine kendinden emin biçimde gerçek uydurur, yine
bir bilgi kesim tarihi vardır ve yine daha pahalı, daha yavaştır. "En büyük modeli kullan" bir
strateji değildir; yeteneği ihtiyaca eşlemek stratejidir.

## Her rol bunu nasıl kullanır

- **Geliştirici/Mühendis:** Görev başına temperature / maksimum uzunluk / durdurma ayarlar; tamamlama
  için küçük bir model, zor hata ayıklama için akıl yürüten bir model seçer ve yönlendirmeyi kurar.
- **İş Analisti:** Hangi işlerin değişime dayandığını (beyin fırtınası), hangilerinin düşük
  temperature'lı tekrarlanabilirlik istediğini (bilgi çıkarımı) bilir ve gereksinimleri buna göre
  şekillendirir.
- **PM/Ürün Sahibi:** Özellik başına yetenek, maliyet ve gecikmeyi tartar; her yere tek pahalı model
  yerine yönlendirmeye bütçe ayırır.
- **QA/Test Uzmanı ve Mimar:** Belirsizlik altında test eder, model seçimini bir değerlendirme setine
  karşı doğrular ve yönlendirme ile sağlayıcı soyutlamasını, modeller değiştirilebilir kalacak biçimde
  tasarlar.

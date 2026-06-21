# Çalışılmış Örnek: Bir Kodlama Sprint'inde Model Seçimi (Kodlama Aşaması)

**Aşama: Kodlama/Geliştirme.** Bir geliştirme ekibi, bir özellik sprint'i sırasında AI'ı günlük iş akışına dahil ediyor. Üç ayrı yaşam döngüsü görevi ortaya çıkıyor ve her biri farklı bir model seçimini gerektiriyor — yetenek/maliyet/gecikme dengesini pratikte gösteriyor.

**Görev 1 — commit mesajları üretmek.** Her push küçük bir prompt tetikler: *"Bu diff'i tek satırlık bir commit mesajı olarak özetle. Diff: ..."*. Model metni sürdürür ve en olası sonraki token'ları mesaj olur. Bu yüksek hacimli, basit ve iyi sınırlandırılmış bir iştir, bu yüzden ekip **küçük, hızlı, ucuz** bir model seçer — yaratıcılık değil, özlü ve tutarlı bir ifade isterler. Her commit'te amiral gemisi fiyatları ödemek savurganlık olurdu.

**Görev 2 — birim test senaryoları üretmek.** Bir test uzmanı, modele bir tarih ayrıştırma fonksiyonu için uç durumlar üretmesini söyler. Bu, bir commit mesajından daha fazla akıl yürütme gerektirir ama en zor görev değildir, bu yüzden **orta seviye** bir model uygundur. Ekip ona bariz olanları tekrarlamak yerine *çeşitli* girdiler (artık yıllar, saat dilimleri, boş dizeler) üretmesini açıkça söyler.

**Görev 3 — bir mimari öneriyi incelemek.** Bir mimar, modelden önerilen bir servis bölünmesini gizli bağımlılıklar ve hata modları açısından eleştirmesini ister. Bu, zayıf bir yanıtın maliyetli olduğu, gerçekten zor ve açık uçlu bir akıl yürütmedir, bu yüzden ekip **en büyük, en yetenekli** modeli saklar — nadiren çalıştığı ve riskler yüksek olduğu için daha yüksek maliyetini ve gecikmesini kabul eder.

**Sınırların ısırdığı yer.** Model bir keresinde var olmayan bir kütüphane metodu önerdi — bir **halüsinasyon**. Bu yüzden ekip her AI önerisini bir insanın doğruladığı bir taslak olarak görür ve **bilgi kesim tarihini** dengelemek için prompt'larda framework sürümünü sabitler.

**Sonuç:** bir ekip, üç görev, üç model boyutu. Seçim her görevin gereksinimlerini izledi — her zaman "en iyi" modele uzanma alışkanlığını değil.

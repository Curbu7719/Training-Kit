# Uygulamalı Örnek: Ölçeklendirmeden Sağ Çıkan Bir Business Case

**Pilot harika görünüyordu.** Bir sigorta firması, eksperler için hasar dosyalarını özetleyen
bir AI asistanını pilotluyor. Üç hafta boyunca on eksperle ortalama inceleme süresi %30 düşüyor
ve adoption güçlü. Genç bir analist, manşet olarak "%30 daha hızlı"yı öne sürerek hemen 300
eksperin tamamına ölçeklendirmeyi öneriyor.

**Gerçek business case'i oluşturma.** Bir iş analisti case'i bir manşet değil, bir karşılaştırma
olarak yeniden inşa ediyor. **Baseline:** her eksper haftada dosya incelemesine 12 saat
harcıyor. **Delta:** tasarruf edilen %30 yaklaşık 3,6 saat/hafta. **Sunmanın toplam maliyeti:**
özet başına inference maliyeti, artı pilot'un gizlediği önemli bir kalem — bir kıdemli eksper,
yanlış bir özet bir hasarı yanlış fiyatlandırabileceği için haftada iki saatini özetlerin
doğruluğunu kontrol ederek geçiriyor. Net delta gerçek ama gözetim maliyeti sayıldığında
manşetten daha küçük.

**Ölçekte birim ekonomisini kontrol etme.** On kullanıcıda inference faturası önemsizdi. Ekip
300 kullanıcıda **incelenen hasar başına maliyeti** modelliyor ve tasarruf edilen işgücünün çok
altında kaldığını doğruluyor — ekonomi geçerli. İyi: ölçeklendirme değeri tersine çevirmeyecek.

**Öncü göstergeleri izleme.** Ardıl "üç aylık azaltılan maliyet" sayısını beklemek yerine,
yeni eklenen her eksper için **taslak kabul oranı**nı ve **ilk-değere-süre**yi izliyorlar. İlk
50 kişilik dalgada kabul düşüyor ve onboarding yavaş — eğitimin dağıtımın gerisinde kaldığına
dair bir sinyal.

**Adoption çökmeden önce harekete geçme.** Dağıtımı duraklatıyor, onboarding'i ve geri bildirim
döngüsünü güçlendiriyor ve ancak ondan sonra devam ediyorlar. Adoption 300'ün tamamında
toparlanıyor. Kardeş bir projeyle karşıtlık — hiç daha hızlı incelemeye bağlanmayan ve sessizce
bütçe tüketen ham "üretilen özetler" üzerine ölçeklendirilen — dersi somutlaştırıyor:
savunulabilir bir case, gerçek birim ekonomisi ve öncü göstergeler, ölçeklendirmenin değeri yok
etmek yerine yaratmasını sağlayan şeylerdir.

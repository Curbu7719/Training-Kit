# Uygulamalı Örnek: Bir Destek Asistanı için Pilot'tan Ölçeklendirmeye

**Fikir.** 200 kişilik bir şirket müşteri desteğine yüksek harcama yapıyor. Ekip, gelen
taleplere yanıt taslakları hazırlayan bir AI asistanı öneriyor; böylece temsilciler sıfırdan
yazmak yerine düzenleyip-gönderiyor. Liderlik önce tek bir soru soruyor: *ne değer ve bunu
nasıl bileceğiz?*

**Başarı metriğini belirleme.** Herhangi bir şey inşa etmeden önce ekip bir **gerçek değer
metriği** üzerinde anlaşıyor: talep başına ortalama işlem süresi, artı temsilcilerin küçük
düzenlemelerle kabul ettiği taslakların oranı. "Üretilen taslak sayısı" vanity metriğini açıkça
reddediyorlar — kimsenin kullanmadığı taslaklar üretmek hiçbir şey kanıtlamaz. Devam eşiği: en
az %60 taslak kabulü ile işlem süresinde %20 düşüş.

**Pilot.** Tek bir talep kategorisinde sekiz temsilciyle dört haftalık bir pilot yürütüyorlar.
İşlem süresi %25 düşüyor, taslak kabulü %68'e ulaşıyor ve temsilciler aracın gerçekten yardımcı
olduğunu bildiriyor. Metrik eşiği geçiyor ve adoption gerçek — sekiz temsilci söylenmeden
kullanmaya devam ediyor.

**Ölçeklendir-ya-da-durdur kararı.** Sayılar ölçeklendirmeyi haklı çıkarıyor, ama ekip
**maliyet ve adoption'ı** da kontrol ediyor. Talep başına model maliyeti, tasarruf edilen
işgücünün çok altında, dolayısıyla birim ekonomisi hacim büyüdükçe geçerli kalıyor.
Ölçeklendirmeye karar veriyorlar — ama kasıtlı olarak, her seferinde bir kategori.

**Değişim yönetimi.** 40 temsilcinin tamamına yayarken eğitime yatırım yapıyor, güven inşa etmek
için pilot sonuçlarını paylaşıyor ve temsilcilerin kötü taslakları işaretlemesi için bir geri
bildirim düğmesi ekliyorlar. Temsilciler aracı işlerine bir tehdit değil, yardım olarak gördüğü
için adoption yükseliyor.

**Karşıtlık.** İkinci bir pilot — talepleri otomatik etiketleyen bir AI — yalnızca %3 zaman
tasarrufu ve düşük temsilci güveni gösteriyor. Ekip onu **durduruyor**. Bu bir kazanç: zayıf
bir bahse harcamayı durduruyor ve bütçeyi açıkça işe yarayan asistana yönlendiriyorlar.

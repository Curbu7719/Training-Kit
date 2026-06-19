# İşlenmiş Örnek: Zorunlu Bir Model Migration'ı (ve Yol Boyunca Bir Maliyet Korkusu)

**AI destek asistanınız** aylardır sorunsuz çalışıyor. Derken yeni özellikler yazmakla hiç
ilgisi olmayan iki operasyonel gerçek çarpıyor — bunlar saf ops.

## Bölüm 1 — Sağlayıcı modelinizi deprecate ediyor

Bir e-posta geliyor: **sabitlediğiniz (pinned)** model sürümü **30 gün içinde emekliye
ayrılacak**. Yeni sürüme migrate etmeniz gerekiyor yoksa özellik bozulur. "Aslında aynı model"
söylemine güvenmiyorsunuz — aynı prompt farklı davranabilir ve sessiz bir kalite düşüşü müşteri
güvenini aşındırırdı. Bu yüzden umutlu bir takas yerine disiplinli bir migration yürütüyorsunuz.

1. **Shadow.** Gerçek üretim trafiğinin bir **kopyasını**, canlı modelle paralel olarak yeni
   modele gönderiyorsunuz; kullanıcılara yalnızca eski modelin yanıtlarını sunuyorsunuz. Her biri
   için, her iki output'u, token'ları ve latency'yi loglıyorsunuz. Ayrıca yeni sürümü
   **çevrimdışı eval setinize** karşı çalıştırıyorsunuz — geçmiş olaylardan damıtılmış vakalar
   dahil.
2. **Karşılaştır.** Sayılar geliyor: dayanaklılık eşit, latency ~%10 daha iyi, **ama yanıt başına
   maliyet %20 yukarıda** çünkü yeni sürüm daha laf kalabalığı yapıyor. Bunun çoğunu geri kazanmak
   için output talimatını sıkılaştırıyor ve yeniden shadow yapıyorsunuz.
3. **Canary.** `assistant_model` flag'inin arkasında canlı trafiğin **%5'ini** yeni modele
   yönlendiriyor ve çevrimiçi monitörleri (reddetme oranı, thumbs-down, p95) bir gün boyunca
   izliyorsunuz. Kararlı.
4. **Yayına al — rollback hazırken.** %100'e geçiyorsunuz. Flag yerinde kalıyor ki ince bir
   regresyon ortaya çıkarsa, tek bir değişiklik eski sürüme geri döndürsün (deprecation
   penceresinin geri kalanı boyunca hâlâ kullanılabilir).

Hiçbir müşteri migration'ı fark etmedi. Amaç budur: özelliğin altındaki bir model değişikliğini,
shadow → canary → flag'li yayına alma ile **sıkıcı** hale getirmek.

## Bölüm 2 — Sabahın 2'sindeki maliyet anomalisi

Bir hafta sonra, **maliyet-anomali alarmı** çalıyor: harcama trendin **4×'i** hızında ilerliyor.
Sabit bir eşik değil — anomali tespitçisi normal eğriden bir sapmayı yakaladı. On-call,
**maliyet-özellik-bazında** dökümü açıyor ve bunun hiç de asistan olmadığını görüyor: tüm bilgi
tabanını yeniden özetleyen yeni bir dahili **batch işi** bir **retry döngüsünde** takılı kalmış,
her başarısızlık devasa bir prompt'u yeniden gönderiyor.

**Katı tavan** işini çoktan yaptı — tavanı aştığında batch işinin harcamasını kıstı (throttle),
böylece bir insan araştırırken fatura sınırlı kalıyor. Runbook: trace'te kaçak çağrıyı (retry
döngüsü) belirle, retry'larını sınırla ve yeniden kuyruğa al. Maliyet **özellik bazında
atfedildiği** için, suçluyu bulmak bir sonraki ay bir finans incelemesi değil, dakikalar aldı.

## Çıkarılan ders

Hiçbir olay model kalitesi ya da yeni işlevsellikle ilgili değildi. Özellik sağlıklı kaldı çünkü
**işletildi**: bir deprecation, bir rollback flag'i ile ölçülü bir shadow/canary migration'a
dönüştü ve bir maliyet kaçağı **bir anomali alarmıyla yakalandı, bir katı tavanla sınırlandı ve
özellik-başına atıf ile kaynağına kadar izlendi**. Ölçekte, model de fatura da kendiliğinden
değişir — AI'ı işletmek, bunu hiçbir müşteri fark etmeden soğurabilecek mekanizmaya sahip olmak
demektir.

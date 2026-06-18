# İşlenmiş Örnek: Bir İade Agent'ını Sağlamlaştırmak

Bir ekip, iade taleplerini işleyen bir agent inşa ediyor. Naif sürümde tek bir tool, `do_refund(order_id, amount)`, en fazla 10 iterasyon ve "yalnızca geçerli siparişleri iade et" diyen bir prompt var. Testte çalışıyor. Üretimde öğretici şekillerde başarısız oluyor — ve düzeltmelerin hepsi L2 konularıdır.

**Başarısızlık 1 — yorumlanamayan sonuçlar.** Sipariş servisi kısa süre devre dışı kaldığında `lookup_order` ham bir HTTP `500` döndürüyor. Model, *eksik* bir siparişi *geçici bir kesintiden* ayırt edemez, bu yüzden siparişin geçersiz olduğunu varsayar ve meşru bir iadeyi reddeder.

*Düzeltme — yorumlanabilir, tipli sonuçlar.* Tool artık `{"status": "unavailable", "retryable": true}` ile `{"status": "not_found", "retryable": false}` arasında döndürür. Model ilkini yeniden dener ve ikincisinde durur.

**Başarısızlık 2 — dönen bir döngü.** Servis kapalı kaldığında, model `lookup_order`'ı aynı argümanlarla on kez çağırır, iterasyon sınırına çarpar ve on model çağrısı harcadıktan sonra pes eder.

*Düzeltme — ilerleme-olmaması algılama.* Döngü, aynı tool + aynı argümanların tekrarlandığını ve bir `retryable` hatasını algılar, **geri çekilme (backoff)** uygular ve iki başarısız yeniden denemeden sonra, sınıra kadar dönmek yerine "servis kullanılamıyor, lütfen daha sonra deneyin" diye raporlar.

**Başarısızlık 3 — yalnızca bir prompt'un arkasındaki geri alınamaz bir eylem.** Prompt "yalnızca geçerli siparişleri iade et" diyordu, ama bozuk bir istek modeli yanlış hesaba 5.000 $ iade etmeye ikna etti. Prompt *tek* korumaydı ve model onu geçersiz kıldı.

*Düzeltme — mimari bir onay kapısı.* Bir eşiğin üzerindeki `do_refund` artık yürütülmeden önce **insan onayı** gerektirir — prompt'ta değil, uygulamada uygulanır. Model iadeyi *isteyebilir*; büyük olanları bir kişi onaylamalıdır. Bir sınır, laf ile ikna edilemez.

**Başarısızlık 4 — kara kutu bir başarısızlık.** Bir iade ters gittiğinde, ekibin agent'ın ne yaptığına dair hiçbir kaydı yoktu.

*Düzeltme — gözlemlenebilirlik.* Her iterasyon artık planı, istenen tool'u, argümanlarını ve gözlemi loglar, böylece herhangi bir çalıştırma yeniden oynatılıp izlenebilir.

**Ana hat:** L1 döngüsü doğruydu; güvenilirlik üstüne katmanlanan **tool tasarımı, döngü kontrolü, mimari korkuluklar ve gözlemlenebilirlikten** geldi. Otonomi yalnızca modelin atlayamayacağı bir yapıyla sınırlandığında güvenlidir.

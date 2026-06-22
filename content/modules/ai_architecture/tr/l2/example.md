# İşlenmiş Örnek: AI Yardımcın Kötü Bir Günü Atlatsın

Sürüm-notu yardımcın çalışır — ta ki model sağlayıcıda kesinti olana, seni rate-limit'leyene ya da sürümün ortasında çöp döndürene kadar. Derinlikte mimari, parçaların *nasıl* başarısız olduğu ve yine de nasıl çalışmaya devam ettiğinle ilgilidir. İşte birkaç güvenilirlik deseni, bir sağlayıcının kötü gününün senin günün olmaması demektir.

**Soyutlama, değerini başarısızlıkta kanıtlar.** Model bir iç arayüzün arkasında durduğundan, özelliğe dokunmadan bir **fallback** ekleyebilirsin — birincil sağlayıcı çökerse ikincile geç. *Bu gününü neden kolaylaştırır?* Sürümün bir tedarikçinin olayı yüzünden durmaz; yardımcı sessizce geçiş yapar ve taslamayı sürdürür.

**Uzak çağrının yaramazlık yapacağını varsayarak tasarla.** Sağlayıcı API'leri zaman aşımına uğrar, rate-limit yapar ve bazen hatalı çıktı döndürür. *Desenler:* her çağrıda bir **timeout**, geçici hatalar için **geri çekilmeli yeniden deneme** ve başarısız bir sağlayıcının çığ gibi yayılmaması için bir **devre kesici (circuit breaker)**. *Neden uğraşmalı?* Onlar olmadan tek bir yavaş çağrı aracını askıda bırakır; onlarla donmak yerine zarifçe geriler.

**Bir degraded mode'un olsun.** Her şey zorlanırken, sert bir hata yerine daha ucuz bir yedek modele ya da önbelleğe alınmış bir cevaba düşersin. *AI'ı neden böyle kullan?* Sürüm günü, birazcık daha az cilalı bir taslak, kırmızı bir hata ekranını döver — yardımcı yalnızca en iyisinde değil, en kötüsünde de yararlı kalır.

**Değişiklikleri güvenle yay.** Yeni bir prompt ya da model önce bir flag arkasında, koşuların bir kısmına, eval'lerine karşı izlenerek çıkar. *Neden?* Böylece bir regresyon her takımın değil, tek bir canary sürüm notuna çarpar ve tek bir anahtarla geri alabilirsin.

**Özet:** derinlikte soru "çalışıyor mu?" değil, "sağlayıcı çalışmayınca ne olur?"dur. Fallback'ler, timeout'lar, yeniden denemeler, bir degraded mode ve güvenli yayma; iyi günlerde çalışan bir yardımcıyı kötü günlerde güvendiğin birine çeviren şeydir.

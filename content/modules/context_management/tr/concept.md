# Context Window ve Onu Yönetmek

Her LLM'in bir **context window**'u (bağlam penceresi) vardır: aynı anda dikkate alabileceği maksimum metin miktarı — token cinsinden ölçülür. En önemlisi, bu pencere **hem** gönderdiğiniz girdiyi (talimatlar, o ana kadarki konuşma, yapıştırdığınız herhangi bir kod ya da spesifikasyon) **hem de** ürettiği çıktıyı kapsar. Pencere 100.000 token ise ve 95.000 token kaynak dosya yapıştırdıysanız, yanıt için yalnızca ~5.000 token kalır.

**Bir benzetme:** context window sabit boyutlu bir beyaz tahtadır. Kod tabanının ya da gereksinimlerin herhangi bir kısmını üzerine yazabilirsiniz, ama yalnızca belirli bir miktar sığar. Tahta dolduğunda yeni bir dosya eklemek için bir şeyi silmeniz gerekir — ve model yalnızca tahtada şu anda olan şey üzerinde akıl yürütebilir.

İkinci temel bir gerçek: **her API çağrısı durumsuzdur (stateless)**. Model önceki mesajınızı hatırlamaz. Devam eden bir refactor ya da uzun bir gereksinim görüşmesi hissi, uygulamanın her çağrıda önceki bağlamı **yeniden sağlamasıyla** yaratılan bir yanılsamadır. Önceki turları geri göndermezseniz, model açısından onlar yok olur.

Dolayısıyla temel bir mühendislik sorusu, o sınırlı pencereye **neyi dahil edeceğiniz** olur: sistem talimatları, ilgili dosyalar, *bu* istek için gereken belirli spesifikasyon bölümü — ve neyi dışarıda bırakacağınız.

**Tükendiğinde ne olur?** Ya çağrı sınırı aştığı için reddedilir, ya da eski içerik atılır ve model sessizce bilgi kaybeder — bir talimatı unutur ya da çok dosyalı bir değişiklikte daha önceki bir kararla çelişir.

Pencere içinde kalmak için yaygın **stratejiler**:

- **Özetleme (summarization)** — daha önceki bir konuşmayı ya da uzun bir gereksinim dizisini, temelleri koruyan kısa bir özete sıkıştırmak.
- **Parçalama (chunking)** — büyük bir dosyayı ya da belgeyi parçalara bölüp her seferinde birini işlemek.
- **Geri getirme (retrieval)** — kod tabanını ya da dokümanları dışarıda saklayıp her istek için yalnızca en ilgili birkaç parçayı içeri çekmek.
- **Kayan pencere (sliding window)** — bir görüşmenin ya da oturumun yalnızca son N turunu tutup en eskilerin düşmesine izin vermek.
- **Kontrol noktası / devir (checkpointing / handoff)** — ilerlemenin yapılandırılmış bir özetini periyodik olarak kaydetmek, böylece bir refactor (ya da bir oturum) her şeyi yeniden göndermeden devam edebilir.

## Bu konuyu her rol nasıl kullanır

- **Geliştirici/Mühendis:** Çok dosyalı bir refactor için tüm depoyu yapıştırıp pencereyi taşırmak yerine, retrieval aracılığıyla AI'a yalnızca ilgili dosyaları besler.
- **İş Analisti:** Uzun bir paydaş görüşmesini kompakt bir özete sıkıştırır, böylece model sınırları aşmadan tüm gereksinim dizisini tutarlı tutabilir.
- **PM/Ürün Sahibi:** Daha büyük belgelerin ve daha uzun oturumların daha fazla token harcadığını ve sınırlara çarpabileceğini anlar, bu da özellik kapsamını ve bütçesini şekillendirir.
- **QA/Test Uzmanı & Mimar:** Bir test uzmanı sınırın yakınında ve ötesinde davranışı yoklar (çok uzun sohbetler, devasa girdiler); bir mimar, sistemin zarif biçimde bozulması için retrieval, özetleme ya da kontrol noktası arasında seçim yapar.

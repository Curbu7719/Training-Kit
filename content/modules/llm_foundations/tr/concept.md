# Büyük Dil Modeli Nedir

Büyük dil modeli (LLM), muazzam miktarda metin okumuş ve dilin istatistiksel örüntülerini öğrenmiş bir programdır. Özünde aldatıcı derecede basit tek bir şey yapar: o ana kadarki metni alıp **bir sonraki token'ı** tahmin eder (token bir kelime ya da kelime parçasıdır). Olası bir sonraki token'ı seçer, ekler ve bunu tekrarlar — her seferinde bir token — ta ki tam bir yanıt ortaya çıkana kadar. Bir LLM'in yazılım yaşam döngüsü boyunca yaptığı her şey, bir commit mesajı yazmaktan bir mimari öneriyi incelemeye kadar, bu sonraki token tahmini döngüsü üzerine kuruludur.

**Bir benzetme:** bir telefon klavyesinin otomatik tamamlama özelliğini düşünün, ama mesajlaşma geçmişiniz yerine bir kod ve düzyazı kütüphanesiyle eğitilmiş ve tüm fonksiyonları ya da tasarım incelemelerini sürdürebilecek kadar güçlü. Veritabanından bilgi aramaz; özümsediği örüntülerden en akla yatkın devamı yeniden kurar.

İki aşamayı ayırın. **Eğitim (training)**, modelin örüntülerini öğrendiği, donmuş bir ağırlık kümesi üreten yavaş, pahalı ve tek seferlik süreçtir. **Çıkarım (inference)**, bir geliştiricinin aracı modeli her çağırdığında olan şeydir: ağırlıklar sabit kalır ve model prompt'a bir yanıt üretir. Çıkarım için ödeme yapar ve beklersiniz; eğitim ise zaten gerçekleşmiştir.

Modeller **ailelere ve boyutlara** ayrılır — bir sağlayıcı tipik olarak küçük/hızlı/ucuzdan büyük/yetenekli/yavaşa kadar seçenekler sunar. Daha büyük olmak her yaşam döngüsü görevi için otomatik olarak daha iyi değildir.

Temel **yetenekler**: kod yazmak ve açıklamak, gereksinimleri özetlemek, test taslakları hazırlamak, çeviri yapmak ve adım adım akıl yürütmek. Tasarımda hesaba katılması gereken temel **sınırlar**:

- **Halüsinasyon** — yanlış şeyleri kendinden emin biçimde söyleyebilir (var olmayan bir API gibi), çünkü doğrulanmış gerçekliği değil, akla yatkın metni tahmin eder.
- **Bilgi kesim tarihi (knowledge cutoff)** — yalnızca eğitim tarihine kadarki veriyi bilir, dolayısıyla yeni yayınlanan bir framework sürümünü kaçırabilir.
- **Belirsizlik (non-determinism)** — aynı prompt farklı yanıtlar verebilir, çünkü model tek bir sabit cevabı getirmek yerine akla yatkın metni tahmin eder. Buna göre tasarla: her çalıştırmada birebir aynı çıktıyı bekleme ve tam metne göre doğrulama yapma.

**Model seçimi**, **yetenek, maliyet ve gecikme (latency)** arasında bir denge kurmaktır: yaşam döngüsü görevini güvenilir biçimde yapan en küçük modeli kullanın ve en büyüğü tasarım ya da karmaşık refactor gibi gerçekten zor işler için saklayın.

## Bu konuyu her rol nasıl kullanır

- **Geliştirici/Mühendis:** Satır içi kod tamamlama asistanı ya da commit mesajı üretmek için küçük, ucuz bir model seçer; karmaşık çok dosyalı bir refactor ya da zorlu bir hata teşhisi için güçlü bir model kullanır.
- **İş Analisti:** Uzun bir gereksinim görüşmesini yapılandırılmış kullanıcı hikayelerine özetlemek için yetenekli bir model kullanır ve model halüsinasyon görebileceği için her olgusal iddiayı doğrular.
- **PM/Ürün Sahibi:** Bir AI özelliğini kapsamlandırırken yetenek, maliyet ve gecikmeyi tartar; yüksek hacimli çağrıların (örneğin PR başlığı üretimi) daha ucuz bir modeli tercih ettiğini bilir.
- **QA/Test Uzmanı & Mimar:** Bir test uzmanı uç durum test verisi üretmek için bir model kullanır ve belirsizliği tolere eden doğrulamalar tasarlar; bir mimar tasarım incelemesi ve denge analizi için en güçlü modeli saklar.

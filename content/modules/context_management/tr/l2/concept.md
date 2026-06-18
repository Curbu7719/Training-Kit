# Derinlemesine Context Yönetimi: Dengeler ve Hata Modları

L1'de context window'un paylaşılan bir girdi+çıktı token bütçesi olduğunu, çağrıların durumsuz olduğunu ve özetleme, parçalama, retrieval, kayan pencere ve kontrol noktasının AI destekli bir refactor'ı ya da gereksinim oturumunu pencere içinde tuttuğunu öğrendiniz. L2'de soru daha keskindir: her stratejinin bir **maliyeti** vardır ve yanlış seçim, gerçek SDLC işinde karakteristik biçimlerde başarısız olur.

**Özetleme**, alan karşılığında doğruluk feda eder. Bir tasarım tartışmasının iyi bir özeti kararları, tanımlayıcıları ve kısıtları korur; dikkatsiz bir özet, sonraki bir düzenlemenin ihtiyaç duyduğu ayrıntıyı atar. Hata modu: **kayıplı sıkıştırma** — model, sessizce bir anahtar kabul kriterini atlamış bir özet üzerinden ilerler. Bu birikir: özetlerin özetleri her turda kaynaktan daha da uzaklaşır.

**Kayan pencere** ucuz ve basittir ama **tasarım gereği unutkandır** — pencereden eski olan her şey gider. Hata modu: model, bir refactor'da erken belirtilen bir kısıtı (bir kolon adını koru, bir adlandırma kuralı) kaydırılıp gözden çıktığı için "unutur". Bunu çalışan bir özet ya da sabitlenmiş gerçeklerle eşleştirin.

**Retrieval (RAG)**, yalnızca ilgili dosyaları ya da doküman parçalarını getirerek pencereyi yalın tutar ama bir **retrieval kalitesi bağımlılığı** getirir: retriever yanlış dosyaları döndürürse, model hiçbir şeyden yanıt verir — ya da bir API halüsinasyonu görür. Hata modları: bir fonksiyonu ya da kuralı sınırlar boyunca bölen kötü parçalama, embedding uyumsuzluğu ve kodun güncel olmayan bir sürümünü sunan **bayat indeksler**. Retrieval, zorlu sorunu "pencereye sığdır"dan "doğru şeyi getir"e taşır.

**Kontrol noktası / devir**, uzun süreli işi — çok günlü bir migration'ı — yapılandırılmış bir durum özeti olarak korur, böylece yeni bir oturum ya da takım arkadaşı kaldığı yerden devam edebilir. Hata modu: eksik bir kontrol noktası, devam eden bir kararı atlar ve devam eden oturum önceki işi tekrarlar ya da onunla çelişir.

**Kesişen uç durumlar:**

- **Konum etkileri** — modeller çok uzun bir bağlamın ortasına gömülü malzemeye daha az güvenilir biçimde dikkat eder ("ortada kaybolma" / lost in the middle). Daha büyük bir pencere bedava bir geçiş kartı değildir; kritik spesifikasyonu kenarlara yakın yerleştirin.
- **Bütçe çekişmesi** — neredeyse dolu bir girdi (30 yapıştırılmış dosya) çıktıyı aç bırakır; üretilen kod için baş boşluğu ayırın.
- **Maliyet ve gecikme token ile ölçeklenir** — en büyük pencere, CI sıklığındaki çağrılar için nadiren en ucuz yanıttır.
- **Stratejileri birleştirmek** normaldir: yakın diyalog için kayan pencere + eski geçmiş için özet + kod tabanı için retrieval.

Beceri, stratejiyi içerikle eşleştirmek ve herhangi bir tek tekniğin "güvenli" olduğunu varsaymak yerine onun hata modunu bilinçli olarak kabul etmektir.

## Bu konuyu her rol nasıl kullanır

- **Geliştirici/Mühendis:** Bir refactor için stratejileri seçer ve *birleştirir*, çıktı baş boşluğu ayırır, token kullanımını ölçer ve ortada kaybolmadan kaçınmak için kritik dosyaları bilinçli sıralar.
- **İş Analisti:** Hangi kabul kriterlerinin pazarlık konusu olmadığını işaretler, böylece özetleme ve kontrol noktası onları asla sıkıştırıp atmaz ve alan için "doğru retrieval"ın ne anlama geldiğini tanımlar.
- **PM/Ürün Sahibi:** Büyük pencerelerin maliyet/gecikmesini retrieval'a karşı tartar ve AI özelliklerini önceliklendirirken her stratejinin hata modunun artık riskini kabul eder.
- **QA/Test Uzmanı & Mimar:** Bir test uzmanı çekişmeli senaryolar tasarlar — uzun bir oturumu atlatması gereken erken kısıtlar, bayat/eksik dosyalarla retrieval, bağlam ortasındaki gerçekler; bir mimar, hata modu kullanım senaryosu için tolere edilebilir bir mimari seçer.

# İpuçları — Derinlemesine Vibe Coding

## Temel fikrin alternatif ifadeleri

- Her iyi vibe-coding disiplini belirli bir hata moduna karşı bir savunmadır: test'ler sessiz
  yanlış kodu yakalar, okuma makul-ama-bozuk mantığı yakalar, çalıştırma halüsinasyon API'leri
  yakalar, küçük diff'ler kapsam kaymasını yakalar ve "anla" kuralı aşınan anlayışı yakalar.
- Disiplinler katmanlı savunmalar gibi birleşir — birini düşürün ve sınırladığı hata geçer;
  "çalışıyor ve doğru görünüyor" tam da sessiz ve makul-ama-bozuk hataların yaşadığı boşluktur.
- En derin disiplin, AI içine yazarken sistemin doğru bir zihinsel modelini tutmaktır; o model,
  mimari tutarlılığı ve güvenlik review'unu en baştan mümkün kılan şeydir.

## İpucu yığını

- **H1 (dürtme):** "Çalışıyor" ve "doğru görünüyor" her biri farklı bir hatayı kaçırır. *Çalıştırma*
  hangi hatayı yakalayamaz ve *bir bakış* hangisini yakalayamaz?
- **H2 (yapısal):** Her hata modunu onu sınırlayan disipline eşleyin — sessiz yanlış kod ↔
  davranışsal test'ler, makul-ama-bozuk ↔ spec'e karşı okuma, halüsinasyon API ↔ çalıştır +
  direksiyonu al, kapsam kayması ↔ küçük tek amaçlı diff'ler, aşınan anlayış ↔ anlamadığını asla
  gönderme. Bir boşluk, eksik veya yanlış yerleştirilmiş bir disiplin demektir.
- **H3 (cevaba yakın):** Makul-ama-bozuk, akıcılığın tuzağıdır: bir kenar durumunu yanlış ele alan
  kendinden emin, idiomatic kod. Bunu yalnızca diff'i *spec'inizin kenar durumlarını akılda tutarak*
  okumak — davranışsal bir test ile desteklenmiş — güvenilir biçimde yakalar; "derleniyor ve
  çalışıyor" yakalamaz.

## SSS

**S: Kod çalışıyor ve bir smoke test geçiyorsa endişelenecek ne kalır?**
Sessiz yanlış kod (çalışır, yanlış değeri döndürür) ve makul-ama-bozuk mantık (iyi okunur, bir kenar
durumunu yanlış ele alır). İkisi de yalnızca "çökme yok" değil, spec'inize karşı davranışsal bir test
ve gerçek bir okuma gerektirir.

**S: Aşınan anlayış neden en tehlikeli hata modu olarak adlandırılır?**
Çünkü sessizce birikir. Okunmamış kabul edilen her diff tek başına sorunsuzdur, ama biriktiklerinde
kimsenin debug, güvenli kılamayacağı veya genişletemeyeceği bir sistem bırakırlar — ve bunu ancak bir
şey bozulduğunda ve akıl yürütecek bir zihinsel model olmadığında keşfedersiniz.

**S: AI var olmayan bir metodu önerip duruyor. Bu prompt'umun hatası mı?**
Bu bir halüsinasyon API'dir ve çözüm sonsuz reprompt değildir. Kodu çalıştırmak onu ortaya çıkarır
ve neredeyse aynı yanlış önerilerden oluşan bir döngü, direksiyonu alıp kendiniz yazma sinyalinizdir.

**S: AI destekli çalışmanın mimariyi aşındırmasını nasıl durdururum?**
Zihinsel modeli tutun: prompt'larda projenin desenlerini uygulayın, sapan veya kapsamı kayan
diff'leri reddedin ve tutarlılığa doğru refactor edin. Sapmayı ancak hâlâ bütünü anlıyorsanız
yakalayabilirsiniz.

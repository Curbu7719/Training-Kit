# Token Nedir?

Bir büyük dil modeline (LLM) metin gönderdiğinizde, model metni insanların yaptığı gibi
bütün kelimeler halinde okumaz. Önce metni **token** adı verilen küçük parçalara böler.
Bir token genellikle bir **alt-kelime birimidir** — bazen kısa bir kelimenin tamamı, bazen
daha uzun bir kelimenin parçası, bazen yalnızca noktalama, girinti veya bir simgedir. Bu adıma
**tokenizasyon** denir. Model yalnızca token'ları "görür", asla ham harfleri veya kelimeleri görmez.

**Bir SDLC örneği.** Pull-request hattınıza bağlı bir **AI kod inceleme botu** hayal edin.
Bir geliştirici bir PR açtığında, bot **diff'i** ve çevresindeki bir miktar kaynak kodu
okur, ardından inceleme yorumları yazar. O diff'in her karakteri — değişken adları, süslü
parantezler, boşluklar, satır numaraları — *içeri* giren token'lar olur ve botun yazdığı her
yorum *dışarı* çıkan token'lardır. Kaynak kod düz metinden "daha ağır" tokenize edilir:
insanların gözden kaçırdığı noktalama ve girinti her biri token harcar, yani 400 satırlık bir
diff, 400 satırlık bir makaleden çok daha fazla token olabilir.

**Neden "1 kelime ≠ 1 token."** Yaygın kelimeler genellikle tek bir token'a karşılık gelir,
ancak çoğu iki veya daha fazlaya bölünür ve kod daha da agresif şekilde bölünür. İngilizce düz
metin için kabaca bir kural **100 token ≈ 75 kelime** şeklindedir, ancak bu dile ve içeriğe göre değişir.

**Token'lar hatta neden önemlidir.** İki pratik sınır token cinsinden ölçülür:

- **Context sınırları.** Bir model aynı anda yalnızca sabit sayıda token'ı dikkate alabilir
  (kendi *context window*'u). Girdi ile çıktının toplamı buna sığmalıdır. Devasa bir üretilmiş
  dosya veya gürültülü bir günlük, pencereyi aşabilir ve tek bir çağrıya sığmaz.
- **Fiyatlandırma.** LLM kullanımı neredeyse her zaman **token başına** faturalandırılır ve
  sağlayıcılar genellikle **girdi ve çıktı token'ları için ayrı ayrı** ücret alır (çıktı çoğu
  zaman daha pahalıdır). Token sayılarını tahmin etmek, bir AI özelliğinin aylık maliyetini öngörme yolunuzdur.

**Tahmin etme ve sayma.** İlk geçiş için kabaca oranı kullanın, ancak maliyete duyarlı her şey
için seçtiğiniz modele uygun bir tokenizer ile tam olarak sayın.

## Her rol bunu nasıl kullanır

- **Developer:** Büyük bir dosyayı veya diff'i bir AI aracına göndermeden önce token sayılarını kontrol eder ve context window'a sığmayacak girdileri parçalara böler.
- **Project Manager:** Önerilen bir AI özelliğini (ör. otomatik bir inceleyici), istek başına token'ları istek hacmiyle ve token başına fiyatla çarparak bütçeler.
- **Infrastructure Engineer:** Beklenen token hacminden sağlayıcı kotasını ve maliyet zarfını planlar; böylece özellik kapasite ve bütçe içinde kalır.
- **Enterprise Architect:** Uzun günlükler veya izler bir AI aracına beslendiğinde token sınırlarını öngörür ve hattı girdileri bilinçli parçalayacak/kırpacak biçimde tasarlar.

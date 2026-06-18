# Maliyet, Latency ve Performans

Büyük bir dil modelini (LLM) çalıştırmak ne ücretsizdir ne de anlıktır. Neredeyse her
tasarım kararını iki pratik sayı şekillendirir: **bir isteğin maliyeti** ve **yanıt
süresi**. Her birini neyin belirlediğini anlamak, tahmin yürütmek yerine bir özelliği
ayarlayabilmenizi sağlar — ve bu, AI kendi yazılım geliştirme yaşam döngünüzün (SDLC)
içinde, her commit'te çalıştığında en çok önem kazanır.

**Bir SDLC örneği.** Bir ekip, her pull request'te CI içinde çalışan ve satır içi yorumlar
bırakan bir **AI kod inceleyici** ekler. Ekip genelinde günde onlarca kez çağrılır. Her
çalıştırma tüm diff'i artı çevredeki dosyaların binlerce satırını büyük bir modele
gönderir ve 30 saniye beklerse, iki şey bozulur: CI faturası her sprint'te yükselir ve
geliştiriciler merge edebilmeden önce yavaş bir kontrolü beklerler. Herhangi bir LLM
özelliğini ayarlayan aynı kaldıraçlar, bu inceleyicinin bir yardım mı yoksa bir vergi mi
olacağına karar verir.

**Maliyet.** LLM kullanımı token başına faturalandırılır, dolayısıyla kullanışlı bir
zihinsel model şudur: **maliyet ≈ token × token başına fiyat**. Sağlayıcılar **input
token'ları** (diff, talimatlar, getirilen kod) **ve output token'ları** (inceleme
yorumları) için **ayrı ayrı** ücret alır ve output genellikle token başına daha pahalıdır.

**Latency.** Bu, yanıttan önceki ve yanıt sırasındaki bekleme süresidir. Başlıca etkenler:
**model boyutu** (daha büyük model daha iyi akıl yürütür ama daha yavaş yanıtlar), **output
uzunluğu** (her seferde bir token), **ağ gidiş-dönüşleri** ve herhangi bir **ek pipeline
adımı** — dosya getirme, linter çağrıları, çok adımlı zincirler.

**Optimizasyon kaldıraçları.**

- **Prompt caching** — kararlı bir ön ek'i (inceleme kriterleri, kodlama standartları)
  yeniden kullanın, böylece her PR'de onu işlemek için yeniden ödeme yapmazsınız.
- **Daha kısa output'lar** — bir deneme yazısı değil, yalnızca en önemli sorunları isteyin;
  output, maliyet ve süreye hâkimdir.
- **Model routing** — küçük bir diff küçük ve ucuz bir modele gider; geniş çaplı bir
  yeniden düzenleme büyük bir modele gider.
- **Context'i kırpma** — tüm repository'yi değil, değişen parçaları (hunk) gönderin.
- **Streaming** — yorumlar geldikçe gösterin, böylece kontrol *hızlı hissettirir*.

**Denge üçgeni.** Kalite, maliyet ve latency birbirine karşı çeker. Daha büyük bir model
daha fazla hata yakalar ama daha pahalıdır ve daha yavaştır; agresif kırpma ucuz ve hızlıdır
ama sorunları kaçırabilir. İyi mühendislik, tek bir küresel ayar değil, her kontrol için
dengeyi seçer.

## Her rol bunu nasıl kullanır

- **Developer/Mühendis:** Her CI asistanı çağrısında token ve yanıt süresini ölçer,
  ardından PR kontrolünü hızlı ve bütçe içinde tutmak için caching, output sınırları ve
  routing uygular.
- **İş Analisti:** PR hacmi ile input ve output token karışımından aylık AI araç gereci
  harcamasını modeller; yavaş bir kontrolün ekibin merge iş akışını durduracağı durumları
  işaret eder.
- **PM/Ürün Sahibi:** AI araç gereci bütçesine sahip çıkar ve kalite/maliyet/latency
  dengesini belirler — örneğin rutin PR'lerde daha küçük bir modeli kabul ederek sürümlerde
  daha büyük bir modeli finanse eder.
- **QA ve Mimar:** Pipeline kontrolü için latency SLO'ları belirler, onu en yoğun commit
  yükü altında test eder ve asistanın maliyet ve süre hedefleri içinde kalması için
  caching/routing tasarımını yapar.

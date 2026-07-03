# Bölmeyi Tasarlamak: Hibrit Desenler, Maliyet ve Test

L1'de görev bazında karar vermeyi öğrendin: kesin kural → otomasyon, bulanık dil → AI ve kesin
ya da güvenli olması gerektiğinde → hibrit. L2'de hibriti *nasıl* iyi kuracağını, ölçekte ne
kadara mal olduğunu ve her iki yarıyı nasıl test edeceğini işliyoruz — çünkü bölme tek seferlik
bir seçim değil, bir tasarım kararıdır.

**Desen 1 — Çıkar-sonra-doğrula (extract-then-validate).** AI dağınık girdiyi yapılandırılmış
veriye çevirir; deterministik kod sonra o yapıyı kontrol eder. Model çeşitli faturaları okuyup
numara, tarih ve toplam döner; kod numaranın formatını, tarihin gerçek olduğunu ve toplamın
pozitif bir tutar olduğunu doğrular — başarısız olanı reddeder ya da işaretler. AI çeşitliliği
kaldırır; kural verinin kullanılabilir ve güvenli olduğunu garanti eder.

**Desen 2 — Sınıflandır-sonra-yönlendir.** AI bulanık girdiyi **sabit, bilinen** bir etiket
setinden birine atar; deterministik kurallar etikete göre iş yapar. Destek metni → dört niyetten
biri (AI) → lookup tablosuyla yönlendir (kod). Modeli izinli setle sınırla ve güven düşükse ya da
cevap sette yoksa güvenli bir varsayılana ("Diğer", "insan gerekli") düş.

**Desen 3 — Önce-deterministik, AI-yedek.** Ucuz, kesin yolu önce dene; AI'ı yalnızca o
başarısız olunca çağır. Bilinen bir tedarikçi şablonu mu? Kuralla ayrıştır (bedava, anlık).
Bilinmeyen düzen mi? *O zaman* modele düş. Bu, maliyeti ve gecikmeyi düşük tutar çünkü trafiğin
çoğu AI'a hiç dokunmaz ve zarif biçimde bozulur.

**Desen 4 — AI-önerir, insan-ya da-kural-karar-verir.** Yüksek riskli her şeyde AI çıktısı bir
*taslaktır*, asla nihai eylem değil. Bir insan onaylar ya da bir kural geçit tutar (eşik altı
tutar otomatik onaylanır; üstü inceleme gerektirir). AI'ın hızını, doğruluğu tek non-deterministik
çağrıya bağlamadan böyle elde edersin.

**Ölçekte maliyet, gecikme ve güvenilirlik.** AI-vs-otomasyon seçimi aynı zamanda bir operasyon
seçimidir. Her AI çağrısı para harcar ve gecikme ekler (çoğu zaman yüzlerce ms ile saniyeler);
deterministik kod fiilen bedava ve anlıktır. Günde 10 istekte fark gürültüdür; 10 milyonda
bütçeyi belirler. O yüzden bir kural yettiğinde işi deterministik yola it, AI çağrılarını
önbelleğe al ve grupla, modeli yalnızca gerçekten gereken girdi kesirine sakla. Güvenilirlik de
farklı: deterministik kod gürültülü ve aynı şekilde başarısız olur; AI *sessizce ve her seferinde
farklı* başarısız olabilir — bu yüzden çıktısı tek yeşil test değil, kontrol ve izleme ister.

**Her yarıyı — farklı — test etmek.** Deterministik kısımlar **kesin** test alır: X girdisinde
Y çıktısını doğrula, her seferinde. AI kısımları böyle test edilemez çünkü aynı girdi
değişebilir. Bunun yerine bir **değerlendirme seti** (temsili birçok girdi ve kabul edilebilir
cevaplar) kurar ve bir *oran* ölçersin — doğruluk ya da çıktının doğrulayıcılarını ne sıklıkta
geçtiği — bir eşiğe karşı, model ya da prompt değişince yeniden çalıştırarak. İkisini karıştırmak
— bir AI adımından tek kesin testi geçmesini beklemek ya da deterministik adımı yalnızca
"göz kararı" bırakmak — kararsız sistemlerin sık bir kaynağıdır.

**Hızlı karar çerçevesi.** Her görev için dört şeyi puanla: cevap **ne kadar kesin** olmalı,
girdi **ne kadar değişken**, yanlış cevap **ne kadar maliyetli** ve ne kadar **hacim**
bekliyorsun. Yüksek kesinlik + düşük değişkenlik → otomasyon. Yüksek değişkenlik + tolere
edilebilir hata → AI. Yüksek kesinlik *ve* yüksek değişkenlik → hibrit (çeşitlilik için AI,
kesinlik için kod). Yüksek hacim seni maliyeti kontrol etmek için önce-deterministik tasarıma
iter.

## Her rol bunu nasıl kullanır

- **Kurumsal Mimar / Geliştirici:** Deseni seçer (çıkar-sonra-doğrula, önce-deterministik,
  öner-sonra-geçit), AI/deterministik sınırını açıkça çizer ve her AI çıktısının etrafına
  doğrulayıcı ve yedek koyar.
- **Test Uzmanı / DevOps:** Deterministik kısımları kesin, AI kısımlarını değerlendirme seti ve
  eşikle test eder; üretimde AI maliyetini, gecikmesini ve geçme oranını izler — tek seferlik
  değil.
- **Proje / Portföy Yöneticisi:** Hacim ve maliyeti tartar — her istekte AI çağıran bir tasarım
  pilotta uygun, tam açılımda karşılanamaz olabilir.
- **Yönetişim:** AI girdi/çıktılarının loglanmasını, yüksek riskli kararlarda insan ya da kural
  geçidi ve hangi kısımların deterministik (denetlenebilir), hangilerinin AI olduğunun net
  kaydını ister.

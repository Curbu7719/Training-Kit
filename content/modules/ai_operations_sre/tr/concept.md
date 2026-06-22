# Agent Güdümlü SDLC ve Operasyonları İşletmek

AI güdümlü bir geliştirme sürecinde agent'lar artık yalnızca kod *yazmıyor*, onu **çalıştırıyor**
da. AI agent'ları operasyonun ve teslim hattının giderek daha büyük bir bölümünü üstleniyor: biri
PR açıyor, biri kırık derlemeleri ayıklıyor, bir nöbet (on-call) agent'ı bir alarmı alıp inceliyor
ve bir çözüm öneriyor — hatta uyguluyor. Sıradan bir AI özelliğinden en önemli fark şu: agent,
çağırıp çıktısını okuduğunuz bir araç değil; **sistemlerinizde eylem alan bir aktör.** Bu modül o
dünyaya nöbetçi gözüyle bakar: yazılımın üzerinde eylem alan agent'ları nasıl yönlendirir,
sınırlar, izler ve sorumluluğunu nasıl taşırsınız.

**Bir örnek.** Platform ekibiniz agent'ları sürece bağladı: kırık derlemeleri ayıklayan bir agent,
ölçekleme öneren bir altyapı agent'ı ve alarmları alıp salt-okunur araçlarla inceleyen, ardından
çözüm uygulayan bir nöbet agent'ı. Bu agent'ları geliştirmek bitti; artık yazılımın kendi üzerinde
eylem aldığı bir sistemi işletiyorsunuz — ve bu sistem, bir betiğin bozulmadığı şekillerde bozulur. Açmakta olduğumuz **kurum içi AI Agent platformu**nun her rolün eline verdiği dünya tam da budur — bu yüzden bu modüldeki kontroller, onu güvenle işletme şeklimizdir.

## Araçtan aktöre: otonomi değişimi

Çağrılan bir araç metin döndürür; onunla ne yapılacağına insan karar verir. Agent ise **eylemin
kendisini** yapar: servisi yeniden başlatır, yapılandırma gönderir, bir kümeyi ölçekler, alarmı
kapatır, komut çalıştırır. Böylece olası hatanın etki alanı artık "yanlış bir *yanıt*" değil; sabaha
karşı, kendinden emin ve hızlı verilmiş yanlış bir *eylem*. Güvenilir işletmek artık çıktı
kalitesiyle değil, **agent'ın neyi yapmasına izin verildiğini sınırlamakla** ilgilidir.

## Etki alanını sınırlayın: temel kontrol

Bir agent eylem alabildiği için asıl disiplin, yanlış bir eylemin verebileceği zararı sınırlamaktır:

- **En az yetki** — agent işini görecek en dar yetkiyi alır; varsayılan olarak yalnızca okur, yazma
  izni eylem türüne göre tek tek verilir, kalıcı bir yönetici anahtarı asla verilmez.
- **Ortam ayrımı** — test ortamında serbestçe eylem alabilir, ama üretimdeki eylemler onaydan geçer.
- **Önce planla, sonra uygula** — agent, hiçbir şey çalışmadan önce yapacağı değişikliği ve beklenen
  etkisini söyler.
- **Onay kapıları** — yıkıcı, geri alınamaz ya da üretime dokunan her eylem bir insanın onayını
  gerektirir. Düşük riskli, geri alınabilir eylemler kendi başına çalışabilir.

## Uygulamayı değil, agent'ı izleyin

Uygulama metrikleri servisin ayakta olduğunu söyler; ama agent'ın *yanlış* servisi yeniden
başlattığını söylemez. Bu yüzden bir **eylem günlüğüne** ihtiyacınız var: her adımda agent'ın ne
yaptığı, hangi araçları çağırdığı, ne gözlemlediği ve neden o kararı verdiği — yani gerekçesiyle
birlikte eylem kaydı, ilgili olaya bağlanabilir biçimde. "200 OK", agent'ın doğru şeyi yaptığının
kanıtı değildir.

## İnsan denetimi ve hesap verebilirlik

Otonomi düzeyini, eylemin etki alanına göre **eylem türü bazında** belirleyin:

- **Yalnızca öneri** — agent önerir, uygulamayı insan yapar (yüksek etkili ya da yeni davranışlar
  için uygundur).
- **Onayla ve uygula** — agent eylemi hazırlar, insan "uygula" der.
- **Otonom** — agent eylemi alır ve bildirir (yalnızca düşük riskli, geri alınabilir türler için).

Tüm agent otonomisini anında durduran bir **acil durdurma (kill-switch)**, net yükseltme (eskalasyon)
yolları ve **her eylemin sorumluluğunu bir insanın taşıdığı** kuralını yerleştirin. Olay sonrası bir
incelemede "agent yaptı" geçerli bir cevap değildir.

## Agent'lara özgü hata biçimleri

- **Döngüye girme** — agent başarısız bir eylemi durmadan tekrarlar; para yakar ya da zararı çoğaltır.
- **Kendinden emin ama yanlış çözüm** — yanlış bir teşhise göre kararlıca eylem alır ve olayı *daha
  da kötüleştirir* (sağlam bir servisi yeniden başlatıp asıl arızayı gizler).
- **Zincirleme eylemler** — bir otomatik düzeltme başka bir agent'ı ya da alarmı tetikler; kimsenin
  seçmediği bir zincir oluşur.
- **Bir saldırı yüzeyi olarak prompt injection** — özenle hazırlanmış bir günlük satırı, talep kaydı
  ya da hata mesajı agent'ı tehlikeli bir şey çalıştırmaya yönlendirir. Agent artık *eylem*
  alabildiği için bu yalnızca bir içerik riski değil, bir operasyon riskidir.

## Her rol bunu nasıl kullanır

- **DevOps Engineer:** En az yetkiyi, "önce planla" adımını ve onay kapılarını kurar; eylem günlüğünü ve acil durdurmayı inşa eder; döngüleri yakalamak için eylem hızına sınır koyar.
- **Infrastructure Engineer:** Ortam ayrımına ve agent eylemlerinin içinde çalıştığı kapasite ve izinlere sahiptir.
- **Developer:** Agent'ın araçlarını ve her eylemin etki alanı türünü tanımlar; anında geri alma için istem/araç değişikliklerini bayrak arkasında tutar.
- **Release Manager:** Hangi eylem türlerinin otonom çalışabileceğine, hangilerinin onay gerektireceğine karar verir; agent durup sorduğunda yükseltme yoluna sahip çıkar.
- **Security Engineer:** Girdiye güven sınırına ve yüksek-etkili eylemler için onay politikasına sahiptir; agent üretimde eylem almadan önce acil durdurmayı ve hata biçimlerini doğrular.
- **Governance:** Her agent eyleminden bir insanın hesap verebilir kaldığı kuralını tutar.

# Agent Güdümlü SDLC ve Ops İşletmek

AI güdümlü (AI-driven) bir SDLC'de agent'lar yalnızca kod *yazmaz* — giderek onu **çalıştırır**
da. AI agent'ları operasyon ve teslim hattı işinin giderek büyüyen bir kısmını üstleniyor: bir
kodlama agent'ı PR açar, bir CI agent'ı kırık build'leri triage eder, bir **on-call (nöbet)
agent'ı** bir alarm alır, araştırır ve bir düzeltmeyi önerir — ya da uygular. Normal bir AI
özelliğinden en kritik fark şudur: bir agent **çağırıp output'unu okuduğun bir araç değil; senin
sistemlerinde aksiyon alan bir aktördür.** Bu modül, *bu* dünyanın on-call bakış açısıdır:
yazılımın üzerinde aksiyon alan agent'ları nasıl yönlendirir, sınırlar, gözlemler ve onların
sorumluluğunu nasıl taşırsınız.

**Çalışan bir örnek.** Platform ekibiniz agent'ları SDLC ve ops'a bağladı: kırmızı build'leri
triage eden bir CI agent'ı, ölçekleme değişiklikleri öneren bir infra agent'ı ve alarmları alıp
okuma araçlarıyla araştıran ve remediation (düzeltme) yapan bir **on-call agent'ı**. Bu agent'ları
geliştirmek bitti; şimdi yazılımın giderek kendi üzerinde aksiyon aldığı bir sistemi işletiyorsunuz
— ve bu sistem, bir script'in başarısız olmadığı şekillerde başarısız olur.

## Araçtan aktöre — otonomi kayması

Çağrılan bir araç metin döndürür ve onunla ne yapılacağına bir insan karar verir. Bir **agent ise
aksiyonu alır**: bir servisi yeniden başlatır, bir config push'lar, bir cluster'ı ölçekler, bir
alarmı ack'ler, bir komut çalıştırır. Yani **blast radius (etki yarıçapı)** artık "yanlış bir
*yanıt*" değil — sabahın 3'ünde, kendinden emin ve hızlı alınmış yanlış bir *aksiyon*. Güvenilir
işletmek artık output kalitesiyle ilgili olmaktan çıkıp **agent'ın yapmasına izin verilen şeyi
sınırlamakla** ilgili hale gelir.

## Blast radius'u sınırla — temel kontrol

Bir agent aksiyon alabildiği için, merkezi disiplin yanlış bir aksiyonun verebileceği zararı
sınırlamaktır:

- **En az yetki (least privilege)** — agent işine yetecek en dar yetkiyi alır; **varsayılan olarak
  read-only (salt-okunur)**, yazma erişimi aksiyon sınıfı bazında verilir, asla sürekli duran bir
  admin anahtarı değil.
- **Ortam kapsamı (environment scoping)** — staging'de serbestçe aksiyon alır, ama production
  aksiyonları kapıdan geçer.
- **Plan-sonra-uygula / dry-run** — agent, herhangi bir şey çalışmadan önce somut değişikliği ve
  beklenen etkisini önerir.
- **Onay kapıları (approval gates)** — yıkıcı, geri alınamaz ya da production'a dokunan her şey bir
  insanın onay vermesini gerektirir. Düşük riskli, geri alınabilir aksiyonlar otonom çalışabilir.

## App'i değil, agent'ı gözlemle

App metrikleri sana servisin ayakta olduğunu söyler; agent'ın *yanlış* servisi yeniden
başlattığını söylemez. Bir **action audit trail'e (aksiyon denetim izi)** ihtiyacın var: her adımda
agent'ın ne **yaptığı** (hangi araçları çağırdığı), ne **gözlemlediği** ve **neden** karar verdiği
— muhakeme-artı-aksiyon izi, dokunduğu olayla ilişkilendirilebilir. "200 OK", agent'ın doğru şeyi
yaptığının kanıtı değildir.

## İnsan-döngüde (human-in-the-loop) ve hesap verebilirlik

Otonomi seviyesini **aksiyon sınıfı bazında**, blast radius'a göre belirle:

- **Suggest-only (yalnızca öner)** — agent önerir, bir insan uygular (yüksek etkili ya da yeni
  davranış için iyidir).
- **Approve-then-act (onayla-sonra-uygula)** — agent aksiyonu hazırlar, bir insan "git" der.
- **Otonom** — agent aksiyon alır ve bildirir (yalnızca düşük riskli, geri alınabilir sınıflar için).

*Tüm* agent otonomisini anında durduran bir **kill-switch**, net eskalasyon yolları ve **her aksiyon
için bir insanın hesap verebilir kaldığı** kuralını bağla. "Agent yaptı" bir postmortem'de bir cevap
değildir.

## Agent'a özgü failure modları

- **Döngü (looping)** — agent başarısız bir aksiyonu sonsuza dek dener, maliyet yakar ya da zararı
  tekrarlar.
- **Kendinden emin ama yanlış remediation** — yanlış bir teşhis üzerine kararlıca aksiyon alır ve
  olayı *daha kötü* yapar (sağlıklı bir servisi yeniden başlatır, gerçek arızayı maskeler).
- **Zincirleme aksiyonlar (cascading actions)** — bir otomatik düzeltme başka bir agent'ı ya da
  alarmı tetikler; hiçbir insanın seçmediği bir zincir.
- **Bir saldırı yüzeyi olarak prompt injection** — özenle hazırlanmış bir log satırı, ticket ya da
  hata mesajı agent'ı tehlikeli bir şey çalıştırmaya yönlendirir. Agent artık *aksiyon* alabildiğine
  göre, injection sadece bir içerik riski değil bir ops riskidir.

## Her rol bunu nasıl kullanır

- **DevOps / SRE ve Infrastructure Engineer:** En az yetkiyi, ortam kapsamını, dry-run ve onay
  kapılarını kurar, action audit trail'i ve kill-switch'i inşa eder ve döngüleri yakalamak için
  action-rate (aksiyon hızı) limitleri koyar.
- **Developer:** Agent'ın araçlarını ve her aksiyonun blast-radius sınıfını tanımlar ve anlık
  rollback için prompt/araç değişikliklerini flag'lerin arkasında tutar.
- **Release / Project Manager:** Hangi aksiyon sınıflarının otonom çalışabileceğine, hangilerinin
  onay gerektirdiğine karar verir ve bir agent durup sorduğunda eskalasyon yoluna sahip çıkar.
- **QA, Governance ve Security Engineer:** Onay politikasını, audit/hesap verebilirlik izini ve
  girdi-güven sınırını tasarlar ve bir agent production'da aksiyon almadan önce kill-switch'i ve
  failure modlarını doğrular.

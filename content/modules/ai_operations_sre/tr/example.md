# İşlenmiş Örnek: Bir Nöbet Agent'ını Üretime Almak

Ekibiniz bir **nöbet (on-call) agent'ı** geliştirdi: alarmları alır, salt-okunur araçlarla
(günlükler, metrikler, izler) inceler ve çözüm uygulayabilir. Geliştirmek bitti; şimdi onu güvenle
**işletmeniz** gerekiyor. İşte bir ekip onu nasıl ayağa kaldırır — ve agent'ın *kendi* yol açtığı
ilk olaydan nasıl sağ çıkar.

## Adım 1 — Agent'ın eylemlerini etki alanına göre sınıflandırın

Herhangi bir otonomi vermeden önce ekip, agent'ın yapabileceği her eylemi sıralar ve her tür için
bir insan denetimi düzeyi belirler:

| Eylem türü | Örnek | Otonomi düzeyi |
|---|---|---|
| Salt-okunur | Günlük, metrik, iz okuma | Otonom |
| Geri alınabilir, düşük etkili | Stateless servis yeniden başlatma, replica ölçekleme | Otonom (hız sınırlı) |
| Üretime dokunan, riskli | Bir dağıtımı geri alma, DB bağlantısını değiştirme | Onayla ve uygula |
| Yıkıcı / geri alınamaz | Veri silme, kaynak kaldırma, gelişigüzel komut çalıştırma | Yalnızca öneri |

## Adım 2 — Sınırlayın: en az yetki, önce planla, onay kapıları

Agent varsayılan olarak **salt-okunur** yetki alır; yazma izinleri **tür bazında** verilir ve bir
kapıdan geçmeden üretim eylemi yapılmaz. Her yazma **önce planla, sonra uygula** ilkesine tabidir —
agent önce yapacağı tam değişikliği ve beklenen etkisini söyler. Bir **acil durdurma (kill-switch)**
tüm otonomiyi tek tıkla durdurabilir; bir **eylem hızı sınırı** ise belirli bir sürede kaç eylem
alabileceğini kısıtlar.

## Adım 3 — Eylem günlüğünü kurun

Agent'ın attığı her adım bir kayıt bırakır: aldığı alarm, çağırdığı araçlar, gözlemlediği şey,
kararı ve **nedeni**, bir de alınan (ya da önerilen) eylem. Bu kayıt ilgili olaya bağlanabilir —
böylece bir insan sonradan agent'ın tam olarak ne yaptığını ve hangi gerekçeyle yaptığını görebilir.
Uygulama panoları her iki durumda da yeşil kalır; agent'ın *doğru* eylemi aldığını ancak eylem
günlüğüyle anlarsınız.

## Adım 4 — İlk olay agent'ın kendisidir

İki hafta sonra, stateless bir serviste "yüksek bellek" alarmı çalar. Agent'ın o geri alınabilir tür
için otonom yeniden başlatma izni vardır, bu yüzden servisi yeniden başlatır. Bellek yine tırmanır;
tekrar başlatır. Sebep gerçek bir **bellek sızıntısıdır** — ama agent belirtiyi tedavi ediyor,
**kendinden emin ama yanlış**, ve sızıntıyı gizleyen bir **yeniden başlatma döngüsüne** giriyor.

Onu kurtaran şey Adım 2'deki sınırlamadır:

1. **Eylem hızı sınırı devreye girer** — "10 dakikada aynı serviste 5 yeniden başlatma" → agent
   altıncı kez başlatmak yerine durur ve bir insana **yükseltir (eskalasyon)**.
2. **Nöbetçi**, o agent'ın otonomisi için **acil durdurmaya basar**.
3. **Eylem günlüğü** tekrarlanan aynı müdahaleyi gösterir; insan agent'ın belirtiyle uğraştığını
   anında görür, sızıntıyı bulur ve gerçek bir düzeltme gönderir.

Hiç veri kaybolmadı, yıkıcı bir eylem çalışmadı — çünkü yeniden başlatma geri alınabilir *ve* hız
sınırlıydı; agent haklı olduğu için değil.

## Adım 5 — Döngüyü kapatın

Bir **suçlamasız olay sonrası inceleme (postmortem)**: tetikleyici (bellek sızıntısı), işe yarayan
(hız sınırı + acil durdurma + eylem günlüğü) ve iki iyileştirme — "aynı çözüm N kez denendiyse → dur
ve yükselt" korumasını yerleşik hale getirmek ve "tekrarlanan yeniden başlatma"yı otonom türden
çıkarmak. Bu koruma, agent'ın politikasının kalıcı bir parçası olur.

**Ders.** Bunların hiçbiri daha akıllı bir agent ile ilgili değildi. Sistem güvende kaldı çünkü agent
**sınırlıydı** (en az yetki, yalnızca geri-alınabilir otonomi), **hız sınırlı ve acil
durdurulabilirdi** (döngü yakalandı), **izleniyordu** (eylem günlüğü yanlış eylemi açıkladı) ve
**işletiliyordu** (bir insan sorumluluğu taşıdı ve döngüyü kapattı). Bir agent geliştirmekle onu
üretimde çalıştırmak arasındaki fark budur.

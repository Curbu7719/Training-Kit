# İşlenmiş Örnek: Bir On-Call Agent'ı Üretime Almak

Ekibiniz bir **on-call (nöbet) agent'ı** geliştirdi: alarmları alır, read-only (salt-okunur)
araçlarla (loglar, metrikler, trace'ler) araştırır ve remediation (düzeltme) yapabilir. Geliştirmek
bitti; şimdi onu güvenle **işletmeniz** gerekiyor. İşte bir ekip onu nasıl ayağa kaldırır — ve
agent'ın *kendi* sebep olduğu ilk olaydan nasıl sağ çıkar.

## Adım 1 — Agent'ın aksiyonlarını blast radius'a göre sınıflandır

Herhangi bir otonomi vermeden önce ekip, agent'ın alabileceği her aksiyonu sıralar ve her sınıf
için bir insan-döngüde seviyesi belirler:

| Aksiyon sınıfı | Örnek | Otonomi seviyesi |
|---|---|---|
| Read-only | Log, metrik, trace okuma | Otonom |
| Geri alınabilir, düşük-blast | Stateless servis restart, replica ölçekleme | Otonom (rate limit'li) |
| Production'a dokunan, riskli | Bir deploy'u rollback, DB bağlantısı değiştirme | Approve-then-act |
| Yıkıcı / geri alınamaz | Veri silme, kaynak düşürme, gelişigüzel shell çalıştırma | Suggest-only |

## Adım 2 — Sınırla: en az yetki, dry-run, onay kapıları

Agent varsayılan olarak **read-only** yetkiler alır; yazma kapsamları **sınıf bazında** verilir ve
bir kapıdan geçmeden production aksiyonu yoktur. Her yazma **plan-sonra-uygula**'dır — agent önce tam
değişikliği ve beklenen etkiyi belirtir. Bir **kill-switch** tüm otonomiyi tek tıkla durdurabilir ve
bir **action-rate (aksiyon hızı) limiti** belli bir pencerede kaç aksiyon alabileceğini sınırlar.

## Adım 3 — Action audit trail'i enstrümante et

Agent'ın aldığı her adım bir kayıt yayar: aldığı alarm, çağırdığı araçlar, gözlemlediği şey, kararı
ve **nedeni**, ve alınan (ya da önerilen) aksiyon. Bu iz olayla ilişkilendirilebilir — böylece bir
insan sonradan agent'ın tam olarak ne yaptığını ve hangi muhakemeyle yaptığını görebilir. App
panoları her iki durumda da yeşil kalır; agent'ın *doğru* aksiyon aldığını ancak audit trail ile
bilirsin.

## Adım 4 — İlk olay agent'ın kendisidir

İki hafta sonra, stateless bir serviste "yüksek bellek" alarmı çalar. Agent'ın o geri alınabilir
sınıf için otonom restart'a izni var, bu yüzden servisi yeniden başlatır. Bellek tekrar tırmanır;
yeniden başlatır. Sebep gerçek bir **bellek sızıntısıdır (memory leak)** — ama agent semptomu tedavi
ediyor, **kendinden emin ve yanlış**, ve sızıntıyı maskeleyen bir **restart döngüsüne** giriyor.

Onu kurtaran şey, Adım 2'deki sınırlamadır:

1. **Action-rate limiti devreye girer** — "10 dakikada bir serviste 5 restart aksiyonu" → agent
   altıncı kez yeniden başlatmak yerine durur ve bir insana **eskalasyon** yapar.
2. **On-call insan**, o agent'ın otonomisi için **kill-switch'e basar**.
3. **Audit trail** tekrarlanan aynı remediation'ı gösterir, böylece insan agent'ın semptomla
   savaştığını anında görür, sızıntıyı bulur ve gerçek bir düzeltme gönderir.

Hiç veri kaybolmadı ve yıkıcı bir aksiyon çalışmadı — çünkü bir restart geri alınabilirdi *ve*
rate-limit'liydi, agent haklı olduğu için değil.

## Adım 5 — Döngüyü kapat

Bir **suçlamasız (blameless) postmortem**: tetikleyici (bellek sızıntısı), işe yarayan (rate limit +
kill-switch + audit trail) ve iki iyileştirme — "aynı remediation N kez → dur ve eskalasyon yap"
korumasını yerleşik hale getirmek ve "tekrarlanan restart"ı otonom sınıfından çıkarmak. Bu koruma
agent'ın politikasının kalıcı bir parçası olur.

**Ders.** Bunların hiçbiri daha akıllı bir agent ile ilgili değildi. Sistem güvende kaldı çünkü agent
**sınırlıydı** (en az yetki, yalnızca-geri-alınabilir otonomi), **rate-limit'li ve kill-switch'liydi**
(döngü yakalandı), **gözlemleniyordu** (audit trail yanlış aksiyonu açıkladı) ve **işletiliyordu** (bir
insan hesap verebilir kaldı ve döngüyü kapattı). Bir agent geliştirmek ile onu üretimde çalıştırmak
arasındaki fark budur.

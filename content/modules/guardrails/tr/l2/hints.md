# İpuçları — Guardrail'ler (L2)

## Temel fikrin alternatif ifadeleri

- Guardrail'leri eylem öncesi, eylem içi ve eylem sonrası kontrol noktaları olan bir hat olarak
  ele alın ve her kontrolü en düşük maliyetle en fazla bağlama sahip olduğu yere yerleştirin.
- Her guardrail kararı güvenliği, geliştirici hızını (yanlış pozitifler) ve maliyeti/gecikmeyi
  ödünleştirir — olgun tasarımlar bunu tek bir kör ayarla değil, risk katmanı başına ayarlar.
- Dolaylı prompt injection, agent'ın okuduğu veriler (issue'lar, bağımlılık dosyaları, açtığı
  kaynak) üzerinde gelir, bu yüzden girdi doğrulama tek başına asla yeterli olamaz.

## İpucu yığını

- **H1 (dürtme):** Bir kontrolün agent'ın yaşam döngüsünde *nerede* çalıştığını ve orada *neyi
  görebildiğini* sorun. Bir kontrol yalnızca gerçekten incelediğini engelleyebilir.
- **H2 (yapısal):** Dolaylı injection talimatları depo veya araç içeriğinde gizler, bu yüzden
  eylem öncesi bir issue kontrolü ona kördür. Hangi katmanlar agent'ın *etrafında* ve
  *sonrasında* çalışır — ve neyi kısıtlarlar?
- **H3 (cevaba yakın):** En az ayrıcalıklı sandboxing (agent `.env`'i okuyamaz veya ağa
  ulaşamaz) artı eylem sonrası secret tarama ve insan incelemesi, injection geldiğinde bile
  tehdidi kontrol altına alır, çünkü hiçbir tek katman tek başına güvenilir değildir.

## SSS

**S: Issue metnini doğrularsak, neden daha fazla katman ekleyelim?**
Çünkü injection, issue değil, agent'ın okuduğu dosyalarda gelebilir. Girdi doğrulama o içeriği
asla incelemez, bu yüzden bağımsız eylem içi ve eylem sonrası kontroller hâlâ gereklidir.

**S: Çok katı olmanın maliyeti nedir?**
Aşırı engelleme. Güvenli işlemleri reddeden bir komut filtresi geliştiricileri yavaşlatır ve
onları agent'ı devre dışı bırakmaya veya kurallarını zayıflatmaya teşvik eder — bu yüzden
engellenen eylemler yalnızca daha yükseğe yığılmaz, günlüklenir ve ayarlanır.

**S: Model iyi davranıyorsa neden en az ayrıcalıklı sandbox?**
Çünkü başarılı bir injection veya basit bir hata bile zararsız olmalıdır. Agent sır'ları okuyamaz
veya ağa ulaşamazsa, hangi şeyi yapmaya kandırıldığına bakılmaksızın dışarı sızdıramaz veya yok edemez.

**S: Guardrail'ler hiç 'bitmiş' olur mu?**
Hayır. Zaman içinde yeni injection ve atlatma kalıpları ortaya çıkar, bu yüzden ekipler sürekli
izler, günlükler, red-team yapar ve reddetme listelerini, sandbox kapsamlarını ve inceleme
eşiklerini günceller.

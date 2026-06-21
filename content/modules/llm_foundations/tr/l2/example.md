# İşlenmiş Örnek: Modelleri Bir Geliştirme Toolchain'ine Eşlemek

Ekibin dört AI çağrı noktası çalıştırıyor. Hepsini tek bir modele bağlamak yerine, her birini bir
model tipine ve ayarlarına eşliyor — sonra zor vakaları route ediyorsun. Mantığı şöyle.

## Dört çağrı noktası

| Çağrı noktası | İhtiyaç | Model seçimi | Ayarlar |
|---|---|---|---|
| Satır-içi kod tamamlama | Anlık, yüksek-hacim, rutin | Küçük hızlı model | Düşük temp, küçük max-token, blok sonunda stop |
| Otomatik PR inceleyici | Sağlam kalite, her PR'da | Orta model + route | Düşük temp; büyük/karmaşık diff'leri yükselt |
| Doküman sohbet asistanı | Topraklı cevap, etkileşimli | Orta model + RAG | Düşük temp, streaming |
| "Bu tasarımı düşün" | Nadir, gerçekten zor | Reasoning model | Daha yüksek token bütçesi, acele yok |

## Neden bunlar, neden hepsine tek model değil

**Tamamlama** günde binlerce kez çalışır; buraya bir reasoning model koymak hiçbir fayda olmadan
yavaş ve fahiş pahalı olur — görev rutindir. **PR incelemesi** route'un işe yaradığı yerdir: küçük
bir diff orta modele gider, ama dağınık bir refactor yalnızca gerektiğinde daha güçlü bir modele
yükseltilir. **Tasarım yardımcısı**, bir reasoning model'in maliyetini hak ettiği tek yerdir —
nadirdir ve problem zordur. *O* modeli her yerde kullanmak tamamlamayı kullanılamaz hale getirir.

## Decoding kontrollerini ayarlamak

Kod taşıyan noktalarda **temperature'ı düşük** tutarsın — yaratıcı çeşitlilik değil, tekrarlanabilir
odaklı çıktı istersin. İnceleyici bir deneme değil, en önemli sorunları döndürsün diye **max output
token'ı** sınırlar ve tamamlama kod bloğunda temiz bitsin diye bir **stop sequence** koyarsın.
Yalnızca beyin-fırtınası tarzı bir yardımcı daha yüksek temperature'ı hak eder.

## Yanlış yol (ve nedeni)

Bir takım arkadaşı "en büyük, en yeni modeli her yerde varsayılan ayarlarla kullanalım — en basiti"
diyor. Basit görünür ama: tamamlama yavaş ve pahalı olur, PR faturası her sprint tırmanır, varsayılan
(çoğu zaman daha yüksek) temperature kod çıktısını çalıştırmadan çalıştırmaya oynatır ve yine
halüsinasyonlara çarparsın. Konfigürasyondaki basitlik sana maliyet, gecikme ve tutarsızlık olarak döner.

## Ders

"AI" diye tek bir şey yok — bir filo var. **Model tipini** (reasoning vs hızlı, küçük vs büyük) ve
**decoding kontrollerini** (temperature, max-token, stop) her göreve eşlemek ve yalnızca zor vakaları
daha güçlü bir modele **route etmek**, bir toolchain'i hızlı, uygun maliyetli ve tutarlı tutan şeydir.
Bu, tek bir modeli çağırmak değil; modelleri seçmek ve kontrol etmektir.

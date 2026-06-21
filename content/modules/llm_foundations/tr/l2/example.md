# İşlenmiş Örnek: Modelleri Bir Geliştirme Araç Zincirine Eşlemek

Ekibin dört AI çağrı noktası çalıştırıyor. Hepsini tek bir modele bağlamak yerine, her birini bir
model tipine ve ayarlarına eşliyor — sonra zor durumları yönlendiriyorsun. Mantığı şöyle.

## Dört çağrı noktası

| Çağrı noktası | İhtiyaç | Model seçimi | Ayarlar |
|---|---|---|---|
| Satır içi kod tamamlama | Anlık, yüksek hacim, rutin | Küçük hızlı model | Küçük maksimum çıktı, blok sonunda durdurma |
| Otomatik PR inceleyici | Sağlam kalite, her PR'da | Orta model + yönlendirme | Sınırlı çıktı; büyük/karmaşık diff'leri yükselt |
| Doküman sohbet asistanı | Topraklı cevap, etkileşimli | Orta model + RAG | Akış (streaming) |
| "Bu tasarımı düşün" | Nadir, gerçekten zor | Akıl yürüten model | Daha yüksek token bütçesi, acele yok |

## Neden bunlar, neden hepsine tek model değil

**Tamamlama** günde binlerce kez çalışır; buraya akıl yürüten bir model koymak hiçbir fayda olmadan
yavaş ve fahiş pahalı olur — görev rutindir. **PR incelemesi** yönlendirmenin işe yaradığı yerdir:
küçük bir diff orta modele gider, ama dağınık bir refactor yalnızca gerektiğinde daha güçlü bir
modele yükseltilir. **Tasarım yardımcısı**, akıl yürüten bir modelin maliyetini hak ettiği tek
yerdir — nadirdir ve problem zordur. *O* modeli her yerde kullanmak tamamlamayı kullanılamaz hale
getirir.

## Çıktı denetimlerini ayarlamak

İnceleyici bir deneme değil en önemli sorunları döndürsün diye **maksimum çıktı uzunluğunu** sınırlar
ve tamamlama kod bloğunda temiz bitsin diye bir **durdurma dizisi** koyarsın. Bunlar, hangi modelin
çalıştığını değiştirmeden çıktının uzunluğunu ve biçimini ayarlar.

## Yanlış yol (ve nedeni)

Bir takım arkadaşı "en büyük, en yeni modeli her yerde kullanalım — en basiti" diyor. Basit görünür
ama: tamamlama yavaş ve pahalı olur, PR faturası her sprint tırmanır ve yine halüsinasyonlara
çarparsın. Konfigürasyondaki basitlik sana maliyet ve gecikme olarak döner.

## Ders

"AI" diye tek bir şey yok — bir filo var. **Model tipini** (akıl yürüten/hızlı, küçük/büyük) ve
**çıktı denetimlerini** (maksimum uzunluk, durdurma dizileri) her göreve eşlemek ve yalnızca zor
durumları daha güçlü bir modele **yönlendirmek**, bir araç zincirini hızlı, uygun maliyetli ve
tutarlı tutan şeydir. Bu, tek bir modeli çağırmak değil; modelleri seçmek ve kontrol etmektir.

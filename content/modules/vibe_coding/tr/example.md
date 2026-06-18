# İşlenmiş Örnek: Aynı Özelliği Vibe-Code Etmenin İki Yolu

**Görev.** Maya'nın bir web uygulamasına "parola sıfırlama" endpoint'i eklemesi gerekiyor. Bunu
vibe-code etmeye karar veriyor — bir AI asistanına kodu yazdırmaya. Maya'nın iki versiyonu işe
girişiyor.

**Dikkatsiz Maya.** Şunu yazıyor: *"uygulamama parola sıfırlama ekle."* AI üç dosyaya dokunan ~120
satır döndürüyor: bir route, bir e-posta gönderici ve bir token deposu. Makul göründüğü için
yapıştırıyor, sunucunun başladığını görüyor ve "parola sıfırlama tamam" başlıklı bir pull request
açıyor. Token mantığını hiç okumadı. İki gün sonra: sıfırlama token'ları asla sona ermiyor (yani
eski bir link sonsuza dek çalışıyor), e-posta parolası commit edilen dosyaya gömülü ve token,
kullanıcı girdisiyle sabit-zamanlı kontrol olmadan `==` ile karşılaştırılıyor. Diff büyüktü,
okunmamıştı ve test edilmemişti — hatalar vibe üzerine gönderildi.

**Disiplinli Maya.** Niyetten başlıyor: *"tek kullanımlık bir sıfırlama token'ı e-postalayan, token
15 dakikada sona eren, tek kullanımlık, kodda sır olmayan bir endpoint."* Her seferinde tek bir
parça için prompt yazıyor. Önce token modeli — diff'i **okuyor**, AI'ın var olmayan bir
`crypto.randomToken()` API'si uydurduğunu fark ediyor ve bunu söylüyor; AI düzeltiyor. Çalıştırıyor,
commit ediyor. Sonra e-posta adımı — SMTP parolasını prompt'a değil bir environment variable'da
tutuyor. Ardından AI'dan sona erme için bir test yazmasını istiyor, **çalıştırıyor** ve geçtiğini
izliyor. Her adım, tamamen anladığı küçük, review edilmiş, commit edilmiş bir diff. AI mailer
yapılandırmasında bir döngüde tahmin etmeye başlayınca **direksiyonu alıyor** ve kendisi bağlıyor.

**Aynı araç, zıt sonuçlar.** İkisi de kodu yazmak için AI kullandı. Fark Maya'nın disiplininde
idi: açık niyet, küçük adımlar, her diff'i okumak, güvenlik ağı olarak test'ler ve version control,
sır'ları dışarıda tutmak — ve prompt yazmayı ne zaman bırakıp devralacağını bilmek.

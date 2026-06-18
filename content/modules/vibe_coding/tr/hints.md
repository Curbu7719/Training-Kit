# İpuçları — Vibe Coding'i Doğru Yapmak

## Temel fikrin alternatif ifadeleri

- Vibe coding, bir AI'a kodunuzu yazdırmaya yön vermektir — ve bunu *doğru* yapmak pilot kalmak
  demektir: açık niyet girer, küçük adımlar atılır ve siz her diff'i landing etmeden önce okuyup
  anlarsınız.
- Bu, korkuluklu prompt → çalıştır → doğrula → düzelt döngüsüdür: güvenlik ağınız olarak test'ler
  ve version control, prompt'lardan uzak tutulan sır'lar ve açıklayamadığı kodu asla göndermeyen bir
  insan.
- İyi de yapsanız kötü de yapsanız araç aynıdır; iki yolu ayıran şey disiplindir (önce spec, küçük
  review edilebilir diff'ler, çıktıyı okumak, AI dönerken direksiyonu almak).

## İpucu yığını

- **H1 (dürtme):** En hızlı görünen kestirme — AI'ın çıktısını "doğru görünüyor" diye yapıştırmak —
  sonradan ısıran kestirmedir. Bu hangi adımı atlar?
- **H2 (yapısal):** Döngüyü haritalandırın: *niyet/spec* → *küçük prompt* → *çalıştır/test* →
  *diff'i oku & anla* → *review/commit*. Dikkatsiz vibe coding hangi adımları düşürür ve düşürülen
  her adım hangi hatanın geçmesine izin verir?
- **H3 (cevaba yakın):** Pazarlık edilemez kural şudur: **anlamadığınız kodu asla göndermeyin.**
  Diff'i okumak, test'ler ve version control, hataların erken ortaya çıkması ve geri alınabilir
  olması için vardır — sizi güvenli bir şekilde hızlı yapan da budur, okunmamış çıktı değil.

## SSS

**S: Her diff'i okumak yavaş değil mi? Bütün mesele hız.**
Okumak, onu güvenli bir şekilde hızlı *yapan* şeydir. Okunmamış çıktı, sonradan debug etmenin
review'a harcanan dakikalardan çok daha pahalıya mal olduğu sessiz hatalar gönderir. Küçük diff'ler
okumayı ucuz tutar.

**S: Kod çalışıyor ve doğru görünüyor — bu yeterli değil mi?**
Hayır. "Çalışıyor" ve "doğru görünüyor" en tehlikeli hataları kaçırır: makul-ama-bozuk mantık,
etrafta derlenen halüsinasyon API'ler, eksik yetki veya asla sona ermeyen token'lar. Test'ler ve
gerçek bir okuma bunları yakalar; vibe yakalamaz.

**S: Prompt yazmayı ne zaman bırakıp kendim yazmalıyım?**
AI döndüğünde, aynı düzeltmeyi yeniden tahmin ettiğinde veya var olmayan API'ler uydurduğunda. Bu,
direksiyonu alma sinyalidir — prompt → çalıştır → doğrula → düzelt, ve düzeltme yakınsamayı
bıraktığında siz sürersiniz.

**S: Bir prompt'a asla ne girmemeli?**
Sır'lar ve hassas veri — API anahtarları, parolalar, müşteri PII'si. Bunları environment
variable'larda veya bir secret store'da tutun ve commit etmeden önce üretilen kodu gömülü kimlik
bilgileri ve güvensiz desenler için review edin.

**S: Kodun çoğunu AI yazdıysa kod tabanını nasıl tutarlı tutarım?**
Mimariyi kendiniz tutun: prompt'larınızda projenin desenlerini uygulayın, sapan diff'leri
reddedin ve sistemi kimsenin anlamadığı bir üretilmiş kod yığını değil, ekibin akıl
yürütebileceği bir şey olarak kalacak şekilde refactor edin.

# İşlenmiş Örnek: AI'ı Gerçek İşte Kullan ama Sızdırma

Gerçek bir hatada AI'dan yardım istiyorsun; bu da gerçek kod, gerçek bir stack trace, belki gerçek bir müşteri kaydı yapıştırmak demek. Yardım buna değer — ama her yapıştırma, kontrolünden çıkan veridir. İşte hızlanmayı alıp olayı almamanın yolu.

**Refleks: hata veren satırı olduğu gibi yapıştırmak.** Bir hatayı yeniden üretmek, gerçek production veritabanı satırıyla en kolaydır. *Risk:* o satırda bir müşterinin e-postası ve kart son-dört hanesi var ve artık bir tedarikçinin loglarında, belki sınır ötesinde yaşıyor. *Hamle:* azalt ve maskele — şemayı ve aynı yapıda sahte bir satır yapıştır. *Peki neden hâlâ AI?* Mantığı, gerçek PII'den olduğu kadar gerçekçi bir sahte kayıttan da pekâlâ ayıklar — açıktan başka kaybın olmaz.

**Kayma: snippet'teki API anahtarı.** "Bu neden patlıyor" diye bir config bloğunu, anahtarıyla birlikte yapıştırırsın. *Neden önemli?* O anahtar artık sonsuza dek başkasının sistemindedir. *Hamle:* bir secret taraması (ya da sadece bir alışkanlık) prompt makineni terk etmeden kimlik bilgilerini sıyırır — cevabını yine de alırsın.

**Kolaylık tuzağı: rastgele bir ücretsiz chatbot.** Elinin altında, sen de içine kurum içi kod yapıştırırsın. *Risk — "gölge AI" (shadow AI):* kurumsal sözleşme yok, zero-retention yok, kodun bir sonraki modeli eğitebilir. *Doğru yolla neden AI?* Onaylı araç aynı yardımı bir no-train ayarı *ile* verir — aynı hız, sıfır açık.

**Kontrol sende kalsın.** Enter'a basmadan önce tek soru sor: "Bu metin aynen bir tedarikçinin eğitim setinde belirse rahat olur muyum?" Olmazsan, önce maskele.

**Özet:** AI'ın yardımı ile veriyi güvende tutmak arasında seçim yapmak zorunda değilsin. Modelin yardım etmesine yetecek en az veriyi gönder, secret ve PII'yi sıyır ve onaylı aracı kullan — taçlarını bir yabancıya vermeden hızlanmayı al.

# İşlenmiş Örnek: AI'a Tüm Repoyu Yapıştırmayı Bırak

Beş dosyaya dokunan bir özelliği yeniden düzenliyorsun. İlk akla gelen, AI'ın "her şeye sahip olması" için tüm repoyu sohbete yapıştırmak — ama onu tam da yavaş, pahalı ve unutkan yapan şey bu. İşte context window'u düşünmek kendi gününü nasıl kolaylaştırır.

**Angarya: çok dosyalı değişiklik için AI'ı beslemek.** 30 dosya yapıştırıp düzenlemeyi istersin ve cevap yarıda kesilir. *Neden?* Context window, **gönderdiğin ile geri yazdığının** paylaştığı tek bir bütçedir — ihtiyacın olmayan kaynakla doldurursan, asıl istediğin koda yer kalmaz. O yüzden yalnızca değişikliğin dokunduğu beş dosyayı gönderirsin ve cevap birden bütün gelir.

**Sürpriz: "ama bunu daha önce söylemiştim."** Birinci mesajda bir kural koyarsın ("`legacy_id` sütun adını koru"), on mesaj sonra AI yine de yeniden adlandırır. *Neden?* Her çağrı **durumsuzdur (stateless)** — model yalnızca şu an pencerede olanı bilir; araç yeniden göndermezse eski mesajlar yok olmuştur. O yüzden vazgeçilmez kuralı "hatırlamasına" güvenmek yerine, önemli olan mesajda yeniden yazarsın.

**Günü kurtaran çözüm: kısa bir özet.** Uzun bir tasarım tartışmasını tekrar yapıştırmak yerine üç satırlık bir özet yazarsın — alınan kararlar, korunacak adlar, kalan işler — ve onu yapıştırırsın. *Peki neden AI?* Çünkü artık AI derli toplu, doğru bir brief'ten çalışır ve sürekli taşan bir pencereyi düşünmeye yeri olan bir pencereye çevirmiş olursun.

**Kontrol sende kalsın.** Büyük pencere hafıza demek değildir. Bir kısıt önemliyse, onu önemli olduğu istek için pencerenin *içine* koy — hayatta kaldığını varsayma.

**Özet:** AI'a her şeyi değil, *doğru* dilimi verirsin. Bilinçli gönderilen daha az bağlam, kurallarına uyan eksiksiz bir cevap getirir — üstelik daha ucuza.

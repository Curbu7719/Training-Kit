# İşlenmiş Örnek: AI İşini Ne Zaman Kolaylaştırır — Ne Zaman Kolaylaştırmaz, Bil

Elinin altında AI var, o yüzden refleks onu her işe atmak. Ama on satır düz kodun yapacağı yerde modele uzanmak, en yaygın ve pahalı hatalardan biridir. İşte AI'ın gününü gerçekten kolaylaştırdığını mı yoksa sadece yavaşlatıp pahalılaştırdığını mı ayırt etmenin yolu.

**Tuzak: kesin, bilinen bir kural için AI.** Bir modele e-posta formatı doğrulatmak ya da vergi hesaplatmak istersin. *Bu neden yanlış karar?* Bunların tek bir kesin cevabı var ve AI **belirsizdir (non-deterministic)** — aynı girdi, muhtemelen farklı çıktı. Düz kod daha ucuz, anında, test edilebilir ve *her seferinde aynı cevabı* verir. *Burada neden "AI"? Kullanmazsın.* Bunu fark etmek, bir hesap makinesinin bedava yaptığı şeyin yavaş ve titrek bir sürümünden seni kurtarır.

**Uygun olan: belirsiz, yargı biçimli iş.** "Bu 500 destek kaydını oku ve temaları söyle" sorusunun kesin bir cevabı yok ve elle saatler sürerdi. *Burada neden AI?* Dil biçimli ve yargı ağırlıklı — modelin tam da parladığı ve *muhtemelen-doğru'nun hiçten iyi olduğu* yer. Değişkenliğe katlanırsın çünkü alternatif 500 kaydı kendin okumak.

**Üç şeyi dürüstçe tart.** İş gerçekte ne kadar **doğruluk** gerektiriyor, ne kadar **belirsizliğe** katlanabilirsin ve gerçek hacminde **çağrı başına maliyet** ne? *Bu gününü neden kolaylaştırır?* "AI kullanmalı mıyım?"ı bir histen hızlı, tekrarlanabilir bir kontrole çevirir — böylece kod isteyen işe bir modeli (ve parayı) harcamayı bırakırsın.

**Sonra nasıl tedarik edeceğine karar ver.** AI uyduğunda, hız için bir API çağır, zaten varsa bir SaaS özelliği satın al, yalnızca verin ve ihtiyacın varsa fine-tune et. *Neden?* Çoğu zaman bir API çağrısı, hiçbir şey inşa etmeden seni bugün oraya götürür.

**Özet:** beceri "AI kullan" değildir — *nerede* yardımcı olduğunu bilmektir. Kesin kurallar için deterministik kod, belirsiz yargı için AI ve karar için üçlü kontrol (doğruluk, değişkenlik, maliyet). AI'ın, çözülmüş bir problemi süslemek yerine işini kolaylaştırmasının yolu budur.

# İşlenmiş Örnek: AI Kod Asistanıyla Hızlı Gönder — İpin Ucunu Kaçırmadan

Artık bir AI'a kodu yazdırıp çalışan bir sonuca yönlendirebilirsin. İyi yapıldığında, şimdiye dek gönderdiğin en hızlı yoldur. "Doğru görünen" her şeyi kabul ederek yapıldığında ise elinde kimsenin anlamadığı kod ve bulamadığın hatalar kalır. Fark araç değil — disiplindir. İşte hem hızı hem kontrolü tutmanın yolu.

**Bir histen değil, niyetten başla.** Prompt'lamadan önce davranışı, girdileri, çıktıları, uç durumları bilirsin — "bir kullanıcının son 10 siparişini döndüren, sayfalı bir endpoint ekle." *Bu gününü neden kolaylaştırır?* Net, küçük bir spec AI'a bir hedef *ve* sana sonucu kontrol etme yolu verir. "Daha iyi yap" ikisini de vermez ve öğleden sonrayı yeniden prompt'layarak yakarsın.

**Küçük, incelenebilir adımlarla çalış.** Bir değişiklik, çalıştır, sonra bir sonraki. *AI'ı neden böyle kullan?* Küçük diff'ler okunması, test edilmesi ve geri alınması kolaydır; dev bir üretilmiş blob hiçbiri değildir — ve yanlış olduğunda nerede olduğunu söyleyemezsin. Hızlı ama *güvenli* gitmeni sağlayan küçük adımlardır.

**Anlamadığın kodu asla gönderme.** Bu, temel kuraldır. Üretilen bir fonksiyonun ne yaptığını açıklayamıyorsan, onu sürdüremez ya da ona güvenemezsin. *AI yazmış olsa bile bu neden önemli?* Çünkü merge ettiğin an o *senindir* — diff'i okumak isteğe bağlı bir cila değil, işin ta kendisidir.

**Bir güvenlik ağı tut.** Çalışan durumları sık commit'le, testleri çalıştır ya da üret, merge'den önce diff'i incele. *Neden?* Ağ, AI'ın hızını kabul etmeni sağlayan tam da şeydir — hatalar anında yüzeye çıkar ve geri alınabilir, böylece hızlı gitmek pervasız olmaktan çıkar.

**Özet:** vibe coding seni disipline rağmen değil, disiplin *sayesinde* hızlandırır. Net niyet, küçük adımlar, her diff'i oku ve bir test-ve-commit güvenlik ağı — bir AI asistanının bir borç makinesi yerine bir güç çarpanı olmasının yolu budur.

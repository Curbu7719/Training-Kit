# İşlenmiş Örnek: AI Aracın Neden Birden Çok Pahalılaşır (ya da Kesilir)

AI araçlarıyla yaşanan iki günlük sürpriz aynı şeye dayanır — token'lara — ve bunu bilmek sana para ve yarım kalan cevaplar kazandırır.

**Sürpriz 1: fatura tırmanıyor.** Ekibinin PR-inceleme botu her pull request'te çalışıyor ve aylık maliyet artıyor. *Neden?* Token başına faturalanırsın ve kod ağır tokenize olur — 400 satırlık bir diff göründüğünden çok daha fazla token'dır ve output, input'tan pahalıdır. Bunu bilince yalnızca değişen kısımları gönderir ve çıktıyı en önemli sorunlarla sınırlarsın — fatura düşer, özellik kaybı olmaz.

**Sürpriz 2: büyük dosya kesiliyor.** Devasa bir dosya yapıştırırsın, cevap yarıda kesilir. *Neden?* Girdi ve çıktı tek bir context window'u paylaşır; pencereyi girdiyle doldurup cevaba yer bırakmadın. Bunu bilince dosyayı parçalar ya da yalnızca ilgili kısmı gönderirsin.

**Taahhütten önce öngör.** Yeni bir AI adımı bağlamadan önce birkaç örnekte modelin tokenizer'ıyla gerçek token say ve ne sıklıkta çalışacağıyla çarp — böylece ay sonunda fatura şoku olmaz.

**Türkçe'ye özgü bir püf.** Aynı metin Türkçe'de İngilizce'den belirgin biçimde daha fazla token'a mal olur; aracın Türkçe işliyorsa fazlasını bütçele.

**Neden uğraşayım?** Çünkü "AI pahalandı" ve "AI cevabımı kesti", token'larla düşününce ikisi de önlenebilir — aracı korur, sürprizlerden kurtulursun.

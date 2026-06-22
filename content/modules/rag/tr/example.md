# İşlenmiş Örnek: AI Hayal Gücünden Değil, Kod Tabanından Cevap Versin

Asistana "kendi iç API'mizde sonuçları nasıl sayfalıyoruz?" diye sorarsın ve kendinden emin biçimde var olmayan bir endpoint uydurur. Reponu hiç görmedi — hafızasından cevap veriyor. **RAG** tam da bunu çözer ve AI'ı *senin* kodunda makul bir yalancıdan işe yarar bir takım arkadaşına çeviren şeydir.

**Sorun: model senin şeylerini hiç okumadı.** Eğitim verisi bir kesim tarihinde durdu ve wiki'ni, standartlarını ya da geçen sprint'in ADR'sini hiç içermedi. *Neden bu kadar emin yalan söylüyor?* Çünkü hafızadan cevap veriyor ve iç API'n o hafızada hiç yoktu. O yüzden makul-ama-yanlış bir şey tahmin eder.

**Çözüm: kapalı kitap yerine açık kitap.** RAG, soru anında kendi kaynaklarından en alakalı birkaç parçayı çeker ve prompt'a yapıştırır; model *o pasajlardan* cevap verir. *Bu gününü neden kolaylaştırır?* Kendi sorunu yanıtlamak için üç wiki sayfası okumayı bırakırsın — sorarsın, asistan gerçek "Geri çekilme ve yeniden kuyruğa alma politikası" sayfasından cevaplar; sorun o kelimeleri hiç kullanmasa bile.

**Kelimeleri eşleştirmeden doğru sayfayı neden bulur.** Her parça embed edilir — anlam-uzayında bir noktaya çevrilir — böylece "başarısız bir işi nasıl yeniden denerim?" geri çekilmeyle ilgili bir sayfanın yanına düşer. *Neden AI?* Anahtar kelime araması bunu kaçırırdı; anlam temelli retrieval, bir insanın var olduğunu bilmesi gereken sayfayı yüzeye çıkarır.

**Güvenini kazanan kısım: atıflar (citations).** Her parça bir dosyaya ya da wiki sayfasına geri izlenir, böylece cevap *nereden* geldiğini gösterir. *Bu neden önemli?* Gerçek kaynağı açıp doğrulayabilirsin — AI'ın sözüne güvenmiyorsun, doğru belgeyi hızla bulmak için onu kullanıyorsun.

**Özet:** RAG, kod tabanın hakkında tahmin yürüten asistan ile onu alıntılayan asistan arasındaki farktır. Ona gerçek kaynaklarını ver, onlardan cevap versin — dayanaklı, atıflı ve kontrol edilebilir — peşinde bir saat harcayacağın bir API uydurmak yerine.

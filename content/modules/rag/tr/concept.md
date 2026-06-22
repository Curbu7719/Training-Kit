# Retrieval-Augmented Generation (RAG)

Bir dil modeli yalnızca eğitim verisinde bulunan ve belirli bir kesim tarihine kadar olan şeyleri "bilir". *Sizin* deponuzu, ekibinizin wiki'sini, kodlama standartlarınızı ya da geçen sprint'in mimari karar kaydını hiç görmemiştir. Sıradan bir asistana "dahili API'mizde sonuçları nasıl sayfalıyoruz?" diye sorun, size makul görünen ama yanlış bir endpoint uyduracaktır. **Retrieval-Augmented Generation (RAG)** bunu, soru anında kendi kaynaklarınızdan ilgili metni getirip prompt'a ekleyerek çözer; böylece model hafızasından değil, sağlanan bu pasajlardan yanıt verir. Sonuç *sizin* kod tabanınıza ve dokümanlarınıza dayanır ve dahili API'ler uydurmaya çok daha az meyillidir.

**Bir benzetme:** açık kitap sınavı. Kapalı kitap sınavındaki öğrenci hafızasından yanıt verir ve yanlış hatırlayabilir. Ona ilgili sayfaları verin, yanıt doğrudan metinden gelir ve kullandığı dosyayı gösterebilir.

Pipeline'ın iki aşamada altı adımı vardır. **Indexleme (önceden yapılır):** (1) deponuzu, wiki'nizi ve API dokümanlarınızı birkaç yüz kelimelik pasajlara **chunk**'layın; (2) her chunk'ı **embed** edin — yani onu bir vektöre, anlamını yakalayan bir sayı listesine dönüştürün; (3) bu vektörleri bir vector index'te **saklayın**. **Sorgu anında:** (4) **retrieve** — geliştiricinin sorusunu embed edin ve vektörleri en benzer olan top-k chunk'ı çekin; (5) **augment** — bu chunk'ları prompt'a yerleştirin; (6) **generate** — model bunları kullanarak bir yanıt yazar.

**Embedding'ler ve benzerlik** retrieval'ın kalbidir. Benzer anlama sahip metin, vektör uzayında yakın noktalara düşer; bu yüzden "başarısız bir işi nasıl yeniden denerim?" sorusu, ortak hiçbir kelime olmasa bile "Backoff ve yeniden kuyruğa alma politikası" başlıklı bir wiki sayfasını getirir.

**Chunk'lama bir ödünleşmedir.** Çok büyük chunk'lar relevance'ı seyreltir ve prompt alanını boşa harcar; çok küçük olanlar ise bir fonksiyonu veya bir config bloğunu düşünce ortasında böler. Makul bir overlap, kod ve cümlelerin gariplikle kesilmesini önler.

Son olarak, **alıntılar ve grounding**: her chunk bir dosyaya veya wiki sayfasına geri izlenebildiği için, asistan bir yanıtın *nereden* geldiğini gösterebilir; böylece geliştirici gerçek kaynağı açıp doğrulayabilir.

## Her rol bunu nasıl kullanır

- **Developer:** Pipeline'ı kurar ve ayarlar; böylece IDE içi bir asistan kod tabanı sorularını gerçek dosyalardan yanıtlar — chunk boyutu, embedding modeli, top-k ve getirilen kodun prompt'a nasıl biçimlendiği.
- **Enterprise Architect:** Retrieval mimarisini ve yanıtların hangi kaynaklara dayandırılabileceğini tasarlar.
- **Tester:** Yanıtların gerçek dahili kaynaklara atıf yaptığını ve ekibin kalıplarını izlediğini doğrular ve doğru dosyaların yüzeye çıktığını test eder.
- **Project Manager:** Her eski spec'i tek tek okumak yerine, kapsam belirlerken geçmiş tasarım kararlarını ve yol haritası dokümanlarını bir RAG asistanı üzerinden sorgular.

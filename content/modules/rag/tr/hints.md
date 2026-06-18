# İpuçları & SSS

## Alternatif ifadeler

- RAG, bir kodlama asistanının deponuz üzerinde bir *açık kitap sınavı* vermesini sağlar: hafızasından yanıtlamak yerine, önce ilgili dosyaları ve wiki sayfalarını arar, sonra bunlardan yanıt verir.
- Bunu **arama + üretimin birbirine yapıştırılması** olarak düşünün: bir arama adımı doğru kod/doküman pasajlarını bulur, sonra model bunları kullanarak doğal dilde bir yanıt yazar.
- Bu, bir modele hiç eğitilmediği bir bilgiyi — kod tabanınızı, her merge'de tazelenmiş haliyle — modeli yeniden eğitmeden vermenin bir yoludur.

## İpucu yığını

- **H1 (dürtme):** Pipeline'ın iki aşaması vardır. Biri herhangi bir soru sorulmadan *önce* gerçekleşir; diğeri bir geliştirici bir şey sorduğunda gerçekleşir. Hangi adımlar depo+wiki'yi hazırlar, hangi adımlar bir sorguya yanıt verir?
- **H2 (yapı):** Indexleme önce gelir ve bir kez çalışır (merge'de tazelenir): chunk → embed → store. Sorgu anı her soru için çalışır: retrieve → augment → generate. Henüz var olmayan bir index'ten retrieve edemezsiniz.
- **H3 (yakın-yanıt):** Sıra: (1) depoyu ve wiki'yi chunk'la, (2) her chunk'ı embed et, (3) vektörleri index'te sakla, (4) geliştiricinin sorusunu embed et ve top-k benzer chunk'ı retrieve et, (5) prompt'u bunlarla augment et, (6) yanıtı generate et. Soruyu embed etmek, adım 2 ile aynı modeli yeniden kullanır.

## SSS

**RAG, modeli kodumuz üzerinde yeniden eğitir veya fine-tune eder mi?** Hayır. Modelin ağırlıkları dondurulmuş kalır. RAG yalnızca *prompt*'u, retrieve edilen pasajları ekleyerek değiştirir. Bir merge'den sonra değişen dosyaları yeniden indexleyerek yanıtları güncelleyebilmenizin nedeni budur.

**Depo üzerinde anahtar kelime aramasi yerine neden embedding kullanılır?** Embedding'ler *anlamı* yakalar; böylece "başarısız bir işi yeniden dene" ifadesi, ortak hiçbir kelimesi olmayan "backoff ve yeniden kuyruğa alma politikası" başlıklı bir sayfayla eşleşebilir. Anahtar kelime grep'i bunu kaçırırdı.

**"Top-k" nedir?** Retrieve ettiğiniz ve modele beslediğiniz en benzer chunk sayısı — örneğin k=4, en yakın dört pasaj demektir. Çok az olması yanıtı kaçırma riski taşır; çok fazlası gürültü ve maliyet ekler.

**RAG, asistanın bir dahili API uydurmayacağını garanti eder mi?** Hayır — yanıtları gerçek koda dayandırarak bunu büyük ölçüde azaltır, ama model yine de yanlış okuyabilir veya aşırı genelleme yapabilir. Gerçek dosyalara yapılan alıntıların ve groundedness testinin önemli olmasının nedeni budur.

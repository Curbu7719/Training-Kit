# İşlenmiş Örnek: Kod Asistanı Yanılınca Önce Retrieval'ı Düzelt

RAG asistanın `billing` servisi hakkında kendinden emin biçimde yanlış bir cevap verir. İçgüdün modeli suçlamak — ama neredeyse her RAG hatası bir **retrieval** hatasıdır, generation hatası değil. Doğru dosya prompt'a hiç ulaşmadıysa hiçbir model onu kurtaramazdı. İşte retrieval'ı ayarlamak asistanı güvenilecek kadar güvenilir nasıl kılar.

**Boyuta değil yapıya göre parçala.** Sabit boyutlu parçalar bir fonksiyonu ortadan keser; fonksiyon/sınıf/başlık sınırlarına göre bölmek her parçayı bütün tutar, %10–20 örtüşme ile bir imza ek yerinde kaybolmaz. *Bu gününü neden kolaylaştırır?* Asistan yarım fonksiyon döndürmeyi bırakır — kafanda gerçekten derlenen bir cevap alırsın.

**Top-k cosine'den akıllıca getir.** Bir fonksiyon adı ya da hata kodu gibi tam bir token'ın saf-anlam eşleşmesinde kaybolmaması için **hibrit arama**, geniş bir aday kümesini yeniden sıralamak için **re-ranking** ve `billing` sorusunun `payments` kodunu çekmemesi için bir **metadata filtresi** eklersin. *Peki neden AI?* Çünkü artık *doğru* servis hakkında cevap verir — filtre, neredeyse aynı kodun seni yanıltmasını durduran şeydir.

**Dayandırmayı (grounding) zorla.** Modele *yalnızca* verilen bağlamdan cevap vermesini ve yetersizse "bulunamadı" demesini söylersin. *Neden?* Yoksa eğitim hafızasına geri döner ve bir API uydurur — "bulunamadı", kendinden emin bir uydurmadan daha yararlıdır.

**Başarısızlık biçimlerini bil.** Yanlış-servis benzerleri, "ortada kaybolma" (modeller gömülü pasajlara daha az dikkat eder), bir refactor'ın çoktan değiştirdiği bir imzayı sunan **bayat indeksler** ve parça-sınırı kaybı. *Bu seni neden kurtarır?* Bir cevap yanlış olduğunda *hangi* halkanın koptuğunu söyleyebilirsin — kötü retrieval mı kötü generation mı — ve yalnızca onu düzeltirsin.

**Özet:** yanlış bir RAG cevabı genelde generation kostümü giymiş bir retrieval hatasıdır. Yapıya göre parçala, hibrit + re-rank + filtrelerle getir, dayandırmayı zorla ve refactor'lardan sonra yeniden indeksle — asistan kodun hakkında gözetimsiz cevap verecek güveni kazansın.

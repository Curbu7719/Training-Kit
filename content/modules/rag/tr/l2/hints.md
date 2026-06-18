# İpuçları & SSS (L2)

## Alternatif ifadeler

- L2'de, bir kod tabanı asistanının kalitesini çoğunlukla bir **retrieval** sorunu olarak ele alın: doğru dosya prompt'a hiç ulaşmazsa, model ne kadar iyi olursa olsun doğru yanıt veremez.
- İleri RAG'ı, saf benzerlik aramasının üzerine filtreler ve re-ranker'lar katmanlamak olarak düşünün — geniş bir aday kümesini, soruyu gerçekten yanıtlayan birkaç dosyaya daraltmak.
- Grounding bedavaya gelen bir şey değil, *uyguladığınız* bir şeydir: modeli yalnızca sağlanan kodu kullanmaya ve yanıt orada olmadığında bunu bir API uydurmak yerine kabul etmeye yönlendirin.

## İpucu yığını

- **H1 (dürtme):** Bir kod tabanı yanıtı yanlış olduğunda, önce karar verin: doğru dosya *retrieve* edildi mi, yoksa model doğru bir dosyayı *kullanmakta* mı başarısız oldu? Bunların farklı düzeltmeleri vardır.
- **H2 (yapı):** Retrieval başarısızlıkları retrieval katmanında düzeltilir — chunk'lama, metadata filtreleme (servis/branch), hybrid search, re-ranking, index tazeliği. Generation başarısızlıkları, ground'lama ve alıntılama için prompt talimatlarıyla düzeltilir. Gerçek top-k chunk'larını loglayarak teşhis edin.
- **H3 (yakın-yanıt):** İki neredeyse-aynı chunk yalnızca bir öznitelikte (hangi servis, hangi branch) farklılaşıyorsa, ayırt edici tam token'ın ağırlıklandırılması için bir **metadata filtresi** artı **hybrid search** ekleyin; sonra konuya-uygun chunk'ın top-k'ya yükselmesi için **re-rank** edin. Yanlış-ama-alıntılı bir yanıt genellikle retrieval'ın yanlış kaynağı yüzeye çıkardığı anlamına gelir.

## SSS

**Hybrid search nedir?** Anlamsal (embedding) benzerliğini keyword/BM25 eşleştirmesiyle birleştirmek. Anlamsal arama anlamı yakalar; keyword araması, saf embedding'lerin az ağırlıklandırabileceği fonksiyon adları, hata kodları veya servis adları gibi tam token'ları korur.

**Re-ranking nedir?** Ucuza daha büyük bir aday kümesi retrieve edin, sonra onları yeniden sıralamak için daha yavaş, daha doğru bir model uygulayın ve yalnızca en iyi birkaçını generator'a gönderin. Bir miktar latency'yi gözle görülür ölçüde daha iyi precision karşılığında takas eder.

**"Ortada kaybolma" (lost in the middle) etkisi nedir?** Modeller, prompt'un başındaki ve sonundaki bağlama en çok, ortaya gömülü pasajlara en az dikkat etme eğilimindedir. En ilgili chunk'ları kenarlara sıralamak bunu hafifletir.

**Bir alıntı bir retrieval hatasını neden ortaya çıkarabilir?** Yanıt gerçek ama yanlış bir dosyayı alıntılarsa (örneğin `billing` yerine `payments` servisi), generation kendisine verileni sadık bir şekilde kullandı — hata, retrieval'ın yanlış chunk'ı sağlamasıdır.

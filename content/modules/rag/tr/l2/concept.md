# Derinlemesine RAG: Kod Tabanınız Üzerinde Retrieval'ı Ayarlamak

L1, pipeline'ı ele aldı: chunk → embed → store → retrieve → augment → generate. L2'de soru, *adımların ne olduğundan* *bir kod tabanı asistanının neden yanlış yanıtlar verdiğine* kayar — ve neredeyse her başarısızlık bir generation değil, bir **retrieval** başarısızlığıdır. Doğru dosya prompt'a hiç ulaşmazsa, güçlü bir model bile bunu telafi edemez.

**Chunk'lama stratejisi retrieval kalitesini belirler.** Sabit boyutlu chunk'lar basittir ama fonksiyonların ortasından keser; **yapı-farkındalıklı chunk'lama** (fonksiyon, sınıf veya başlık sınırlarında bölme) her chunk'ı kendi içinde tutar. **Overlap** (%10–20), bir sınıra denk gelen bir imzanın veya config'in kaybolmasını önler. Burada gerçek bir gerilim vardır: küçük chunk'lar kesin eşleşmeler verir ama çevreleyen bağlamdan yoksun olabilir; büyük chunk'lar bağlam taşır ama embedding'in odağını seyreltir ve prompt'u sıkıştırır.

**Retrieval nadiren yalnızca "cosine benzerliğine göre top-k"dır.** Yaygın iyileştirmeler:
- **Hybrid search** — anlamsal aramayı keyword/BM25 ile birleştirir; böylece bir fonksiyon adı, hata kodu veya servis adı gibi tam token'lar saf anlam eşleştirmesinde kaybolmaz.
- **Re-ranking** — cömert bir aday kümesi retrieve edin, sonra en iyi birkaçını ileri göndermeden önce daha hassas (daha yavaş) bir modelle yeniden sıralayın.
- **Metadata filtreleme** — retrieval'ı özniteliklere göre (servis, dil, branch, doküman-mı-kod-mu) kısıtlayın; böylece `billing` servisi hakkındaki bir soru `payments` kodunu çekmez.

**Grounding ve alıntılar aktif uygulama gerektirir.** Modeli *yalnızca* sağlanan bağlamdan yanıt vermeye ve yetersiz olduğunda "bulunamadı" demeye yönlendirin — aksi takdirde eğitim hafızasına geri döner ve bir API uydurur. Her chunk'a kaynak dosya yolunu eklemek, yanıtın gerçek bir konumu alıntılamasını ve yanlış bir yanıtı ya kötü retrieval'a ya da kötü generation'a izlemenizi sağlar.

**Bilinen başarısızlık modları:** yanlış servisin neredeyse-aynı kodunu retrieve etmek; modellerin pasajlar arasına gömülü bağlama daha az dikkat ettiği **"ortada kaybolma"** (lost in the middle) etkisi; yakın zamandaki bir refactor'ın çoktan değiştirdiği bir fonksiyon imzasını sunan **bayat index'ler**; ve soruyu yanıtlayan tek satırın iki chunk arasında bölündüğü **chunk-sınırı kaybı**.

## Her rol bunu nasıl kullanır

- **Geliştirici/Mühendis:** Yapı-farkındalıklı chunk'lamayı seçer, hybrid search ve re-ranking ekler, bir servis/branch metadata filtresi uygular ve ortada-kaybolmadan kaçınmak için bağlamı sıralar.
- **İş Analisti:** Belirli bir kullanıcının hangi kaynakları (hangi servisler, hangi doküman alanları, hangi erişim seviyeleri) retrieve edebileceğini haritalar ve bayat bir index'in nerede yanıltabileceğini işaretler.
- **PM/Ürün Sahibi:** Retrieval inceliğini (re-ranking, hybrid search) latency ve maliyete karşı tartar ve önce hangi depo ve wiki'lerin indexleneceğini önceliklendirir.
- **QA/Test Uzmanı & Mimar:** Retrieval'ı (doğru dosya yüzeye çıktı mı?) generation'dan (sadık bir şekilde kullanıldı mı?) ayrı test eder ve her refactor'dan sonra bayat-index ve sınır-kaybı modlarını yoklar.

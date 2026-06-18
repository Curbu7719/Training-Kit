# İpuçları & Alternatif İfadeler

## Alternatif ifadeler

- Tool use, yalnızca-metin üreten bir modelin **kod tabanınız üzerinde eylemde bulunmasını** sağlar: bir tool *ister* (testleri çalıştır, kodu ara), uygulamanız onu *çalıştırır* ve sonucu döndürür, sonra model bu yeni bilgiyle devam eder.
- Bir agent, **planla → eyleme geç → gözlemle** döngüsü çalıştıran bir modeldir; her turda başka bir tool mu çağıracağına (çalıştır, ara, yama) yoksa bitireceğine mi karar verir.
- Model tool'ları asla kendisi çalıştırmaz — onu ekran paylaşımı üzerinden eşli çalışan bir mühendis gibi düşünün; sizden (kodunuzdan) komutu çalıştırıp çıktıyı geri okumanızı ister.

## İpucu yığını

**H1 (dürtme):** Tek başına bir model yalnızca metin üretebilir — test paketinizi çalıştıramaz veya başarısız dosyayı okuyamaz. Hangi mekanizma onun bu işleri kendi adına uygulamanıza yaptırmasını sağlar?

**H2 (mekanizma):** Tool use'da modele `run_tests`, `search_code`, `apply_patch` gibi tool'ları (ad, açıklama, girdiler) tanımlarsınız. Model birini istediğinde yapılandırılmış bir **istek** yayınlar; uygulamanız gerçek komutu çalıştırır ve **sonucu** konuşmaya geri döndürür. Bir hatayı düzeltmek gibi çok adımlı bir görev için bir **agent** bunu bir döngüde tekrarlar: bir sonraki adımı planla, eyleme geç (bir tool iste), sonucu gözlemle, testler geçene kadar tekrarla.

**H3 (işlenmiş):** Başarısız bir testi düzeltmek için tek bir çağrı yetersizdir (hatayı veya kaynağı göremez). Bir agent döngü yapar: iterasyon 1'de `run_tests` *ister* ve uygulama traceback'i döndürür; iterasyon 2'de fonksiyonu bulmak için `search_code` yapar; iterasyon 3'te `apply_patch` yapar; iterasyon 4'te testleri yeniden çalıştırır ve geçerler, böylece durur. Bir maksimum-iterasyon sınırı, asla yakınsamayan bir düzenle-ve-tekrar-dene döngüsüne karşı koruma sağlar.

## SSS

**S: Testleri model mi çalıştırır yoksa dosyayı kendisi mi düzenler?**
Hayır. Model yalnızca yapılandırılmış bir çağrı yayınlayarak bir tool *ister*. Uygulamanız gerçek komutu (pytest, grep, patch) çalıştırır ve sonucu döndürür. Bu sınırı net tutmak, tool use'un kalbidir.

**S: Tek bir model çağrısı yerine bir agent'ı ne zaman kullanmalıyım?**
Tek seferlik görevler için (bir PR'ı özetle, bir hatayı açıkla) tek bir çağrı kullanın. Görev çok adımlıysa, taze duruma ihtiyaç duyuyorsa veya ara sonuçlara bağlıysa bir agent kullanın — bir hatayı düzeltmek gibi; burada her düzenleme bir sonraki karardan önce yeniden test edilmelidir.

**S: "Kontrolsüz döngü (runaway loop)" nedir ve onu nasıl durdururum?**
Bu, agent'ın yakınsamadan testleri çalıştırıp düzenlemeye devam ederek zaman ve para israf etmesidir. Bir **maksimum-iterasyon sınırı** döngüyü sınırlar; zaman aşımları, bütçeler ve insan-onay adımları ek korkuluklar ekler.

**S: Kodlama agent'ları neden tek çağrılardan daha riskli?**
Daha fazla otonomi, başarısız olmanın daha çok yolu demektir: maliyet iterasyon başına büyür, erken yanlış okunan bir hata sonraki düzenlemeler boyunca birikerek büyüyebilir, model yanlış veya yıkıcı bir tool çağırabilir (force-push, bir branch'i sil) ve döngüler dönebilir. Korkuluklar — sınırlar, girdi doğrulama, riskli tool'larda onaylar — otonomiyi güvenli kılar.

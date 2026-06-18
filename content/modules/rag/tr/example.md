# İşlenmiş Örnek: Geliştirici Ekibi için Bir Kod Tabanı Soru-Cevap Asistanı

**SDLC aşaması: Kodlama / Bakım.** Bir platform ekibi büyük bir servisi ve 400 sayfalık dahili bir wiki'yi sürdürüyor. Yeni mühendisler sohbette sürekli aynı soruları soruyor — "servisten servise çağrıları nasıl kimlik doğruluyoruz?" — ve sıradan bir LLM asistanı var olmayan endpoint'ler uyduruyor. Ekip, yalnızca *kendi* kodlarını ve dokümanlarını kullanarak yanıt veren bir asistan istiyor. RAG bunu şöyle sağlar.

**Indexleme (bir kez, önceden çalıştırılır, her merge'de tazelenir).** Depo kaynak dosyaları, wiki ve API referansı yaklaşık 300 kelimelik chunk'lara (ya da bir fonksiyon/bölüm) bölünür; bir sınırı aşan bir fonksiyon imzasının kaybolmaması için 50 kelimelik bir overlap ile. Bu yaklaşık 6.000 chunk üretir. Her chunk bir embedding modelinden geçirilir ve anlamını kodlayan bir vektör üretir. Her vektör, kaynak dosya yolu ve wiki sayfası URL'si ile etiketlenmiş şekilde bir vector index'te saklanır.

**Sorgu anında.** Yeni bir geliştirici sorar: *"Billing servisine kimlik doğrulamalı bir çağrıyı nasıl yaparım?"*

1. **Soruyu embed et** — aynı embedding modelini kullanarak.
2. **Top-k (k=4) retrieve et.** Index en yakın dört chunk'ı döndürür. En iyi eşleşme `auth/service_client.py` dosyasından ve *"Internal mTLS setup"* başlıklı bir wiki sayfasından gelir; ikisi de tam olarak "billing service" ifadesini kullanmasa bile — onları yüzeye çıkaran anlamsal benzerliktir.
3. **Prompt'u augment et.**
   > Yalnızca aşağıdaki bağlamı kullanarak yanıtla. Dosyayı veya wiki sayfasını alıntıla.
   > Bağlam: [chunk 1] [chunk 2] [chunk 3] [chunk 4]
   > Soru: Billing servisine kimlik doğrulamalı bir çağrıyı nasıl yaparım?
4. **Generate.** Model şöyle yanıtlar: *"`ServiceClient.for('billing')` kullanın; bu, mTLS sertifikasını secrets mount'undan yükler. (Kaynak: `auth/service_client.py`; wiki: Internal mTLS setup.)"*

**Bu neden işe yarar.** Yanıt gerçek, güncel koda dayanır ve geliştiricinin açıp doğrulayabileceği bir alıntı taşır. Hiçbir chunk ilgili olmasaydı, iyi tasarlanmış bir prompt modeli bir endpoint uydurmak yerine "Bunu kod tabanımızda bulamadım" demeye yöneltirdi. Bir refactor merge edin, o chunk'ları yeniden indexleyin ve asistanın yanıtları da güncellenir — yeniden eğitim gerekmez.

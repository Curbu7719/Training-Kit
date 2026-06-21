# İpuçları ve Alternatif İfadeler

**Temel fikrin alternatif ifadeleri**

- "Filo ölçeğinde erişimi konsoldan agent agent vermezsiniz — her agent'ın kendi kimliği ve en az
  yetki kapsamı kod olarak politika biçiminde yazılır; değişiklik pencereleri ve yüksek etkili
  eylemler için tek tip onayla birlikte."
- "Agent'lar hem müdahale eden hem soruna yol açan taraftır; bu yüzden olaylar hatalı eylem, kaçak
  döngü, injection ile ele geçirilme ve yetki aşımına ayrılır — evrensel kontrol otonomiyi durdurmak
  (acil durdurma) ve eylemi geri almaktır, ve her hatalı eylem yeni bir guardrail ve eval senaryosu
  doğurur."
- "Bir agent'ın davranışı onun politikasıdır = istem + araçlar + yetkiler + model; kod gibi
  versiyonlanır ve shadow (dry-run, önerilen eylemleri insanlarla karşılaştır) → canary (küçük bir
  dilimde eylem al) → politika geri alması hazır bayraklı yayına alma ile çıkar."

**İpucu yığını**

- **H1 (dürtme):** *Zaman içinde ve bir filo genelinde* neyin değiştiğini düşünün: yetkiler çoğalır,
  model kullanımdan kalkar ve döngüye giren tek bir agent hızla harcayabilir. Cevap genelde tek
  seferlik bir düzeltme değil, kasıtlı bir politika ve süreçtir.
- **H2 (yapı):** Bir davranış değişikliği için güvenli yol shadow (dry-run, önerilen eylemleri
  insanların yaptığıyla karşılaştır) → canary (küçük bir dilimde otonom) → politika geri almalı
  bayraklı yayına almadır. Maliyet için atfı (hangi agent harcadı) kontrolden (eylem hızı ve harcama
  tavanları) ayırın. Olaylar için sınıflandırın ve acil durdurmayı kullanın.
- **H3 (işlenmiş yol):** Enjekte edilen bir günlük satırının beslediği, hızının 6 katında eylem alan
  kaçak bir agent: yıkıcı-eylem kapısı tehlikeli komutu engeller, eylem hızı tavanı kısıp yükseltir,
  agent bazında atıf suçluyu hızla bulur ve olay incelemesi bunu bir girdiye-güven korumasına ve bir
  eval senaryosuna çevirir.

**Kısa SSS**

- **Neden modeli değiştirmek yerine bir agent'ı gölgele (shadow)?** Çünkü agent *eylem alır*: yeni
  bir model onu sessizce eylem almaya daha çok ya da daha az istekli kılabilir. Shadow, önerdiği
  eylemleri herhangi biri çalışmadan önce gerçek olaylarda karşılaştırır; böylece umutla değil
  kanıtla çıkarsın.
- **Neden agent bazında maliyet anomali tespiti ve eylem hızı tavanları?** Her agent adımı bir LLM
  çağrısıdır ve kaynak başlatabilir, bu yüzden bir döngü hızla harcar. Anomali tespiti sapmayı erken
  yakalar, hız tavanı zararı sınırlar ve agent bazında atıf hangisini durduracağını söyler.
- **Neden her hatalı eylem bir eval senaryosu olur?** Çünkü bir birim testi, deterministik olmayan
  yanlış bir eylemi yakalamaz. Her hatalı eylemi bir guardrail ve bir çevrimdışı eval senaryosuna
  çevirmek, filonun politikasının güçlenmesini ve aynı yanlış eylemin sessizce geri dönememesini
  sağlar.
- **Neden günlükleri ve talep kayıtlarını güvenilmez girdi say?** Çünkü onları okuyan, eylem alan bir
  agent enjekte edilmiş metinle zararlı bir eyleme yönlendirilebilir. Dış metin güvenilmez girdidir;
  yüksek etkili eylemler, bir günlüğün ne "önerdiğine" bakılmaksızın yine de bir onay kapısından
  geçer.

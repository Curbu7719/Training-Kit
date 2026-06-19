# İpuçları ve Alternatif İfadeler

**Temel fikrin alternatif ifadeleri**

- "Filo ölçeğinde erişimi bir konsolda agent agent vermezsin — her agent'ın kendi kimliği ve en az
  yetki kapsamları policy-as-code olarak ifade edilir; change window'lar ve yüksek-blast aksiyonlar
  için tek tip onayla birlikte."
- "Agent'lar hem müdahale eden hem sebep olan taraf, bu yüzden olaylar agent-misfire, kaçak döngü,
  injection ile ele geçirilme ve yetki arızasına ayrılır — evrensel kontrol otonomiyi durdurmak
  (kill-switch) ve aksiyonu geri almaktır ve her misfire yeni bir guardrail ve eval case olur."
- "Bir agent'ın davranışı onun politikasıdır = prompt + araçlar + yetkiler + model; kod gibi
  versiyonlanır ve shadow (dry-run, önerilen aksiyonları insanlarla karşılaştır) → canary (küçük bir
  dilimde aksiyon al) → policy rollback hazır flag'li rollout ile yayına alınır."

**İpucu yığını**

- **H1 (dürtme):** *Zaman içinde ve bir filo genelinde* neyin değiştiğini düşün: yetkiler çoğalır,
  model deprecate edilir ve döngüye giren tek bir agent hızla harcayabilir. Cevap genelde tek
  seferlik bir düzeltme değil, kasıtlı bir politika ve süreçtir.
- **H2 (yapı):** Bir davranış değişikliği için güvenli yol shadow (dry-run, önerilen aksiyonları
  insanların yaptığıyla karşılaştır) → canary (küçük bir dilimde otonom) → policy rollback'li flag'li
  rollout'tur. Maliyet için attribution'ı (hangi agent harcadı) kontrolden (action-rate ve harcama
  tavanları) ayır. Olaylar için sınıflandır ve kill-switch'le.
- **H3 (işlenmiş yol):** Enjekte edilen bir log satırının sürdüğü, hızının 6 katında aksiyon alan
  kaçak bir agent: yıkıcı-aksiyon kapısı tehlikeli komutu engeller, action-rate tavanı kısıp
  eskalasyon yapar, agent bazında attribution suçluyu hızla bulur ve postmortem onu bir girdi-güven
  korumasına ve bir eval case'e dönüştürür.

**Kısa SSS**

- **Neden modeli değiştirmek yerine bir agent'ı shadow'la?** Çünkü agent *aksiyon alır*: yeni bir
  model onu sessizce aksiyon almaya daha çok ya da daha az istekli kılabilir. Shadow, önerdiği
  aksiyonları herhangi biri çalışmadan önce gerçek olaylarda karşılaştırır, böylece umutla değil
  kanıtla yayına alırsın.
- **Neden agent bazında maliyet anomali tespiti ve action-rate tavanları?** Her agent adımı bir LLM
  çağrısıdır ve kaynak başlatabilir, bu yüzden bir döngü hızla harcar. Anomali tespiti sapmayı
  erken yakalar, rate tavanı zararı sınırlar ve agent bazında attribution hangisini durduracağını
  söyler.
- **Neden her agent misfire'ı bir eval case olur?** Çünkü bir birim testi deterministik olmayan bir
  yanlış aksiyonu yakalamaz. Her misfire'ı bir guardrail ve bir çevrimdışı eval case'e dönüştürmek,
  filonun politikasının diş kazanmasını ve aynı yanlış aksiyonun sessizce geri dönememesini sağlar.
- **Neden logları ve ticket'ları güvenilmez girdi olarak ele al?** Çünkü onları okuyan, aksiyon alan
  bir agent enjekte edilmiş metinle zararlı bir aksiyona yönlendirilebilir. Dış metin güvenilmez
  girdidir ve yüksek-blast aksiyonlar, bir logun ne 'önerdiğine' bakılmaksızın yine de bir onay
  kapısından geçer.

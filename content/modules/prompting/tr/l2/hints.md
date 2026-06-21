# İpuçları ve Alternatif İfadeler

**Temel fikrin alternatif ifadeleri**

- "Production prompt'ları bir çıktı sözleşmesi ister: katı bir JSON şeması (ya da sabit şablon) belirt,
  modele yalnızca onu döndürmesini söyle ve kullanmadan önce doğrula — serbest metni regex'leyip umma."
- "Few-shot, house style'ı yalnızca örnekler temsili ve çeşitliyse (edge case'ler dahil) öğretir; bir
  eval setiyle kapılı versiyonlanmış bir prompt, bir vakayı düzeltmenin on tanesini bozmasını engeller."
- "Bir prompt'u kod gibi ele al: parametrele, version control'da tut ve vibe'la ayarlamak yerine bir
  eval setine karşı iterasyon yap."

**İpucu yığını**

- **H1 (dürtme):** Bir prompt'u yalnızca bir kez etkileyici değil, *başka yazılım için güvenilir*
  kılan nedir diye sor. Cevap genelde katı bir çıktı sözleşmesi artı doğrulama ve onu güvenle
  değiştirmenin bir yoludur.
- **H2 (yapı):** Format (şema + delimiter + doğrula), öğretme (çeşitli few-shot, edge case dahil),
  belirsizlik (eksik bilgiyi işaretle, uydurma) ve yaşam döngüsü (versiyonla, değişiklikleri eval
  setiyle kapıla).
- **H3 (işlenmiş yol):** Bir JSON şeması tanımla ve doğrula; sıradan ve edge-case bir örnek ekle;
  uydurmak yerine varsayımları işaretlemesini söyle; prompt'u version control'a al ve her değişiklikte
  CI'da bir eval seti çalıştır.

**Kısa SSS**

- **Tutarlılığı kibarca istemek yerine neden JSON şeması?** Çünkü tanımlı bir şema artı doğrulama,
  aşağı-akış koda bir sözleşme verir; 'lütfen tutarlı ol' ifade savruldukça ilk seferde kırılır.
- **Kaç few-shot örneği kullanmalıyım?** Kolay ve zor vakaları kapsayacak kadar — temsili ve çeşitli,
  yalnızca token israf eden birçok benzer örnekten iyidir.
- **Temperature sıfır formatı ve eksiksizliği düzeltir mi?** Hayır. Çeşitliliği azaltır ama geçerli
  JSON ya da edge case'lerin kapsandığını garanti etmez — yine de bir şema, doğrulama ve iyi örnekler gerekir.
- **Prompt'ları neden versiyonla ve eval seti kullan?** Bir prompt production mantığıdır; versiyonlama
  artı eval kapısı, bir vakayı düzelten bir değişikliğin yeniden kontrol etmediğin diğerlerini sessizce
  geriletememesi demektir.

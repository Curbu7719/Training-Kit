# İşlenmiş Örnek: Spec'ten-Test-Planına Prompt'unu Sağlamlaştırmak

AI özelliğin bir özellik spec'ini, aşağı-akış araçların yuttuğu yapılandırılmış bir test planına
çeviriyor. İlk prompt demoda iyiydi, sonra production'da kırıldı. İleri desenler onu nasıl güvenilir
kılıyor, işte.

## Gelişigüzel prompt (ve nasıl başarısız oldu)

> "Bu spec'i oku ve bir test planı yaz."

Demoda derli toplu bir plan üretti. Production'da bir sefer prose döndürdü, bir dahaki sefer markdown
tablo, edge case'leri atladı ve bir keresinde spec'te olmayan bir gereksinim uydurdu. İkinci
çalıştırmada aşağı-akış parse kırıldı. Sorun model değil — belirtilmemiş bir prompt.

## Düzeltme 1 — Katı bir çıktı sözleşmesi

Bir JSON şeması tanımlarsın: her biri `id`, `title`, `type` (happy/edge/negative) ve `steps` içeren
bir test-case dizisi. Prompt, spec'i delimiter'larla sarar ve **yalnızca bu şemaya uyan JSON döndür**
der. Aşağı-akış kod sonra her yanıtı şemaya karşı **doğrular** ve başarısızlıkta reddeder ya da onarır
— böylece bozuk bir çalıştırma pipeline'ı sessizce bozamaz.

## Düzeltme 2 — Gerçek çeşitlilikle few-shot

İki örnek eklersin: sıradan bir özellik *ve* zor bir edge case'i olan biri (boş girdi, bir izin
sınırı). Artık model yalnızca happy-path'i değil, negative ve edge case'leri de güvenilir biçimde
üretir — çünkü "tam" olmanın ne demek olduğunu prose değil, örnekler öğretti.

## Düzeltme 3 — Eksik-bilgi durumunu ele al

Spec'ler çoğu zaman eksiktir. Modelin gereksinim uydurmasına izin vermek yerine, prompt şunu
talimatlar: *spec bir davranışı belirtmiyorsa, bir kural uydurmak yerine `assumption` (varsayım)
olarak işaretlenmiş bir test-case ekle.* Belirsizlik artık kendinden emin bir uydurma değil, görünür
bir bayrak olarak ortaya çıkar.

## Düzeltme 4 — Versiyonla ve eval'le kapıla

Prompt'u koddan çıkarıp version control'a alır, spec girdisini parametrelersin. Küçük bir **eval
seti** tutarsın: bilinen-doğru planlara sahip on spec. Her prompt değişikliği seti CI'da çalıştırır ve
**yalnızca skorlar korunur ya da iyileşirse** yayınlanır — böylece bir vakayı sıkılaştırmak
diğerlerini sessizce bozamaz.

## Ders

Model akıllanmadı; prompt **mühendislik edildi**. Doğrulamalı şema-bağlı bir çıktı sözleşmesi,
çeşitli few-shot örnekleri, eksik bilginin açık ele alınması ve bir eval setiyle kapılı versiyonlanmış
bir prompt; demo-seviyesi bir prompt'u, production araçlarının güvenebileceği birine çevirir. Etkileyen
prompting ile yayınlanan prompting arasındaki fark budur.

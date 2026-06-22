# AI Özelliklerini Değerlendirme

Normal bir özelliği test ederken şunu öne sürersiniz: bu girdi verildiğinde, şu çıktıyı bekle; ve yeşil bir test çalıştığını kanıtlar. Bir **AI özelliği** bu sözleşmeyi bozar — aynı prompt her çalıştırmada farklı ifadeler üretebilir ve nadiren tek bir "doğru" string vardır. Bir QA test uzmanı bir özet karşısında `assertEquals` yazamaz. Yine de ekibin, özelliğin ship edilecek kadar iyi olup olmadığını ve bir prompt değişikliğinin onu iyileştirip iyileştirmediğini ya da kötüleştirip kötüleştirmediğini bilmesi gerekir. **Değerlendirme** ("eval"), bir AI özelliğinin kalitesini sistematik olarak ölçme biçiminizdir — çıktılar non-deterministik olduğunda testin *dönüştüğü* şeydir.

**Neden önemli:** ölçüm olmadan demo'lar üzerinden ship edersiniz. Üç örnekte harika görünen bir prompt değişikliği, sessizce bir düzine başkasını bozabilir. Çıktılar ayrıca modelleri değiştirdikçe, prompt'ları düzenledikçe veya retrieval'ı değiştirdikçe sapar. Değerlendirme, "daha iyi hissettiriyor"u kanıta dönüştürür.

**Yaygın yaklaşımlar:**
- **Golden / offline veri kümeleri** — bilinen-iyi beklenen çıktıları veya rubric'leri olan, derlenmiş bir girdi kümesi. Bir test paketinin QA karşılığı: özelliği bunlar üzerinde çalıştırın, sonuçları puanlayın, istediğiniz zaman yeniden çalıştırın. Tekrarlanabilir ve ucuz.
- **İnsan incelemesi** — insanlar çıktıları doğruluk, ton veya güvenlik açısından derecelendirir. Nüans için altın standart, ama yavaş ve pahalı.
- **LLM-as-judge** — ikinci bir model, çıktıları bir rubric'e göre puanlar (örneğin "bu yanıt kaynağa faithful mı?"). Hızlı ve ölçeklenebilir, ama judge'ın kendisi doğrulanmalıdır.
- **A/B testleri** — iki varyant yayınlayın ve gerçek kullanıcı sonuçlarını karşılaştırın. En gerçek sinyal, ama yalnızca lansman sonrası mevcut.

**İzleyeceğiniz metrikler:** **accuracy** (doğru mu?), **relevance** (isteği karşılıyor mu?), **faithfulness / groundedness** (sağlanan kaynaklara bağlı kalıyor mu?), **latency** ve **maliyet**. Kalite, hız ve maliyet birbiriyle ödünleşir.

**Regresyon testi**, her değişiklikten sonra eval paketini yeniden çalıştırmak demektir; böylece bir yerdeki bir düzeltme sessizce bir başkasını bozmaz — diğer herhangi bir test geçidi gibi CI'a bağlanır. Bu, **eval-odaklı iterasyonu** mümkün kılar: bir prompt'u değiştir, paketi çalıştır, değişikliği yalnızca puanlar iyileşirse koru. Bu, AI için TDD'dir: hissiyat değil, sayılar karar verir.

## Her rol bunu nasıl kullanır

- **Tester:** Eval paketini ve golden dataset'i kurar, non-determinizmi tolere etmek için tam string yerine özellikleri puanlar ve kaliteyi görünür kılar.
- **Developer:** Eval paketini CI'a bir regresyon geçidi olarak bağlar; böylece puanlar düşerse bir prompt değişikliği merge edilemez.
- **Project Manager:** "İyi"nin ne demek olduğunu tanımlar ve kalite çıtasını (geçme eşiği) belirler; ship kararında accuracy'yi latency ve maliyete karşı tartar.
- **Enterprise Architect:** Kalitenin yalnızca yayın öncesi değil production'da da görünür olması için observability'yi tasarlar.

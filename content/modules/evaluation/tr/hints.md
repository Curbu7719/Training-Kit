# İpuçları & SSS

## Alternatif ifadeler

- Değerlendirme, **bir AI özelliği için testin dönüştüğü şeydir**: çıktılar değiştiği ve nadiren tek bir doğru string olduğu için, QA tek bir tam çıktıyı öne sürmek yerine birçok örnek üzerinde kaliteyi ölçer.
- Bir **golden dataset**'i, özelliğin test paketi olarak düşünün — kalitenin değişip değişmediğini görmek için istediğiniz zaman yeniden çalıştırdığınız bilinen-iyi girdiler ve beklenen çıktılar.
- Eval-odaklı iterasyon şu döngüdür: bir şeyi değiştir → paketi CI'da çalıştır → değişikliği yalnızca sayılar iyileştiyse koru. Demo değil, puanlar karar verir.

## İpucu yığını

- **H1 (dürtme):** Fikirleri grupla. Bazı maddeler *yaklaşımlardır* (yargıları nasıl topladığınız) ve bazıları *metriklerdir* (hangi sayıyı ölçtüğünüz). İkisini karıştırmayın.
- **H2 (yapı):** Yaklaşımlar "puanlamayı kim veya ne yapar?" sorusunu yanıtlar — golden dataset, insan incelemesi, LLM-as-judge, A/B testi. Metrikler "hangi kaliteyi ölçüyoruz?" sorusunu yanıtlar — accuracy, relevance, faithfulness/groundedness, latency, maliyet.
- **H3 (yakın-yanıt):** Her metriği ölçtüğü *tek* şeyle eşleştirin: accuracy → doğru mu; relevance → isteği karşılıyor mu; faithfulness/groundedness → uydurmadan sağlanan kaynaklara bağlı kalıyor mu; latency → yanıt hızı; maliyet → çağrı başına harcama.

## SSS

**QA neden bir AI özelliği için sadece normal birim testleri yazamaz?** Çünkü aynı prompt her çalıştırmada farklı ifadeler üretebilir ve nadiren tek bir doğru string vardır. Tam bir eşleşme değil, birçok örnek üzerinde özellikleri (doğru mu? relevant mı? grounded mı?) puanlarsınız.

**LLM-as-judge nedir ve döngüsel değil mi?** İkinci bir model, çıktıları bir rubric'e göre puanlar. CI için yeterince hızlı ve ölçeklenebilirdir, ama judge'ın kendisini doğrulamalısınız — örneğin puanlarını insan derecelendirmelerine karşı nokta-kontrol ederek — böylece bu, başka bir kara kutuyu derecelendiren bir kara kutu olmaz.

**Accuracy ile faithfulness arasındaki fark nedir?** Accuracy "yanıt dünyada doğru mu?" diye sorar. Faithfulness (groundedness) "yanıt, uydurmadan sağlanan kaynaklar içinde mi kaldı?" diye sorar. Bir yanıt, kaynakları yanlışsa kaynaklarına faithful olup yine de inaccurate olabilir.

**Burada bir regresyon testi nedir?** Her değişiklikten sonra eval paketini yeniden çalıştırmak — CI'a bağlanmış — böylece bir yerdeki bir iyileşme sessizce başka bir yerdeki kaliteyi bozmaz.

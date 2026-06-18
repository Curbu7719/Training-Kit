# İşlenmiş Örnek: QA Bir AI Sürüm-Notları Üreticisini Test Ediyor

**SDLC aşaması: Test.** Bir ekip, merge edilmiş pull request'lerin bir listesini tek paragraflık bir sürüm notuna dönüştüren bir özellik ship ediyor. Demo'su muhteşem görünüyor — ama "demo'su muhteşem görünüyor" bir test sonucu değildir. QA test uzmanı, lansmandan önce bunu *ölçülebilir* kılmaya ve regresyonlara karşı korumaya sahiptir.

**Adım 1 — Bir golden dataset kur.** QA, 100 gerçek PR-listesi girdisi toplar ve her biri için bilinen-iyi bir referans not artı kısa bir rubric yazar: notun doğru olması, kullanıcıya dönük her değişikliği belirtmesi ve PR'larda olmayan hiçbir şeyi uydurmaması gerekir. Bu veri kümesi tekrarlanabilir ölçü çubuğu olur — AI özelliğinin test paketi.

**Adım 2 — Bir LLM-as-judge ile puanla.** Her çalıştırmada 100 notu elle derecelendirmek CI için çok yavaştır. Bu yüzden QA, rubric ile yönlendirilen ikinci bir modeli judge olarak kullanır: "PR listesi, referans not ve aday not verildiğinde, adayı accuracy ve completeness açısından 1–5 arasında derecelendir ve PR'lar tarafından desteklenmeyen herhangi bir iddiayı işaretle." Faithfulness işareti, özellik uyduran notları yakalar — bir groundedness kontrolü.

**Adım 3 — Metrikleri oku.** İlk çalıştırma: accuracy 4.1/5, completeness 4.3/5, çıktıların %12'sinde faithfulness işaretleri, ortalama latency 1.8s, not başına maliyet \$0.002. %12 kırmızı bayraktır — sekiz notta bir, PR'larda olmayan bir değişiklik iddia ediyor.

**Adım 4 — Eval'e karşı iterasyon yap.** Bir geliştirici prompt'u düzenler: "yalnızca PR listesinde bulunan değişiklikleri kullan." Aynı 100 maddelik paketi yeniden çalıştırırlar. Faithfulness işaretleri %3'e düşer; accuracy ve completeness korunur. Puan regresyon olmadan iyileştiği için değişikliği korurlar.

**Adım 5 — Bir regresyon geçidi olarak sabitle.** Eval paketi artık her sürümden önce CI'da çalışır. Daha sonra biri maliyeti azaltmak için daha ucuz bir model takar; paket, faithfulness'ın %9'a doğru tekrar tırmandığını gösterir, böylece QA regresyonu kullanıcılar görmeden yakalar.

**Çıkarım:** bir golden dataset artı otomatik puanlama, öznel bir "iyi hissettiriyor"u nesnel, tekrarlanabilir sayılara dönüştürdü — ve gelecekteki her değişikliği kanıtlanabilir şekilde ship edilebilir ya da edilemez kıldı.

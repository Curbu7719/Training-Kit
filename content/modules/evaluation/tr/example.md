# İşlenmiş Örnek: AI Değişikliklerini İçine Doğduğu İçin Göndermeyi Bırak

Bir prompt'u değiştirirsin, denediğin üç örnekte daha iyi görünür, gönderirsin — ve kontrol etmediğin bir düzine durumu sessizce bozar. Bir AI özetine `assertEquals` yapamazsın, o yüzden körlemesine uçuyormuş gibi hissedersin. **Değerlendirme (evaluation)**, tek bir doğru metin yokken testin dönüştüğü şeydir ve tahmini bırakmanın yoludur.

**Tuzak: bir avuç demoya bakıp karar vermek.** Üç iyi örnek kanıt gibi hisseder; değildir. *Neden tehlikeli?* Aynı prompt her koşuda farklı ifade üretir ve nadiren tek bir doğru cevap vardır — üç girdide parlayan bir değişiklik, hiç görmediğin yirmi girdide geriler.

**Çözüm: golden dataset.** Bilinen-iyi cevapları ya da rubrikleri olan gerçek girdilerden bir set derlersin — QA'in test takımı karşılığı — ve özelliği bunların hepsi üzerinde puanlarsın. *Bu gününü neden kolaylaştırır?* "Daha iyi hissettiriyor" bir sayıya döner. Prompt'u değiştirir, takımı yeniden çalıştırır ve *değişikliği yalnızca puan yükseldiyse tutarsın.* Bu, AI için TDD'dir: his değil, sayılar karar verir.

**Tam metni değil, özellikleri puanla.** Çıktılar değiştiğinden, string eşleştirmek yerine doğruluk, alaka ve sadakat (kaynağa bağlı kalıyor mu?) ölçersin. *Peki neden AI?* Bir LLM-as-judge, "bu cevap sadık mı?" sorusunu yüzlerce durumda dakikalar içinde puanlayabilir — her değişiklikte çalıştıracak kadar hızlı.

**CI'a bağla.** Eval takımını her değişiklikten sonra, diğer test kapıları gibi çalıştırırsın; böylece bir yerdeki düzeltme başka bir yeri sessizce bozamaz. *Bu seni neden kurtarır?* Regresyon production'da değil, pipeline'da görünür.

**Kontrol sende kalsın.** Judge'ın kendisine de güvenilmeli — bir sayının bir sürümü geçirmesine izin vermeden önce puanlarını kendi yargınla nokta kontrol et.

**Özet:** "AI çıktıları değişir" ile "çalışıp çalışmadığını bil" arasında seçim yapmak zorunda değilsin. Bir golden dataset, özellik puanlaması ve bir CI kapısı içgüdüyü kanıta çevirir — böylece demoda iyi görüneni değil, gerçekten yardımcı olan prompt değişikliğini gönderirsin.

# İşlenmiş Örnek: Başarısız Bir Testi Düzelten Bir Agent

Bir ekip arkadaşı, son bir değişikliğin ardından `test_apply_discount`'ın kırmızı (başarısız) olduğunu bildiriyor. Tek bir model çağrısı bunu iyi düzeltemez — hatayı veya kaynağı göremez. Bu yüzden bir kodlama asistanına üç tool veriyoruz ve bir **agent döngüsü** çalıştırmasına izin veriyoruz.

**Uygulamanın modele bildirdiği tool'lar:**

- `run_tests(path)` → paketi çalıştırır, geçti/kaldı ve varsa traceback döndürür.
- `search_code(query)` → eşleşen dosyaları ve satır aralıklarını döndürür.
- `apply_patch(diff)` → çalışma ağacına bir unified diff uygular.

**İterasyon 1 — planla ve eyleme geç.** Model, önce gerçek hatayı görmesi gerektiğini akıl yürütür. Tahmin etmek yerine bir tool isteği yayınlar:

> `run_tests(path="tests/test_discount.py")`

Model durur ve bekler — *istedi*, çalıştırmadı.

**Uygulama çalıştırır.** Kodunuz pytest'i çalıştırır ve sonucu konuşmaya geri döndürür:

> Sonuç: `FAILED — AssertionError: expected 90, got 100. apply_discount() in cart.py:42`

**İterasyon 2 — gözlemle, planla, yeniden eyleme geç.** Model artık hatanın nerede olduğunu biliyor ama kaynağa ihtiyacı var. Şunu ister:

> `search_code(query="def apply_discount")`

Uygulama `cart.py:40-46` döndürür ve indirimin hiç çıkarılmadığını ortaya koyar.

**İterasyon 3 — eyleme geç.** Model bir düzeltme önerir:

> `apply_patch(diff="--- a/cart.py ... price - discount ...")`

Uygulama onu uygular.

**İterasyon 4 — doğrula ve bitir.** Model paketi yeniden çalıştırır:

> `run_tests(path="tests/test_discount.py")` → `PASSED`

Başka tool çağırmaz ve şunu raporlar: "cart.py:42'deki `apply_discount` düzeltildi — indirim çıkarılmıyordu. Testler geçiyor."

**Bunun gösterdikleri:**

- Model tool'ları **istedi**; **uygulama** onları **çalıştırdı** — sınır asla bulanıklaşmaz.
- Döngü, testler yeşile dönene kadar **planla → eyleme geç → gözlemle** çalıştı, sonra kendiliğinden durdu.
- Bir korkuluk önemlidir: `run_tests` başarısız olmaya devam etseydi, bir **maksimum-iterasyon sınırı** (diyelim 8) döngüyü, sonsuza dek düzenle-ve-tekrar-dene yerine durdururdu.

Tek bir çağrı bir yamayı halüsinasyon olarak uydururdu. Agent döngüsü, modelin bilmediği hatayı ve kaynağı *adım adım toplamasına* izin verdi; doğrulanmış bir düzeltmeyi commit etmeden önce.

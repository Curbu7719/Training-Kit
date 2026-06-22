# Tool Use ve Agent'lar: Bir Modelin Yalnızca Konuşması Değil, Bir Kod Tabanı Üzerinde Eylemde Bulunması

Tek başına bir dil modeli yalnızca metin üretebilir. Test paketinizi çalıştıramaz, depoda grep yapamaz veya bir görev (ticket) açamaz — araçlarınıza canlı erişimi yoktur. **Tool use** (aynı zamanda **function calling** olarak da bilinir) bu boşluğu kapatır. Modele bir araç kümesi tanımlarsınız — her birinin bir adı, açıklaması ve kabul ettiği girdileri vardır. Model bir aracın yardımcı olacağına karar verdiğinde, hiçbir şeyi kendisi çalıştırmaz; yapılandırılmış bir **istek** çıktısı verir ("`run_tests`'i `path=tests/` ile çağır"). Uygulamanız gerçek komutu çalıştırır ve **sonucu** konuşmaya geri besler, model de bu yeni bilgiyle devam eder.

**Bir benzetme:** model, sizinle ekran paylaşımı üzerinden eşli (pair) çalışan keskin bir mühendistir. Klavyeye kendisi dokunamaz, ama "test paketini çalıştır ve hatayı bana oku" diyebilir. Siz (uygulamanız) komutu çalıştırır ve çıktıyı geri okursunuz. Model akıl yürütür; kodunuz çalıştırır.

**Agent döngüsü.** Tek bir tool çağrısı işe yarar, ama gerçek geliştirme görevleri birkaç adım gerektirir. Bir **agent** bir döngü çalıştırır: bir sonraki adımı **planla**, bir tool isteyerek **eyleme geç (act)**, dönen sonucu **gözlemle (observe)**, sonra tekrarla — her seferinde başka bir tool mu çağıracağına yoksa bitireceğine mi karar vererek. "`cart.py`'deki başarısız testi düzelt" görevi, yeşile dönmeden önce testleri çalıştırma, kodu arama, düzenleme ve yeniden çalıştırma arasında dönebilir.

**Bir agent tek bir çağrıyı ne zaman geçer.** Tek seferlik görevler için düz bir tek çağrı kullanın (bu PR'ı özetle). Görev **çok adımlıysa, taze duruma ihtiyaç duyuyorsa veya ara sonuçlara bağlıysa** bir agent'a başvurun — bir hatayı düzeltmek gibi; burada her düzenleme bir sonraki karardan önce yeniden test edilmelidir.

**Başarısızlık biçimleri.** Otonomi iki yönlü keser:

- **Kontrolsüz döngüler (runaway loops)** — model yakınsamadan testleri çalıştırıp düzenlemeye devam eder, zaman ve para harcar.
- **Yanlış tool** — araması gerekirken bir dosyayı düzenler veya gereksiz yere yıkıcı bir komut çağırır.
- **Yıkıcı eylemler** — korumasız bir `delete_branch` veya force-push tool'u gerçek altyapı üzerinde eylemde bulunur.
- **Birikerek büyüyen hatalar** — erken bir test hatasının yanlış okunması, sonraki her düzenlemeyi yanıltır.

**Korkuluklar (guardrails)** bunları yönetir: döngüleri durdurmak için bir **maksimum-iterasyon sınırı**, **zaman aşımları ve bütçeler**, push veya silme gibi riskli eylemler için **insan onayı** ve çalıştırmadan önce **tool girdilerini doğrulama**. Otonomi yalnızca sınırlandığında güçlüdür.

## Her rol bunu nasıl kullanır

- **Developer:** Tool şemalarını (test paketini çalıştır, kod tabanında ara, bir yama uygula) tanımlar ve bir kodlama agent'ını güvende tutan çalıştırma katmanını, döngü sınırlarını ve girdi doğrulamasını yazar.
- **Enterprise Architect:** İzin verilen-tool sınırlarını ve onay kapılarını mimari olarak belirler ve tek çağrı mı agent mı olacağına karar verir.
- **Security Engineer:** Agent'ın hangi sistemlere ve verilere ulaşabileceğini kapsamlandırır ve yıkıcı/geri-alınamaz eylemler için onay şart koşar.
- **Tester:** Kararsız testleri triaj eden bir agent kurar ve döngü sonlanmasını ve başarısızlık biçimlerini test eder.
- **Project Manager:** Bir özelliğin gerçekten agent'a mı yoksa daha ucuz bir tek çağrıya mı ihtiyacı olduğuna karar verir, otonomisini kapsamlandırır ve iterasyon başına maliyeti bütçeler.

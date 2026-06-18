# Uygulamalı Örnek: Governance Tek Seferlik Bir Geçit Olarak Ele Alındığında

**Kurulum.** Bir banka lansmanda AI'yi iyi yönetir. Kredi başvurularını değerlendirmeye yardımcı
olan bir satıcı aracı tam bir incelemeyi geçer: **AI kullanım kaydına** "yüksek" katmanda
girilir, bir sözleşme çıktı sahipliğini çözer ve bankanın verisi üzerinde eğitimi yasaklar, bias
testi çalıştırılır ve bir **onay geçidi** onu onaylar. Herkes yoluna devam eder.

**Sessizce ne değişti.** Sekiz ay sonra üç şey kaymıştır ve hiçbiri bir yeniden-inceleme
tetiklememiştir:

- Satıcı, farklı davranan daha yeni bir sürümle **modelini güncelledi**.
- Ekip ona, orijinal değerlendirmede olmayan **yeni veri alanları** (posta kodu ve başvuran yaşı)
  beslemeye başladı.
- **Yeni bir düzenleme**, otomatik kredi kararlarında açıklanabilirlik çıtasını yükseltti.

**Governance nerede başarısız oldu — ve nerede tuttu.**

- **Risk katmanlama (eski):** *Başarısız.* Kullanım bir kez katmanlandı ve asla yeniden
  katmanlanmadı, böylece eklenen yaş ve posta-kodu alanları — **bias**'ı kodlayabilen — asla
  yeniden değerlendirilmedi.
- **Sözleşme (kısmen tuttu):** Sahiplik ve eğitim-yok konusunda *tuttu*, ama sözleşme model
  güncellemesine karşı yeniden kontrol edilmedi, böylece yeni çıktı-yükümlülük maddeleri
  incelenmeden kaldı.
- **Audit günlükleme (tuttu):** *Tuttu.* Her karar günlüklendiği için, banka sonradan hangi model
  sürümünün ve hangi alanların her kararı yönlendirdiğini yeniden oluşturabildi — düzenleyici
  sorduğunda elzem.
- **Bias testi (eski):** *Başarısız.* Lansmanda bir kez çalıştı, yeni alanlar eklendikten sonra
  değil, böylece adaletsiz sonuçlara doğru bir kayma aylarca fark edilmeden kaldı.

**Bankanın benimsediği düzeltme.** Governance'ı **sürekli** kılarlar: kayıt girişi, herhangi bir
model güncellemesi veya veri-alanı değişikliğinde bir **yeniden-inceleme tetikleyicisi** alır;
bias testi tek seferlik değil, zamanlanır; ve bir süreç düzenleyici değişiklikleri takip eder ve
etkilenen kullanımları yeniden katmanlar. İnsan gözetimi nokta-denetimi yapılır, böylece sessizce
bir lastik damgaya dönüşemez.

**Ders.** Lansman kontrolleri doğruydu ama tek seferlik bir geçit olarak ele alındı. Gerçek
governance yaşayan bir programdır: katmanlar, sözleşmeler, bias testleri ve kayıt, model, veri ve
yasa değiştikçe yeniden ziyaret edilmelidir — aksi halde dünün onayı, bugünün incelenmemiş riskini
sessizce kapsar.

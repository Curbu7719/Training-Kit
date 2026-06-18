# Uygulamalı Örnek: Yeni Bir AI Müşteri-Destek Asistanını Yönetmek

**Durum.** Bir perakende şirketi, müşterilerin siparişleriyle ilgili sorularını yanıtlayan bir
AI asistanı başlatmak istiyor. Müşterinin adını, adresini ve sipariş geçmişini okuyacak ve
yanıtlar taslaklayacak. Bunlardan herhangi biri yayına çıkmadan önce governance süreci devreye
girer — projeyi engellemek için değil, her riski görünür kılmak ve bir sahip atamak için.

**Adım 1 — Kullanımı kaydet.** Ekip asistanı **AI kullanım kaydına (register)** ekler: ne
yaptığı, hangi veriye dokunduğu (müşteri PII'si ve sipariş kayıtları), hangi harici model
sağlayıcısını çağırdığı ve kişisel veri işlediği ve müşteriye dönük olduğu için "yüksek" bir
**risk katmanı**.

**Adım 2 — Veri gizliliğini ve sözleşmeyi kontrol et.** İş Analisti, müşteri PII'sinin gizlilik
yasası (GDPR/KVKK) kapsamında olduğunu doğrular. Hukuk, sağlayıcı sözleşmesini iki şey için
inceler: müşteri verisinin satıcının modelini **eğitmek için yeniden kullanılıp**
kullanılamayacağı ve **çıktının sahibinin kim olduğu**. Bir eğitim-yok maddesi müzakere eder ve
veri-yerleşimi kontrollerini açarlar.

**Adım 3 — Kabul edilebilir kullanım politikasını uygula.** Politika, ham müşteri
tanımlayıcılarının maskelenmeden şirketin sistemlerinden çıkmaması gerektiğini söyler, bu yüzden
mühendislik, prompt'lar gönderilmeden önce **PII redaksiyonu** ekler ve her prompt ile yanıtın
audit için kaydedilmesi için **günlükleme** ekler.

**Adım 4 — Gözetim ve bir onay geçidi ekle.** Yanıtlar müşteriye dönük olduğundan, ekip
iadelere veya şikâyetlere dokunan herhangi bir yanıt için bir **insan-döngüde** incelemesi ve
asistan canlıya geçmeden önce ürün sahibinin onayladığı bir **onay geçidi** ekler.

**Adım 5 — Bias ve güvenilirlik için test et.** QA, asistanın bir müşterinin adına veya
konumuna göre daha kötü yanıtlar vermediğini (**bias**) ve bir sipariş durumu uydurmak yerine
"bilmiyorum" dediğini (**güvenilirlik**) kontrol eder.

**Sonuç.** Asistan yayına çıkar, ama artık her riskin arkasında adı konmuş bir kontrol vardır:
register onu kaydeder, sözleşme sahipliği ve eğitimi çözer, redaksiyon ve günlükleme gizliliği
korur, insan gözetimi artı test güvenilirliği ve adaleti güvence altına alır. Governance, uçu
açık bir riski sahiplenilmiş, denetlenebilir kararlar dizisine dönüştürdü.

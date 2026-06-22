# İşlenmiş Örnek: Yeşil Bir Eval Puanı Sana Yalan Söylemesin

Eval takımın %90 gösterir, sen gönderirsin — sonra gerçek kullanıcılar, dataset'inin hiç içermediği %40'lık duruma çarpar. Hatalı bir eval, hiç olmamasından kötüdür, çünkü sana sahte güven verir. Derinlikte iş bir eval çalıştırmak değildir; ölçümü *güvenilir* kılmaktır. İşte bu, yalan söyleyen bir sayıyla göndermekten seni nasıl korur.

**Dataset'in yalan söyleyebilir.** Yalnızca kolay, mutlu-yol girdilerinden bir golden set, özellik asıl önemli yerde başarısızken yüksek puan bildirir. *Hamle:* onu katmanlandır (stratify) — zor durumları, nadir kategorileri, düşmanca girdileri ve geçmişteki her production hatasını bilerek kapsa. *Bu gününü neden kolaylaştırır?* Her hata kalıcı bir eval durumuna dönüşür, böylece asla sessizce geri gelemez — takımın, her hata düzeltmesine bir başarısız test eklemek gibi diş kazanır.

**Judge'ın yalan söyleyebilir.** Bir LLM judge'ın önyargıları vardır: ilk seçeneği kayırır, uzun cevapları yüksek puanlar ve kendi model ailesini tercih eder. *Hamle:* judge puanlarını bir insan değerlendirme örneğiyle doğrula, seçenek sırasını rastgeleleştir ve somut bir rubrik kullan. *Neden uğraşmalı?* Judge-insan uyumu düşükse, judge'ın sayıları gürültüdür ve CI kapın anlamsızdır — rastgeleliğe göre kapı koyuyor olursun.

**Toplam (aggregate) yalan söyleyebilir.** Genel bir %90, %40'ta oturan iş-kritik bir segmenti gizleyebilir. *Hamle:* tek bir manşet sayıya güvenmek yerine puanları segmente göre dilimle. *Eval'i neden böyle kullan?* Çünkü ortalama, tam da kritik bir başarısızlığın saklanmaya gittiği yerdir.

**Bir puan değişimi gürültü olabilir.** Çıktılar belirsizdir, o yüzden küçük bir sallanma gerçek bir regresyon değil, koşudan-koşuya varyans olabilir. *Bu seni neden kurtarır?* Hayalet düşüşlerin peşine düşmeyi bırakırsın — ve sadece şanstan ibaret bir "kazanımı" göndermezsin.

**Özet:** derinlikte, *test edilen şey eval'in kendisidir.* Dataset'i katmanlandır, judge'ı doğrula, toplamı dilimle ve gürültüyü sinyalden ayır — böylece sayı "gönder" dediğinde, doğruyu söylüyor olur.

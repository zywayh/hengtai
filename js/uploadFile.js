/**
 * Created by zywayh on 2017/3/30.
 */

var client = new OSS.Wrapper({
    region: 'oss-cn-qingdao',
    accessKeyId: 'LTAIe0GQ8uYkkR1h',
    accessKeySecret: 'pcA7LOi2mdONooi5fIUos0USNKvk3a',
    bucket: 'lvdianwechatwatch'
});

function uUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);

    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

/**
 *
 * @param file                      //�ļ�
 * @param element                   //������element�������������
 * @param success_function          //�ɹ��ǵ��÷���  (url)
 */
function file_upload(file, element, success_function) {
    var storeAs = uUID() + file.name.substring(file.name.lastIndexOf("."));
    client.multipartUpload(storeAs, file).then(function (result) {
        console.log(result)
        var filePath = "http://lvdianwechatwatch.oss-cn-qingdao.aliyuncs.com/"+result.name
        success_function(element, filePath);
    }).catch(function (err) {
        console.log(err);
        alert("�ϴ�ʧ��");
    });
}

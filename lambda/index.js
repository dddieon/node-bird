const AWS = require("aws-sdk");
const sharp = require("sharp");

const s3 = new AWS.S3();
// 람다가 AWS의 사용자 정보를 불러오기 때문에 시크릿키 인증 필요없음

exports.handlerResize = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name; // 저장할 버킷명
  const Key = decodeURIComponent(event.Records[0].s3.object.key); // 저장할 경로 및 파일명 - [한글대응]
  console.log(Bucket, Key, event.Records, "레코드");
  const filename = Key.split("/")[Key.split("/").length - 1]; // 저장할 파일명
  const ext = Key.split(".")[Key.split(".").length - 1].toLowerCase(); // 저장할 확장자명 - [대문자 대응]
  const requiredFormat = ext === "jpg" ? "jpeg" : ext; // jpg to jpeg
  try {
    const s3Object = await s3.getObject({ Bucket, Key }).promise();
    console.log("original", s3Object.Body.length, "용량");
    const resizedImage = await sharp(s3Object.Body).resize(400, 400, {fit: 'inside'}).toFormat(requiredFormat).toBuffer();
    await s3.putObject({
      Bucket,
      Key: `thumb/${filename}`,
      Body: resizedImage
    });
    console.log('put', resizedImage.length, "썸네일 용량");
    return callback(null, `thumb/${filename}`);
  } catch(e) {
    console.error(e);
    return callback(e);
  }
}
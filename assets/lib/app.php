<?php
$dataSelect = $_GET['data'];
$forCache = time();
$cid = $_GET['cid'];
// switch($dataSelect){
// 	case "site":
// 	break;
// }
	$url = "https://api.fulcrumapp.com/api/v2/query?format=geojson&token=74e22f264973ee7867960d09676731411a05bbae0006392eb298045a17027f292cdc62bf478d3277&q=SELECT%0A_record_id%2C%0A_geometry%2C%0A_latitude%2C%0A_longitude%2C%0Aname%2C%0Acounty%2C%0Acategory%2C%0Asource%20AS%20agency_source%2C%0A%27%3Ca%20href%3D%22%27%20%7C%7C%20link%20%7C%7C%20%27%22%20target%3D%22_blank%22%3EResource%20Link%3C%2Fa%3E%27%20AS%20link%0AFROM%20%22Harvey%20Toxic%20Sites%22%20WHERE%20now()%3Dnow()%3B";

# Your API Key goes here...
$api_key = '78e02205699f07ad74d80407a14c32a1056f81a0864cfafd3ec656b8dd54459b9b8d58cfb6757ec3';
# CURL options
$ch = curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
     'X-ApiToken: ' . $api_key,
     'Cache-Control: no-cache',
     'Content-type: application/json'
));
curl_setopt($ch, CURLOPT_URL, $url);

$result=curl_exec($ch);
curl_close($ch);
echo $result;
?>
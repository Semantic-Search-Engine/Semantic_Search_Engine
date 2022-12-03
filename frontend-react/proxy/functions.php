<?php

/**
 * @param $url
 * @param $data
 * @param $headers
 * @return mixed
 */
function sendPostRequest($url,$data = '', array $headers = []){
    $disableSslVerify = false;

    if(is_array($data)){
        $data = json_encode($data);
    }

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    if($disableSslVerify){
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    }

    if(count($headers)){
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }

    $result = curl_exec($ch);
    return $result;
}
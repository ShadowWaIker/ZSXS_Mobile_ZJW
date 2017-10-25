<?php 
/** Powerd by RebetaStudio 
 * 
 *  http://www.rebeta.cn
 * 
 * 20170629
 * 
 */

//本地数据库账户及配置
define ("MySqlUSER","数据库用户名");
define ("MySqlPWD","数据库密码");
define ("MySqlDSN","mysql:host=数据库主机IP地址;port=数据库端口;dbname=数据库名;charset=utf8");

//关闭错误回显
error_reporting(0);
//设置时区为+8
date_default_timezone_set('PRC');

//设置字符为UTF8
header("Content-Type: text/html;charset=utf-8");

$type = $_POST['type'];
if (preg_match("/[\'.,:;*?~`!@#$%^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/",$type)) {
    die('非法参数！');
}

//连接数据库
try{
    //实例化mysqlpdo，执行这里时如果出错会被catch
    $pdo = new PDO(MySqlDSN,MySqlUSER,MySqlPWD);
} catch (Exception $e){
        $err = $e->getMessage();
        die($err);
}

if($type == 'progress'){
    $sql = "select content from manager where id='1'";
    $rs = $pdo->query($sql);
    $info = $rs->fetch(PDO::FETCH_ASSOC);
    $content = $info[content];
    print $content;
} elseif($type == 'scoreOnload'){
    $sql = "SELECT DISTINCT(nf) FROM fsx WHERE klmc <> '' AND nf > 2015";
    $rs = $pdo->query($sql);
    $info = $rs->fetchall(PDO::FETCH_ASSOC);
    /*$nf = array('2016');*/
    $nf = array();
    foreach ($info as $res){
        array_push($nf,$res[nf]);
    
    }
    $content = json_encode(array("nf"=>$nf));
    print $content;
} elseif($type == 'scoreLoadSF'){
    $nf = $_POST['nf'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/",$nf)) {
        die('非法参数！');
    }
    $sql = "SELECT DISTINCT(sf),sfdm FROM fsx WHERE klmc <> '' and nf='$nf'";
    $rs = $pdo->query($sql);
    $sfres = $rs->fetchall(PDO::FETCH_ASSOC);
    $content = json_encode(array("sfres"=>$sfres));
    print $content;
} elseif($type == 'scoreLoadLB'){
    $sf = $_POST['sf'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/",$sf)) {
        die('非法参数！');
    }
    $nf = $_POST['nf'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/",$nf)) {
        die('非法参数！');
    }
    $sql = "SELECT DISTINCT(klmc) FROM fsx WHERE sfdm = '$sf' AND nf like '%$nf%' AND klmc <> ''";
    $rs = $pdo->query($sql);
    $info = $rs->fetchall(PDO::FETCH_ASSOC);
    $klmc = array();
    foreach ($info as $res){
        array_push($klmc,$res[klmc]);
    }
    $content = json_encode($klmc);
    print $content;
} elseif($type == 'scoreLoadRes'){
    $sf = $_POST['sf'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/",$sf)) {
        die('非法参数！');
    }
    $nf = $_POST['nf'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/",$nf)) {
        die('非法参数！');
    }
    $klmc = $_POST['klmc'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=<>{}]|\]|\[|\/|\\\|\"|\|/",$klmc)) {
        die('非法参数！');
    }
    
    $sql = "SELECT DISTINCT(kslx) FROM fsx WHERE sfdm = '$sf' AND nf = '$nf' AND klmc like '$klmc' AND klmc <> ''";
    $rs = $pdo->query($sql);
    $res = $rs->fetchall(PDO::FETCH_ASSOC);
    $content = array();
    foreach ($res as $result){
        $sql = "SELECT * FROM fsx WHERE sfdm = '$sf' AND nf = '$nf' AND klmc like '$klmc' AND kslx = '$result[kslx]' AND klmc <> ''";
        $rs = $pdo->query($sql);
        $res = $rs->fetchall(PDO::FETCH_ASSOC);
        array_push($content,$res);
    }
    $content = json_encode($content);
    print $content;
} elseif($type == 'scorePopup'){
    $sfdm = $_POST['sfdm'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/",$sfdm)) {
        die('非法参数！');
    }
    $nf = $_POST['nf'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/",$nf)) {
        die('非法参数！');
    }
    $lb = $_POST['lb'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=<>{}]|\]|\[|\/|\\\|\"|\|/",$lb)) {
        die('非法参数！');
    }
    $klmc = $_POST['klmc'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=<>{}]|\]|\[|\/|\\\|\"|\|/",$klmc)) {
        die('非法参数！');
    }
    $zymc = $_POST['zymc'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=<>{}]|\]|\[|\/|\\\|\"|\|/",$zymc)) {
        die('非法参数！');
    }
    $sql = "SELECT * FROM fsx WHERE nf='$nf' AND sfdm='$sfdm' AND lb='$lb' AND klmc  ='$klmc' AND zymc='$zymc'";
    $rs = $pdo->query($sql);
    $res = $rs->fetch(PDO::FETCH_ASSOC);
    $content = json_encode($res);
    print $content;
} elseif($type == 'planOnload'){
    $sql = "SELECT DISTINCT(NF) FROM zsjh";
    $rs = $pdo->query($sql);
    $info = $rs->fetchall(PDO::FETCH_ASSOC);
    $nf = array();
    foreach ($info as $res){
        array_push($nf,$res[NF]);
    
    }
    $sql = "SELECT DISTINCT(SYSSMC),SYSSDM FROM zsjh";
    $rs = $pdo->query($sql);
    $sfres = $rs->fetchall(PDO::FETCH_ASSOC);
    $content = json_encode(array("nf"=>$nf,"sfres"=>$sfres));
    print $content;
} elseif($type == 'planLoadLB'){
    $sf = $_POST['sf'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/",$sf)) {
        die('非法参数！');
    }
    $nf = $_POST['nf'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/",$nf)) {
        die('非法参数！');
    }
    $sql = "SELECT DISTINCT(klmc),kldm FROM zsjh WHERE syssdm = '$sf' AND nf = '$nf'";
    $rs = $pdo->query($sql);
    $klmc = $rs->fetchall(PDO::FETCH_ASSOC);/*
    $klmc = array();
    foreach ($info as $res){
        array_push($klmc,$res[klmc]);
        
    }*/
    $content = json_encode($klmc);
    print $content;
} elseif($type == 'planLoadRes'){
    $sf = $_POST['sf'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/",$sf)) {
        die('非法参数！');
    }
    $nf = $_POST['nf'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/",$nf)) {
        die('非法参数！');
    }
    $kldm = $_POST['kldm'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=<>{}]|\]|\[|\/|\\\|\"|\|/",$kldm)) {
        die('非法参数！');
    }
    $sql = "SELECT DISTINCT(PCMC) FROM zsjh WHERE SYSSDM = '$sf' AND KLDM like '$kldm' AND NF = '$nf'";
    $rs = $pdo->query($sql);
    $res = $rs->fetchall(PDO::FETCH_ASSOC);
    $content = array();
    foreach ($res as $result){
        $sql = "SELECT ZSZYMC,JHID,ZYLBMC,ZSJHS,PCDM,PCMC,JHXZMC FROM zsjh WHERE SYSSDM = '$sf' AND KLDM like '$kldm' AND NF = '$nf' AND PCMC = '$result[PCMC]'";
        $rs = $pdo->query($sql);
        $res = $rs->fetchall(PDO::FETCH_ASSOC);
        array_push($content,$res);
    }
    $content = json_encode($content);
    print $content;
} elseif($type == 'planPopup'){
    $jhid = $_POST['JHID'];
    if (preg_match("/[\'.,:;*?~`!@#$^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/",$jhid)) {
        die('非法参数！');
    }
    $sql = "SELECT * FROM zsjh WHERE JHID = '$jhid'";
    $rs = $pdo->query($sql);
    $res = $rs->fetch(PDO::FETCH_ASSOC);
    $content = json_encode($res);
    print $content;
}

?>
<?php 
/** Powerd by RebetaStudio 
 * 
 *  http://www.rebeta.cn
 * 
 * 20170704
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

if($type == "zc"){
    //招生章程频道
    $sql = "SELECT b.content_id,b.title,b.release_date,b.description FROM jc_content a,jc_content_ext b WHERE a.channel_id = '159' AND a.content_id = b.content_id ORDER BY b.content_id DESC";
    $rs = $pdo->query($sql);
    $content = $rs->fetch(PDO::FETCH_ASSOC);
    $sql = "SELECT views,content_like FROM jc_content_count WHERE content_id = '$content[content_id]'";
    $rs = $pdo->query($sql);
    $info = $rs->fetch(PDO::FETCH_ASSOC);
    //arr_push(res,$info);
    $content[views] = $info[views];
    $content[content_like] = $info[content_like];
    print json_encode($content);
} elseif($type == "kx"){
    //招生快讯频道
    $sql = "SELECT b.content_id,b.title,b.release_date,b.description FROM jc_content a,jc_content_ext b WHERE (a.channel_id = '160' OR a.channel_id = '171') AND a.content_id = b.content_id AND b.link IS NULL ORDER BY b.content_id DESC";
    $rs = $pdo->query($sql);
    $content = $rs->fetchall(PDO::FETCH_ASSOC);
    foreach ($content as &$res){
        $sql = "SELECT views,content_like FROM jc_content_count WHERE content_id = '$res[content_id]'";
        $rs = $pdo->query($sql);
        $info = $rs->fetch(PDO::FETCH_ASSOC);
        //arr_push(res,$info);
        $res[views] = $info[views];
        $res[content_like] = $info[content_like];
    }
    print json_encode($content);
} elseif($type == "like"){
    //点赞
    $id = $_POST['id'];
    if (preg_match("/[\'.,:;*?~`!@#$%^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/",$id)) {
        $content[status] = 'fail';
        $content[res] = '非法参数！';
    } else {
        $sql = "SELECT content_like FROM jc_content_count WHERE content_id = '$id'";
        $rs = $pdo->query($sql);
        $info = $rs->fetch(PDO::FETCH_ASSOC);
        $num = $info[content_like]+1;
        $sql = "UPDATE jc_content_count SET content_like = '$num' WHERE content_id = '$id'";
        $rs = $pdo->exec($sql);
        if(!$rs){
            $content[status] = 'fail';
            $content[res] = '提交数据失败！';
        }else{
            $content[status] = 'success';
            $content[res] = '提交数据成功！';
        }
    }
    print json_encode($content);
} elseif($type == "loadContent"){
    //点赞
    $id = $_POST['id'];
    if (preg_match("/[\'.,:;*?~`!@#$%^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/",$id)) {
        $content[status] = 'fail';
        $content[res] = '非法参数！';
    } else {
        $sql = "SELECT views,content_like FROM jc_content_count WHERE content_id = '$id'";
        $rs1 = $pdo->query($sql);
        $info = $rs1->fetch(PDO::FETCH_ASSOC);
        $sql = "SELECT title,release_date FROM jc_content_ext WHERE content_id = '$id'";
        $rs2 = $pdo->query($sql);
        $info += $rs2->fetch(PDO::FETCH_ASSOC);
        $sql = "SELECT txt FROM jc_content_txt WHERE content_id = '$id'";
        $rs3 = $pdo->query($sql);
        $info += $rs3->fetch(PDO::FETCH_ASSOC);
        $info[txt] = str_replace("/u/cms/","http://zs.xztc.edu.cn/u/cms/","$info[txt]");
        if(!$rs1 || !$rs2 || !$rs3){
            $content[status] = 'fail';
            $content[res] = '提交数据失败！';
        }else{
            $content[status] = 'success';
            $content[res] = '提交数据成功！';
            $content[info] = $info;
            $sql = "UPDATE jc_content_count SET views = '".($info[views] + 1)."' WHERE content_id = '$id'";
            //$content[res] = $sql;
            $rs = $pdo->exec($sql);
        }
    }
    print json_encode($content);
}
?>
<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;


require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';



// Получите данные из формы
$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];
$item = $_POST['item'];


// Создайте экземпляр класса PHPMailer
$mail = new PHPMailer(true);

try {
    // Настройки сервера SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com'; // Замените на адрес вашего SMTP-сервера
    $mail->SMTPAuth = true;
    $mail->Username = 'aleksey.iv98@gmail.com'; // Замените на ваше имя пользователя SMTP
    $mail->Password = 'igrm tpkm tqiw jjoo'; // Замените на ваш пароль SMTP
    $mail->SMTPSecure = 'ssl'; // Используйте 'tls' или 'ssl', в зависимости от настроек вашего сервера
    $mail->Port = 465; // Порт SMTP, обычно 587 для TLS и 465 для SSL

    // Настройки отправителя и получателя
    $mail->setFrom('aleksey.iv98@gmail.com', 'Tesa'); // Замените на вашу почту и имя
    $mail->addAddress('gluhonemoy26@gmail.com', 'Recipient Name'); // Замените на почту и имя получателя
    $mail->CharSet = 'UTF-8';
    // Установите тему и текст письма
    $mail->Subject = 'Сообщение с веб-формы';
    $mail->Body = "Обладнання: $item\nИмя: $name\nEmail: $email\n\Повідомлення: $message";

    // Отправка письма
    $mail->send();
 // Вернуть JSON-ответ об успешной отправке
 $response = ['message' => "Дякуємо за заявку ми зв'яжемося з вами найближчим часом"];
 header('Content-Type: application/json');
 echo json_encode($response);
} catch (Exception $e) {
 // Вернуть JSON-ответ об ошибке
 $response = ['error' => "Лист не може бути надісланий. Помилка: {$mail->ErrorInfo}"];
 header('Content-Type: application/json');
 echo json_encode($response);
}
?>

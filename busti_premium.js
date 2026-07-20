let req = $request.body || "";
let res = $response.body || "";

if (res) {
    // Если это запрос статуса подписки
    if (req.includes("subscription_status_get")) {
        // Выводим ответ прямо в уведомление на экране!
        $notification.post("Spy: Subscription", "Ответ сервера:", res.substring(0, 500));
    } 
    // Если это профиль юзера
    else if (req.includes("user_get")) {
        $notification.post("Spy: User", "Ответ сервера:", res.substring(0, 500));
    }
    
    // Ничего не меняем, отдаем оригинальный ответ, чтобы не сломать Dart
    $done({ body: res });
} else {
    $done({});
}
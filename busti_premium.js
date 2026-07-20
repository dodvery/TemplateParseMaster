let req = $request.body || "";
let res = $response.body || "";

if (res) {
    try {
        let obj = JSON.parse(res);
        
        if (obj && obj.result !== undefined) {
            // 1. Если результат - объект (например, профиль из user_get)
            if (typeof obj.result === 'object' && obj.result !== null && !Array.isArray(obj.result)) {
                
                // Мягко инжектим булевы флаги премиума (Dart обычно игнорирует неизвестные ключи, но не падает)
                obj.result.is_premium = true;
                obj.result.premium = true;
                obj.result.has_subscription = true;
                
                // Строковые статусы меняем ТОЛЬКО если они уже существуют в ответе
                if ('status' in obj.result) obj.result.status = "active";
                if ('subscription_status' in obj.result) obj.result.subscription_status = "active";
                if ('is_active' in obj.result) obj.result.is_active = true;
                
            } 
            // 2. Если сервер возвращает просто { "result": false }, и это точно запрос подписки
            else if (typeof obj.result === 'boolean' && req.includes("subscription_status_get")) {
                obj.result = true;
            }
        }
        
        // Возвращаем модифицированный ответ
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        // Если пришел не JSON (или WebSocket), отдаем оригинал без изменений
        $done({ body: res });
    }
} else {
    $done({});
}
if (typeof $response !== 'undefined' && $response.body) {
    try {
        let body = $response.body;
        // Если это WebSocket или сложный JSON, пробуем распарсить
        let obj = JSON.parse(body);

        // Функция для рекурсивной замены всего, что похоже на статус
        function forcePremium(target) {
            if (typeof target !== 'object' || target === null) return;
            
            for (let key in target) {
                // Принудительно ставим премиум, если ключ намекает на это
                let k = key.toLowerCase();
                if (k.includes('premium') || k.includes('sub') || k === 'is_active' || k === 'status') {
                    if (typeof target[key] === 'boolean') target[key] = true;
                    if (typeof target[key] === 'string') target[key] = "active";
                    if (typeof target[key] === 'number') target[key] = 1;
                }
                // Идем глубже
                forcePremium(target[key]);
            }
        }

        // Применяем ко всему объекту
        forcePremium(obj);

        // Дополнительная инъекция в корень, если API вернет простую структуру
        obj.is_premium = true;
        obj.premium = true;
        obj.subscription_status = "active";

        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}

if (typeof $response !== 'undefined' && $response.body) {
    let body = $response.body;
    let req = $request.body || "";
    
    // Перехватываем только метод проверки подписки
    if (req.includes('"subscription_status_get"')) {
        try {
            let obj = JSON.parse(body);

            // Рекурсивная функция для поиска и замены капибариных флагов
            function upgradeToPremium(target) {
                for (let key in target) {
                    if (target.hasOwnProperty(key)) {
                        // Если значение - вложенный объект, идем глубже
                        if (typeof target[key] === 'object' && target[key] !== null) {
                            upgradeToPremium(target[key]);
                        } else {
                            // Ищем ключи, связанные с подпиской, и выдаем премиум
                            let k = key.toLowerCase();
                            if (k === 'is_premium' || k === 'has_subscription' || k === 'premium' || k === 'is_active') {
                                if (typeof target[key] === 'boolean') target[key] = true;
                                if (typeof target[key] === 'string') target[key] = "true";
                                if (typeof target[key] === 'number') target[key] = 1;
                            }
                            if (k === 'status' || k === 'subscription_status') {
                                target[key] = 'active';
                            }
                        }
                    }
                }
            }

            // Применяем магию к результату
            if (obj.result) {
                upgradeToPremium(obj.result);
            }

            $done({ body: JSON.stringify(obj) });
        } catch (e) {
            $done({});
        }
    } else {
        // Отдаем как есть, если метод другой
        $done({});
    }
} else {
    $done({});
}

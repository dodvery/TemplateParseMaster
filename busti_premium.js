if (typeof $response !== 'undefined' && $response.body) {
    try {
        let obj = JSON.parse($response.body);

        // JSON-RPC ответ всегда содержит поле result
        if (obj.result !== undefined) {
            
            // Если бекенд возвращает просто boolean (например, result: false)
            if (typeof obj.result === 'boolean') {
                obj.result = true;
            } 
            // Если бекенд возвращает объект (user_get или subscription_status_get)
            else if (typeof obj.result === 'object' && obj.result !== null && !Array.isArray(obj.result)) {
                
                // 1. Принудительно инжектим капибариные читы прямо в корень ответа
                obj.result.is_premium = true;
                obj.result.premium = true;
                obj.result.has_subscription = true;
                obj.result.is_active = true;
                obj.result.status = "active";
                obj.result.subscription_status = "active";

                // 2. Рекурсивно добиваем любые спрятанные флаги внутри
                function upgrade(target) {
                    for (let key in target) {
                        if (target.hasOwnProperty(key)) {
                            if (typeof target[key] === 'object' && target[key] !== null) {
                                upgrade(target[key]);
                            } else {
                                let k = key.toLowerCase();
                                if (k.includes('premium') || k.includes('sub') || k === 'is_active') {
                                    if (typeof target[key] === 'boolean') target[key] = true;
                                    if (typeof target[key] === 'string' && target[key] === 'inactive') target[key] = 'active';
                                    if (typeof target[key] === 'number' && target[key] === 0) target[key] = 1;
                                }
                            }
                        }
                    }
                }
                upgrade(obj.result);
            }
        }

        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}

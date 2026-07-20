let body = $response.body;

if (body) {
    // Мягкая регулярная замена. Меняем только значения, не ломая схему данных Dart.
    body = body.replace(/"is_premium"\s*:\s*false/gi, '"is_premium":true')
               .replace(/"premium"\s*:\s*false/gi, '"premium":true')
               .replace(/"has_subscription"\s*:\s*false/gi, '"has_subscription":true')
               .replace(/"is_active"\s*:\s*false/gi, '"is_active":true')
               .replace(/"status"\s*:\s*"inactive"/gi, '"status":"active"')
               .replace(/"status"\s*:\s*"none"/gi, '"status":"active"')
               .replace(/"status"\s*:\s*0/gi, '"status":1');

    // Если метод subscription_status_get возвращает просто {"result": false} или {"result": 0}
    body = body.replace(/"result"\s*:\s*false/gi, '"result":true')
               .replace(/"result"\s*:\s*0/gi, '"result":1');
               
    $done({ body: body });
} else {
    $done({});
}
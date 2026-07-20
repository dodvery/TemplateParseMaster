let req = $request.body || "";
let res = $response.body || "";

if (res) {
    // 1. Шпионим и пишем оригинальный JSON в лог-файл
    if (req.includes("user_get") || req.includes("subscription")) {
        console.log("=== CAPYBARA INTERCEPT START ===");
        console.log(res);
        console.log("=== CAPYBARA INTERCEPT END ===");
        try {
            $notification.post("Capybara MITM", "JSON сервера пойман!", "Ищи метку CAPYBARA INTERCEPT в логах");
        } catch(e) {}
    }

    // 2. Ковровая бомбардировка всеми мыслимыми флагами
    let modified = res.replace(/"(is_premium|premium|has_subscription|is_active|pro|is_pro|is_sub|subscription_active|active|is_paid)"\s*:\s*(false|0|null)/gi, '"$1":true')
                      .replace(/"(status|subscription_status|sub_status|premium_status|state)"\s*:\s*"(inactive|none|free|basic|null|0)"/gi, '"$1":"active"');

    $done({ body: modified });
} else {
    $done({});
}
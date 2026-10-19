<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dokumentasi API (OpenAPI / Swagger) — Inventaris Perangkat TI Diskominfo</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin: 0;
            background: #fafafa;
            font-family: sans-serif;
        }
        .topbar {
            display: none;
        }
        .swagger-header {
            background: #1e3a8a;
            color: #ffffff;
            padding: 16px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .swagger-header h1 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }
        .swagger-header p {
            margin: 4px 0 0;
            font-size: 12px;
            color: #93c5fd;
        }
        .swagger-header a {
            background: #ffffff;
            color: #1e3a8a;
            text-decoration: none;
            padding: 8px 14px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
        }
        .swagger-header a:hover {
            background: #f1f5f9;
        }
    </style>
</head>
<body>
    <div class="swagger-header">
        <div>
            <h1>Dokumentasi RESTful API (Swagger / OpenAPI 3.0)</h1>
            <p>Sistem Inventaris Perangkat TI — Diskominfo Pemerintah Kota Probolinggo</p>
        </div>
        <a href="/">← Kembali ke Aplikasi</a>
    </div>

    <div id="swagger-ui"></div>

    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            window.ui = SwaggerUIBundle({
                url: "/openapi.json",
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
            });
        };
    </script>
</body>
</html>

export function movieAvailableTemplate(
  username: string,
  movieTitle: string,
): string {
  const url = process.env.CLIENT_URL;
  const logoUrl = process.env.LOGO_URL;

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Novo filme Disponível - Cubos Movies</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #8E4EC6;
            color: #333;
            margin: 0;
            padding: 0;
            line-height: 1.6;
          }

          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          h1 {
            color: #8E4EC6;
            text-align: center;
          }

          p {
            margin: 20px 0;
            text-align: center;
          }

          .btn {
            display: inline-block;
            padding: 12px 24px;
            margin: 20px 0;
            font-size: 16px;
            color: #fff;
            background: #8E4EC6;
            text-decoration: none;
            border-radius: 8px;
            text-align: center;
          }

          .footer {
            margin-top: 30px;
            font-size: 12px;
            text-align: center;
            color: #777;
          }

          .logo {
            display: block;
            margin: 0 auto 20px;
            max-width: 200px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <a href="${url}">
            <img src="${logoUrl}" alt="Cubos Movies" class="logo" width="200" height="auto" style="display: block; border: 0;">
          </a>
          <h1>Novo filme Disponível - Cubos Movies</h1>
          <p>Olá, ${username}!</p>
          <p>Temos uma ótima notícia: o filme "${movieTitle}" está agora disponível em cartaz!</p>
          <p>Prepare a pipoca e aproveite a sessão!</p>
          <p><a href="${url}" class="btn">Acessar Minha Conta</a></p>
          <p>Se precisar de ajuda, estamos à disposição!</p>
          <div class="footer">
            © 2024 WRS Tecnologia. Todos os direitos reservados.
          </div>
        </div>
      </body>
    </html>
  `;
}

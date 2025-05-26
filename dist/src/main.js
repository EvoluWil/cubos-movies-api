"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const bodyParser = require("body-parser");
const app_module_1 = require("./app.module");
const auth_guard_1 = require("./providers/auth/auth.guard");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(bodyParser.json({ limit: '4.5mb' }));
    app.use(bodyParser.urlencoded({ limit: '4.5mb', extended: true }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
        origin: [process.env.CLIENT_URL],
        allowedHeaders: [
            'X-Requested-With',
            'X-HTTP-Method-Override',
            'Content-Type',
            'Accept',
            'Observe',
            'X-Authorization',
            'X-Token-Auth',
            'Authorization',
        ],
        methods: 'GET, POST, PUT, DELETE',
    });
    const reflector = app.get(core_1.Reflector);
    const jwtService = app.get(jwt_1.JwtService);
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    app.setGlobalPrefix('api');
    app.useGlobalGuards(new auth_guard_1.AuthGuard(jwtService, reflector));
    await app.listen(process.env.PORT || 3333);
}
void bootstrap();
//# sourceMappingURL=main.js.map
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const PORT = `${process.env.PORT}` || 5000;
	const app = await NestFactory.create(AppModule)

	app.use(cookieParser())
	app.enableCors({
		origin: [process.env.CLIENT_URL],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})
	await app.listen(PORT, () => console.log(`Server started on port=${PORT}`))
}
bootstrap().catch(err => {
	console.error('Error during application bootstrap:', err)
})
